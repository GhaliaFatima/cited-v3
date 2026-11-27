// Temporary: labelled contact sheet of candidate photos for review (preview builds only).
import sharp from "sharp";
import fs from "node:fs/promises";
const IDS = ["1544531586-fde5298cdd40", "1769755449087-464156398537", "1770097286213-6d6fc60f4cdf", "1770097320686-d7c99363b94c", "1587825140708-dfaf72ae4b04", "pexels:1708936"];
if (process.env.OFFLINE === "1") process.exit(0);
const W = 300, H = 220, C = 3;
const tiles = [];
for (const [i, id] of IDS.entries()) {
  try {
    const r = await fetch(id.startsWith("pexels:") ? `https://images.pexels.com/photos/${id.slice(7)}/pexels-photo-${id.slice(7)}.jpeg?auto=compress&w=700` : `https://images.unsplash.com/photo-${id}?w=700&q=70&fm=jpg`);
    const b = Buffer.from(await r.arrayBuffer());
    const label = Buffer.from(`<svg width="${W}" height="${H}"><rect width="34" height="24" fill="#2b59f3"/><text x="8" y="17" font-size="15" font-family="Arial" fill="white">${i}</text></svg>`);
    tiles.push({ input: await sharp(b).resize(W, H, { fit: "cover", position: "attention" }).composite([{ input: label, left: 0, top: 0 }]).toBuffer(), left: (i % C) * W, top: Math.floor(i / C) * H });
  } catch (e) { console.log("cand fail", i, e.message); }
}
const jpg = await sharp({ create: { width: W * C, height: H * Math.ceil(IDS.length / C), channels: 3, background: "#fff" } }).composite(tiles).jpeg({ quality: 60 }).toBuffer();
await fs.mkdir("public/img", { recursive: true });
await fs.writeFile("public/img/candidates.json", JSON.stringify({ jpg: jpg.toString("base64") }));
console.log("candidates ok");
