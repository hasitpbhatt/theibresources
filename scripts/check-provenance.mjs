#!/usr/bin/env node
/**
 * Provenance gate. Every content entry declares where it came from, and only
 * material authored for this site is allowed to ship. Anything else must sit in
 * src/content/_staging/ until its status is resolved.
 */
import { readdir, readFile } from 'node:fs/promises';
import { join, relative, extname } from 'node:path';

const ROOT = process.cwd();
const CONTENT = join(ROOT, 'src', 'content');
const STAGING = join(CONTENT, '_staging');
const ALLOWED_ORIGIN = 'original';

const problems = [];
let checked = 0;

function parseFrontmatter(body) {
  const match = body.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return match ? match[1] : null;
}

function readField(frontmatter, key) {
  const m = frontmatter.match(new RegExp(`^\\s*${key}:\\s*(.+)$`, 'm'));
  return m ? m[1].trim().replace(/^["']|["']$/g, '') : null;
}

async function walk(dir, inStaging = false) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }

  for (const entry of entries) {
    const full = join(dir, entry.name);
    const rel = relative(ROOT, full).split('\\').join('/');
    const isStaging = inStaging || full === STAGING;

    if (entry.isDirectory()) {
      await walk(full, isStaging);
      continue;
    }

    if (extname(entry.name) !== '.mdx' && extname(entry.name) !== '.md') continue;
    if (entry.name.startsWith('_')) continue;

    const body = await readFile(full, 'utf8');
    const frontmatter = parseFrontmatter(body);

    if (!frontmatter) {
      problems.push(`${rel}: missing frontmatter block`);
      continue;
    }

    if (!/^provenance:/m.test(frontmatter)) {
      problems.push(`${rel}: missing \`provenance\` block`);
      continue;
    }

    const origin = readField(frontmatter, 'origin');
    const author = readField(frontmatter, 'author');

    if (!origin) {
      problems.push(`${rel}: provenance.origin is missing`);
      continue;
    }

    if (!author) {
      problems.push(`${rel}: provenance.author is missing`);
      continue;
    }

    if (isStaging) continue;

    checked += 1;

    if (origin !== ALLOWED_ORIGIN) {
      problems.push(
        `${rel}: provenance.origin is "${origin}" — only "${ALLOWED_ORIGIN}" may ship. Move the file to src/content/_staging/ until it is cleared.`,
      );
    }

    if (origin === 'licensed' || origin === 'public-domain') {
      const licence = readField(frontmatter, 'licence');
      if (!licence) {
        problems.push(`${rel}: origin "${origin}" requires provenance.licence`);
      }
    }
  }
}

/** A staging file must never be imported by shipped code. */
async function checkStagingImports() {
  const src = join(ROOT, 'src');
  async function walkSrc(dir) {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === '_staging') continue;
        await walkSrc(full);
        continue;
      }
      if (!['.astro', '.ts', '.js', '.mjs', '.tsx'].includes(extname(entry.name))) continue;
      const body = await readFile(full, 'utf8');
      if (/_staging/.test(body)) {
        problems.push(`${relative(ROOT, full).split('\\').join('/')}: references _staging — staging content must not ship`);
      }
    }
  }
  await walkSrc(src);
}

await walk(CONTENT);
await checkStagingImports();

if (problems.length) {
  console.error('\n✗ Provenance gate failed:\n');
  for (const p of problems) console.error('  · ' + p);
  console.error(`\n${problems.length} problem(s). See plan.md → Provenance gate.\n`);
  process.exit(1);
}

console.log(`✓ Provenance gate passed (${checked} shipped entr${checked === 1 ? 'y' : 'ies'}).`);
