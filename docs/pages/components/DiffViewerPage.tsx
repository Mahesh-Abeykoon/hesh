import { useState } from 'react';
import { DiffViewer, SegmentedControl, Card } from '../../../src/index';
import { Callout, PropsTable, Showcase } from '../../components/Showcase';
import { DocPage, Section } from '../../components/DocPage';

const OLD_CODE = `function calculateTotal(items) {
  let sum = 0;
  for (var i = 0; i < items.length; i++) {
    sum += items[i].price;
  }
  return sum;
}`;

const NEW_CODE = `function calculateTotal(items: CartItem[]): number {
  const taxRate = 0.08;
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  return Number((subtotal * (1 + taxRate)).toFixed(2));
}`;

const DIFF_DEMO = `<DiffViewer
  oldValue={oldCode}
  newValue={newCode}
  mode="unified"
  oldTitle="main (v1.0.0)"
  newTitle="refactor (v1.1.0)"
/>`;

export function DiffViewerPage() {
  const [mode, setMode] = useState<'unified' | 'split'>('unified');

  return (
    <DocPage
      eyebrow="Components"
      title="DiffViewer"
      lede="Git-style text and source code difference visualizer with LCS line diffing, added/deleted line statistics, and unified or split views."
      importStatement="import { DiffViewer } from 'hesh-ui';"
    >
      <Section
        title="Interactive Diff Comparison"
        description="Switch between unified single-column diff and side-by-side split comparison."
      >
        <Showcase code={DIFF_DEMO} defaultOpen width="full">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <SegmentedControl
                value={mode}
                onChange={(val) => setMode(val as 'unified' | 'split')}
                options={[
                  { value: 'unified', label: 'Unified Diff' },
                  { value: 'split', label: 'Split Side-by-Side' },
                ]}
              />
            </div>

            <DiffViewer
              oldValue={OLD_CODE}
              newValue={NEW_CODE}
              mode={mode}
              oldTitle="v1.0.0 (Legacy)"
              newTitle="v1.1.0 (TypeScript Refactor)"
            />
          </div>
        </Showcase>
      </Section>

      <Section title="Component Props">
        <PropsTable
          rows={[
            { name: 'oldValue', type: 'string', required: true, description: 'Original text or code snippet to compare from.' },
            { name: 'newValue', type: 'string', required: true, description: 'Modified text or code snippet to compare to.' },
            { name: 'mode', type: "'unified' | 'split'", default: "'unified'", description: 'Presentation layout mode.' },
            { name: 'oldTitle', type: 'string', default: "'Original'", description: 'Header label for old version.' },
            { name: 'newTitle', type: 'string', default: "'Modified'", description: 'Header label for modified version.' },
            { name: 'hideLineNumbers', type: 'boolean', default: 'false', description: 'Hides line numbers from the gutter.' },
          ]}
        />
      </Section>
    </DocPage>
  );
}
