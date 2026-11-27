// Supabase Edge Function: Fluir compatibility API.
// Transitional transport for legacy integer accounts: never exposes service-role.
// New Auth users are linked separately only after identity verification.
import { createClient } from "npm:@supabase/supabase-js@2.119.0";
import bcrypt from "npm:bcryptjs@2.4.3";
import { createRemoteJWKSet, jwtVerify } from "npm:jose@5.10.0";

const url = Deno.env.get("SUPABASE_URL") || "";
const secret = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const admin = createClient(url, secret, { auth: { persistSession: false, autoRefreshToken: false } });
const encoder = new TextEncoder();
const MAX_BODY = 135000;
const production = "https://fluir-sistema.vercel.app";
const productionSecondary = "https://fluir-sistema-lexissantosz.vercel.app";
const allowed = (Deno.env.get("FLUIR_ALLOWED_ORIGINS") || "").split(",").map(s => s.trim()).filter(Boolean);

function originAllowed(origin: string) {
  // Capacitor Android serves bundled web assets at this exact HTTPS origin.
  // Origin permission is not account authorization; private routes still require currentUser.
  if (origin === "https://localhost" || origin === production || origin === productionSecondary || allowed.includes(origin)) return true;
  // Previews bound to our exact project/team, not an arbitrary vercel.app hostname.
  return /^https:\/\/fluir-sistema-[a-z0-9-]+-lexissantosz\.vercel\.app$/.test(origin);
}
function respond(origin: string, status: number, value: unknown) {
  return new Response(JSON.stringify(value), { status, headers: {
    "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store",
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Headers": "content-type, authorization, apikey, x-client-info",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS", Vary: "Origin",
  }});
}
function failure(origin: string, status: number, message: string) {
  return respond(origin, status, { mensagem: message });
}
async function parseBody(request: Request) {
  if (!request.headers.get("content-type")?.includes("application/json")) throw new Error("JSON obrigatório");
  const body = await request.text();
  if (body.length > MAX_BODY) throw new Error("Payload muito grande");
  return JSON.parse(body);
}
async function hash(text: string) {
  const bytes = await crypto.subtle.digest("SHA-256", encoder.encode(text));
  return [...new Uint8Array(bytes)].map(x => x.toString(16).padStart(2, "0")).join("");
}
function newToken() {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}
function deviceLabel(request:Request){
  const ua=request.headers.get("user-agent")||"";
  const os=/Android/i.test(ua)?"Android":/iPhone|iPad|iPod/i.test(ua)?"iOS":/Windows/i.test(ua)?"Windows":/Macintosh|Mac OS/i.test(ua)?"macOS":/Linux/i.test(ua)?"Linux":"Dispositivo não identificado";
  const browser=/Edg\//i.test(ua)?"Edge":/OPR\//i.test(ua)?"Opera":/Firefox|FxiOS/i.test(ua)?"Firefox":/Chrome|CriOS/i.test(ua)?"Chrome":/Safari/i.test(ua)?"Safari":"Navegador não identificado";
  return os+" · "+browser;
}
async function issueSession(user: {id:number; nome:string; email:string}, origin: string, request:Request, provider = "senha") {
  const token = newToken();
  const { error } = await admin.from("sessoes_login").insert({
    token_hash: await hash(token), usuario_id: user.id, dispositivo:deviceLabel(request), ultimo_acesso:new Date().toISOString(),
    criado_em: new Date().toISOString(), expira_em: new Date(Date.now() + 12*3600*1000).toISOString(),
  });
  if (error) return failure(origin, 503, "Não foi possível criar uma sessão segura.");
  return respond(origin, 200, {
    id:user.id, nome:user.nome, email:user.email, token, mensagem:"Login realizado com sucesso",
    provedor:provider, emailVerificado:provider==="google",
  });
}
async function currentUser(request: Request) {
  const bearer = /^Bearer\s+(.+)$/i.exec(request.headers.get("authorization") || "");
  const token = bearer?.[1];
  if (!token || token.length > 8192) return null;
  if (/^[A-Za-z0-9_-]{40,100}$/.test(token)) {
    const { data: session, error } = await admin.from("sessoes_login")
      .select("usuario_id,expira_em,ultimo_acesso").eq("token_hash", await hash(token)).maybeSingle();
    if (error || !session || Date.parse(session.expira_em) <= Date.now()) return null;
    if(!session.ultimo_acesso||Date.now()-Date.parse(session.ultimo_acesso)>60000){
      await admin.from("sessoes_login").update({ultimo_acesso:new Date().toISOString(),dispositivo:deviceLabel(request)})
        .eq("usuario_id",session.usuario_id).eq("token_hash",await hash(token));
    }
    const { data: user } = await admin.from("usuarios").select("id,nome,email").eq("id",session.usuario_id).maybeSingle();
    return user || null;
  }
  // Accounts verified with Supabase Auth can access their linked legacy records.
  const { data: authUser } = await admin.auth.getUser(token);
  if (!authUser?.user) return null;
  const {data:link} = await admin.from("fluir_identity_links").select("legacy_usuario_id")
    .eq("auth_user_id",authUser.user.id).maybeSingle();
  if (!link) return null;
  const {data:user} = await admin.from("usuarios").select("id,nome,email").eq("id",link.legacy_usuario_id).maybeSingle();
  return user || null;
}
async function loginLimiter(email: string) {
  const {data,error} = await admin.rpc("fluir_legacy_login_reserve",{p_key_hash:await hash(email.toLowerCase())});
  if(error) throw error;
  return data===true;
}
function cleanEmail(input: unknown) {
  const value = String(input || "").trim().toLowerCase();
  return value.length<=120 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? value : "";
}
function publicTask(task: Record<string,unknown>) {
  return {
    id:task.id, titulo:task.titulo, descricao:task.descricao||"", categoria:task.categoria||"",
    prioridade:task.prioridade||"low", horario:task.horario||"", dataTarefa:task.data_tarefa||null,
    tempoEstimadoMinutos:task.tempo_estimado_minutos||null, energiaGasta:task.energia_gasta||null,
    concluida:task.concluida===true, criadoEm:task.criado_em||null, usuarioId:task.usuario_id,
  };
}
const prefs = [
  ["tarefas","preferencias_tarefas"],["habitos","preferencias_habitos"],
  ["sono","preferencias_sono"],["agua","preferencias_agua"],
  ["financas","preferencias_financas"],["diario","preferencias_diario"],
  ["alimentacao","preferencias_alimentacao"],["saudeFisica","preferencias_saude_fisica"],
  ["cicloMenstrual","preferencias_ciclo_menstrual"],["anexos","preferencias_anexos"]
] as const;
function legacyPreference(name: string, row: Record<string, unknown>) {
  if (name==="agua") return {
    dailyGoal: row.meta_diaria||row.meta_final_ml||row.meta_calculada_ml||0,
    metaFinalMl: row.meta_final_ml, metaCalculadaMl:row.meta_calculada_ml,
    unit:row.unidade||row.modo_registro, modoRegistro:row.modo_registro,
    reminders:row.lembretes,reminderFrequency:row.frequencia_lembrete
  };
  if (name==="tarefas") return { preferredView:row.visualizacao_preferida,reminders:row.lembretes,categories:row.categorias };
  if (name==="habitos") return {trackingType:row.tipo_acompanhamento,weeklyGoal:row.meta_semanal,habits:row.habitos_selecionados};
  return row;
}
async function readOnboarding(user:{id:number; nome:string},origin:string) {
  const {data: saved} = await admin.from("fluir_legacy_onboarding_json").select("payload").eq("usuario_id",user.id).maybeSingle();
  if(saved?.payload && typeof saved.payload==="object") {
    return respond(origin,200,{...saved.payload,usuarioId:user.id,onboardingConcluido:true});
  }
  const {data:profile,error} = await admin.from("perfis_usuario").select("*").eq("usuario_id",user.id).maybeSingle();
  if(error)return failure(origin,503,"Não foi possível consultar o onboarding.");
  if(!profile)return failure(origin,400,"Onboarding não encontrado para este usuário");
  const [modules, ...rows] = await Promise.all([
    admin.from("modulos_usuario").select("*").eq("usuario_id",user.id).maybeSingle(),
    ...prefs.map(([,table])=>admin.from(table).select("*").eq("usuario_id",user.id).maybeSingle())
  ]);
  const data:Record<string,unknown> = {
    usuarioId:user.id, nome:profile.nome||user.nome, apelido:profile.apelido||"",
    pronomes:profile.pronomes, generoNascimento:profile.genero_nascimento,
    altura:profile.altura, peso:profile.peso, idade:profile.idade,
    tomComunicacao:profile.tom_comunicacao,energiaAtual:profile.energia_atual,
    onboardingConcluido:profile.onboarding_concluido===true,
    modulos:modules.data ? {
      timeline:modules.data.timeline,tasks:modules.data.tasks,habits:modules.data.habits,
      sleep:modules.data.sleep,water:modules.data.water,finances:modules.data.finances,
      diary:modules.data.diary,nutrition:modules.data.nutrition,
      physicalHealth:modules.data.physical_health,menstrualCycle:modules.data.menstrual_cycle,
      attachments:modules.data.attachments
    }:null
  };
  prefs.forEach(([name],i)=>{if(rows[i].data)data[name]=legacyPreference(name,rows[i].data)});
  return respond(origin,200,data);
}
async function saveOnboarding(user:{id:number;nome:string},request:Request,origin:string) {
  const data = await parseBody(request);
  if (Number(data.usuarioId)!==user.id) return failure(origin,403,"Acesso negado a dados de outro usuário.");
  if (typeof data.nome!=="string" || data.nome.trim().length<1 || data.nome.length>100) return failure(origin,400,"Nome inválido.");
  // Save canonical payload first; the legacy tables are only updated for
  // compatibility with existing pages and previous stored records.
  const {error:stored} = await admin.from("fluir_legacy_onboarding_json").upsert({
    usuario_id:user.id,payload:data,atualizado_em:new Date().toISOString()
  },{onConflict:"usuario_id"});
  if(stored)return failure(origin,503,"Não foi possível salvar suas preferências.");
  const profile = {
    usuario_id:user.id,nome:data.nome.trim(),apelido:String(data.apelido||"").slice(0,100),
    pronomes:String(data.pronomes||"").slice(0,50),
    genero_nascimento:String(data.generoNascimento||"").slice(0,50),
    onboarding_concluido:true,tom_comunicacao:String(data.tomComunicacao||"calmo").slice(0,25),
    energia_atual:String(data.energiaAtual||"").slice(0,20)
  };
  if(Number.isFinite(Number(data.idade))&&Number(data.idade)>0)Object.assign(profile,{idade:Number(data.idade)});
  const {error:profileError} = await admin.from("perfis_usuario").upsert(profile,{onConflict:"usuario_id"});
  if(profileError)return failure(origin,503,"Preferências salvas parcialmente. Tente novamente para sincronizar.");
  if(data.modulos && typeof data.modulos==="object"){
    const m = data.modulos;
    await admin.from("modulos_usuario").upsert({
      usuario_id:user.id,timeline:!!m.timeline,tasks:!!m.tasks,habits:!!m.habits,
      sleep:!!m.sleep,water:!!m.water,finances:!!m.finances,diary:!!m.diary,
      nutrition:!!m.nutrition,physical_health:!!m.physicalHealth,
      menstrual_cycle:!!m.menstrualCycle,attachments:!!m.attachments
    },{onConflict:"usuario_id"});
  }
  return respond(origin,200,{...data,usuarioId:user.id,onboardingConcluido:true,mensagem:"Onboarding salvo com sucesso."});
}
// Valida assinatura RS256 nas chaves públicas do Google, além de iss/aud/exp.
// tokeninfo serve para depuração, não para conferir logins de produção.
const googlePublicKeys = createRemoteJWKSet(new URL("https://www.googleapis.com/oauth2/v3/certs"));
async function googleIdentity(idToken:string) {
  const clientId = Deno.env.get("FLUIR_GOOGLE_CLIENT_ID")||"";
  if(!clientId || typeof idToken!=="string" || idToken.length<100 || idToken.length>8192)return null;
  try {
    const {payload:t} = await jwtVerify(idToken,googlePublicKeys,{
      audience:clientId,issuer:["accounts.google.com","https://accounts.google.com"],
      algorithms:["RS256"],clockTolerance:"30 seconds"
    });
    const email=cleanEmail(t.email);
    if(t.email_verified!==true || !email || typeof t.sub!=="string" || t.sub.length>255)
      return null;
    return {email,sub:t.sub,name:String(t.name||"Usuário").slice(0,100)};
  }catch(error){
    console.warn("google-id-token-invalid",error instanceof Error?error.name:"verification-failed");
    return null;
  }
}
Deno.serve(async request=>{
  const origin=request.headers.get("origin")||production;
  if(!originAllowed(origin))return new Response(null,{status:403});
  if(request.method==="OPTIONS")return new Response(null,{status:204,headers:{
    "Access-Control-Allow-Origin":origin,"Access-Control-Allow-Methods":"GET,POST,PUT,DELETE,OPTIONS",
    "Access-Control-Allow-Headers":"authorization,content-type,apikey,x-client-info","Vary":"Origin"
  }});
  try {
    const pathname = new URL(request.url).pathname;
    // Supabase Edge Runtime may pass either the full gateway path or a rewritten path.
    const path = pathname.replace(/^\/(?:functions\/v1\/)?fluir-api(?=\/|$)/, "") || "/";
    const method=request.method;
    if(path==="/usuarios/teste"&&method==="GET")return respond(origin,200,"API Fluir no Supabase funcionando");
    if(path==="/usuarios/google/config"&&method==="GET")
      return respond(origin,200,{habilitado:!!Deno.env.get("FLUIR_GOOGLE_CLIENT_ID"),clientId:Deno.env.get("FLUIR_GOOGLE_CLIENT_ID")||""});
    if(path==="/assistente/status"&&method==="GET")
      return respond(origin,200,{configurado:!!Deno.env.get("FLUIR_GEMINI_API_KEY")});
    if(path==="/usuarios/login"&&method==="POST") {
      const b=await parseBody(request);const email=cleanEmail(b.email);
      if(!email || typeof b.senha!=="string" || b.senha.length>128)return failure(origin,400,"E-mail ou senha inválidos.");
      if(!await loginLimiter(email))return failure(origin,429,"Muitas tentativas. Aguarde 15 minutos.");
      const {data:u}=await admin.from("usuarios").select("id,nome,email,senha").eq("email",email).maybeSingle();
      if(!u || !await bcrypt.compare(b.senha,u.senha))return failure(origin,401,"E-mail ou senha inválidos.");
      return await issueSession(u,origin,request);
    }
    if(path==="/usuarios/cadastro"&&method==="POST"){
      const b=await parseBody(request);const email=cleanEmail(b.email);const name=String(b.nome||"").trim();
      const password=String(b.senha||"");
      if(!email||name.length<3||name.length>100||password.length<8||password.length>128)
        return failure(origin,400,"Informe um nome, e-mail e senha de pelo menos 8 caracteres.");
      if(!await loginLimiter(email))return failure(origin,429,"Aguarde antes de criar outra conta.");
      const hashed=await bcrypt.hash(password,11);
      const {data:u,error}=await admin.from("usuarios")
        .insert({nome:name,email,senha:hashed}).select("id,nome,email").single();
      if(error)return failure(origin,error.code==="23505"?409:503,
        error.code==="23505"?"Este e-mail já está cadastrado.":"Não foi possível criar a conta.");
      return await issueSession(u,origin,request);
    }
    if(path==="/usuarios/google"&&method==="POST"){
      if(!Deno.env.get("FLUIR_GOOGLE_CLIENT_ID"))return failure(origin,503,"Login Google ainda não configurado.");
      const b=await parseBody(request);const g=await googleIdentity(b.idToken);
      if(!g)return failure(origin,401,"Conta Google inválida.");
      let {data:u}=await admin.from("usuarios").select("id,nome,email").eq("google_sub",g.sub).maybeSingle();
      if(!u){
        const {data:exists}=await admin.from("usuarios").select("id").eq("email",g.email).maybeSingle();
        if(exists)return failure(origin,409,"Entre com sua senha e vincule o Google no perfil.");
        const hashed=await bcrypt.hash(newToken()+newToken(),11);
        const {data:newUser,error}=await admin.from("usuarios")
          .insert({nome:g.name,email:g.email,google_sub:g.sub,senha:hashed})
          .select("id,nome,email").single();
        if(error||!newUser)return failure(origin,503,"Não foi possível criar o acesso Google.");
        u=newUser;
      }
      return await issueSession(u,origin,request,"google");
    }
    const user=await currentUser(request);
    if(!user)return failure(origin,401,"Sessão inválida ou expirada.");
    // The legacy web client uses random session tokens backed by database rows.
    // Never expose a bearer token or its stored hash in session listings.
    if(path==="/conta/seguranca"&&method==="GET"){
      const {data:account,error}=await admin.from("usuarios").select("id,nome,email,google_sub").eq("id",user.id).single();
      if(error||!account)return failure(origin,503,"Account unavailable.");
      const token=/^Bearer\s+(.+)$/i.exec(request.headers.get("authorization")||"")?.[1]||"";
      const ownHash=await hash(token);
      const sessions=await admin.from("sessoes_login").select("token_hash,criado_em,expira_em,dispositivo,ultimo_acesso")
        .eq("usuario_id",user.id).gt("expira_em",new Date().toISOString()).order("criado_em",{ascending:false});
      if(sessions.error)return failure(origin,503,"Sessions unavailable.");
      const list=await Promise.all((sessions.data||[]).map(async row=>({
        id:await hash("public-session:"+row.token_hash), atual:row.token_hash===ownHash,
        criadoEm:row.criado_em, expiraEm:row.expira_em, dispositivo:row.dispositivo||null, ultimoAcesso:row.ultimo_acesso||null
      })));
      return respond(origin,200,{google:{vinculado:!!account.google_sub,nome:account.nome,email:account.email},sessoes:list,doisFatores:false});
    }
    if(path==="/conta/logout"&&method==="POST"){
      const token=/^Bearer\s+(.+)$/i.exec(request.headers.get("authorization")||"")?.[1]||"";
      if(!/^[A-Za-z0-9_-]{40,100}$/.test(token))return failure(origin,400,"Unsupported session type.");
      const {error}=await admin.from("sessoes_login").delete().eq("usuario_id",user.id).eq("token_hash",await hash(token));
      if(error)return failure(origin,503,"Unable to revoke session.");
      return respond(origin,200,{encerrada:true});
    }
    const revokeSession=/^\/conta\/sessoes\/([a-f0-9]{64})$/.exec(path);
    if(revokeSession&&method==="DELETE"){
      const rows=await admin.from("sessoes_login").select("token_hash").eq("usuario_id",user.id).gt("expira_em",new Date().toISOString());
      if(rows.error)return failure(origin,503,"Sessions unavailable.");
      for(const row of rows.data||[]){
        if(await hash("public-session:"+row.token_hash)!==revokeSession[1])continue;
        const {error}=await admin.from("sessoes_login").delete().eq("usuario_id",user.id).eq("token_hash",row.token_hash);
        if(error)return failure(origin,503,"Unable to revoke session.");
        return respond(origin,200,{encerrada:true});
      }
      return failure(origin,404,"Session not found.");
    }
    if(path==="/usuarios/google/vincular"&&method==="POST"){
      const b=await parseBody(request),g=await googleIdentity(b.idToken);
      if(!g || g.email!==user.email.toLowerCase())return failure(origin,403,"Conta Google não corresponde ao seu e-mail.");
      const {data:existing}=await admin.from("usuarios").select("id").eq("google_sub",g.sub).maybeSingle();
      if(existing&&existing.id!==user.id)return failure(origin,409,"Conta Google já vinculada a outro usuário.");
      const {data:owner, error:ownerError}=await admin.from("usuarios").select("google_sub").eq("id",user.id).single();
      if(ownerError||!owner)return failure(origin,503,"Account unavailable.");
      if(owner.google_sub&&owner.google_sub!==g.sub)return failure(origin,409,"Já existe outra identidade Google vinculada a esta conta.");
      const change=admin.from("usuarios").update({google_sub:g.sub}).eq("id",user.id);
      const result=await (owner.google_sub===null?change.is("google_sub",null):change.eq("google_sub",owner.google_sub)).select("id").maybeSingle();
      const error=result.error;
      if(!error&&!result.data)return failure(origin,409,"Google link changed; retry.");
      if(error)return failure(origin,503,"Não foi possível vincular o Google.");
      const token=/^Bearer\s+(.+)$/i.exec(request.headers.get("authorization")||"")?.[1]||"";
      return respond(origin,200,{id:user.id,nome:user.nome,email:user.email,token,provedor:"google",emailVerificado:true});
    }
    const onboardingGet=/^\/onboarding\/usuario\/(\d+)$/.exec(path);
    if(onboardingGet && method==="GET"){
      if(Number(onboardingGet[1])!==user.id)return failure(origin,403,"Acesso negado.");
      return await readOnboarding(user,origin);
    }
    if(path==="/onboarding/salvar" && method==="POST")return await saveOnboarding(user,request,origin);
    const tasksGet=/^\/tarefas\/usuario\/(\d+)$/.exec(path);
    if(tasksGet && method==="GET"){
      if(Number(tasksGet[1])!==user.id)return failure(origin,403,"Acesso negado.");
      const {data,error}=await admin.from("tarefas").select("*").eq("usuario_id",user.id).order("criado_em",{ascending:false});
      if(error)return failure(origin,503,"Erro ao carregar suas tarefas.");
      return respond(origin,200,(data||[]).map(publicTask));
    }
    if(path==="/tarefas"&&method==="POST"){
      const b=await parseBody(request);
      if(Number(b.usuarioId)!==user.id)return failure(origin,403,"Acesso negado.");
      const title=String(b.titulo||"").trim();
      if(!title||title.length>150)return failure(origin,400,"Título inválido.");
      const input={
        usuario_id:user.id,titulo:title,categoria:String(b.categoria||"Pessoal").slice(0,100),
        descricao:String(b.descricao||"").slice(0,500),prioridade:String(b.prioridade||"low").slice(0,20),
        horario:String(b.horario||"").slice(0,10),concluida:!!b.concluida,
        data_tarefa: /^\d{4}-\d{2}-\d{2}$/.test(String(b.dataTarefa||""))?b.dataTarefa:null
      };
      const {data,error}=await admin.from("tarefas").insert(input).select("*").single();
      if(error)return failure(origin,503,"Não foi possível salvar a tarefa.");
      return respond(origin,200,publicTask(data));
    }
    const status=/^\/tarefas\/(\d+)\/status$/.exec(path);
    if(status&&method==="PUT"){
      const id=Number(status[1]),value=new URL(request.url).searchParams.get("concluida");
      if(value!=="true"&&value!=="false")return failure(origin,400,"Estado inválido.");
      const {data,error}=await admin.from("tarefas").update({concluida:value==="true"})
        .eq("id",id).eq("usuario_id",user.id).select("*").maybeSingle();
      if(error)return failure(origin,503,"Não foi possível atualizar a tarefa.");
      return data?respond(origin,200,publicTask(data)):failure(origin,404,"Tarefa não encontrada.");
    }
    const remove=/^\/tarefas\/(\d+)$/.exec(path);
    if(remove&&method==="DELETE"){
      const {data,error}=await admin.from("tarefas").delete()
        .eq("id",Number(remove[1])).eq("usuario_id",user.id).select("id").maybeSingle();
      if(error)return failure(origin,503,"Não foi possível remover a tarefa.");
      return data?new Response(null,{status:204,headers:{"Access-Control-Allow-Origin":origin}})
        :failure(origin,404,"Tarefa não encontrada.");
    }
    if(path==="/assistente/chat"&&method==="POST"){
      const b=await parseBody(request);
      // Consentimento precisa ser confirmado no servidor, não apenas no checkbox.
      if(b.consentimento!==true)return failure(origin,403,"Autorize o envio da mensagem ao provedor de IA.");
      if(typeof b.mensagem!=="string" || !b.mensagem.trim() || b.mensagem.length>1200)
        return failure(origin,400,"Mensagem inválida.");
      // Contexto curto e efêmero: validado e enviado somente com consentimento.
      const history = b.historico === undefined ? [] : b.historico;
      if(!Array.isArray(history) || history.length>6 || history.length%2!==0)
        return failure(origin,400,"Histórico de conversa inválido.");
      for(let i=0;i<history.length;i++){
        const item=history[i];
        if(!item || typeof item!=="object" || item.role!==(i%2===0?"user":"model") ||
           typeof item.text!=="string" || !item.text.trim() || item.text.length>800)
          return failure(origin,400,"Histórico de conversa inválido.");
      }
      let zone = "America/Sao_Paulo";
      if(typeof b.fusoHorario==="string" && b.fusoHorario.length<=80){
        try{new Intl.DateTimeFormat("en-US",{timeZone:b.fusoHorario});zone=b.fusoHorario}catch{/* fallback */}
      }
      const dateParts = new Intl.DateTimeFormat("en-CA",{timeZone:zone,year:"numeric",month:"2-digit",day:"2-digit",weekday:"long"}).formatToParts(new Date());
      const datePart = (type:string)=>dateParts.find(p=>p.type===type)?.value||"";
      const today = datePart("year")+"-"+datePart("month")+"-"+datePart("day");
      const key=Deno.env.get("FLUIR_GEMINI_API_KEY")||"";
      if(!key)return failure(origin,503,"Gemini ainda não configurado no Supabase.");
      const model=Deno.env.get("FLUIR_AI_MODEL")||"gemini-3.5-flash-lite";
      if(!/^[a-z0-9][a-z0-9._-]{2,90}$/.test(model))
        return failure(origin,503,"Modelo de IA não configurado corretamente.");
      const limiter=await admin.rpc("fluir_legacy_login_reserve",{p_key_hash:await hash("ai:"+user.id)});
      if(limiter.error||limiter.data!==true)return failure(origin,429,"Limite temporário de mensagens atingido.");
      const res=await fetch("https://generativelanguage.googleapis.com/v1beta/models/"+
        encodeURIComponent(model)+":generateContent",{
          method:"POST",headers:{"content-type":"application/json","x-goog-api-key":key},
          body:JSON.stringify({
            systemInstruction:{parts:[{text:"Você é o assistente Fluir. Responda no idioma do usuário, com clareza e privacidade. Quando a mensagem pedir explicitamente CRIAR uma tarefa, hábito ou entrada no diário, proponha UMA ação estruturada, para confirmação do usuário; nunca diga que salvou algo. Para hábitos informe os dias da semana (0 domingo até 6 sábado, todos os sete se diário); se a frequência for incerta, pergunte. Para tarefas informe título, descrição opcional, data ISO YYYY-MM-DD e hora HH:mm se especificada. Para diário preserve o sentido do relato em texto e título curto. Se faltarem detalhes essenciais ou o usuário só quiser conversar, use tipo nenhum. Não invente datas, não proponha apagar, editar, consultar ou expor registros. Responda em JSON conforme o esquema. A data local atual do usuário é "+today+" ("+datePart("weekday")+", fuso "+zone+"). Use essa referência para hoje, amanhã e dias da semana. Se o pedido não indicar data, deixe data vazia para o formulário sugerir hoje. Não invente ano ou mês."}]},
            contents:[...history.map((item:{role:"user"|"model";text:string})=>({role:item.role,parts:[{text:item.text.trim()}]})),
              {role:"user",parts:[{text:b.mensagem.trim()}]}],
            generationConfig:{maxOutputTokens:1200,temperature:0.3,responseMimeType:"application/json",responseJsonSchema:{
              type:"object",properties:{
                resposta:{type:"string"},acao:{type:"object",properties:{
                  tipo:{type:"string",enum:["nenhum","tarefa","habito","diario"]},
                  titulo:{type:"string"},texto:{type:"string"},data:{type:"string"},hora:{type:"string"},
                  dias:{type:"array",items:{type:"integer",minimum:0,maximum:6}}
                },required:["tipo"]}
              },required:["resposta","acao"]
            }}
          }),signal:AbortSignal.timeout(15000)
      });
      if(res.status===429)return failure(origin,429,"O limite do provedor de IA foi atingido. Tente novamente mais tarde.");
      if(!res.ok){
        console.error("gemini-status",res.status);
        return failure(origin,503,"Gemini indisponível nesta tentativa.");
      }
      const generated=await res.json();
      const reply=(generated?.candidates?.[0]?.content?.parts||[])
        .map((part:{text?:string})=>part.text||"").join("").trim();
      if(!reply)return failure(origin,503,"Não foi possível obter uma resposta.");
      let output;
      try{output=JSON.parse(reply)}catch{return failure(origin,503,"A IA retornou um formato inesperado.")}
      if(typeof output?.resposta!=="string"||!output.resposta.trim())return failure(origin,503,"Resposta inválida.");
      const candidate=output.acao;
      const titulo=typeof candidate?.titulo==="string"?candidate.titulo.trim().slice(0,150):"";
      const texto=typeof candidate?.texto==="string"?candidate.texto.trim().slice(0,1200):"";
      const data=typeof candidate?.data==="string"&&/^\d{4}-\d{2}-\d{2}$/.test(candidate.data)&&!isNaN(Date.parse(candidate.data))&&new Date(candidate.data+"T00:00:00Z").toISOString().slice(0,10)===candidate.data?candidate.data:"";
      const hora=typeof candidate?.hora==="string"&&/^([01]\d|2[0-3]):[0-5]\d$/.test(candidate.hora)?candidate.hora:"";
      const dias=Array.isArray(candidate?.dias)?[...new Set<number>(candidate.dias.filter((d:unknown)=>Number.isInteger(d)&&Number(d)>=0&&Number(d)<=6))].sort():[];
      let acao=null;
      if(titulo.length>=2){
        if(candidate.tipo==="tarefa")acao={tipo:"tarefa",titulo,texto:texto.slice(0,500),data,hora};
        if(candidate.tipo==="habito"&&dias.length)acao={tipo:"habito",titulo,texto:texto.slice(0,500),dias};
        if(candidate.tipo==="diario"&&texto.length>=5)acao={tipo:"diario",titulo,texto};
      }
      return respond(origin,200,{resposta:output.resposta.slice(0,2500),acao});
    }
    return failure(origin,404,"Operação não encontrada.");
  } catch(e) {
    if(e instanceof SyntaxError)return failure(origin,400,"JSON inválido.");
    if(e instanceof Error && /Payload|JSON obrigatório/.test(e.message))return failure(origin,400,e.message);
    console.error("fluir-api",e instanceof Error?e.message:"internal");
    return failure(origin,503,"Não foi possível concluir esta operação. Tente novamente.");
  }
});
