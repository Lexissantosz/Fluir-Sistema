"use strict";
const assert = require("node:assert/strict");
const { chromium } = require("playwright");
const BASE = process.env.FLUIR_TEST_BASE || "http://127.0.0.1:5505";
const TOKEN = "QA_TOKEN_FALSO_0123456789_DE_USO_LOCAL";
const user = { id: 99101, nome: "QA", email: "qa@example.invalid", token: TOKEN };

(async () => {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  let passed = 0;
  const run = async (name, fn) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    try {
      await fn(page);
      passed++;
      console.log("PASS", name);
    } finally {
      await context.close();
    }
  };
  const seed = async (page, data = {}) => {
    await page.goto(BASE + "/html/login.html");
    await page.evaluate(({ account, setup, completed }) => {
      if (account) sessionStorage.setItem("fluir-user", JSON.stringify(account));
      if (setup) localStorage.setItem("fluir-setup", JSON.stringify(setup));
      if (completed !== undefined) {
        sessionStorage.setItem("fluir-onboarding-completed", String(completed));
      }
    }, data);
  };
  try {
    await run("Dashboard bloqueia acesso sem login", async page => {
      await page.goto(BASE + "/html/dashboard.html");
      await page.waitForURL("**/html/login.html");
      assert.match(page.url(), /login\.html$/);
    });
    await run("Onboarding de outra conta não libera dashboard", async page => {
      await seed(page, { account: user, setup: { usuarioId: 23, onboardingConcluido: true } });
      await page.goto(BASE + "/html/dashboard.html");
      await page.waitForURL("**/html/setup.html");
    });
    await run("Onboarding da própria conta mantém dashboard após recarga", async page => {
      await seed(page, { account: user, setup: { usuarioId: user.id, onboardingConcluido: true } });
      await page.goto(BASE + "/html/dashboard.html");
      await page.waitForTimeout(450);
      assert.match(page.url(), /dashboard\.html$/);
      await page.reload();
      await page.waitForTimeout(450);
      assert.match(page.url(), /dashboard\.html$/);
    });
    await run("Demonstração continua sem login e sem onboarding", async page => {
      await page.goto(BASE + "/html/demo.html");
      assert.equal(await page.locator("body").getAttribute("data-fluir-demo"), "true");
      assert.equal(await page.evaluate(() => sessionStorage.getItem("fluir-user")), null);
    });
    await run("401 na gravação do onboarding não apaga sessão nem trava botão", async page => {
      await seed(page, { account: user });
      await page.goto(BASE + "/html/setup.html");
      await page.evaluate(() => {
        window.fetch = async () => new Response(JSON.stringify({ mensagem: "não autorizado" }),
          { status: 401, headers: { "Content-Type": "application/json" } });
      });
      await page.evaluate(() => finishSetup());
      assert.match(await page.locator(".form-message.show").innerText(), /sessão não foi aceita/i);
      assert.equal(await page.locator("#nextBtn").isEnabled(), true);
      assert.equal(await page.evaluate(() => JSON.parse(sessionStorage.getItem("fluir-user")).id), user.id);
    });
    await run("Falha de rede no onboarding permite nova tentativa", async page => {
      await seed(page, { account: user });
      await page.goto(BASE + "/html/setup.html");
      await page.evaluate(() => {
        window.fetch = async () => { throw new DOMException("aborted", "AbortError"); };
      });
      await page.evaluate(() => finishSetup());
      assert.match(await page.locator(".form-message.show").innerText(), /demorou demais/i);
      assert.equal(await page.locator("#nextBtn").isEnabled(), true);
    });
    await run("Timeout real do AbortController devolve controle ao usuário", async page => {
      await seed(page, { account: user });
      await page.goto(BASE + "/html/setup.html");
      await page.evaluate(() => {
        const nativeTimeout = window.setTimeout.bind(window);
        window.setTimeout = (fn, ms, ...args) =>
          nativeTimeout(fn, ms === 30000 ? 15 : ms, ...args);
        window.fetch = async (_url, options) => new Promise((_resolve, reject) => {
          options.signal.addEventListener("abort",
            () => reject(new DOMException("aborted", "AbortError")), { once: true });
        });
      });
      await page.evaluate(() => finishSetup());
      assert.match(await page.locator(".form-message.show").innerText(), /demorou demais/i);
      assert.equal(await page.locator("#nextBtn").isEnabled(), true);
    });
    console.log(`RESULTADO: ${passed}/7 aprovados`);
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
