/**
 * CLI Integration Test Suite
 *
 * Verifies that the Hesh UI CLI correctly initializes projects,
 * resolves transitive dependencies, rewrites import paths according to tsconfig aliases,
 * and writes clean component files.
 */

import { execSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const root = resolve(__dirname, '..');
const testDir = resolve(root, 'tests', 'cli-runner-test');

console.log('🧪 Starting Hesh UI CLI integration tests...\n');

// 1. Scaffold clean fixture
if (existsSync(testDir)) rmSync(testDir, { recursive: true, force: true });
mkdirSync(testDir, { recursive: true });

writeFileSync(
  resolve(testDir, 'package.json'),
  JSON.stringify({ name: 'cli-test-fixture', type: 'module' }, null, 2),
  'utf8'
);

writeFileSync(
  resolve(testDir, 'tsconfig.json'),
  JSON.stringify(
    {
      compilerOptions: {
        baseUrl: '.',
        paths: {
          '@/*': ['./src/*'],
        },
      },
    },
    null,
    2
  ),
  'utf8'
);

mkdirSync(resolve(testDir, 'src', 'app'), { recursive: true });
writeFileSync(resolve(testDir, 'src', 'app', 'globals.css'), '/* root css */', 'utf8');

const cliBin = resolve(root, 'bin', 'hesh.js');

try {
  // Test 1: init
  console.log('• Testing `init` command...');
  execSync(`node "${cliBin}" init`, { cwd: testDir, stdio: 'pipe' });

  const heshJsonPath = resolve(testDir, 'hesh.json');
  if (!existsSync(heshJsonPath)) throw new Error('hesh.json was not created');
  const heshConfig = JSON.parse(readFileSync(heshJsonPath, 'utf8'));
  if (heshConfig.aliases.components !== '@/components/ui') {
    throw new Error(`Unexpected components alias: ${heshConfig.aliases.components}`);
  }

  const utilsPath = resolve(testDir, 'src', 'lib', 'utils.ts');
  if (!existsSync(utilsPath)) throw new Error('src/lib/utils.ts was not created');

  const globalsCss = readFileSync(resolve(testDir, 'src', 'app', 'globals.css'), 'utf8');
  if (!globalsCss.includes("import 'hesh-ui/styles.css'")) {
    throw new Error('Global CSS did not receive hesh-ui/styles.css import');
  }
  console.log('  ✔ `init` created hesh.json, utils.ts, and configured stylesheet');

  // Test 2: add button (single component + primitives)
  console.log('• Testing `add button` command...');
  execSync(`node "${cliBin}" add button`, { cwd: testDir, stdio: 'pipe' });

  const buttonPath = resolve(testDir, 'src', 'components', 'ui', 'Button.tsx');
  if (!existsSync(buttonPath)) throw new Error('Button.tsx was not created');

  const slotPath = resolve(testDir, 'src', 'components', 'ui', 'primitives', 'Slot.tsx');
  if (!existsSync(slotPath)) throw new Error('Slot.tsx primitive was not created');

  const buttonContent = readFileSync(buttonPath, 'utf8');
  if (!buttonContent.includes("from '@/lib/utils'")) {
    throw new Error(`Button.tsx import was not rewritten to @/lib/utils:\n${buttonContent.slice(0, 200)}`);
  }
  if (!buttonContent.includes("from '@/components/ui/primitives/Slot'")) {
    throw new Error(`Button.tsx import was not rewritten to @/components/ui/primitives/Slot:\n${buttonContent.slice(0, 200)}`);
  }
  console.log('  ✔ `add button` correctly scaffolded Button.tsx, Slot.tsx with rewritten aliases');

  // Test 3: add complex component with deep dependency resolution (date-picker)
  console.log('• Testing `add date-picker` with transitive dependencies...');
  execSync(`node "${cliBin}" add date-picker`, { cwd: testDir, stdio: 'pipe' });

  const datePickerPath = resolve(testDir, 'src', 'components', 'ui', 'DatePicker.tsx');
  const calendarPath = resolve(testDir, 'src', 'components', 'ui', 'Calendar.tsx');
  const popoverPath = resolve(testDir, 'src', 'components', 'ui', 'Popover.tsx');
  const iconsPath = resolve(testDir, 'src', 'components', 'ui', 'icons.tsx');
  const controllableHook = resolve(testDir, 'src', 'hooks', 'useControllableState.ts');
  const scrollLockHook = resolve(testDir, 'src', 'hooks', 'useScrollLock.ts');

  if (!existsSync(datePickerPath)) throw new Error('DatePicker.tsx not created');
  if (!existsSync(calendarPath)) throw new Error('Calendar.tsx dependency not created');
  if (!existsSync(popoverPath)) throw new Error('Popover.tsx dependency not created');
  if (!existsSync(iconsPath)) throw new Error('icons.tsx dependency not created');
  if (!existsSync(controllableHook)) throw new Error('useControllableState.ts hook not created');
  if (!existsSync(scrollLockHook)) throw new Error('useScrollLock.ts hook not created');

  const datePickerContent = readFileSync(datePickerPath, 'utf8');
  if (!datePickerContent.includes("from '@/components/ui/Calendar'")) {
    throw new Error('DatePicker import was not rewritten for Calendar');
  }
  if (!datePickerContent.includes("from '@/hooks/useControllableState'")) {
    throw new Error('DatePicker import was not rewritten for useControllableState');
  }
  console.log('  ✔ `add date-picker` resolved all 6 transitive dependencies cleanly');

  // Test 4: list command
  console.log('• Testing `list` command...');
  const listOut = execSync(`node "${cliBin}" list`, { cwd: testDir, encoding: 'utf8' });
  if (!listOut.includes('Available Components & Primitives (75 total)')) {
    throw new Error('list command did not report 75 total items');
  }
  console.log('  ✔ `list` output formatted and indexed all 75 items');

  console.log('\n🎉 ALL CLI TESTS PASSED! 100% functional.\n');
} finally {
  rmSync(testDir, { recursive: true, force: true });
}
