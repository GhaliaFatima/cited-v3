// Temporary: labelled contact sheet of candidate photos for review (preview builds only).
import sharp from "sharp";
import fs from "node:fs/promises";
const IDS = ["https://images.pexels.com/photos/9275222/pexels-photo-9275222.jpeg?w=1200", "https://images.pexels.com/photos/39351614/pexels-photo-39351614.jpeg?w=1200", "https://images.pexels.com/photos/11329861/pexels-photo-11329861.jpeg?w=1200", "https://images.pexels.com/photos/22669860/pexels-photo-22669860.jpeg?w=1200", "https://images.pexels.com/photos/15448073/pexels-photo-15448073.jpeg?w=1200", "https://images.pexels.com/photos/36791504/pexels-photo-36791504.jpeg?w=1200", "https://images.pexels.com/photos/35064535/pexels-photo-35064535.jpeg?w=1200", "https://img.magnific.com/free-photo/corporate-businessman-giving-presentation-large-audience_53876-101865.jpg"];
if (process.env.OFFLINE === "1") process.exit(0);
const W = 400, H = 400, C = 3;
const tiles = [];
for (const [i, id] of IDS.entries()) {
  try {
    const r = await fetch(id, { headers: { "user-agent": "Mozilla/5.0" } });
    const b = Buffer.from(await r.arrayBuffer());
    const label = Buffer.from(`<svg width="${W}" height="${H}"><rect width="34" height="24" fill="#2b59f3"/><text x="8" y="17" font-size="15" font-family="Arial" fill="white">${i}</text></svg>`);
    tiles.push({ input: await sharp(b).resize(W, H, { fit: "cover", position: "north" }).composite([{ input: label, left: 0, top: 0 }]).toBuffer(), left: (i % C) * W, top: Math.floor(i / C) * H });
  } catch (e) { console.log("cand fail", i, e.message); }
}
const jpg = await sharp({ create: { width: W * C, height: H * Math.ceil(IDS.length / C), channels: 3, background: "#fff" } }).composite(tiles).jpeg({ quality: 82 }).toBuffer();
await fs.mkdir("public/img", { recursive: true });
await fs.writeFile("public/img/candidates.json", JSON.stringify({ jpg: jpg.toString("base64") }));
console.log("candidates ok");
