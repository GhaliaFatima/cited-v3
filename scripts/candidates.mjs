// Temporary: labelled contact sheet of candidate photos for review (preview builds only).
import sharp from "sharp";
import fs from "node:fs/promises";
const IDS = ["https://images.unsplash.com/photo-1758270704262-ecc82b23dc37?w=1200&q=70&fm=jpg", "https://images.unsplash.com/photo-1758270704925-fa59d93119c1?w=1200&q=70&fm=jpg", "https://images.unsplash.com/photo-1758270704349-1ad411aa1281?w=1200&q=70&fm=jpg", "https://images.unsplash.com/photo-1758270704602-9d4103704ad4?w=1200&q=70&fm=jpg", "https://images.pexels.com/photos/1709003/pexels-photo-1709003.jpeg?w=1200", "https://images.pexels.com/photos/8761326/pexels-photo-8761326.jpeg?w=1200"];
if (process.env.OFFLINE === "1") process.exit(0);
const W = 600, H = 440, C = 2;
const tiles = [];
for (const [i, id] of IDS.entries()) {
  try {
    const r = await fetch(id, { headers: { "user-agent": "Mozilla/5.0" } });
    const b = Buffer.from(await r.arrayBuffer());
    const label = Buffer.from(`<svg width="${W}" height="${H}"><rect width="34" height="24" fill="#2b59f3"/><text x="8" y="17" font-size="15" font-family="Arial" fill="white">${i}</text></svg>`);
    tiles.push({ input: await sharp(b).resize(W, H, { fit: "contain", background: "#eeeeee" }).composite([{ input: label, left: 0, top: 0 }]).toBuffer(), left: (i % C) * W, top: Math.floor(i / C) * H });
  } catch (e) { console.log("cand fail", i, e.message); }
}
const jpg = await sharp({ create: { width: W * C, height: H * Math.ceil(IDS.length / C), channels: 3, background: "#fff" } }).composite(tiles).jpeg({ quality: 82 }).toBuffer();
await fs.mkdir("public/img", { recursive: true });
await fs.writeFile("public/img/candidates.json", JSON.stringify({ jpg: jpg.toString("base64") }));
console.log("candidates ok");
