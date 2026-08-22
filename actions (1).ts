"use server";
import { explainPYQ } from "@/lib/ai";

export async function solvePYQWithAI(question: string, chapter: string, solution: string) {
  return explainPYQ(question, chapter, solution);
}
