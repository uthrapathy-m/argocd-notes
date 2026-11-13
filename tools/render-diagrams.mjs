#!/usr/bin/env node
// Renders the hand-drawn diagrams (tools/diagrams/specs.js) to images/<key>-light.svg and -dark.svg.
//   node tools/render-diagrams.mjs
// Needs Chrome or Edge (used headless) and internet (rough.js + the Kalam font). No npm install.
// Notes embed them with <picture>, so GitHub and the HTML pages pick light or dark automatically.

import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { execFileSync } from 'node:child_process';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'images');
mkdirSync(OUT, { recursive: true });

const candidates = [
  process.env.CHROME,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser',
].filter(Boolean);
const browser = candidates.find(p => existsSync(p));
if (!browser) { console.error('Chrome/Edge not found. Set CHROME=/path/to/browser'); process.exit(1); }

const page = pathToFileURL(join(ROOT, 'tools', 'diagrams', 'render.html')).href;
const dom = execFileSync(browser, [
  '--headless=new', '--disable-gpu', '--virtual-time-budget=30000', '--dump-dom', page,
], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });

const m = dom.match(/<script type="application\/json" id="out">([\s\S]*?)<\/script>/);
if (!m || !m[1].trim()) { console.error('Render page produced no output (offline? blocked CDN?)'); process.exit(1); }
const out = JSON.parse(m[1]);
if (!out.fontEmbedded) console.warn('warning: Kalam font not embedded; SVGs fall back to a system handwriting font');

for (const [name, svg] of Object.entries(out.svgs)) {
  writeFileSync(join(OUT, `${name}.svg`), '<?xml version="1.0" encoding="UTF-8"?>\n' + svg + '\n');
  console.log(`images/${name}.svg`);
}
