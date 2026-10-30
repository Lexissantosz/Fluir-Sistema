/** Monitor simples e sem autenticação. Não promete disponibilidade contínua. */
const endpoints = [
  { nome: "Frontend Vercel", url: "https://fluir-sistema.vercel.app/" },
  { nome: "Backend Render", url: "https://fluir-sistema.onrender.com/api/usuarios/teste", expected: "API do Fluir funcionando" }
];
let failed = false;
for (const endpoint of endpoints) {
  const start = Date.now();
  try {
    const response = await fetch(endpoint.url, { signal: AbortSignal.timeout(75000), redirect: "follow" });
    const body = await response.text();
    const ok = response.ok && (!endpoint.expected || body.includes(endpoint.expected));
    const elapsed = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${endpoint.nome}: ${ok ? "OK" : "FALHA"} (HTTP ${response.status}, ${elapsed}ms)`);
    if (!ok) failed = true;
  } catch (error) {
    console.error(`[${new Date().toISOString()}] ${endpoint.nome}: FALHA (${error.message})`);
    failed = true;
  }
}
if (failed) process.exitCode = 1;
