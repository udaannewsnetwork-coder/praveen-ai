"use client";
import { useState } from "react";
import { ClipboardCheck, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { SUBJECTS_BY_EXAM, TOPICS_BY_SUBJECT } from "@/lib/mock-data";

export interface TestConfig {
  subject: string;
  topic: string;
  difficulty: "Easy" | "Medium" | "Hard" | "Mixed";
  questionCount: number;
  timerMinutes: number;
}

export function TestCreator({ onCreate }: { onCreate: (config: TestConfig) => void }) {
  const subjects = SUBJECTS_BY_EXAM["jee"];
  const [subject, setSubject] = useState(subjects[0]);
  const topics = TOPICS_BY_SUBJECT[subject] ?? ["General"];
  const [topic, setTopic] = useState(topics[0]);
  const [difficulty, setDifficulty] = useState<TestConfig["difficulty"]>("Mixed");
  const [questionCount, setQuestionCount] = useState(10);
  const [timerMinutes, setTimerMinutes] = useState(15);

  return (
    <Card className="mx-auto max-w-2xl p-6 sm:p-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-electric/15">
          <ClipboardCheck className="h-5 w-5 text-electric-glow" />
        </div>
        <div>
          <h2 className="font-display text-lg font-semibold">Build your custom mock test</h2>
          <p className="text-xs text-muted">Choose subject, topic, difficulty and timer — just like NTA mocks.</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Subject">
          <Select
            value={subject}
            onValueChange={(v) => {
              setSubject(v);
              setTopic((TOPICS_BY_SUBJECT[v] ?? ["General"])[0]);
            }}
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {subjects.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field label="Topic">
          <Select value={topic} onValueChange={setTopic}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {topics.map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field label="Difficulty">
          <Select value={difficulty} onValueChange={(v) => setDifficulty(v as TestConfig["difficulty"])}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {["Easy", "Medium", "Hard", "Mixed"].map((d) => (
                <SelectItem key={d} value={d}>{d}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field label="Number of questions">
          <Select value={String(questionCount)} onValueChange={(v) => setQuestionCount(Number(v))}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {[5, 10, 15, 20].map((n) => (
                <SelectItem key={n} value={String(n)}>{n} questions</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="flex items-center gap-1.5 text-muted"><Clock className="h-3.5 w-3.5" /> Timer</span>
          <span className="font-display font-semibold text-foreground">{timerMinutes} min</span>
        </div>
        <input
          type="range"
          min={5}
          max={60}
          step={5}
          value={timerMinutes}
          onChange={(e) => setTimerMinutes(Number(e.target.value))}
          className="w-full accent-electric"
        />
      </div>

      <Button
        size="lg"
        className="mt-7 w-full"
        onClick={() => onCreate({ subject, topic, difficulty, questionCount, timerMinutes })}
      >
        Start test
      </Button>
    </Card>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-muted">{label}</label>
      {children}
    </div>
  );
}
