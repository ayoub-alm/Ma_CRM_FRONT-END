#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const srcDir = path.join(projectRoot, 'src');

function walk(dir, cb) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, cb);
    else cb(full);
  }
}

let modified = [];
walk(srcDir, (file) => {
  if (!file.endsWith('.ts')) return;
  const content = fs.readFileSync(file, 'utf8');
  if (!/standalone:\s*true/.test(content)) return;
  if (content.includes("@ngx-translate/core")) return; // already has import

  // Insert import near other imports (after last import)
  const lines = content.split('\n');
  let importIndex = -1;
  for (let i = 0; i < lines.length; i++) {
    if (/^import\s/.test(lines[i])) importIndex = i;
  }
  if (importIndex >= 0) {
    lines.splice(importIndex+1, 0, "import { TranslateModule } from '@ngx-translate/core';");
  } else {
    lines.unshift("import { TranslateModule } from '@ngx-translate/core';");
  }

  // Add TranslateModule to imports: [ ... ]
  const joined = lines.join('\n');
  const newContent = joined.replace(/imports:\s*\[([\s\S]*?)\]/m, (m, inner) => {
    if (/TranslateModule/.test(inner)) return m;
    // Add TranslateModule at end but before closing
    const updated = 'imports: [' + inner.trim() + (inner.trim().endsWith(',') ? ' ' : ', ') + 'TranslateModule]';
    return updated;
  });

  if (newContent === joined) return;
  fs.writeFileSync(file + '.bak', content, 'utf8');
  fs.writeFileSync(file, newContent, 'utf8');
  modified.push(file);
});

console.log('Added TranslateModule to', modified.length, 'standalone components');
if (modified.length) console.log(modified.join('\n'));
