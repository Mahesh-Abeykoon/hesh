import { useState } from 'react';
import { SegmentedControl, Card } from '../../../src/index';
import { Callout, PropsTable, Showcase } from '../../components/Showcase';
import { DocPage, Section } from '../../components/DocPage';

const BASIC_DEMO = `const [view, setView] = useState('month');

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

const ICONS_DEMO = `const [layout, setLayout] = useState('grid');

<SegmentedControl
  value={layout}
  onChange={setLayout}
  options={[
    {
      value: 'list',
      label: 'List',
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
          <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
        </svg>
      ),
    },
    {
      value: 'grid',
      label: 'Grid',
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
        </svg>
      ),
    },
    {
      value: 'kanban',
      label: 'Kanban',
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="4" y="4" width="4" height="16" /><rect x="10" y="4" width="4" height="12" /><rect x="16" y="4" width="4" height="8" />
        </svg>
      ),
    },
  ]}
/>`;

const SIZES_DEMO = `const [size, setSize] = useState('md');

<SegmentedControl size="sm" ... />
<SegmentedControl size="md" ... />
<SegmentedControl size="lg" ... />`;

export function SegmentedControlPage() {
  const [view, setView] = useState('month');
  const [layout, setLayout] = useState('grid');
  const [device, setDevice] = useState('desktop');
  const [sizeVal, setSizeVal] = useState('production');

  return (
    <DocPage
      eyebrow="Components"
      title="SegmentedControl"
      lede="A linear switcher for mutually exclusive options featuring a smooth animated sliding background pill, full keyboard roving focus, and auto-scrolling mobile viewport clamping."
      importStatement="import { SegmentedControl } from 'hesh';"
    >
      <Section
        title="Sliding Segmented Switcher"
        description="Click or use keyboard arrow keys. The background indicator animates with GPU transforms to highlight the active choice."
      >
        <Showcase code={BASIC_DEMO} defaultOpen width="md">
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
              Selected interval: <strong style={{ color: 'var(--pui-fg)' }}>{view}</strong>
            </div>
          </div>
        </Showcase>
      </Section>

      <Section
        title="With Icons & Layout Switching"
        description="Combine icons with labels for high-recognition controls like view modes, display styles, and theme selectors."
      >
        <Showcase code={ICONS_DEMO} width="md">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', alignItems: 'center', padding: '1rem 0', width: '100%' }}>
            <SegmentedControl
              value={layout}
              onChange={setLayout}
              options={[
                {
                  value: 'list',
                  label: 'List View',
                  icon: (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
                      <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
                    </svg>
                  ),
                },
                {
                  value: 'grid',
                  label: 'Grid View',
                  icon: (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
                      <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
                    </svg>
                  ),
                },
                {
                  value: 'kanban',
                  label: 'Kanban Board',
                  icon: (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="4" y="4" width="4" height="16" /><rect x="10" y="4" width="4" height="12" /><rect x="16" y="4" width="4" height="8" />
                    </svg>
                  ),
                },
              ]}
            />
          </div>
        </Showcase>
      </Section>

      <Section
        title="Full Width Distribution"
        description="Set fullWidth to stretch options equally across the entire container, ideal for mobile bottom sheets and modal tabs."
      >
        <Showcase code={`<SegmentedControl fullWidth ... />`} width="md">
          <div style={{ width: '100%', maxWidth: '32rem' }}>
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
        </Showcase>
      </Section>

      <Section
        title="Sizes (sm, md, lg)"
        description="Available in small (compact filters), medium (standard UI), and large (hero headers)."
      >
        <Showcase code={SIZES_DEMO} width="md">
          <div className="stack" style={{ gap: '1.25rem', width: '100%', maxWidth: '30rem' }}>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--pui-fg-muted)', marginBottom: '0.375rem' }}>SMALL (sm)</div>
              <SegmentedControl
                size="sm"
                value={sizeVal}
                onChange={setSizeVal}
                options={[
                  { value: 'development', label: 'Dev' },
                  { value: 'staging', label: 'Staging' },
                  { value: 'production', label: 'Prod' },
                ]}
              />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--pui-fg-muted)', marginBottom: '0.375rem' }}>MEDIUM (md - Default)</div>
              <SegmentedControl
                size="md"
                value={sizeVal}
                onChange={setSizeVal}
                options={[
                  { value: 'development', label: 'Development' },
                  { value: 'staging', label: 'Staging' },
                  { value: 'production', label: 'Production' },
                ]}
              />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--pui-fg-muted)', marginBottom: '0.375rem' }}>LARGE (lg)</div>
              <SegmentedControl
                size="lg"
                value={sizeVal}
                onChange={setSizeVal}
                options={[
                  { value: 'development', label: 'Development' },
                  { value: 'staging', label: 'Staging' },
                  { value: 'production', label: 'Production' },
                ]}
              />
            </div>
          </div>
        </Showcase>
      </Section>

      <Section title="Accessibility">
        <Callout tone="info" title="Roving Focus & Screen Readers">
          Built following the radio-group pattern with <code className="pui-code">role=&quot;radiogroup&quot;</code> and <code className="pui-code">role=&quot;radio&quot;</code>. Left/Right and Up/Down arrows traverse options, while disabled options are safely skipped.
        </Callout>
      </Section>

      <Section title="API Reference">
        <PropsTable
          rows={[
            { name: 'options', type: 'readonly SegmentedControlOption[]', required: true, description: 'Array of segment options with value, label, optional icon, and disabled.' },
            { name: 'value', type: 'string', description: 'Controlled active value.' },
            { name: 'defaultValue', type: 'string', description: 'Uncontrolled initial value.' },
            { name: 'onChange', type: '(val: string) => void', description: 'Callback fired when an option is selected.' },
            { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Sizing scale.' },
            { name: 'fullWidth', type: 'boolean', default: 'false', description: 'Expands across 100% of parent container.' },
            { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables entire control.' },
          ]}
        />
      </Section>
    </DocPage>
  );
}
