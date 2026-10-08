/**
 * Bundles src/styles/*.css into dist/hesh.css.
 *
 * Vite's lib mode only emits CSS that the JS entry imports, and we deliberately
 * keep the stylesheet out of the JS graph so consumers can control load order
 * (and so `sideEffects` stays accurate for tree-shaking). Concatenation is all
 * that is needed — the three files are already ordered by cascade layer.
 */
import { readFileSync, writeFileSync, statSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const files = ['variables.css', 'presets.css', 'base.css', 'components.css', 'advanced.css', 'premium.css'];

const banner = `/**
 * Hesh — stylesheet
 *
 * Load once, near the root of your app:
 *   import 'hesh-ui/styles.css';
 *
 * The whole library reads from the custom properties in the token layer.
 * Override any of them to re-theme every component.
 */
`;

const css =
  banner +
  files
    .map((file) => {
      const path = resolve(root, 'src/styles', file);
      return `\n/* ==================== src/styles/${file} ==================== */\n${readFileSync(path, 'utf8').trim()}\n`;
    })
    .join('');

const out = resolve(root, 'dist/hesh.css');
writeFileSync(out, css, 'utf8');

const bytes = statSync(out).size;
const gz = gzipSync(Buffer.from(css)).length;
console.log(
  `dist/hesh.css  ${(bytes / 1024).toFixed(1)} kB │ gzip: ${(gz / 1024).toFixed(1)} kB`
);
