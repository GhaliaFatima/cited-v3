// Temporary: builds a labelled contact sheet of candidate photos for review.
import sharp from "sharp";
import fs from "node:fs/promises";
const IDS = ["1758270704602-9d4103704ad4","1758270704851-adff797a2010","1633279309534-f761427548b6","1707944745900-ae9f750f2c69","1755548413928-4aaeba7c740e","1558541966-d1071f7329bd","1747131663744-e04555be2601","1587272114422-ec88be13ab1a","1758270705067-0d7edee57af0","1758685848783-90477ba42678","1509960645955-d9d4a2fe08f4","1684327596702-6bbbe1422375","1758874573402-d0b928c95dd2","1757125736482-328a3cdd9743"];
if (process.env.OFFLINE === "1") process.exit(0);
const W = 240, H = 170, C = 4;
const tiles = [];
for (const [i, id] of IDS.entries()) {
  try {
    const r = await fetch(`https://images.unsplash.com/photo-${id}?w=600&q=70&fm=jpg`);
    const b = Buffer.from(await r.arrayBuffer());
    const label = Buffer.from(`<svg width="${W}" height="${H}"><rect width="34" height="24" fill="#2b59f3"/><text x="6" y="17" font-size="15" font-family="Arial" fill="white">${i}</text></svg>`);
    tiles.push({ input: await sharp(b).resize(W, H, { fit: "cover" }).composite([{ input: label, left: 0, top: 0 }]).toBuffer(), left: (i % C) * W, top: Math.floor(i / C) * H });
  } catch (e) { console.log("cand fail", i, e.message); }
}
const rows = Math.ceil(IDS.length / C);
const jpg = await sharp({ create: { width: W * C, height: H * rows, channels: 3, background: "#fff" } }).composite(tiles).jpeg({ quality: 60 }).toBuffer();
await fs.mkdir("public/img", { recursive: true });
await fs.writeFile("public/img/candidates.json", JSON.stringify({ jpg: jpg.toString("base64") }));
console.log("candidates ok", jpg.length);
