import { JSDOM } from 'jsdom';
import { readFileSync } from 'node:fs';
const html = readFileSync('hesh-docs.html', 'utf8');

// Fail loudly if the single-file build ever stops rendering.
let ok = true;
const errors = [];
const dom = new JSDOM(html, {
  runScripts: 'dangerously',
  pretendToBeVisual: true,
  url: 'http://localhost/',
  virtualConsole: new (await import('jsdom')).VirtualConsole().on('jsdomError', e => errors.push(e.message)).on('error', e => errors.push(String(e))),
});
await new Promise(r => setTimeout(r, 1500));
const root = dom.window.document.getElementById('root');
console.log('root children:', root?.children.length);
console.log('has topbar:', !!dom.window.document.querySelector('.topbar'));
console.log('has sidebar links:', dom.window.document.querySelectorAll('.sidebar__link').length);
console.log('h1 text:', dom.window.document.querySelector('h1')?.textContent);
console.log('injected <style> count:', dom.window.document.querySelectorAll('style').length);
const bg = dom.window.getComputedStyle(dom.window.document.body).backgroundColor;
console.log('body background (token resolved):', bg);
console.log('errors:', errors.slice(0, 5));

const rendered =
  root?.children.length > 0 &&
  !!dom.window.document.querySelector('.topbar') &&
  dom.window.document.querySelectorAll('.sidebar__link').length > 0;

if (!rendered || errors.length > 0) ok = false;
console.log(ok ? '\n  single-file build renders correctly\n' : '\n  single-file build FAILED\n');
process.exit(ok ? 0 : 1);
