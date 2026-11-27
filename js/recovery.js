(function(){
"use strict";
const base="https://xqzxfhodhmlgneudubjm.supabase.co/functions/v1/fluir-api/usuarios/senha/";
const requestForm=document.getElementById("requestForm"),resetForm=document.getElementById("resetForm"),email=document.getElementById("email"),code=document.getElementById("code"),password=document.getElementById("password"),confirm=document.getElementById("confirm"),message=document.getElementById("message");
let requestedEmail="",busy=false,completed=false;
const tr=value=>window.FluirI18n.t(value);
function show(text,error=false){message.hidden=false;message.textContent=tr(text);message.className=error?"error":"success"}
function lock(value){busy=value;document.querySelectorAll("form button").forEach(b=>b.disabled=value)}
async function call(path,payload){
 const r=await fetch(base+path,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload),cache:"no-store",signal:AbortSignal.timeout(30000)});
 const data=await r.json().catch(()=>({}));
 if(!r.ok)throw new Error(data.mensagem||"Não foi possível concluir a solicitação. Tente novamente.");
 return data;
}
async function requestCode(value){
 if(busy||completed)return;lock(true);
 try{
  const data=await call("solicitar",{email:value});
  requestedEmail=value;requestForm.hidden=true;resetForm.hidden=false;
  document.getElementById("recoveryStep").textContent=tr("Etapa 2 de 2");
  document.getElementById("recoveryIntro").textContent=tr("Informe o código recebido por e-mail e escolha uma nova senha.");
  code.value="";show(data.mensagem||"Se houver uma conta elegível, enviaremos o código.");code.focus();
 }catch(e){show(e.name==="TimeoutError"?"O servidor demorou a responder. Tente novamente.":e.message||"Verifique a conexão.",true)}
 finally{lock(false)}
}
requestForm.addEventListener("submit",e=>{e.preventDefault();requestCode(email.value.trim().toLowerCase())});
document.getElementById("resend").addEventListener("click",()=>requestCode(requestedEmail));
document.getElementById("changeEmail").addEventListener("click",()=>{if(busy)return;requestedEmail="";resetForm.reset();resetForm.hidden=true;requestForm.hidden=false;message.hidden=true;document.getElementById("recoveryStep").textContent=tr("Etapa 1 de 2");document.getElementById("recoveryIntro").textContent=tr("Informe o e-mail da sua conta.");email.focus()});
resetForm.addEventListener("submit",async e=>{
 e.preventDefault();if(busy||completed)return;
 const value=password.value.trim();
 if(value!==confirm.value.trim()){show("As senhas não coincidem.",true);return}
 if(value.length<8||new TextEncoder().encode(value).length>72){show("Use uma senha de pelo menos 8 caracteres e até 72 bytes.",true);return}
 lock(true);
 try{const data=await call("redefinir",{email:requestedEmail,codigo:code.value.trim(),senha:value});
  completed=true;resetForm.reset();resetForm.hidden=true;document.getElementById("recoveryTitle").textContent=tr("Senha redefinida");document.getElementById("recoveryStep").textContent=tr("Concluído");document.getElementById("recoveryIntro").textContent=tr("Entre novamente para continuar usando o Fluir.");show(data.mensagem||"Senha redefinida com sucesso.");
 }catch(e){show(e.name==="TimeoutError"?"O servidor demorou a responder. Tente novamente.":e.message||"Verifique a conexão.",true)}
 finally{lock(false)}
});
})();