import { useState } from 'react';
import {
  Avatar,
  AvatarGroup,
  Badge,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Kbd,
  Progress,
  Separator,
  Skeleton,
  Stat,
} from '../../src/index';
import { ArrowRightIcon, PlusIcon } from '../../src/index';
import { Callout, PropsTable, Showcase } from '../components/Showcase';
import { DocPage, Section } from '../components/DocPage';

const CARD = `<Card>
  <CardHeader
    title="Usage this cycle"
    description="Resets on the 1st of each month."
    action={<Badge tone="success" dot>Healthy</Badge>}
  />
  <CardBody>
    <Stat label="API requests" value="2.4M" delta={18.2} />
  </CardBody>
  <CardFooter>
    <Button variant="secondary" size="sm">View report</Button>
  </CardFooter>
</Card>`;

const BADGE = `<Badge tone="neutral">Draft</Badge>
<Badge tone="primary">In review</Badge>
<Badge tone="success">Published</Badge>
<Badge tone="warning">Scheduled</Badge>
<Badge tone="danger">Failed</Badge>
<Badge tone="info">Beta</Badge>
<Badge tone="outline">Archived</Badge>

<Badge tone="success" dot pill>Live</Badge>`;

const AVATAR = `<Avatar name="Ada Lovelace" size="lg" status="online" />
<Avatar name="Grace Hopper" src="/grace.jpg" />
<Avatar name="Alan Turing" square size="xl" />

<AvatarGroup
  people={[{ name: 'Ada Lovelace' }, { name: 'Grace Hopper' }]}
  max={4}
  size="sm"
/>`;

const SKELETON = `<Skeleton variant="circle" width={44} height={44} />
<Skeleton lines={3} />
<Skeleton height={120} />`;

export function SurfacesPage() {
  const [loading, setLoading] = useState(false);

  return (
    <DocPage
      eyebrow="Layout & display"
      title="Card · Badge · Avatar"
      lede="The structural pieces most screens are built from, plus the loading and metric primitives that make a product feel considered."
    >
      <Section title="Card" description="Three elevations and an optional hover-lift for clickable cards.">
        <Showcase code={CARD} defaultOpen>
          <div className="grid-3">
            <Card>
              <CardHeader
                title="Usage this cycle"
                description="Resets on the 1st."
                action={<Badge tone="success" dot>Healthy</Badge>}
              />
              <CardBody>
                <Stat label="API requests" value="2.4M" delta={18.2} size="sm" />
              </CardBody>
              <CardFooter>
                <Button variant="secondary" size="sm" rightIcon={<ArrowRightIcon />}>
                  View report
                </Button>
              </CardFooter>
            </Card>

            <Card elevation="flat" padded>
              <div className="stack">
                <Badge tone="primary">Flat</Badge>
                <Stat label="Errors" value="312" delta={-8.4} size="sm" />
                <Separator />
                <span className="prose">No shadow — sits inside an already-elevated parent.</span>
              </div>
            </Card>

            <Card elevation="elevated" padded>
              <div className="stack">
                <Badge tone="info">Elevated</Badge>
                <Stat label="p95 latency" value="184ms" delta={-3.1} size="sm" />
                <Separator />
                <span className="prose">For content that must separate from the page.</span>
              </div>
            </Card>
          </div>
        </Showcase>
      </Section>

      <Section title="Stat" description="Numeric metrics with tabular figures, so columns of numbers stay aligned as values change.">
        <Showcase>
          <div className="grid-3">
            <Card padded>
              <Stat label="Monthly recurring revenue" value="$48,290" delta={12.4} />
            </Card>
            <Card padded>
              <Stat label="Churn" value="2.1%" delta={-0.4} />
            </Card>
            <Card padded>
              <Stat label="Active seats" value="1,204" delta={0} deltaLabel="No change" />
            </Card>
          </div>
        </Showcase>
      </Section>

      <Section title="Badge" description="Status labels. Tones map to semantic tokens, so a rebrand updates them for free.">
        <Showcase code={BADGE}>
          <div className="row-wrap">
            <Badge tone="neutral">Draft</Badge>
            <Badge tone="primary">In review</Badge>
            <Badge tone="success">Published</Badge>
            <Badge tone="warning">Scheduled</Badge>
            <Badge tone="danger">Failed</Badge>
            <Badge tone="info">Beta</Badge>
            <Badge tone="outline">Archived</Badge>
            <Badge tone="success" dot pill>
              Live
            </Badge>
          </div>
        </Showcase>
        <Callout tone="info" title="Never encode status in colour alone">
          The dot is <code>aria-hidden</code> and the label carries the meaning. A
          user who cannot distinguish red from green still reads "Failed".
        </Callout>
      </Section>

      <Section
        title="Avatar"
        description="Falls back to initials on a deterministic colour derived from the name — the same person always gets the same hue, with no extra state to manage."
      >
        <Showcase code={AVATAR}>
          <div className="stack">
            <div className="row-wrap" style={{ alignItems: 'center' }}>
              <Avatar name="Ada Lovelace" size="xs" />
              <Avatar name="Grace Hopper" size="sm" />
              <Avatar name="Alan Turing" size="md" status="online" />
              <Avatar name="Katherine Johnson" size="lg" status="busy" />
              <Avatar name="Linus Torvalds" size="xl" status="away" />
              <Avatar name="Margaret Hamilton" size="lg" square />
            </div>
            <Separator />
            <div className="row-between">
              <span className="prose">Overlapping group with overflow count:</span>
              <AvatarGroup
                people={[
                  { name: 'Ada Lovelace' },
                  { name: 'Grace Hopper' },
                  { name: 'Alan Turing' },
                  { name: 'Katherine Johnson' },
                  { name: 'Linus Torvalds' },
                  { name: 'Margaret Hamilton' },
                ]}
                max={4}
                size="sm"
              />
            </div>
          </div>
        </Showcase>
      </Section>

      <Section title="Separator" description="Horizontal, vertical, or a labelled rule for dividing form sections.">
        <Showcase
          code={`<Separator />
<Separator label="or" />
<Separator orientation="vertical" style={{ height: 24 }} />`}
          width="md"
        >
          <div className="stack">
            <span className="prose">Above</span>
            <Separator />
            <span className="prose">Below</span>
            <Separator label="or" />
            <div className="row-wrap" style={{ alignItems: 'center' }}>
              <span>Left</span>
              <Separator orientation="vertical" style={{ height: 20, alignSelf: 'auto' }} />
              <span>Right</span>
            </div>
          </div>
        </Showcase>
      </Section>

      <Section
        title="Skeleton"
        description="Match the shape of the content that will replace it. Shimmer is disabled automatically under prefers-reduced-motion."
      >
        <Showcase code={SKELETON} width="md">
          <div className="grid-2">
            <Card padded>
              <div className="stack">
                {loading ? (
                  <>
                    <div className="row-wrap">
                      <Skeleton variant="circle" width={44} height={44} />
                      <div className="stack" style={{ flex: 1, gap: '0.4rem' }}>
                        <Skeleton width="60%" height={14} />
                        <Skeleton width="35%" height={12} />
                      </div>
                    </div>
                    <Skeleton lines={3} />
                  </>
                ) : (
                  <>
                    <div className="row-wrap">
                      <Avatar name="Grace Hopper" size="md" />
                      <div className="stack" style={{ flex: 1, gap: '0.2rem' }}>
                        <strong style={{ fontSize: '0.875rem' }}>Grace Hopper</strong>
                        <span className="prose">grace@compiler.dev</span>
                      </div>
                    </div>
                    <p className="prose">
                      Compiler engineer. Joined 1949. Currently maintaining the
                      standard library and reviewing pull requests.
                    </p>
                  </>
                )}
              </div>
            </Card>
            <Card padded>
              <div className="stack">
                <span className="result-grid__label">Loaded content</span>
                <div className="row-wrap">
                  <Avatar name="Ada Lovelace" size="md" />
                  <div className="stack" style={{ flex: 1, gap: '0.2rem' }}>
                    <strong style={{ fontSize: '0.875rem' }}>Ada Lovelace</strong>
                    <span className="prose">ada@analytical.engine</span>
                  </div>
                </div>
                <p className="prose">
                  Real content occupies the same footprint as the skeleton above, so
                  nothing on the page jumps when data arrives.
                </p>
              </div>
            </Card>
          </div>
          <div style={{ marginTop: '1rem' }}>
            <Button variant="secondary" size="sm" onClick={() => setLoading(!loading)}>
              {loading ? 'Show loaded' : 'Show loading'}
            </Button>
          </div>
        </Showcase>
      </Section>

      <Section title="Progress & Kbd">
        <Showcase
          code={`<Progress value={72} />
<Progress value={38} tone="warning" />
<Progress indeterminate />

Press <Kbd>⌘</Kbd><Kbd>K</Kbd> to search.`}
          width="md"
        >
          <div className="stack">
            <div className="progress-line">
              <span>Default</span>
              <Progress value={72} />
              <span className="progress-line__value">72%</span>
            </div>
            <div className="progress-line">
              <span>Warning</span>
              <Progress value={38} tone="warning" />
              <span className="progress-line__value">38%</span>
            </div>
            <div className="progress-line">
              <span>Danger</span>
              <Progress value={92} tone="danger" />
              <span className="progress-line__value">92%</span>
            </div>
            <div className="progress-line">
              <span>Unknown</span>
              <Progress indeterminate />
              <span className="progress-line__value">—</span>
            </div>
            <Separator />
            <p className="prose">
              Press <Kbd>⌘</Kbd> <Kbd>K</Kbd> to open the command palette, or{' '}
              <Kbd>⇧</Kbd> <Kbd>?</Kbd> for shortcuts.
            </p>
          </div>
        </Showcase>
      </Section>

      <Section title="API">
        <PropsTable
          rows={[
            { name: 'Card.padded', type: 'boolean', default: 'false', description: 'Applies standard internal padding.' },
            { name: 'Card.elevation', type: "'flat' | 'default' | 'elevated'", default: "'default'", description: 'Shadow level. Dark mode relies on borders instead.' },
            { name: 'Card.interactive', type: 'boolean', default: 'false', description: 'Hover lift and pointer cursor.' },
            { name: 'Badge.tone', type: "'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'outline'", default: "'neutral'", description: 'Semantic colour.' },
            { name: 'Badge.dot / pill', type: 'boolean', default: 'false', description: 'Status dot or fully rounded shape.' },
            { name: 'Avatar.name', type: 'string', required: true, description: 'Used for initials and the deterministic colour.' },
            { name: 'Avatar.status', type: "'online' | 'away' | 'busy' | 'offline'", description: 'Presence indicator.' },
            { name: 'Skeleton.lines', type: 'number', description: 'Renders stacked text-width bars.' },
            { name: 'Stat.delta', type: 'number', description: 'Percentage change; sign selects the arrow and colour.' },
            { name: 'Progress.indeterminate', type: 'boolean', default: 'false', description: 'Unknown duration; omits aria-valuenow.' },
          ]}
        />
      </Section>
    </DocPage>
  );
}
