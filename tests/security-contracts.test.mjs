import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const read = path => readFileSync(resolve(root, path), "utf8");
const schema = read("supabase/migrations/20261124174853_fluir_auth_and_data_foundation.sql");
const legacy = read("supabase/migrations/20261124175317_secure_legacy_data_api.sql");
const client = read("mobile/src/infrastructure/supabase.ts");
const api = read("mobile/src/services/api.ts");
const app = read("mobile/src/App.tsx");

test("todas as tabelas novas expostas usam RLS", () => {
  for (const table of [
    "fluir_profiles", "fluir_roles", "fluir_identity_links",
    "fluir_onboarding", "fluir_tasks", "fluir_habits", "fluir_records",
  ]) {
    assert.match(schema, new RegExp(`alter table public\\.${table} enable row level security;`));
  }
});
test("navegador não pode atualizar o próprio papel ou criar vínculo legado", () => {
  assert.match(schema, /grant select on public\.fluir_roles, public\.fluir_identity_links to authenticated/i);
  assert.doesNotMatch(schema, /grant (?:all|insert|update|delete)\s+on public\.fluir_roles[^;]*\s+to authenticated/i);
  assert.match(schema, /insert into public\.fluir_roles\(user_id, app_role\)[\s\S]*?'user'/i);
});
test("RPC valida auth.uid() e não executa com privilégio elevado", () => {
  assert.match(schema, /create function public\.fluir_complete_onboarding\(p_payload jsonb\)/);
  assert.match(schema, /security invoker/);
  assert.match(schema, /uid uuid := auth\.uid\(\)/);
});
test("armazenamento privado usa pasta do usuário autenticado", () => {
  assert.match(schema, /'fluir-avatars','fluir-avatars',false/);
  assert.match(schema, /'fluir-attachments','fluir-attachments',false/);
  assert.match(schema, /storage\.foldername\(name\)/);
  assert.match(schema, /auth\.uid\(\)/);
});
test("mitigação legada não apaga nem modifica dados remotamente", () => {
  assert.doesNotMatch(legacy, /^\s*(?:drop|truncate|delete from|update)\s+/gim);
  assert.match(legacy, /revoke all privileges on table/i);
  assert.match(legacy, /public\.fluir_identity_links/);
});
test("frontend não contém segredo administrativo ou dependência Render", () => {
  assert.doesNotMatch(client + api + app, /https:\/\/fluir-sistema\.onrender\.com/);
  assert.doesNotMatch(client + api + app, /VITE_SUPABASE_SERVICE_ROLE_KEY\s*=/);
  assert.match(client, /VITE_SUPABASE_PUBLISHABLE_KEY/);
  assert.match(api, /auth\.signInWithPassword/);
});
test("Edge Function exige autenticação, consentimento e limite por conta", () => {
  const edge = read("supabase/functions/fluir-assistant-chat/index.ts");
  assert.match(edge, /auth\.getUser\(jwt\)/);
  assert.match(edge, /input\.consentimento !== true/);
  assert.match(edge, /fluir_ai_reserve_call/);
  assert.match(edge, /FLUIR_GEMINI_API_KEY/);
  assert.doesNotMatch(edge, /SERVICE_ROLE_KEY/);
  assert.match(schema, /create function public\.fluir_ai_reserve_call\(\)/);
  assert.match(schema, /fluir_ai_quota enable row level security/);
});

test("falha de login e onboarding não vira acesso de demonstração", () => {
  assert.doesNotMatch(app, /alex@email\.com|123456/);
  assert.doesNotMatch(app, /Backend indisponível.*modo demonstração/);
  assert.match(app, /\/\/ Nunca simular sucesso ou avançar após falha/);
});
