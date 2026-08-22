"use client";
import { Flame } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ChapterHeatmap } from "@/components/crunch/heatmap";
import { DailyFlashcards } from "@/components/crunch/flashcards";
import { RapidFireQuiz } from "@/components/crunch/rapid-quiz";
import { EmergencyPlanner } from "@/components/crunch/emergency-planner";

export default function CrunchModePage() {
  return (
    <AppShell>
      <div className="px-4 py-8 sm:px-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-crimson/15">
            <Flame className="h-5 w-5 text-crimson" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold">10-Day Final Crunch</h1>
            <p className="text-sm text-muted">Express revision mode — unlocked because your exam is close.</p>
          </div>
        </div>

        <Tabs defaultValue="heatmap">
          <TabsList>
            <TabsTrigger value="heatmap">Heatmap</TabsTrigger>
            <TabsTrigger value="flashcards">Flashcards</TabsTrigger>
            <TabsTrigger value="quiz">Rapid Fire</TabsTrigger>
            <TabsTrigger value="planner">Planner</TabsTrigger>
          </TabsList>

          <TabsContent value="heatmap">
            <ChapterHeatmap />
          </TabsContent>
          <TabsContent value="flashcards">
            <div className="mx-auto max-w-md">
              <DailyFlashcards />
            </div>
          </TabsContent>
          <TabsContent value="quiz">
            <div className="mx-auto max-w-lg">
              <RapidFireQuiz />
            </div>
          </TabsContent>
          <TabsContent value="planner">
            <div className="mx-auto max-w-xl">
              <EmergencyPlanner />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}
