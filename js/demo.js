/* Fluir Demo: estado exclusivamente em memória; nenhuma autenticação, API ou gravação. */
(function(){
"use strict";
const tasks=[
{title:"Revisar apresentação do Fluir",category:"Projeto",done:true},
{title:"Organizar tarefas da semana",category:"Rotina",done:false},
{title:"Estudar inglês por 20 minutos",category:"Estudos",done:false},
{title:"Preparar material do SENAC",category:"Curso",done:true}
];
const habits=[
{title:"Beber água ao acordar",category:"Bem-estar",done:true},
{title:"Fazer uma pausa consciente",category:"Saúde",done:false},
{title:"Ler por 15 minutos",category:"Leitura",done:false}
];
let water=1250;
const goal=2000;
let current="dashboard";
const screen=document.getElementById("demoScreen");
function showDemoGate(){
 let gate=document.getElementById("fluirDemoGate");
 if(gate)gate.remove();
 gate=document.createElement("div");
 gate.id="fluirDemoGate";gate.className="demo-gate-overlay";
 gate.setAttribute("role","presentation");
 gate.innerHTML='<section class="demo-gate" role="alertdialog" aria-modal="true" aria-label="Ação indisponível na demonstração"><h2>Apenas demonstração</h2><p>Você pode conhecer as telas e recursos do Fluir, mas não criar, modificar ou salvar informações neste modo. Entre ou crie uma conta para registrar seus próprios dados.</p><div class="demo-gate-actions"><button type="button" class="demo-gate-close">Entendi</button><a href="login.html">Entrar no Fluir</a></div></section>';
 const close=()=>{gate.remove();document.removeEventListener("keydown",onEscape)};
 function onEscape(e){if(e.key==="Escape")close()}
 gate.querySelector(".demo-gate-close").addEventListener("click",close);
 gate.addEventListener("click",e=>{if(e.target===gate)close()});
 document.addEventListener("keydown",onEscape);
 document.body.appendChild(gate);gate.querySelector(".demo-gate-close").focus();
}
const title=document.getElementById("demoHeading");
const subtitle=document.getElementById("demoSubtitle");
const heading={
dashboard:["Olá, visitante","Acompanhe sua rotina, seus hábitos e seu bem-estar em um só lugar."],
timeline:["Timeline","Visualize os acontecimentos fictícios do dia."],
tasks:["Tarefas","Organize e conclua atividades de exemplo."],
habits:["Hábitos","Marque os hábitos da demonstração sem cobranças."],
water:["Água","Registre quantidades fictícias para ver o progresso."],
cycle:["Ciclo menstrual","Prévia visual informativa. Dados reais exigem conta e consentimento."],
finances:["Finanças","Exemplos ilustrativos, sem dados bancários."],
diary:["Diário emocional","Um espaço para reflexões. Aqui nada é armazenado."]
};
function elem(tag,cls,content){const e=document.createElement(tag);if(cls)e.className=cls;if(content!==undefined)e.textContent=content;return e}
function card(title,content){const x=elem("article","demo-card");if(title)x.appendChild(elem("h2","",title));if(content)x.appendChild(content);return x}
function button(text,fn,kind="secondary"){const b=elem("button",kind==="primary"?"demo-primary":"demo-secondary",text);b.type="button";b.addEventListener("click",fn);return b}
function fraction(items){return items.filter(x=>x.done).length+"/"+items.length}
function percent(){return Math.round((tasks.filter(x=>x.done).length+habits.filter(x=>x.done).length)/(tasks.length+habits.length)*100)}
function rows(items){const list=elem("div","demo-rows");for(const item of items){const label=elem("label","demo-row"+(item.done?" done":""));const check=elem("input");check.type="checkbox";check.checked=item.done;const txt=elem("span","demo-row-text");txt.appendChild(elem("strong","",item.title));txt.appendChild(elem("small","",item.category));check.addEventListener("change",()=>{check.checked=item.done;showDemoGate()});label.append(check,txt);list.append(label)}return list}
function panelRows(label,items,view){const inner=elem("div");inner.appendChild(elem("p","demo-desc",view==="tasks"?"Atividades que você pode marcar como concluídas.":"Constância é mais importante que perfeição."));inner.appendChild(rows(items));const wrap=card(label,inner);const actions=elem("div","demo-actions");actions.appendChild(button("Ver módulo",()=>navigate(view)));actions.appendChild(button(view==="tasks"?"Nova tarefa":"Novo hábito",showDemoGate,"primary"));wrap.appendChild(actions);return wrap}
function waterVisual(){const container=elem("div","demo-water");const ring=elem("div","demo-ring");ring.style.setProperty("--water-progress",Math.min(water/goal*100,100)+"%");const middle=elem("div");middle.appendChild(elem("strong","",water+" ml"));middle.appendChild(elem("small","","Meta: "+goal+" ml"));ring.appendChild(middle);container.appendChild(ring);const actions=elem("div");actions.appendChild(elem("p","demo-desc","Registros ilustrativos desta demonstração."));const buttons=elem("div","demo-actions");buttons.append(button("+ 250 ml",showDemoGate,"primary"),button("− 250 ml",showDemoGate));actions.appendChild(buttons);container.appendChild(actions);return container}
function metric(label,number,detail){const c=elem("article","demo-card demo-kpi");c.append(elem("h3","",label),elem("strong","",number),elem("small","",detail));return c}
function dashboard(){const k=elem("div","demo-kpis");k.append(metric("Tarefas",fraction(tasks),"concluídas hoje"),metric("Hábitos",fraction(habits),"marcados hoje"),metric("Água",water+" ml","de "+goal+" ml"),metric("Progresso",percent()+"%","da demonstração"));screen.appendChild(k);
const row=elem("div","demo-grid");row.append(panelRows("Tarefas de hoje",tasks,"tasks"),card("Hidratação",waterVisual()));screen.appendChild(row);
const bottom=elem("div","demo-grid");bottom.append(panelRows("Hábitos ativos",habits,"habits"),card("Sua jornada",elem("p","demo-desc","O Fluir combina diferentes áreas da vida em um único lugar. Nesta prévia, os exemplos são fictícios e não são salvos no servidor.")));screen.appendChild(bottom)}
function singleList(name,items){const box=card(name,rows(items));box.insertBefore(elem("p","demo-desc","Os exemplos são somente para visualização. Criação e edição exigem uma conta."),box.querySelector(".demo-rows"));const actions=elem("div","demo-actions");actions.appendChild(button(name.includes("Tarefas")?"Nova tarefa":"Novo hábito",showDemoGate,"primary"));box.appendChild(actions);screen.appendChild(box)}
function simpleList(name,entries,note){const list=elem("ul","demo-list");for(const [left,right] of entries){const li=elem("li");li.append(elem("strong","",left),elem("small","",right));list.append(li)}const c=card(name,list);if(note)c.appendChild(elem("p","demo-info",note));screen.appendChild(c)}
function render(){
 screen.replaceChildren();
 title.textContent=heading[current][0];
 subtitle.textContent=heading[current][1];
 document.querySelectorAll("[data-demo-view]").forEach(n=>{
 const selected=n.dataset.demoView===current;
 n.classList.toggle("active",selected);
 n.setAttribute("aria-current",selected?"page":"false")
 });
 const focus=percent();document.getElementById("demoFocus").textContent=focus+"%";document.getElementById("demoFocusBar").style.width=focus+"%";
 if(current==="dashboard")dashboard();
 if(current==="tasks")singleList("Tarefas demonstrativas",tasks);
 if(current==="habits")singleList("Hábitos demonstrativos",habits);
 if(current==="water")screen.appendChild(card("Acompanhamento de água",waterVisual()));
 if(current==="timeline")simpleList("Eventos de exemplo",[["08:00 · Início do dia","Rotina"],["09:30 · Revisar apresentação","Tarefas"],["12:15 · Pausa para almoço","Saúde"],["15:00 · Estudo individual","Hábitos"]],"Linha do tempo ilustrativa; não é histórico de nenhum usuário.");
 if(current==="cycle")simpleList("Acompanhamento de ciclos",[["Meu ciclo","Acompanhamento pessoal opcional"],["Outra pessoa","Exige consentimento do titular"],["Perfis e apelidos","Identificação visual configurável"]],"Este modo não registra dados de saúde. O onboarding completo e a autorização entre contas precisam de teste em ambiente próprio.");
 if(current==="finances")simpleList("Exemplo de planejamento",[["Receitas previstas","R$ 1.500 (fictício)"],["Despesas planejadas","R$ 900 (fictício)"],["Saldo estimado","R$ 600 (fictício)"]],"Valores fictícios para apresentação do design.");
 if(current==="diary")simpleList("Reflexões de exemplo",[["Hoje","Organizei minhas prioridades."],["Ontem","Concluí duas atividades."],["Semana","Continuar no meu ritmo."]],"Este modo não armazena anotações ou dados pessoais.");
}
function navigate(view){if(!heading[view])return;current=view;render();window.scrollTo({top:0,behavior:"instant"})}
document.querySelectorAll("[data-demo-view]").forEach(b=>b.addEventListener("click",()=>navigate(b.dataset.demoView)));
render();
window.FluirDemo={isIsolated:true,getCurrentView:()=>current};
})();
