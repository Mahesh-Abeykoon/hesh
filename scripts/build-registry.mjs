/**
 * Hesh UI Registry Builder
 *
 * Scans src/components, src/primitives, src/hooks, and src/utils to build
 * the component registry manifest for the CLI (npx hesh-ui add <component>).
 *
 * Outputs:
 *   - registry/registry.json (Master manifest)
 *   - registry/items/*.json (Individual item manifests for remote CLI fetching)
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from 'node:fs';
import { resolve, dirname, basename, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const root = resolve(__dirname, '..');

const registryDir = resolve(root, 'registry');
const itemsDir = resolve(registryDir, 'items');

mkdirSync(registryDir, { recursive: true });
mkdirSync(itemsDir, { recursive: true });

const pkg = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'));

// Slug normalization helper (e.g., 'DatePicker' -> 'date-picker', 'Button' -> 'button')
function toSlug(name) {
  return name
    .replace(/\.tsx?$/, '')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase();
}

// Category mapping helper
function getCategory(slug, type) {
  if (type === 'util') return 'Utilities';
  if (type === 'primitive') return 'Primitives';
  if (type === 'hook') return 'Hooks';

  const categories = {
    'button': 'Actions & Primitives',
    'icon-button': 'Actions & Primitives',
    'copy-button': 'Actions & Primitives',
    'interactive': 'Actions & Primitives',
    'toggle': 'Actions & Primitives',
    'toggle-group': 'Actions & Primitives',

    'input': 'Forms & Inputs',
    'field': 'Forms & Inputs',
    'textarea': 'Forms & Inputs',
    'select': 'Forms & Inputs',
    'combobox': 'Forms & Inputs',
    'checkbox': 'Forms & Inputs',
    'radio': 'Forms & Inputs',
    'choice': 'Forms & Inputs',
    'switch': 'Forms & Inputs',
    'slider': 'Forms & Inputs',
    'date-picker': 'Forms & Inputs',
    'calendar': 'Forms & Inputs',
    'otp-input': 'Forms & Inputs',
    'password-input': 'Forms & Inputs',
    'number-input': 'Forms & Inputs',
    'tag-input': 'Forms & Inputs',
    'segmented-control': 'Forms & Inputs',
    'color-picker': 'Forms & Inputs',
    'dropzone': 'Forms & Inputs',
    'rating': 'Forms & Inputs',

    'dialog': 'Overlays & Dialogs',
    'drawer': 'Overlays & Dialogs',
    'popover': 'Overlays & Dialogs',
    'tooltip': 'Overlays & Dialogs',
    'hover-card': 'Overlays & Dialogs',
    'menu': 'Overlays & Dialogs',
    'context-menu': 'Overlays & Dialogs',
    'portal': 'Overlays & Dialogs',

    'alert': 'Feedback & Status',
    'toast': 'Feedback & Status',
    'badge': 'Feedback & Status',
    'notification-badge': 'Feedback & Status',
    'progress': 'Feedback & Status',
    'spinner': 'Feedback & Status',
    'skeleton': 'Feedback & Status',
    'empty-state': 'Feedback & Status',
    'feedback': 'Feedback & Status',
    'gauge': 'Feedback & Status',
    'banner': 'Feedback & Status',
    'confetti': 'Feedback & Status',

    'tabs': 'Navigation',
    'breadcrumbs': 'Navigation',
    'navigation': 'Navigation',
    'navigation-menu': 'Navigation',
    'pagination': 'Navigation',
    'bottom-nav': 'Navigation',
    'sidebar-nav': 'Navigation',
    'page-header': 'Navigation',
    'speed-dial': 'Navigation',
    'stepper': 'Navigation',

    'card': 'Data Display & Layout',
    'data-table': 'Data Display & Layout',
    'accordion': 'Data Display & Layout',
    'collapsible': 'Data Display & Layout',
    'timeline': 'Data Display & Layout',
    'carousel': 'Data Display & Layout',
    'charts': 'Data Display & Layout',
    'diff-viewer': 'Data Display & Layout',
    'kanban': 'Data Display & Layout',
    'tree': 'Data Display & Layout',
    'qr-code': 'Data Display & Layout',
    'marquee': 'Data Display & Layout',
    'dock': 'Data Display & Layout',
    'resizable': 'Data Display & Layout',
    'scroll-area': 'Data Display & Layout',
    'separator': 'Data Display & Layout',
    'aspect-ratio': 'Data Display & Layout',
    'avatar': 'Data Display & Layout',
    'code-snippet': 'Data Display & Layout',
    'tour': 'Data Display & Layout',
  };

  return categories[slug] || 'Components';
}

function parseDependencies(content) {
  const registryDeps = new Set();
  const depLines = content.match(/(?:import|export)\s+(?:(?:(?:\w+|\{[^}]+\})\s+from\s+)?['"][^'"]+['"]|['"][^'"]+['"])/g) || [];

  for (const line of depLines) {
    const match = line.match(/from\s+['"]([^'"]+)['"]/);
    if (!match) continue;
    const importPath = match[1];

    if (importPath.includes('/utils/cn') || importPath.endsWith('/cn')) {
      registryDeps.add('cn');
    } else if (importPath.includes('/primitives/Slot') || importPath.endsWith('/Slot')) {
      registryDeps.add('slot');
    } else if (importPath.includes('/icons') || importPath.endsWith('./icons')) {
      registryDeps.add('icons');
    } else if (importPath.includes('/Portal') || importPath.endsWith('./Portal')) {
      registryDeps.add('portal');
    } else if (importPath.includes('/hooks/')) {
      const hookName = importPath.split('/hooks/')[1]?.replace(/\.tsx?$/, '');
      if (hookName) registryDeps.add(toSlug(hookName));
    } else if (importPath.startsWith('./') && !importPath.includes('/icons') && !importPath.includes('/Portal')) {
      const sibling = importPath.replace(/^\.\//, '').replace(/\.tsx?$/, '');
      registryDeps.add(toSlug(sibling));
    }
  }

  return Array.from(registryDeps);
}

const items = {};

// 1. Process Utilities
const utilsDir = resolve(root, 'src/utils');
if (existsSync(utilsDir)) {
  for (const file of readdirSync(utilsDir)) {
    if (!file.endsWith('.ts') && !file.endsWith('.tsx')) continue;
    const name = basename(file, extname(file));
    const slug = toSlug(name);
    const content = readFileSync(resolve(utilsDir, file), 'utf8');

    items[slug] = {
      name: slug,
      title: name,
      type: 'util',
      category: 'Utilities',
      description: slug === 'cn' ? 'Lightweight classnames merger utility' : `Utility helper ${name}`,
      dependencies: [],
      registryDependencies: parseDependencies(content),
      files: [
        {
          name: file,
          target: slug === 'cn' ? 'lib/utils.ts' : `lib/${file}`,
          content,
          type: 'util',
        },
      ],
    };
  }
}

// 2. Process Primitives
const primDir = resolve(root, 'src/primitives');
if (existsSync(primDir)) {
  for (const file of readdirSync(primDir)) {
    if (!file.endsWith('.tsx')) continue;
    const name = basename(file, extname(file));
    const slug = toSlug(name);
    const content = readFileSync(resolve(primDir, file), 'utf8');

    items[slug] = {
      name: slug,
      title: name,
      type: 'primitive',
      category: 'Primitives',
      description: slug === 'slot' ? 'Slot enables asChild composition merging props and refs onto immediate child' : `Primitive ${name}`,
      dependencies: [],
      registryDependencies: parseDependencies(content),
      files: [
        {
          name: file,
          target: `components/ui/primitives/${file}`,
          content,
          type: 'primitive',
        },
      ],
    };
  }
}

// 3. Process Hooks
const hooksDir = resolve(root, 'src/hooks');
if (existsSync(hooksDir)) {
  for (const file of readdirSync(hooksDir)) {
    if (!file.endsWith('.ts') && !file.endsWith('.tsx')) continue;
    const name = basename(file, extname(file));
    const slug = toSlug(name);
    const content = readFileSync(resolve(hooksDir, file), 'utf8');

    items[slug] = {
      name: slug,
      title: name,
      type: 'hook',
      category: 'Hooks',
      description: `Custom React hook ${name}`,
      dependencies: [],
      registryDependencies: parseDependencies(content),
      files: [
        {
          name: file,
          target: `hooks/${file}`,
          content,
          type: 'hook',
        },
      ],
    };
  }
}

// 4. Process Components
const compDir = resolve(root, 'src/components');
if (existsSync(compDir)) {
  for (const file of readdirSync(compDir)) {
    if (!file.endsWith('.tsx')) continue;
    const name = basename(file, extname(file));
    const slug = toSlug(name);
    const content = readFileSync(resolve(compDir, file), 'utf8');

    // Remove self from dependencies
    const deps = parseDependencies(content).filter((d) => d !== slug);

    items[slug] = {
      name: slug,
      title: name,
      type: 'component',
      category: getCategory(slug, 'component'),
      description: `Accessible, token-driven ${name} component`,
      dependencies: [],
      registryDependencies: deps,
      files: [
        {
          name: file,
          target: `components/ui/${file}`,
          content,
          type: 'component',
        },
      ],
    };
  }
}

// Master registry payload
const masterRegistry = {
  $schema: 'https://hesh.dev/schema.json',
  name: 'hesh-ui',
  version: pkg.version,
  description: pkg.description,
  totalItems: Object.keys(items).length,
  items,
};

// Write master registry
writeFileSync(resolve(registryDir, 'registry.json'), JSON.stringify(masterRegistry, null, 2), 'utf8');

// Write individual item files for fast remote fetching
for (const [slug, item] of Object.entries(items)) {
  writeFileSync(resolve(itemsDir, `${slug}.json`), JSON.stringify(item, null, 2), 'utf8');
}

// Copy to dist-docs/registry if dist-docs exists (for public web hosting)
const distDocs = resolve(root, 'dist-docs');
if (existsSync(distDocs)) {
  const distDocsReg = resolve(distDocs, 'registry');
  const distDocsItems = resolve(distDocsReg, 'items');
  mkdirSync(distDocsReg, { recursive: true });
  mkdirSync(distDocsItems, { recursive: true });
  writeFileSync(resolve(distDocsReg, 'registry.json'), JSON.stringify(masterRegistry, null, 2), 'utf8');
  for (const [slug, item] of Object.entries(items)) {
    writeFileSync(resolve(distDocsItems, `${slug}.json`), JSON.stringify(item, null, 2), 'utf8');
  }
}

console.log(`✔ Generated Hesh UI registry: ${Object.keys(items).length} items indexed in registry/registry.json and registry/items/*.json`);
