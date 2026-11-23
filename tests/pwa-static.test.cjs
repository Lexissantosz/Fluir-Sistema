const { test } = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync, readdirSync, existsSync } = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
const read = file => readFileSync(path.join(root, file), "utf8");
const manifest = JSON.parse(read("manifest.webmanifest"));

test("PWA instalável mantém ID estável, login e modo standalone", () => {
  assert.equal(manifest.id, "/");
  assert.equal(manifest.start_url, "/html/login.html");
  assert.equal(manifest.scope, "/");
  assert.equal(manifest.display, "standalone");
});
test("Ícones reais da marca existem nos tamanhos exigidos", () => {
  const images = [
    ["fluir-192.png", 192], ["fluir-512.png", 512],
    ["fluir-maskable-512.png", 512], ["apple-touch-icon.png", 180]
  ];
  for (const [name, size] of images) {
    const file = readFileSync(path.join(root, "Assets/brand/icons", name));
    assert.equal(file.toString("ascii", 1, 4), "PNG");
    assert.equal(file.readUInt32BE(16), size);
    assert.equal(file.readUInt32BE(20), size);
  }
  assert.ok(manifest.icons.some(icon => icon.sizes === "192x192"));
  assert.ok(manifest.icons.some(icon => icon.sizes === "512x512"));
  assert.ok(manifest.icons.some(icon => icon.purpose === "maskable"));
});
test("Todas as páginas oferecem manifesto, ícone iOS e registro seguro", () => {
  for (const file of ["index.html", ...readdirSync(path.join(root, "html"))
    .filter(n => n.endsWith(".html")).map(n => "html/" + n)]) {
    const doc = read(file);
    assert.match(doc, /rel="manifest"/, file);
    assert.match(doc, /rel="apple-touch-icon"/, file);
    assert.match(doc, /js\/pwa-register\.js/, file);
    assert.match(doc, /<\/head>/i, file);
  }
});
test("Service Worker não deve armazenar tokens nem páginas privadas", () => {
  const worker = read("service-worker.js");
  assert.match(worker, /request\.headers\.has\("Authorization"\)/);
  assert.match(worker, /url\.pathname\.startsWith\("\/api\/"\)/);
  assert.match(worker, /PUBLIC_ASSETS/);
  assert.doesNotMatch(worker, /localStorage|sessionStorage|credentials:\s*"include"/);
  assert.ok(existsSync(path.join(root, "offline.html")));
});
test("Capacitor aponta para login e permite somente conteúdo HTTPS", () => {
  const cap = JSON.parse(read("capacitor.config.json"));
  assert.equal(cap.appId, "br.com.fluir.sistema");
  assert.equal(cap.server.appStartPath, "/html/login.html");
  assert.equal(cap.server.androidScheme, "https");
  assert.equal(cap.android.allowMixedContent, false);
});
test("Preparação Android existe e exclui arquivos .env e backend", () => {
  const prepare = read("scripts/prepare-web.mjs");
  assert.ok(prepare.includes('"index.html"'));
  assert.ok(prepare.includes('"service-worker.js"'));
  assert.doesNotMatch(prepare, /"\.env"|"backend"|"tests"/);
});
