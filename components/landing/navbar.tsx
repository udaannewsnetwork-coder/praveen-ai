"use client";
import Link from "next/link";
import { BrainCircuit } from "lucide-react";
import { Button } from "@/components/ui/button";

const links = [
  { href: "/chat", label: "AI Teacher" },
  { href: "/test-engine", label: "Test Engine" },
  { href: "/pyq-vault", label: "PYQ Vault" },
  { href: "/crunch-mode", label: "10-Day Crunch" },\n  { href: "/tools", label: "Free Tools" },
];

export function Navbar({ onStart }: { onStart: () => void }) {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-electric to-emerald">
            <BrainCircuit className="h-4.5 w-4.5 text-background" />
          </div>
          <span className="font-display text-lg font-bold tracking-tight">
            PRAVEEN <span className="text-gradient">AI</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="text-sm text-muted transition-colors hover:text-foreground">
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
            Log in
          </Button>
          <Button variant="primary" size="sm" onClick={onStart}>
            Start free
          </Button>
        </div>
      </div>
    </header>
  );
}
