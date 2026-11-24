"use strict";
const assert = require("node:assert/strict");
const { chromium } = require("playwright");

const BASE = process.env.FLUIR_MOBILE_TEST_URL || "http://127.0.0.1:5178/";

(async () => {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage();
  const oldBackendRequests = [];
  page.on("request", req => {
    if (/onrender\.com|localhost:8080/.test(req.url())) oldBackendRequests.push(req.url());
  });
  let passed = 0;
  const check = async (name, action) => {
    await action();
    passed++;
    process.stdout.write("PASS " + name + "\n");
  };
  try {
    await page.goto(BASE);
    await check("Formulário de login aparece sem credenciais por padrão", async () => {
      await page.getByRole("button", { name: "Entrar", exact: true }).waitFor();
      assert.equal(await page.locator('input[type="email"]').inputValue(), "");
      assert.equal(await page.locator('input[type="password"]').inputValue(), "");
    });

    await page.locator('input[type="email"]').fill("qa@example.invalid");
    await page.locator('input[type="password"]').fill("senha-ficticia-123");
    await page.getByRole("button", { name: "Entrar", exact: true }).click();
    await check("Falha de configuração não autentica nem ativa demo", async () => {
      await page.getByRole("status").filter({ hasText: /Configure VITE_SUPABASE_URL/ }).waitFor();
      assert.equal(await page.getByRole("button", { name: "Explorar demonstração" }).count(), 1);
      assert.equal(await page.getByText("Tarefas sincronizadas").count(), 0);
    });

    await page.getByRole("button", { name: "Explorar demonstração" }).click();
    await check("Demonstração só abre por ação explícita", async () => {
      await page.getByText(/DEMONSTRAÇÃO: não salva nem sincroniza dados/).waitFor();
      assert.equal(await page.getByText("Seu Fluir no celular").count(), 0);
    });

    await page.locator(".bottom-nav").getByRole("button", { name: /Mais/ }).click();
    await page.locator(".drawer-list").getByRole("button", { name: /Tarefas/ }).click();
    await check("Demonstração bloqueia escrita de tarefas", async () => {
      await page.getByText("Demonstração: nenhuma tarefa é salva.").waitFor();
      assert.equal(await page.getByRole("button", { name: "Salvar tarefa" }).isDisabled(), true);
    });

    await page.locator(".bottom-nav").getByRole("button", { name: /Mais/ }).click();
    await page.locator(".drawer-list").getByRole("button", { name: /Assistente IA/ }).click();
    await check("Demonstração não usa Gemini e não aceita envio", async () => {
      await page.getByText("Demonstração: não há chamadas à IA nem acesso aos seus dados.").waitFor();
      assert.equal(await page.getByRole("button", { name: "Enviar" }).isDisabled(), true);
    });

    await page.locator(".bottom-nav").getByRole("button", { name: /Mais/ }).click();
    await page.locator(".drawer-list").getByRole("button", { name: /Configurações/ }).click();
    await page.getByRole("button", { name: "Sair da demonstração" }).click();
    await check("Sair da demonstração volta ao login", async () => {
      await page.getByRole("button", { name: "Entrar", exact: true }).waitFor();
      assert.equal(await page.getByText("DEMONSTRAÇÃO: não salva nem sincroniza dados").count(), 0);
      assert.deepEqual(oldBackendRequests, []);
    });
    process.stdout.write(`RESULTADO ${passed}/6 testes E2E aprovados\n`);
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
