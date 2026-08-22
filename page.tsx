"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { ModulesShowcase } from "@/components/landing/modules-showcase";
import { ExamGrid } from "@/components/landing/exam-grid";
import { Footer } from "@/components/landing/footer";
import { OnboardingModal } from "@/components/landing/onboarding-modal";

export default function LandingPage() {
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const router = useRouter();

  function handleComplete(examId: string, days: number) {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("praveen_target_exam", examId);
      window.localStorage.setItem("praveen_days_until_exam", String(days));
    }
    setOnboardingOpen(false);
    router.push(days <= 10 ? "/crunch-mode" : "/chat");
  }

  return (
    <div>
      <Navbar onStart={() => setOnboardingOpen(true)} />
      <Hero onStart={() => setOnboardingOpen(true)} />
      <ModulesShowcase />
      <ExamGrid onSelect={() => setOnboardingOpen(true)} />
      <Footer />
      <OnboardingModal
        open={onboardingOpen}
        onOpenChange={setOnboardingOpen}
        onComplete={handleComplete}
      />
    </div>
  );
}
