"use client";
import { useEffect, useState } from "react";
import { Zap, RefreshCcw } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { MOCK_QUESTIONS } from "@/lib/mock-data";
import { formatTime, cn } from "@/lib/utils";

const QUIZ_LENGTH = 5;
const DURATION = 15 * 60;

export function RapidFireQuiz() {
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [seconds, setSeconds] = useState(DURATION);
  const questions = MOCK_QUESTIONS.slice(0, QUIZ_LENGTH);

  useEffect(() => {
    if (!started || finished) return;
    if (seconds <= 0) {
      setFinished(true);
      return;
    }
    const t = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [started, finished, seconds]);

  function answer(optionIndex: number) {
    if (optionIndex === questions[index].correctIndex) setScore((s) => s + 1);
    if (index === questions.length - 1) {
      setFinished(true);
    } else {
      setIndex((i) => i + 1);
    }
  }

  function reset() {
    setStarted(false);
    setFinished(false);
    setIndex(0);
    setScore(0);
    setSeconds(DURATION);
  }

  if (!started) {
    return (
      <Card className="flex flex-col items-center gap-3 p-8 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber/15">
          <Zap className="h-6 w-6 text-amber" />
        </div>
        <h3 className="font-display text-base font-semibold">Daily 15-minute rapid fire</h3>
        <p className="max-w-xs text-xs text-muted">{QUIZ_LENGTH} quickfire questions across your weakest chapters. Beat the clock.</p>
        <Button onClick={() => setStarted(true)}>Start rapid fire</Button>
      </Card>
    );
  }

  if (finished) {
    return (
      <Card className="flex flex-col items-center gap-3 p-8 text-center">
        <p className="text-xs uppercase tracking-wide text-muted">Session complete</p>
        <p className="font-display text-3xl font-bold text-gradient">{score}/{questions.length}</p>
        <p className="text-xs text-muted">Time left when you finished: {formatTime(seconds)}</p>
        <Button variant="outline" onClick={reset}>
          <RefreshCcw className="mr-1.5 h-3.5 w-3.5" /> Run again
        </Button>
      </Card>
    );
  }

  const q = questions[index];
  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-xs text-muted">Question {index + 1}/{questions.length}</span>
        <span className={cn("font-mono text-xs", seconds < 60 && "text-crimson")}>{formatTime(seconds)}</span>
      </div>
      <Progress value={((index) / questions.length) * 100} className="mb-4" />
      <p className="mb-4 text-sm font-medium text-foreground">{q.questionText}</p>
      <div className="space-y-2">
        {q.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => answer(i)}
            className="w-full rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-left text-sm text-muted transition-colors hover:border-electric/50 hover:text-foreground"
          >
            {opt}
          </button>
        ))}
      </div>
    </Card>
  );
}
