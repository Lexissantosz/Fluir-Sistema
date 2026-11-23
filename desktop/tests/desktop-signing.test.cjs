const {test}=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const root=path.join(__dirname,"..","..");
const workflow=fs.readFileSync(path.join(root,".github","workflows","fluir-desktop-installer.yml"),"utf8");
const verifier=fs.readFileSync(path.join(root,"desktop","scripts","verify-signature.ps1"),"utf8");
test("Distribuição assinada usa tag separada do QA",()=>{
  assert.match(workflow,/desktop-v\*/);
  assert.doesNotMatch(workflow,/desktop-qa-v\*/);
});
test("Publicação exige certificado e assinatura válida",()=>{
  assert.match(workflow,/secrets\.WIN_CSC_LINK/);
  assert.match(workflow,/secrets\.WIN_CSC_KEY_PASSWORD/);
  assert.match(workflow,/verify-signature\.ps1/);
  assert.match(verifier,/Get-AuthenticodeSignature/);
  assert.match(verifier,/SignatureStatus\]::Valid/);
  assert.match(workflow,/needs: windows-installer/);
});
test("Landing alerta que o instalador de QA não é assinado",()=>{
  const html=fs.readFileSync(path.join(root,"index.html"),"utf8");
  assert.match(html,/desktop-qa-warning/);
  assert.match(html,/sem assinatura digital/);
  assert.match(html,/Windows pode bloquear/);
});
