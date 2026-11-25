// Puts our own mock screens (Google results, profile list) onto real device photos at build time.
import sharp from "sharp";
import fs from "node:fs";

const ICONS = JSON.parse(fs.readFileSync(new URL("../src/components/cited/platformIcons.json", import.meta.url)));
const FONT = "Arial, Helvetica, sans-serif";
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");

function txt(x, y, size, fill, s, weight = 400, anchor = "start") {
  return `<text x="${x}" y="${y}" font-family="${FONT}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}">${esc(s)}</text>`;
}
function icon(key, x, y, size, fill) {
  return `<g transform="translate(${x},${y}) scale(${size / 24})"><path d="${ICONS[key].path}" fill="${fill}"/></g>`;
}
function googleWord(x, y, size) {
  const c = ["#4285F4", "#EA4335", "#FBBC05", "#4285F4", "#34A853", "#EA4335"];
  return `<text x="${x}" y="${y}" font-family="${FONT}" font-size="${size}" font-weight="700">${"Google".split("").map((l, i) => `<tspan fill="${c[i]}">${l}</tspan>`).join("")}</text>`;
}

function serp(w, h) {
  const u = w / 100; // layout unit
  const res = (y, site, url, title, line, fav, favFill) => `
    <circle cx="${6 * u}" cy="${y}" r="${1.9 * u}" fill="${favFill}"/>${fav}
    ${txt(9.5 * u, y - 0.4 * u, 2.3 * u, "#202124", site, 600)}
    ${txt(9.5 * u, y + 2.4 * u, 1.9 * u, "#5f6368", url)}
    ${txt(4 * u, y + 7.6 * u, 3.6 * u, "#1a0dab", title, 500)}
    ${txt(4 * u, y + 11.8 * u, 2.2 * u, "#4d5156", line)}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
  <rect width="${w}" height="${h}" fill="#ffffff"/>
  ${googleWord(4 * u, 8 * u, 5.4 * u)}
  <rect x="${24 * u}" y="${3 * u}" width="${52 * u}" height="${7 * u}" rx="${3.5 * u}" fill="#ffffff" stroke="#dfe1e5" stroke-width="${0.35 * u}"/>
  ${txt(27 * u, 7.7 * u, 2.9 * u, "#202124", "Dr. Your Name")}
  <circle cx="${72 * u}" cy="${6.2 * u}" r="${1.3 * u}" fill="none" stroke="#4285F4" stroke-width="${0.45 * u}"/>
  <line x1="${73 * u}" y1="${7.2 * u}" x2="${74.2 * u}" y2="${8.4 * u}" stroke="#4285F4" stroke-width="${0.45 * u}"/>
  ${txt(4 * u, 15 * u, 2.1 * u, "#1a73e8", "All", 600)}${txt(10 * u, 15 * u, 2.1 * u, "#5f6368", "Scholar")}${txt(20 * u, 15 * u, 2.1 * u, "#5f6368", "Images")}${txt(30 * u, 15 * u, 2.1 * u, "#5f6368", "News")}
  <rect x="${3.6 * u}" y="${16.4 * u}" width="${4.6 * u}" height="${0.5 * u}" fill="#1a73e8"/>
  <rect x="0" y="${17.2 * u}" width="${w}" height="${0.15 * u}" fill="#ebebeb"/>
  ${res(23 * u, "Dr. Your Name", "yourname.com", "Dr. Your Name | Professor", "Official site. Research, talks, media.", txt(6 * u, 23.8 * u, 2.2 * u, "#fff", "Y", 700, "middle"), "#2B59F3")}
  ${res(42 * u, "Google Scholar", "scholar.google.com", "Dr. Your Name | Google Scholar", "Verified profile. All publications.", icon("scholar", 4.6 * u, 40.6 * u, 2.8 * u, "#fff"), "#4285F4")}
  ${res(61 * u, "ORCID", "orcid.org", "Dr. Your Name | ORCID", "Works, education and funding.", icon("orcid", 4.6 * u, 59.6 * u, 2.8 * u, "#A6CE39"), "#ffffff")}
  <rect x="${62 * u}" y="${20 * u}" width="${34 * u}" height="${44 * u}" rx="${1.6 * u}" fill="#ffffff" stroke="#dadce0" stroke-width="${0.3 * u}"/>
  <circle cx="${79 * u}" cy="${30 * u}" r="${6 * u}" fill="#EAF0FE"/>
  <circle cx="${79 * u}" cy="${28 * u}" r="${2.4 * u}" fill="#2B59F3"/>
  <path d="M${74.6 * u} ${34.6 * u} q${4.4 * u} -${5 * u} ${8.8 * u} 0 z" fill="#2B59F3"/>
  ${txt(79 * u, 42 * u, 3 * u, "#202124", "Dr. Your Name", 600, "middle")}
  ${txt(79 * u, 46 * u, 2 * u, "#5f6368", "Professor", 400, "middle")}
  <rect x="${65 * u}" y="${50 * u}" width="${28 * u}" height="${1.2 * u}" rx="${0.6 * u}" fill="#e8eaed"/>
  <rect x="${65 * u}" y="${53.5 * u}" width="${22 * u}" height="${1.2 * u}" rx="${0.6 * u}" fill="#e8eaed"/>
  <rect x="${65 * u}" y="${57 * u}" width="${25 * u}" height="${1.2 * u}" rx="${0.6 * u}" fill="#e8eaed"/>
  <rect x="${43 * u}" y="${19.6 * u}" width="${15 * u}" height="${4.6 * u}" rx="${2.3 * u}" fill="#2B59F3"/>
  ${txt(50.5 * u, 22.8 * u, 2.2 * u, "#fff", "#1 on Google", 700, "middle")}
</svg>`;
}

function profiles(w, h) {
  const u = w / 100;
  const rows = [
    ["scholar", "Google Scholar", "#4285F4", "Verified"],
    ["orcid", "ORCID", "#A6CE39", "Linked"],
    ["scopus", "Scopus", "#E9711C", "Merged"],
    ["researchgate", "ResearchGate", "#00CCBB", "Updated"],
    ["linkedin", "LinkedIn", "#0A66C2", "Complete"],
  ];
  const top = 17 * u, rh = (h - top - 2 * u) / rows.length;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
  <rect width="${w}" height="${h}" fill="#FBFAF7"/>
  <circle cx="${8 * u}" cy="${8.5 * u}" r="${4.2 * u}" fill="#EAF0FE"/>
  <circle cx="${8 * u}" cy="${7.3 * u}" r="${1.6 * u}" fill="#2B59F3"/>
  <path d="M${5.2 * u} ${11.2 * u} q${2.8 * u} -${3.4 * u} ${5.6 * u} 0 z" fill="#2B59F3"/>
  ${txt(15 * u, 8 * u, 3.6 * u, "#0A0F1F", "Dr. Your Name", 700)}
  ${txt(15 * u, 12 * u, 2.3 * u, "#5f6368", "Academic profiles")}
  <rect x="${72 * u}" y="${5 * u}" width="${24 * u}" height="${5.6 * u}" rx="${2.8 * u}" fill="#2B59F3"/>
  ${txt(84 * u, 8.7 * u, 2.3 * u, "#fff", "All in sync", 700, "middle")}
  ${rows.map(([k, name, col, st], i) => {
    const y = top + i * rh, cy = y + rh / 2, s = Math.min(rh * 0.5, 5.5 * u);
    return `<rect x="${4 * u}" y="${y + rh * 0.1}" width="${92 * u}" height="${rh * 0.8}" rx="${1.6 * u}" fill="#ffffff" stroke="#e6e6e6" stroke-width="${0.25 * u}"/>
    ${icon(k, 7 * u, cy - s / 2, s, col)}
    ${txt(7 * u + s + 3 * u, cy + 1.1 * u, 3 * u, "#0A0F1F", name, 600)}
    <circle cx="${73 * u}" cy="${cy}" r="${1.7 * u}" fill="#1E8E3E"/>
    <path d="M${72.1 * u} ${cy} l${0.7 * u} ${0.7 * u} l${1.3 * u} -${1.4 * u}" stroke="#fff" stroke-width="${0.45 * u}" fill="none"/>
    ${txt(76 * u, cy + 1 * u, 2.6 * u, "#1E8E3E", st, 600)}`;
  }).join("")}
</svg>`;
}

// Find the screen: the run of rows/cols where the mask fills most of the line.
function runs(arr, min) {
  const out = []; let s = -1;
  arr.forEach((v, i) => { if (v >= min && s < 0) s = i; if ((v < min || i === arr.length - 1) && s >= 0) { out.push([s, v >= min ? i : i - 1]); s = -1; } });
  return out;
}
async function detect(buf, W, H, mode) {
  const { data } = await sharp(buf).greyscale().raw().toBuffer({ resolveWithObject: true });
  const on = (x, y) => (mode === "bright" ? data[y * W + x] > 232 : data[y * W + x] < 60);
  const rowCount = Array.from({ length: H }, (_, y) => { let c = 0; for (let x = 0; x < W; x++) c += on(x, y); return c; });
  let top, bot;
  if (mode === "bright") {
    const r = runs(rowCount, W * 0.2).sort((a, b) => b[1] - b[0] - (a[1] - a[0]))[0];
    if (!r) return null; [top, bot] = r;
  } else {
    const r = runs(rowCount, W * 0.2);
    if (r.length < 2) return null; top = r[0][1] + 1; bot = r[1][0] - 1;
  }
  const colCount = Array.from({ length: W }, (_, x) => { let c = 0; for (let y = top; y <= bot; y++) c += on(x, y); return c; });
  const hgt = bot - top + 1;
  let left, right;
  if (mode === "bright") {
    const r = runs(colCount, hgt * 0.6).sort((a, b) => b[1] - b[0] - (a[1] - a[0]))[0];
    if (!r) return null; [left, right] = r;
  } else {
    const r = runs(colCount, hgt * 0.8).filter(([a, b]) => b - a < W * 0.1);
    if (r.length < 2) return null; left = r[0][1] + 1; right = r[r.length - 1][0] - 1;
  }
  if (right - left < W * 0.2 || bot - top < H * 0.15) return null;
  return { left, top, width: right - left + 1, height: bot - top + 1 };
}

export async function withScreen(src, p) {
  const W = 1500, H = 1000;
  const base = await sharp(src).rotate().resize(W, H, { fit: "cover" }).toBuffer();
  const r = (await detect(base, W, H, p.mask)) || p.fallback;
  console.log(`screen ${p.screen}`, JSON.stringify(r));
  const inset = Math.round(r.width * 0.006);
  const sw = r.width - inset * 2, sh = r.height - inset * 2;
  const svg = Buffer.from((p.screen === "serp" ? serp : profiles)(sw, sh));
  const shot = await sharp(svg).resize(sw, sh).png().toBuffer();
  const comp = await sharp(base).composite([{ input: shot, left: r.left + inset, top: r.top + inset }]).toBuffer();
  // zoom so the screen fills most of the card
  const ratio = p.w / p.h;
  let cw = Math.min(W, Math.round(r.width / (p.fill || 0.62))), ch = Math.round(cw / ratio);
  if (ch > H) { ch = H; cw = Math.round(ch * ratio); }
  const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
  const left = Math.max(0, Math.min(W - cw, Math.round(cx - cw / 2)));
  const top = Math.max(0, Math.min(H - ch, Math.round(cy - ch / 2)));
  return sharp(comp).extract({ left, top, width: cw, height: ch }).resize(p.w, p.h);
}
