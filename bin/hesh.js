#!/usr/bin/env node

/**
 * Hesh UI CLI
 *
 * Install and own accessible, token-driven React UI components directly
 * in your codebase.
 *
 * Usage:
 *   npx hesh-ui init
 *   npx hesh-ui add <component...>
 *   npx hesh-ui list
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import { resolve, join, dirname, relative, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const cliRoot = resolve(__dirname, '..');

// Terminal color helpers (zero external dependencies)
const isTTY = Boolean(process.stdout.isTTY && !process.env.NO_COLOR);
const c = {
  reset: isTTY ? '\x1b[0m' : '',
  bold: isTTY ? '\x1b[1m' : '',
  dim: isTTY ? '\x1b[2m' : '',
  cyan: isTTY ? '\x1b[36m' : '',
  green: isTTY ? '\x1b[32m' : '',
  yellow: isTTY ? '\x1b[33m' : '',
  red: isTTY ? '\x1b[31m' : '',
  magenta: isTTY ? '\x1b[35m' : '',
};

function banner() {
  console.log(`\n${c.cyan}${c.bold}   _   _           _      _   _ ___ ${c.reset}`);
  console.log(`${c.cyan}${c.bold}  | |_| | ___  ___| |__  | | | |_ _|${c.reset}`);
  console.log(`${c.cyan}${c.bold}  |  _  |/ _ \\/ __| '_ \\ | | | || | ${c.reset}`);
  console.log(`${c.cyan}${c.bold}  | | | |  __/\\__ \\ | | || |_| || | ${c.reset}`);
  console.log(`${c.cyan}${c.bold}  |_| |_|\\___||___/_| |_| \\___/|___|${c.reset}`);
  console.log(`${c.dim}  Own your components. Zero runtime lock-in.${c.reset}\n`);
}

// Load bundled master registry
function loadRegistry() {
  const localRegistryPath = resolve(cliRoot, 'registry', 'registry.json');
  if (existsSync(localRegistryPath)) {
    try {
      return JSON.parse(readFileSync(localRegistryPath, 'utf8'));
    } catch {
      // Fall through
    }
  }

  console.error(`${c.red}✖ Failed to load Hesh UI registry.${c.reset}`);
  process.exit(1);
}

// Config file helper
const CONFIG_FILE = 'hesh.json';

function getProjectConfig(cwd = process.cwd()) {
  const configPath = resolve(cwd, CONFIG_FILE);
  if (existsSync(configPath)) {
    try {
      return JSON.parse(readFileSync(configPath, 'utf8'));
    } catch (e) {
      console.warn(`${c.yellow}⚠ Warning: Could not parse ${CONFIG_FILE}.${c.reset}`);
    }
  }
  return null;
}

// Resolve an alias like '@/components/ui' to its actual filesystem directory path
function resolveAliasToDisk(alias, cwd = process.cwd()) {
  for (const cfgFile of ['tsconfig.json', 'jsconfig.json']) {
    const cfgPath = resolve(cwd, cfgFile);
    if (existsSync(cfgPath)) {
      try {
        const config = JSON.parse(readFileSync(cfgPath, 'utf8'));
        const paths = config.compilerOptions?.paths || {};
        for (const [key, targetList] of Object.entries(paths)) {
          const cleanKey = key.replace(/\*$/, '');
          if (alias.startsWith(cleanKey)) {
            const sub = alias.slice(cleanKey.length);
            const target = Array.isArray(targetList) ? targetList[0] : targetList;
            const cleanTarget = target.replace(/\*$/, '');
            return resolve(cwd, cleanTarget, sub);
          }
        }
      } catch {
        // ignore
      }
    }
  }

  // Fallback: strip leading alias symbol and resolve relative to src/ if present
  const stripped = alias.replace(/^[@~]\//, '');
  const hasSrc = existsSync(resolve(cwd, 'src'));
  if (hasSrc && !stripped.startsWith('src/')) {
    return resolve(cwd, 'src', stripped);
  }
  return resolve(cwd, stripped);
}

// Auto-detect project structure
function detectProject(cwd = process.cwd()) {
  const hasTsConfig = existsSync(resolve(cwd, 'tsconfig.json'));
  const hasJsConfig = existsSync(resolve(cwd, 'jsconfig.json'));
  const isTypeScript = hasTsConfig || !hasJsConfig;

  let hasSrc = existsSync(resolve(cwd, 'src'));
  let hasAppDir = existsSync(resolve(cwd, 'app')) || existsSync(resolve(cwd, 'src', 'app'));

  // Path alias detection
  let aliasPrefix = '@';
  if (hasTsConfig) {
    try {
      const tsconfig = JSON.parse(readFileSync(resolve(cwd, 'tsconfig.json'), 'utf8'));
      const paths = tsconfig.compilerOptions?.paths || {};
      if (paths['~/*']) aliasPrefix = '~';
    } catch {
      // ignore
    }
  }

  return {
    isTypeScript,
    hasAppDir,
    hasSrc,
    aliases: {
      components: `${aliasPrefix}/components/ui`,
      utils: `${aliasPrefix}/lib/utils`,
      hooks: `${aliasPrefix}/hooks`,
      primitives: `${aliasPrefix}/components/ui/primitives`,
    },
  };
}

// Find primary CSS file
function findPrimaryCss(cwd = process.cwd()) {
  const candidates = [
    'app/globals.css',
    'src/app/globals.css',
    'src/globals.css',
    'src/index.css',
    'src/styles.css',
    'src/App.css',
    'styles/globals.css',
  ];

  for (const rel of candidates) {
    const full = resolve(cwd, rel);
    if (existsSync(full)) return full;
  }
  return null;
}

// Rewrite imports/exports inside a component file
function rewriteImports(content, config) {
  const aliases = config.aliases || {};
  const compAlias = aliases.components || '@/components/ui';
  const utilsAlias = aliases.utils || '@/lib/utils';
  const hooksAlias = aliases.hooks || '@/hooks';
  const primAlias = aliases.primitives || `${compAlias}/primitives`;

  let result = content;

  // 1. Utils (../utils/cn -> utils alias)
  result = result.replace(/(?:from\s+)?['"]\.\.\/utils\/cn['"]/g, `from '${utilsAlias}'`);

  // 2. Primitives (../primitives/Slot -> primitives alias)
  result = result.replace(/(?:from\s+)?['"]\.\.\/primitives\/Slot['"]/g, `from '${primAlias}/Slot'`);

  // 3. Icons (./icons -> components alias)
  result = result.replace(/(?:from\s+)?['"]\.\/icons['"]/g, `from '${compAlias}/icons'`);

  // 4. Portal (./Portal -> components alias)
  result = result.replace(/(?:from\s+)?['"]\.\/Portal['"]/g, `from '${compAlias}/Portal'`);

  // 5. Hooks (../hooks/useX -> hooks alias)
  result = result.replace(/(?:from\s+)?['"]\.\.\/hooks\/(use[A-Za-z0-9]+)['"]/g, `from '${hooksAlias}/$1'`);

  // 6. Sibling components (./Component -> components alias)
  result = result.replace(/(?:from\s+)?['"]\.\/([A-Z][A-Za-z0-9]+)['"]/g, `from '${compAlias}/$1'`);

  return result;
}

// Command: init
async function initCommand(options = {}) {
  banner();
  const cwd = process.cwd();
  console.log(`${c.bold}Configuring Hesh UI for your project...${c.reset}\n`);

  const detected = detectProject(cwd);
  let config = getProjectConfig(cwd);

  if (!config) {
    config = {
      $schema: 'https://hesh.dev/schema.json',
      style: 'default',
      typescript: detected.isTypeScript,
      aliases: detected.aliases,
    };

    const configPath = resolve(cwd, CONFIG_FILE);
    writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');
    console.log(`${c.green}✔ Created ${CONFIG_FILE}${c.reset}`);
  } else {
    console.log(`${c.cyan}ℹ Existing ${CONFIG_FILE} found.${c.reset}`);
  }

  // Ensure directories exist
  const utilsDir = resolveAliasToDisk(config.aliases.utils, cwd);
  const componentsDir = resolveAliasToDisk(config.aliases.components, cwd);
  const hooksDir = resolveAliasToDisk(config.aliases.hooks, cwd);

  mkdirSync(dirname(utilsDir), { recursive: true });
  mkdirSync(componentsDir, { recursive: true });
  mkdirSync(hooksDir, { recursive: true });

  // Install lib/utils.ts (cn utility)
  const registry = loadRegistry();
  const cnItem = registry.items['cn'];
  if (cnItem && cnItem.files?.[0]) {
    const utilsFile = `${utilsDir}.${config.typescript ? 'ts' : 'js'}`;
    if (!existsSync(utilsFile) || options.overwrite) {
      writeFileSync(utilsFile, cnItem.files[0].content, 'utf8');
      console.log(`${c.green}✔ Created class utility (${relative(cwd, utilsFile)})${c.reset}`);
    }
  }

  // Check CSS imports
  const cssPath = findPrimaryCss(cwd);
  if (cssPath) {
    const cssContent = readFileSync(cssPath, 'utf8');
    const importStatement = "@import 'hesh-ui/styles.css';";
    if (!cssContent.includes('hesh-ui') && !cssContent.includes('--pui-brand-500')) {
      writeFileSync(cssPath, `${importStatement}\n\n${cssContent}`, 'utf8');
      console.log(`${c.green}✔ Added @import 'hesh-ui/styles.css' to ${relative(cwd, cssPath)}${c.reset}`);
    } else {
      console.log(`${c.cyan}ℹ Stylesheet already configured in ${relative(cwd, cssPath)}${c.reset}`);
    }
  } else {
    console.log(`${c.yellow}ℹ Could not automatically find your global CSS file. Be sure to import 'hesh-ui/styles.css' in your main layout or index file.${c.reset}`);
  }

  console.log(`\n${c.green}${c.bold}✔ Project initialized successfully!${c.reset}`);
  console.log(`\nNext step: Add components to your project:`);
  console.log(`  ${c.cyan}npx hesh-ui add button${c.reset}`);
  console.log(`  ${c.cyan}npx hesh-ui add dialog card calendar${c.reset}\n`);
}

// Command: list
function listCommand() {
  banner();
  const registry = loadRegistry();
  const items = Object.values(registry.items);

  console.log(`${c.bold}Available Components & Primitives (${items.length} total):${c.reset}\n`);

  // Group by category
  const categories = {};
  for (const item of items) {
    const cat = item.category || 'Other';
    if (!categories[cat]) categories[cat] = [];
    categories[cat].push(item);
  }

  for (const [category, catItems] of Object.entries(categories)) {
    console.log(`${c.cyan}${c.bold}■ ${category}${c.reset}`);
    for (const item of catItems) {
      const name = item.name.padEnd(20);
      const desc = item.description ? `${c.dim}${item.description}${c.reset}` : '';
      console.log(`  ${c.bold}${name}${c.reset} ${desc}`);
    }
    console.log('');
  }

  console.log(`Install any component with:`);
  console.log(`  ${c.cyan}npx hesh-ui add <name>${c.reset}  (e.g., npx hesh-ui add button)\n`);
}

// Command: add
async function addCommand(requestedNames = [], options = {}) {
  banner();
  const cwd = process.cwd();
  let config = getProjectConfig(cwd);

  if (!config) {
    console.log(`${c.yellow}ℹ No ${CONFIG_FILE} found. Initializing project first...${c.reset}\n`);
    await initCommand(options);
    config = getProjectConfig(cwd) || detectProject(cwd);
  }

  const registry = loadRegistry();

  if (options.all) {
    requestedNames = Object.keys(registry.items).filter((k) => registry.items[k].type === 'component');
  }

  if (requestedNames.length === 0) {
    console.error(`${c.red}✖ No component specified. Example: npx hesh-ui add button${c.reset}`);
    console.log(`Run ${c.cyan}npx hesh-ui list${c.reset} to see all components.`);
    process.exit(1);
  }

  // Resolve dependencies recursively
  const toInstall = new Set();
  const queue = [...requestedNames];

  while (queue.length > 0) {
    const raw = queue.shift();
    const slug = raw.toLowerCase().replace(/\.tsx?$/, '');
    const item = registry.items[slug];

    if (!item) {
      console.error(`${c.red}✖ Component '${raw}' not found in registry.${c.reset}`);
      console.log(`Run ${c.cyan}npx hesh-ui list${c.reset} to view all available components.`);
      process.exit(1);
    }

    if (!toInstall.has(slug)) {
      toInstall.add(slug);
      for (const dep of item.registryDependencies || []) {
        if (!toInstall.has(dep)) {
          queue.push(dep);
        }
      }
    }
  }

  console.log(`${c.bold}Installing ${toInstall.size} item(s):${c.reset} ${Array.from(toInstall).join(', ')}\n`);

  const aliases = config.aliases || {};
  const baseComponentsDir = resolveAliasToDisk(aliases.components || '@/components/ui', cwd);
  const baseUtilsDir = resolveAliasToDisk(aliases.utils || '@/lib/utils', cwd);
  const baseHooksDir = resolveAliasToDisk(aliases.hooks || '@/hooks', cwd);
  const basePrimDir = resolveAliasToDisk(aliases.primitives || `${aliases.components || '@/components/ui'}/primitives`, cwd);

  mkdirSync(baseComponentsDir, { recursive: true });
  mkdirSync(baseHooksDir, { recursive: true });
  mkdirSync(basePrimDir, { recursive: true });
  mkdirSync(dirname(baseUtilsDir), { recursive: true });

  const writtenFiles = [];

  for (const slug of toInstall) {
    const item = registry.items[slug];
    if (!item || !item.files) continue;

    for (const file of item.files) {
      let destPath;

      if (file.type === 'util') {
        destPath = `${baseUtilsDir}.${config.typescript ? 'ts' : 'js'}`;
      } else if (file.type === 'primitive') {
        destPath = resolve(basePrimDir, file.name);
      } else if (file.type === 'hook') {
        destPath = resolve(baseHooksDir, file.name);
      } else {
        destPath = resolve(baseComponentsDir, file.name);
      }

      mkdirSync(dirname(destPath), { recursive: true });

      const exists = existsSync(destPath);
      if (exists && !options.overwrite) {
        console.log(`  ${c.dim}• ${relative(cwd, destPath)} (already exists, skipping)${c.reset}`);
        continue;
      }

      // Rewrite imports and write file
      const transformed = rewriteImports(file.content, config);
      writeFileSync(destPath, transformed, 'utf8');
      writtenFiles.push(destPath);
      console.log(`  ${c.green}✔ ${item.title || item.name}${c.reset} ${c.dim}→ ${relative(cwd, destPath)}${c.reset}`);
    }
  }

  console.log(`\n${c.green}${c.bold}✔ Installation complete!${c.reset}`);

  // Display usage hint for the primary requested components
  for (const req of requestedNames) {
    const item = registry.items[req.toLowerCase()];
    if (item && item.type === 'component') {
      const compName = item.title || item.name;
      const compImport = `${aliases.components || '@/components/ui'}/${compName}`;
      console.log(`\n${c.bold}Usage:${c.reset}`);
      console.log(`  ${c.cyan}import { ${compName} } from '${compImport}';${c.reset}`);
    }
  }
  console.log('');
}

// Help message
function help() {
  banner();
  console.log(`${c.bold}Usage:${c.reset}`);
  console.log(`  npx hesh-ui <command> [options]\n`);
  console.log(`${c.bold}Commands:${c.reset}`);
  console.log(`  ${c.cyan}init${c.reset}                  Initialize Hesh UI and configuration in your project`);
  console.log(`  ${c.cyan}add <component...>${c.reset}    Add one or more components to your project`);
  console.log(`  ${c.cyan}list${c.reset}                  List all available components and primitives`);
  console.log(`  ${c.cyan}--help, -h${c.reset}            Show help information`);
  console.log(`  ${c.cyan}--version, -v${c.reset}         Show current version\n`);
  console.log(`${c.bold}Options for 'add':${c.reset}`);
  console.log(`  ${c.cyan}-o, --overwrite${c.reset}       Overwrite existing files`);
  console.log(`  ${c.cyan}-y, --yes${c.reset}             Skip prompts and proceed with defaults`);
  console.log(`  ${c.cyan}--all${c.reset}                 Install all components into your project\n`);
  console.log(`${c.bold}Examples:${c.reset}`);
  console.log(`  npx hesh-ui init`);
  console.log(`  npx hesh-ui add button`);
  console.log(`  npx hesh-ui add calendar date-picker`);
  console.log(`  npx hesh-ui add dialog card tabs\n`);
}

// Main CLI entry point
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command || command === '--help' || command === '-h' || command === 'help') {
    help();
    return;
  }

  if (command === '--version' || command === '-v' || command === 'version') {
    const pkg = JSON.parse(readFileSync(resolve(cliRoot, 'package.json'), 'utf8'));
    console.log(`hesh-ui v${pkg.version}`);
    return;
  }

  const options = {
    overwrite: args.includes('-o') || args.includes('--overwrite'),
    yes: args.includes('-y') || args.includes('--yes'),
    all: args.includes('--all'),
  };

  switch (command) {
    case 'init':
      await initCommand(options);
      break;
    case 'list':
    case 'ls':
      listCommand();
      break;
    case 'add': {
      const items = args.slice(1).filter((a) => !a.startsWith('-'));
      await addCommand(items, options);
      break;
    }
    default:
      // Allow shortcut: `npx hesh-ui button` as `npx hesh-ui add button`
      if (!command.startsWith('-')) {
        await addCommand([command, ...args.slice(1).filter((a) => !a.startsWith('-'))], options);
      } else {
        help();
      }
      break;
  }
}

main().catch((err) => {
  console.error(`\n${c.red}✖ An unexpected error occurred:${c.reset}`, err);
  process.exit(1);
});
