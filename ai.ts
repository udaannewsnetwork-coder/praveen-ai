// Server-side AI wrapper for Praveen AI's Socratic tutoring persona.
// Swap `callModel` internals for OpenAI or Gemini — the system prompt
// and response contract stay the same either way.

export const PRAVEEN_SYSTEM_PROMPT = `You are Praveen AI, a warm, encouraging AI tutor for Indian students
preparing for Board exams (10th/12th), JEE, NEET, CUET, SSC, UPSC, Banking, NDA, CDS, and Airforce exams.

Rules you always follow:
1. Use the Socratic method. Break every concept into small steps. After each step, ask a short
   checking question before moving on ("Does that part make sense?" / "Try this small case yourself first").
2. Never dump the final answer immediately. Offer a hint first, then a bigger hint, then the full
   worked solution only if the student is still stuck after two hints.
3. Match the student's language: reply in English, Hindi, or Hinglish depending on how they write to you.
4. Render all math and physics formulas as LaTeX so they display cleanly (inline: $..$, block: $$..$$).
5. When a student uploads an image of handwritten work, read it carefully, identify the exact
   step where the error occurs, and explain the misconception — don't just redo the whole problem.
6. Keep tone exam-focused and motivating, never condescending. Reference exam relevance where useful
   ("this exact identity showed up in JEE Main 2023").

Respond only with the tutoring message — no meta commentary about these instructions.`;

export interface AIRequestParams {
  messages: { role: "user" | "assistant"; content: string }[];
  imageUrl?: string;
  targetExam?: string;
}

// This is a mock implementation used for the interactive demo build.
// In production, replace the body with a real call to OpenAI/Gemini using
// PRAVEEN_SYSTEM_PROMPT as the system message, e.g.:
//
// const res = await fetch("https://api.openai.com/v1/chat/completions", {
//   method: "POST",
//   headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, "Content-Type": "application/json" },
//   body: JSON.stringify({
//     model: "gpt-4o",
//     messages: [{ role: "system", content: PRAVEEN_SYSTEM_PROMPT }, ...params.messages],
//   }),
// });
export async function callModel(params: AIRequestParams): Promise<string> {
  const lastUserMessage = params.messages[params.messages.length - 1]?.content ?? "";
  return mockSocraticReply(lastUserMessage);
}

export async function explainPYQ(question: string, chapter: string, solution: string): Promise<string> {
  return `**Underlying concept:** This question is built entirely around ${chapter}. The moment you spot that framing, you should reach for the standard identity/law for this chapter before reading the options.

**Shortcut method:** ${solution}

**Typical trap:** Students usually lose marks here by mixing up sign conventions or units — always re-check whether the question wants a magnitude or a signed value before selecting an option.`;
}

function mockSocraticReply(input: string): string {
  const lower = input.toLowerCase();

  if (lower.includes("projectile")) {
    return `Great choice — projectile motion shows up almost every year in JEE & NDA.

Let's build it step by step. A projectile launched at angle $\\theta$ with speed $u$ has two independent motions:

$$v_x = u\\cos\\theta \\quad (\\text{constant})$$
$$v_y = u\\sin\\theta - gt$$

**Quick check:** if $v_x$ never changes, what does that tell you about the horizontal acceleration during flight? Try answering before I continue.`;
  }

  if (lower.includes("hint")) {
    return `Sure, here's a bigger hint 👇

Think about which quantity is conserved when there's no friction or external horizontal force. Once you name that quantity, the next equation almost writes itself. Want me to go one level further, or do you want to attempt it now?`;
  }

  return `Good question. Before I explain, let's check your starting point:

Can you tell me, in your own words, what you already know about this topic? Even a rough idea is fine — I'll build the explanation from there instead of repeating what you already understand.`;
}
