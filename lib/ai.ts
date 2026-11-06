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

function buildSystemPrompt(): string {
  const approvedLinks = (process.env.AMAZON_AFFILIATE_LINKS ?? "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const separator = line.indexOf("|");
      if (separator < 1) return null;
      const label = line.slice(0, separator).trim();
      const url = line.slice(separator + 1).trim();
      if (!label || (!/^https:\/\/(www\.)?amazon\.in\//i.test(url) && !/^https:\/\/amzn\.to\//i.test(url))) return null;
      return \`- ${label}: ${url}\`;
    })
    .filter((item): item is string => Boolean(item));

  if (approvedLinks.length === 0) return PRAVEEN_SYSTEM_PROMPT;

  return \`${PRAVEEN_SYSTEM_PROMPT}

Affiliate recommendation rule:
- Only when the question is about study routines, exams, books, or coding/tech setup, add a short final section titled "📚 Recommended for You:".
- Recommend at most one relevant item from this approved list and use its exact URL as a Markdown link.
- Add a brief affiliate disclosure: "As an Amazon Associate, the site may earn from qualifying purchases."
- Never invent, alter, or substitute affiliate URLs. If no item is relevant, omit this section.

Approved affiliate links:
${approvedLinks.join("\n")}\`;
}

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
  const apiKey = process.env.GEMINI_API_KEY;

  // If a real key is configured, call the live Gemini API.
  if (apiKey) {
    try {
      return await callGemini(apiKey, params.messages);
    } catch (err: any) {
      // TEMP DEBUG: surface the real error directly in the chat so it's visible
      // on mobile without digging through Vercel logs. Remove this block once
      // the integration is confirmed working, and let it silently fall back instead.
      const message = err?.message ?? String(err);
      return `⚠️ **Debug — Gemini call failed:**\n\n\`\`\`\n${message}\n\`\`\`\n\nThis is a temporary debug message so we can see the exact error. Once fixed, this will be replaced by a real AI reply.`;
    }
  }

  // Fallback: mock tutor (used when no API key is set at all).
  const lastUserMessage = params.messages[params.messages.length - 1]?.content ?? "";
  const priorTurns = params.messages.length;
  return mockSocraticReply(lastUserMessage, priorTurns);
}

async function callGemini(
  apiKey: string,
  messages: { role: "user" | "assistant"; content: string }[]
): Promise<string> {
  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const res = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: buildSystemPrompt() }] },
        contents,
      }),
    }
  );

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gemini API error ${res.status}: ${errText}`);
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.map((p: any) => p.text).join("") ?? "";
  if (!text) throw new Error("Gemini API returned an empty response");
  return text;
}

export async function explainPYQ(question: string, chapter: string, solution: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    try {
      return await callGemini(apiKey, [
        {
          role: "user",
          content: `A student is looking at this previous-year exam question from the chapter "${chapter}":\n\n${question}\n\nThe reference solution approach is: ${solution}\n\nExplain (1) the underlying concept, (2) the fastest shortcut method for solving this in an exam, and (3) the most common trap students fall into on this type of question. Keep it concise and use Markdown headers for each of the three parts.`,
        },
      ]);
    } catch (err) {
      console.error("Gemini call failed for PYQ explain, falling back to mock:", err);
    }
  }

  return `**Underlying concept:** This question is built entirely around ${chapter}. The moment you spot that framing, you should reach for the standard identity/law for this chapter before reading the options.

**Shortcut method:** ${solution}

**Typical trap:** Students usually lose marks here by mixing up sign conventions or units — always re-check whether the question wants a magnitude or a signed value before selecting an option.`;
}

// ---- Broad keyword-based topic library for the demo tutor ----
// Each entry gives a first-step Socratic explanation. In production this
// entire function is replaced by a real LLM call.
const TOPIC_LIBRARY: { keywords: string[]; reply: string }[] = [
  {
    keywords: ["projectile"],
    reply: `Great choice — projectile motion shows up almost every year in JEE & NDA.

Let's build it step by step. A projectile launched at angle $\\theta$ with speed $u$ has two independent motions:

$$v_x = u\\cos\\theta \\quad (\\text{constant})$$
$$v_y = u\\sin\\theta - gt$$

**Quick check:** if $v_x$ never changes, what does that tell you about the horizontal acceleration during flight? Try answering before I continue.`,
  },
  {
    keywords: ["newton", "laws of motion", "force and acceleration"],
    reply: `Newton's Laws are the backbone of mechanics — let's take them one at a time.

**First Law (Inertia):** An object stays at rest or moves at constant velocity unless a net external force acts on it.

**Second Law:**
$$F = ma$$

**Quick check:** if a block is moving at constant velocity, what must the *net* force on it be? Think about it before I move to the Third Law.`,
  },
  {
    keywords: ["electrostatic", "coulomb"],
    reply: `Electrostatics is high-weightage for JEE/NEET. Let's start from the core law.

**Coulomb's Law:**
$$F = \\dfrac{1}{4\\pi\\varepsilon_0}\\dfrac{q_1 q_2}{r^2}$$

This tells you the force between two point charges. **Quick check:** if you double the distance $r$ between the charges, by what factor does the force change? Try it before I continue to electric field.`,
  },
  {
    keywords: ["current electricity", "ohm"],
    reply: `Let's build Current Electricity from the ground up.

**Ohm's Law:**
$$V = IR$$

Voltage across a resistor is directly proportional to the current through it, at constant temperature.

**Quick check:** if resistance $R$ is doubled while voltage $V$ stays the same, what happens to the current $I$? Work it out first.`,
  },
  {
    keywords: ["periodic table", "chemical bonding", "bonding"],
    reply: `Chemical bonding is one of the most tested chapters in Chemistry. Let's start with why atoms bond at all.

Atoms bond to achieve a stable electron configuration — usually a full outer shell (octet rule).

**Quick check:** if sodium (Na) has 1 electron in its outer shell and chlorine (Cl) has 7, what kind of bond would you expect between them — ionic or covalent? Think about which atom gains/loses the electron.`,
  },
  {
    keywords: ["organic", "reaction mechanism", "sn1", "sn2"],
    reply: `Organic reaction mechanisms feel intimidating at first, but they follow patterns. Let's start with the two main substitution mechanisms.

**SN1** goes through a carbocation intermediate — favoured by tertiary substrates.
**SN2** is a single concerted step — favoured by primary substrates with a strong nucleophile.

**Quick check:** would a tertiary alkyl halide more likely react via SN1 or SN2? Think about how crowded the carbon is.`,
  },
  {
    keywords: ["electrochemistry", "cell potential", "nernst"],
    reply: `Electrochemistry connects chemistry and current — very JEE/NEET-friendly once the base is clear.

**Standard cell potential:**
$$E^\\circ_{cell} = E^\\circ_{cathode} - E^\\circ_{anode}$$

**Quick check:** in a cell, does oxidation happen at the anode or cathode? Recall this before we bring in the Nernst equation.`,
  },
  {
    keywords: ["cell biology", "mitochondria", "cell structure"],
    reply: `Let's build up Cell Biology from the basic unit.

Every cell has a plasma membrane, cytoplasm, and genetic material. Mitochondria are the "powerhouse" — they carry out aerobic respiration to produce ATP.

**Quick check:** would you expect a muscle cell to have more or fewer mitochondria than a skin cell, given how much energy each needs? Think it through first.`,
  },
  {
    keywords: ["genetics", "mendel", "heredity"],
    reply: `Genetics is high-weightage for NEET. Let's start with Mendel's First Law.

**Law of Segregation:** the two alleles for a trait separate during gamete formation, so each gamete carries only one allele.

**Quick check:** if a parent is heterozygous (Aa), what are the possible alleles in its gametes? Try writing them before I continue to Punnett squares.`,
  },
  {
    keywords: ["human physiology", "digestion", "respiration", "circulation"],
    reply: `Human Physiology is best understood system by system. Which one do you want to start with — digestive, respiratory, or circulatory? 

For now, quick check: can you name one organ from each of those three systems? That'll tell me where to start explaining.`,
  },
  {
    keywords: ["trigonometr"],
    reply: `Trigonometric identities look scary until you see the pattern. Let's start with the most fundamental one.

$$\\sin^2\\theta + \\cos^2\\theta = 1$$

Every other identity in this chapter can be derived from this one relationship.

**Quick check:** using this identity, can you express $\\tan^2\\theta$ purely in terms of $\\sin\\theta$ and $\\cos\\theta$? Try before I show you the double-angle formulas.`,
  },
  {
    keywords: ["quadratic"],
    reply: `Quadratic equations are a guaranteed scoring chapter if the formula is second nature.

$$x = \\dfrac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$

**Quick check:** what does the term under the square root, $b^2 - 4ac$ (the discriminant), tell you about the nature of the roots? Think about the three possible cases before I explain.`,
  },
  {
    keywords: ["integration", "calculus", "differentiat"],
    reply: `Calculus rewards pattern recognition. Let's start with the core idea of differentiation.

$$\\dfrac{d}{dx}x^n = nx^{n-1}$$

This is the power rule — the base of almost every derivative you'll compute.

**Quick check:** using this rule, what is $\\dfrac{d}{dx}(3x^4)$? Work it out before we move to integration, which is just the reverse process.`,
  },
  {
    keywords: ["probability"],
    reply: `Probability is intuitive once you anchor it to counting. The core formula:

$$P(E) = \\dfrac{\\text{favourable outcomes}}{\\text{total outcomes}}$$

**Quick check:** if you roll a fair die once, what's the probability of getting an even number? Try counting favourable outcomes first.`,
  },
  {
    keywords: ["percentage", "profit and loss", "time and work"],
    reply: `This is a classic SSC/Banking Quant chapter — speed matters as much as accuracy here.

For percentage change:
$$\\% \\text{change} = \\dfrac{\\text{new value} - \\text{old value}}{\\text{old value}} \\times 100$$

**Quick check:** if a price increases from ₹80 to ₹100, what's the percentage increase? Try the calculation before I show you the shortcut for exams.`,
  },
  {
    keywords: ["polity", "constitution", "fundamental rights"],
    reply: `Indian Polity rewards structured revision. Let's anchor this to the Constitution's architecture.

The Constitution has three main organs it defines: the Legislature, Executive, and Judiciary — each checked by the others.

**Quick check:** which Part of the Constitution lists the Fundamental Rights? If you're not sure, that's fine — I'll walk you through the Parts list next.`,
  },
  {
    keywords: ["current affairs", "static gk"],
    reply: `For Current Affairs, the trick is linking news to static facts examiners love pairing them with.

**Quick check:** tell me one recent news item you've already read about (sports, defence, government scheme, appointment) — I'll show you how examiners usually twist it into an MCQ.`,
  },
];

function mockSocraticReply(input: string, turnCount: number): string {
  const lower = input.toLowerCase();

  if (/\b(hint|clue)\b/.test(lower)) {
    return `Sure, here's a bigger hint 👇

Think about which quantity is conserved when there's no friction or external horizontal force. Once you name that quantity, the next equation almost writes itself. Want me to go one level further, or do you want to attempt it now?`;
  }

  if (/\b(answer|solution|solve it|just tell me)\b/.test(lower) && turnCount > 2) {
    return `Fair enough — since we've already built up the concept step by step, here's the full working:

Apply the relevant formula for this topic, substitute the given values carefully (watch your units), and simplify. If you paste the exact numbers from your question, I'll walk the arithmetic through with you so it sticks for next time.`;
  }

  for (const topic of TOPIC_LIBRARY) {
    if (topic.keywords.some((kw) => lower.includes(kw))) {
      return topic.reply;
    }
  }

  // Generic but still useful fallback — echoes their topic instead of a canned line every time.
  const cleaned = input.trim().replace(/[?.!]+$/, "");
  return `Good question about **${cleaned || "this topic"}**. Let's build it up properly instead of me just stating the answer.

Can you tell me, in your own words, what you already know about this? Even a rough idea is fine — I'll start exactly where your understanding currently stops instead of repeating what you've already got.

(Tip: try naming the exact chapter — e.g. "explain trigonometric identities" or "explain Newton's laws" — and I'll jump straight into the step-by-step breakdown.)`;
}
