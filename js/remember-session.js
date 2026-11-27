(function(){
  "use strict";
  const key="fluir:remember-restore-blocked";
  let cancelled=false;
  const supported=()=>location.protocol==="https:"&&!window.Capacitor?.isNativePlatform?.()&&!["android","ios"].includes(window.Capacitor?.getPlatform?.());
  function block(){try{localStorage.setItem(key,"1")}catch{}}
  function unblock(){try{localStorage.removeItem(key)}catch{}}
  function blocked(){try{return localStorage.getItem(key)==="1"}catch{return true}}
  async function call(method,body){return fetch("/api/remember-session",{method,cache:"no-store",credentials:"same-origin",signal:AbortSignal.timeout(10000),...(body?{headers:{"Content-Type":"application/json"},body:JSON.stringify(body)}:{})});}
  async function save(user,wanted){
    cancelled=true;
    if(!supported())return;
    block();
    try{const r=await call(wanted?"POST":"DELETE",wanted?{id:user.id,token:user.token}:undefined);if(r.status===204&&wanted)unblock();}catch{}
  }
  async function clear(){cancelled=true;if(!supported())return;block();try{await call("DELETE")}catch{}}
  async function restore(){
    if(!supported()||blocked()||cancelled||sessionStorage.getItem("fluir-user"))return null;
    try{const r=await call("GET");if(!r.ok)return null;const user=await r.json();return !cancelled&&!sessionStorage.getItem("fluir-user")&&user?.id&&typeof user.token==="string"&&user.token.length>=40?user:null;}catch{return null;}
  }
  window.FluirRemember=Object.freeze({supported,save,clear,restore,cancel:()=>{cancelled=true}});
})();
