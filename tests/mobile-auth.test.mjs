import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const js = readFileSync(new URL("../js/login.js", import.meta.url), "utf8");
const cors = readFileSync(new URL("../backend/src/main/java/com/fluir/backend/config/CorsConfig.java", import.meta.url), "utf8");
const security = readFileSync(new URL("../backend/src/main/java/com/fluir/backend/config/SecurityConfig.java", import.meta.url), "utf8");
const config = JSON.parse(readFileSync(new URL("../capacitor.config.json", import.meta.url), "utf8"));

test("APK abre a tela de login, mantendo a landing no site", () => {
  assert.equal(config.server?.appStartPath, "/html/login.html");
});

test("As duas politicas CORS contemplam a origem real do Capacitor", () => {
  assert.match(cors, /"https:\/\/localhost"/);
  assert.match(security, /"https:\/\/localhost"/);
});

test("A validacao da senha independe de estar visivel", () => {
  assert.match(js, /loginForm\.querySelector\("input\.password"\)/);
  assert.doesNotMatch(js, /loginForm\.querySelector\('input\[type="password"\]'\)/);
});

test("Login, cadastro e onboarding utilizam timeout", () => {
  assert.match(js, /AUTH_TIMEOUT_MS = 90000/);
  assert.match(js, /await fetchAuth\(\x60\$\{API_BASE_URL\}\/login\x60/);
  assert.match(js, /await fetchAuth\(\x60\$\{API_BASE_URL\}\/cadastro\x60/);
  assert.match(js, /await fetchAuth\(\s*\x60\$\{ONBOARDING_API_BASE_URL\}\/usuario\/\$\{usuario\.id\}\x60/);
});

test("Alternar visibilidade preserva a senha e atualiza acessibilidade", () => {
  const input = {type: "password", value: "SenhaComEspacos  "};
  const toggle = {
    parentElement: {querySelector: () => input},
    attributes: {},
    setAttribute(k, v) {this.attributes[k] = v;},
    addEventListener(_, fn) {this.onClick = fn;}
  };
  const body = {classList: {add() {}, remove() {}, toggle() {}, contains() {return false;}}};
  const sandbox = vm.createContext({
    document: {body, getElementById: () => null, querySelectorAll: (query) => query === ".password-toggle" ? [toggle] : []},
    localStorage: {getItem() {return null;}},
    sessionStorage: {getItem() {return null;}},
    window: {},
    console, setTimeout, clearTimeout
  });
  vm.runInContext(js, sandbox);
  toggle.onClick();
  assert.equal(input.type, "text");
  assert.equal(input.value, "SenhaComEspacos  ");
  assert.equal(toggle.attributes["aria-label"], "Ocultar senha");
  toggle.onClick();
  assert.equal(input.type, "password");
  assert.equal(input.value, "SenhaComEspacos  ");
});

test("Conta Google so e habilitada apos backend retornar configuracao OAuth", () => {
  const js = readFileSync(new URL("../js/google-login.js", import.meta.url), "utf8");
  assert.match(js, /config\.habilitado !== true/);
  assert.match(js, /completeGoogleLogin/);
  assert.match(js, /GoogleSignIn/);
});
