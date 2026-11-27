"use strict";
const BASE="https://xqzxfhodhmlgneudubjm.supabase.co/functions/v1/fluir-api";
const COOKIE="__Host-fluir_remember";
const TOKEN=/^[A-Za-z0-9_-]{40,100}$/;
const ID=/^[1-9][0-9]{0,14}$/;
function setCookie(res,value="",age=0){res.setHeader("Set-Cookie",COOKIE+"="+value+"; Path=/; Secure; HttpOnly; SameSite=Strict; Max-Age="+age);}
function readCookie(req){const value=String(req.headers.cookie||"").split(";").map(x=>x.trim()).find(x=>x.startsWith(COOKIE+"="))?.slice(COOKIE.length+1)||"";const [id,token,...rest]=value.split(".");return ID.test(id||"")&&TOKEN.test(token||"")&&!rest.length?{id,token}:null;}
async function validate(id,token){
  const headers={Authorization:"Bearer "+token};
  const [security,onboarding]=await Promise.all([
    fetch(BASE+"/conta/seguranca",{headers,cache:"no-store",signal:AbortSignal.timeout(8000)}),
    fetch(BASE+"/onboarding/usuario/"+id,{headers,cache:"no-store",signal:AbortSignal.timeout(8000)})
  ]);
  if([401,403].includes(security.status)||[401,403].includes(onboarding.status))return null;
  if(!security.ok||!onboarding.ok)throw Error("Validation unavailable");
  const [s,o]=await Promise.all([security.json(),onboarding.json()]);
  const expires=Date.parse(s.sessoes?.find(x=>x.atual===true)?.expiraEm||"");
  if(String(o.usuarioId)!==id||typeof o.onboardingConcluido!=="boolean"||!Number.isFinite(expires)||expires<=Date.now()||typeof s.google?.email!=="string"||typeof s.google?.nome!=="string")return null;
  return {user:{id:Number(id),token,nome:s.google.nome,email:s.google.email},age:Math.min(43200,Math.floor((expires-Date.now())/1000))};
}
module.exports=async function handler(req,res){
  res.setHeader("Cache-Control","private, no-store, max-age=0");
  res.setHeader("X-Content-Type-Options","nosniff");
  const end=status=>{res.statusCode=status;return res.end();};
  if(!["GET","POST","DELETE"].includes(req.method)){res.setHeader("Allow","GET, POST, DELETE");return end(405);}
  if(req.method!=="GET"&&(req.headers.origin!=="https://"+req.headers.host||req.headers["sec-fetch-site"]==="cross-site"))return end(403);
  if(req.method==="DELETE"){setCookie(res);return end(204);}
  try{
    if(req.method==="GET"){
      const saved=readCookie(req);if(!saved)return end(401);
      const valid=await validate(saved.id,saved.token);
      if(!valid||valid.age<1){setCookie(res);return end(401);}
      res.setHeader("Content-Type","application/json; charset=utf-8");res.statusCode=200;return res.end(JSON.stringify(valid.user));
    }
    if(!String(req.headers["content-type"]||"").startsWith("application/json"))return end(415);
    const b=typeof req.body==="string"?JSON.parse(req.body):req.body;
    const id=String(b?.id||""),token=String(b?.token||"");
    if(!ID.test(id)||!TOKEN.test(token))return end(400);
    const valid=await validate(id,token);
    if(!valid||valid.age<1){setCookie(res);return end(401);}
    setCookie(res,id+"."+token,valid.age);return end(204);
  }catch{return end(503);}
};
