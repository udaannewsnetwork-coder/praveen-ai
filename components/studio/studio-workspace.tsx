"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowDownToLine, ArrowUp, Bot, Check, Code2, Eye, FileCode2, FolderOpen, History, Loader2, Monitor, Plus, Rocket, Save, Sparkles, Tablet, WandSparkles } from "lucide-react";

type GeneratedFile = { path: string; content: string };
type Turn = { role: "user" | "assistant"; content: string };
type BuildResult = { summary: string; files: GeneratedFile[]; previewHtml: string };
type Snapshot = { id: string; at: number; result: BuildResult };

const starters = [
  "Build a modern ecommerce website for a sneaker brand",
  "Create a personal portfolio with projects and contact form",
  "Make a dashboard for tracking sales and customers",
];

export function StudioWorkspace() {
  const [prompt, setPrompt] = useState("");
  const [turns, setTurns] = useState<Turn[]>([]);
  const [result, setResult] = useState<BuildResult | null>(null);
  const [activeFile, setActiveFile] = useState(0);
  const [tab, setTab] = useState<"preview" | "code">("preview");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [versions, setVersions] = useState<Snapshot[]>([]);
  const [showVersions, setShowVersions] = useState(false);
  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [mode, setMode] = useState<"build" | "plan">("build");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("praveen-ai-studio-v1");
      if (raw) {
        const data = JSON.parse(raw);
        setResult(data.result || null);
        setTurns(data.turns || []);
        setVersions(data.versions || []);
      }
    } catch { /* Ignore corrupt local drafts. */ }
  }, []);

  const selectedFile = result?.files[activeFile];
  const preview = useMemo(() => result?.previewHtml || "", [result]);

  function persist(nextResult = result, nextTurns = turns, nextVersions = versions) {
    localStorage.setItem("praveen-ai-studio-v1", JSON.stringify({ result: nextResult, turns: nextTurns, versions: nextVersions }));
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  }

  function saveSnapshot() {
    if (!result) return;
    const next = [{ id: crypto.randomUUID(), at: Date.now(), result }, ...versions].slice(0, 20);
    setVersions(next);
    persist(result, turns, next);
  }

  function restoreSnapshot(snapshot: Snapshot) {
    setResult(snapshot.result);
    setActiveFile(0);
    persist(snapshot.result, turns, versions);
    setShowVersions(false);
  }

  function editCurrentFile(content: string) {
    if (!result || !selectedFile) return;
    const files = result.files.map((file, i) => i === activeFile ? { ...file, content } : file);
    const next = { ...result, files };
    setResult(next);
    persist(next);
  }

  function downloadFile(file: GeneratedFile) {
    const blob = new Blob([file.content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.path.split("/").pop() || "project-file.txt";
    a.click();
    URL.revokeObjectURL(url);
  }

  function downloadAll() {
    result?.files.forEach((file) => downloadFile(file));
  }

  async function sendMessage(value = prompt) {
    const message = value.trim();
    if (!message || busy) return;
    const nextTurns = [...turns, { role: "user" as const, content: message }];
    setTurns(nextTurns);
    setPrompt("");
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/studio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextTurns, currentFiles: result?.files ?? [], mode }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Studio request failed");
      const nextResult = { summary: data.summary, files: data.files, previewHtml: data.previewHtml || "" };
      const nextHistory = [...nextTurns, { role: "assistant" as const, content: data.summary }];
      setResult(nextResult);
      setActiveFile(0);
      setTurns(nextHistory);
      persist(nextResult, nextHistory);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setTurns(nextTurns);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#090b12] text-slate-100">
      <header className="flex min-h-16 flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-3 md:px-7">
        <div className="flex items-center gap-3">
          <a href="/" className="text-sm text-slate-400 hover:text-white">← Praveen AI</a>
          <span className="text-white/20">/</span>
          <div className="flex items-center gap-2 font-semibold"><span className="grid h-8 w-8 place-items-center rounded-xl bg-violet-500/20 text-violet-300"><WandSparkles size={17}/></span> AI Studio</div>
          <span className="hidden rounded-full border border-violet-400/30 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-violet-300 sm:inline-flex">Gemini powered</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] text-slate-500">{saved ? "Saved on this device" : "Local project draft"}</span>
          <button onClick={() => persist()} className="rounded-lg border border-white/10 px-3 py-2 text-xs text-slate-300 hover:bg-white/5"><Save size={13} className="mr-1 inline"/> Save</button>
          <button onClick={saveSnapshot} disabled={!result} className="rounded-lg border border-white/10 px-3 py-2 text-xs text-slate-300 hover:bg-white/5 disabled:opacity-40"><History size={13} className="mr-1 inline"/> Version</button>
          <button onClick={downloadAll} disabled={!result} className="rounded-lg bg-violet-500 px-3 py-2 text-xs text-white hover:bg-violet-400 disabled:opacity-40"><ArrowDownToLine size={13} className="mr-1 inline"/> Export files</button>
          <button onClick={() => { setTurns([]); setResult(null); setError(""); setVersions([]); localStorage.removeItem("praveen-ai-studio-v1"); }} className="rounded-lg border border-white/10 px-3 py-2 text-xs text-slate-300 hover:bg-white/5"><Plus size={13} className="mr-1 inline"/> New</button>
        </div>
      </header>

      {showVersions && <div className="fixed inset-0 z-30 flex justify-end bg-black/60" onClick={() => setShowVersions(false)}><div className="h-full w-full max-w-sm overflow-y-auto border-l border-white/10 bg-[#101421] p-5" onClick={(e) => e.stopPropagation()}><div className="mb-4 flex items-center justify-between"><h2 className="font-semibold">Version history</h2><button onClick={() => setShowVersions(false)} className="text-sm text-slate-400">Close</button></div>{versions.length ? versions.map((v) => <button key={v.id} onClick={() => restoreSnapshot(v)} className="mb-2 block w-full rounded-xl border border-white/10 p-3 text-left hover:bg-white/5"><div className="text-xs font-medium">{v.result.summary}</div><div className="mt-1 text-[10px] text-slate-500">{new Date(v.at).toLocaleString()} · {v.result.files.length} files</div></button>) : <p className="text-sm text-slate-500">No saved versions yet. Use Version to create a snapshot.</p>}</div></div>}

      <div className="grid min-h-[calc(100vh-64px)] lg:grid-cols-[350px_minmax(0,1fr)]">
        <aside className="flex min-h-[420px] flex-col border-b border-white/10 bg-[#0d101a] lg:border-b-0 lg:border-r">
          <div className="border-b border-white/10 p-5">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold"><Sparkles size={16} className="text-violet-300"/> Build with AI</div>
            <p className="text-xs leading-5 text-slate-500">Describe what you want to create. Gemini can generate a front-end prototype and revise its files.</p>
            <div className="mt-4 flex rounded-lg border border-white/10 p-1"><button onClick={() => setMode("build")} className={`flex-1 rounded-md py-2 text-xs ${mode === "build" ? "bg-violet-500/20 text-violet-200" : "text-slate-500"}`}>Build mode</button><button onClick={() => setMode("plan")} className={`flex-1 rounded-md py-2 text-xs ${mode === "plan" ? "bg-violet-500/20 text-violet-200" : "text-slate-500"}`}>Plan mode</button></div>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {turns.length === 0 ? <div className="pt-5"><div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-violet-500/15 text-violet-300"><Bot size={23}/></div><h2 className="mb-2 text-lg font-semibold">What will you create?</h2><p className="mb-5 text-sm leading-6 text-slate-500">Start with an idea. Refine the design and ask Gemini to update generated files.</p>{starters.map((s) => <button key={s} onClick={() => sendMessage(s)} className="mb-2 block w-full rounded-xl border border-white/10 p-3 text-left text-xs leading-5 text-slate-300 transition hover:border-violet-400/40 hover:bg-violet-400/5">{s}</button>)}</div> : turns.map((turn, i) => <div key={i} className={turn.role === "user" ? "ml-7 rounded-2xl rounded-tr-sm bg-violet-500/15 p-3 text-sm text-violet-100" : "mr-3 rounded-2xl rounded-tl-sm border border-white/10 bg-white/[0.03] p-3 text-sm leading-6 text-slate-300"}>{turn.role === "assistant" && <div className="mb-1 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-violet-300"><Sparkles size={11}/> Gemini</div>}{turn.content}</div>)}
            {busy && <div className="flex items-center gap-2 p-3 text-xs text-violet-300"><Loader2 size={15} className="animate-spin"/> Gemini is working…</div>}
            {error && <div className="rounded-xl border border-rose-400/20 bg-rose-400/10 p-3 text-xs text-rose-200">{error}</div>}
          </div>
          <div className="border-t border-white/10 p-4"><div className="rounded-2xl border border-white/15 bg-[#141827] p-3 focus-within:border-violet-400/50"><textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }} placeholder="Describe your app or request a change…" rows={3} className="w-full resize-none bg-transparent text-sm text-white outline-none placeholder:text-slate-600"/><div className="mt-2 flex items-center justify-between"><span className="text-[10px] text-slate-600">Enter to send · Shift + Enter for new line</span><button disabled={!prompt.trim() || busy} onClick={() => sendMessage()} className="grid h-9 w-9 place-items-center rounded-xl bg-violet-500 text-white transition hover:bg-violet-400 disabled:opacity-40"><ArrowUp size={17}/></button></div></div></div>
        </aside>

        <main className="flex min-w-0 flex-col">
          <div className="flex min-h-14 flex-wrap items-center justify-between gap-2 border-b border-white/10 px-4 py-3 md:px-6"><div className="flex items-center gap-2 text-xs text-slate-400"><FolderOpen size={15}/> {result ? "Generated project" : "Your project"} <span className="text-slate-700">/</span> <span className="text-slate-200">{selectedFile?.path || "Preview"}</span></div><div className="flex flex-wrap items-center gap-1 rounded-lg border border-white/10 p-1"><button onClick={() => setTab("preview")} className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs ${tab === "preview" ? "bg-white/10 text-white" : "text-slate-500"}`}><Eye size={13}/> Preview</button><button onClick={() => setTab("code")} className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs ${tab === "code" ? "bg-white/10 text-white" : "text-slate-500"}`}><Code2 size={13}/> Code editor</button><button onClick={() => setShowVersions(true)} className="rounded-md px-2 py-1.5 text-xs text-slate-400 hover:bg-white/5"><History size={13}/></button></div></div>
          {result && <div className="border-b border-white/10 bg-violet-500/[0.06] px-5 py-3 text-xs leading-5 text-violet-100"><Check size={13} className="mr-2 inline text-emerald-300"/>{result.summary}</div>}
          <div className="flex min-h-[520px] flex-1">
            {tab === "code" && result && <aside className="w-44 shrink-0 overflow-y-auto border-r border-white/10 bg-[#0d101a] p-3 sm:w-52"><div className="mb-3 px-2 text-[10px] font-semibold uppercase tracking-widest text-slate-600">Project files</div>{result.files.map((file, i) => <button key={file.path} onClick={() => setActiveFile(i)} className={`mb-1 flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-xs ${i === activeFile ? "bg-violet-500/15 text-violet-200" : "text-slate-400 hover:bg-white/5"}`}><FileCode2 size={13}/><span className="truncate">{file.path}</span></button>)}</aside>}
            <section className="min-w-0 flex-1 bg-[#0a0d15] p-3 md:p-6">
              {tab === "preview" ? preview ? <div className={`mx-auto h-[680px] max-w-full overflow-hidden rounded-xl border border-white/15 bg-white shadow-2xl transition-all ${viewport === "mobile" ? "w-[390px]" : viewport === "tablet" ? "w-[768px]" : "w-full"}`}><div className="flex h-10 items-center justify-between border-b bg-slate-100 px-3"><div className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-full bg-rose-400"/><i className="h-2.5 w-2.5 rounded-full bg-amber-400"/><i className="h-2.5 w-2.5 rounded-full bg-emerald-400"/><span className="ml-2 text-[10px] text-slate-500">Isolated preview</span></div><div className="flex gap-1"><button onClick={() => setViewport("desktop")} title="Desktop" className="rounded p-1 text-slate-500 hover:bg-slate-200"><Monitor size={14}/></button><button onClick={() => setViewport("tablet")} title="Tablet" className="rounded p-1 text-slate-500 hover:bg-slate-200"><Tablet size={14}/></button><button onClick={() => setViewport("mobile")} title="Mobile" className="rounded p-1 text-slate-500 hover:bg-slate-200"><span className="text-xs">▯</span></button></div></div><iframe title="Generated app preview" sandbox="allow-scripts" srcDoc={preview} className="h-[calc(100%-40px)] w-full bg-white"/></div> : <div className="mx-auto flex min-h-[500px] max-w-xl flex-col items-center justify-center text-center"><div className="mb-5 grid h-16 w-16 place-items-center rounded-2xl border border-violet-400/20 bg-violet-500/10 text-violet-300"><Monitor size={28}/></div><h2 className="mb-2 text-lg font-semibold">Live preview will appear here</h2><p className="max-w-sm text-sm leading-6 text-slate-500">Describe your idea in the chat. Gemini will generate a project and an isolated preview.</p></div> : selectedFile ? <div className="mx-auto max-w-5xl overflow-hidden rounded-xl border border-white/10 bg-[#0d101a]"><div className="flex items-center justify-between border-b border-white/10 px-4 py-3 text-xs text-slate-400"><span><FileCode2 size={14} className="mr-2 inline"/>{selectedFile.path}</span><button onClick={() => downloadFile(selectedFile)} className="hover:text-white"><ArrowDownToLine size={14}/></button></div><textarea aria-label="Edit source code" spellCheck={false} value={selectedFile.content} onChange={(e) => editCurrentFile(e.target.value)} className="min-h-[620px] w-full resize-y bg-[#0d101a] p-5 font-mono text-xs leading-6 text-slate-300 outline-none focus:bg-[#101522]"/></div> : <div className="flex min-h-[500px] items-center justify-center text-sm text-slate-600">Generated source files will appear here.</div>}
            </section>
          </div>
          <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-white/10 px-5 py-3 text-[10px] text-slate-600"><span>Praveen AI Studio · Gemini generation · local drafts and snapshots</span><span>Backend, integrations and cloud deployment require provider setup</span></footer>
        </main>
      </div>
    </div>
  );
}
