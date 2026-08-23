"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MarkdownMessage } from "@/components/chat/markdown-message";

const flashcards = [
  { front: "Kinematics — 2nd Equation of Motion", back: "$$s = ut + \\frac{1}{2}at^2$$" },
  { front: "Coulomb's Law", back: "$$F = \\dfrac{1}{4\\pi\\varepsilon_0}\\dfrac{q_1 q_2}{r^2}$$" },
  { front: "Ideal Gas Equation", back: "$$PV = nRT$$" },
  { front: "Quadratic Formula", back: "$$x = \\dfrac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$" },
  { front: "Ohm's Law", back: "$$V = IR$$" },
];

export function DailyFlashcards() {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const card = flashcards[index];

  function go(delta: number) {
    setFlipped(false);
    setIndex((i) => (i + delta + flashcards.length) % flashcards.length);
  }

  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-base font-semibold">Daily formula flashcards</h3>
        <span className="text-xs text-muted">{index + 1} / {flashcards.length}</span>
      </div>

      <button
        onClick={() => setFlipped((f) => !f)}
        className="flex h-40 w-full items-center justify-center rounded-xl border border-border bg-surface-2 p-6 text-center"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={flipped ? "back" : "front"}
            initial={{ opacity: 0, rotateX: 90 }}
            animate={{ opacity: 1, rotateX: 0 }}
            exit={{ opacity: 0, rotateX: -90 }}
            transition={{ duration: 0.3 }}
          >
            {flipped ? (
              <MarkdownMessage content={card.back} />
            ) : (
              <p className="font-display text-base font-semibold text-foreground">{card.front}</p>
            )}
          </motion.div>
        </AnimatePresence>
      </button>

      <div className="mt-4 flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={() => go(-1)}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setFlipped((f) => !f)}>
          <RotateCw className="mr-1.5 h-3.5 w-3.5" /> Flip
        </Button>
        <Button variant="outline" size="sm" onClick={() => go(1)}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}
