import { AnimatePresence, animate, motion, useAnimationControls, useInView, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { Dot, Heading, Panel, Pill, Reveal } from "./ui";

const EASE = [0.22, 1, 0.36, 1] as const;

function Counter({ value, className = "" }: { value: number; className?: string }) {
  const mv = useMotionValue(value);
  const [v, setV] = useState(value);
  useEffect(() => { const c = animate(mv, value, { duration: 0.8, ease: EASE }); return c.stop; }, [value, mv]);
  useEffect(() => mv.on("change", (x) => setV(Math.round(x))), [mv]);
  return <span className={`tabular-nums ${className}`}>{v}</span>;
}

function Gauge({ score, size = "max-w-[15rem]" }: { score: number; size?: string }) {
  const mv = useMotionValue(0);
  const pulse = useAnimationControls();
  const prev = useRef(score);
  useEffect(() => {
    const c = animate(mv, score, { duration: 0.9, ease: EASE });
    if ([50, 90].some((t) => prev.current < t && score >= t)) pulse.start({ scale: [1, 1.07, 1], transition: { duration: 0.6, delay: 0.5 } });
    prev.current = score;
    return c.stop;
  }, [score, mv, pulse]);
  const R = 88, C = 2 * Math.PI * R;
  const offset = useTransform(mv, (v) => C * (1 - v / 100));
  return (
    <motion.div animate={pulse} className={`relative mx-auto aspect-square w-full ${size}`}>
      <svg viewBox="0 0 200 200" className="-rotate-90">
        <circle cx="100" cy="100" r={R} fill="none" stroke="var(--border)" strokeWidth="7" />
        <motion.circle cx="100" cy="100" r={R} fill="none" stroke="var(--primary)" strokeWidth="7" strokeLinecap="round" strokeDasharray={C} style={{ strokeDashoffset: offset }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <Counter value={score} className={`display text-7xl transition-colors ${score >= 90 ? "text-primary" : ""}`} />
        <span className="text-sm text-muted-foreground">out of 100</span>
      </div>
    </motion.div>
  );
}

/* ---------- Visibility checker ---------- */
const CHECKS = [
  { q: "Do you have a personal academic website?", fix: "No personal website found", w: 20 },
  { q: "Is your Google Scholar profile public with the right affiliation?", fix: "Google Scholar profile not public or out of date", w: 20 },
  { q: "Is your ORCID linked to your other profiles?", fix: "ORCID not linked to your profiles", w: 15 },
  { q: "Do you have only one Scopus author ID?", fix: "Possible duplicate Scopus author IDs", w: 15 },
  { q: "Are your ResearchGate and LinkedIn profiles complete?", fix: "ResearchGate or LinkedIn incomplete", w: 15 },
  { q: "Do you post about your research at least monthly?", fix: "No regular posts about your work", w: 15 },
];
export function VisibilityCheck({ onAudit }: { onAudit: (d: { name: string; link: string; missing: string[] }) => void }) {
  const [name, setName] = useState("");
  const [link, setLink] = useState("");
  const [a, setA] = useState<boolean[]>(CHECKS.map(() => false));
  const [err, setErr] = useState("");
  const score = a.reduce((s, v, i) => s + (v ? CHECKS[i]!.w : 0), 0);
  const missing = CHECKS.filter((_, i) => !a[i]).map((c) => c.fix);
  const verdict = score >= 90 ? "You are easy to find. Let us keep it that way." : score >= 60 ? "A solid base. A few gaps are hiding you." : score >= 30 ? "You are harder to find than your work deserves." : "Most people searching for you will not find you yet.";
  return (
    <section id="visibility" className="border-y bg-tint">
      <div className="mx-auto max-w-7xl px-5 py-28 sm:px-8 sm:py-36">
        <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr] lg:items-end">
          <Reveal><Heading before="How" em="visible" after=" is your research" className="max-w-3xl" /></Reveal>
          <Reveal><p className="max-w-sm text-lg text-muted-foreground lg:justify-self-end">Free audit. Takes 30 seconds. Your score updates as you answer.</p></Reveal>
        </div>
        <div className="mt-14 grid gap-5 lg:grid-cols-[1.25fr_1fr]">
          <div className="rounded-[24px] border bg-background p-5 sm:p-7">
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-sm text-muted-foreground" htmlFor="vc-name">Full name
                <input id="vc-name" value={name} onChange={(e) => { setName(e.target.value); setErr(""); }} placeholder="Dr. Sara Ahmed" className="mt-1.5 w-full rounded-xl border bg-background px-4 py-3 text-[15px] text-foreground outline-none focus:border-primary" />
              </label>
              <label className="text-sm text-muted-foreground" htmlFor="vc-link">ORCID or Google Scholar link
                <input id="vc-link" value={link} onChange={(e) => setLink(e.target.value)} placeholder="orcid.org/0000-0000-0000-0000" className="mt-1.5 w-full rounded-xl border bg-background px-4 py-3 text-[15px] text-foreground outline-none focus:border-primary" />
              </label>
            </div>
            <div className="mt-5 border-t">
              {CHECKS.map((c, i) => (
                <div key={c.q} className="flex items-center justify-between gap-5 border-b py-4 last:border-b-0">
                  <span className="text-[15px] leading-snug">{c.q}</span>
                  <button role="switch" aria-checked={a[i]} aria-label={c.q} onClick={() => setA(a.map((v, j) => (j === i ? !v : v)))}
                    className={`relative h-7 w-12 shrink-0 rounded-full transition-colors duration-300 ${a[i] ? "bg-primary" : "bg-input"}`}>
                    <motion.span layout transition={{ type: "spring", stiffness: 500, damping: 30 }} className={`absolute top-1 h-5 w-5 rounded-full bg-background ${a[i] ? "right-1" : "left-1"}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col rounded-[24px] border bg-background p-6 sm:p-8">
            <Gauge score={score} />
            <p className="mt-2 text-center text-sm text-muted-foreground">Visibility score{name.trim() ? ` for ${name.trim()}` : ""}</p>
            <AnimatePresence mode="wait">
              <motion.p key={verdict} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="mt-4 text-center text-xl font-medium tracking-tight">{verdict}</motion.p>
            </AnimatePresence>
            <ul className="mt-6 flex-1">
              <AnimatePresence initial={false}>
                {missing.slice(0, 4).map((f) => (
                  <motion.li key={f} layout initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                    <span className="flex gap-3 border-t py-3 text-[15px]"><span className="text-destructive">●</span>{f}</span>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
            <div className="mt-6">
              <Pill onClick={() => { if (!name.trim()) { setErr("Enter your name to get the full audit"); return; } onAudit({ name: name.trim(), link: link.trim(), missing }); }}>Get my full audit</Pill>
              {err && <p className="mt-2 text-sm text-destructive">{err}</p>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Ranking difference calculator ---------- */
function position(score: number) {
  if (score >= 88) return { label: "#1", rank: 1, page: "First result" };
  if (score >= 72) return { label: "#3", rank: 3, page: "Page 1" };
  if (score >= 55) return { label: "#7", rank: 7, page: "Page 1, low" };
  if (score >= 35) return { label: "#14", rank: 14, page: "Page 2" };
  return { label: "#27", rank: 27, page: "Page 3 or lower" };
}
const OTHERS = ["Another researcher with your name", "Old university staff page", "Conference listing from 2019", "A news article that mentions you", "Directory listing"];

function SerpList({ rank, you, highlight }: { rank: number; you: string; highlight: boolean }) {
  const shown = Math.min(rank, 4);
  const rows = OTHERS.slice(0, 4).map((t) => ({ t, me: false }));
  rows.splice(shown - 1, 0, { t: you, me: true });
  return (
    <div className="space-y-2">
      {rows.slice(0, 4).map((r, i) => (
        <motion.div layout key={r.t} transition={{ type: "spring", stiffness: 140, damping: 20 }}
          className={`rounded-xl border px-3.5 py-2.5 ${r.me ? (highlight ? "border-primary bg-tint" : "border-dashed") : "bg-background"}`}>
          <p className={`text-[13px] font-medium leading-snug ${r.me && highlight ? "text-primary" : r.me ? "" : "text-muted-foreground"}`}>{r.t}</p>
          <div className="mt-1.5 h-1 w-1/2 rounded bg-secondary" />
          {i === 3 && rank > 4 && !r.me && null}
        </motion.div>
      ))}
      {rank > 4 && (
        <div className="rounded-xl border border-dashed px-3.5 py-2.5 text-[13px] text-muted-foreground">
          Your best result: position {rank}. Most people never scroll this far.
        </div>
      )}
    </div>
  );
}

export function RankingDifference() {
  const [profiles, setProfiles] = useState(3);
  const [site, setSite] = useState(false);
  const [dupes, setDupes] = useState(true);
  const [posts, setPosts] = useState(0);
  const today = Math.max(5, Math.min(95, profiles * 7 + (site ? 25 : 0) + (dupes ? 0 : 8) + posts * 2));
  const after = Math.max(today, 92);
  const pt = position(today), pa = position(after);
  return (
    <section id="results" className="mx-auto max-w-7xl px-5 py-28 sm:px-8 sm:py-36">
      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr] lg:items-end">
        <Reveal><Heading before="See your Google" em="difference" className="max-w-3xl" /></Reveal>
        <Reveal><p className="max-w-sm text-lg text-muted-foreground lg:justify-self-end">Set where you are today. See where a managed scholar presence puts you when someone searches your name.</p></Reveal>
      </div>
      <div className="mt-14 grid gap-5 lg:grid-cols-[0.85fr_1.5fr]">
        <div className="rounded-[24px] border p-6 sm:p-7">
          <p className="text-lg font-medium tracking-tight">Where you are today<Dot /></p>
          <div className="mt-6 space-y-7">
            <div>
              <div className="flex justify-between text-[15px]"><label htmlFor="rd-prof">Profiles set up correctly</label><span className="font-medium tabular-nums">{profiles} of 8</span></div>
              <input id="rd-prof" type="range" min={0} max={8} step={1} value={profiles} onChange={(e) => setProfiles(+e.target.value)} className="mt-3 w-full accent-[#2b59f3]" />
            </div>
            <div>
              <div className="flex justify-between text-[15px]"><label htmlFor="rd-posts">Posts about your work per month</label><span className="font-medium tabular-nums">{posts}</span></div>
              <input id="rd-posts" type="range" min={0} max={8} step={1} value={posts} onChange={(e) => setPosts(+e.target.value)} className="mt-3 w-full accent-[#2b59f3]" />
            </div>
            {([["Personal website", site, setSite], ["Duplicate author IDs", dupes, setDupes]] as const).map(([l, v, set]) => (
              <div key={l} className="flex items-center justify-between">
                <span className="text-[15px]">{l}</span>
                <div className="flex rounded-full border p-1 text-sm">
                  {["No", "Yes"].map((o, i) => (
                    <button key={o} onClick={() => set(i === 1)} className={`rounded-full px-4 py-1.5 transition-colors ${v === (i === 1) ? "bg-foreground text-background" : "text-muted-foreground"}`}>{o}</button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          {[{ k: "Today", p: pt, s: today, hl: false }, { k: "With Cited.", p: pa, s: after, hl: true }].map((c) => (
            <div key={c.k} className={`flex flex-col rounded-[24px] p-6 sm:p-7 ${c.hl ? "bg-navy text-navy-foreground" : "border bg-paper"}`}>
              <p className={`text-sm ${c.hl ? "text-navy-foreground/70" : "text-muted-foreground"}`}>{c.k}</p>
              <div className="mt-2 flex items-end justify-between gap-3">
                <AnimatePresence mode="popLayout">
                  <motion.p key={c.p.label} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} className={`display text-7xl ${c.hl ? "text-white" : ""}`}>{c.p.label}</motion.p>
                </AnimatePresence>
                <span className={`mb-2 text-right text-sm ${c.hl ? "text-navy-foreground/70" : "text-muted-foreground"}`}>{c.p.page}<br />for your name</span>
              </div>
              <div className="mt-5">
                <div className={`flex justify-between text-sm ${c.hl ? "text-navy-foreground/70" : "text-muted-foreground"}`}><span>Visibility score</span><Counter value={c.s} className="font-medium" /></div>
                <div className={`mt-2 h-2 overflow-hidden rounded-full ${c.hl ? "bg-navy-line" : "bg-secondary"}`}>
                  <motion.div className={`h-full rounded-full ${c.hl ? "bg-primary" : "bg-foreground/40"}`} animate={{ width: `${c.s}%` }} transition={{ duration: 0.8, ease: EASE }} />
                </div>
              </div>
              <div className={`mt-6 rounded-2xl p-3 ${c.hl ? "bg-background text-foreground" : "bg-background"}`}>
                <SerpList rank={c.p.rank} you={c.hl ? "Dr. Your Name, official website" : "Your Google Scholar page"} highlight={c.hl} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <p className="mt-6 text-sm text-muted-foreground">An illustrative estimate, not a guarantee. Real results depend on your name, field and record.</p>
    </section>
  );
}

/* ---------- Before / after ---------- */
function Presence({ after }: { after: boolean }) {
  const profiles = [["Google Scholar", "Public, verified", "Private"], ["ORCID", "Linked everywhere", "Not linked"], ["Scopus", "One author ID", "2 duplicate IDs"], ["ResearchGate", "All papers claimed", "Half claimed"], ["LinkedIn", "Academic headline", "Old job title"]];
  return (
    <div className={`h-full w-full p-6 sm:p-9 ${after ? "bg-background" : "bg-paper"}`}>
      <div className="flex items-center gap-4">
        {after ? <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-xl font-medium text-primary-foreground">YN</div> : <div className="h-16 w-16 rounded-full border border-dashed bg-secondary" />}
        <div>
          <p className="text-2xl font-medium tracking-tight">Dr. Your Name</p>
          <p className={`text-sm ${after ? "text-primary" : "text-muted-foreground/70"}`}>{after ? "yourname.com, first on Google" : "No website. Page 3 on Google"}</p>
        </div>
      </div>
      <div className="mt-6 grid gap-2 sm:grid-cols-2">
        {profiles.map(([p, good, bad]) => (
          <div key={p} className={`flex items-center justify-between rounded-xl border px-4 py-3 ${after ? "" : "border-dashed"}`}>
            <span className="text-[15px]">{p}</span>
            <span className={`text-xs ${after ? "text-primary" : "text-destructive/80"}`}>{after ? `✓ ${good}` : bad}</span>
          </div>
        ))}
        <div className={`flex items-center justify-between rounded-xl px-4 py-3 ${after ? "bg-foreground text-background" : "border border-dashed"}`}>
          <span className="text-[15px]">Monthly posts</span><span className="text-xs">{after ? "Blog and LinkedIn" : "None"}</span>
        </div>
      </div>
    </div>
  );
}
export function BeforeAfter() {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(88);
  const drag = useRef(false);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [mAfter, setMAfter] = useState(false);
  const mref = useRef<HTMLDivElement>(null);
  const mIn = useInView(mref, { once: true, amount: 0.5 });
  useEffect(() => { if (!mIn) return; const t = setTimeout(() => setMAfter(true), 1200); return () => clearTimeout(t); }, [mIn]);
  useEffect(() => {
    if (!inView) return;
    const c = animate(88, 28, { duration: 1.6, ease: [0.65, 0, 0.35, 1], onUpdate: (v) => !drag.current && setPos(v),
      onComplete: () => { if (!drag.current) animate(28, 52, { duration: 0.9, ease: EASE, onUpdate: (v) => !drag.current && setPos(v) }); } });
    return () => c.stop();
  }, [inView]);
  const move = (x: number) => { const r = ref.current!.getBoundingClientRect(); setPos(Math.min(100, Math.max(0, ((x - r.left) / r.width) * 100))); };
  return (
    <section className="mx-auto max-w-7xl px-5 pb-28 sm:px-8 sm:pb-36">
      <Reveal><Heading before="Same work. A different" em="first" after=" impression" className="max-w-4xl" /></Reveal>
      <Reveal><p className="mt-6 max-w-xl text-lg text-muted-foreground">Scattered, outdated profiles on one side. A clean website and linked profiles on the other.</p></Reveal>
      <div ref={mref} className="mt-10 sm:hidden">
        <div className="mb-4 inline-flex rounded-full border p-1 text-sm">
          {["Before", "After"].map((l, i) => (
            <button key={l} onClick={() => setMAfter(i === 1)} className={`relative rounded-full px-5 py-2 ${mAfter === (i === 1) ? "text-primary-foreground" : "text-muted-foreground"}`}>
              {mAfter === (i === 1) && <motion.span layoutId="ba3" className={`absolute inset-0 rounded-full ${i ? "bg-primary" : "bg-foreground"}`} />}
              <span className="relative">{l}</span>
            </button>
          ))}
        </div>
        <div className="overflow-hidden rounded-2xl border">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={mAfter ? "a" : "b"} initial={{ opacity: 0, x: mAfter ? 30 : -30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}><Presence after={mAfter} /></motion.div>
          </AnimatePresence>
        </div>
      </div>
      <Reveal className="mt-14 hidden sm:block">
        <div ref={ref} data-cursor className="relative h-[24rem] touch-none select-none overflow-hidden rounded-[24px] border"
          onPointerDown={(e) => { drag.current = true; (e.target as Element).setPointerCapture?.(e.pointerId); move(e.clientX); }}
          onPointerMove={(e) => drag.current && move(e.clientX)} onPointerUp={() => (drag.current = false)}>
          <div className="absolute inset-0"><Presence after /></div>
          <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}><Presence after={false} /></div>
          <span className="absolute bottom-4 left-4 rounded-full bg-foreground px-3 py-1 text-xs text-background">Before</span>
          <span className="absolute bottom-4 right-4 rounded-full bg-primary px-3 py-1 text-xs text-primary-foreground">After</span>
          <div className="absolute inset-y-0 w-px bg-primary" style={{ left: `${pos}%` }}>
            <div className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l-6 6 6 6M15 6l6 6-6 6" /></svg>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ---------- Illustrative case study ---------- */
const MONTHS = ["Start", "M1", "M2", "M3", "M4", "M5", "M6"];
const RANKS = [27, 14, 8, 4, 2, 1, 1];
export function CaseStudy() {
  const W = 320, H = 150;
  const pts = RANKS.map((r, i) => [20 + (i * (W - 40)) / (RANKS.length - 1), 15 + ((r - 1) / 26) * (H - 30)] as const);
  const d = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");
  const stats = [["Page 3 to #1", "Google position for her name"], ["2 to 8", "Profiles live and linked"], ["4x", "Monthly profile views"], ["380 to 2,150", "LinkedIn followers"]];
  return (
    <section className="bg-paper">
      <div className="mx-auto max-w-7xl px-5 py-28 sm:px-8 sm:py-36">
        <Reveal><span className="inline-flex rounded-full border bg-background px-3 py-1 text-xs text-muted-foreground">Illustrative case study</span></Reveal>
        <div className="mt-6 grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-start">
          <div>
            <Reveal><h2 className="display text-[2.6rem] sm:text-6xl lg:text-7xl">Dr. Sara Al <span className="serif-em">Hamdan</span><Dot /></h2></Reveal>
            <Reveal><p className="mt-4 text-lg text-muted-foreground">Associate Professor of Environmental Economics. Strong record, almost invisible online.</p></Reveal>
            <Reveal>
              <div className="mt-10 grid gap-6 sm:grid-cols-3">
                {[["Before", "Searching her name showed a namesake, an old staff page and a private Scholar profile."], ["What we did", "Built her scholar website, merged two Scopus IDs, linked ORCID everywhere and started monthly posts."], ["After", "First on Google for her name, with every profile pointing to one clear home."]].map(([h, t]) => (
                  <div key={h} className="border-t pt-4"><p className="font-medium">{h}<Dot /></p><p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{t}</p></div>
                ))}
              </div>
            </Reveal>
            <Reveal>
              <div className="mt-10 grid grid-cols-2 gap-3">
                {stats.map(([n, l]) => (
                  <div key={l} className="rounded-2xl border bg-background p-5">
                    <p className="display text-3xl sm:text-4xl">{n}</p>
                    <p className="mt-2 text-sm text-muted-foreground">{l}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
          <Reveal>
            <div className="rounded-[24px] bg-navy p-6 text-navy-foreground sm:p-8">
              <p className="text-sm text-navy-foreground/70">Google position for "Dr. Sara Al Hamdan"</p>
              <svg viewBox={`0 0 ${W} ${H + 24}`} className="mt-6 w-full" aria-label="Line chart showing her Google position rising from 27 to 1 over six months">
                {[1, 10, 20].map((r) => { const y = 15 + ((r - 1) / 26) * (H - 30); return <g key={r}><line x1="20" x2={W - 20} y1={y} y2={y} stroke="#252d55" /><text x="0" y={y + 4} fill="#8c94b8" fontSize="9">#{r}</text></g>; })}
                <motion.path d={d} fill="none" stroke="#2b59f3" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                  initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 2, ease: "easeInOut" }} />
                {pts.map(([x, y], i) => (
                  <motion.circle key={i} cx={x} cy={y} r={i === pts.length - 1 ? 6 : 3.5} fill={i === pts.length - 1 ? "#ffffff" : "#2b59f3"}
                    initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 * i }} />
                ))}
                {MONTHS.map((m, i) => <text key={m} x={pts[i]![0]} y={H + 18} textAnchor="middle" fill="#8c94b8" fontSize="9">{m}</text>)}
              </svg>
              <div className="mt-6 overflow-hidden rounded-2xl bg-background text-foreground">
                <div className="flex items-center gap-1.5 border-b px-3 py-2">{[0, 1, 2].map((i) => <span key={i} className="h-2 w-2 rounded-full bg-border" />)}<span className="ml-2 text-[10px] text-muted-foreground">sarahamdan.com</span></div>
                <div className="flex items-center gap-4 p-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">SH</div>
                  <div className="min-w-0"><p className="serif-em text-xl leading-tight">Dr. Sara Al Hamdan</p><p className="truncate text-xs text-muted-foreground">Climate economics, Gulf energy transition</p></div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
        <p className="mt-8 text-sm text-muted-foreground">This is a sample to show how the service works. The scholar and figures are examples, not a real client.</p>
      </div>
    </section>
  );
}

/* ---------- Contact ---------- */
const schema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(100),
  reach: z.string().trim().min(5, "Enter your WhatsApp number or email").max(150),
  title: z.string().trim().max(100),
  uni: z.string().trim().max(150),
  link: z.string().trim().max(300),
});
type Form = z.infer<typeof schema>;
export function Contact({ prefill }: { prefill: { name?: string; link?: string; plan?: string; key: number } }) {
  const [f, setF] = useState<Form>({ name: "", reach: "", title: "", uni: "", link: "" });
  const [plan, setPlan] = useState("");
  const [err, setErr] = useState<Partial<Record<keyof Form, string>>>({});
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!prefill.key) return;
    setF((p) => ({ ...p, name: prefill.name ?? p.name, link: prefill.link ?? p.link }));
    if (prefill.plan) setPlan(prefill.plan);
  }, [prefill]);
  const set = (k: keyof Form, v: string) => { setF({ ...f, [k]: v }); if (err[k]) setErr({ ...err, [k]: undefined }); };
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const r = schema.safeParse(f);
    if (!r.success) { const e2: typeof err = {}; r.error.issues.forEach((i) => (e2[i.path[0] as keyof Form] = i.message)); setErr(e2); return; }
    setDone(true);
  };
  const input = "w-full rounded-xl border bg-background px-4 py-3 text-[15px] outline-none transition-colors focus:border-primary";
  const fields: [keyof Form, string, string, string][] = [["name", "Name", "Dr. Sara Ahmed", "sm:col-span-1"], ["reach", "WhatsApp or email", "+966 5x xxx xxxx", "sm:col-span-1"], ["title", "Title", "Associate Professor", "sm:col-span-1"], ["uni", "University", "Your university", "sm:col-span-1"], ["link", "Profile link (ORCID, Scholar or LinkedIn)", "orcid.org/0000-0000-0000-0000", "sm:col-span-2"]];
  return (
    <Panel id="contact" className="bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-28 sm:px-8 sm:py-36 lg:grid-cols-[1fr_1.15fr] lg:items-center">
        <Reveal>
          <h2 className="display text-[3rem] sm:text-7xl lg:text-8xl">Let's get you <span className="serif-em">cited</span><span className="text-foreground">.</span></h2>
          <p className="mt-6 max-w-md text-lg text-primary-foreground/85">Tell us about your research. We reply within one working day.</p>
          {plan && <p className="mt-4 inline-flex rounded-full bg-background/15 px-4 py-1.5 text-sm">Plan: {plan}</p>}
        </Reveal>
        <div className="rounded-[24px] bg-background p-5 text-foreground sm:p-7">
          <AnimatePresence mode="wait">
            {done ? (
              <motion.div key="t" role="status" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="py-10 text-center">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary text-2xl text-primary-foreground">✓</span>
                <p className="display mt-6 text-4xl">Thank you, {f.name.split(" ").slice(0, 2).join(" ")}<Dot /></p>
                <p className="mt-3 text-muted-foreground">We will be in touch within one working day.</p>
              </motion.div>
            ) : (
              <motion.form key="f" onSubmit={submit} noValidate className="grid gap-4 sm:grid-cols-2" exit={{ opacity: 0 }}>
                {fields.map(([k, l, ph, span]) => (
                  <label key={k} htmlFor={`c-${k}`} className={`text-sm text-muted-foreground ${span}`}>{l}
                    <input id={`c-${k}`} value={f[k]} placeholder={ph} onChange={(e) => set(k, e.target.value)} className={`${input} mt-1.5 text-foreground ${err[k] ? "border-destructive" : ""}`} />
                    {err[k] && <span className="mt-1 block text-destructive">{err[k]}</span>}
                  </label>
                ))}
                <button type="submit" className="rounded-full bg-foreground px-8 py-3.5 font-medium text-background transition-colors hover:bg-primary sm:col-span-2">Submit</button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Panel>
  );
}
