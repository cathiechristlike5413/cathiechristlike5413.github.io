import { readdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';

const defaultTargets = ['src/content', 'src/data', '.pages.yml'];
const targets = process.argv.slice(2).length > 0 ? process.argv.slice(2) : defaultTargets;
const textExtensions = new Set(['.md', '.mdx', '.json', '.yml', '.yaml']);
const editorLineBreak = /\u001F/g;
const removableCharacters = /[\u0000-\u0008\u000B\u000C\u000E-\u001E\u007F\u200B\u2060\uFEFF\uFFFC\uFFFD]/g;

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
let restoredLineBreaks = 0;

for (const file of files) {
  if (!textExtensions.has(path.extname(file).toLowerCase())) continue;

  const original = await readFile(file, 'utf8');
  const lineBreakCount = (original.match(editorLineBreak) ?? []).length;
  const removableCount = (original.match(removableCharacters) ?? []).length;
  if (lineBreakCount === 0 && removableCount === 0) continue;

  const sanitized = original
    .replace(editorLineBreak, '<br>')
    .replace(removableCharacters, '');
  await writeFile(file, sanitized, 'utf8');
  changedFiles += 1;
  removedCharacters += removableCount;
  restoredLineBreaks += lineBreakCount;
  console.log(
    `[sanitize] ${path.relative(process.cwd(), file)}: restored ${lineBreakCount} line break(s), removed ${removableCount} invalid character(s)`,
  );
}

console.log(
  `[sanitize] complete: restored ${restoredLineBreaks} line break(s), removed ${removedCharacters} invalid character(s) from ${changedFiles} file(s).`,
);
