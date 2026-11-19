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
 assert.match(ui,/confirmAction\(item\)/);
 assert.match(ui,/if \(!elements\.ai\.checked \|\| demo\) return null/);
 assert.match(ui,/fluir-assistente-usuario-/);
 assert.match(page,/id="useGenerativeAI"/);
 assert.match(page,/value="free"/);
 assert.match(page,/value="guided"/);
 assert.match(page,/value="mixed"/);
});
