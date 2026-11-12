// Downloads free Unsplash photos at build time (Vercel can reach Unsplash; the local sandbox cannot).
// OFFLINE=1 writes neutral placeholders so the layout can be checked locally.
import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";

const OUT = path.resolve("public/img");
const OFFLINE = process.env.OFFLINE === "1";

// All free under the Unsplash License
export const PHOTOS = {
  lecture: { id: "1758691736084-4ef3e6f6a2cf", w: 1400, h: 1500, tint: "#c9ced8", pos: "north" },   // senior academic presenting at a flip chart (hero)
  classroom: { id: "1758270704851-adff797a2010", w: 1400, h: 1000, tint: "#cfd3dc" }, // professor lecturing a class
  laptop: { id: "1747131663744-e04555be2601", w: 1400, h: 1000, tint: "#e4e2dd" },    // academic working on a laptop in his office
  scholar: { id: "1633279309534-f761427548b6", w: 1200, h: 1400, tint: "#e4e2dd" },   // scholar in hijab holding a book
  lab: { id: "1758539412501-fbf2b62b47bf", w: 1400, h: 1000, tint: "#bfc8d2" },       // scholar surrounded by bookshelves
  whiteboard: { id: "1766867257943-0665537fb2dd", w: 1200, h: 1400, tint: "#d3d0c9" },// researcher presenting at a projector screen
  podium: { id: "1558541966-d1071f7329bd", w: 1400, h: 1000, tint: "#9a9a9a" },    // speaking at a podium
};

async function fetchPhoto(id) {
  const res = await fetch(`https://images.unsplash.com/photo-${id}?w=2000&q=80&fm=jpg`, {
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
      img = sharp(await fetchPhoto(p.id)).rotate().resize(p.w, p.h, { fit: "cover", position: p.pos || "attention" });
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
