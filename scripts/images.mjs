// Downloads free Unsplash photos at build time (Vercel can reach Unsplash; the local sandbox cannot).
// OFFLINE=1 writes neutral placeholders so the layout can be checked locally.
import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";

const OUT = path.resolve("public/img");
const OFFLINE = process.env.OFFLINE === "1";

// All free under the Unsplash License
export const PHOTOS = {
  lecture: { id: "nrE0LK_qN7E", w: 1600, h: 1100, tint: "#c9ced8" },   // professor lecturing in a hall
  classroom: { id: "vyuiyIyboc0", w: 1400, h: 1000, tint: "#cfd3dc" }, // professor lecturing a class
  laptop: { id: "Yor0sJphKAM", w: 1200, h: 1200, tint: "#e4e2dd" },    // scholar in hijab with laptop
  lab: { id: "cK0hjNSgnS4", w: 1400, h: 1000, tint: "#bfc8d2" },       // researcher at microscope
  whiteboard: { id: "OJ-M0afuifg", w: 1400, h: 1000, tint: "#d3d0c9" },// presenting at a whiteboard
  podium: { id: "XSDTr93bhBo", w: 1400, h: 1000, tint: "#9a9a9a" },    // speaking at a podium
};

async function fetchPhoto(id) {
  const res = await fetch(`https://unsplash.com/photos/${id}/download?force=true&w=2000`, {
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
      img = sharp(await fetchPhoto(p.id)).rotate().resize(p.w, p.h, { fit: "cover", position: "attention" });
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
