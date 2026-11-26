import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Dot, Pill, scrollToId } from "./ui";
import { PlatformIcon } from "./PlatformIcon";

const EASE = [0.22, 1, 0.36, 1] as const;

function useTyped(text: string, start: number, speed = 70, run = true) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!run) return;
    let i = 0;
    let iv: ReturnType<typeof setInterval>;
    const t = setTimeout(() => { iv = setInterval(() => { i++; setN(i); if (i >= text.length) clearInterval(iv); }, speed); }, start);
    return () => { clearTimeout(t); clearInterval(iv); };
  }, [text, start, speed, run]);
  return text.slice(0, n);
}

function Line({ children, delay, ready }: { children: React.ReactNode; delay: number; ready: boolean }) {
  return (
    <span className="block overflow-hidden pb-[0.08em]">
      <motion.span className="block" initial={{ y: "110%" }} animate={ready ? { y: 0 } : {}} transition={{ duration: 1, delay, ease: EASE }}>
        {children}
      </motion.span>
    </span>
  );
}

export function GoogleG({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-label="Google" role="img">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}

function Serp({ ready }: { ready: boolean }) {
  const q = useTyped("Dr. Your Name", 900, 75, ready);
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (!ready) return;
    const t = [setTimeout(() => setStep(1), 2100), setTimeout(() => setStep(2), 2900), setTimeout(() => setStep(3), 3700)];
    return () => t.forEach(clearTimeout);
  }, [ready]);
  return (
    <div className="w-full rounded-2xl border bg-background p-4 shadow-[0_40px_80px_-40px_rgba(11,18,48,0.45)] sm:p-5">
      <div className="mb-3 flex items-center gap-2">
        <GoogleG className="h-5 w-5" />
        <span className="text-[15px] font-medium tracking-tight"><span style={{ color: "#4285F4" }}>G</span><span style={{ color: "#EA4335" }}>o</span><span style={{ color: "#FBBC05" }}>o</span><span style={{ color: "#4285F4" }}>g</span><span style={{ color: "#34A853" }}>l</span><span style={{ color: "#EA4335" }}>e</span></span>
        <span className="ml-auto text-[11px] text-muted-foreground">Search</span>
      </div>
      <div className="flex items-center gap-2.5 rounded-full border px-4 py-2.5 text-sm shadow-[0_2px_8px_-4px_rgba(11,18,48,0.25)]">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-muted-foreground"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
        <span className="font-medium">{q}</span><span className="caret -ml-1 text-primary">|</span>
      </div>
      <AnimatePresence>
        {step >= 1 && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE }} className="mt-4">
            <p className="text-xs text-muted-foreground">yourname.com</p>
            <p className="mt-0.5 text-[17px] font-medium leading-snug text-primary">Dr. Your Name, Associate Professor</p>
            <p className="mt-1 text-[13px] leading-snug text-muted-foreground">Research on climate economics and sustainable growth. Publications, talks and media.</p>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="mt-4 grid grid-cols-3 gap-2">
        {["Google Scholar", "LinkedIn", "ORCID"].map((p, i) => (
          <motion.div key={p} initial={{ opacity: 0, scale: 0.9 }} animate={step >= 2 ? { opacity: 1, scale: 1 } : {}} transition={{ delay: i * 0.12, type: "spring", stiffness: 300, damping: 20 }}
            className="rounded-lg border bg-paper px-2.5 py-2">
            <p className="text-[10px] text-muted-foreground">{p}</p>
            <div className="mt-1.5 h-1 w-3/4 rounded bg-secondary" />
          </motion.div>
        ))}
      </div>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={step >= 3 ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, ease: EASE }}
        className="mt-3 flex items-center justify-between rounded-lg bg-tint px-3 py-2 text-xs">
        <span className="text-primary">#1 on Google for your name</span>
        <span className="flex items-center gap-1 font-medium text-primary"><span className="h-1.5 w-1.5 rounded-full bg-primary" />Live</span>
      </motion.div>
    </div>
  );
}

const MANAGED = [["Google Scholar", "scholar"], ["LinkedIn", "linkedin"], ["ResearchGate", "researchgate"], ["ORCID", "orcid"]];

const CODES = [["+966", "SA"], ["+971", "AE"], ["+92", "PK"], ["+974", "QA"], ["+965", "KW"], ["+968", "OM"], ["+973", "BH"], ["+44", "UK"], ["+1", "US"]];

function QuickLead({ ready }: { ready: boolean }) {
  const [f, setF] = useState({ name: "", email: "", phone: "", link: "" });
  const [code, setCode] = useState("+966");
  const [err, setErr] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);
  const set = (k: keyof typeof f, v: string) => { setF({ ...f, [k]: v }); if (err[k]) setErr({ ...err, [k]: "" }); };
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const x: Record<string, string> = {};
    if (f.name.trim().length < 2) x.name = "Enter your name";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) x.email = "Enter a valid email";
    if (!/^[0-9\s-]{7,15}$/.test(f.phone.trim())) x.phone = "Enter a valid number";
    setErr(x);
    if (!Object.keys(x).length) setDone(true);
  };
  const pill = (bad?: string) => `h-14 w-full rounded-full border border-transparent bg-background px-5 text-foreground text-[15px] outline-none transition-all placeholder:text-muted-foreground/80 focus:border-primary focus:ring-4 focus:ring-tint ${bad ? "border-destructive" : ""}`;
  return (
    <motion.div className="mt-14 min-w-0 lg:mt-10" initial={{ opacity: 0, y: 24 }} animate={ready ? { opacity: 1, y: 0 } : {}} transition={{ delay: 1, duration: 0.8, ease: EASE }}>
      <div className="relative overflow-hidden rounded-[32px] bg-navy p-4 text-navy-foreground shadow-[0_40px_80px_-40px_rgba(11,18,48,0.7)] sm:p-6">
        <motion.span aria-hidden className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full border border-primary/40" animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0.2, 0.6] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} />
        <AnimatePresence mode="wait">
          {done ? (
            <motion.div key="ok" role="status" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
              className="relative flex flex-col items-start gap-4 rounded-[24px] bg-background px-6 py-6 text-foreground sm:flex-row sm:items-center">
              <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 15 }}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5 9-10" /></svg>
              </motion.span>
              <p className="text-[15px]"><span className="font-medium">Thank you, {f.name.trim().split(" ").slice(0, 2).join(" ")}.</span> <span className="text-muted-foreground">Your free visibility audit is on its way. We will message you on {code} {f.phone} within one working day.</span></p>
            </motion.div>
          ) : (
            <motion.form key="f" onSubmit={submit} noValidate exit={{ opacity: 0 }}>
              <div className="relative flex flex-col gap-3 px-1 pb-5 pt-1 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <span className="inline-flex items-center gap-2 rounded-full bg-primary px-3 py-1 text-xs font-medium text-white"><span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/70" /><span className="relative inline-flex h-2 w-2 rounded-full bg-white" /></span>Free, takes 30 seconds</span>
                  <p className="display mt-3 text-3xl text-white sm:text-4xl">Get your free visibility <span className="serif-em">audit</span><span className="text-primary">.</span></p>
                </div>
                <p className="max-w-sm text-[15px] text-navy-foreground/70">We check your Google results and every profile, then send you the fixes on WhatsApp.</p>
              </div>
              <div className="relative grid min-w-0 gap-2.5 md:grid-cols-2 lg:grid-cols-[1fr_1.1fr_1.15fr_1.1fr_auto] [&>*]:min-w-0">
                <div>
                  <input id="ql-name" aria-label="Full name" autoComplete="name" value={f.name} onChange={(e) => set("name", e.target.value)} placeholder="Full name" className={pill(err.name)} />
                  {err.name && <p className="mt-1 px-5 text-xs text-[#ff8a7a]">{err.name}</p>}
                </div>
                <div>
                  <input aria-label="Email" type="email" autoComplete="email" value={f.email} onChange={(e) => set("email", e.target.value)} placeholder="Email" className={pill(err.email)} />
                  {err.email && <p className="mt-1 px-5 text-xs text-[#ff8a7a]">{err.email}</p>}
                </div>
                <div>
                  <div className={`flex h-14 items-center rounded-full border border-transparent bg-background pl-2 text-foreground transition-all focus-within:border-primary focus-within:ring-4 focus-within:ring-tint ${err.phone ? "border-destructive" : ""}`}>
                    <select aria-label="Country code" value={code} onChange={(e) => setCode(e.target.value)} className="h-10 rounded-full bg-secondary px-2.5 text-sm outline-none">
                      {CODES.map(([c, n]) => <option key={c} value={c}>{n} {c}</option>)}
                    </select>
                    <input aria-label="Phone or WhatsApp" type="tel" inputMode="tel" autoComplete="tel-national" value={f.phone} onChange={(e) => set("phone", e.target.value)} placeholder="Phone number" className="h-full min-w-0 flex-1 rounded-full bg-transparent px-3 text-[15px] outline-none placeholder:text-muted-foreground/80" />
                  </div>
                  {err.phone && <p className="mt-1 px-5 text-xs text-[#ff8a7a]">{err.phone}</p>}
                </div>
                <div>
                  <input aria-label="ORCID or Google Scholar link (optional)" value={f.link} onChange={(e) => set("link", e.target.value)} placeholder="Profile link (optional)" className={pill()} />
                </div>
                <motion.button type="submit" whileTap={{ scale: 0.97 }} className="group flex h-14 items-center justify-center gap-2 rounded-full bg-primary px-7 text-[15px] font-medium text-primary-foreground transition-colors hover:bg-white hover:text-foreground md:col-span-2 lg:col-span-1">
                  Get my free audit <span className="transition-transform group-hover:translate-x-1">→</span>
                </motion.button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export function Hero({ ready }: { ready: boolean }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["0%", "12%"]);
  return (
    <>
    <section ref={ref} className="relative mx-auto grid max-w-7xl gap-12 px-5 pb-6 pt-28 sm:px-8 lg:grid-cols-[1.02fr_1fr] lg:items-center lg:gap-16 lg:pt-36">
      <div>
        <h1 className="display text-[3.3rem] sm:text-7xl lg:text-[6.1rem]">
          <Line ready={ready} delay={0}>Be the scholar</Line>
          <Line ready={ready} delay={0.08}>people <span className="serif-em">find</span></Line>
          <Line ready={ready} delay={0.16}>first<Dot /></Line>
        </h1>
        <motion.p className="mt-7 max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl"
          initial={{ opacity: 0 }} animate={ready ? { opacity: 1 } : {}} transition={{ delay: 0.5, duration: 0.8 }}>
          We turn your academic record into a brand. Your scholar website, research profiles and Google ranking, built and managed for you every month.
        </motion.p>
        <motion.div className="mt-9 flex flex-wrap gap-3" initial={{ opacity: 0, y: 10 }} animate={ready ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.65 }}>
          <Pill onClick={() => { const el = document.getElementById("ql-name"); el?.scrollIntoView({ behavior: "smooth", block: "center" }); setTimeout(() => el?.focus({ preventScroll: true }), 600); }}>Check my visibility, free</Pill>
          <Pill variant="ghost" onClick={() => scrollToId("contact")}>Chat on WhatsApp</Pill>
        </motion.div>
        <motion.div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground"
          initial={{ opacity: 0 }} animate={ready ? { opacity: 1 } : {}} transition={{ delay: 0.85 }}>
          <span>Managed on</span>
          {MANAGED.map(([m, id]) => <span key={m} className="flex items-center gap-2 font-medium text-foreground/80"><PlatformIcon id={id} className="h-[18px] w-[18px] text-foreground" />{m}</span>)}
        </motion.div>
      </div>

      <motion.div className="relative" initial={{ opacity: 0, scale: 0.97 }} animate={ready ? { opacity: 1, scale: 1 } : {}} transition={{ delay: 0.25, duration: 1.1, ease: EASE }}>
        <div className="relative aspect-[4/4.4] overflow-hidden rounded-[28px] bg-secondary sm:aspect-[4/4.1]">
          <motion.img src="img/lecture.webp" alt="A senior academic speaking on stage to a full audience" style={{ y: imgY, scale: 1.12 }}
            className="absolute inset-0 h-full w-full object-cover object-top" />
          
        </div>
        <div className="absolute -bottom-10 left-4 right-4 sm:-left-10 sm:right-auto sm:w-[25rem]">
          <Serp ready={ready} />
        </div>
      </motion.div>
    </section>
    <div className="mx-auto max-w-7xl px-5 pb-16 sm:px-8"><QuickLead ready={ready} /></div>
    </>
  );
}
