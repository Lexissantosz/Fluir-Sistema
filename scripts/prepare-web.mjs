import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const webDir = join(root, "www");
const items = ["index.html", "html", "css", "js", "Assets", "manifest.webmanifest", "service-worker.js"];
const missing = items.filter((item) => !existsSync(join(root, item)));
if (missing.length) throw new Error("Arquivos ausentes: " + missing.join(", "));
mkdirSync(webDir, { recursive: true });
for (const item of items) {
  const destination = join(webDir, item);
  rmSync(destination, { recursive: true, force: true });
  cpSync(join(root, item), destination, { recursive: true });
}
console.log("Fluir: arquivos web preparados (" + items.join(", ") + ").");
