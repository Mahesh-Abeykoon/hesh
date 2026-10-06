import { useState } from 'react';
import { NumberInput } from '../../../src/index';
import { Callout, PropsTable, Showcase } from '../../components/Showcase';
import { DocPage, Section } from '../../components/DocPage';
import { NumberInputWorkbench } from '../../components/PropsWorkbench';

const NUMBER_INPUT_DEMO = `const [count, setCount] = useState<number | undefined>(10);

<NumberInput
  value={count}
  onChange={setCount}
  min={0}
  max={100}
  step={1}
  prefix="$"
  suffix="USD"
/>`;

export function NumberInputPage() {
  const [val1, setVal1] = useState<number | undefined>(25);
  const [val2, setVal2] = useState<number | undefined>(4.5);
  const [val3, setVal3] = useState<number | undefined>(1);

  return (
    <DocPage
      eyebrow="Components"
      title="NumberInput"
      lede="Precision numeric input with increment/decrement steppers, keyboard arrow acceleration, prefix/suffix units, and clamping."
      importStatement="import { NumberInput } from 'hesh';"
    >
      {/* ── Interactive Props Workbench ── */}
      <Section
        title="Interactive Props Workbench"
        description="Configure stepper button layouts, numeric ranges, prefixes, suffixes, and sizes with real-time code generation."
      >
        <NumberInputWorkbench />
      </Section>

      <Section
        title="Interactive Number Stepper"
        description="Try clicking steppers or pressing Arrow Up / Down. Hold Shift while pressing arrow keys for 10x step multiplier."
      >
        <Showcase code={NUMBER_INPUT_DEMO} defaultOpen width="md">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%', maxWidth: '320px' }}>
            <div>
              <label style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--pui-fg)', display: 'block', marginBottom: '0.375rem' }}>
                Budget Amount (Min $0, Max $500)
              </label>
              <NumberInput
                value={val1}
                onChange={setVal1}
                min={0}
                max={500}
                step={5}
                prefix="$"
                suffix="USD"
              />
              <span className="cell-sub">Current numeric value: {val1 ?? 'empty'}</span>
            </div>

            <div>
              <label style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--pui-fg)', display: 'block', marginBottom: '0.375rem' }}>
                Floating Point Rating (Step 0.1, Precision 1)
              </label>
              <NumberInput
                value={val2}
                onChange={setVal2}
                min={0}
                max={5}
                step={0.1}
                precision={1}
                suffix="/ 5.0"
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--pui-fg)', display: 'block', marginBottom: '0.375rem' }}>
                Split Steppers (- and + on sides)
              </label>
              <NumberInput
                value={val3}
                onChange={setVal3}
                min={1}
                max={20}
                stepperPosition="split"
                suffix="items"
              />
            </div>
          </div>
        </Showcase>
      </Section>

      <Callout tone="info" title="Press & Hold Autorepeat">
        Holding mouse click on either stepper button automatically triggers continuous stepping with accelerated interval.
      </Callout>

      <Section title="Props Reference">
        <PropsTable
          items={[
            { name: 'value', type: 'number', description: 'Current numeric value (controlled).' },
            { name: 'defaultValue', type: 'number', description: 'Initial default value (uncontrolled).' },
            { name: 'onChange', type: '(val: number | undefined) => void', description: 'Callback on value change.' },
            { name: 'min', type: 'number', description: 'Lower clamp bound.' },
            { name: 'max', type: 'number', description: 'Upper clamp bound.' },
            { name: 'step', type: 'number', default: '1', description: 'Increment/decrement interval.' },
            { name: 'precision', type: 'number', description: 'Number of decimal places to round to.' },
            { name: 'stepperPosition', type: "'right' | 'split'", default: "'right'", description: 'Stepper placement: stacked right or split left/right.' },
            { name: 'prefix', type: 'ReactNode', description: 'Leading decorative adornment (e.g. $).' },
            { name: 'suffix', type: 'ReactNode', description: 'Trailing decorative unit (e.g. px, kg).' },
            { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Input height and font sizing.' },
          ]}
        />
      </Section>
    </DocPage>
  );
}
