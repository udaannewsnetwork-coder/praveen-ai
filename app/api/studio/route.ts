import { NextResponse } from "next/server";

export const runtime = "nodejs";

const BUILDER_SYSTEM_PROMPT = `You are Praveen AI Studio, an expert full-stack product engineer. Help users create websites and web apps from natural language. Return ONLY valid JSON with this exact shape:
{"summary":"short plain-language description of what changed","files":[{"path":"index.html","content":"complete file content"}],"previewHtml":"complete self-contained HTML for an isolated iframe preview"}
Rules:
- Generate a polished, responsive, accessible working front-end prototype.
- Include complete source files, not snippets. Prefer index.html, styles.css, and script.js for portable previews unless the user explicitly asks for a framework.
- previewHtml must be a complete standalone HTML document with inline CSS and JS, no external dependencies, no network calls, and no forms that transmit data.
- Do not claim that a backend, database, authentication, payment, deployment, GitHub sync, or external integration is live unless it is actually configured. For those requests, create a safe front-end UI and explain required setup in summary.
- On follow-up requests, update the existing files rather than starting over. Keep file paths simple and reject secrets.
- Do not include markdown fences around the JSON. Keep responses concise but useful.`;

function extractJson(raw: string) {
  const cleaned = raw.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start < 0 || end <= start) throw new Error("Gemini returned an invalid project response. Please try again.");
  return JSON.parse(cleaned.slice(start, end + 1));
}

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "Gemini API key is not configured on the server. Add GEMINI_API_KEY to your deployment environment." }, { status: 503 });

  try {
    const body = await request.json();
    const messages = Array.isArray(body.messages) ? body.messages.slice(-12) : [];
    const currentFiles = Array.isArray(body.currentFiles) ? body.currentFiles.slice(0, 12) : [];
    if (!messages.length || typeof messages[messages.length - 1]?.content !== "string") return NextResponse.json({ error: "Please enter a project description." }, { status: 400 });

    const conversation = messages.map((m: {role?: string; content?: string}) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: String(m.content || "").slice(0, 6000) }],
    }));
    const context = currentFiles.length ? "\n\nCURRENT PROJECT FILES (update these):\n" + currentFiles.map((f: {path?: string; content?: string}) => "FILE: " + String(f.path || "unknown").slice(0, 120) + "\n" + String(f.content || "").slice(0, 12000)).join("\n\n") : "";
    const last = conversation.length - 1;
    conversation[last].parts[0].text += context;

    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: BUILDER_SYSTEM_PROMPT }] },
        generationConfig: { responseMimeType: "application/json", temperature: 0.35 },
        contents: conversation,
      }),
    });
    if (!response.ok) {
      const detail = await response.text();
      console.error("Studio Gemini error", response.status, detail.slice(0, 500));
      return NextResponse.json({ error: "Gemini could not generate the project. Check the server's Gemini model/API configuration." }, { status: 502 });
    }
    const data = await response.json();
    const raw = data?.candidates?.[0]?.content?.parts?.map((p: {text?: string}) => p.text || "").join("") || "";
    const parsed = extractJson(raw);
    if (typeof parsed.summary !== "string" || !Array.isArray(parsed.files) || typeof parsed.previewHtml !== "string") throw new Error("Gemini response is missing required project fields.");
    const files = parsed.files.filter((f: {path?: string; content?: string}) =>
      typeof f.path === "string" && typeof f.content === "string" &&
      !f.path.startsWith("/") && !f.path.split("/").includes("..") && f.path.length <= 160
    ).slice(0, 12).map((f: {path: string; content: string}) => ({ path: f.path, content: f.content.slice(0, 30000) }));
    if (!files.length) throw new Error("Gemini did not return any valid source files.");
    return NextResponse.json({ summary: parsed.summary.slice(0, 1200), files, previewHtml: parsed.previewHtml.slice(0, 60000) });
  } catch (error) {
    console.error("Studio request failed", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to generate project." }, { status: 500 });
  }
}
