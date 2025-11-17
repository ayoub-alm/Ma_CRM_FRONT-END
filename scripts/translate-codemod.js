#!/usr/bin/env node
/*
  Simple codemod to replace plain visible text nodes in Angular component HTML files
  with ngx-translate pipe calls and append keys to public/assets/i18n/fr.json and it.json.

  Usage: node scripts/translate-codemod.js

  Notes:
  - This is a cautious, regex-based transformer. It will only replace text between tags
    (i.e. >text<) that does not contain Angular bindings {{ }} or angle brackets.
  - It creates a .bak backup for each modified HTML file.
  - It appends new keys to the FR and IT json files (uses the French text as the value).
  - Review changes before committing.
*/

const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const srcDir = path.join(projectRoot, 'src');
const i18nDir = path.join(projectRoot, 'public', 'assets', 'i18n');
const frFile = path.join(i18nDir, 'fr.json');
const itFile = path.join(i18nDir, 'it.json');

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (e) {
    console.error('Cannot read/parse', file, e.message);
    return {};
  }
}

function writeJson(file, obj) {
  fs.writeFileSync(file, JSON.stringify(obj, null, 2) + '\n', 'utf8');
}

let fr = readJson(frFile);
let it = readJson(itFile);
let newKeys = {};

function walkDir(dir, cb) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walkDir(full, cb);
    else cb(full);
  }
}

function isComponentHtml(file) {
  return file.endsWith('.component.html') && file.indexOf('node_modules') === -1;
}

function makeKey(componentName, text, counter) {
  // create short key from text: uppercase, non-alnum -> underscore, trim to 40 chars
  let s = text.replace(/\s+/g, ' ').trim();
  s = s.toUpperCase().replace(/[^A-Z0-9]+/g, '_');
  if (s.length > 40) s = s.slice(0, 40);
  if (counter) s = s + '_' + counter;
  return `${componentName}.${s}`;
}

function transformFile(file) {
  if (!isComponentHtml(file)) return null;
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // avoid transforming inside <script> or <style>
  // We'll split on those tags and only transform outside them.
  const parts = content.split(/(<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>)/i);
  let changed = false;
  let fileKeyBase = path.basename(file).replace('.component.html', '');
  let keyCounter = 1;

  for (let i = 0; i < parts.length; i++) {
    if (/^<script/i.test(parts[i]) || /^<style/i.test(parts[i])) continue;

    // Match text nodes between > and < that don't include { or } or < or > and contain letters
    parts[i] = parts[i].replace(/>([^<>{}]*?[A-Za-zÀ-ÖØ-öø-ÿ][^<>{}]*)</g, (m, txt) => {
      const raw = txt;
      const trimmed = raw.replace(/^[\s\u00A0]+|[\s\u00A0]+$/g, '');
      if (!trimmed) return `>${raw}<`;
      // Skip if already contains translate pipe or angular binding
      if (/\|\s*translate/.test(raw) || /{{/.test(raw) || /}}/.test(raw)) return `>${raw}<`;
      // Skip if looks like only punctuation or numbers
      if (!/[A-Za-zÀ-ÖØ-öø-ÿ]/.test(trimmed)) return `>${raw}<`;

      // Create a key and ensure uniqueness
      let key;
      let attempt = 0;
      do {
        attempt++;
        key = makeKey(fileKeyBase, trimmed, attempt > 1 ? attempt : null);
      } while (fr.hasOwnProperty(key) || newKeys.hasOwnProperty(key));

      // Save values
      fr[key] = trimmed;
      it[key] = trimmed; // copy french by default; translator should update it.json later
      newKeys[key] = trimmed;

      changed = true;
      // Preserve leading/trailing whitespace inside raw
      const leading = raw.match(/^[\s\u00A0]*/)[0] || '';
      const trailing = raw.match(/[\s\u00A0]*$/)[0] || '';
      return `>${leading}{{ '${key}' | translate }}${trailing}<`;
    });
  }

  if (changed) {
    // Backup original
    fs.writeFileSync(file + '.bak', original, 'utf8');
    // Rejoin parts
    const newContent = parts.join('');
    fs.writeFileSync(file, newContent, 'utf8');
    return file;
  }
  return null;
}

// Collect html files
let modified = [];
walkDir(srcDir, (file) => {
  try {
    const changed = transformFile(file);
    if (changed) modified.push(changed);
  } catch (e) {
    console.error('Failed to process', file, e.message);
  }
});

if (Object.keys(newKeys).length > 0) {
  writeJson(frFile, fr);
  writeJson(itFile, it);
}

console.log('Translate codemod finished. Files modified:', modified.length);
if (modified.length) console.log(modified.join('\n'));
console.log('New keys added:', Object.keys(newKeys).length);
if (Object.keys(newKeys).length) console.log(Object.keys(newKeys).slice(0, 200).join('\n'));

if (modified.length === 0) process.exit(0);
process.exit(0);
