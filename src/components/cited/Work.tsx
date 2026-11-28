import { Heading, Reveal } from "./ui";

// Scholars we have built for. Haga Elimam is real; the others are placeholders to edit later.
type Scholar = { name: string; title: string; field: string; site: string; url?: string; theme: { bg: string; ink: string; accent: string } };

const SCHOLARS: Scholar[] = [
  { name: "Haga Elimam", title: "Scholar website and profiles", field: "Academic record turned into a personal brand", site: "hagaelimam.com", url: "https://hagaelimam.com", theme: { bg: "#0B1230", ink: "#FFFFFF", accent: "#2B59F3" } },
  { name: "Dr. Layla Al Mansouri", title: "Associate Professor of Public Health", field: "Website, Scholar and ORCID clean up, monthly posts", site: "laylaalmansouri.com", theme: { bg: "#FBFAF7", ink: "#0A0F1F", accent: "#2B59F3" } },
  { name: "Dr. James Whitaker", title: "Professor of Mechanical Engineering", field: "Website, merged Scopus IDs, Google ranking", site: "jameswhitaker.com", theme: { bg: "#EAF0FE", ink: "#0A0F1F", accent: "#0B1230" } },
  { name: "Dr. Omar Al Hashimi", title: "Assistant Professor of Finance", field: "Website, LinkedIn and ResearchGate set up", site: "omaralhashimi.com", theme: { bg: "#FFFFFF", ink: "#0A0F1F", accent: "#2B59F3" } },
];

function initials(n: string) {
  return n.replace(/^Dr\.\s*/, "").split(" ").filter((w) => w[0] && w[0] === w[0].toUpperCase()).map((w) => w[0]).slice(0, 2).join("");
}

function SitePreview({ s }: { s: Scholar }) {
  const { bg, ink, accent } = s.theme;
  return (
    <div className="overflow-hidden rounded-2xl border bg-white shadow-[0_1px_0_rgba(10,15,31,0.04)]">
      <div className="flex items-center gap-2 border-b bg-[#F4F5F7] px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#E1E3E8]" /><span className="h-2.5 w-2.5 rounded-full bg-[#E1E3E8]" /><span className="h-2.5 w-2.5 rounded-full bg-[#E1E3E8]" />
        <span className="ml-3 truncate rounded-full bg-white px-3 py-1 text-xs text-muted-foreground">{s.site}</span>
      </div>
      <div className="relative aspect-[16/10] p-6 sm:p-7" style={{ background: bg, color: ink }}>
        <div className="flex items-center justify-between text-[11px] opacity-70">
          <span className="font-medium">{initials(s.name)}</span>
          <span className="flex gap-4"><span>Research</span><span>Publications</span><span>Talks</span></span>
        </div>
        <p className="mt-8 text-[1.7rem] font-medium leading-[1.05] tracking-[-0.03em] sm:text-[2rem]">{s.name}</p>
        <p className="mt-2 text-sm opacity-75">{s.title}</p>
        <div className="mt-6 flex gap-2">
          <span className="rounded-full px-3 py-1.5 text-[11px] font-medium text-white" style={{ background: accent }}>Publications</span>
          <span className="rounded-full border px-3 py-1.5 text-[11px]" style={{ borderColor: ink === "#FFFFFF" ? "rgba(255,255,255,0.35)" : "rgba(10,15,31,0.18)" }}>Contact</span>
        </div>
        <div className="absolute bottom-6 right-6 hidden gap-1.5 sm:bottom-7 sm:right-7 sm:flex">
          {[0, 1, 2].map((i) => <span key={i} className="h-1.5 w-10 rounded-full" style={{ background: ink, opacity: 0.12 + i * 0.06 }} />)}
        </div>
      </div>
    </div>
  );
}

export function OurScholars() {
  return (
    <section id="work" className="mx-auto max-w-7xl px-5 py-28 sm:px-8 sm:py-36">
      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr] lg:items-end">
        <Reveal><Heading before="Scholars we have" em="built" after=" for" className="max-w-3xl" /></Reveal>
        <Reveal><p className="max-w-sm text-lg text-muted-foreground lg:justify-self-end">Each one started as a CV. Now it is a website people find first.</p></Reveal>
      </div>
      <div className="mt-14 grid gap-6 md:grid-cols-2">
        {SCHOLARS.map((s, i) => {
          const body = (
            <>
              <SitePreview s={s} />
              <div className="mt-5 flex items-start justify-between gap-4">
                <div>
                  <p className="text-xl font-medium tracking-[-0.02em]">{s.name}</p>
                  <p className="mt-1 text-[15px] text-muted-foreground">{s.field}</p>
                </div>
                <span className={`mt-1 inline-flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-sm transition-colors ${s.url ? "group-hover:border-primary group-hover:bg-primary group-hover:text-white" : "text-muted-foreground"}`}>
                  {s.url ? <>Visit site <span aria-hidden>↗</span></> : "Coming soon"}
                </span>
              </div>
            </>
          );
          return (
            <Reveal key={s.name} delay={(i % 2) * 0.08}>
              {s.url ? (
                <a href={s.url} target="_blank" rel="noopener noreferrer" className="group block transition-transform duration-300 hover:-translate-y-1">{body}</a>
              ) : (
                <div className="group">{body}</div>
              )}
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
