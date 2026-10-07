import { useState } from 'react';
import { Progress, Button, Badge } from '../../../src/index';
import { Callout, PropsTable, Showcase } from '../../components/Showcase';
import { DocPage, Section } from '../../components/DocPage';
import { ProgressWorkbench } from '../../components/PropsWorkbench';

const BASIC_DEMO = `const [value, setValue] = useState(68);

<Progress
  value={value}
  label="Database Migration"
  showValue
  tone={value > 85 ? 'success' : value > 40 ? 'primary' : 'warning'}
/>`;

const TONES_DEMO = `<Progress value={45} tone="primary" label="Primary (45%)" showValue />
<Progress value={72} tone="success" label="Success (72%)" showValue />
<Progress value={60} tone="warning" label="Warning (60%)" showValue />
<Progress value={90} tone="danger" label="Danger (90%)" showValue />
<Progress value={84} tone="gradient" label="Vibrant Gradient (84%)" showValue />`;

const MULTI_SEGMENT_DEMO = `// Storage allocation breakdown (out of 100 GB total)
<Progress
  max={100}
  segments={[
    { value: 42, tone: 'primary', label: 'System Volumes' },
    { value: 24, tone: 'success', label: 'Customer DBs' },
    { value: 16, tone: 'warning', label: 'Snapshots' },
    { value: 8,  tone: 'danger',  label: 'Temp Logs' },
  ]}
  size="lg"
/>`;

const STRIPED_DEMO = `<Progress value={65} striped animated tone="primary" label="Uploading Assets..." showValue />`;

export function ProgressPage() {
  const [value, setValue] = useState(68);

  return (
    <DocPage
      eyebrow="Components"
      title="Progress"
      lede="Visual indicators displaying completion percentage, multi-category resource allocation, and indeterminate background task activity."
      importStatement="import { Progress } from 'hesh';"
    >
      <Section
        title="Interactive Props Workbench"
        description="Tune progress percentage, sizes, semantic tones, and preview live TSX code."
      >
        <ProgressWorkbench />
      </Section>

      <Section
        title="Interactive Progress Bar"
        description="Linear track showing current completion with dynamic labels and percentage counters."
      >
        <Showcase code={BASIC_DEMO} defaultOpen width="md">
          <div className="stack" style={{ gap: '1.25rem' }}>
            <Progress
              value={value}
              label="Syncing ElasticSearch Index"
              showValue
              tone={value >= 90 ? 'success' : value >= 50 ? 'primary' : 'warning'}
              size="md"
            />

            <div className="row-wrap" style={{ gap: '0.5rem' }}>
              <Button size="sm" variant="secondary" onClick={() => setValue((v) => Math.max(0, v - 20))}>
                −20%
              </Button>
              <Button size="sm" variant="secondary" onClick={() => setValue((v) => Math.min(100, v + 20))}>
                +20%
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setValue(100)}>
                Complete (100%)
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setValue(0)}>
                Reset (0%)
              </Button>
            </div>
          </div>
        </Showcase>
      </Section>

      <Section
        title="Color Tones & Gradients"
        description="Curated semantic palettes for status thresholds and high-impact hero metrics."
      >
        <Showcase code={TONES_DEMO} width="md">
          <div className="stack" style={{ gap: '1.25rem' }}>
            <Progress value={45} tone="primary" label="Primary (Standard task)" showValue />
            <Progress value={78} tone="success" label="Success (Goal achieved)" showValue />
            <Progress value={62} tone="warning" label="Warning (Elevated load)" showValue />
            <Progress value={94} tone="danger" label="Danger (Quota exceeded)" showValue />
            <Progress value={88} tone="gradient" label="Vibrant Gradient (High engagement)" showValue />
          </div>
        </Showcase>
      </Section>

      <Section
        title="Multi-Segment Allocation"
        description="Represent compound resource breakdowns like disk storage, memory allocation, or budget distributions."
      >
        <Showcase code={MULTI_SEGMENT_DEMO} width="md">
          <div className="stack" style={{ gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 600, fontSize: '0.9375rem' }}>Disk Storage Breakdown (100 GB)</span>
              <span style={{ fontSize: '0.8125rem', color: 'var(--pui-fg-subtle)' }}>90 GB of 100 GB used</span>
            </div>

            <Progress
              max={100}
              size="lg"
              segments={[
                { value: 42, tone: 'primary', label: 'System Files' },
                { value: 24, tone: 'success', label: 'PostgreSQL DB' },
                { value: 16, tone: 'warning', label: 'S3 Snapshots' },
                { value: 8,  tone: 'danger',  label: 'Audit Logs' },
              ]}
            />

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.8125rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--pui-primary)' }} />
                <span>System (42 GB)</span>
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--pui-success)' }} />
                <span>Databases (24 GB)</span>
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--pui-warning)' }} />
                <span>Snapshots (16 GB)</span>
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--pui-danger)' }} />
                <span>Logs (8 GB)</span>
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'var(--pui-fg-subtle)' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--pui-bg-muted)' }} />
                <span>Available (10 GB)</span>
              </span>
            </div>
          </div>
        </Showcase>
      </Section>

      <Section
        title="Striped & Animated Motion"
        description="Add diagonal barber-pole stripes or smooth continuous translation to denote active transfer."
      >
        <Showcase code={STRIPED_DEMO} width="md">
          <div className="stack" style={{ gap: '1.25rem' }}>
            <Progress value={55} striped tone="primary" size="lg" label="Static Striped (55%)" showValue />
            <Progress value={75} striped animated tone="primary" size="lg" label="Live Transfer Stream (75%)" showValue />
          </div>
        </Showcase>
      </Section>

      <Section
        title="Sizes (xs, sm, md, lg, xl)"
        description="Available in five heights from ultra-thin progress lines (xs) to bold dashboard meters (xl)."
      >
        <Showcase code={`<Progress size="xs" | "sm" | "md" | "lg" | "xl" ... />`} width="md">
          <div className="stack" style={{ gap: '1.25rem' }}>
            <Progress value={65} size="xs" label="Extra Small (xs: 4px)" showValue />
            <Progress value={65} size="sm" label="Small (sm: 6px)" showValue />
            <Progress value={65} size="md" label="Medium (md: 8px - default)" showValue />
            <Progress value={65} size="lg" label="Large (lg: 12px)" showValue />
            <Progress value={65} size="xl" label="Extra Large (xl: 16px)" showValue />
          </div>
        </Showcase>
      </Section>

      <Section
        title="Indeterminate Sweeping Bar"
        description="Use when the duration or total byte length is unknown, such as initial database connection establishment."
      >
        <Showcase code={`<Progress indeterminate label="Connecting to cluster..." />`} width="md">
          <Progress indeterminate label="Establishing secure mTLS tunnel..." tone="primary" size="md" />
        </Showcase>
      </Section>

      <Section title="Accessibility">
        <Callout tone="info" title="WAI-ARIA Meter & Progressbar">
          Exposes <code className="pui-code">role=&quot;progressbar&quot;</code> with <code className="pui-code">aria-valuenow</code>, <code className="pui-code">aria-valuemin=&quot;0&quot;</code>, and <code className="pui-code">aria-valuemax=&quot;100&quot;</code>. Screen readers accurately read progress milestones without focus disruption.
        </Callout>
      </Section>

      <Section title="API Reference">
        <PropsTable
          rows={[
            { name: 'value', type: 'number', description: 'Current progress value (default out of 100).' },
            { name: 'max', type: 'number', default: '100', description: 'Maximum scale denominator.' },
            { name: 'tone', type: "'primary' | 'success' | 'warning' | 'danger' | 'info' | 'gradient'", default: "'primary'", description: 'Color styling of the progress fill.' },
            { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'md'", description: 'Height thickness of the track.' },
            { name: 'striped', type: 'boolean', default: 'false', description: 'Enables diagonal textured stripes.' },
            { name: 'animated', type: 'boolean', default: 'false', description: 'Animates stripe translation.' },
            { name: 'showValue', type: 'boolean', default: 'false', description: 'Renders percentage summary text.' },
            { name: 'segments', type: 'ProgressSegment[]', description: 'Array of proportional values with individual tones.' },
            { name: 'indeterminate', type: 'boolean', default: 'false', description: 'Sweeping bar for unknown duration tasks.' },
            { name: 'label', type: 'string', description: 'Title label and accessible name.' },
          ]}
        />
      </Section>
    </DocPage>
  );
}
