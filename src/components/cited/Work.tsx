import { Dot, Heading, Reveal } from "./ui";

// Scholars we have built for. Haga Elimam is real; the other three are placeholders to replace.
const FEATURED = {
  first: "Prof. Dr. Haga",
  last: "Elimam",
  title: "Professor of Environmental Economics and Sustainable Development",
  place: "King Abdulaziz University, Jeddah",
  img: "img/haga.webp",
  site: "hagaelimam.com",
  url: "https://hagaelimam.com",
  built: ["Scholar website", "Publications and teaching pages", "Research and supervision", "ORCID and ResearchGate linked"],
};

type Scholar = { name: string; title: string; built: string; img: string; site: string; url?: string };
const OTHERS: Scholar[] = [
  { name: "Dr. Sarah Collins", title: "Associate Professor of Public Health", built: "Website, Scholar and ORCID clean up, monthly posts", img: "img/sarah.webp", site: "sarahcollins.com" },
  { name: "Dr. James Whitaker", title: "Professor of Physics", built: "Website, merged Scopus IDs, Google ranking", img: "img/james.webp", site: "jameswhitaker.com" },
  { name: "Dr. Omar Al Hashimi", title: "Assistant Professor of Finance", built: "Website, LinkedIn and ResearchGate set up", img: "img/omar.webp", site: "omaralhashimi.com" },
];

function SitePill({ site }: { site: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-xs font-medium text-foreground">
      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
      {site}
    </span>
  );
}

export function OurScholars() {
  const f = FEATURED;
  return (
    <section id="work" className="mx-auto max-w-7xl px-5 py-28 sm:px-8 sm:py-36">
      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr] lg:items-end">
        <Reveal><Heading before="Scholars we have" em="built" after=" for" className="max-w-3xl" /></Reveal>
        <Reveal><p className="max-w-sm text-lg text-muted-foreground lg:justify-self-end">Each one started as a CV. Now it is a website people find first.</p></Reveal>
      </div>

      <Reveal className="mt-14">
        <a href={f.url} target="_blank" rel="noopener noreferrer" className="group grid overflow-hidden rounded-[2rem] bg-navy text-white lg:grid-cols-[0.9fr_1.1fr]">
          <div className="relative aspect-[4/5] overflow-hidden lg:aspect-auto lg:min-h-[580px]">
            <img src={f.img} alt={`${f.first} ${f.last}`} loading="lazy" className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]" />
            <div className="absolute bottom-5 left-5"><SitePill site={f.site} /></div>
          </div>
          <div className="flex flex-col justify-between gap-10 p-8 sm:p-12">
            <div>
              <p className="text-sm text-white/60">{f.place}</p>
              <h3 className="display mt-4 text-[2.4rem] leading-[0.98] sm:text-6xl">
                {f.first} <span className="serif-em">{f.last}</span><Dot />
              </h3>
              <p className="mt-5 max-w-md text-lg text-white/75">{f.title}</p>
            </div>
            <div>
              <p className="text-sm text-white/60">What we built</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {f.built.map((b) => <li key={b} className="rounded-full border border-white/20 px-4 py-2 text-sm">{b}</li>)}
              </ul>
              <span className="mt-10 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-[15px] font-medium text-foreground transition-colors group-hover:bg-primary group-hover:text-white">
                Visit {f.site} <span aria-hidden>↗</span>
              </span>
            </div>
          </div>
        </a>
      </Reveal>

      <div className="mt-6 grid gap-6 md:grid-cols-3">
        {OTHERS.map((s, i) => (
          <Reveal key={s.name} delay={i * 0.08}>
            <div className="group">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.6rem] bg-paper">
                <img src={s.img} alt={s.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]" />
                <div className="absolute bottom-4 left-4"><SitePill site={s.site} /></div>
              </div>
              <div className="mt-5 flex items-start justify-between gap-4">
                <div>
                  <p className="text-xl font-medium tracking-[-0.02em]">{s.name}</p>
                  <p className="mt-1 text-[15px] text-muted-foreground">{s.title}</p>
                </div>
                {s.url ? (
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="mt-0.5 shrink-0 rounded-full border px-4 py-2 text-sm hover:border-primary hover:bg-primary hover:text-white">Visit <span aria-hidden>↗</span></a>
                ) : (
                  <span className="mt-0.5 shrink-0 rounded-full border px-4 py-2 text-sm text-muted-foreground">Soon</span>
                )}
              </div>
              <p className="mt-4 border-t pt-4 text-[15px] text-muted-foreground">{s.built}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
