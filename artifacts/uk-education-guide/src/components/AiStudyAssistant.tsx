import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot, X, Send, Sparkles, RotateCcw, ChevronDown, Loader2,
  Lock, Zap, Paperclip, FileText, ImageIcon, FileX, CheckCircle2, AlertCircle,
} from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@workspace/replit-auth-web";

interface Message {
  role: "user" | "assistant";
  content: string;
  streaming?: boolean;
  attachment?: { fileName: string; fileType: string; preview?: string };
}

interface Props {
  subjectName?: string;
  subjectLevel?: string;
  subjectCategory?: string;
  keyTopics?: string[];
}

const QUICK_PROMPTS = [
  "Explain a key topic simply",
  "Give me 3 practice exam questions",
  "What are common mistakes students make?",
  "How is this assessed in the exam?",
  "Give me a memory trick for revision",
];

const ACCEPTED_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
  "text/markdown",
  "text/csv",
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
].join(",");

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
const ANON_LIMIT = 5;
const SIGNED_IN_LIMIT = 15;

function isPremiumUser(): boolean {
  return localStorage.getItem("uk-edguide-premium") === "true";
}

function getDailyKey() {
  return `ai-chat-daily-${new Date().toISOString().slice(0, 10)}`;
}

function getDailyUsage(): number {
  return parseInt(localStorage.getItem(getDailyKey()) ?? "0", 10);
}

function incrementDailyUsage(): number {
  const next = getDailyUsage() + 1;
  localStorage.setItem(getDailyKey(), String(next));
  return next;
}

async function createConversation(title: string): Promise<number> {
  const res = await fetch(`${BASE}/api/openai/conversations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });
  const data = await res.json();
  return data.id;
}

function fileIcon(fileType: string) {
  if (fileType === "image") return <ImageIcon className="w-4 h-4" />;
  return <FileText className="w-4 h-4" />;
}

function humanFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

export default function AiStudyAssistant({ subjectName, subjectLevel, subjectCategory, keyTopics }: Props) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [convId, setConvId] = useState<number | null>(null);
  const [initialised, setInitialised] = useState(false);
  const { isAuthenticated, login } = useAuth();
  const [dailyUsage, setDailyUsage] = useState(getDailyUsage);
  const [premium] = useState(isPremiumUser);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const contextLabel = subjectName ?? "MyPassUK";
  const dailyLimit = premium ? Infinity : (isAuthenticated ? SIGNED_IN_LIMIT : ANON_LIMIT);
  const remaining = premium ? Infinity : Math.max(0, dailyLimit - dailyUsage);
  const limitReached = !premium && dailyUsage >= dailyLimit;

  const systemPrompt = subjectName
    ? `You are an expert UK education tutor specialising in ${subjectName} at ${subjectLevel ?? "GCSE/A-Level"} level (${subjectCategory ?? ""}). Your job is to help students revise, understand key topics, and prepare for exams. Keep answers concise, structured, and tailored to UK exam board expectations (Pearson Edexcel). When giving practice questions, include mark-scheme hints. Key topics include: ${keyTopics?.join(", ") ?? "various topics"}.`
    : `You are a helpful UK education assistant. You help students with GCSE and A-Level revision, career exploration, and understanding university routes in the UK.`;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  const initConversation = useCallback(async () => {
    if (initialised) return;
    setInitialised(true);
    const id = await createConversation(subjectName ? `${subjectName} Revision` : "MyPassUK Help");
    setConvId(id);

    const welcome: Message = {
      role: "assistant",
      content: subjectName
        ? `Hi! I'm your AI study assistant for **${subjectName}**. Ask me anything — I can explain topics, set practice questions, or help you revise. You can also **upload a document or image** (past papers, revision notes, spec pages) and I'll read it for you. What would you like to work on?`
        : `Hi! I'm your MyPassUK AI assistant. Ask me anything about subjects, careers, institutions, or study routes! You can also **upload a document or image** and I'll analyse it for you.`,
    };
    setMessages([welcome]);

    await fetch(`${BASE}/api/openai/conversations/${id}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: `[SYSTEM] ${systemPrompt}` }),
    });
  }, [initialised, subjectName, subjectLevel, systemPrompt]);

  useEffect(() => {
    if (open && !initialised) {
      initConversation();
    }
  }, [open, initialised, initConversation]);

  const handleFileSelect = useCallback((file: File) => {
    setUploadError(null);
    if (file.size > 10 * 1024 * 1024) {
      setUploadError("File is too large. Maximum size is 10 MB.");
      return;
    }
    setPendingFile(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  }, [handleFileSelect]);

  const uploadPendingFile = useCallback(async (id: number, file: File): Promise<Message> => {
    setUploading(true);
    const form = new FormData();
    form.append("file", file);
    const res = await fetch(`${BASE}/api/openai/conversations/${id}/upload`, {
      method: "POST",
      body: form,
    });
    setUploading(false);

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: "Upload failed" }));
      throw new Error(err.error ?? "Upload failed");
    }

    const data = await res.json();
    return {
      role: "user",
      content: `Analyse this ${data.fileType}: **${data.fileName}**`,
      attachment: {
        fileName: data.fileName,
        fileType: data.fileType,
        preview: data.preview,
      },
    };
  }, []);

  const sendMessage = useCallback(async (text: string) => {
    if ((!text.trim() && !pendingFile) || streaming || convId === null) return;
    if (limitReached) return;

    setUploadError(null);

    let attachmentBubble: Message | null = null;

    // Upload file first if there is one
    if (pendingFile) {
      try {
        attachmentBubble = await uploadPendingFile(convId, pendingFile);
        setPendingFile(null);
      } catch (err: any) {
        setUploading(false);
        setUploadError(err.message ?? "Upload failed. Please try again.");
        return;
      }
    }

    // Don't send a bare text message if we only had a file and no text
    if (!text.trim() && attachmentBubble) {
      const newUsage = incrementDailyUsage();
      setDailyUsage(newUsage);

      setMessages(prev => [...prev, attachmentBubble!]);
      setInput("");

      // After injecting the attachment context, prompt the AI to acknowledge
      const assistantMsg: Message = { role: "assistant", content: "", streaming: true };
      setMessages(prev => [...prev, assistantMsg]);
      setStreaming(true);

      const ctrl = new AbortController();
      abortRef.current = ctrl;

      try {
        const res = await fetch(`${BASE}/api/openai/conversations/${convId}/messages`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: `I've shared the ${attachmentBubble.attachment?.fileType} "${attachmentBubble.attachment?.fileName}". Please briefly confirm you can see it and summarise what it contains in 2–3 sentences, then ask how you can help.` }),
          signal: ctrl.signal,
        });
        await streamResponse(res);
      } catch (e) {
        handleStreamError(e);
      } finally {
        finaliseStream();
      }
      return;
    }

    const newUsage = incrementDailyUsage();
    setDailyUsage(newUsage);

    const userMsg: Message = { role: "user", content: text };
    const assistantMsg: Message = { role: "assistant", content: "", streaming: true };

    setMessages(prev => {
      const base = [...prev];
      if (attachmentBubble) base.push(attachmentBubble);
      return [...base, userMsg, assistantMsg];
    });
    setInput("");
    setStreaming(true);

    const ctrl = new AbortController();
    abortRef.current = ctrl;

    try {
      const res = await fetch(`${BASE}/api/openai/conversations/${convId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text }),
        signal: ctrl.signal,
      });
      await streamResponse(res);
    } catch (e) {
      handleStreamError(e);
    } finally {
      finaliseStream();
    }
  }, [streaming, convId, limitReached, pendingFile, uploadPendingFile]);

  async function streamResponse(res: Response) {
    const reader = res.body?.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    if (!reader) throw new Error("No stream");

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";
      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        const json = line.slice(6).trim();
        if (!json) continue;
        const parsed = JSON.parse(json);
        if (parsed.done) break;
        if (parsed.content) {
          setMessages(prev => {
            const updated = [...prev];
            const last = updated[updated.length - 1];
            if (last?.role === "assistant") {
              updated[updated.length - 1] = { ...last, content: last.content + parsed.content };
            }
            return updated;
          });
        }
      }
    }
  }

  function handleStreamError(e: unknown) {
    if ((e as Error).name !== "AbortError") {
      setMessages(prev => {
        const updated = [...prev];
        const last = updated[updated.length - 1];
        if (last?.role === "assistant" && last.streaming) {
          updated[updated.length - 1] = { ...last, content: "Sorry, something went wrong. Please try again.", streaming: false };
        }
        return updated;
      });
    }
  }

  function finaliseStream() {
    setMessages(prev => {
      const updated = [...prev];
      const last = updated[updated.length - 1];
      if (last?.role === "assistant") {
        updated[updated.length - 1] = { ...last, streaming: false };
      }
      return updated;
    });
    setStreaming(false);
  }

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setMessages([]);
    setConvId(null);
    setInitialised(false);
    setStreaming(false);
    setInput("");
    setPendingFile(null);
    setUploadError(null);
  }, []);

  const formatContent = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-slate-100 px-1 py-0.5 rounded text-xs font-mono">$1</code>')
      .replace(/\n/g, '<br/>');
  };

  const canSend = (input.trim().length > 0 || pendingFile !== null) && !streaming && !uploading && convId !== null && !limitReached;

  return (
    <>
      {/* Floating toggle button */}
      <motion.button
        onClick={() => setOpen(o => !o)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-5 py-3.5 bg-primary text-white rounded-2xl shadow-2xl shadow-primary/30 font-bold text-sm hover:bg-primary/90 transition-colors"
      >
        <Bot className="w-5 h-5" />
        AI Study Assistant
        <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: "spring", damping: 22, stiffness: 300 }}
            className="fixed bottom-24 right-6 z-50 w-[min(440px,calc(100vw-2rem))] bg-white rounded-3xl shadow-2xl shadow-slate-900/20 border border-slate-200 flex flex-col overflow-hidden"
            style={{ maxHeight: "min(620px, calc(100vh - 10rem))" }}
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            {/* Drag overlay */}
            <AnimatePresence>
              {dragOver && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-20 bg-primary/10 border-2 border-dashed border-primary/50 rounded-3xl flex items-center justify-center pointer-events-none"
                >
                  <div className="text-center">
                    <Paperclip className="w-8 h-8 text-primary mx-auto mb-2" />
                    <p className="font-bold text-primary text-sm">Drop your file here</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-primary/80 px-5 py-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-bold text-white text-sm leading-tight">AI Study Assistant</p>
                  <p className="text-white/70 text-xs">{contextLabel}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {premium ? (
                  <div className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500 text-white flex items-center gap-1">
                    <Zap className="w-3 h-3" /> Premium
                  </div>
                ) : (
                  <div className={`px-2.5 py-1 rounded-full text-xs font-bold ${remaining <= 1 ? "bg-accent text-white" : "bg-white/20 text-white"}`}>
                    {remaining}/{dailyLimit === Infinity ? "∞" : dailyLimit} free
                  </div>
                )}
                <button
                  onClick={reset}
                  className="p-2 rounded-xl hover:bg-white/10 transition-colors text-white/70 hover:text-white"
                  title="New conversation"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="p-2 rounded-xl hover:bg-white/10 transition-colors text-white/70 hover:text-white"
                >
                  <ChevronDown className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-slate-50/50 min-h-0">
              {messages.length === 0 && (
                <div className="text-center py-8">
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Sparkles className="w-7 h-7 text-primary" />
                  </div>
                  <p className="text-sm font-semibold text-slate-600">Starting conversation...</p>
                </div>
              )}

              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.role === "assistant" && (
                    <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center shrink-0 mt-0.5 mr-2">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div className={`max-w-[82%] ${msg.role === "user" ? "" : ""}`}>
                    {/* Attachment card (shown above user message bubble) */}
                    {msg.attachment && (
                      <div className="mb-1.5 flex justify-end">
                        <div className="bg-primary/10 border border-primary/20 rounded-xl px-3 py-2 flex items-start gap-2.5 max-w-full">
                          <div className="w-8 h-8 bg-primary/15 rounded-lg flex items-center justify-center shrink-0 mt-0.5 text-primary">
                            {fileIcon(msg.attachment.fileType)}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-800 truncate">{msg.attachment.fileName}</p>
                            <p className="text-[10px] text-slate-500 capitalize">{msg.attachment.fileType} uploaded</p>
                          </div>
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        </div>
                      </div>
                    )}
                    {/* Text bubble */}
                    {(msg.content || msg.streaming) && (
                      <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "bg-primary text-white rounded-br-sm"
                          : "bg-white border border-slate-200 text-slate-800 rounded-bl-sm shadow-sm"
                      }`}>
                        {msg.role === "assistant" ? (
                          <span dangerouslySetInnerHTML={{ __html: formatContent(msg.content) }} />
                        ) : (
                          msg.content
                        )}
                        {msg.streaming && (
                          <span className="inline-block w-1.5 h-4 bg-primary/60 rounded-full ml-1 animate-pulse align-middle" />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Quick Prompts */}
            {messages.length <= 1 && !streaming && !limitReached && (
              <div className="px-4 py-3 border-t border-slate-100 bg-white flex gap-2 overflow-x-auto shrink-0">
                {QUICK_PROMPTS.map(prompt => (
                  <button
                    key={prompt}
                    onClick={() => sendMessage(prompt)}
                    className="shrink-0 px-3 py-1.5 bg-primary/8 hover:bg-primary/15 text-primary border border-primary/20 rounded-full text-xs font-semibold transition-colors whitespace-nowrap"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}

            {/* Limit reached paywall */}
            {limitReached ? (
              <div className="px-4 py-5 border-t border-slate-100 bg-white shrink-0">
                <div className="bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20 rounded-2xl p-4 text-center">
                  <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Lock className="w-5 h-5 text-white" />
                  </div>
                  <p className="font-bold text-slate-900 text-sm mb-1">Daily limit reached</p>
                  <p className="text-xs text-slate-500 mb-3">
                    {isAuthenticated
                      ? `You've used all ${SIGNED_IN_LIMIT} free messages today. Resets at midnight, or upgrade for unlimited.`
                      : `You've used all ${ANON_LIMIT} free messages. Sign in for ${SIGNED_IN_LIMIT}/day, or upgrade for unlimited.`}
                  </p>
                  {!isAuthenticated && (
                    <button
                      onClick={() => { setOpen(false); login(); }}
                      className="w-full py-2.5 bg-slate-800 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-700 transition-colors mb-2"
                    >
                      Sign in — get 15 messages/day free
                    </button>
                  )}
                  <Link href="/pricing">
                    <button
                      onClick={() => setOpen(false)}
                      className="w-full py-2.5 bg-primary text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
                    >
                      <Zap className="w-4 h-4" /> Upgrade to Premium — £3.99/mo
                    </button>
                  </Link>
                  <p className="text-[10px] text-slate-400 mt-2">Free messages reset daily at midnight</p>
                </div>
              </div>
            ) : (
              <div className="px-4 pt-3 pb-3 border-t border-slate-100 bg-white shrink-0">
                {/* Low-messages warning */}
                {!premium && remaining <= 2 && remaining > 0 && (
                  <div className="flex items-center gap-1.5 mb-2 text-[10px] font-semibold text-amber-600">
                    <Zap className="w-3 h-3" />
                    {remaining} free message{remaining !== 1 ? "s" : ""} left today ·{" "}
                    {isAuthenticated ? (
                      <Link href="/pricing">
                        <span onClick={() => setOpen(false)} className="underline cursor-pointer hover:text-accent">Upgrade for unlimited</span>
                      </Link>
                    ) : (
                      <span onClick={() => { setOpen(false); login(); }} className="underline cursor-pointer hover:text-accent">Sign in for 15/day</span>
                    )}
                  </div>
                )}

                {/* Upload error */}
                {uploadError && (
                  <div className="flex items-center gap-1.5 mb-2 text-[10px] font-semibold text-red-600 bg-red-50 border border-red-200 rounded-lg px-2.5 py-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    {uploadError}
                  </div>
                )}

                {/* Pending file chip */}
                {pendingFile && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 mb-2 bg-primary/8 border border-primary/20 rounded-xl px-3 py-2"
                  >
                    <div className="w-7 h-7 bg-primary/15 rounded-lg flex items-center justify-center text-primary shrink-0">
                      {pendingFile.type.startsWith("image/") ? (
                        <ImageIcon className="w-3.5 h-3.5" />
                      ) : (
                        <FileText className="w-3.5 h-3.5" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-800 truncate">{pendingFile.name}</p>
                      <p className="text-[10px] text-slate-500">{humanFileSize(pendingFile.size)}</p>
                    </div>
                    {uploading ? (
                      <Loader2 className="w-4 h-4 text-primary animate-spin shrink-0" />
                    ) : (
                      <button
                        onClick={() => { setPendingFile(null); setUploadError(null); }}
                        className="p-1 rounded-md hover:bg-red-100 text-slate-400 hover:text-red-500 transition-colors shrink-0"
                      >
                        <FileX className="w-4 h-4" />
                      </button>
                    )}
                  </motion.div>
                )}

                {/* Input row */}
                <div className="flex gap-2 items-end">
                  {/* Hidden file input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={ACCEPTED_TYPES}
                    className="hidden"
                    onChange={e => {
                      const f = e.target.files?.[0];
                      if (f) handleFileSelect(f);
                      e.target.value = "";
                    }}
                  />

                  {/* Paperclip button */}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading || convId === null}
                    title="Upload a document or image"
                    className={`p-2.5 rounded-xl border transition-all shrink-0 ${
                      pendingFile
                        ? "bg-primary/10 border-primary/30 text-primary"
                        : "bg-slate-50 border-slate-200 text-slate-400 hover:text-primary hover:border-primary/30 hover:bg-primary/5"
                    } disabled:opacity-40`}
                  >
                    <Paperclip className="w-5 h-5" />
                  </button>

                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage(input)}
                    placeholder={
                      pendingFile
                        ? "Ask about this file, or just press Send…"
                        : subjectName ? `Ask about ${subjectName}…` : "Ask anything…"
                    }
                    disabled={streaming || uploading || convId === null}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/40 outline-none transition-all disabled:opacity-50"
                  />
                  <button
                    onClick={() => sendMessage(input)}
                    disabled={!canSend}
                    className="p-2.5 bg-primary text-white rounded-xl disabled:opacity-40 hover:bg-primary/90 transition-all shrink-0"
                  >
                    {uploading || streaming ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {/* Footer hints */}
                <p className="text-[10px] text-slate-400 mt-2 text-center">
                  PDF · Word · image · text · drag & drop supported · max 10 MB
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
