// Temporary: labelled contact sheet of candidate photos for review (preview builds only).
import sharp from "sharp";
import fs from "node:fs/promises";
const IDS = ["1758685848147-e1e149bf2603", "1758685848208-e108b6af94cc", "1758685848001-0396a85ba84f", "1758685845906-6f705cde4fb7", "1758685848238-001e0cc182ae", "1758270704349-1ad411aa1281"];
if (process.env.OFFLINE === "1") process.exit(0);
const W = 300, H = 220, C = 3;
const tiles = [];
for (const [i, id] of IDS.entries()) {
  try {
    const r = await fetch(id.startsWith("http") ? id : id.startsWith("pexels:") ? `https://images.pexels.com/photos/${id.slice(7)}/pexels-photo-${id.slice(7)}.jpeg?auto=compress&w=700` : `https://images.unsplash.com/photo-${id}?w=700&q=70&fm=jpg`, { headers: { "user-agent": "Mozilla/5.0" } });
    const b = Buffer.from(await r.arrayBuffer());
    const label = Buffer.from(`<svg width="${W}" height="${H}"><rect width="34" height="24" fill="#2b59f3"/><text x="8" y="17" font-size="15" font-family="Arial" fill="white">${i}</text></svg>`);
    tiles.push({ input: await sharp(b).resize(W, H, { fit: "cover", position: "attention" }).composite([{ input: label, left: 0, top: 0 }]).toBuffer(), left: (i % C) * W, top: Math.floor(i / C) * H });
  } catch (e) { console.log("cand fail", i, e.message); }
}
const jpg = await sharp({ create: { width: W * C, height: H * Math.ceil(IDS.length / C), channels: 3, background: "#fff" } }).composite(tiles).jpeg({ quality: 60 }).toBuffer();
await fs.mkdir("public/img", { recursive: true });
await fs.writeFile("public/img/candidates.json", JSON.stringify({ jpg: jpg.toString("base64") }));
console.log("candidates ok");
