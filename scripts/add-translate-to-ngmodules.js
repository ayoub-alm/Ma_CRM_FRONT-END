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
  if (!/@NgModule\s*\(/.test(content)) return;
  if (content.includes("@ngx-translate/core")) {
    // might still need to add TranslateModule to imports array
  }

  let updated = content;
  // Ensure import exists
  if (!/from\s+'@ngx-translate\/core'/.test(content)) {
    // Insert import after last import
    const lines = content.split('\n');
    let lastImport = -1;
    for (let i = 0; i < lines.length; i++) {
      if (/^import\s/.test(lines[i])) lastImport = i;
    }
    const importLine = "import { TranslateModule } from '@ngx-translate/core';";
    if (lastImport >= 0) lines.splice(lastImport + 1, 0, importLine);
    else lines.unshift(importLine);
    updated = lines.join('\n');
  }

  // Now add TranslateModule to NgModule imports array if not present
  if (!/imports\s*:\s*\[([\s\S]*?)\]/m.test(updated)) {
    // no imports array found - skip
  } else {
    updated = updated.replace(/imports\s*:\s*\[([\s\S]*?)\]/m, (m, inner) => {
      if (/TranslateModule/.test(inner)) return m; // already present
      // Add TranslateModule at the end, preserve trailing comma/format
      const trimmed = inner.trim();
      const suffix = trimmed.endsWith(',') || trimmed === '' ? ' ' : ', ';
      return `imports: [${trimmed}${suffix}TranslateModule]`;
    });
  }

  if (updated !== content) {
    fs.writeFileSync(file + '.bak', content, 'utf8');
    fs.writeFileSync(file, updated, 'utf8');
    modified.push(file);
  }
});

console.log('Added TranslateModule to', modified.length, 'NgModule files');
if (modified.length) console.log(modified.join('\n'));
