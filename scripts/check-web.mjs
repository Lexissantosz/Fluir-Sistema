import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
const root = join(fileURLToPath(new URL("..", import.meta.url)));
const folder = join(root, "www");
const required = [
  "index.html", "offline.html", "html/login.html", "html/setup.html",
  "html/dashboard.html", "html/tasks.html", "html/menstrual-cycle.html",
  "html/cycle-profiles.html", "html/plans.html", "js/login.js",
  "js/setup.js", "js/setup-cycle.js", "js/setup-plans.js",
  "js/pwa-register.js", "css/setup.css", "css/setup-cycle.css",
  "manifest.webmanifest", "service-worker.js",
  "Assets/brand/icons/fluir-192.png", "Assets/brand/icons/fluir-512.png"
];
const missing = required.filter(file => !existsSync(join(folder, file)));
if (missing.length) throw new Error("APK incompleto. Arquivos ausentes: " + missing.join(", "));
const manifest = JSON.parse(readFileSync(join(folder, "manifest.webmanifest"), "utf8"));
if (manifest.start_url !== "/html/login.html" || manifest.display !== "standalone")
  throw new Error("A PWA do Fluir deve abrir login em modo standalone.");
const config = JSON.parse(readFileSync(join(root, "capacitor.config.json"), "utf8"));
if (config.server?.appStartPath !== "/html/login.html" ||
    config.server?.androidScheme !== "https" ||
    config.appId !== "br.com.fluir.sistema")
  throw new Error("Capacitor Android não está configurado para o login seguro.");
console.log("Fluir Android: " + required.length + " arquivos essenciais verificados.");
