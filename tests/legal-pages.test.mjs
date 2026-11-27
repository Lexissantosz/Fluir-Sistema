import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const pages = ['index.html', 'html/login.html', 'html/privacidade.html', 'html/termos.html'];
function read(name) { return fs.readFileSync(path.join(root, name), 'utf8'); }

test('políticas disponíveis e vinculadas nas duas portas de entrada', () => {
  for (const page of pages) {
    const html = read(page);
    assert.match(html, /Pol[ií]tica de Privacidade/);
    assert.match(html, /Termos de Uso/);
    if (!/fluirsistema@gmail\.com/.test(html)) {
      assert.match(html, /href="(?:html\/)?contato\.html"/);
      assert.match(read('html/contato.html'), /mailto:fluirsistema@gmail\.com/);
    } else {
      assert.match(html, /fluirsistema@gmail\.com/);
    }
  }
});

test('links relativos das páginas públicas existentes', () => {
  for (const page of pages) {
    for (const match of read(page).matchAll(/(?:href|src)="([^"]+)"/g)) {
      const href = match[1];
      if (/^(https?:|mailto:|#)/i.test(href)) continue;
      const pathname = href.split(/[?#]/)[0];
      if (!pathname) continue;
      assert.ok(fs.existsSync(path.resolve(root, path.dirname(page), pathname)), page + ' contém link inválido: ' + href);
    }
  }
});

test('política informa dados do login Google, Gemini e armazenamento local', () => {
  const privacy = read('html/privacidade.html');
  assert.match(privacy, /Google/);
  assert.match(privacy, /Gemini/);
  assert.match(privacy, /armazenamento local/);
  assert.match(privacy, /eliminação/);
  assert.doesNotMatch(privacy, /GOCSPX-/);
});
