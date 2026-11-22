import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const read=p=>readFileSync(path.join(root,p),"utf8");
test("módulo principal usa a tela nova mas mantém dados antigos intactos",()=>{
 const old=read("html/menstrual-cycle.html");
 assert.match(old,/cycle-profiles.html/);
 assert.doesNotMatch(old,/location\.search/);
 assert.doesNotMatch(read("js/menstrual-profiles.js"),/localStorage\.(getItem|setItem|removeItem)/);
});
test("fluxo cobre opções inclusivas e configuração opcional",()=>{
 const html=read("html/cycle-profiles.html");
 for(const value of ['value="self"','value="other"','value="both"','value="later"'])
  assert.ok(html.includes(value),value);
 assert.match(html,/Você menstrua atualmente/);
 assert.match(html,/Prefiro não responder/);
 assert.match(html,/mais de uma pessoa/);
});
test("elementos de perfis, fotos, convites, escopos e revogação existem",()=>{
 const html=read("html/cycle-profiles.html");
 for(const id of ["profileTabs","selectedAvatar","photo","alias","generate","codeValue",
 "allowCalendar","allowSymptoms","allowNotes","allowIdentity","requests","grants","removeAccess","renameShared"])
 assert.match(html,new RegExp('id="'+id+'"'),id);
});
test("a UI não recebe um token e concede acesso por conta própria",()=>{
 const js=read("js/menstrual-profiles.js");
 assert.match(js,/Authorization":"Bearer "/);
 assert.match(js,/\/convites\/solicitar/);
 assert.match(js,/\/decidir/);
 assert.doesNotMatch(js,/innerHTML\s*=/);
});
test("a API usa autenticação e separa criação de código, pedido e decisão",()=>{
 const controller=read("backend/src/main/java/com/fluir/backend/controller/CicloPerfisController.java");
 const security=read("backend/src/main/java/com/fluir/backend/config/SecurityConfig.java");
 assert.match(security,/requestMatchers\("\/api\/ciclos\/\*\*"\)\.authenticated\(\)/);
 for(const path of ['/convites','/convites/solicitar','/convites/{invite}/decidir',
 '/compartilhamentos/{grant}','/registros/{titular}'])
 assert.ok(controller.includes(path),path);
 assert.match(controller,/SecureRandom/);
 assert.match(controller,/SHA-256/);
});
test("não existe opção de registrar sintomas em perfis alheios",()=>{
 const controller=read("backend/src/main/java/com/fluir/backend/controller/CicloPerfisController.java");
 assert.match(controller,/VALUES\(\?,\?,\?,\?,\?,\?\) RETURNING id",Long.class,id,/);
 assert.match(controller,/AND revogado_em IS NULL/);
 assert.match(controller,/tipo IN \('period','symptom'\)/);
 assert.match(controller,/NULL::varchar AS nota/);
});
test("PostgreSQL impede duas relações gratuitas ativas por titular ou visitante",()=>{
 const sql=read("backend/src/main/resources/db/migration/V18__perfis_ciclos_compartilhamento.sql");
 assert.match(sql,/uk_ciclo_unico_visitante_ativo/);
 assert.match(sql,/uk_ciclo_unico_titular_ativo/);
 assert.match(sql,/UNIQUE/);
});
test("manifest desktop e service worker não cacheiam chamadas da API",()=>{
 const manifest=JSON.parse(read("manifest.webmanifest"));
 assert.equal(manifest.display,"standalone");
 assert.ok(manifest.icons.length);
 const sw=read("service-worker.js");
 assert.match(sw,/url\.pathname\.startsWith\("\/api\/"\)/);
 assert.ok(existsSync(path.join(root,"Assets/brand/fluir-symbol.svg")));
});
