const {test} = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const root=path.join(__dirname,"..");
const src=fs.readFileSync(path.join(root,"main.cjs"),"utf8");
const pkg=require(path.join(root,"package.json"));
test("Instalador Windows NSIS x64 baixável",()=>{
  assert.equal(pkg.build.win.target[0].target,"nsis");
  assert.equal(pkg.build.win.target[0].arch[0],"x64");
  assert.equal(pkg.build.win.artifactName,"Fluir-Windows-Setup.exe");
});
test("Aplicativo inicia no Fluir oficial e não depende de PWA",()=>{
  assert.match(src,/https:\/\/fluir-sistema\.vercel\.app/);
  assert.match(src,/\/html\/login\.html/);
  assert.doesNotMatch(src,/beforeinstallprompt|navigator\.serviceWorker|registerSchemesAsPrivileged/);
});
test("Isolamento web e sandbox ativos",()=>{
  assert.match(src,/nodeIntegration:\s*false/);
  assert.match(src,/contextIsolation:\s*true/);
  assert.match(src,/sandbox:\s*true/);
  assert.match(src,/webviewTag:\s*false/);
});
test("Navegação restrita à origem oficial",()=>{
  assert.match(src,/url\.origin === ORIGIN/);
  assert.match(src,/setWindowOpenHandler/);
  assert.match(src,/will-navigate/);
  assert.match(src,/setPermissionRequestHandler/);
});
test("Fallback offline e ícone Windows presentes",()=>{
  assert.ok(fs.existsSync(path.join(root,"offline.html")));
  assert.ok(fs.existsSync(path.join(root,"build","icon.ico")));
});
test("Landing tem dois botões de download direto para a versão correta",()=>{
  const html=fs.readFileSync(path.join(root,"..","index.html"),"utf8");
  const url="https://github.com/Lexissantosz/Fluir-Sistema/releases/download/desktop-qa-v0.1.0/Fluir-Windows-Setup.exe";
  assert.equal(html.split(url).length-1,2);
  assert.match(html,/Baixar para Windows \(\.exe\)/);
  assert.match(html,/Fluir para Windows/);
  assert.match(html,/sem assinatura digital/);
});
