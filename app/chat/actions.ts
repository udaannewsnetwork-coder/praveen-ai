"use server";
import { callModel } from "@/lib/ai";

export async function getTutorReply(history: { role: "user" | "assistant"; content: string }[]) {
  const reply = await callModel({ messages: history });
  return reply;
}
