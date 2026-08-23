"use client";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { EXAM_OPTIONS } from "@/lib/mock-data";
import { Card } from "@/components/ui/card";

const categoryLabels: Record<string, string> = {
  boards: "Boards",
  defence: "Defence",
  govt: "Government",
  competitive: "Competitive",
};

export function ExamGrid({ onSelect }: { onSelect: (id: string) => void }) {
  return (
    <section className="border-b border-border/60 py-20">
      <div className="container">
        <div className="mb-12 max-w-xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-electric-glow">Pick your track</p>
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            One AI tutor, tuned to your exact exam.
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {EXAM_OPTIONS.map((exam, i) => {
            const Icon = (Icons as any)[exam.icon] ?? Icons.BookOpen;
            return (
              <motion.button
                key={exam.id}
                onClick={() => onSelect(exam.id)}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: (i % 4) * 0.06 }}
                className="text-left"
              >
                <Card className="h-full p-5 transition-all hover:-translate-y-0.5 hover:border-emerald/50">
                  <div className="mb-3 flex items-center justify-between">
                    <Icon className="h-5 w-5 text-emerald-glow" />
                    <span className="text-[10px] uppercase tracking-wider text-muted">{categoryLabels[exam.category]}</span>
                  </div>
                  <p className="font-display text-base font-semibold">{exam.label}</p>
                  <p className="mt-1 text-xs text-muted">{exam.fullName}</p>
                </Card>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
