"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QrCode } from "lucide-react";

const rotatingExams = ["JEE MAIN 2027", "NEET UG 2027", "CBSE CLASS 12", "SSC CGL", "NDA I 2027"];

export function AdmitCard() {
  const [index, setIndex] = useState(0);
  const [rollNumber, setRollNumber] = useState("240071829");

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % rotatingExams.length);
      setRollNumber(Math.floor(100000000 + Math.random() * 900000000).toString());
    }, 2600);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative rounded-2xl border border-border bg-surface p-1 shadow-[0_30px_80px_-20px_rgba(46,143,255,0.25)]">
      <div className="rounded-xl border border-border/80 bg-surface-2 p-5">
        <div className="flex items-start justify-between border-b border-dashed border-border pb-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted">Admit Card · Live Prep</p>
            <AnimatePresence mode="wait">
              <motion.p
                key={rotatingExams[index]}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.35 }}
                className="font-display text-lg font-bold text-foreground"
              >
                {rotatingExams[index]}
              </motion.p>
            </AnimatePresence>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-br from-electric to-emerald text-background">
            <QrCode className="h-6 w-6" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 py-4 text-sm">
          <Field label="Candidate">You</Field>
          <Field label="Roll No.">
            <span className="font-mono tabular-nums">{rollNumber}</span>
          </Field>
          <Field label="Tutor Assigned">Praveen AI</Field>
          <Field label="Status">
            <span className="inline-flex items-center gap-1.5 text-emerald-glow">
              <span className="h-1.5 w-1.5 animate-pulse-glow rounded-full bg-emerald-glow" />
              Preparing
            </span>
          </Field>
        </div>

        <div className="hall-ticket-stub flex items-center justify-between border-t border-dashed border-border pt-4 text-xs text-muted">
          <span>Valid until you crack it.</span>
          <span className="font-mono">PRV-AI</span>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.15em] text-muted">{label}</p>
      <p className="font-medium text-foreground">{children}</p>
    </div>
  );
}
