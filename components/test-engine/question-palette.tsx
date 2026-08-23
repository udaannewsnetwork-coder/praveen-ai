"use client";
import { cn } from "@/lib/utils";
import type { QuestionStatus } from "@/lib/types";

const statusStyles: Record<QuestionStatus, string> = {
  unattempted: "bg-surface-3 text-muted border-border",
  answered: "bg-emerald text-background border-emerald",
  marked: "bg-amber text-background border-amber",
  "answered-marked": "bg-electric text-white border-electric",
};

export function QuestionPalette({
  count,
  statuses,
  current,
  onJump,
}: {
  count: number;
  statuses: QuestionStatus[];
  current: number;
  onJump: (index: number) => void;
}) {
  return (
    <div className="grid grid-cols-6 gap-2 sm:grid-cols-5">
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          onClick={() => onJump(i)}
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-md border text-xs font-semibold transition-transform hover:scale-105",
            statusStyles[statuses[i]],
            current === i && "ring-2 ring-foreground ring-offset-2 ring-offset-surface"
          )}
        >
          {i + 1}
        </button>
      ))}
    </div>
  );
}

export function PaletteLegend() {
  const items: { label: string; className: string }[] = [
    { label: "Answered", className: statusStyles.answered },
    { label: "Marked", className: statusStyles.marked },
    { label: "Answered + Marked", className: statusStyles["answered-marked"] },
    { label: "Unattempted", className: statusStyles.unattempted },
  ];
  return (
    <div className="space-y-2 text-xs text-muted">
      {items.map((it) => (
        <div key={it.label} className="flex items-center gap-2">
          <span className={cn("h-3.5 w-3.5 rounded border", it.className)} />
          {it.label}
        </div>
      ))}
    </div>
  );
}
