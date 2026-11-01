#!/usr/bin/env bun
/** Guard against copied tool-output headers and broken local documentation links. */
import { access, readFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';

const root = resolve(import.meta.dir, '..');
const files = [];
for await (const name of new Bun.Glob('**/*.md').scan({ cwd: root, onlyFiles: true })) {
  if (name.split('/').some(part => ['.git', 'node_modules', 'dist'].includes(part))) continue;
  files.push(name);
}
const problems = [];
for (const file of files.sort()) {
  const text = await readFile(resolve(root, file), 'utf8');
  const header = /^File: (?:projects\/|\/Users\/)[^\n]*\nLines: \d+-\d+ of \d+\nSHA-256: [a-f0-9]{64}(?:\n|$)/m;
  if (header.test(text)) problems.push(file + ': embedded tool-output file header');
  if (/^(?:File: projects\/|Lines: \d+-\d+ of \d+$|SHA-256: [a-f0-9]{64}$)/m.test(text)) {
    problems.push(file + ': embedded tool-output metadata');
  }
  const links = /!?\[[^\]]*\]\(([^)]+)\)/g;
  for (const match of text.matchAll(links)) {
    const target = match[1].trim().split(/\s+"/)[0];
    if (/^(?:https?:|mailto:|data:|#)/i.test(target)) continue;
    const pathPart = target.split(/[?#]/)[0];
    let filePath;
    try { filePath = decodeURIComponent(pathPart); }
    catch { problems.push(file + ': invalid URI encoding in ' + target); continue; }
    try { await access(resolve(root, dirname(file), filePath)); }
    catch { problems.push(file + ': missing local link ' + target); }
  }
}
if (problems.length) {
  for (const issue of [...new Set(problems)]) console.error('DOCS ERROR: ' + issue);
  process.exit(1);
}
console.log('Documentation check passed:', files.length, 'Markdown files; no injected metadata or broken local links.');
