// Temporary: save hagaelimam.com HTML so we can read it from the preview.
import fs from "node:fs";
try {
  const r = await fetch("https://hagaelimam.com/", { headers: { "user-agent": "Mozilla/5.0" } });
  fs.mkdirSync("public/img", { recursive: true });
  fs.writeFileSync("public/img/peek.txt", `${r.status}\n${(await r.text()).slice(0, 200000)}`);
} catch (e) { console.log("peek failed", e.message); }
