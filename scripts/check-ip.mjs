#!/usr/bin/env node
/**
 * Tier A gate: the awarding body's name and word marks must never appear in
 * anything that functions as an identifier or a claim of affiliation.
 *
 * Tier B (referential use inside body prose, plus the required legal notice)
 * is permitted and deliberately not checked here.
 *
 * See plan.md for the full rule set.
 */
import { readdir, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, relative, extname } from 'node:path';

const ROOT = process.cwd();
const BANNED = /\b(international\s+baccalaureate|baccalaureat\s+international|baccalaur[eé]at\s+international|bachillerato\s+internacional|ibo\b|ib\s*世界|ibdp|ib\s+world\s+school|world\s+school|learner\s+profile|pyp|myp|tok)\b/i;
const BANNED_SLUG = /\b(international|baccalaureate|baccalaur[eé]at|bachillerato|ibo|ibdp|ib)\b/i;

const TEXT_EXT = new Set(['.mdx', '.md', '.astro', '.ts', '.js', '.mjs', '.json', '.css', '.html', '.svg', '.txt', '.webmanifest']);
const SKIP_DIRS = new Set(['node_modules', '.git', '.astro', 'dist', 'public']);

/** Files allowed to contain the marks because they carry the legal notice. */
const LEGAL_FILES = new Set(['src/data/site.ts', 'src/pages/disclaimer.astro']);

const problems = [];

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = join(dir, entry.name);
    const rel = relative(ROOT, full).split('\\').join('/');

    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      if (BANNED_SLUG.test(entry.name)) {
        problems.push(`directory name violates Tier A: ${rel}/`);
      }
      await walk(full);
      continue;
    }

    if (BANNED_SLUG.test(entry.name)) {
      problems.push(`file name violates Tier A: ${rel}`);
    }

    if (!TEXT_EXT.has(extname(entry.name))) continue;
    if (LEGAL_FILES.has(rel)) continue;

    const body = await readFile(full, 'utf8');

    // Frontmatter title/description and page headings act as identifiers.
    for (const match of body.matchAll(/^(title|description|headline|slug|code):\s*(.+)$/gm)) {
      const value = match[2].replace(/^["']|["']$/g, '');
      if (BANNED.test(value)) {
        problems.push(`${rel}: frontmatter "${match[1]}" violates Tier A → ${value.slice(0, 90)}`);
      }
    }

    for (const match of body.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)) {
      if (BANNED.test(match[1])) {
        problems.push(`${rel}: <h1> violates Tier A → ${match[1].replace(/\s+/g, ' ').slice(0, 90)}`);
      }
    }

    if (rel.startsWith('src/pages/') && rel.endsWith('.astro')) {
      const name = rel.slice('src/pages/'.length).replace(/\.astro$/, '').replace(/\/index$/, '');
      if (name && BANNED_SLUG.test(name)) {
        problems.push(`route slug violates Tier A: ${rel}`);
      }
    }
  }
}

/** Also inspect the built output's head metadata. */
async function checkDist() {
  const dist = join(ROOT, 'dist');
  if (!existsSync(dist)) return;

  async function walkDist(dir) {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const full = join(dir, entry.name);
      const rel = relative(ROOT, full).split('\\').join('/');
      if (entry.isDirectory()) {
        if (BANNED_SLUG.test(entry.name)) problems.push(`built directory violates Tier A: ${rel}/`);
        await walkDist(full);
        continue;
      }
      if (BANNED_SLUG.test(entry.name)) problems.push(`built file name violates Tier A: ${rel}`);
      if (extname(entry.name) !== '.html') continue;

      const html = await readFile(full, 'utf8');
      for (const m of html.matchAll(/<title[^>]*>([\s\S]*?)<\/title>/gi)) {
        if (BANNED.test(m[1])) problems.push(`${rel}: <title> violates Tier A → ${m[1].slice(0, 90)}`);
      }
      for (const m of html.matchAll(/<meta\s+name="description"\s+content="([^"]*)"/gi)) {
        if (BANNED.test(m[1])) problems.push(`${rel}: meta description violates Tier A`);
      }
      for (const m of html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)) {
        if (BANNED.test(m[1].replace(/<[^>]+>/g, ''))) {
          problems.push(`${rel}: rendered <h1> violates Tier A`);
        }
      }
    }
  }

  await walkDist(dist);
}

await walk(join(ROOT, 'src'));
await checkDist();

if (problems.length) {
  console.error('\n✗ Tier A vocabulary violations found:\n');
  for (const p of problems) console.error('  · ' + p);
  console.error(`\n${problems.length} problem(s). See plan.md → Vocabulary tiers.\n`);
  process.exit(1);
}

console.log('✓ Tier A vocabulary gate passed.');
