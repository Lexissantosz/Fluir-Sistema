import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL("..", import.meta.url)));
const destination = join(root, "www");
const paths = [
  "index.html", "offline.html", "html", "css", "js",
  "Assets", "manifest.webmanifest", "service-worker.js"
];
const missing = paths.filter(item => !existsSync(join(root, item)));
if (missing.length) throw new Error("Recursos web ausentes: " + missing.join(", "));
mkdirSync(destination, { recursive: true });
for (const item of paths) {
  const target = join(destination, item);
  rmSync(target, { recursive: true, force: true });
  cpSync(join(root, item), target, { recursive: true });
}
console.log("Fluir: assets do sistema web copiados para www sem credenciais, banco ou testes.");
