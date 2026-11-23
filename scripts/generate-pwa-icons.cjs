const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");

const root = path.resolve(__dirname, "..");
const iconSource = fs.readFileSync(path.join(root, "Assets", "brand", "fluir-symbol.svg"), "utf8");
const output = path.join(root, "Assets", "brand", "icons");
const { chromium } = (() => {
  try { return require("playwright"); } catch {
    return require(path.join(process.env.TEMP || process.env.TMP || "/tmp",
      "fluir-browser-qa-2211", "node_modules", "playwright"));
  }
})();
const browserPath = process.env.CHROME_BIN ||
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const sizes = [
  { name: "fluir-192.png", size: 192, scale: 0.66 },
  { name: "fluir-512.png", size: 512, scale: 0.66 },
  { name: "fluir-maskable-512.png", size: 512, scale: 0.59 },
  { name: "apple-touch-icon.png", size: 180, scale: 0.64 },
  { name: "icon.png", size: 1024, scale: 0.66, target: "resources" },
  { name: "splash.png", size: 2732, scale: 0.26, target: "resources" }
];
(async () => {
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({
    headless: true,
    executablePath: browserPath,
    args: ["--no-sandbox"]
  });
  try {
    const page = await browser.newPage();
    for (const item of sizes) {
      const base64 = await page.evaluate(async ({ svg, size, scale }) => {
        const image = new Image();
        image.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
        await image.decode();
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#FAF8FD";
        ctx.fillRect(0, 0, size, size);
        const dim = Math.round(size * scale);
        ctx.drawImage(image, (size - dim) / 2, (size - dim) / 2, dim, dim);
        return canvas.toDataURL("image/png").split(",")[1];
      }, { svg: iconSource, size: item.size, scale: item.scale });
      const binary = Buffer.from(base64, "base64");
      assert.equal(binary.readUInt32BE(16), item.size);
      assert.equal(binary.readUInt32BE(20), item.size);
      const destDir = item.target === "resources" ? path.join(root, "resources") : output;
      fs.mkdirSync(destDir, { recursive: true });
      const target = path.join(destDir, item.name);
      fs.writeFileSync(target, binary);
      console.log(item.name, item.size + "x" + item.size, binary.length, "bytes");
    }
    await page.close();
  } finally { await browser.close(); }
})().catch(error => { console.error(error.message); process.exitCode = 1; });
