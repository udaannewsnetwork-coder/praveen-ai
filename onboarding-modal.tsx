"use client";
import { useState } from "react";
import * as Icons from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { EXAM_OPTIONS } from "@/lib/mock-data";
import type { ExamCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

const categories: { id: ExamCategory; label: string }[] = [
  { id: "boards", label: "Boards" },
  { id: "competitive", label: "Competitive" },
  { id: "govt", label: "Government" },
  { id: "defence", label: "Defence" },
];

export function OnboardingModal({
  open,
  onOpenChange,
  onComplete,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: (examId: string, days: number) => void;
}) {
  const [step, setStep] = useState<1 | 2>(1);
  const [category, setCategory] = useState<ExamCategory>("competitive");
  const [selectedExam, setSelectedExam] = useState<string | null>(null);
  const [days, setDays] = useState(45);

  const filteredExams = EXAM_OPTIONS.filter((e) => e.category === category);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{step === 1 ? "Which exam are you targeting?" : "How many days until your exam?"}</DialogTitle>
          <DialogDescription>
            {step === 1
              ? "Praveen AI tunes explanations, mock tests and PYQs to this track."
              : "This unlocks the 10-Day Final Crunch mode automatically when it's close."}
          </DialogDescription>
        </DialogHeader>

        {step === 1 ? (
          <div className="space-y-5">
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCategory(c.id)}
                  className={cn(
                    "rounded-full border px-3.5 py-1.5 text-sm transition-colors",
                    category === c.id
                      ? "border-electric bg-electric/15 text-electric-glow"
                      : "border-border text-muted hover:text-foreground"
                  )}
                >
                  {c.label}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {filteredExams.map((exam) => {
                const Icon = (Icons as any)[exam.icon] ?? Icons.BookOpen;
                const active = selectedExam === exam.id;
                return (
                  <button
                    key={exam.id}
                    onClick={() => setSelectedExam(exam.id)}
                    className={cn(
                      "flex flex-col items-start gap-2 rounded-xl border p-3.5 text-left transition-colors",
                      active ? "border-emerald bg-emerald/10" : "border-border bg-surface-2 hover:border-border/80"
                    )}
                  >
                    <Icon className={cn("h-4.5 w-4.5", active ? "text-emerald-glow" : "text-muted")} />
                    <span className="text-sm font-medium">{exam.label}</span>
                  </button>
                );
              })}
            </div>
            <Button className="w-full" size="lg" disabled={!selectedExam} onClick={() => setStep(2)}>
              Continue
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <div className="mb-2 flex items-baseline justify-between">
                <span className="text-sm text-muted">Days remaining</span>
                <span className="font-display text-2xl font-bold text-gradient">{days}</span>
              </div>
              <input
                type="range"
                min={1}
                max={365}
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                className="w-full accent-electric"
              />
              {days <= 10 && (
                <p className="mt-3 rounded-lg border border-crimson/30 bg-crimson/10 px-3 py-2 text-xs text-crimson">
                  10-Day Final Crunch mode will unlock immediately after setup.
                </p>
              )}
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button
                className="flex-1"
                onClick={() => selectedExam && onComplete(selectedExam, days)}
              >
                Start learning
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
