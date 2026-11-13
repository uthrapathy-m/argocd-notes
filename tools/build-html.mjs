#!/usr/bin/env node
// Builds docs/*.html from the Markdown notes. No dependencies: Node 18+ only.
//   node tools/build-html.mjs
// Each page embeds its Markdown and renders it in the browser (marked + Prism from CDNs),
// so the HTML never drifts from the Markdown. Edit the .md files, then re-run this script.

import { readFileSync, writeFileSync, readdirSync, mkdirSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DOCS = join(ROOT, 'docs');
mkdirSync(join(DOCS, 'assets'), { recursive: true });

// ---- pages: [source .md relative to repo root, output .html name, short nav label] ----
const notes = readdirSync(join(ROOT, 'notes')).filter(f => f.endsWith('.md')).sort();
const pages = [
  ['README.md', 'index.html', 'Home'],
  ['KEY-POINTS.md', 'key-points.html', 'Key points'],
  ...notes.map(f => {
    const title = firstHeading(readFileSync(join(ROOT, 'notes', f), 'utf8'));
    return [`notes/${f}`, f.replace(/\.md$/, '.html'), title.replace(/^\d+\s*·\s*/, f.slice(0, 2) + ' · ')];
  }),
];

function firstHeading(md) {
  const m = md.match(/^#\s+(.+)$/m);
  return m ? m[1].trim() : 'Notes';
}
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

for (const [src, out, label] of pages) {
  const md = readFileSync(join(ROOT, src), 'utf8');
  const title = firstHeading(md);
  const srcDir = dirname(src) === '.' ? '' : dirname(src);
  const nav = pages.map(([, o, l]) =>
    `<a href="${o}"${o === out ? ' class="active" aria-current="page"' : ''}>${esc(l)}</a>`).join('\n      ');
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)} · Argo CD Notes</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Newsreader:opsz,wght@6..72,500;6..72,600&display=swap">
<link rel="stylesheet" href="assets/notes.css">
</head>
<body>
<div class="topbar"><span class="t">Argo CD Notes</span><button class="toc-toggle" id="tocToggle" type="button" aria-expanded="false" aria-controls="sidebar">Contents</button></div>
<div class="scrim" id="scrim" hidden></div>
<aside class="sidebar" id="sidebar" aria-label="Navigation">
  <div class="brand"><span class="kicker">Argo CD Notes</span><span class="name">${esc(title.replace(/^\d+\s*·\s*/, ''))}</span></div>
  <nav class="toc">
    <div class="toc-group"><h4>Pages</h4>
      ${nav}
    </div>
    <div class="toc-group"><h4>On this page</h4><div id="onpage"></div></div>
  </nav>
  <div class="sidebar-foot no-print">
    <button class="btn" id="printBtn" type="button">Print / Save as PDF (A4)</button>
    <p class="hint">Generated from <code>${esc(src)}</code></p>
  </div>
</aside>
<main><article class="wrap" id="content" data-src-dir="${srcDir}"><p class="hint">Loading… (needs internet for the renderer scripts)</p></article></main>
<script type="text/markdown" id="md">${md.replace(/<\/script/gi, '<\\/script')}</script>
<script src="https://cdn.jsdelivr.net/npm/marked@12.0.2/marked.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-yaml.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-bash.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-json.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-python.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-docker.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-powershell.min.js"></script>
<script src="assets/notes.js"></script>
</body>
</html>
`;
  writeFileSync(join(DOCS, out), html);
  console.log(`docs/${out}  <-  ${src}`);
}

// ---- shared assets ----
writeFileSync(join(DOCS, 'assets', 'notes.css'), readFileSync(join(ROOT, 'tools', 'notes.css'), 'utf8'));
writeFileSync(join(DOCS, 'assets', 'notes.js'), readFileSync(join(ROOT, 'tools', 'notes.js'), 'utf8'));
console.log('docs/assets/notes.css, docs/assets/notes.js');
