import { useState } from 'react';
import {
  Badge,
  SparklesIcon,
  CheckIcon,
  LockIcon,
  StarIcon,
  Button,
} from '../../../src/index';
import { Callout, PropsTable, Showcase } from '../../components/Showcase';
import { DocPage, Section } from '../../components/DocPage';
import { BadgeWorkbench } from '../../components/PropsWorkbench';

const TONES_DEMO = `<!-- Subtle Tones -->
<Badge tone="neutral">Neutral</Badge>
<Badge tone="primary">Primary</Badge>
<Badge tone="success">Active</Badge>
<Badge tone="warning">Pending</Badge>
<Badge tone="danger">Blocked</Badge>
<Badge tone="info">Info</Badge>
<Badge tone="outline">Outline</Badge>

<!-- Solid High-Contrast -->
<Badge variant="solid" tone="primary">Solid Primary</Badge>
<Badge variant="solid" tone="success">Verified</Badge>
<Badge variant="solid" tone="danger">Urgent</Badge>`;

const LIVE_DOTS_DEMO = `<!-- Status Dots with Animated Pulse -->
<Badge tone="success" dot pulse pill>Live Server</Badge>
<Badge tone="warning" dot pill>Syncing</Badge>
<Badge tone="danger" dot pulse pill>Degraded</Badge>
<Badge tone="neutral" dot pill>Maintenance</Badge>`;

const REMOVABLE_DEMO = `const [tags, setTags] = useState(['React', 'TypeScript', 'Tailwind', 'Next.js']);

{tags.map((tag) => (
  <Badge
    key={tag}
    tone="primary"
    removable
    onRemove={() => setTags(tags.filter(t => t !== tag))}
  >
    {tag}
  </Badge>
))}`;

export function BadgePage() {
  const [tags, setTags] = useState(['TypeScript', 'Vite', 'Design System', 'Accessibility']);

  return (
    <DocPage
      eyebrow="Components"
      title="Badge"
      lede="Status chips, metadata tags, live indicators, and count badges with solid/subtle variants, pulsing dots, and removable filters."
      importStatement="import { Badge } from 'hesh';"
    >
      <Section
        title="Interactive Workbench"
        description="Experiment with semantic tones, dot indicators, and pill styling in real-time."
      >
        <BadgeWorkbench />
      </Section>

      <Section
        title="1. Semantic Tones & Solid Variants"
        description="Use subtle tint badges for non-intrusive categorization, or solid fill badges for critical high-contrast statuses."
      >
        <Showcase code={TONES_DEMO} defaultOpen width="full">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.625rem', alignItems: 'center' }}>
              <span className="cell-sub" style={{ minWidth: '90px' }}>Subtle:</span>
              <Badge tone="neutral">Neutral</Badge>
              <Badge tone="primary">Primary</Badge>
              <Badge tone="success">Success</Badge>
              <Badge tone="warning">Warning</Badge>
              <Badge tone="danger">Danger</Badge>
              <Badge tone="info">Information</Badge>
              <Badge tone="outline">Outlined</Badge>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.625rem', alignItems: 'center' }}>
              <span className="cell-sub" style={{ minWidth: '90px' }}>Solid:</span>
              <Badge variant="solid" tone="primary">Primary</Badge>
              <Badge variant="solid" tone="success">Verified</Badge>
              <Badge variant="solid" tone="warning">Attention</Badge>
              <Badge variant="solid" tone="danger">High Priority</Badge>
              <Badge variant="solid" tone="neutral">Archived</Badge>
            </div>
          </div>
        </Showcase>
      </Section>

      <Section
        title="2. Live Pulsing Status Dots"
        description="Provide real-time heartbeat feedback for server health, streaming channels, or user presence."
      >
        <Showcase code={LIVE_DOTS_DEMO} width="md">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
            <Badge tone="success" dot pulse pill>
              Production Live
            </Badge>
            <Badge tone="warning" dot pill>
              Sync In Progress
            </Badge>
            <Badge tone="danger" dot pulse pill>
              Incident Reported
            </Badge>
            <Badge tone="neutral" dot pill>
              Offline
            </Badge>
          </div>
        </Showcase>
      </Section>

      <Section
        title="3. Removable Filter Chips"
        description="Equipped with a built-in dismiss button, ideal for active search query tags and selected filters."
      >
        <Showcase code={REMOVABLE_DEMO} width="md">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  tone="primary"
                  removable
                  onRemove={() => setTags(tags.filter((t) => t !== tag))}
                >
                  {tag}
                </Badge>
              ))}
              {tags.length === 0 && (
                <span className="cell-sub">All filter tags removed.</span>
              )}
            </div>
            {tags.length < 4 && (
              <div>
                <Button size="xs" variant="secondary" onClick={() => setTags(['TypeScript', 'Vite', 'Design System', 'Accessibility'])}>
                  Reset filter tags
                </Button>
              </div>
            )}
          </div>
        </Showcase>
      </Section>

      <Section
        title="4. Notification Count & Icon Badges"
        description="Render numeric count indicators with auto-capping at 99+ or decorate with leading glyphs."
      >
        <Showcase
          code={`<Badge count={5} tone="danger" />
<Badge count={142} tone="primary" />
<Badge icon={<SparklesIcon size={12} />} tone="primary">AI Generated</Badge>
<Badge icon={<LockIcon size={12} />} tone="neutral">Encrypted</Badge>`}
          width="md"
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
            <Badge count={3} tone="danger" />
            <Badge count={24} tone="primary" />
            <Badge count={150} tone="warning" />
            <Badge icon={<SparklesIcon size={12} />} tone="primary">
              AI Generated
            </Badge>
            <Badge icon={<CheckIcon size={12} />} tone="success">
              Complete
            </Badge>
            <Badge icon={<LockIcon size={12} />} tone="neutral">
              Private Repo
            </Badge>
            <Badge icon={<StarIcon size={12} />} tone="warning" variant="solid">
              Featured
            </Badge>
          </div>
        </Showcase>
      </Section>

      <Section
        title="5. Size Scale"
        description="Three calibrated size steps for tight inline tables, standard badges, and prominent header labels."
      >
        <Showcase
          code={`<Badge size="sm" tone="primary">Small (sm)</Badge>
<Badge size="md" tone="primary">Medium (md)</Badge>
<Badge size="lg" tone="primary">Large (lg)</Badge>`}
          width="md"
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
            <Badge size="sm" tone="primary">Small (sm)</Badge>
            <Badge size="md" tone="primary">Medium (md)</Badge>
            <Badge size="lg" tone="primary">Large (lg)</Badge>
          </div>
        </Showcase>
      </Section>

      <Callout tone="info" title="Color Independence">
        Never encode vital status using color alone. The dot indicator is marked <code>aria-hidden="true"</code>, while the text label conveys meaning clearly for screen reader users and those with color-vision deficiencies.
      </Callout>

      <Section title="Props Reference">
        <PropsTable
          items={[
            { name: 'tone', type: "'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'outline'", default: "'neutral'", description: 'Semantic color variant.' },
            { name: 'variant', type: "'subtle' | 'solid' | 'outline' | 'glass'", default: "'subtle'", description: 'Visual appearance variant.' },
            { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Typography and padding scale.' },
            { name: 'dot', type: 'boolean', default: 'false', description: 'Renders circular status indicator dot.' },
            { name: 'pulse', type: 'boolean', default: 'false', description: 'Enables animated pulsing glow ring on dot.' },
            { name: 'pill', type: 'boolean', default: 'false', description: 'Capsule rounded border-radius.' },
            { name: 'icon', type: 'ReactNode', description: 'Leading decorative icon.' },
            { name: 'removable', type: 'boolean', default: 'false', description: 'Renders accessible close button.' },
            { name: 'onRemove', type: '() => void', description: 'Callback fired when close button is clicked.' },
            { name: 'count', type: 'number', description: 'Numeric count value (automatically caps at 99+).' },
          ]}
        />
      </Section>
    </DocPage>
  );
}
