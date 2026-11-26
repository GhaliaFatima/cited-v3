// Temporary (preview only): hero options as base64 JPEGs for review.
import sharp from "sharp";
import fs from "node:fs/promises";
const OPTS = {
  1: "https://images.unsplash.com/photo-1544531586-fde5298cdd40?w=2400&q=80&fm=jpg",
  2: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=2400&q=80&fm=jpg",
  3: "https://img.magnific.com/free-photo/corporate-businessman-giving-presentation-large-audience_53876-101865.jpg",
  6: "https://images.pexels.com/photos/8197551/pexels-photo-8197551.jpeg?w=2400",
};
for (const [k, u] of Object.entries(OPTS)) {
  try {
    const r = await fetch(u, { headers: { "user-agent": "Mozilla/5.0" } });
    const b = Buffer.from(await r.arrayBuffer());
    const j = await sharp(b).rotate().resize(1000, 1036, { fit: "cover", position: "attention" }).jpeg({ quality: 70 }).toBuffer();
    await fs.writeFile(`public/img/hero-${k}.json`, JSON.stringify({ jpg: j.toString("base64") }));
    console.log("hero ok", k);
  } catch (e) { console.log("hero fail", k, e.message); }
}
