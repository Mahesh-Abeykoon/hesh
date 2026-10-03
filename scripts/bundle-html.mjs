/**
 * Produces a single self-contained HTML file from the built docs site.
 *
 * Useful for offline review and for sandboxed viewers that cannot reach a dev
 * server: the stylesheet and the JS module are inlined, so the file has no
 * external requests at all.
 *
 *   node scripts/bundle-html.mjs
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const inputDir = resolve(root, 'dist-docs');
const outFile = resolve(root, 'hesh-docs.html');

if (!existsSync(join(inputDir, 'index.html'))) {
  console.error('dist-docs/index.html not found. Run `npm run build:docs` first.');
  process.exit(1);
}

let html = readFileSync(join(inputDir, 'index.html'), 'utf8');

const assetsDir = join(inputDir, 'assets');
const assets = existsSync(assetsDir) ? readdirSync(assetsDir) : [];

// Inline stylesheets.
html = html.replace(/<link[^>]+rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/g, (_match, href) => {
  const file = join(inputDir, href.replace(/^\//, ''));
  return `<style>\n${readFileSync(file, 'utf8')}\n</style>`;
});

// Inline scripts.
//
// Vite emits the entry in <head> as `type="module"`, which is deferred by
// default. A classic inline script is not — so the tag is moved to the end of
// <body>, otherwise it runs before <div id="root"> exists.
const scripts = [];
html = html.replace(/<script[^>]+src="([^"]+)"[^>]*><\/script>/g, (_match, src) => {
  const file = join(inputDir, src.replace(/^\//, ''));
  scripts.push(readFileSync(file, 'utf8'));
  return '';
});
if (scripts.length > 0) {
  // The replacement MUST be a function. With a string replacement, `$&`, `` $` ``
  // and `$'` inside the minified bundle are treated as substitution patterns
  // and silently corrupt the code.
  html = html.replace(
    '</body>',
    () => `<script>\n${scripts.join('\n')}\n</script>\n  </body>`
  );
}

// Preload hints and modulepreloads point at files that no longer exist.
html = html.replace(/<link[^>]+rel="modulepreload"[^>]*>/g, '');
html = html.replace(/<link[^>]+rel="preload"[^>]*>/g, '');

html = html.replace(
  '<title>',
  '<!-- Single-file build of the Hesh documentation site. No network requests. -->\n    <title>'
);

writeFileSync(outFile, html, 'utf8');

const kb = (readFileSync(outFile).length / 1024).toFixed(1);
console.log(`hesh-docs.html  ${kb} kB  (${assets.length} asset(s) inlined)`);
