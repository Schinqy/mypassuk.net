import { Router } from "express";
import multer from "multer";
import { db, conversations, messages, eq, desc } from "@workspace/db";
import { openai } from "@workspace/integrations-openai-ai-server";
import { SendOpenaiMessageBody, CreateOpenaiConversationBody } from "@workspace/api-zod";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

const SUPPORTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const SUPPORTED_TEXT_TYPES = ["text/plain", "text/markdown", "text/csv", "application/json"];

async function extractText(buffer: Buffer, mimetype: string, originalname: string): Promise<{ text: string; fileType: string }> {
  if (mimetype === "application/pdf") {
    const pdf = await import("pdf-parse");
    const pdfParse = (pdf as any).default || pdf;
    const data = await pdfParse(buffer);
    return { text: data.text.trim(), fileType: "PDF" };
  }

  if (mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
    const mammoth = await import("mammoth");
    const result = await mammoth.extractRawText({ buffer });
    return { text: result.value.trim(), fileType: "Word document" };
  }

  if (SUPPORTED_TEXT_TYPES.some(t => mimetype.startsWith(t)) || originalname.match(/\.(txt|md|csv|json)$/i)) {
    return { text: buffer.toString("utf-8").trim(), fileType: "text file" };
  }

  throw new Error("unsupported");
}

router.get("/openai/conversations", async (_req, res) => {
  const all = await db.select().from(conversations).orderBy(desc(conversations.createdAt));
  res.json(all);
});

router.post("/openai/conversations", async (req, res) => {
  const body = CreateOpenaiConversationBody.parse(req.body);
  const [created] = await db.insert(conversations).values({ title: body.title }).returning();
  res.status(201).json(created);
});

router.get("/openai/conversations/:id", async (req, res) => {
  const id = Number(req.params.id);
  const [conv] = await db.select().from(conversations).where(eq(conversations.id, id));
  if (!conv) return res.status(404).json({ error: "Not found" });
  const msgs = await db.select().from(messages).where(eq(messages.conversationId, id)).orderBy(messages.createdAt);
  return res.json({ ...conv, messages: msgs });
});

router.delete("/openai/conversations/:id", async (req, res) => {
  const id = Number(req.params.id);
  const [conv] = await db.select().from(conversations).where(eq(conversations.id, id));
  if (!conv) return res.status(404).json({ error: "Not found" });
  await db.delete(messages).where(eq(messages.conversationId, id));
  await db.delete(conversations).where(eq(conversations.id, id));
  return res.status(204).end();
});

router.get("/openai/conversations/:id/messages", async (req, res) => {
  const id = Number(req.params.id);
  const msgs = await db.select().from(messages).where(eq(messages.conversationId, id)).orderBy(messages.createdAt);
  res.json(msgs);
});

// File upload — extract text and inject into conversation context
router.post("/openai/conversations/:id/upload", upload.single("file"), async (req, res) => {
  const id = Number(req.params.id);
  const [conv] = await db.select().from(conversations).where(eq(conversations.id, id));
  if (!conv) return res.status(404).json({ error: "Not found" });

  const file = req.file;
  if (!file) return res.status(400).json({ error: "No file uploaded" });

  const { originalname, mimetype, buffer } = file;
  let extractedText = "";
  let fileType = "document";

  try {
    if (SUPPORTED_IMAGE_TYPES.includes(mimetype)) {
      // Use OpenAI vision to describe / transcribe the image
      const base64 = buffer.toString("base64");
      const response = await openai.chat.completions.create({
        model: "gpt-5.2",
        messages: [{
          role: "user",
          content: [
            {
              type: "text",
              text: "Describe this image in detail. If it contains text, equations, diagrams, tables, or exam content, transcribe and explain everything fully.",
            },
            {
              type: "image_url",
              image_url: { url: `data:${mimetype};base64,${base64}` },
            },
          ],
        }],
        max_completion_tokens: 2000,
      });
      extractedText = response.choices[0]?.message?.content ?? "";
      fileType = "image";
    } else {
      const result = await extractText(buffer, mimetype, originalname);
      extractedText = result.text;
      fileType = result.fileType;
    }
  } catch (err: any) {
    if (err.message === "unsupported") {
      return res.status(400).json({ error: "Unsupported file type. Please upload a PDF, Word document, image (JPG/PNG/WebP), or text file." });
    }
    return res.status(500).json({ error: "Failed to process file. Please try again." });
  }

  // Limit context size to prevent token overflow
  const contextText = extractedText.slice(0, 16000);

  const systemContent = `[DOCUMENT] The user has shared a ${fileType} titled "${originalname}". Full content below — use this to answer their questions:\n\n${contextText}`;

  await db.insert(messages).values({
    conversationId: id,
    role: "user",
    content: systemContent,
  });

  res.json({
    success: true,
    fileName: originalname,
    fileType,
    charCount: extractedText.length,
    preview: extractedText.slice(0, 250) + (extractedText.length > 250 ? "…" : ""),
  });
  return;
});

router.post("/openai/conversations/:id/messages", async (req, res) => {
  const id = Number(req.params.id);
  const body = SendOpenaiMessageBody.parse(req.body);

  const [conv] = await db.select().from(conversations).where(eq(conversations.id, id));
  if (!conv) return res.status(404).json({ error: "Not found" });

  await db.insert(messages).values({ conversationId: id, role: "user", content: body.content });

  const history = await db.select().from(messages).where(eq(messages.conversationId, id)).orderBy(messages.createdAt);

  const chatMessages = history.map(m => ({
    role: m.role as "user" | "assistant" | "system",
    content: m.content,
  }));

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  let fullResponse = "";

  const stream = await openai.chat.completions.create({
    model: "gpt-5.2",
    max_completion_tokens: 8192,
    messages: chatMessages,
    stream: true,
  });

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content;
    if (content) {
      fullResponse += content;
      res.write(`data: ${JSON.stringify({ content })}\n\n`);
    }
  }

  await db.insert(messages).values({ conversationId: id, role: "assistant", content: fullResponse });

  res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
  res.end();
  return;
});

export default router;
