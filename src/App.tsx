import { useEffect, useState } from "react";
import Lenis from "lenis";
import { Hero } from "./components/cited/Hero";
import { Audience, Ethics, FAQ, Footer, HowItWorks, Nav, PlatformWall, Pricing, Problem, ResumeToBrand, WhatWeDo } from "./components/cited/Sections";
import { BeforeAfter, CaseStudy, Contact, RankingDifference, VisibilityCheck } from "./components/cited/Tools";
import { Cursor, Intro, scrollToId, setLenis } from "./components/cited/ui";

export default function App() {
  const [ready, setReady] = useState(false);
  const [prefill, setPrefill] = useState<{ name?: string; link?: string; plan?: string; key: number }>({ key: 0 });

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const l = new Lenis({ lerp: 0.1 });
    setLenis(l);
    let raf = 0;
    const loop = (t: number) => { l.raf(t); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); l.destroy(); setLenis(null); };
  }, []);

  return (
    <>
      <Intro onDone={() => setReady(true)} />
      <Cursor />
      <Nav />
      <main>
        <Hero ready={ready} />
        <PlatformWall />
        <Problem />
        <WhatWeDo />
        <ResumeToBrand />
        <VisibilityCheck onAudit={(d) => { setPrefill((p) => ({ key: p.key + 1, name: d.name, link: d.link })); scrollToId("contact"); }} />
        <RankingDifference />
        <BeforeAfter />
        <HowItWorks />
        <Ethics />
        <CaseStudy />
        <Audience />
        <Pricing onPick={(plan) => { setPrefill((p) => ({ key: p.key + 1, plan })); scrollToId("contact"); }} />
        <FAQ />
        <Contact prefill={prefill} />
      </main>
      <Footer />
    </>
  );
}
