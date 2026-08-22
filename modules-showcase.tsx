"use client";
import { motion } from "framer-motion";
import { MessageSquareText, ClipboardCheck, Archive, Flame } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";

const modules = [
  {
    icon: MessageSquareText,
    title: "AI Teacher Chatbot",
    desc: "Socratic tutoring in English, Hindi or Hinglish. Upload a handwritten doubt and get the exact step that's wrong.",
    href: "/chat",
    accent: "from-electric/20 to-electric/0",
  },
  {
    icon: ClipboardCheck,
    title: "Interactive Test Engine",
    desc: "NTA-style timed mocks with question palette, and post-exam analytics that pinpoint your weak topics.",
    href: "/test-engine",
    accent: "from-emerald/20 to-emerald/0",
  },
  {
    icon: Archive,
    title: "PYQ Vault",
    desc: "10+ years of previous-year questions, searchable by exam, year and chapter — solve any of them with AI.",
    href: "/pyq-vault",
    accent: "from-electric/20 to-emerald/10",
  },
  {
    icon: Flame,
    title: "10-Day Final Crunch",
    desc: "Chapter heatmaps, daily flashcards and an auto-generated hour-by-hour revision timetable.",
    href: "/crunch-mode",
    accent: "from-amber/20 to-amber/0",
  },
];

export function ModulesShowcase() {
  return (
    <section className="border-b border-border/60 py-20">
      <div className="container">
        <div className="mb-12 max-w-xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-glow">Four modules, one tutor</p>
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you'd want from a full-time coaching institute — minus the commute.
          </h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {modules.map((m, i) => (
            <motion.div
              key={m.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
            >
              <Link href={m.href}>
                <Card className={`group h-full overflow-hidden p-6 transition-colors hover:border-electric/50`}>
                  <div className={`mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-br ${m.accent} border border-border`}>
                    <m.icon className="h-5 w-5 text-foreground" />
                  </div>
                  <h3 className="mb-2 font-display text-base font-semibold">{m.title}</h3>
                  <p className="text-sm leading-relaxed text-muted">{m.desc}</p>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
