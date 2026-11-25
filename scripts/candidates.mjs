// Temporary: labelled contact sheet of candidate photos for review (preview builds only).
import sharp from "sharp";
import fs from "node:fs/promises";
const IDS = ["1758685848001-0396a85ba84f", "1758685845906-6f705cde4fb7", "1758685848147-e1e149bf2603", "1560439513-74b037a25d84", "1560523160-754a9e25c68f", "1612936008632-9b6dafe9c07a"];
if (process.env.OFFLINE === "1") process.exit(0);
const W = 600, H = 440, C = 2;
const tiles = [];
for (const [i, id] of IDS.entries()) {
  try {
    const r = await fetch(`https://images.unsplash.com/photo-${id}?w=700&q=70&fm=jpg`);
    const b = Buffer.from(await r.arrayBuffer());
    const label = Buffer.from(`<svg width="${W}" height="${H}"><rect width="34" height="24" fill="#2b59f3"/><text x="8" y="17" font-size="15" font-family="Arial" fill="white">${i}</text></svg>`);
    tiles.push({ input: await sharp(b).resize(W, H, { fit: "contain", background: "#eeeeee" }).composite([{ input: label, left: 0, top: 0 }]).toBuffer(), left: (i % C) * W, top: Math.floor(i / C) * H });
  } catch (e) { console.log("cand fail", i, e.message); }
}
const jpg = await sharp({ create: { width: W * C, height: H * Math.ceil(IDS.length / C), channels: 3, background: "#fff" } }).composite(tiles).jpeg({ quality: 82 }).toBuffer();
await fs.mkdir("public/img", { recursive: true });
await fs.writeFile("public/img/candidates.json", JSON.stringify({ jpg: jpg.toString("base64") }));
console.log("candidates ok");
