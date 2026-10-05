import { useState } from 'react';
import { Gauge, Button } from '../../../src/index';
import { Callout, PropsTable, Showcase } from '../../components/Showcase';
import { DocPage, Section } from '../../components/DocPage';

const GAUGE_DEMO = `<Gauge
  value={78}
  type="arc"
  tone="primary"
  label="Health Score"
  sublabel="Optimal"
  size={160}
/>`;

export function GaugePage() {
  const [val, setVal] = useState(72);

  return (
    <DocPage
      eyebrow="Components"
      title="Gauge"
      lede="Circular, semicircular, and speedometer arc meters with animated stroke transitions and customizable tone palettes."
      importStatement="import { Gauge } from 'hesh';"
    >
      <Section
        title="Interactive Gauge Meters"
        description="Change values to watch the SVG stroke dashoffset transition smoothly."
      >
        <Showcase code={GAUGE_DEMO} defaultOpen width="full">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem', width: '100%' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: '2.5rem' }}>
              <Gauge
                value={val}
                type="arc"
                tone="primary"
                label="System Load"
                sublabel="Normal range"
                size={160}
              />

              <Gauge
                value={val}
                type="circle"
                tone="success"
                label="Battery"
                sublabel="Charging"
                size={140}
              />

              <Gauge
                value={val}
                type="semicircle"
                tone="warning"
                label="Disk I/O"
                sublabel="Active"
                size={150}
              />

              <Gauge
                value={val}
                type="arc"
                tone="gradient"
                label="Vitals"
                sublabel="Top tier"
                size={160}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <Button size="sm" variant="subtle" onClick={() => setVal(25)}>Low (25%)</Button>
              <Button size="sm" variant="subtle" onClick={() => setVal(55)}>Medium (55%)</Button>
              <Button size="sm" variant="subtle" onClick={() => setVal(88)}>High (88%)</Button>
              <Button size="sm" variant="subtle" onClick={() => setVal(100)}>Max (100%)</Button>
            </div>
          </div>
        </Showcase>
      </Section>

      <Callout tone="info" title="Speedometer vs Full Circle">
        Use <code>type="arc"</code> for automotive/speedometer dashboards (240 degree arc) or <code>type="circle"</code> for compact ring widgets like Apple Watch activity rings.
      </Callout>

      <Section title="Props Reference">
        <PropsTable
          items={[
            { name: 'value', type: 'number', description: 'Current gauge value.' },
            { name: 'min', type: 'number', default: '0', description: 'Minimum scale limit.' },
            { name: 'max', type: 'number', default: '100', description: 'Maximum scale limit.' },
            { name: 'type', type: "'circle' | 'semicircle' | 'arc'", default: "'circle'", description: 'Arc sweep style.' },
            { name: 'tone', type: "'primary' | 'success' | 'warning' | 'danger' | 'gradient'", default: "'primary'", description: 'Color theme or gradient.' },
            { name: 'size', type: 'number', default: '140', description: 'Diameter width in pixels.' },
            { name: 'strokeWidth', type: 'number', default: '12', description: 'Thickness of gauge track and arc.' },
            { name: 'label', type: 'ReactNode', description: 'Center title label.' },
            { name: 'sublabel', type: 'ReactNode', description: 'Secondary caption beneath label.' },
            { name: 'valueFormatter', type: '(val: number) => ReactNode', description: 'Custom center value formatter function.' },
          ]}
        />
      </Section>
    </DocPage>
  );
}
