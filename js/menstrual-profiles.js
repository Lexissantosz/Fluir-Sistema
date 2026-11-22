/* Fluir Cycle Profiles: authenticated, consent-based API. No health data in localStorage. */
(()=>{
"use strict";
const BASE=(["localhost","127.0.0.1"].includes(location.hostname)?"http://localhost:8080":"https://fluir-sistema.onrender.com")+"/api/ciclos";
const $=id=>document.getElementById(id);
const state={profiles:[],selected:null,own:null,photo:null,mode:"later",calendarRecords:[],calendarOffset:0,selectedDay:null};
const user=(()=>{try{return JSON.parse(sessionStorage.getItem("fluir-user")||"null")}catch{return null}})();
const token=(user&&typeof user.token==="string")?user.token:null;
const today=()=>formatDay(new Date());
function alertUser(message,type=""){const el=$("alert");el.hidden=false;el.textContent=message;el.className="alert "+type;el.scrollIntoView({block:"nearest",behavior:"smooth"});}
function hideAlert(){$("alert").hidden=true;}
function errMsg(error){return error instanceof Error?error.message:"Ocorreu um erro.";}
async function api(path,options={}){
 if(!token)throw new Error("Entre na sua conta para continuar.");
 const response=await fetch(BASE+path,{...options,headers:{"Authorization":"Bearer "+token,"Content-Type":"application/json",...(options.headers||{})},cache:"no-store"});
 if(response.status===401)throw new Error("Sessão expirada. Entre novamente.");
 if(response.status===403)throw new Error("Permissão negada para esta operação.");
 if(response.status===404)throw new Error("O dado não existe ou o acesso foi removido.");
 if(response.status===409)throw new Error("O limite gratuito foi atingido ou já existe um vínculo. Revogue o antigo antes de continuar.");
 if(!response.ok)throw new Error("Não foi possível concluir (HTTP "+response.status+").");
 if(response.status===204)return null;
 return response.json();
}
const json=(method,body)=>({method,body:JSON.stringify(body)});
const text=(id,value)=>{$(id).textContent=value||""};
function show(el,on){$(el).hidden=!on;}
function imgOrInitial(element,name,src){
 element.replaceChildren();if(src&&/^data:image\/(png|jpeg|webp);base64,/.test(src)){const im=document.createElement("img");im.src=src;im.alt="";element.append(im);}
 else element.textContent=(name||"?").trim().charAt(0).toLocaleUpperCase("pt-BR");
}
function selected(){return state.profiles.find(p=>Number(p.id)===Number(state.selected));}
function ownSelected(){return selected()?.tipo==="SELF";}
function profileButton(p){
 const btn=document.createElement("button");btn.className="tab";btn.type="button";btn.setAttribute("role","tab");btn.setAttribute("aria-selected",String(Number(p.id)===Number(state.selected)));
 const avatar=document.createElement("span");avatar.className="avatar";imgOrInitial(avatar,p.nome,p.foto);
 const label=document.createElement("span");label.textContent=p.nome;
 btn.append(avatar,label);btn.addEventListener("click",()=>{state.selected=p.id;renderTabs();renderSelected().catch(e=>alertUser(errMsg(e),"error"));});
 return btn;
}
function renderTabs(){
 const container=$("profileTabs");container.replaceChildren();
 for(const p of state.profiles.filter(p=>state.mode==="both"||(state.mode==="self"&&p.tipo==="SELF")||(state.mode==="other"&&p.tipo==="SHARED")))container.append(profileButton(p));
}
async function refreshProfiles(){
 const previous=state.selected;
 state.profiles=await api("/perfis");
 const available=state.profiles.filter(p=>state.mode==="both"||(state.mode==="self"&&p.tipo==="SELF")||(state.mode==="other"&&p.tipo==="SHARED"));
 state.selected=available.some(p=>Number(p.id)===Number(previous))?previous:available[0]?.id||null;
 renderTabs();await renderSelected();
}
function formatDay(d){return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")}
function renderRecordList(){
 const entries=$("records");entries.replaceChildren();
 const filtered=state.selectedDay?state.calendarRecords.filter(r=>String(r.data)===state.selectedDay):state.calendarRecords;
 text("recordsHint",state.selectedDay?"Registros em "+state.selectedDay.split("-").reverse().join("/"):(ownSelected()?"Seus registros pessoais.":"Somente informações autorizadas pela pessoa titular."));
 show("clearDateFilter",!!state.selectedDay);
 if(!filtered.length){const p=document.createElement("p");p.className="muted";p.textContent="Nenhum registro disponível para esta seleção.";entries.append(p);return}
 filtered.forEach(r=>entries.append(recordElement(r,ownSelected())));
}
function renderCalendar(){
 const root=$("calendarGrid");root.replaceChildren();
 const base=new Date();const first=new Date(base.getFullYear(),base.getMonth()+state.calendarOffset,1);
 text("monthHeading",first.toLocaleDateString("pt-BR",{month:"long",year:"numeric"}));
 for(const name of ["Seg","Ter","Qua","Qui","Sex","Sáb","Dom"]){const head=document.createElement("span");head.className="day-label";head.textContent=name;root.append(head)}
 const counts=new Map();
 for(const r of state.calendarRecords){const key=String(r.data);const arr=counts.get(key)||[];arr.push(r.tipo);counts.set(key,arr)}
 let predicted=null;
 if(ownSelected()&&Number(state.own?.duracao_ciclo)){const last=state.calendarRecords.filter(r=>r.tipo==="period").map(r=>String(r.data)).sort().reverse()[0];if(last){const dt=new Date(last+"T12:00:00");dt.setDate(dt.getDate()+Number(state.own.duracao_ciclo));predicted=formatDay(dt)}}
 const offset=(first.getDay()+6)%7;
 for(let i=0;i<offset;i++){const blank=document.createElement("span");blank.className="day-blank";blank.setAttribute("aria-hidden","true");root.append(blank)}
 const length=new Date(first.getFullYear(),first.getMonth()+1,0).getDate();
 for(let day=1;day<=length;day++){const date=new Date(first.getFullYear(),first.getMonth(),day);const key=formatDay(date);
 const b=document.createElement("button");b.type="button";b.className="calendar-day";b.textContent=String(day);
 b.setAttribute("aria-label",date.toLocaleDateString("pt-BR",{day:"numeric",month:"long",year:"numeric"}));
 const types=counts.get(key)||[];
 if(types.includes("period"))b.classList.add("has-period");
 if(types.includes("symptom"))b.classList.add("has-symptom");
 if(predicted===key)b.classList.add("is-predicted");
 if(key===state.selectedDay){b.classList.add("selected");b.setAttribute("aria-pressed","true")}
 if(key===formatDay(new Date()))b.classList.add("today");
 b.addEventListener("click",()=>{state.selectedDay=state.selectedDay===key?null:key;renderCalendar();renderRecordList()});
 root.append(b)}
}
function calendarEstimate(records){
 const period=records.filter(r=>r.tipo==="period"&&r.data).map(r=>String(r.data)).sort().reverse()[0];
 const own=state.own||{},days=Number(own.duracao_ciclo||0);
 if(!period||!ownSelected()||!days){text("estimate","As previsões dependem de registros de menstruação e duração informada do ciclo. Estimativas não servem como método contraceptivo ou diagnóstico.");return}
 const start=new Date(period+"T12:00:00");start.setDate(start.getDate()+days);
 text("estimate","Próxima menstruação estimada por volta de "+start.toLocaleDateString("pt-BR")+". É apenas uma estimativa, especialmente imprecisa quando o ciclo varia.");
}
function recordElement(r,canDelete){
 const div=document.createElement("div");div.className="record";
 const content=document.createElement("div");content.className="grow";
 const tag=document.createElement("small");tag.textContent=({period:"Menstruação",symptom:"Sintoma",mood:"Humor",other:"Outro"}[r.tipo]||"Registro")+" · "+String(r.data||"");
 const strong=document.createElement("strong");strong.textContent=r.titulo||"Registro";
 content.append(tag,document.createElement("br"),strong);
 if(r.nota){const note=document.createElement("p");note.textContent=r.nota;content.append(note)}
 div.append(content);
 if(canDelete){const del=document.createElement("button");del.className="btn danger";del.type="button";del.textContent="Excluir";del.setAttribute("aria-label","Excluir registro "+(r.titulo||""));
 del.addEventListener("click",async()=>{if(!confirm("Excluir este registro do seu próprio histórico?"))return;try{await api("/registros/"+r.id,{method:"DELETE"});await renderSelected();alertUser("Registro excluído.","ok")}catch(e){alertUser(errMsg(e),"error")}});div.append(del)}
 return div;
}
async function renderSelected(){
 const p=selected();show("profileEmpty",!p);show("profileArea",!!p);
 if(!p)return;
 text("selectedName",p.nome);text("selectedType",p.tipo==="SELF"?"Meu ciclo":"Ciclo compartilhado com autorização");
 imgOrInitial($("selectedAvatar"),p.nome,p.foto);
 text("accessTag",p.tipo==="SELF"?"Titular": "Somente leitura");
 show("newRecord",p.tipo==="SELF");show("removeAccess",p.tipo!=="SELF");show("renameShared",p.tipo!=="SELF");
 state.calendarRecords=[];state.selectedDay=null;state.calendarOffset=0;
 text("recordsHint","Carregando registros deste perfil...");
 text("estimate","Carregando informações...");
 $("records").replaceChildren();$("calendarGrid").replaceChildren();
 try{const records=await api("/registros/"+p.id);
   if(!selected()||Number(selected().id)!==Number(p.id))return; // avoid stale cross-profile responses
   state.calendarRecords=records;
   renderCalendar();renderRecordList();calendarEstimate(records);
 }catch(e){if(Number(selected()?.id)===Number(p.id)){text("estimate","Não foi possível consultar este perfil.");$("records").replaceChildren();$("calendarGrid").replaceChildren();alertUser(errMsg(e),"error")}}
}
function resetOwn(){const d=state.own||{}; $("alias").value=d.apelido||"";$("menstruates").value=d.menstrua_atualmente||"prefiro-nao-responder";$("cycleLength").value=d.duracao_ciclo??"";$("periodLength").value=d.duracao_menstruacao??"";$("lastPeriod").value=d.ultima_menstruacao||"";state.photo=d.foto||null;imgOrInitial($("photoPreview"),d.apelido||user?.nome||"Eu",state.photo);}
async function refreshPanels(){
 const [p,pending,grants]=await Promise.all([api("/meu-perfil"),api("/convites/pendentes"),api("/compartilhamentos")]);
 state.own=p;state.mode=p.modo_acompanhamento||"later";resetOwn();
 const r=$("requests");r.replaceChildren();if(!pending.length)r.textContent="Nenhum pedido pendente.";
 pending.forEach(request=>{const card=document.createElement("div");card.className="request";const name=document.createElement("strong");name.textContent=request.solicitante;
 const scopes=document.createElement("small");scopes.textContent="Solicita: "+[request.ver_calendario&&"calendário",request.ver_sintomas&&"sintomas",request.ver_notas&&"notas",request.sincronizar_perfil&&"foto e apelido"].filter(Boolean).join(", ");
 const row=document.createElement("div");row.className="row wrap";
 for(const [accept,label] of [[true,"Aprovar"],[false,"Negar"]]){const btn=document.createElement("button");btn.className="btn "+(accept?"primary":"danger");btn.textContent=label;btn.addEventListener("click",async()=>{try{await api("/convites/"+request.id+"/decidir",json("POST",{aprovar:accept}));await refreshPanels();alertUser(accept?"Compartilhamento aprovado.":"Pedido negado.","ok")}catch(e){alertUser(errMsg(e),"error")}});row.append(btn)}
 card.append(name,scopes,row);r.append(card)});
 const g=$("grants");g.replaceChildren();if(!grants.length)g.textContent="Nenhuma pessoa tem acesso ao seu ciclo.";
 grants.forEach(grant=>{const card=document.createElement("div");card.className="request";const label=document.createElement("strong");label.textContent=grant.visitante;
 const scopes=document.createElement("small");scopes.textContent=[grant.ver_calendario&&"calendário",grant.ver_sintomas&&"sintomas",grant.ver_notas&&"notas",grant.sincronizar_perfil&&"perfil"].filter(Boolean).join(", ");
 const revoke=document.createElement("button");revoke.className="btn danger";revoke.textContent="Revogar acesso";revoke.addEventListener("click",async()=>{if(!confirm("Revogar imediatamente este acesso?"))return;try{await api("/compartilhamentos/"+grant.id,{method:"DELETE"});await refreshPanels();alertUser("Acesso revogado.","ok")}catch(e){alertUser(errMsg(e),"error")}});
 card.append(label,scopes,revoke);g.append(card)});
}
function processPhoto(file){return new Promise((resolve,reject)=>{if(!file){resolve(null);return}
 if(!["image/png","image/jpeg","image/webp"].includes(file.type)||file.size>8*1024*1024){reject(new Error("Selecione JPG, PNG ou WebP de até 8 MB."));return}
 const url=URL.createObjectURL(file);const img=new Image();img.onload=()=>{URL.revokeObjectURL(url);
 const canvas=document.createElement("canvas");const scale=Math.min(1,256/Math.max(img.width,img.height));canvas.width=Math.max(1,Math.round(img.width*scale));canvas.height=Math.max(1,Math.round(img.height*scale));
 canvas.getContext("2d").drawImage(img,0,0,canvas.width,canvas.height);const data=canvas.toDataURL("image/jpeg",.72);
 if(data.length>205000)reject(new Error("Foto muito grande. Use uma foto menor."));else resolve(data)};
 img.onerror=()=>{URL.revokeObjectURL(url);reject(new Error("Não foi possível ler a imagem."))};img.src=url;
})}
function initEvents(){
 $("monthPrev").addEventListener("click",()=>{state.calendarOffset--;renderCalendar()});
 $("monthNext").addEventListener("click",()=>{state.calendarOffset++;renderCalendar()});
 $("clearDateFilter").addEventListener("click",()=>{state.selectedDay=null;renderCalendar();renderRecordList()});
 $("start").addEventListener("click",async()=>{const mode=document.querySelector('input[name="mode"]:checked')?.value||"later";try{await api("/preferencia",json("PUT",{modo:mode}));state.mode=mode;show("intro",mode==="later");show("workspace",mode!=="later");show("ownSettings",mode!=="other");show("sharing",true);await refreshProfiles();if(mode==="later")alertUser("Você pode configurar o módulo quando desejar.","ok");else hideAlert()}catch(e){alertUser(errMsg(e),"error")}});
 $("editSetup").addEventListener("click",()=>{show("intro",true);show("workspace",false);hideAlert()});
 $("photo").addEventListener("change",async e=>{try{const file=e.target.files?.[0];if(!file)return;state.photo=await processPhoto(file);imgOrInitial($("photoPreview"),$("alias").value||"Eu",state.photo)}catch(err){alertUser(errMsg(err),"error")}});
 $("removePhoto").addEventListener("click",()=>{state.photo=null;$("photo").value="";imgOrInitial($("photoPreview"),$("alias").value||"Eu",null)});
 $("profileForm").addEventListener("submit",async e=>{e.preventDefault();try{
  const number=(id)=>$(id).value===""?null:Number($(id).value);
  await api("/meu-perfil",json("PUT",{apelido:$("alias").value,foto:state.photo,menstrua:$("menstruates").value,
    duracaoCiclo:number("cycleLength"),duracaoMenstruacao:number("periodLength"),ultimaMenstruacao:$("lastPeriod").value||null}));
  await refreshPanels();await refreshProfiles();alertUser("Seu perfil foi salvo.","ok")
 }catch(err){alertUser(errMsg(err),"error")}});
 $("generate").addEventListener("click",async()=>{try{const result=await api("/convites",json("POST",{calendario:$("allowCalendar").checked,
 sintomas:$("allowSymptoms").checked,notas:$("allowNotes").checked,perfil:$("allowIdentity").checked}));
 $("codeValue").value=result.codigo;show("inviteCode",true);alertUser("Código gerado. Ele expira em 10 minutos e não libera acesso sem sua aprovação.","ok");
 }catch(e){alertUser(errMsg(e),"error")}});
 $("copyCode").addEventListener("click",async()=>{try{await navigator.clipboard.writeText($("codeValue").value);alertUser("Código copiado.","ok")}catch{alertUser("Copie manualmente o código exibido.")}});
 $("requestAccess").addEventListener("click",async()=>{try{const code=$("receivedCode").value.trim();if(!code)throw new Error("Informe o código de convite.");await api("/convites/solicitar",json("POST",{codigo:code}));$("receivedCode").value="";alertUser("Pedido enviado. Aguarde a aprovação do titular.","ok")}
 catch(e){alertUser(errMsg(e),"error")}});
 $("newRecord").addEventListener("click",()=>{if(!ownSelected())return;$("recordDate").max=today();$("recordDate").value=today();$("recordDialog").showModal()});
 $("cancelRecord").addEventListener("click",()=>$("recordDialog").close());
 $("recordForm").addEventListener("submit",async e=>{e.preventDefault();if(!ownSelected()){alertUser("Não é possível editar o ciclo de outra pessoa.","error");return}
 try{await api("/registros",json("POST",{tipo:$("recordType").value,intensidade:$("intensity").value,
 titulo:$("recordTitle").value,nota:$("recordNote").value,data:$("recordDate").value}));
 $("recordDialog").close();$("recordForm").reset();await renderSelected();alertUser("Registro salvo no seu próprio ciclo.","ok")
 }catch(err){alertUser(errMsg(err),"error")}});
 $("renameShared").addEventListener("click",async()=>{const p=selected();if(!p||p.tipo!=="SHARED")return;
 const alias=prompt("Apelido para identificar este perfil apenas na sua conta (máximo 60 caracteres):",p.nome);
 if(alias===null)return;if(alias.length>60){alertUser("Apelido muito longo.","error");return}
 try{await api("/acessos/"+p.id+"/apelido",json("PUT",{apelido:alias.trim()}));await refreshProfiles();alertUser("Apelido atualizado.","ok")}
 catch(e){alertUser(errMsg(e),"error")}});
 $("removeAccess").addEventListener("click",async()=>{const p=selected();if(!p||p.tipo!=="SHARED"||!confirm("Parar de acompanhar este perfil?"))return;try{await api("/acessos/"+p.id,{method:"DELETE"});await refreshProfiles();alertUser("Você deixou de acompanhar esse perfil.","ok")}catch(e){alertUser(errMsg(e),"error")}});
}
async function init(){
 initEvents();if(!token){show("authError",true);return}
 try{await refreshPanels();await refreshProfiles();show("app",true);if(state.mode!=="later"){show("intro",false);show("workspace",true);show("ownSettings",state.mode!=="other");show("sharing",true);const choice=document.querySelector('input[name="mode"][value="'+state.mode+'"]');if(choice)choice.checked=true}}
 catch(e){show("authError",true);alertUser("Não foi possível iniciar o módulo seguro: "+errMsg(e),"error")}
}
init();
})();