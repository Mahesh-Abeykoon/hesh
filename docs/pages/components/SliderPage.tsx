import { useState } from 'react';
import { Slider } from '../../../src/index';
import { Callout, PropsTable, Showcase } from '../../components/Showcase';
import { DocPage, Section } from '../../components/DocPage';

const SLIDER_DEMO = `const [volume, setVolume] = useState(65);

<Slider
  label="Volume"
  value={volume}
  onValueChange={setVolume}
  min={0}
  max={100}
  step={1}
/>

<Slider label="Disabled slider" defaultValue={30} disabled />`;

export function SliderPage() {
  const [volume, setVolume] = useState(65);

  return (
    <DocPage
      eyebrow="Components"
      title="Slider"
      lede="Input control allowing users to select numeric values or continuous ranges along a horizontal track."
      importStatement="import { Slider } from 'hesh';"
    >
      <Section
        title="Interactive Numeric Slider"
        description="Features fluid mouse and touch drag control with full keyboard arrow and PageUp/PageDown increments."
      >
        <Showcase code={SLIDER_DEMO} defaultOpen width="md">
          <div className="stack" style={{ gap: '1.5rem', maxWidth: '24rem', margin: '0 auto' }}>
            <Slider
              label="Volume level"
              value={volume}
              onValueChange={setVolume}
              min={0}
              max={100}
            />
            <div className="row-between" style={{ fontSize: '0.875rem' }}>
              <span>Current value:</span>
              <strong>{volume}%</strong>
            </div>
            <Slider label="Disabled threshold" defaultValue={30} disabled />
          </div>
        </Showcase>
      </Section>

      <Section title="Accessibility">
        <Callout tone="info" title="Accessible Native Range">
          Built over an accessible native range input so screen readers natively announce value changes and all OS keyboard conventions (arrows, Home, End, PageUp, PageDown) operate with zero extra overhead.
        </Callout>
      </Section>

      <Section title="API Reference">
        <PropsTable
          rows={[
            { name: 'value', type: 'number', description: 'Controlled slider value.' },
            { name: 'defaultValue', type: 'number', description: 'Initial value for uncontrolled usage.' },
            { name: 'onValueChange', type: '(val: number) => void', description: 'Callback fired on value changes.' },
            { name: 'min', type: 'number', default: '0', description: 'Minimum allowed value.' },
            { name: 'max', type: 'number', default: '100', description: 'Maximum allowed value.' },
            { name: 'step', type: 'number', default: '1', description: 'Granularity of value steps.' },
            { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables slider interaction.' },
          ]}
        />
      </Section>
    </DocPage>
  );
}
