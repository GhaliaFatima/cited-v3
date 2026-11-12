import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef, useState } from "react";
import { Dot, Heading, Panel, Pill, Reveal, Wordmark, scrollToId } from "./ui";

const LINKS = [
  ["Services", "services"], ["Visibility audit", "visibility"], ["Results", "results"], ["Pricing", "pricing"], ["Universities", "who"], ["FAQ", "faq"],
] as const;

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 20));
  const go = (id: string) => { setOpen(false); scrollToId(id); };
  return (
    <>
      <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled || open ? "border-b bg-background" : "border-b border-transparent"}`}>
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          <button aria-label="Back to top" onClick={() => { setOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); }}><Wordmark className="text-2xl" /></button>
          <nav className="hidden items-center gap-7 lg:flex">
            {LINKS.map(([l, id]) => (
              <button key={id} onClick={() => go(id)} className="relative text-sm text-muted-foreground transition-colors hover:text-foreground after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-primary after:transition-transform hover:after:scale-x-100">{l}</button>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <button onClick={() => go("contact")} className="hidden rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-foreground sm:block">WhatsApp us</button>
            <button aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen(!open)} className="relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-1.5 lg:hidden">
              <motion.span animate={open ? { rotate: 45, y: 3.5 } : { rotate: 0, y: 0 }} className="h-px w-6 bg-foreground" />
              <motion.span animate={open ? { rotate: -45, y: -3.5 } : { rotate: 0, y: 0 }} className="h-px w-6 bg-foreground" />
            </button>
          </div>
        </div>
      </header>
      <AnimatePresence>
        {open && (
          <motion.div className="fixed inset-0 z-40 flex flex-col justify-between bg-background px-5 pb-10 pt-24"
            initial={{ clipPath: "inset(0 0 100% 0)" }} animate={{ clipPath: "inset(0 0 0% 0)" }} exit={{ clipPath: "inset(0 0 100% 0)" }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
            <div className="flex flex-col gap-1">
              {LINKS.map(([l, id], i) => (
                <motion.button key={id} onClick={() => go(id)} className="display text-left text-[2.7rem]"
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.05 }}>{l}<span className="text-primary">.</span></motion.button>
              ))}
            </div>
            <Pill onClick={() => go("contact")} className="self-start">WhatsApp us</Pill>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ---------- Platform wall ---------- */
const PLATFORMS = [
  ["Google Scholar", "GS", "Public profile, correct affiliation, every paper listed."],
  ["LinkedIn", "in", "Academic headline, polished profile, monthly posts."],
  ["ResearchGate", "RG", "Publications claimed and duplicates merged."],
  ["ORCID", "iD", "Verified record, linked to every other profile."],
  ["Scopus", "Sc", "Author ID cleanup and affiliation fixes."],
  ["Web of Science", "WoS", "Researcher profile claimed and synced."],
  ["Academia.edu", "Ac", "Profile and papers listed properly."],
  ["Google Search", "G", "Your website ranks first for your name."],
] as const;

export function PlatformWall() {
  return (
    <section className="border-y bg-paper">
      <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <Reveal><Heading before="Every platform that matters. Set up, cleaned and" em="managed" className="max-w-4xl" /></Reveal>
          <Reveal><p className="max-w-sm text-lg text-muted-foreground lg:justify-self-end">We set up and run every profile for you. Your accounts always stay in your name.</p></Reveal>
        </div>
        <div className="mt-14 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {PLATFORMS.map(([name, mark, desc], i) => (
            <Reveal key={name} delay={(i % 4) * 0.05}>
              <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="group flex h-full flex-col rounded-2xl border bg-background p-5 transition-colors hover:border-primary sm:p-6">
                <div className="flex items-center justify-between">
                  <span className="flex h-11 min-w-11 items-center justify-center rounded-xl bg-foreground px-2 text-sm font-semibold tracking-tight text-background transition-colors group-hover:bg-primary">{mark}</span>
                  <span className="text-xs text-muted-foreground transition-colors group-hover:text-primary">Managed</span>
                </div>
                <h3 className="mt-8 text-lg font-medium tracking-tight sm:text-xl">{name}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{desc}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Problem ---------- */
const STATEMENT = "Great research deserves to be found. Most researchers never are.";
function Word({ w, p, range }: { w: string; p: MotionValue<number>; range: [number, number] }) {
  const o = useTransform(p, range, [0.15, 1]);
  return <motion.span style={{ opacity: o }} className={["found.", "never"].includes(w) ? "serif-em text-primary" : ""}>{w} </motion.span>;
}
const PROBLEMS = [
  ["Scattered profiles", "Five platforms, five different versions of you."],
  ["Wrong affiliations", "Old universities and titles still showing."],
  ["Duplicate author IDs", "Your citations split across records."],
  ["Invisible on Google", "Search your name and someone else comes first."],
];
export function Problem() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "start 0.3"] });
  const words = STATEMENT.split(" ");
  return (
    <section className="mx-auto max-w-7xl px-5 py-28 sm:px-8 sm:py-40">
      <div ref={ref}>
        <p className="display max-w-5xl text-[2.6rem] leading-[1.02] sm:text-6xl lg:text-[5.4rem]">
          {words.map((w, i) => <Word key={i} w={w} p={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} />)}
        </p>
      </div>
      <div className="mt-16 grid gap-6 lg:grid-cols-[1fr_1.1fr] lg:items-stretch">
        <Reveal className="relative min-h-80 overflow-hidden rounded-[28px] bg-secondary">
          <img src="img/lab.webp" alt="A researcher working at a lab bench" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-x-4 bottom-4 rounded-2xl bg-background p-4 text-sm sm:inset-x-6 sm:bottom-6">
            <p className="text-muted-foreground">Years of work. Hard to find online.</p>
          </div>
        </Reveal>
        <div className="grid gap-3 sm:grid-cols-2">
          {PROBLEMS.map(([t, d], i) => (
            <Reveal key={t} delay={i * 0.06}>
              <div className="flex h-full flex-col justify-between rounded-2xl border p-6">
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-destructive/30 text-sm text-destructive">!</span>
                <div className="mt-10">
                  <h3 className="text-xl font-medium tracking-tight">{t}<Dot /></h3>
                  <p className="mt-2 text-[15px] text-muted-foreground">{d}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
      <Reveal><p className="mt-10 max-w-2xl text-lg text-muted-foreground">Your work exists. People simply cannot find you. We fix that, and keep it fixed.</p></Reveal>
    </section>
  );
}

/* ---------- What we do ---------- */
function SiteMini() {
  return (
    <div className="overflow-hidden rounded-xl border bg-background">
      <div className="flex items-center gap-1.5 border-b px-3 py-2">{[0, 1, 2].map((i) => <span key={i} className="h-2 w-2 rounded-full bg-border" />)}<span className="ml-2 text-[10px] text-muted-foreground">yourname.com</span></div>
      <div className="p-4">
        <p className="serif-em text-2xl leading-none">Dr. Your Name</p>
        <p className="mt-1 text-[11px] text-muted-foreground">Associate Professor</p>
        <div className="mt-3 flex gap-1.5">{["Research", "Talks", "Media"].map((t) => <span key={t} className="rounded-full bg-tint px-2 py-0.5 text-[10px] text-primary">{t}</span>)}</div>
        <motion.div className="mt-3 h-1.5 rounded bg-primary/50" initial={{ width: "15%" }} whileInView={{ width: "70%" }} viewport={{ once: true }} transition={{ duration: 1.2, delay: 0.3 }} />
      </div>
    </div>
  );
}
function LinkedMini() {
  const items = ["ORCID", "Scholar", "Scopus", "WoS", "RG", "in"];
  return (
    <div className="relative mx-auto h-36 w-full max-w-[15rem]">
      <motion.div className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground"
        initial={{ scale: 0.6 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ type: "spring" }}>You</motion.div>
      {items.map((t, i) => {
        const a = (i / items.length) * Math.PI * 2 - Math.PI / 2;
        return (
          <motion.span key={t} className="absolute flex h-9 min-w-9 items-center justify-center rounded-full border bg-background px-2 text-[11px] font-medium"
            style={{ left: `calc(50% + ${Math.cos(a) * 92}px - 18px)`, top: `calc(50% + ${Math.sin(a) * 56}px - 18px)` }}
            initial={{ opacity: 0, scale: 0.5 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 + i * 0.08, type: "spring" }}>{t}</motion.span>
        );
      })}
    </div>
  );
}
function KnownMini() {
  return (
    <div className="space-y-2">
      {[["Blog", "Why drought resilience starts in the soil"], ["LinkedIn", "New paper out this week, in plain words"], ["Podcast", "Guest on a regional research show"]].map(([k, t], i) => (
        <motion.div key={k} className="flex items-center gap-3 rounded-xl border bg-background px-3 py-2.5"
          initial={{ opacity: 0, x: 12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }}>
          <span className="w-16 shrink-0 text-[11px] text-primary">{k}</span><span className="truncate text-[13px]">{t}</span>
        </motion.div>
      ))}
    </div>
  );
}
const PILLARS = [
  { h: "Get ", em: "found", after: "", img: "img/laptop.webp", alt: "An academic working on a laptop in his office", visual: <SiteMini />, items: ["Your own scholar website", "Google SEO for your name and field", "Google knowledge panel"] },
  { h: "Get ", em: "listed", after: " right", img: "img/classroom.webp", alt: "A professor teaching a class", visual: <LinkedMini />, items: ["ORCID, Google Scholar, Scopus and WoS author IDs", "ResearchGate, Academia.edu and LinkedIn", "Merged, corrected and linked"] },
  { h: "Get ", em: "known", after: "", img: "img/podium.webp", alt: "A speaker addressing an audience from a podium", visual: <KnownMini />, items: ["Monthly blogs on your research", "Plain language research summaries", "LinkedIn content, media and podcast pitching"] },
];
export function WhatWeDo() {
  return (
    <section id="services" className="mx-auto max-w-7xl px-5 pb-28 sm:px-8 sm:pb-36">
      <Reveal><Heading before="Your research record, turned into a" em="brand" className="max-w-4xl" /></Reveal>
      <Reveal><p className="mt-6 max-w-xl text-lg text-muted-foreground">Three things, done properly and kept up every month. Publishing support is part of it, never the whole story.</p></Reveal>
      <div className="mt-14 grid gap-4 lg:grid-cols-3">
        {PILLARS.map((p, i) => (
          <Reveal key={p.em} delay={i * 0.08} className="h-full">
            <div className="group flex h-full flex-col overflow-hidden rounded-[24px] border bg-background">
              <div className="relative h-56 overflow-hidden bg-secondary">
                <img src={p.img} alt={p.alt} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <div className="flex flex-1 flex-col p-6 sm:p-7">
                <h3 className="display text-4xl">{p.h}<span className="serif-em text-primary">{p.em}</span>{p.after}<Dot /></h3>
                <div className="my-6 rounded-2xl bg-paper p-4">{p.visual}</div>
                <ul className="mt-auto">
                  {p.items.map((t) => <li key={t} className="flex gap-3 border-t py-3 text-[15px]"><span className="text-primary">✓</span>{t}</li>)}
                </ul>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------- Resume to brand ---------- */
export function ResumeToBrand() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.8", "center 0.45"] });
  const cvRot = useTransform(scrollYProgress, [0, 1], [-6, -10]);
  const cvX = useTransform(scrollYProgress, [0, 1], ["0%", "-8%"]);
  const siteY = useTransform(scrollYProgress, [0, 1], [80, 0]);
  const siteO = useTransform(scrollYProgress, [0, 0.6], [0.3, 1]);
  return (
    <section className="overflow-hidden border-y bg-tint">
      <div ref={ref} className="mx-auto grid max-w-7xl items-center gap-14 px-5 py-28 sm:px-8 sm:py-36 lg:grid-cols-[1fr_1.15fr]">
        <div>
          <Reveal><Heading before="From a CV in a drawer to a" em="name" after=" people search for" /></Reveal>
          <Reveal><p className="mt-6 max-w-md text-lg text-muted-foreground">You already have the record. We shape it into a clear story, a home on the web and profiles that all say the same thing.</p></Reveal>
          <Reveal>
            <ul className="mt-8 space-y-3 text-[15px]">
              {["Your publications become a searchable research page", "Your talks and media become proof of authority", "Your title and field become what Google shows first"].map((t) => (
                <li key={t} className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />{t}</li>
              ))}
            </ul>
          </Reveal>
        </div>
        <div className="relative h-[30rem] sm:h-[32rem]">
          <motion.div style={{ rotate: cvRot, x: cvX }} className="absolute left-0 top-6 w-[62%] rounded-md border bg-background p-5 shadow-[0_30px_60px_-30px_rgba(11,18,48,0.35)]">
            <p className="text-[11px] font-semibold tracking-wide">CURRICULUM VITAE</p>
            <div className="mt-3 space-y-1.5">{[90, 70, 85, 60].map((w, i) => <div key={i} className="h-1.5 rounded bg-secondary" style={{ width: `${w}%` }} />)}</div>
            <p className="mt-4 text-[10px] font-semibold">Publications</p>
            <div className="mt-2 space-y-1.5">{[95, 88, 92, 80, 86, 70, 90, 75].map((w, i) => <div key={i} className="h-1 rounded bg-secondary" style={{ width: `${w}%` }} />)}</div>
            <p className="mt-4 text-[10px] font-semibold">Conferences</p>
            <div className="mt-2 space-y-1.5">{[80, 66, 74].map((w, i) => <div key={i} className="h-1 rounded bg-secondary" style={{ width: `${w}%` }} />)}</div>
          </motion.div>
          <motion.div style={{ y: siteY, opacity: siteO }} className="absolute bottom-0 right-0 w-[78%] overflow-hidden rounded-2xl border bg-background shadow-[0_40px_80px_-40px_rgba(11,18,48,0.5)]">
            <div className="flex items-center gap-1.5 border-b px-4 py-2.5">{[0, 1, 2].map((i) => <span key={i} className="h-2 w-2 rounded-full bg-border" />)}<span className="ml-3 rounded bg-secondary px-2 py-0.5 text-[10px] text-muted-foreground">yourname.com</span></div>
            <div className="relative h-28 overflow-hidden bg-secondary">
              <img src="img/whiteboard.webp" alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover object-[50%_20%]" />
            </div>
            <div className="p-5">
              <p className="display text-3xl">Dr. Your <span className="serif-em">Name</span><Dot /></p>
              <p className="mt-1 text-xs text-muted-foreground">Associate Professor of Environmental Economics</p>
              <div className="mt-4 grid grid-cols-3 gap-2">
                {["Research", "Talks", "Media"].map((t) => <div key={t} className="rounded-lg border p-2.5"><p className="text-[11px] font-medium">{t}</p><div className="mt-2 h-1 w-3/4 rounded bg-secondary" /></div>)}
              </div>
              <div className="mt-4 flex flex-wrap gap-1.5">{["ORCID", "Google Scholar", "LinkedIn", "ResearchGate"].map((t) => <span key={t} className="rounded-full border border-primary/40 px-2.5 py-1 text-[10px] text-primary">{t}</span>)}</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ---------- How it works ---------- */
const STEPS: [string, string][] = [
  ["Audit", "Every profile and your Google results, checked."],
  ["Build", "Your scholar website goes live."],
  ["Clean up", "Profiles merged, corrected and linked."],
  ["Publish", "Blogs, summaries and LinkedIn posts."],
  ["Report", "A clear impact report, every month."],
];
export function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.75", "end 0.55"] });
  const width = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  return (
    <section id="process" className="mx-auto max-w-7xl px-5 py-28 sm:px-8 sm:py-36">
      <Reveal><Heading before="Five steps. Then it runs every" em="month" /></Reveal>
      <div ref={ref} className="relative mt-16">
        <div className="absolute left-0 right-0 top-[1.35rem] hidden h-px bg-border lg:block" />
        <motion.div style={{ width }} className="absolute left-0 top-[1.35rem] hidden h-px bg-primary lg:block" />
        <div className="grid gap-8 lg:grid-cols-5 lg:gap-6">
          {STEPS.map(([t, d], i) => {
            const at = i / (STEPS.length - 1);
            return <StepItem key={t} t={t} d={d} i={i} at={at} p={scrollYProgress} />;
          })}
        </div>
      </div>
      <Reveal>
        <div className="mt-16 flex flex-wrap items-center gap-4 rounded-2xl border bg-paper p-5 text-[15px] sm:p-6">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">↻</span>
          <p className="flex-1">After launch we keep everything current: new papers added, profiles synced, posts published, results reported.</p>
        </div>
      </Reveal>
    </section>
  );
}
function StepItem({ t, d, i, at, p }: { t: string; d: string; i: number; at: number; p: MotionValue<number> }) {
  const bg = useTransform(p, [Math.max(0, at - 0.05), at], ["#ffffff", "#2b59f3"]);
  const color = useTransform(p, [Math.max(0, at - 0.05), at], ["#0a0f1f", "#ffffff"]);
  return (
    <Reveal delay={i * 0.06}>
      <div className="flex gap-5 lg:block">
        <motion.span style={{ backgroundColor: bg, color }} className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-primary text-sm font-medium">{i + 1}</motion.span>
        <div className="lg:mt-6">
          <h3 className="display text-3xl sm:text-4xl">{t}<Dot /></h3>
          <p className="mt-2 text-[15px] text-muted-foreground">{d}</p>
        </div>
      </div>
    </Reveal>
  );
}

/* ---------- Ethics ---------- */
export function Ethics() {
  const always = ["Use only your real, published work.", "Keep every account in your name.", "Report honestly, every month."];
  const never = ["Sell, fake or backdate citations.", "Join citation rings.", "Write papers for you."];
  return (
    <Panel id="integrity" className="bg-navy text-navy-foreground">
      <div className="mx-auto max-w-7xl px-5 py-28 sm:px-8 sm:py-40">
        <Reveal><h2 className="display text-[3.2rem] sm:text-8xl lg:text-[8rem]">Real reach<Dot /><br />Clean <span className="serif-em">record</span><Dot /></h2></Reveal>
        <Reveal><p className="mt-8 max-w-xl text-lg text-navy-foreground/70">Your reputation took years to build. Everything we do would stand up in front of your university, your journals and your peers.</p></Reveal>
        <div className="mt-16 grid gap-14 md:grid-cols-2">
          {([["What we always do", always, "✓"], ["What we never do", never, "×"]] as const).map(([h, items, mark], c) => (
            <div key={h}>
              <h3 className="text-2xl font-medium tracking-tight">{h}<Dot /></h3>
              <ul className="mt-6">
                {items.map((t, i) => (
                  <motion.li key={t} className="flex items-start gap-4 border-t border-navy-line py-5 text-lg"
                    initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 + c * 0.2 }}>
                    <span className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-sm ${c ? "border border-navy-line text-navy-foreground/60" : "bg-primary text-primary-foreground"}`}>{mark}</span>
                    <span className={c ? "text-navy-foreground/75" : ""}>{t}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </Panel>
  );
}

/* ---------- Who ---------- */
const WHO = [
  { t: "Professors", d: "Your full body of work, presented properly.", img: "img/lecture.webp" },
  { t: "Associate and assistant professors", d: "Build the profile that earns promotion and invitations.", img: "img/whiteboard.webp" },
  { t: "PhD and early career", d: "Start visible from day one.", img: "img/scholar.webp" },
  { t: "Universities and departments", d: "Faculty profiles and affiliation cleanup at scale.", img: "img/podium.webp", cta: true },
];
export function Audience() {
  return (
    <section id="who" className="mx-auto max-w-7xl px-5 py-28 sm:px-8 sm:py-36">
      <Reveal><Heading before="Who we" em="work" after=" with" /></Reveal>
      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {WHO.map((w, i) => (
          <Reveal key={w.t} delay={i * 0.06} className="h-full">
            <div data-cursor className={`group relative flex h-full min-h-[26rem] flex-col justify-end overflow-hidden rounded-[24px] bg-navy p-6 text-navy-foreground ${w.cta ? "ring-2 ring-primary" : ""}`}>
              <img src={w.img} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-55 transition-all duration-700 group-hover:scale-105 group-hover:opacity-40" />
              <div className="absolute inset-x-0 bottom-0 h-[58%] bg-navy/85" />
              <div className="relative">
                <h3 className="display text-3xl">{w.t}<Dot /></h3>
                <p className="mt-2 text-[15px] text-navy-foreground/80">{w.d}</p>
                {w.cta && <button onClick={() => scrollToId("contact")} className="mt-4 text-sm font-medium text-white underline decoration-primary decoration-2 underline-offset-4">Talk to us about your department →</button>}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------- Pricing ---------- */
export const PLANS = [
  { name: "Presence", desc: "Get found and listed right.", items: ["Your scholar website", "All profiles set up and cleaned", "Google Scholar, ORCID and Scopus linked"] },
  { name: "Growth", desc: "Stay visible every month.", items: ["Everything in Presence", "Monthly blog", "LinkedIn posting", "SEO and profile maintenance"], featured: true },
  { name: "Authority", desc: "Become the name in your field.", items: ["Everything in Growth", "Media and podcast pitching", "Speaking page and impact report", "Bilingual Arabic and English site"] },
];
export function Pricing({ onPick }: { onPick: (p: string) => void }) {
  return (
    <section id="pricing" className="border-y bg-paper">
      <div className="mx-auto max-w-7xl px-5 py-28 sm:px-8 sm:py-36">
        <Reveal><Heading before="Choose your" em="plan" /></Reveal>
        <Reveal><p className="mt-6 max-w-xl text-lg text-muted-foreground">Monthly plans. Cancel anytime. Universities get a custom package.</p></Reveal>
        <div className="mt-14 grid gap-4 lg:grid-cols-3">
          {PLANS.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.08} className="h-full">
              <motion.div whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className={`flex h-full flex-col rounded-[24px] border p-8 ${p.featured ? "border-foreground bg-foreground text-background" : "bg-background"}`}>
                <div className="flex items-center justify-between">
                  <h3 className="display text-4xl">{p.name}<Dot /></h3>
                  {p.featured && <span className="rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">Most popular</span>}
                </div>
                <p className={`mt-2 ${p.featured ? "text-background/70" : "text-muted-foreground"}`}>{p.desc}</p>
                <p className="mt-6"><span className="display text-3xl">Price on request</span><span className={`ml-2 text-sm ${p.featured ? "text-background/60" : "text-muted-foreground"}`}>per month</span></p>
                <ul className="mt-6 flex-1">
                  {p.items.map((t) => <li key={t} className={`flex gap-3 border-t py-3.5 text-[15px] ${p.featured ? "border-background/15" : ""}`}><span className="text-primary">✓</span>{t}</li>)}
                </ul>
                <div className="mt-6"><Pill variant={p.featured ? "primary" : "ghost"} onClick={() => onPick(p.name)}>Choose {p.name}</Pill></div>
              </motion.div>
            </Reveal>
          ))}
        </div>
        <p className="mt-8 text-sm text-muted-foreground">Pay by Mada, Apple Pay or card.</p>
      </div>
    </section>
  );
}

/* ---------- FAQ ---------- */
const FAQS = [
  ["Can you increase my citations?", "We make your work far easier to find, read and share, which is what leads to citations. We never buy, trade or fake them."],
  ["Do I keep ownership of my accounts?", "Always. Every profile and your website domain stay in your name. We work with the access you give us."],
  ["Do you post on my behalf?", "Only what you approve. We draft posts and summaries from your real work and you sign off before anything goes live."],
  ["How long before I show up on Google?", "Most new scholar websites start appearing for your name within a few weeks. Ranking first takes steady work, which is why we report on it every month."],
  ["Can my website be in Arabic and English?", "Yes. The Authority plan includes a fully bilingual site, and it can be added to any plan."],
  ["Can I keep my photo and contact details private?", "Yes. You choose exactly what is public. Many scholars use a contact form instead of a direct email."],
  ["Can you work with my whole department?", "Yes. We set up and clean faculty profiles and affiliations at scale, with one point of contact."],
  ["Can I cancel anytime?", "Yes. Plans are monthly and everything we built stays yours."],
];
export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="mx-auto grid max-w-7xl gap-12 px-5 py-28 sm:px-8 sm:py-36 lg:grid-cols-[1fr_1.5fr]">
      <Reveal><Heading before="Honest" em="answers" /></Reveal>
      <div className="border-b">
        {FAQS.map(([q, a], i) => (
          <div key={q} className="border-t">
            <button aria-expanded={open === i} onClick={() => setOpen(open === i ? null : i)} className="flex w-full items-center justify-between gap-6 py-5 text-left text-lg font-medium tracking-tight transition-colors hover:text-primary sm:text-xl">
              {q}
              <motion.span animate={{ rotate: open === i ? 45 : 0, backgroundColor: open === i ? "#2b59f3" : "#ffffff", color: open === i ? "#ffffff" : "#0a0f1f" }} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-lg">+</motion.span>
            </button>
            <AnimatePresence initial={false}>
              {open === i && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} className="overflow-hidden">
                  <p className="max-w-xl pb-6 text-[17px] leading-relaxed text-muted-foreground">{a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="overflow-hidden px-5 pt-16 sm:px-8">
      <div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-6 text-sm text-muted-foreground">
        <p>Be the scholar people find first<Dot /></p>
        <div className="flex flex-wrap gap-6">
          {LINKS.map(([l, id]) => <button key={id} onClick={() => scrollToId(id)} className="hover:text-foreground">{l}</button>)}
          <button onClick={() => scrollToId("contact")} className="hover:text-foreground">Contact</button>
        </div>
      </div>
      <motion.p initial={{ y: "40%", opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="display mt-10 text-center text-[29vw] leading-[0.8] tracking-[-0.07em]">Cited<Dot /></motion.p>
      <div className="mx-auto flex max-w-7xl justify-between border-t py-6 text-xs text-muted-foreground">
        <span>© 2026 Cited.</span><span>Accounts always stay in your name</span>
      </div>
    </footer>
  );
}
