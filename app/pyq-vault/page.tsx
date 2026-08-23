"use client";
import { useMemo, useState } from "react";
import { Search, Sparkles, Loader2 } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { MOCK_PYQS } from "@/lib/mock-data";
import type { PYQItem } from "@/lib/types";
import { MarkdownMessage } from "@/components/chat/markdown-message";
import { solvePYQWithAI } from "./actions";

const weightageVariant: Record<PYQItem["weightage"], "crimson" | "amber" | "emerald"> = {
  High: "crimson",
  Medium: "amber",
  Low: "emerald",
};

export default function PYQVaultPage() {
  const [search, setSearch] = useState("");
  const [examFilter, setExamFilter] = useState("All");
  const [subjectFilter, setSubjectFilter] = useState("All");
  const [activePYQ, setActivePYQ] = useState<PYQItem | null>(null);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const exams = ["All", ...Array.from(new Set(MOCK_PYQS.map((p) => p.examCategory)))];
  const subjects = ["All", ...Array.from(new Set(MOCK_PYQS.map((p) => p.subject)))];

  const filtered = useMemo(() => {
    return MOCK_PYQS.filter((p) => {
      const matchesExam = examFilter === "All" || p.examCategory === examFilter;
      const matchesSubject = subjectFilter === "All" || p.subject === subjectFilter;
      const matchesSearch =
        search.trim() === "" ||
        p.chapter.toLowerCase().includes(search.toLowerCase()) ||
        p.questionText.toLowerCase().includes(search.toLowerCase());
      return matchesExam && matchesSubject && matchesSearch;
    });
  }, [search, examFilter, subjectFilter]);

  async function handleSolveWithAI(pyq: PYQItem) {
    setActivePYQ(pyq);
    setAiExplanation(null);
    setLoading(true);
    const explanation = await solvePYQWithAI(pyq.questionText, pyq.chapter, pyq.solution);
    setAiExplanation(explanation);
    setLoading(false);
  }

  return (
    <AppShell>
      <div className="px-4 py-8 sm:px-8">
        <div className="mb-6">
          <h1 className="font-display text-2xl font-bold">PYQ Vault</h1>
          <p className="text-sm text-muted">10+ years of previous year questions across every exam track.</p>
        </div>

        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by chapter or keyword..."
              className="w-full rounded-lg border border-border bg-surface-2 py-2.5 pl-9 pr-3 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-electric"
            />
          </div>
          <Select value={examFilter} onValueChange={setExamFilter}>
            <SelectTrigger className="sm:w-44"><SelectValue /></SelectTrigger>
            <SelectContent>
              {exams.map((e) => <SelectItem key={e} value={e}>{e}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={subjectFilter} onValueChange={setSubjectFilter}>
            <SelectTrigger className="sm:w-44"><SelectValue /></SelectTrigger>
            <SelectContent>
              {subjects.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <p className="mb-4 text-xs text-muted">{filtered.length} questions found</p>

        <div className="space-y-3">
          {filtered.map((pyq) => (
            <Card key={pyq.id}>
              <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex-1">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <Badge variant="outline">{pyq.examCategory}</Badge>
                    <Badge variant="outline">{pyq.subject}</Badge>
                    <Badge variant="outline">{pyq.year}</Badge>
                    <Badge variant={weightageVariant[pyq.weightage]}>{pyq.weightage} weightage</Badge>
                  </div>
                  <p className="text-sm text-foreground">{pyq.questionText}</p>
                  <p className="mt-1 text-xs text-muted">Chapter: {pyq.chapter}</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => handleSolveWithAI(pyq)} className="shrink-0">
                  <Sparkles className="mr-1.5 h-3.5 w-3.5 text-emerald-glow" /> Solve with AI
                </Button>
              </CardContent>
            </Card>
          ))}
          {filtered.length === 0 && (
            <p className="py-10 text-center text-sm text-muted">No questions match your filters yet.</p>
          )}
        </div>
      </div>

      <Dialog open={!!activePYQ} onOpenChange={(open) => !open && setActivePYQ(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Solved by Praveen AI</DialogTitle>
            <DialogDescription>{activePYQ?.chapter} · {activePYQ?.examCategory} {activePYQ?.year}</DialogDescription>
          </DialogHeader>
          {loading ? (
            <div className="flex items-center gap-2 py-8 text-sm text-muted">
              <Loader2 className="h-4 w-4 animate-spin" /> Working through the formula, shortcut and traps...
            </div>
          ) : (
            aiExplanation && <MarkdownMessage content={aiExplanation} />
          )}
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
