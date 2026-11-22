import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
const root = join(process.cwd(), "www");
const pages = ["index.html", "html/login.html", "html/setup.html", "html/dashboard.html", "html/tasks.html", "html/habits.html", "html/water.html", "html/sleep.html", "html/diary.html", "html/finances.html", "html/achievements.html", "html/settings.html", "html/profile.html", "html/menstrual-cycle.html", "html/nutrition.html", "html/physical-health.html", "html/attachments.html", "html/timeline.html", "html/plans.html"];
const assets = ["css/login.css", "js/login.js", "js/dashboard.js", "js/pwa-register.js", "Assets/brand/fluir-symbol.svg", "Assets/brand/fluir-touch-icon.png", "manifest.webmanifest", "service-worker.js"];
const missing = [...pages, ...assets].filter((p) => !existsSync(join(root, p)));
if (missing.length) throw new Error("Faltando arquivos do Fluir: " + missing.join(", "));
const manifest = JSON.parse(readFileSync(join(root, "manifest.webmanifest"), "utf8"));
if (manifest.display !== "standalone" || !manifest.start_url.startsWith("/html/login.html")) throw new Error("PWA: manifest invalido.");
for (const file of ["index.html", "html/login.html"]) {
  const html = readFileSync(join(root,file), "utf8");
  if (!html.includes('rel="manifest"') || !html.includes('pwa-register.js')) throw new Error("PWA nao integrada a " + file);
}
const cap = JSON.parse(readFileSync(join(process.cwd(), "capacitor.config.json"), "utf8"));
if (cap.server?.appStartPath !== "/html/login.html") throw new Error("Android deve abrir login, nao landing.");
console.log("Fluir: " + pages.length + " paginas e " + assets.length + " recursos essenciais verificados.");
