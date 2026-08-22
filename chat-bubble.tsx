"use client";
import { motion } from "framer-motion";
import { BrainCircuit, Lightbulb, User } from "lucide-react";
import { MarkdownMessage } from "./markdown-message";
import type { ChatMessage } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ChatBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={cn("flex w-full gap-3", isUser && "flex-row-reverse")}
    >
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
          isUser ? "bg-surface-3 text-foreground" : "bg-gradient-to-br from-electric to-emerald text-background"
        )}
      >
        {isUser ? <User className="h-4 w-4" /> : <BrainCircuit className="h-4 w-4" />}
      </div>
      <div
        className={cn(
          "max-w-[80%] rounded-2xl border px-4 py-3 text-sm",
          isUser
            ? "border-electric/30 bg-electric/10 text-foreground"
            : "border-border bg-surface text-foreground"
        )}
      >
        {message.isHint && (
          <div className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-amber">
            <Lightbulb className="h-3.5 w-3.5" /> Hint
          </div>
        )}
        {message.attachments?.map((att) => (
          <img key={att.url} src={att.url} alt={att.name} className="mb-2 max-h-48 rounded-lg border border-border" />
        ))}
        <MarkdownMessage content={message.content} />
      </div>
    </motion.div>
  );
}
