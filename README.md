# PRAVEEN AI

Hyper-personalized AI teacher and exam-prep platform for Indian students — 10th/12th Boards,
JEE, NEET, CUET, SSC, UPSC, Banking, NDA, CDS and Airforce.

## Stack
- Next.js 14 (App Router) + React + TypeScript
- Tailwind CSS + custom design tokens (dark theme, electric blue / emerald accents)
- Radix primitives wrapped as shadcn-style UI components
- Framer Motion for interaction/motion
- react-markdown + remark-math + rehype-katex for clean LaTeX rendering
- Prisma + PostgreSQL schema (User, TestSession, PYQBank, ChatHistory, WeaknessMap)
- Supabase auth/storage wiring points (`.env.example`)
- Server Actions wrapping an AI tutor call (`lib/ai.ts`) — swap the mock for a real
  OpenAI/Gemini call using the included `PRAVEEN_SYSTEM_PROMPT`

## Getting started

```bash
npm install
cp .env.example .env       # fill in DATABASE_URL, Supabase keys, OPENAI_API_KEY/GEMINI_API_KEY
npx prisma generate
npx prisma db push         # once DATABASE_URL points at a real Postgres instance
npm run dev
```

The app runs fully interactive out of the box on **mock data** (`lib/mock-data.ts`) — no
database or API key is required to click through every module.

## Structure

```
app/
  page.tsx                  Landing page (hero, modules, exam grid, onboarding modal)
  chat/                     AI Teacher chatbot (Socratic tutoring, image upload, KaTeX)
  test-engine/              Custom test creator -> NTA-style test portal -> analytics
  pyq-vault/                Searchable PYQ archive with "Solve with AI"
  crunch-mode/              10-Day Final Crunch: heatmap, flashcards, rapid quiz, planner
components/
  ui/                       Button, Card, Dialog, Tabs, Select, Badge, Progress
  landing/, chat/, test-engine/, crunch/   Feature-specific components
lib/
  ai.ts                     AI wrapper + system prompt (mocked; swap in real API call)
  mock-data.ts              All demo data (exams, questions, PYQs, heatmap)
  types.ts                  Shared TypeScript types
prisma/schema.prisma        Full database schema
```

## Swapping in a real model

`lib/ai.ts` exports `callModel()` and `explainPYQ()`. Replace the mock bodies with a real
call to the OpenAI or Gemini chat completions endpoint, passing `PRAVEEN_SYSTEM_PROMPT` as
the system message — every calling site (chat page, PYQ vault) already awaits these
functions as Server Actions, so no other code changes are required.

## Notes on this build

- Auth is stubbed: the onboarding flow stores the selected exam/day-count in
  `localStorage` so the UI is fully clickable without Supabase configured.
- Test Engine, Rapid Fire Quiz, and PYQ Vault all pull from a shared mock question pool —
  point them at `PYQBank`/your own question bank via Prisma for production data.
