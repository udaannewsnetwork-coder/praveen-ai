        "use client";
import { useEffect, useMemo, useState } from "react";
import { Flag, ChevronLeft, ChevronRight, RotateCcw, Timer as TimerIcon, Trophy, Target, Clock3, CheckCircle2, XCircle } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { QuestionPalette, PaletteLegend } from "@/components/test-engine/question-palette";
import { TestCreator, type TestConfig } from "@/components/test-engine/test-creator";
import { generateQuestions, MOCK_QUESTIONS } from "@/lib/mock-data";
import { formatTime, cn } from "@/lib/utils";
import type { QuestionStatus } from "@/lib/types";

type Stage = "setup" | "running" | "results";

export default function TestEnginePage() {
  const [stage, setStage] = useState<Stage>("setup");
  const [config, setConfig] = useState<TestConfig | null>(null);
  const [questions, setQuestions] = useState(MOCK_QUESTIONS.slice(0, 10));
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [marked, setMarked] = useState<boolean[]>([]);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [startedAt, setStartedAt] = useState(0);

  useEffect(() => {
    if (stage !== "running" || secondsLeft <= 0) return;
    const t = setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [stage, secondsLeft]);

  useEffect(() => {
    if (stage === "running" && secondsLeft === 0 && startedAt > 0) {
      finishTest();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft]);

  function startTest(cfg: TestConfig) {
    const pool = generateQuestions(cfg.subject, cfg.topic, cfg.questionCount);
    setQuestions(pool);
    setAnswers(new Array(pool.length).fill(null));
    setMarked(new Array(pool.length).fill(false));
    setCurrent(0);
    setConfig(cfg);
    setSecondsLeft(cfg.timerMinutes * 60);
    setStartedAt(Date.now());
    setStage("running");
  }

  function selectOption(optionIndex: number) {
    setAnswers((prev) => {
      const next = [...prev];
      next[current] = optionIndex;
      return next;
    });
  }

  function clearResponse() {
    setAnswers((prev) => {
      const next = [...prev];
      next[current] = null;
      return next;
    });
  }

  function toggleMark() {
    setMarked((prev) => {
      const next = [...prev];
      next[current] = !next[current];
      return next;
    });
  }

  function finishTest() {
    setStage("results");
  }

  const statuses: QuestionStatus[] = useMemo(
    () =>
      questions.map((_, i) => {
        const answered = answers[i] !== null && answers[i] !== undefined;
        const isMarked = marked[i];
        if (answered && isMarked) return "answered-marked";
        if (answered) return "answered";
        if (isMarked) return "marked";
        return "unattempted";
      }),
    [answers, marked, questions]
  );

  const results = useMemo(() => {
    let correct = 0;
    const topicBreakdown: Record<string, { correct: number; total: number }> = {};
    questions.forEach((q, i) => {
      const isCorrect = answers[i] === q.correctIndex;
      if (isCorrect) correct++;
      topicBreakdown[q.topic] ??= { correct: 0, total: 0 };
      topicBreakdown[q.topic].total++;
      if (isCorrect) topicBreakdown[q.topic].correct++;
    });
    const attempted = answers.filter((a) => a !== null).length;
    const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;
    const timeSpent = config ? config.timerMinutes * 60 - secondsLeft : 0;
    return { correct, total: questions.length, attempted, accuracy, topicBreakdown, timeSpent };
  }, [answers, questions, config, secondsLeft]);

  if (stage === "setup") {
    return (
      <AppShell>
        <div className="px-4 py-10 sm:px-8">
          <TestCreator onCreate={startTest} />
        </div>
      </AppShell>
    );
  }

  if (stage === "running") {
    const q = questions[current];
    return (
      <AppShell>
        <div className="flex h-[calc(100vh-4rem)] flex-col md:h-screen">
          <div className="flex items-center justify-between border-b border-border/60 px-4 py-3 md:px-8">
            <div>
              <p className="text-xs text-muted">{config?.subject} · {q.topic}</p>
              <h1 className="font-display text-base font-semibold">Question {current + 1} of {questions.length}</h1>
            </div>
            <div className={cn(
              "flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono text-sm",
              secondsLeft < 60 ? "border-crimson/50 bg-crimson/10 text-crimson" : "border-border bg-surface text-foreground"
            )}>
              <TimerIcon className="h-4 w-4" />
              {formatTime(secondsLeft)}
            </div>
          </div>

          <div className="grid flex-1 gap-6 overflow-y-auto p-4 md:grid-cols-[1fr_260px] md:p-8">
            <div>
              <Card className="p-6">
                <div className="mb-4 flex items-center gap-2">
                  <Badge variant="electric">{q.difficulty}</Badge>
                  <Badge variant="outline">{q.topic}</Badge>
                </div>
                <p className="mb-6 text-base leading-relaxed text-foreground">{q.questionText}</p>
                <div className="space-y-2.5">
                  {q.options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => selectOption(i)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm transition-colors",
                        answers[current] === i
                          ? "border-electric bg-electric/10 text-foreground"
                          : "border-border bg-surface-2 text-muted hover:border-border/80 hover:text-foreground"
                      )}
                    >
                      <span className={cn(
                        "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px]",
                        answers[current] === i ? "border-electric bg-electric text-white" : "border-border"
                      )}>
                        {String.fromCharCode(65 + i)}
                      </span>
                      {opt}
                    </button>
                  ))}
                </div>
              </Card>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={clearResponse}>
                    <RotateCcw className="mr-1.5 h-3.5 w-3.5" /> Clear response
                  </Button>
                  <Button variant={marked[current] ? "secondary" : "outline"} size="sm" onClick={toggleMark}>
                    <Flag className="mr-1.5 h-3.5 w-3.5" /> {marked[current] ? "Marked" : "Mark for review"}
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={current === 0}
                    onClick={() => setCurrent((c) => Math.max(0, c - 1))}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  {current < questions.length - 1 ? (
                    <Button size="sm" onClick={() => setCurrent((c) => Math.min(questions.length - 1, c + 1))}>
                      Save &amp; Next <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button size="sm" variant="destructive" onClick={finishTest}>
                      Submit test
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Card className="p-4">
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">Question palette</h3>
                <QuestionPalette count={questions.length} statuses={statuses} current={current} onJump={setCurrent} />
              </Card>
              <Card className="p-4">
                <PaletteLegend />
              </Card>
              <Button variant="destructive" className="w-full" onClick={finishTest}>
                Submit test
              </Button>
            </div>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl space-y-6 px-4 py-10 sm:px-8">
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard icon={Trophy} label="Score" value={`${results.correct}/${results.total}`} accent="electric" />
          <StatCard icon={Target} label="Accuracy" value={`${results.accuracy}%`} accent="emerald" />
          <StatCard icon={Clock3} label="Time spent" value={formatTime(results.timeSpent)} accent="amber" />
        </div>

        <Card className="p-6">
          <h3 className="mb-4 font-display text-base font-semibold">Topic-wise weakness detection</h3>
          <div className="space-y-4">
            {Object.entries(results.topicBreakdown).map(([topic, b]) => {
              const pct = Math.round((b.correct / b.total) * 100);
              return (
                <div key={topic}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span>{topic}</span>
                    <span className="text-muted">{b.correct}/{b.total} correct</span>
                  </div>
                  <Progress value={pct} indicatorClassName={pct < 50 ? "from-crimson to-amber" : undefined} />
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="mb-4 font-display text-base font-semibold">Step-by-step solution key</h3>
          <div className="space-y-5">
            {questions.map((q, i) => {
              const isCorrect = answers[i] === q.correctIndex;
              return (
                <div key={q.id} className="border-b border-border/60 pb-5 last:border-0 last:pb-0">
                  <div className="mb-2 flex items-start justify-between gap-3">
                    <p className="text-sm font-medium text-foreground">{i + 1}. {q.questionText}</p>
                    {isCorrect ? (
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-glow" />
                    ) : (
                      <XCircle className="h-4 w-4 shrink-0 text-crimson" />
                    )}
                  </div>
                  <p className="text-xs text-muted">
                    Your answer: <span className="text-foreground">{answers[i] !== null ? q.options[answers[i]!] : "Not attempted"}</span>
                    {" · "}Correct: <span className="text-emerald-glow">{q.options[q.correctIndex]}</span>
                  </p>
                  <p className="mt-2 rounded-lg bg-surface-2 p-3 text-xs leading-relaxed text-muted">
                    <span className="font-medium text-foreground">Praveen AI: </span>{q.solution}
                  </p>
                </div>
              );
            })}
          </div>
        </Card>

        <Button size="lg" className="w-full" onClick={() => setStage("setup")}>
          Create another test
        </Button>
      </div>
    </AppShell>
  );
}

function StatCard({ icon: Icon, label, value, accent }: { icon: any; label: string; value: string; accent: "electric" | "emerald" | "amber" }) {
  const accentMap = {
    electric: "text-electric-glow bg-electric/15",
    emerald: "text-emerald-glow bg-emerald/15",
    amber: "text-amber bg-amber/15",
  };
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-5">
        <div className={cn("flex h-11 w-11 items-center justify-center rounded-lg", accentMap[accent])}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs text-muted">{label}</p>
          <p className="font-display text-xl font-bold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}                
