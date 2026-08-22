"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ImagePlus, Send, Languages, Lightbulb, X } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { ChatBubble } from "@/components/chat/chat-bubble";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { INITIAL_CHAT } from "@/lib/mock-data";
import type { ChatMessage } from "@/lib/types";
import { getTutorReply } from "./actions";

const languages = ["English", "Hindi", "Hinglish"];
const quickPrompts = [
  "Explain projectile motion",
  "Give me a hint",
  "Trigonometric identities shortcut",
  "Newton's laws quick recap",
];

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_CHAT);
  const [input, setInput] = useState("");
  const [language, setLanguage] = useState("Hinglish");
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  async function sendMessage(text: string) {
    if (!text.trim() && !pendingImage) return;
    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: text.trim() || "Please check my uploaded doubt.",
      attachments: pendingImage ? [{ type: "image", url: pendingImage, name: "doubt.png" }] : undefined,
      timestamp: Date.now(),
    };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput("");
    setPendingImage(null);
    setIsTyping(true);

    const history = nextMessages.map((m) => ({ role: m.role, content: m.content }));
    const reply = await getTutorReply(history);

    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        role: "assistant",
        content: reply,
        isHint: /hint/i.test(text),
        timestamp: Date.now(),
      },
    ]);
    setIsTyping(false);
  }

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPendingImage(reader.result as string);
    reader.readAsDataURL(file);
  }

  return (
    <AppShell>
      <div className="flex h-[calc(100vh-4rem)] flex-col md:h-screen">
        <div className="flex items-center justify-between border-b border-border/60 px-4 py-3 md:px-8">
          <div>
            <h1 className="font-display text-lg font-semibold">Praveen AI — Teacher Mode</h1>
            <p className="text-xs text-muted">Socratic tutoring · step-by-step · always asks before answering</p>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5">
            <Languages className="h-3.5 w-3.5 text-emerald-glow" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-transparent text-xs text-foreground focus:outline-none"
            >
              {languages.map((l) => (
                <option key={l} value={l} className="bg-surface">
                  {l}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div ref={scrollRef} className="scrollbar-thin flex-1 space-y-5 overflow-y-auto px-4 py-6 md:px-8">
          {messages.map((m) => (
            <ChatBubble key={m.id} message={m} />
          ))}
          {isTyping && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 pl-11 text-xs text-muted">
              <span className="flex gap-1">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-glow [animation-delay:-0.3s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-glow [animation-delay:-0.15s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-glow" />
              </span>
              Praveen is thinking...
            </motion.div>
          )}
        </div>

        <div className="border-t border-border/60 px-4 py-4 md:px-8">
          <div className="mb-3 flex flex-wrap gap-2">
            {quickPrompts.map((p) => (
              <button
                key={p}
                onClick={() => sendMessage(p)}
                className="rounded-full border border-border bg-surface px-3 py-1 text-xs text-muted transition-colors hover:border-electric/50 hover:text-foreground"
              >
                {p}
              </button>
            ))}
          </div>

          {pendingImage && (
            <div className="relative mb-3 inline-block">
              <img src={pendingImage} alt="doubt preview" className="h-20 rounded-lg border border-border" />
              <button
                onClick={() => setPendingImage(null)}
                className="absolute -right-2 -top-2 rounded-full bg-crimson p-1 text-white"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}

          <div className="flex items-end gap-2">
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
            <Button variant="outline" size="icon" onClick={() => fileInputRef.current?.click()} title="Upload handwritten doubt">
              <ImagePlus className="h-4 w-4" />
            </Button>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage(input);
                }
              }}
              placeholder={`Type your doubt in ${language}... e.g. "Explain integration by parts"`}
              rows={1}
              className="scrollbar-thin max-h-32 flex-1 resize-none rounded-lg border border-border bg-surface-2 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-electric"
            />
            <Button variant="outline" size="icon" onClick={() => sendMessage("Give me a hint")} title="Get a hint">
              <Lightbulb className="h-4 w-4 text-amber" />
            </Button>
            <Button size="icon" onClick={() => sendMessage(input)}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="mt-2 text-[11px] text-muted">
            Praveen AI explains step-by-step and checks your understanding — it won't just hand you the final answer.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
