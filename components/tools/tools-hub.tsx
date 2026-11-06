"use client";

import { useEffect, useMemo, useState } from "react";
import { BookOpen, Calculator, Clock3, FileText, GraduationCap, LockKeyhole, Map, ShoppingBag, Sparkles, Timer, Wrench } from "lucide-react";

type Tab = "tools" | "roadmaps" | "pro";
const roadmapData = [
  { title: "NDA", subtitle: "Written exam preparation", steps: ["Check the latest UPSC notification and eligibility", "Build Maths fundamentals: algebra, trigonometry, calculus", "Prepare English grammar, vocabulary and comprehension", "Cover Physics, Chemistry, History, Geography and current affairs", "Solve topic-wise PYQs and take timed mock tests", "Revise weak areas and verify the current exam pattern"] },
  { title: "IMU-CET", subtitle: "Merchant Navy entrance preparation", steps: ["Read the current IMU admission brochure and course criteria", "Revise Class 11–12 Physics, Chemistry and Mathematics", "Practice English, aptitude and general knowledge", "Attempt timed topic tests and previous papers", "Review accuracy and maintain an error notebook", "Complete application and document checks before deadlines"] },
  { title: "CUET", subtitle: "University entrance preparation", steps: ["Select target universities and check their subject requirements", "Map the required language, domain and general test papers", "Revise NCERT and official syllabus topics", "Practice section-wise MCQs under time limits", "Take full-length mocks and analyse mistakes", "Track official application, correction and counselling dates"] },
  { title: "Full-stack development", subtitle: "Beginner-to-project roadmap", steps: ["Learn HTML, CSS and responsive layouts", "Build JavaScript fundamentals and DOM projects", "Learn Git, GitHub and collaborative workflows", "Build React components and state-driven interfaces", "Learn APIs, databases, authentication and security basics", "Deploy a portfolio project and document it clearly"] },
];

const products = [
  { title: "Exam preparation books", description: "NCERT sets, NDA guides and CUET practice books", category: "Books" },
  { title: "Study desk essentials", description: "Study lamps, organisers and desk accessories", category: "Study" },
  { title: "Student audio gear", description: "Budget headphones and earbuds for focused study", category: "Gadgets" },
  { title: "Mobile coding setup", description: "OTG adapters, keyboards and phone coding accessories", category: "Coding" },
];

export default function ToolsHub() {
  const [tab, setTab] = useState<Tab>("tools");
  const [physics, setPhysics] = useState("");
  const [chemistry, setChemistry] = useState("");
  const [maths, setMaths] = useState("");
  const [maxMarks, setMaxMarks] = useState("100");
  const [birthDate, setBirthDate] = useState("");
  const [minutes, setMinutes] = useState(25);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState<string[]>([]);
  const [resume, setResume] = useState({ name: "", email: "", education: "", skills: "", projects: "" });
  const [roadmap, setRoadmap] = useState(0);

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => setSecondsLeft((s) => {
      if (s <= 1) { window.clearInterval(timer); setRunning(false); return 0; }
      return s - 1;
    }), 1000);
    return () => window.clearInterval(timer);
  }, [running]);

  const percentage = useMemo(() => {
    const values = [physics, chemistry, maths].map(Number);
    const totalMax = Number(maxMarks) * 3;
    if (values.some((v, i) => !Number.isFinite(v) || v < 0 || v > Number(maxMarks)) || !Number.isFinite(totalMax) || totalMax <= 0) return null;
    return (values.reduce((a, b) => a + b, 0) / totalMax) * 100;
  }, [physics, chemistry, maths, maxMarks]);

  const age = useMemo(() => {
    if (!birthDate) return null;
    const dob = new Date(birthDate + "T00:00:00");
    if (Number.isNaN(dob.getTime()) || dob > new Date()) return null;
    const now = new Date();
    let years = now.getFullYear() - dob.getFullYear();
    if (now.getMonth() < dob.getMonth() || (now.getMonth() === dob.getMonth() && now.getDate() < dob.getDate())) years--;
    return years;
  }, [birthDate]);

  function resetTimer(nextMinutes = minutes) {
    setMinutes(nextMinutes);
    setSecondsLeft(nextMinutes * 60);
    setRunning(false);
  }

  function addTask() {
    if (!task.trim()) return;
    setTasks((current) => [...current, task.trim()]);
    setTask("");
  }

  function printResume() {
    window.print();
  }

  const tabs = [
    { id: "tools" as const, label: "Free Tools Hub", icon: Wrench },
    { id: "roadmaps" as const, label: "Exam Roadmaps", icon: Map },
    { id: "pro" as const, label: "Pro Store & Deals", icon: ShoppingBag },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-8 rounded-3xl border border-electric/20 bg-gradient-to-br from-electric/10 via-surface to-emerald/5 p-6 sm:p-8">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-electric-glow"><Sparkles className="h-4 w-4" /> PRAVEEN AI • STUDENT WORKSPACE</div>
        <h1 className="font-display text-3xl font-bold sm:text-4xl">One workspace. <span className="text-gradient">More progress.</span></h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">Study smarter with practical calculators, a focus timer, printable resume builder and guided learning roadmaps.</p>
        <div className="mt-6 flex flex-wrap gap-2">
          {tabs.map(({ id, label, icon: Icon }) => <button key={id} onClick={() => setTab(id)} className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${tab === id ? "border-electric/50 bg-electric/15 text-electric-glow" : "border-border bg-surface/70 text-muted hover:text-foreground"}`}><Icon className="h-4 w-4" />{label}</button>)}
        </div>
      </div>

      {tab === "tools" && <div className="grid gap-5 lg:grid-cols-2">
        <section className="rounded-2xl border border-border bg-surface p-5">
          <div className="mb-4 flex items-center gap-2"><Calculator className="h-5 w-5 text-electric-glow" /><h2 className="font-display text-lg font-bold">PCM Percentage Calculator</h2></div>
          <p className="mb-4 text-xs text-muted">Enter marks for Physics, Chemistry and Mathematics. All three subjects must use the same maximum marks.</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[["Physics", physics, setPhysics], ["Chemistry", chemistry, setChemistry], ["Maths", maths, setMaths], ["Max marks", maxMarks, setMaxMarks]].map(([label, value, setter]: any) => <label key={label} className="text-xs text-muted">{label}<input type="number" min="0" value={value} onChange={(e) => setter(e.target.value)} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-electric" placeholder="0" /></label>)}
          </div>
          <div className="mt-4 rounded-xl bg-background p-4"><p className="text-xs text-muted">PCM percentage</p><p className="mt-1 text-3xl font-bold text-gradient">{percentage === null ? "—" : `${percentage.toFixed(2)}%`}</p></div>
        </section>

        <section className="rounded-2xl border border-border bg-surface p-5">
          <div className="mb-4 flex items-center gap-2"><GraduationCap className="h-5 w-5 text-electric-glow" /><h2 className="font-display text-lg font-bold">Age Calculator</h2></div>
          <label className="text-xs text-muted">Date of birth<input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} className="mt-2 block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground" /></label>
          <div className="mt-4 rounded-xl bg-background p-4"><p className="text-xs text-muted">Your current age</p><p className="mt-1 text-3xl font-bold text-gradient">{age === null ? "—" : `${age} years`}</p></div>
          <p className="mt-3 text-xs leading-5 text-muted">This is an age calculator, not an official eligibility decision. NDA, IMU-CET and other exam age limits depend on the specific notification, date window, gender/course criteria and other conditions. Always verify the latest official notice.</p>
        </section>

        <section className="rounded-2xl border border-border bg-surface p-5">
          <div className="mb-4 flex items-center gap-2"><Timer className="h-5 w-5 text-electric-glow" /><h2 className="font-display text-lg font-bold">Pomodoro Focus Timer</h2></div>
          <div className="py-3 text-center"><p className="font-mono text-5xl font-bold tabular-nums">{String(Math.floor(secondsLeft / 60)).padStart(2, "0")}:{String(secondsLeft % 60).padStart(2, "0")}</p><p className="mt-2 text-xs text-muted">Focus session</p></div>
          <div className="flex flex-wrap justify-center gap-2">{[15, 25, 45, 60].map((m) => <button key={m} onClick={() => resetTimer(m)} className={`rounded-lg border px-3 py-1.5 text-xs ${minutes === m ? "border-electric text-electric-glow" : "border-border text-muted"}`}>{m} min</button>)}</div>
          <div className="mt-4 flex justify-center gap-2"><button onClick={() => setRunning(!running)} className="rounded-xl bg-electric px-5 py-2 text-sm font-bold text-background">{running ? "Pause" : secondsLeft === 0 ? "Finished" : "Start"}</button><button onClick={() => resetTimer()} className="rounded-xl border border-border px-5 py-2 text-sm">Reset</button></div>
        </section>

        <section className="rounded-2xl border border-border bg-surface p-5">
          <div className="mb-4 flex items-center gap-2"><FileText className="h-5 w-5 text-electric-glow" /><h2 className="font-display text-lg font-bold">Resume & Project Profile</h2></div>
          <div className="grid gap-2 sm:grid-cols-2">{([["name","Full name"],["email","Email"],["education","Education"],["skills","Skills (comma separated)"],["projects","Projects / achievements"]] as const).map(([key,label]) => <label key={key} className={`text-xs text-muted ${key === "projects" ? "sm:col-span-2" : ""}`}>{label}<input value={resume[key]} onChange={(e) => setResume((r) => ({...r,[key]:e.target.value}))} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground" /></label>)}</div>
          <button onClick={printResume} className="mt-4 rounded-xl bg-electric px-4 py-2 text-sm font-bold text-background">Print / Save as PDF</button>
          <div className="print-resume mt-4 hidden rounded-xl bg-white p-6 text-black print:block"><h2 className="text-2xl font-bold">{resume.name || "Your Name"}</h2><p>{resume.email}</p><h3 className="mt-5 font-bold">Education</h3><p>{resume.education}</p><h3 className="mt-4 font-bold">Skills</h3><p>{resume.skills}</p><h3 className="mt-4 font-bold">Projects & Achievements</h3><p>{resume.projects}</p></div>
        </section>
        <section className="rounded-2xl border border-border bg-surface p-5 lg:col-span-2">
          <div className="mb-4 flex items-center gap-2"><Clock3 className="h-5 w-5 text-electric-glow" /><h2 className="font-display text-lg font-bold">Study Task Tracker</h2></div>
          <div className="flex gap-2"><input value={task} onChange={(e) => setTask(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addTask()} placeholder="Add a study task…" className="min-w-0 flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm" /><button onClick={addTask} className="rounded-lg bg-electric px-4 text-sm font-bold text-background">Add task</button></div>
          <ul className="mt-3 space-y-2">{tasks.map((item, i) => <li key={i} className="rounded-lg bg-background px-3 py-2 text-sm">{item}</li>)}</ul>
          {tasks.length === 0 && <p className="mt-3 text-xs text-muted">Your tasks will appear here.</p>}
        </section>
      </div>}

      {tab === "roadmaps" && <section className="rounded-2xl border border-border bg-surface p-5 sm:p-7">
        <div className="mb-5 flex items-center gap-2"><BookOpen className="h-5 w-5 text-electric-glow" /><h2 className="font-display text-xl font-bold">Choose your roadmap</h2></div>
        <div className="flex flex-wrap gap-2">{roadmapData.map((r, i) => <button key={r.title} onClick={() => setRoadmap(i)} className={`rounded-xl border px-4 py-2 text-sm ${roadmap === i ? "border-electric bg-electric/10 text-electric-glow" : "border-border text-muted"}`}>{r.title}</button>)}</div>
        <div className="mt-6"><h3 className="text-lg font-bold">{roadmapData[roadmap].title}</h3><p className="mt-1 text-sm text-muted">{roadmapData[roadmap].subtitle}</p><ol className="mt-5 space-y-3">{roadmapData[roadmap].steps.map((step, i) => <li key={step} className="flex gap-3 rounded-xl border border-border bg-background p-4"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-electric/15 text-sm font-bold text-electric-glow">{i + 1}</span><span className="pt-1 text-sm">{step}</span></li>)}</ol><p className="mt-4 text-xs text-muted">Roadmaps are general study guidance. Check each exam's latest official syllabus, eligibility and notification before applying.</p></div>
      </section>}

      {tab === "pro" && <div className="space-y-5">
        <section className="rounded-2xl border border-electric/25 bg-gradient-to-r from-electric/10 to-emerald/5 p-6"><div className="flex items-center gap-2 text-electric-glow"><LockKeyhole className="h-5 w-5" /><span className="text-sm font-semibold">PRAVEEN AI PRO</span></div><h2 className="mt-2 text-2xl font-bold">Unlock more ways to learn</h2><p className="mt-2 max-w-2xl text-sm text-muted">Pro templates and premium modes are being prepared. Payment QR, contact link and secure activation will be connected after the owner supplies the official details and backend verification is configured.</p><p className="mt-4 text-lg font-bold">Planned price: ₹29 <span className="text-sm font-normal text-muted">/ lifetime (subject to final setup)</span></p></section>
        <section><h3 className="mb-3 font-display text-lg font-bold">Recommended student essentials</h3><div className="grid gap-3 sm:grid-cols-2">{products.map((p) => <article key={p.title} className="rounded-2xl border border-border bg-surface p-5"><span className="text-xs font-semibold text-electric-glow">{p.category}</span><h4 className="mt-2 font-bold">{p.title}</h4><p className="mt-1 text-sm text-muted">{p.description}</p><p className="mt-4 text-xs text-muted">Affiliate link not connected yet</p></article>)}</div><p className="mt-4 text-xs text-muted">Affiliate links and a clear affiliate disclosure will be added once your approved Amazon Associates URLs are provided.</p></section>
        <section className="rounded-2xl border border-dashed border-border p-5"><h3 className="font-semibold">Sponsored placements</h3><p className="mt-1 text-sm text-muted">Ad space is reserved for a compliant ad network snippet after the ad account and exact approved code are available.</p></section>
      </div>}
      <style jsx global>{`@media print { body * { visibility: hidden !important; } .print-resume, .print-resume * { visibility: visible !important; } .print-resume { display: block !important; position: absolute; inset: 0; width: 100%; } }`}</style>
    </div>
  );
}
