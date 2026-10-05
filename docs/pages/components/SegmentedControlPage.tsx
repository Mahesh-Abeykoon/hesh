import { useState } from 'react';
import { SegmentedControl } from '../../../src/index';
import { Callout, PropsTable, Showcase } from '../../components/Showcase';
import { DocPage, Section } from '../../components/DocPage';

const DEMO = `const [view, setView] = useState('month');

<SegmentedControl
  value={view}
  onChange={setView}
  options={[
    { value: 'day', label: 'Day' },
    { value: 'week', label: 'Week' },
    { value: 'month', label: 'Month' },
    { value: 'year', label: 'Year' },
  ]}
/>`;

export function SegmentedControlPage() {
  const [view, setView] = useState('month');
  const [density, setDensity] = useState('default');
  const [device, setDevice] = useState('desktop');

  return (
    <DocPage
      eyebrow="Components"
      title="SegmentedControl"
      lede="A linear switcher for mutually exclusive options featuring a smooth animated sliding background pill and keyboard roving focus."
      importStatement="import { SegmentedControl } from 'hesh';"
    >
      <Section
        title="Sliding Segmented Switcher"
        description="Click or use keyboard arrow keys. The background indicator animates smoothly to highlight the active choice."
      >
        <Showcase code={DEMO} defaultOpen width="md">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', alignItems: 'center', padding: '1rem 0', width: '100%', boxSizing: 'border-box' }}>
            <SegmentedControl
              value={view}
              onChange={setView}
              options={[
                { value: 'day', label: 'Day' },
                { value: 'week', label: 'Week' },
                { value: 'month', label: 'Month' },
                { value: 'year', label: 'Year' },
              ]}
            />
            <div style={{ fontSize: '0.8125rem', color: 'var(--pui-fg-muted)' }}>
              Selected interval: <strong>{view}</strong>
            </div>
          </div>
        </Showcase>
      </Section>

      <Section
        title="Full Width and Sizes"
        description="Expand across 100% of parent width, or choose from small, medium, and large sizes."
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: '28rem', boxSizing: 'border-box' }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--pui-fg-muted)', marginBottom: '0.375rem' }}>
              Full Width
            </div>
            <SegmentedControl
              fullWidth
              value={device}
              onChange={setDevice}
              options={[
                { value: 'mobile', label: 'Mobile' },
                { value: 'tablet', label: 'Tablet' },
                { value: 'desktop', label: 'Desktop' },
              ]}
            />
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--pui-fg-muted)', marginBottom: '0.375rem' }}>
              Compact Size
            </div>
            <SegmentedControl
              size="sm"
              value={density}
              onChange={setDensity}
              options={[
                { value: 'compact', label: 'Compact' },
                { value: 'default', label: 'Default' },
                { value: 'comfortable', label: 'Comfortable' },
              ]}
            />
          </div>
        </div>
      </Section>

      <Section title="API Reference">
        <PropsTable
          rows={[
            { name: 'options', type: 'readonly SegmentedControlOption[]', description: 'Array of segment options with value and label.' },
            { name: 'value', type: 'string', description: 'Controlled selected value.' },
            { name: 'onChange', type: '(val: string) => void', description: 'Callback fired on selection.' },
            { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Sizing scale.' },
            { name: 'fullWidth', type: 'boolean', default: 'false', description: 'Expands across 100% of parent container.' },
            { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables entire control.' },
          ]}
        />
      </Section>
    </DocPage>
  );
}
