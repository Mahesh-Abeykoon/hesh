import { useState } from 'react';
import { Progress, Button } from '../../../src/index';
import { Callout, PropsTable, Showcase } from '../../components/Showcase';
import { DocPage, Section } from '../../components/DocPage';

const PROGRESS_DEMO = `const [value, setValue] = useState(65);

<Progress value={value} tone={value > 80 ? 'danger' : 'primary'} />

<div className="row-wrap">
  <Button size="sm" onClick={() => setValue(v => Math.max(0, v - 15))}>-15%</Button>
  <Button size="sm" onClick={() => setValue(v => Math.min(100, v + 15))}>+15%</Button>
</div>`;

export function ProgressPage() {
  const [value, setValue] = useState(65);

  return (
    <DocPage
      eyebrow="Components"
      title="Progress"
      lede="Horizontal indicator displaying the completion percentage of a task or volume usage against capacity."
      importStatement="import { Progress } from 'hesh';"
    >
      <Section
        title="Interactive Progress Bar"
        description="Supports numeric values from 0 to 100 with semantic tone transitions."
      >
        <Showcase code={PROGRESS_DEMO} defaultOpen width="md">
          <div className="stack" style={{ gap: '1rem' }}>
            <div className="row-between" style={{ fontSize: '0.875rem', fontWeight: 600 }}>
              <span>Deployment progress</span>
              <span>{value}%</span>
            </div>
            <Progress value={value} tone={value > 80 ? 'danger' : value > 50 ? 'primary' : 'success'} />
            <div className="row-wrap" style={{ gap: '0.5rem' }}>
              <Button size="sm" variant="secondary" onClick={() => setValue((v) => Math.max(0, v - 20))}>
                −20%
              </Button>
              <Button size="sm" variant="secondary" onClick={() => setValue((v) => Math.min(100, v + 20))}>
                +20%
              </Button>
            </div>
          </div>
        </Showcase>
      </Section>

      <Section title="Accessibility">
        <Callout tone="info" title="Accessible Meter">
          Exposes semantic <code>role="progressbar"</code> with <code>aria-valuenow</code>, <code>aria-valuemin="0"</code>, and <code>aria-valuemax="100"</code> so assistive technologies accurately report task progress.
        </Callout>
      </Section>

      <Section title="API Reference">
        <PropsTable
          rows={[
            { name: 'value', type: 'number', required: true, description: 'Current progress percentage (0 - 100).' },
            { name: 'tone', type: "'primary' | 'success' | 'warning' | 'danger'", default: "'primary'", description: 'Color styling of the progress fill.' },
            { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Height thickness of the track.' },
          ]}
        />
      </Section>
    </DocPage>
  );
}
