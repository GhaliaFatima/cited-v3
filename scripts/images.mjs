// Downloads free Unsplash photos at build time (Vercel can reach Unsplash; the local sandbox cannot).
// OFFLINE=1 writes neutral placeholders so the layout can be checked locally.
import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";
import { withScreen } from "./screens.mjs";

async function cropped(src, c) {
  const img = sharp(await sharp(src).rotate().toBuffer());
  if (!c) return img;
  const { width: W, height: H } = await img.metadata();
  return img.extract({ left: Math.round(c.l * W), top: Math.round(c.t * H), width: Math.round(c.w * W), height: Math.round(c.h * H) });
}

const OUT = path.resolve("public/img");
const OFFLINE = process.env.OFFLINE === "1";

// All free under the Unsplash License
export const PHOTOS = {
  lecture: { url: "https://images.pexels.com/photos/8197534/pexels-photo-8197534.jpeg?w=4000", w: 1400, h: 1500, tint: "#a87a3c", crop: { l: 0.48, t: 0.164, w: 0.52, h: 0.836 } },   // professor seen from behind, lecturing a diverse class (hero, Pexels, Yan Krukau)
  scholar: { id: "1633279309534-f761427548b6", w: 1200, h: 1400, tint: "#e4e2dd" },   // scholar in hijab holding a book
  lab: { id: "1758539412501-fbf2b62b47bf", w: 1400, h: 1000, tint: "#bfc8d2" },       // scholar surrounded by bookshelves
  whiteboard: { id: "1554765780-6bb048f2b02f", w: 1200, h: 1400, tint: "#d3d0c9" },// academic in a graduation gown
  found: { id: "1785245560368-f6d715956e5d", w: 1400, h: 800, tint: "#1c1c1c", screen: "serp", mask: "bright", fallback: { left: 387, top: 220, width: 726, height: 480 } },     // laptop showing our Google results mock
  listed: { id: "1527443195645-1133f7f28990", w: 1400, h: 800, tint: "#f2f2f2", screen: "profiles", mask: "dark", fallback: { left: 420, top: 300, width: 680, height: 388 } }, // desktop showing synced academic profiles
  known: { url: "https://img.magnific.com/free-photo/corporate-businessman-giving-presentation-large-audience_53876-101865.jpg", w: 1400, h: 800, tint: "#1d4fd8", pos: "west" },  // speaker at a podium, audience from behind (Magnific free)
  prof: { url: "https://img.magnific.com/free-photo/portrait-succesful-senior-entrrepeneur-conference-room_482257-4100.jpg", w: 900, h: 1100, tint: "#4a4a4a", pos: "north" },   // senior professor portrait (Magnific free, DC Studio)
  phd: { url: "https://img.magnific.com/free-photo/physician-researcher-dropping-liquid-medical-glassware-using-micropipette-analyzing-coronavirus-vaccine-expertise-biologist-specialist-doctor-working-pharmacology-hospital-laboratory_482257-26491.jpg", w: 900, h: 1100, tint: "#5a6a7a", pos: "north" },   // researcher in a lab (Magnific free, DC Studio)
  campus: { id: "1762512346988-045f4d5ad2b3", w: 1200, h: 1400, tint: "#b9b2a6" },    // university library from above
};

async function fetchPhoto(id, url) {
  const res = await fetch(url || `https://images.unsplash.com/photo-${id}?w=2000&q=80&fm=jpg`, {
    redirect: "follow",
    headers: { "user-agent": "Mozilla/5.0 (compatible; cited-site-build)" },
  });
  const type = res.headers.get("content-type") || "";
  if (!res.ok || !type.startsWith("image/")) throw new Error(`${res.status} ${type}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 20000) throw new Error(`too small ${buf.length}`);
  return buf;
}

await fs.mkdir(OUT, { recursive: true });
const review = {};
for (const [name, p] of Object.entries(PHOTOS)) {
  const file = path.join(OUT, `${name}.webp`);
  let img;
  if (!OFFLINE) {
    try {
      const src = await fetchPhoto(p.id, p.url);
      img = p.screen ? await withScreen(src, p) : (await cropped(src, p.crop)).resize(p.w, p.h, { fit: "cover", position: p.pos || "attention" });
      console.log(`photo ok ${name}`);
    } catch (e) {
      console.log(`photo FAILED ${name}: ${e.message}`);
    }
  }
  if (!img) img = sharp({ create: { width: p.w, height: p.h, channels: 3, background: p.tint } });
  const out = await img.webp({ quality: 78 }).toBuffer();
  await fs.writeFile(file, out);
  const thumb = await sharp(out).resize(360).jpeg({ quality: 60 }).toBuffer();
  review[name] = thumb.toString("base64");
}
await fs.writeFile(path.join(OUT, "review.json"), JSON.stringify(review));
// one small contact sheet for quick visual checks
const names = Object.keys(PHOTOS);
const tiles = await Promise.all(names.map(async (n) => ({ input: await sharp(path.join(OUT, `${n}.webp`)).resize(300, 210, { fit: "cover" }).toBuffer() })));
const sheet = await sharp({ create: { width: 900, height: 420 * Math.ceil(names.length / 3) / 2, channels: 3, background: "#ffffff" } })
  .composite(tiles.map((t, i) => ({ ...t, left: (i % 3) * 300, top: Math.floor(i / 3) * 210 })))
  .jpeg({ quality: 55 }).toBuffer();
await fs.writeFile(path.join(OUT, "sheet.json"), JSON.stringify({ names, jpg: sheet.toString("base64") }));
