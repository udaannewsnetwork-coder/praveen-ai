"use client";
import { useState } from "react";
import { CalendarClock, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const ALL_SUBJECTS = ["Physics", "Chemistry", "Mathematics", "Biology"];

interface Block {
  time: string;
  activity: string;
  subject: string;
}

function buildTimetable(weakSubjects: string[]): Block[] {
  const rotation = weakSubjects.length > 0 ? weakSubjects : ALL_SUBJECTS;
  const slots = [
    { time: "6:00 – 7:30 AM", type: "Deep study — weakest chapter" },
    { time: "7:30 – 8:00 AM", type: "Breakfast + break" },
    { time: "8:00 – 9:30 AM", type: "Practice problems" },
    { time: "9:30 – 10:00 AM", type: "Break" },
    { time: "10:00 – 11:30 AM", type: "PYQ solving" },
    { time: "11:30 AM – 12:00 PM", type: "Formula flashcard revision" },
    { time: "12:00 – 1:00 PM", type: "Lunch + rest" },
    { time: "1:00 – 2:30 PM", type: "Deep study — second subject" },
    { time: "2:30 – 3:00 PM", type: "Break" },
    { time: "3:00 – 4:00 PM", type: "Rapid fire quiz (15 min x2 rounds)" },
    { time: "4:00 – 5:30 PM", type: "Mock test (timed)" },
    { time: "5:30 – 6:00 PM", type: "Break" },
    { time: "6:00 – 7:00 PM", type: "Mock test analysis with Praveen AI" },
    { time: "7:00 – 8:00 PM", type: "Dinner + rest" },
    { time: "8:00 – 9:30 PM", type: "Weak-topic revision" },
    { time: "9:30 – 10:00 PM", type: "Light recap + sleep prep" },
  ];
  return slots.map((slot, i) => ({
    time: slot.time,
    activity: slot.type,
    subject: rotation[i % rotation.length],
  }));
}

export function EmergencyPlanner() {
  const [days, setDays] = useState(7);
  const [weakSubjects, setWeakSubjects] = useState<string[]>(["Physics", "Mathematics"]);
  const [timetable, setTimetable] = useState<Block[] | null>(null);

  function toggleSubject(s: string) {
    setWeakSubjects((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
  }

  return (
    <Card className="p-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-crimson/15">
          <CalendarClock className="h-5 w-5 text-crimson" />
        </div>
        <div>
          <h3 className="font-display text-base font-semibold">Emergency study planner</h3>
          <p className="text-xs text-muted">Auto-generates an hour-by-hour timetable from your remaining days and weak subjects.</p>
        </div>
      </div>

      <div className="mb-4">
        <div className="mb-2 flex items-baseline justify-between text-sm">
          <span className="text-muted">Days until exam</span>
          <span className="font-display text-xl font-bold text-gradient">{days}</span>
        </div>
        <input type="range" min={1} max={10} value={days} onChange={(e) => setDays(Number(e.target.value))} className="w-full accent-electric" />
      </div>

      <div className="mb-5">
        <p className="mb-2 text-sm text-muted">Weakest subjects</p>
        <div className="flex flex-wrap gap-2">
          {ALL_SUBJECTS.map((s) => (
            <button
              key={s}
              onClick={() => toggleSubject(s)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs transition-colors",
                weakSubjects.includes(s) ? "border-crimson bg-crimson/15 text-crimson" : "border-border text-muted"
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <Button onClick={() => setTimetable(buildTimetable(weakSubjects))} className="w-full">
        <Sparkles className="mr-1.5 h-4 w-4" /> Generate Day-1 timetable
      </Button>

      {timetable && (
        <div className="mt-5 space-y-2">
          <Badge variant="crimson" className="mb-1">Day 1 of {days} — Final Crunch</Badge>
          <div className="scrollbar-thin max-h-80 space-y-1.5 overflow-y-auto pr-1">
            {timetable.map((b, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border border-border bg-surface-2 px-3 py-2 text-xs">
                <span className="w-32 shrink-0 font-mono text-muted">{b.time}</span>
                <span className="flex-1 px-2 text-foreground">{b.activity}</span>
                <Badge variant="outline">{b.subject}</Badge>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
