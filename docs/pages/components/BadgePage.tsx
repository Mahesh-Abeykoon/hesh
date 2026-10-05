import { Badge } from '../../../src/index';
import { Callout, PropsTable, Showcase } from '../../components/Showcase';
import { DocPage, Section } from '../../components/DocPage';
import { BadgeWorkbench } from '../../components/PropsWorkbench';

const BADGE_DEMO = `<Badge tone="neutral">Draft</Badge>
<Badge tone="primary">In review</Badge>
<Badge tone="success">Published</Badge>
<Badge tone="warning">Scheduled</Badge>
<Badge tone="danger">Failed</Badge>
<Badge tone="info">Beta</Badge>
<Badge tone="outline">Archived</Badge>

<Badge tone="success" dot pill>Live</Badge>
<Badge tone="danger" dot pill>Offline</Badge>`;

export function BadgePage() {
  return (
    <DocPage
      eyebrow="Components"
      title="Badge"
      lede="Small status descriptors, labels, and tags used to categorize items or highlight key metadata."
      importStatement="import { Badge } from 'hesh';"
    >
      <Section
        title="Interactive Workbench"
        description="Experiment with semantic tones, dot indicators, and pill styling in real-time."
      >
        <BadgeWorkbench />
      </Section>

      <Section
        title="Semantic Tones"
        description="Tones map directly to theme tokens, ensuring high-contrast readability across light and dark color schemes."
      >
        <Showcase code={BADGE_DEMO} defaultOpen width="md">
          <div className="row-wrap" style={{ gap: '0.75rem' }}>
            <Badge tone="neutral">Draft</Badge>
            <Badge tone="primary">In review</Badge>
            <Badge tone="success">Published</Badge>
            <Badge tone="warning">Scheduled</Badge>
            <Badge tone="danger">Failed</Badge>
            <Badge tone="info">Beta</Badge>
            <Badge tone="outline">Archived</Badge>
            <Badge tone="success" dot pill>Live</Badge>
            <Badge tone="danger" dot pill>Offline</Badge>
          </div>
        </Showcase>
      </Section>

      <Section title="Accessibility">
        <Callout tone="info" title="Color Independence">
          Never encode vital status using color alone. The dot indicator is marked <code>aria-hidden="true"</code>, while the text label conveys meaning clearly for screen reader users and those with color-vision deficiencies.
        </Callout>
      </Section>

      <Section title="API Reference">
        <PropsTable
          rows={[
            { name: 'tone', type: "'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'outline'", default: "'neutral'", description: 'Semantic color variant.' },
            { name: 'dot', type: 'boolean', default: 'false', description: 'Renders a circular status dot next to the label.' },
            { name: 'pill', type: 'boolean', default: 'false', description: 'Applies full capsule pill border-radius.' },
            { name: 'size', type: "'sm' | 'md'", default: "'md'", description: 'Typography and padding scale.' },
            { name: 'children', type: 'ReactNode', required: true, description: 'Badge label content.' },
          ]}
        />
      </Section>
    </DocPage>
  );
}
