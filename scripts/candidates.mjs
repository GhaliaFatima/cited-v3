// Temporary: builds a labelled contact sheet of candidate photos for review.
import sharp from "sharp";
import fs from "node:fs/promises";
const IDS = ["1758539412501-fbf2b62b47bf","1700082990053-e9f50584eda0","1766867257943-0665537fb2dd","1758691736545-5c33b6255dca","1758691736084-4ef3e6f6a2cf"];
if (process.env.OFFLINE === "1") process.exit(0);
const W = 300, H = 220, C = 3;
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
