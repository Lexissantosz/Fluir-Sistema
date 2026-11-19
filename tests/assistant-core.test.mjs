import {test} from "node:test";
import assert from "node:assert/strict";
import core from "../js/assistente-core.js";
import {readFileSync} from "node:fs";

test("interpreta humor, disposicao e tarefa na mesma mensagem",()=>{
 const actions=core.parseIntent("Estou triste e sem energia, crie uma tarefa de estudar química");
 assert.ok(actions.some(a=>a.type==="mood"&&a.value==="heavy"));
 assert.ok(actions.some(a=>a.type==="energy"&&a.value==="low"));
 assert.ok(actions.some(a=>a.type==="task"&&a.value.includes("estudar química")));
});

test("interpreta tarefa sem apagar acentos nem precisar formulario",()=>{
 const actions=core.parseIntent("Crie uma tarefa para revisar matemática");
 assert.equal(actions.filter(a=>a.type==="task").length,1);
 assert.match(actions.find(a=>a.type==="task").value,/revisar matemática/i);
});

test("uma frase comum nao provoca alteracao sem comando explicito",()=>{
 assert.deepEqual(core.parseIntent("Amanhã acho que vai chover"),[]);
});

test("resumo e adaptacao de tom sao deterministicos",()=>{
 const report=core.getSummary([{type:"mood",label:"Leve"},{type:"task",label:"Estudar"},{type:"energy",label:"Alta"}]);
 assert.equal(report.tasks,1);
 assert.equal(report.moods,1);
 assert.equal(report.lastEnergy,"Alta");
 assert.notEqual(core.messageForTone("calmo","welcome"),core.messageForTone("direto","welcome"));
});

test("o usuario confirma registros e dados pessoais nao sao enviados sem optar",()=>{
 const ui=readFileSync(new URL("../js/assistente.js",import.meta.url),"utf8");
 const page=readFileSync(new URL("../html/assistente.html",import.meta.url),"utf8");
 assert.match(ui,/confirmAction\(item,clientKey\)/);
 assert.match(ui,/if \(!elements\.ai\.checked \|\| demo\) return null/);
 assert.match(ui,/apiRequest\("\/registros"/);
 assert.match(page,/id="useGenerativeAI"/);
 assert.match(page,/value="free"/);
 assert.match(page,/value="guided"/);
 assert.match(page,/value="mixed"/);
});

test("extrai agua, sono e movimento financeiro com valores validados",()=>{
  assert.ok(core.parseIntent("Bebi 500 ml de água").some(x=>x.type==="water"&&x.value==="500 mL"));
  assert.ok(core.parseIntent("Dormi 8 horas").some(x=>x.type==="sleep"&&x.value==="8 h"));
  assert.ok(core.parseIntent("Gastei R$ 35 com almoço").some(x=>x.type==="finances"));
  assert.ok(core.parseIntent("Completei o hábito de ler").some(x=>x.type==="habit"));
});
test("registro com sessao chama API protegida, nao so o localStorage",()=>{
  const ui=readFileSync(new URL("../js/assistente.js",import.meta.url),"utf8");
  assert.match(ui,/apiRequest\("\/registros",\s*\{/);
  assert.match(ui,/Authorization.*Bearer/);
  assert.match(ui,/if\(demo\)localStorage\.setItem/);
  assert.match(ui,/Confirmo o registro desta informação pessoal/);
});

test("separa conversa espontanea de comando de registro",()=>{
  assert.equal(core.isExplicitRecordRequest("Hoje estou muito cansado"),false);
  assert.equal(core.isExplicitRecordRequest("Registre meu humor"),true);
  assert.equal(core.isExplicitRecordRequest("Crie uma tarefa de estudar"),true);
  assert.match(core.conversationReply("Hoje estou cansado", "calmo"),/contar|cansativ/i);
  assert.match(core.conversationReply("Oi", "direto"),/conversar/i);
});

test("o assistente da conta exige login e a demo exige escolha explicita",()=>{
  const ui=readFileSync(new URL("../js/assistente.js",import.meta.url),"utf8");
  const login=readFileSync(new URL("../html/login.html",import.meta.url),"utf8");
  const dashboard=readFileSync(new URL("../html/dashboard.html",import.meta.url),"utf8");
  const mobile=readFileSync(new URL("../js/mobile.js",import.meta.url),"utf8");
  assert.match(ui,/params.get\("demo"\) === "1"/);
  assert.match(ui,/window.location.replace\("login.html"\)/);
  assert.match(login,/href="dashboard.html\?demo=1"/);
  assert.doesNotMatch(login,/Testar assistente Fluir \(demonstração\)/);
  assert.match(dashboard,/id="demoAssistantCard"/);
  assert.match(mobile,/assistant-floating-trigger/);
});

test("chat oferece escolha antes de registrar desabafos",()=>{
  const ui=readFileSync(new URL("../js/assistente.js",import.meta.url),"utf8");
  assert.match(ui,/askIfConversation\(message,actions\)/);
  assert.match(ui,/Só conversar/);
  assert.match(ui,/Quero registrar/);
  assert.match(ui,/if\(actions.length && !explicit\)/);
});

test("marca do Android ocupa area maior e fica centralizada",()=>{
  const logo=readFileSync(new URL("../resources/logo.svg",import.meta.url),"utf8");
  assert.match(logo,/translate\(60 85\) scale\(13\.1\)/);
});
