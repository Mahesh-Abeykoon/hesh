import { useState } from 'react';
import { Slider, RangeSlider } from '../../../src/index';
import { Callout, PropsTable, Showcase } from '../../components/Showcase';
import { DocPage, Section } from '../../components/DocPage';
import { SliderWorkbench } from '../../components/PropsWorkbench';

const SLIDER_DEMO = `const [volume, setVolume] = useState(65);

<Slider
  label="Volume"
  value={volume}
  onValueChange={setVolume}
  min={0}
  max={100}
  step={1}
  showTooltip
/>`;

const RANGE_DEMO = `const [price, setPrice] = useState<[number, number]>([20, 180]);

<RangeSlider
  label="Price Range"
  value={price}
  onValueChange={setPrice}
  min={0}
  max={300}
  step={5}
  showTooltip
/>
<p>
  ${'{'}price[0]{'}'} – ${'{'}price[1]{'}'}
</p>`;

const MARKS_DEMO = `<Slider
  label="Storage Plan"
  defaultValue={2}
  min={0}
  max={4}
  step={1}
  marks={[
    { value: 0, label: '1 GB' },
    { value: 1, label: '5 GB' },
    { value: 2, label: '10 GB' },
    { value: 3, label: '50 GB' },
    { value: 4, label: '100 GB' },
  ]}
/>`;

const SIZES_DEMO = `<Slider label="Small"  size="sm" defaultValue={40} />
<Slider label="Medium" size="md" defaultValue={60} />
<Slider label="Large"  size="lg" defaultValue={80} />`;

export function SliderPage() {
  const [volume, setVolume] = useState(65);
  const [price, setPrice] = useState<[number, number]>([20, 180]);

  return (
    <DocPage
      eyebrow="Components"
      title="Slider"
      lede="Single and dual-thumb range controls for selecting numeric values along a horizontal track — with optional ticks, marks, and live tooltips."
      importStatement={`import { Slider, RangeSlider } from 'hesh-ui';`}
    >
      {/* ── Interactive Props Workbench ── */}
      <Section
        title="Interactive Props Workbench"
        description="Inspect and adjust slider sizes, live tooltips, tick marks, and disabled states with real-time code generation."
      >
        <SliderWorkbench />
      </Section>

      {/* ── Basic Slider ── */}
      <Section
        title="Single Slider"
        description="Fluid mouse and touch drag with full keyboard support (arrows, Home, End, PageUp/Down). showTooltip surfaces the live value above the thumb."
        code={SLIDER_DEMO}
      >
        <Showcase code={SLIDER_DEMO} defaultOpen width="md">
          <div style={{ width: '100%', maxWidth: 480 }}>
            <Slider
              label="Volume"
              value={volume}
              onValueChange={setVolume}
              min={0}
              max={100}
              step={1}
              showTooltip
            />
            <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--pui-fg-subtle)' }}>
              Current value: <strong>{volume}%</strong>
            </p>
          </div>
        </Showcase>
      </Section>

      {/* ── Range Slider ── */}
      <Section
        title="Range Slider (Dual Thumb)"
        description="RangeSlider exposes two thumbs for selecting a min–max window. Perfect for price filters, date ranges, or bounded selections."
        code={RANGE_DEMO}
      >
        <Showcase code={RANGE_DEMO} width="md">
          <div style={{ width: '100%', maxWidth: 480 }}>
            <RangeSlider
              label="Price Range"
              value={price}
              onValueChange={setPrice}
              min={0}
              max={300}
              step={5}
              showTooltip
            />
            <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--pui-fg-subtle)' }}>
              ${price[0]} – ${price[1]}
            </p>
          </div>
        </Showcase>
      </Section>

      {/* ── Marks / Ticks ── */}
      <Section
        title="Step Marks & Tick Labels"
        description="Pass a marks array to render tick dots with optional labels beneath the track — ideal for discrete plan selectors."
        code={MARKS_DEMO}
      >
        <Showcase code={MARKS_DEMO} width="md">
          <div style={{ width: '100%', maxWidth: 480, paddingBottom: '1.5rem' }}>
            <Slider
              label="Storage Plan"
              defaultValue={2}
              min={0}
              max={4}
              step={1}
              marks={[
                { value: 0, label: '1 GB' },
                { value: 1, label: '5 GB' },
                { value: 2, label: '10 GB' },
                { value: 3, label: '50 GB' },
                { value: 4, label: '100 GB' },
              ]}
            />
          </div>
        </Showcase>
      </Section>

      {/* ── Sizes ── */}
      <Section
        title="Size Variants"
        description="Three track heights — sm, md (default), lg — to match surrounding UI density."
        code={SIZES_DEMO}
      >
        <Showcase code={SIZES_DEMO} width="md">
          <div style={{ width: '100%', maxWidth: 480, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <Slider label="Small" size="sm" defaultValue={40} />
            <Slider label="Medium" size="md" defaultValue={60} />
            <Slider label="Large" size="lg" defaultValue={80} />
          </div>
        </Showcase>
      </Section>

      {/* ── Disabled ── */}
      <Section
        title="Disabled"
        description="The disabled prop locks the thumb in place and mutes all visual interaction."
        code={`<Slider label="Locked threshold" defaultValue={30} disabled />`}
      >
        <Showcase code={`<Slider label="Locked threshold" defaultValue={30} disabled />`} width="md">
          <div style={{ width: '100%', maxWidth: 480 }}>
            <Slider label="Locked threshold" defaultValue={30} disabled />
          </div>
        </Showcase>
      </Section>

      <Callout type="tip" title="Accessible native range">
        Both Slider and RangeSlider are built on native{' '}<code>{'<input type="range">'}</code>{' '}
        so screen readers natively announce value changes and all OS keyboard conventions operate
        with zero extra overhead.
      </Callout>

      <Section title="Slider API Reference">
        <PropsTable
          rows={[
            { name: 'label', type: 'ReactNode', description: 'Visible label above the slider.' },
            { name: 'value', type: 'number', description: 'Controlled value.' },
            { name: 'defaultValue', type: 'number', description: 'Initial value for uncontrolled usage.' },
            { name: 'onValueChange', type: '(val: number) => void', description: 'Callback fired on value changes.' },
            { name: 'min', type: 'number', default: '0', description: 'Minimum allowed value.' },
            { name: 'max', type: 'number', default: '100', description: 'Maximum allowed value.' },
            { name: 'step', type: 'number', default: '1', description: 'Granularity of value steps.' },
            { name: 'size', type: '"sm" | "md" | "lg"', default: '"md"', description: 'Track height scale.' },
            { name: 'showTooltip', type: 'boolean', default: 'false', description: 'Shows live value tooltip above the thumb.' },
            { name: 'marks', type: 'SliderMark[]', description: 'Array of { value, label? } objects for tick marks.' },
            { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables slider interaction.' },
          ]}
        />
      </Section>

      <Section title="RangeSlider API Reference">
        <PropsTable
          rows={[
            { name: 'value', type: '[number, number]', description: 'Controlled [min, max] tuple.' },
            { name: 'defaultValue', type: '[number, number]', description: 'Initial [min, max] for uncontrolled usage.' },
            { name: 'onValueChange', type: '(val: [number, number]) => void', description: 'Callback fired when either thumb moves.' },
            { name: 'min', type: 'number', default: '0', description: 'Minimum bound.' },
            { name: 'max', type: 'number', default: '100', description: 'Maximum bound.' },
            { name: 'step', type: 'number', default: '1', description: 'Granularity.' },
            { name: 'showTooltip', type: 'boolean', default: 'false', description: 'Shows value tooltips above both thumbs.' },
            { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables both thumbs.' },
          ]}

        />
      </Section>
    </DocPage>
  );
}
