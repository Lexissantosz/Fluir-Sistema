const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const base=process.env.FLUIR_QA_API||"http://127.0.0.1:18081";
if(!/^http:\/\/(?:127\.0\.0\.1|localhost):\d+$/.test(base)){
 console.error("Este teste só pode executar contra API local isolada.");process.exit(2);
}
const log=[],ts=Date.now().toString(36);
const call=async(method,endpoint,data,token,opts={})=>{
 const headers={"Content-Type":"application/json",...opts.headers};
 if(token)headers.Authorization="Bearer "+token;
 const response=await fetch(base+endpoint,{method,headers,body:data===undefined?undefined:JSON.stringify(data)});
 let body=null;try{body=await response.json()}catch{}
 return {status:response.status,body,headers:response.headers};
};
const check=(name,actual,expected)=>{
 const okay=Array.isArray(expected)?expected.includes(actual):actual===expected;
 if(!okay)throw new Error(name+": HTTP "+actual+" (esperado "+expected+")");
 log.push("APROVADO | "+name+" | HTTP "+actual);
 console.log("PASS",name,actual);
};
(async()=>{
 const ready=await call("GET","/api/health/ready");
 check("PostgreSQL isolado respondeu",ready.status,200);
 const A=await call("POST","/api/usuarios/cadastro",
   {nome:"QA Titular A",email:"qa-a-"+ts+"@example.invalid",senha:"QA12345-seguro"});
 const B=await call("POST","/api/usuarios/cadastro",
   {nome:"QA Convidado B",email:"qa-b-"+ts+"@example.invalid",senha:"QA12345-seguro"});
 const C=await call("POST","/api/usuarios/cadastro",
   {nome:"QA Não Autorizado C",email:"qa-c-"+ts+"@example.invalid",senha:"QA12345-seguro"});
 for(const [name,r] of [["A",A],["B",B],["C",C]]){
   check("Cadastro fictício "+name,r.status,201);
   assert.equal(typeof r.body.token,"string");
   assert.ok(r.body.token.length>=32);
 }
 const a=A.body,b=B.body,c=C.body;
 const own=await call("GET","/api/ciclos/perfis",undefined,a.token);
 check("A lista apenas perfis autenticados",own.status,200);
 check("A atualiza menstruação para Sim",(await call("PUT","/api/ciclos/meu-perfil",
   {menstrua:"sim",ultimaMenstruacao:"2026-11-01",duracaoCiclo:28,
     duracaoMenstruacao:5},a.token)).status,200);
 check("A muda para Não e envia datas antigas sem intenção",
   (await call("PUT","/api/ciclos/meu-perfil",
   {menstrua:"nao",ultimaMenstruacao:"2026-11-01",duracaoCiclo:28,
     duracaoMenstruacao:5},a.token)).status,200);
 const noPeriods=await call("GET","/api/ciclos/meu-perfil",undefined,a.token);
 check("API recupera perfil após resposta Não",noPeriods.status,200);
 assert.equal(noPeriods.body.duracao_ciclo,null);
 assert.equal(noPeriods.body.duracao_menstruacao,null);
 assert.equal(noPeriods.body.ultima_menstruacao,null);
 check("Prefiro não responder também limpa datas",
   (await call("PUT","/api/ciclos/meu-perfil",
   {menstrua:"prefiro-nao-responder",duracaoCiclo:27,
     ultimaMenstruacao:"2026-11-01"},a.token)).status,200);
 const privatePeriods=await call("GET","/api/ciclos/meu-perfil",undefined,a.token);
 assert.equal(privatePeriods.body.duracao_ciclo,null);
 assert.equal(privatePeriods.body.ultima_menstruacao,null);
 assert.ok(own.body.some(p=>Number(p.id)===a.id));
 check("Sem sessão ciclos bloqueados",(await call("GET","/api/ciclos/perfis")).status,401);
 check("Token falso rejeitado",(await call("GET","/api/ciclos/perfis",undefined,"token-falso-qa")).status,401);
 const period=await call("POST","/api/ciclos/registros",{
   tipo:"period",titulo:"Teste sintético de período",nota:"Nota restrita ao titular - teste QA",
   data:"2026-11-20"},a.token);
 check("A registrou próprio dado sintético",period.status,200);
 const symptom=await call("POST","/api/ciclos/registros",{
   tipo:"symptom",titulo:"Teste sintético de sintoma",nota:"Nota restrita de sintoma QA",
   data:"2026-11-21"},a.token);
 check("A registrou sintoma sintético",symptom.status,200);
 check("B não lê A sem autorização",(await call("GET","/api/ciclos/registros/"+a.id,undefined,b.token)).status,404);
 check("C não lê A sem autorização",(await call("GET","/api/ciclos/registros/"+a.id,undefined,c.token)).status,404);
 const invite=await call("POST","/api/ciclos/convites",
   {calendario:true,sintomas:false,notas:false,perfil:false},a.token);
 check("A gerou convite com escopo mínimo",invite.status,200);
 assert.equal(typeof invite.body.codigo,"string");
 const code=invite.body.codigo;
 check("C não solicita com código inválido",(await call("POST","/api/ciclos/convites/solicitar",{codigo:"codigo-errado-ficticio"},c.token)).status,400);
 check("B solicita código",(await call("POST","/api/ciclos/convites/solicitar",{codigo:code},b.token)).status,200);
 check("B permanece bloqueado até aprovação",(await call("GET","/api/ciclos/registros/"+a.id,undefined,b.token)).status,404);
 const pending=await call("GET","/api/ciclos/convites/pendentes",undefined,a.token);
 check("A vê pedido pendente",pending.status,200);
 assert.equal(pending.body.length,1);
 const inviteId=pending.body[0].id;
 check("C não pode aprovar convite de A",
   (await call("POST","/api/ciclos/convites/"+inviteId+"/decidir",{aprovar:true},c.token)).status,404);
 check("A aprova convite de B",
   (await call("POST","/api/ciclos/convites/"+inviteId+"/decidir",{aprovar:true},a.token)).status,200);
 const readB=await call("GET","/api/ciclos/registros/"+a.id,undefined,b.token);
 check("B lê somente escopo autorizado",readB.status,200);
 assert.ok(readB.body.some(r=>r.tipo==="period"));
 assert.ok(!readB.body.some(r=>r.tipo==="symptom"));
 assert.ok(readB.body.every(r=>r.nota===null),"Notas devem estar ocultas");
 check("C continua sem acesso após aprovação de B",
   (await call("GET","/api/ciclos/registros/"+a.id,undefined,c.token)).status,404);
 check("B não apaga registro de A",
   (await call("DELETE","/api/ciclos/registros/"+period.body.id,undefined,b.token)).status,404);
 const shares=await call("GET","/api/ciclos/compartilhamentos",undefined,a.token);
 check("A consulta compartilhamento",shares.status,200);
 assert.equal(shares.body.length,1);
 check("B não revoga permissão concedida por A",
   (await call("DELETE","/api/ciclos/compartilhamentos/"+shares.body[0].id,undefined,b.token)).status,404);
 check("A revoga permissão",(await call("DELETE","/api/ciclos/compartilhamentos/"+shares.body[0].id,undefined,a.token)).status,200);
 check("B volta a ficar sem acesso",
   (await call("GET","/api/ciclos/registros/"+a.id,undefined,b.token)).status,404);
 check("C nunca acessa ciclo de A",
   (await call("GET","/api/ciclos/registros/"+a.id,undefined,c.token)).status,404);
 check("IA sem chave configurada falha com 503, não inventa resposta",
   (await call("POST","/api/assistente/chat",{mensagem:"Oi, Fluir! Podemos conversar?"},a.token)).status,503);
 check("Interpretação sem chave configurada falha com 503",
   (await call("POST","/api/assistente/interpretar",{mensagem:"Quero organizar tarefas"},a.token)).status,503);
 check("IA exige sessão",
   (await call("POST","/api/assistente/chat",{mensagem:"Oi"})).status,401);
 const google=await call("GET","/api/usuarios/google/config");
 check("Google config pública acessível",google.status,200);
 assert.equal(google.body.habilitado,false);
 const origins=[
  ["Produção","https://fluir-sistema.vercel.app",200,true],
  ["Preview autorizada","https://fluir-sistema-git-alex-pwa-dispositivos-dossie-23-11-lexissantosz.vercel.app",200,true],
  ["Local QA","http://127.0.0.1:5505",200,true],
  ["Origem não autorizada","https://site-falso.vercel.app",403,false]
 ];
 for(const [label,origin,expected,allow] of origins){
  const resp=await call("OPTIONS","/api/onboarding/salvar",undefined,null,{
   headers:{Origin:origin,"Access-Control-Request-Method":"POST",
     "Access-Control-Request-Headers":"authorization,content-type"}});
  check("CORS "+label,resp.status,expected);
  if(allow)assert.equal(resp.headers.get("access-control-allow-origin"),origin);
  else assert.equal(resp.headers.get("access-control-allow-origin"),null);
 }
 const target=path.join(__dirname,"relatorio-isolamento-abc-23-11.txt");
 const text=["Fluir QA real HTTP com PostgreSQL isolado (3 contas fictícias; não usar em produção)",
  "Nenhuma credencial, token ou código de convite é registrado.",...log,
  "TOTAL: "+log.length+" verificações aprovadas"].join("\n")+"\n";
 fs.writeFileSync(target,text);
 console.log("TOTAL",log.length,"verificações aprovadas; relatório sem credenciais");
})().catch(e=>{console.error("QA FALHOU:",e.message);process.exitCode=1});
