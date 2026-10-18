#!/usr/bin/env node
/**
 * Runs axe-core over every built demo page in jsdom.
 *
 *   npm run build && npm run check:a11y
 *
 * Limits of running in jsdom (no layout engine, no stylesheets applied):
 *   - color-contrast is disabled here; token contrast is covered by
 *     tests/tokens-contrast.test.js instead.
 *   - Rules that depend on rendering or scripts (focus order, hidden
 *     content toggled by JS) are not exercised. A browser-based run with
 *     Playwright is on the roadmap.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join, relative, resolve } from 'node:path';
import { JSDOM, VirtualConsole } from 'jsdom';

const require = createRequire(import.meta.url);
const axeSource = readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');

const dir = resolve(process.argv[2] ?? 'dist/demo');

function htmlFiles(path) {
  return readdirSync(path).flatMap((name) => {
    const full = join(path, name);
    if (statSync(full).isDirectory()) return htmlFiles(full);
    return name.endsWith('.html') ? [full] : [];
  });
}

let files;
try {
  files = htmlFiles(dir);
} catch {
  console.error(`No built pages found in ${dir}. Run "npm run build" first.`);
  process.exit(1);
}

let failures = 0;

for (const file of files) {
  const dom = new JSDOM(readFileSync(file, 'utf8'), {
    runScripts: 'outside-only',
    pretendToBeVisual: true,
    virtualConsole: new VirtualConsole(),
  });
  dom.window.eval(axeSource);
  const results = await dom.window.axe.run(dom.window.document, {
    runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] },
    rules: { 'color-contrast': { enabled: false } },
  });
  const name = relative(process.cwd(), file);
  if (results.violations.length === 0) {
    console.log(`ok    ${name} (${results.passes.length} rules passed)`);
  } else {
    failures += results.violations.length;
    console.log(`FAIL  ${name}`);
    for (const v of results.violations) {
      console.log(`      ${v.id} [${v.impact}] ${v.help}`);
      for (const node of v.nodes.slice(0, 5)) console.log(`        ${node.target.join(' ')}`);
    }
  }
  dom.window.close();
}

console.log(`\n${files.length} pages checked, ${failures} violation(s).`);
process.exit(failures ? 1 : 0);
