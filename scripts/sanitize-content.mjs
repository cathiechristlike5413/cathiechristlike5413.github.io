import { readdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';

const defaultTargets = ['src/content', 'src/data', '.pages.yml'];
const targets = process.argv.slice(2).length > 0 ? process.argv.slice(2) : defaultTargets;
const textExtensions = new Set(['.md', '.mdx', '.json', '.yml', '.yaml']);
const suspiciousCharacters = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F\u200B\u2060\uFEFF\uFFFC\uFFFD]/g;

async function collectFiles(target) {
  const absolutePath = path.resolve(target);

  try {
    const info = await stat(absolutePath);
    if (info.isFile()) return [absolutePath];
    if (!info.isDirectory()) return [];
  } catch {
    return [];
  }

  const entries = await readdir(absolutePath, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) => collectFiles(path.join(absolutePath, entry.name))),
  );
  return nested.flat();
}

const files = (await Promise.all(targets.map(collectFiles))).flat();
let changedFiles = 0;
let removedCharacters = 0;

for (const file of files) {
  if (!textExtensions.has(path.extname(file).toLowerCase())) continue;

  const original = await readFile(file, 'utf8');
  const matches = original.match(suspiciousCharacters) ?? [];
  if (matches.length === 0) continue;

  const sanitized = original.replace(suspiciousCharacters, '');
  await writeFile(file, sanitized, 'utf8');
  changedFiles += 1;
  removedCharacters += matches.length;
  console.log(`[sanitize] ${path.relative(process.cwd(), file)}: removed ${matches.length}`);
}

console.log(`[sanitize] complete: ${removedCharacters} invalid character(s) removed from ${changedFiles} file(s).`);
