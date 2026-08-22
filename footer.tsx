import { BrainCircuit } from "lucide-react";

export function Footer() {
  return (
    <footer className="py-10">
      <div className="container flex flex-col items-center justify-between gap-4 text-sm text-muted sm:flex-row">
        <div className="flex items-center gap-2">
          <BrainCircuit className="h-4 w-4 text-emerald-glow" />
          <span>PRAVEEN AI © {new Date().getFullYear()}</span>
        </div>
        <p>Built for students chasing 10th, 12th, JEE, NEET, CUET, SSC, UPSC, Banking &amp; Defence.</p>
      </div>
    </footer>
  );
}
