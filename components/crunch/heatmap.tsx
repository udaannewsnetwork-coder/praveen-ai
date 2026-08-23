"use client";
import { motion } from "framer-motion";
import { CHAPTER_HEATMAP } from "@/lib/mock-data";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

function priorityScore(weightage: number, mastery: number) {
  return Math.round(weightage * 0.6 + (100 - mastery) * 0.4);
}

function priorityColor(score: number) {
  if (score >= 75) return "bg-crimson/20 border-crimson/50 text-crimson";
  if (score >= 55) return "bg-amber/15 border-amber/40 text-amber";
  return "bg-emerald/15 border-emerald/40 text-emerald-glow";
}

export function ChapterHeatmap() {
  const sorted = [...CHAPTER_HEATMAP].sort(
    (a, b) => priorityScore(b.weightage, b.mastery) - priorityScore(a.weightage, a.mastery)
  );

  return (
    <Card className="p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="font-display text-base font-semibold">High-weightage chapter heatmap</h3>
          <p className="text-xs text-muted">Priority = exam weightage vs. your current mastery. Attack red first.</p>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {sorted.map((c, i) => {
          const score = priorityScore(c.weightage, c.mastery);
          return (
            <motion.div
              key={c.chapter}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className={cn("rounded-xl border p-4", priorityColor(score))}
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-foreground">{c.chapter}</p>
                <span className="font-mono text-xs">{score}</span>
              </div>
              <p className="mb-2 text-[11px] text-muted">{c.subject}</p>
              <div className="flex gap-3 text-[11px] text-muted">
                <span>Weightage {c.weightage}%</span>
                <span>Mastery {c.mastery}%</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </Card>
  );
}
