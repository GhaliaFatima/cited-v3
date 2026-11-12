import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Dot, Pill, scrollToId } from "./ui";

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
      <div className="flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
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
        <span className="text-primary">First result for your name</span>
        <span className="flex items-center gap-1 font-medium text-primary"><span className="h-1.5 w-1.5 rounded-full bg-primary" />Live</span>
      </motion.div>
    </div>
  );
}

const MANAGED = ["Google Scholar", "LinkedIn", "ResearchGate", "ORCID"];

export function Hero({ ready }: { ready: boolean }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["0%", "12%"]);
  return (
    <section ref={ref} className="relative mx-auto grid max-w-7xl gap-12 px-5 pb-20 pt-28 sm:px-8 lg:grid-cols-[1.02fr_1fr] lg:items-center lg:gap-16 lg:pt-36">
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
          <Pill onClick={() => scrollToId("visibility")}>Check my visibility, free</Pill>
          <Pill variant="ghost" onClick={() => scrollToId("contact")}>Chat on WhatsApp</Pill>
        </motion.div>
        <motion.div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground"
          initial={{ opacity: 0 }} animate={ready ? { opacity: 1 } : {}} transition={{ delay: 0.85 }}>
          <span>Managed on</span>
          {MANAGED.map((m) => <span key={m} className="font-medium text-foreground/80">{m}</span>)}
        </motion.div>
      </div>

      <motion.div className="relative" initial={{ opacity: 0, scale: 0.97 }} animate={ready ? { opacity: 1, scale: 1 } : {}} transition={{ delay: 0.25, duration: 1.1, ease: EASE }}>
        <div className="relative aspect-[4/4.4] overflow-hidden rounded-[28px] bg-secondary sm:aspect-[4/4.1]">
          <motion.img src="img/lecture.webp" alt="A professor in a lab coat standing in front of a chalkboard" style={{ y: imgY, scale: 1.12 }}
            className="absolute inset-0 h-full w-full object-cover" />
          
        </div>
        <div className="absolute -bottom-10 left-4 right-4 sm:-left-10 sm:right-auto sm:w-[25rem]">
          <Serp ready={ready} />
        </div>
      </motion.div>
    </section>
  );
}
