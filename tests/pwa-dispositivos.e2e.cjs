const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { chromium } = (() => {
  try { return require("playwright"); }
  catch {
    return require(path.join(process.env.TEMP || process.env.TMP || "/tmp",
      "fluir-browser-qa-2211", "node_modules", "playwright"));
  }
})();
const root = path.resolve(__dirname, "..");
const origin = process.env.FLUIR_QA_ORIGIN || "http://127.0.0.1:5505";
const cases = [];
async function test(name, fn) {
  try { await fn(); cases.push("PASS " + name); console.log("PASS", name); }
  catch (error) {
    cases.push("FAIL " + name + " " + error.message);
    console.error("FAIL", name, error.stack || error);
    throw error;
  }
}
(async () => {
  const manifest = JSON.parse(fs.readFileSync(path.join(root, "manifest.webmanifest"), "utf8"));
  await test("Manifesto abre o login em janela standalone", () => {
    assert.equal(manifest.start_url, "/html/login.html");
    assert.equal(manifest.display, "standalone");
    assert.equal(manifest.scope, "/");
    assert.equal(manifest.id, "/");
  });
  await test("Ícones PNG 192, 512, maskable e iOS 180 corretos", () => {
    const imgs = [
      ["fluir-192.png", 192], ["fluir-512.png", 512],
      ["fluir-maskable-512.png", 512], ["apple-touch-icon.png", 180]
    ];
    imgs.forEach(([file, size]) => {
      const data = fs.readFileSync(path.join(root, "Assets/brand/icons", file));
      assert.equal(data.readUInt32BE(16), size);
      assert.equal(data.readUInt32BE(20), size);
    });
    assert.ok(manifest.icons.some(icon => icon.sizes === "192x192"));
    assert.ok(manifest.icons.some(icon => icon.sizes === "512x512"));
    assert.ok(manifest.icons.some(icon => icon.purpose === "maskable"));
  });
  await test("Todas as telas públicas e módulos têm metadados PWA", () => {
    const files = [path.join(root, "index.html"),
      ...fs.readdirSync(path.join(root, "html")).filter(n => n.endsWith(".html"))
        .map(n => path.join(root, "html", n))];
    for (const file of files) {
      const src = fs.readFileSync(file, "utf8");
      assert.ok(src.includes('rel="manifest"'), file + " manifest");
      assert.ok(src.includes('rel="apple-touch-icon"'), file + " apple icon");
      assert.ok(src.includes('/js/pwa-register.js'), file + " service worker");
      assert.ok(src.toLowerCase().includes("</head>"), file + " head closed");
    }
  });
  const browser = await chromium.launch({
    headless: true,
    executablePath: process.env.CHROME_BIN ||
      "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    args: ["--no-sandbox"]
  });
  try {
    const context = await browser.newContext({ viewport: { width: 1280, height: 850 } });
    const page = await context.newPage();
    await page.goto(origin + "/index.html", { waitUntil: "load" });
    await test("Manifesto e ícones servidos com HTTP 200", async () => {
      for (const endpoint of ["/manifest.webmanifest",
        "/Assets/brand/icons/fluir-192.png", "/Assets/brand/icons/fluir-512.png",
        "/Assets/brand/icons/apple-touch-icon.png", "/js/pwa-register.js"]) {
        const response = await context.request.get(origin + endpoint);
        assert.equal(response.status(), 200, endpoint);
      }
    });
    await test("Service Worker registra no localhost como origem segura", async () => {
      await page.waitForFunction(async () => {
        const registration = await navigator.serviceWorker.getRegistration("/");
        return Boolean(registration?.active);
      }, null, { timeout: 12000 });
      assert.equal(await page.evaluate(() => window.isSecureContext), true);
    });
    await test("Cache offline contém só ativos públicos, não dados pessoais", async () => {
      const urls = await page.evaluate(async () => {
        const keys = await caches.keys();
        const entries = [];
        for (const key of keys) {
          const cache = await caches.open(key);
          for (const req of await cache.keys()) entries.push(new URL(req.url).pathname);
        }
        return entries;
      });
      assert.ok(urls.includes("/offline.html"));
      assert.ok(urls.includes("/index.html"));
      assert.equal(urls.some(u => /api|onboarding|ciclo|finance|login|dashboard|tasks/i.test(u)), false);
    });
    await page.goto(origin + "/html/login.html", { waitUntil: "load" });
    await test("Login também registra a PWA e oferece metadados", async () => {
      assert.equal(await page.locator('link[rel="manifest"]').count(), 1);
      assert.equal(await page.locator('link[rel="apple-touch-icon"]').count(), 1);
    });
    await context.setOffline(true);
    await page.goto(origin + "/html/tasks.html", { waitUntil: "domcontentloaded" });
    await test("Sem conexão, mostra aviso claro, sem tentar carregar dados pessoais", async () => {
      assert.match(await page.locator("h1").innerText(), /sem conexão/i);
      assert.match(await page.locator("main").innerText(), /nenhuma alteração foi salva/i);
      await page.screenshot({path: path.join(__dirname, "evidencia-pwa-offline.png"), fullPage: true});
    });
    await context.setOffline(false);
    await page.goto(origin + "/html/login.html", { waitUntil: "domcontentloaded" });
    await test("A conexão recupera a página real de login", async () => {
      assert.match(await page.title(), /Fluir/i);
      assert.equal(await page.locator("form").count() > 0, true);
    });
    const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true });
    await mobile.goto(origin + "/html/login.html", { waitUntil: "domcontentloaded" });
    await test("Login com viewport 390 px não cria overflow horizontal", async () => {
      const data = await mobile.evaluate(() =>
        ({ width: innerWidth, scroll: document.documentElement.scrollWidth }));
      assert.ok(data.scroll <= data.width + 1, JSON.stringify(data));
    });
    await mobile.close();
    await context.close();
  } finally { await browser.close(); }
  const output = path.join(__dirname, "relatorio-pwa-23-11.txt");
  fs.writeFileSync(output, cases.join("\n") + "\n" + cases.length + " testes aprovados\n");
  console.log(cases.length, "testes aprovados");
})().catch((error) => { console.error(error.message); process.exitCode = 1; });
