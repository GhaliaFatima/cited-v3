import { AnimatePresence, motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import type Lenis from "lenis";

let lenis: Lenis | null = null;
export function setLenis(l: Lenis | null) {
  lenis = l;
}
export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset: -72 });
  else el.scrollIntoView({ behavior: "smooth" });
}

export function Dot() {
  return <span className="text-primary">.</span>;
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`font-medium tracking-[-0.05em] ${className}`}>
      Cited<Dot />
    </span>
  );
}

export function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function Heading({ before, em, after = "", className = "" }: { before: string; em: string; after?: string; className?: string }) {
  return (
    <h2 className={`display text-[2.6rem] sm:text-6xl lg:text-[5.2rem] ${className}`}>
      {before} <span className="serif-em">{em}</span>
      {after}
      <Dot />
    </h2>
  );
}

/* Magnetic wrapper: pulls its child gently toward the pointer on desktop */
export function Magnetic({ children, strength = 0.28 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const x = useSpring(0, { stiffness: 220, damping: 16, mass: 0.4 });
  const y = useSpring(0, { stiffness: 220, damping: 16, mass: 0.4 });
  return (
    <motion.span
      ref={ref}
      className="inline-flex"
      style={{ x, y }}
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== "mouse" || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onPointerLeave={() => { x.set(0); y.set(0); }}
    >
      {children}
    </motion.span>
  );
}

export function Pill({ children, onClick, variant = "primary", className = "" }: { children: ReactNode; onClick?: () => void; variant?: "primary" | "ghost" | "light"; className?: string }) {
  const v = {
    primary: "bg-primary text-primary-foreground hover:bg-foreground",
    ghost: "border border-foreground/15 text-foreground hover:border-foreground",
    light: "bg-background text-foreground hover:bg-tint",
  }[variant];
  const btn = (
    <button
      onClick={onClick}
      className={`group inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-[15px] font-medium transition-colors duration-300 active:scale-[0.97] ${v} ${className}`}
    >
      {children}
      <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
    </button>
  );
  return variant === "primary" ? <Magnetic>{btn}</Magnetic> : btn;
}

/* Desktop cursor: ink dot that becomes a blue ring over interactive elements */
export function Cursor() {
  const reduce = useReducedMotion();
  const [on, setOn] = useState(false);
  const [hover, setHover] = useState(false);
  const [hidden, setHidden] = useState(true);
  const mx = useMotionValue(-100);
  const my = useMotionValue(-100);
  const x = useSpring(mx, { stiffness: 600, damping: 40, mass: 0.3 });
  const y = useSpring(my, { stiffness: 600, damping: 40, mass: 0.3 });
  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fine || reduce) return;
    setOn(true);
    document.documentElement.classList.add("has-cursor");
    const move = (e: PointerEvent) => {
      mx.set(e.clientX); my.set(e.clientY); setHidden(false);
      const t = e.target as Element | null;
      const field = t?.closest("input, textarea, select");
      setHidden(!!field);
      setHover(!!t?.closest("a, button, [role='switch'], [data-cursor]"));
    };
    const leave = () => setHidden(true);
    window.addEventListener("pointermove", move);
    document.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
      document.documentElement.classList.remove("has-cursor");
    };
  }, [reduce, mx, my]);
  if (!on) return null;
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[100]"
      style={{ x, y }}
    >
      <motion.div
        className="-translate-x-1/2 -translate-y-1/2 rounded-full"
        animate={{
          width: hover ? 44 : 8,
          height: hover ? 44 : 8,
          backgroundColor: hover ? "rgba(43,89,243,0)" : "#0a0f1f",
          borderWidth: hover ? 1.5 : 0,
          opacity: hidden ? 0 : 1,
        }}
        style={{ borderColor: "#2b59f3", borderStyle: "solid" }}
        transition={{ type: "spring", stiffness: 400, damping: 28 }}
      />
    </motion.div>
  );
}

/* Intro: "Cited" types, the blue full stop drops in, then the screen wipes up */
export function Intro({ onDone }: { onDone: () => void }) {
  const reduce = useReducedMotion();
  const [show, setShow] = useState(() => {
    if (typeof window === "undefined") return false;
    try { return !sessionStorage.getItem("cited-intro"); } catch { return true; }
  });
  const [n, setN] = useState(0);
  const [dot, setDot] = useState(false);
  useEffect(() => {
    if (!show || reduce) { setShow(false); onDone(); return; }
    try { sessionStorage.setItem("cited-intro", "1"); } catch { /* ignore */ }
    const word = "Cited";
    const timers: ReturnType<typeof setTimeout>[] = [];
    for (let i = 1; i <= word.length; i++) timers.push(setTimeout(() => setN(i), 90 * i));
    timers.push(setTimeout(() => setDot(true), 90 * word.length + 120));
    timers.push(setTimeout(() => { setShow(false); }, 1450));
    timers.push(setTimeout(onDone, 1500));
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <AnimatePresence>
      {show && !reduce && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-background"
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          initial={{ clipPath: "inset(0 0 0% 0)" }}
          transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
        >
          <p className="display text-[22vw] sm:text-[12rem]">
            {"Cited".slice(0, n)}
            <motion.span
              className="inline-block text-primary"
              initial={{ y: "-120vh" }}
              animate={dot ? { y: 0 } : { y: "-120vh" }}
              transition={{ type: "spring", stiffness: 520, damping: 18, mass: 0.8 }}
            >
              .
            </motion.span>
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* Panel: a coloured section that scales in and squares its corners as it enters */
export function Panel({ id, className, children }: { id?: string; className: string; children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 0.25"] });
  const scale = useTransform(scrollYProgress, [0, 1], [0.94, 1]);
  const radius = useTransform(scrollYProgress, [0, 1], [40, 0]);
  return (
    <motion.section
      id={id}
      ref={ref}
      style={reduce ? undefined : { scale, borderRadius: radius }}
      className={`origin-top overflow-hidden ${className}`}
    >
      {children}
    </motion.section>
  );
}

/* In view hook used to autoplay hover animations on touch screens */
export function useTouch() {
  const [touch, setTouch] = useState(false);
  useEffect(() => { setTouch(!window.matchMedia("(hover: hover)").matches); }, []);
  return touch;
}
