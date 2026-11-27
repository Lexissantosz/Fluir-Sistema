"use strict";
// Available only on the protected QA preview; never publish a debug APK in production.
module.exports = function handler(req,res) {
  res.setHeader("Cache-Control","private, no-store, max-age=0");
  res.setHeader("X-Content-Type-Options","nosniff");
  if(req.method!=="GET"&&req.method!=="HEAD"){res.setHeader("Allow","GET, HEAD");res.statusCode=405;return res.end();}
  let url;
  try {
    if(process.env.VERCEL_ENV!=="preview" || Number(process.env.FLUIR_QA_APK_EXPIRES_AT)*1000<=Date.now())throw Error("not available");
    url=new URL(process.env.FLUIR_QA_APK_URL);
    if(url.protocol!=="https:"||!/^fluir-sistema-[a-z0-9]+-lexissantosz\.vercel\.app$/.test(url.hostname)||!/^\/Fluir-QA-Android-[A-Za-z0-9-]+\.apk$/.test(url.pathname)||!url.searchParams.has("_vercel_share")||url.username||url.password||url.port||!Number.isFinite(Number(process.env.FLUIR_QA_APK_EXPIRES_AT)))throw Error("invalid");
  }catch {res.statusCode=404;return res.end();}
  if(req.method==="HEAD"){res.statusCode=204;return res.end();}
  res.statusCode=302;res.setHeader("Location",url.href);return res.end();
};
