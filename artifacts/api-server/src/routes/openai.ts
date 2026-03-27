import { Router } from "express";
import { db, conversations, messages, eq, desc } from "@workspace/db";
import { openai } from "@workspace/integrations-openai-ai-server";
import { SendOpenaiMessageBody, CreateOpenaiConversationBody } from "@workspace/api-zod";

const router = Router();

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
  res.json({ ...conv, messages: msgs });
});

router.delete("/openai/conversations/:id", async (req, res) => {
  const id = Number(req.params.id);
  const [conv] = await db.select().from(conversations).where(eq(conversations.id, id));
  if (!conv) return res.status(404).json({ error: "Not found" });
  await db.delete(messages).where(eq(messages.conversationId, id));
  await db.delete(conversations).where(eq(conversations.id, id));
  res.status(204).end();
});

router.get("/openai/conversations/:id/messages", async (req, res) => {
  const id = Number(req.params.id);
  const msgs = await db.select().from(messages).where(eq(messages.conversationId, id)).orderBy(messages.createdAt);
  res.json(msgs);
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
});

export default router;
