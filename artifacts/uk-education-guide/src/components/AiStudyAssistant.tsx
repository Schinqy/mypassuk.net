import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, X, Send, Sparkles, RotateCcw, ChevronDown, Loader2 } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  streaming?: boolean;
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

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

async function createConversation(title: string): Promise<number> {
  const res = await fetch(`${BASE}/api/openai/conversations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });
  const data = await res.json();
  return data.id;
}

export default function AiStudyAssistant({ subjectName, subjectLevel, subjectCategory, keyTopics }: Props) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [convId, setConvId] = useState<number | null>(null);
  const [initialised, setInitialised] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const contextLabel = subjectName ?? "UK Education";

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
    const id = await createConversation(subjectName ? `${subjectName} Revision` : "UK Education Help");
    setConvId(id);

    const welcome: Message = {
      role: "assistant",
      content: subjectName
        ? `Hi! I'm your AI study assistant for **${subjectName}**. Ask me anything — I can explain topics, set practice questions, or help you revise. What would you like to work on?`
        : `Hi! I'm your UK Education AI assistant. Ask me anything about subjects, careers, institutions, or study routes!`,
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

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || streaming || convId === null) return;

    const userMsg: Message = { role: "user", content: text };
    const assistantMsg: Message = { role: "assistant", content: "", streaming: true };
    setMessages(prev => [...prev, userMsg, assistantMsg]);
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
    } catch (e) {
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
    } finally {
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
  }, [streaming, convId]);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setMessages([]);
    setConvId(null);
    setInitialised(false);
    setStreaming(false);
    setInput("");
  }, []);

  const formatContent = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-slate-100 px-1 py-0.5 rounded text-xs font-mono">$1</code>')
      .replace(/\n/g, '<br/>');
  };

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
            className="fixed bottom-24 right-6 z-50 w-[min(420px,calc(100vw-2rem))] bg-white rounded-3xl shadow-2xl shadow-slate-900/20 border border-slate-200 flex flex-col overflow-hidden"
            style={{ maxHeight: "min(580px, calc(100vh - 10rem))" }}
          >
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
                  <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
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
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Quick Prompts */}
            {messages.length <= 1 && !streaming && (
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

            {/* Input */}
            <div className="px-4 py-3 border-t border-slate-100 bg-white shrink-0">
              <div className="flex gap-2 items-end">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage(input)}
                  placeholder={subjectName ? `Ask about ${subjectName}…` : "Ask anything…"}
                  disabled={streaming || convId === null}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/40 outline-none transition-all disabled:opacity-50"
                />
                <button
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || streaming || convId === null}
                  className="p-2.5 bg-primary text-white rounded-xl disabled:opacity-40 hover:bg-primary/90 transition-all shrink-0"
                >
                  {streaming ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </div>
              <p className="text-[10px] text-slate-400 mt-2 text-center">Powered by AI · Responses may not be 100% accurate</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
