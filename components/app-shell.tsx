"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrainCircuit, MessageSquareText, ClipboardCheck, Archive, Flame, Home, WandSparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/chat", label: "AI Teacher", icon: MessageSquareText },
  { href: "/test-engine", label: "Test Engine", icon: ClipboardCheck },
  { href: "/pyq-vault", label: "PYQ Vault", icon: Archive },
  { href: "/crunch-mode", label: "10-Day Crunch", icon: Flame },
  { href: "/studio", label: "AI Studio", icon: WandSparkles },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-60 shrink-0 border-r border-border/60 bg-surface md:flex md:flex-col">
        <div className="flex h-16 items-center gap-2 border-b border-border/60 px-5">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-electric to-emerald">
            <BrainCircuit className="h-4 w-4 text-background" />
          </div>
          <span className="font-display text-sm font-bold">
            PRAVEEN <span className="text-gradient">AI</span>
          </span>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {navItems.map((item) => {
            const active = pathname === item.href || (item.href === "/studio" && pathname.startsWith("/studio"));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  active ? "bg-electric/15 text-electric-glow" : "text-muted hover:bg-surface-2 hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-border/60 p-4 text-xs text-muted">
          Demo mode — data is mocked locally.
        </div>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-border/60 bg-surface/60 px-4 backdrop-blur md:hidden">
          <span className="font-display text-sm font-bold">
            PRAVEEN <span className="text-gradient">AI</span>
          </span>
          <nav className="flex items-center gap-3">
            {navItems.slice(1).map((item) => (
              <Link key={item.href} href={item.href} aria-label={item.label} className="text-muted hover:text-foreground">
                <item.icon className="h-5 w-5" />
              </Link>
            ))}
          </nav>
        </header>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
