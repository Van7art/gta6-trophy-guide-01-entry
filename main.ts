// Leonida Trophy Dashboard — a GTA VI trophy guide and tracker for make.fun's
// gta6-trophy-guide-01 competition. The guide itself lives in app/: plain static files
// (index.html, style.css, app.js and data/trophies.json) that any static server can
// host with app/ at its root, and that work with the network off — every file the
// page loads sits under app/, and the only outward links are the source citations
// a reader may follow from a trophy's guide. The trophy data holds the official
// PlayStation names, descriptions and grades for all 55 trophies, plus a guide in
// our own words for each one, its kind, its roadmap stage, whether it is hidden
// or missable, and the sources each guide draws on.
//
// This program is the entry's hand-in step: it copies app/ and screenshots/ from
// beside this file into the output directory and writes dossier.json there with
// buildDossier from the vendored make.fun library (vendor/makefun-frontend.ts,
// left untouched — the scorer rebuilds the dossier with its own copy and the two
// must match byte for byte). Outside the grader, MAKEFUN_OUTPUT_DIR stands in
// for /output, so a local run looks like:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// The program is deterministic: run it twice and dossier.json comes out identical.
// Serve the guide locally with `node serve.ts`, then open http://localhost:8080.

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });

// The scorer's caps: at most 4 screenshots, each at most 256 KiB; app/ at most
// 993 files and directories and 48 MiB in all. Only text_max_bytes changes the
// dossier's bytes; the other limits refuse an entry the scorer would refuse.
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, { text_max_bytes: 163840, screenshots: { max: 4, max_bytes: 262144 }, app_max_files: 993, app_max_bytes: 50331648 }),
);
