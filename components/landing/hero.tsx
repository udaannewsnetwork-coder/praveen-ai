"use client";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdmitCard } from "./admit-card";

export function Hero({ onStart }: { onStart: () => void }) {
  return (
    <section className="relative overflow-hidden border-b border-border/60">
      <div className="absolute inset-0 bg-dot-grid opacity-40 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_10%,transparent_75%)]" />
      <div className="container relative grid items-center gap-14 py-16 md:py-24 lg:grid-cols-2 lg:py-28">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs text-muted">
            <Sparkles className="h-3.5 w-3.5 text-emerald-glow" />
            Built for Boards, JEE, NEET, CUET, SSC, UPSC &amp; Defence
          </div>
          <h1 className="font-display text-4xl font-bold leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-[3.4rem]">
            Your 24/7 personal AI tutor to{" "}
            <span className="text-gradient">crack exams faster.</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            PRAVEEN AI explains concepts step-by-step, sets mock tests like the real exam hall, mines
            10+ years of PYQs, and builds you an hour-by-hour revision plan when the exam is close.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button size="lg" onClick={onStart} className="group">
              Select your target exam
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
            <Button size="lg" variant="outline">
              See how it teaches
            </Button>
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-muted">
            <Stat value="11" label="exam tracks supported" />
            <Stat value="10+ yrs" label="PYQs indexed" />
            <Stat value="24/7" label="Socratic AI tutoring" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20, rotate: -2 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mx-auto w-full max-w-md"
        >
          <AdmitCard />
        </motion.div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="font-display text-xl font-bold text-foreground">{value}</div>
      <div className="text-xs text-muted">{label}</div>
    </div>
  );
}
