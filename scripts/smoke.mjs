/**
 * Smoke test: mounts the docs app in jsdom and visits every route.
 *
 * Catches the class of bug a type checker cannot: missing providers, effects
 * that throw, hooks called conditionally, invalid DOM nesting warnings, and
 * React key/prop warnings.
 *
 *   node scripts/smoke.mjs
 */
import { build } from 'esbuild';
import { JSDOM } from 'jsdom';
import { readFileSync, rmSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { INTERACTIONS } from './interactions.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outfile = resolve(root, 'node_modules/.cache/smoke-bundle.cjs');

await build({
  entryPoints: [resolve(root, 'docs/smoke-entry.tsx')],
  outfile,
  bundle: true,
  format: 'cjs',
  platform: 'node',
  jsx: 'automatic',
  loader: { '.css': 'empty' },
  define: { 'process.env.NODE_ENV': '"development"' },
  external: ['react', 'react-dom', 'react-dom/client', 'react-dom/test-utils'],
  logLevel: 'error',
});

/* -------------------------------------------------------------- environment */

const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', {
  url: 'http://localhost:5173/',
  pretendToBeVisual: true,
});

const { window } = dom;

globalThis.IS_REACT_ACT_ENVIRONMENT = true;
globalThis.window = window;
globalThis.document = window.document;
Object.defineProperty(globalThis, 'navigator', {
  value: window.navigator,
  configurable: true,
  writable: true,
});
globalThis.HTMLElement = window.HTMLElement;
globalThis.HTMLInputElement = window.HTMLInputElement;
globalThis.Element = window.Element;
globalThis.Node = window.Node;
globalThis.Event = window.Event;
globalThis.MouseEvent = window.MouseEvent;
globalThis.KeyboardEvent = window.KeyboardEvent;
globalThis.PointerEvent = window.MouseEvent;
globalThis.getComputedStyle = window.getComputedStyle.bind(window);
globalThis.requestAnimationFrame = (cb) => window.setTimeout(() => cb(Date.now()), 0);
globalThis.cancelAnimationFrame = (id) => window.clearTimeout(id);
globalThis.MutationObserver = window.MutationObserver;
globalThis.HashChangeEvent = window.HashChangeEvent ?? window.Event;
globalThis.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};
window.ResizeObserver = globalThis.ResizeObserver;
globalThis.IntersectionObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};
window.IntersectionObserver = globalThis.IntersectionObserver;
window.MutationObserver = window.MutationObserver ?? globalThis.MutationObserver;
window.matchMedia =
  window.matchMedia ||
  (() => ({
    matches: false,
    addEventListener() {},
    removeEventListener() {},
    addListener() {},
    removeListener() {},
  }));
globalThis.matchMedia = window.matchMedia;
// jsdom does not do layout: without this shim every element measures 0×0 and
// focus-trap logic (correctly) treats the whole panel as unfocusable.
Object.defineProperties(window.HTMLElement.prototype, {
  offsetWidth: { get() { return 100; }, configurable: true },
  offsetHeight: { get() { return 20; }, configurable: true },
  offsetParent: { get() { return this.parentNode; }, configurable: true },
});

window.scrollTo = () => {};
window.HTMLElement.prototype.scrollTo = () => {};
window.Element.prototype.scrollTo = () => {};
window.HTMLElement.prototype.scrollIntoView = () => {};
window.Element.prototype.scrollIntoView = () => {};

/* -------------------------------------------------------------- error capture */

const problems = [];
const IGNORE = [
  /Not implemented: HTMLFormElement/,
  /Could not parse CSS stylesheet/,
  /Error: Not implemented: navigation/,
];

const realError = console.error;
console.error = (...args) => {
  const text = args.map((a) => (a instanceof Error ? a.message : String(a))).join(' ');
  if (!IGNORE.some((pattern) => pattern.test(text))) problems.push(text);
};

const realWarn = console.warn;
console.warn = (...args) => {
  const text = args.map(String).join(' ');
  if (!IGNORE.some((pattern) => pattern.test(text))) problems.push(text);
};

process.on('uncaughtException', (error) => problems.push(`uncaught: ${error.message}\n${error.stack}`));

/* -------------------------------------------------------------- run */

const { pathToFileURL } = await import('node:url');
const bundle = await import(pathToFileURL(outfile).href);
const { App, DOC_GROUPS, createRoot, React } = bundle;

const pages = DOC_GROUPS.flatMap((group) => group.pages.map((page) => page.id));
const container = document.getElementById('root');
const reactRoot = createRoot(container);

const results = [];

try {
  await React.act?.(async () => {});
  reactRoot.render(React.createElement(App));
  await new Promise((r) => setTimeout(r, 120));

  for (const id of pages) {
    problems.length = 0;
    try {
      await (React.act
        ? React.act(async () => {
            window.location.hash = `/${id}`;
            window.dispatchEvent(new window.HashChangeEvent('hashchange'));
          })
        : (async () => {
            window.location.hash = `/${id}`;
            window.dispatchEvent(new window.HashChangeEvent('hashchange'));
          })());
      await new Promise((r) => setTimeout(r, 90));

      const text = container.textContent ?? '';
      const nodes = container.querySelectorAll('*').length;
      results.push({ id, nodes, text: text.slice(0, 60), problems: [...problems] });
    } catch (error) {
      results.push({ id, nodes: 0, text: '', problems: [`THREW: ${error.message}`] });
    }
  }
} catch (error) {
  console.log('FATAL', error);
  process.exitCode = 1;
} finally {
  console.error = realError;
  console.warn = realWarn;
}

/* -------------------------------------------------------------- interactions */

const helpers = {
  document,
  wait: (ms = 40) => new Promise((r) => setTimeout(r, ms)),
  findByText: (scope, selector, text, extra) =>
    [...scope.querySelectorAll(selector)].find(
      (el) =>
        (text === '' || (el.textContent ?? '').trim().includes(text)) &&
        (extra ? extra(el) : true)
    ),
  click: async (el) => {
    await React.act?.(async () => {
      el.dispatchEvent(new window.MouseEvent('click', { bubbles: true, cancelable: true }));
    });
  },
  press: async (el, key, modifiers = {}) => {
    await React.act?.(async () => {
      el.dispatchEvent(
        new window.KeyboardEvent('keydown', { key, bubbles: true, cancelable: true, ...modifiers })
      );
    });
  },
};

const interactionResults = [];

for (const item of INTERACTIONS) {
  problems.length = 0;
  await React.act?.(async () => {
    window.location.hash = `/${item.route}`;
    window.dispatchEvent(new window.HashChangeEvent('hashchange'));
  });
  await new Promise((r) => setTimeout(r, 80));

  const failures = [];
  const assert = (condition, message) => {
    if (!condition) failures.push(message);
  };

  try {
    await item.run({ ...helpers, assert });
  } catch (error) {
    failures.push(`THREW: ${error.message}`);
  }

  interactionResults.push({ ...item, failures, warnings: [...new Set(problems)] });
}

/* -------------------------------------------------------------- report */

let failed = 0;
console.log('\n  Route                          Nodes  Status');
console.log('  ' + '─'.repeat(64));

for (const result of results) {
  const ok = result.problems.length === 0 && result.nodes > 50;
  if (!ok) failed += 1;
  const label = result.id.padEnd(28).slice(0, 28);
  console.log(`  ${label}  ${String(result.nodes).padStart(5)}  ${ok ? 'ok' : 'FAIL'}`);
  if (!ok) {
    if (result.nodes <= 50) console.log(`      ⚠ rendered only ${result.nodes} nodes — page may be blank`);
    for (const problem of [...new Set(result.problems)].slice(0, 6)) {
      console.log(`      ✗ ${problem.split('\n')[0].slice(0, 220)}`);
    }
  }
}

console.log(`\n  ${results.length - failed}/${results.length} routes clean`);

console.log('\n  Accessibility behaviour');
console.log('  ' + '─'.repeat(64));
let behaviourFailed = 0;
for (const result of interactionResults) {
  const ok = result.failures.length === 0;
  if (!ok) behaviourFailed += 1;
  console.log(`  ${ok ? '✓' : '✗'} ${result.name}`);
  for (const failure of result.failures) console.log(`      ${failure}`);
}
console.log('');

if (failed > 0 || behaviourFailed > 0) process.exitCode = 1;

rmSync(outfile, { force: true });
