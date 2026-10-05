import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardMedia,
  Badge,
  Button,
  Separator,
  Stat,
  Sparkline,
  SparklesIcon,
  CheckIcon,
  ArrowRightIcon,
} from '../../../src/index';
import { Callout, PropsTable, Showcase } from '../../components/Showcase';
import { DocPage, Section } from '../../components/DocPage';

const MEDIA_CARD_CODE = `<Card style={{ maxWidth: '340px' }}>
  <CardMedia
    aspectRatio="16/9"
    style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #ec4899 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
  >
    <div style={{ color: '#fff', fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <SparklesIcon size={24} /> Design System 2.0
    </div>
  </CardMedia>
  <CardHeader
    title="Fluid Typography Engine"
    description="Engineered for responsive CSS clamp tokens across all devices."
    action={<Badge tone="primary" pill>Featured</Badge>}
  />
  <CardBody>
    <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--pui-fg-muted)', lineHeight: 1.5 }}>
      Eliminates jagged layout shifts with dynamic scale curves and accessible line-height adjustments.
    </p>
  </CardBody>
  <CardFooter>
    <Button variant="primary" size="sm" rightIcon={<ArrowRightIcon size={14} />}>
      Explore Spec
    </Button>
    <Button variant="ghost" size="sm">Preview</Button>
  </CardFooter>
</Card>`;

const PRICING_CARD_CODE = `<Card elevation="elevated" padded style={{ maxWidth: '320px', border: '2px solid var(--pui-primary)' }}>
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
    <span style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--pui-fg)' }}>Pro Team</span>
    <Badge tone="primary" variant="solid" pill>Most Popular</Badge>
  </div>
  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem', margin: '0.75rem 0 1rem' }}>
    <span style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--pui-fg)' }}>$29</span>
    <span style={{ fontSize: '0.875rem', color: 'var(--pui-fg-muted)' }}>/ seat / month</span>
  </div>
  <Button variant="primary" fullWidth size="md">Start 14-day Free Trial</Button>
  <Separator style={{ margin: '1.25rem 0' }} />
  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.625rem', fontSize: '0.875rem' }}>
    <li><CheckIcon size={14} style={{ color: 'var(--pui-success-500)', marginRight: '0.5rem' }} /> Unlimited projects & branches</li>
    <li><CheckIcon size={14} style={{ color: 'var(--pui-success-500)', marginRight: '0.5rem' }} /> Custom domain SSL certs</li>
    <li><CheckIcon size={14} style={{ color: 'var(--pui-success-500)', marginRight: '0.5rem' }} /> 99.99% Uptime SLA</li>
  </ul>
</Card>`;

export function CardPage() {
  const sparklineData = [12, 18, 14, 22, 19, 28, 24, 32, 29, 38, 45];

  return (
    <DocPage
      eyebrow="Components"
      title="Card"
      lede="Flexible surface container for grouping content, media, KPI metrics, actions, and pricing tiers into cohesive cards."
      importStatement="import { Card, CardHeader, CardBody, CardFooter, CardMedia } from 'hesh';"
    >
      <Section
        title="1. Media Cover Card"
        description="Combines CardMedia with header badges, structured descriptive body, and footer actions."
      >
        <Showcase code={MEDIA_CARD_CODE} defaultOpen width="md">
          <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <Card style={{ maxWidth: '340px', width: '100%' }}>
              <CardMedia
                aspectRatio="16/9"
                style={{
                  background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #ec4899 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <div style={{ color: '#fff', fontSize: '1.125rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <SparklesIcon size={20} /> Design System 2.0
                </div>
              </CardMedia>
              <CardHeader
                title="Fluid Typography Engine"
                description="Engineered for responsive CSS clamp tokens."
                action={<Badge tone="primary" pill>Featured</Badge>}
              />
              <CardBody>
                <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--pui-fg-muted)', lineHeight: 1.5 }}>
                  Eliminates jagged layout shifts with dynamic scale curves and accessible line-height adjustments.
                </p>
              </CardBody>
              <CardFooter>
                <Button variant="primary" size="sm" rightIcon={<ArrowRightIcon size={14} />}>
                  Explore Spec
                </Button>
                <Button variant="ghost" size="sm">Preview</Button>
              </CardFooter>
            </Card>
          </div>
        </Showcase>
      </Section>

      <Section
        title="2. Metric & KPI Stat Cards"
        description="Cards configured with inline Sparklines, percentage delta badges, and real-time counters."
      >
        <Showcase
          code={`<Card padded elevation="default">
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <span className="cell-sub">Monthly Active Users</span>
    <Badge tone="success" dot>+18.4%</Badge>
  </div>
  <div style={{ fontSize: '1.75rem', fontWeight: 700, margin: '0.5rem 0' }}>842,910</div>
  <Sparkline data={[12, 18, 14, 22, 19, 28, 24, 32, 29, 38, 45]} color="var(--pui-primary)" height={36} />
</Card>`}
          width="full"
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', width: '100%' }}>
            <Card padded elevation="default">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="cell-sub">Monthly Active Users</span>
                <Badge tone="success" dot>+18.4%</Badge>
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--pui-fg)', margin: '0.5rem 0' }}>
                842,910
              </div>
              <Sparkline data={sparklineData} color="var(--pui-primary)" height={36} />
            </Card>

            <Card padded elevation="default">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="cell-sub">API Ingestion Latency</span>
                <Badge tone="primary">42ms</Badge>
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--pui-fg)', margin: '0.5rem 0' }}>
                99.98%
              </div>
              <Sparkline data={[45, 42, 40, 39, 41, 38, 37, 36, 35, 34, 33]} color="var(--pui-success-500)" height={36} />
            </Card>

            <Card padded elevation="default">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="cell-sub">Cloud Compute Costs</span>
                <Badge tone="warning">Approaching</Badge>
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--pui-fg)', margin: '0.5rem 0' }}>
                $4,812
              </div>
              <Sparkline data={[20, 24, 28, 30, 35, 39, 44, 48, 52, 58, 62]} color="var(--pui-warning-500)" height={36} />
            </Card>
          </div>
        </Showcase>
      </Section>

      <Section
        title="3. SaaS Pricing Plan Card"
        description="High-converting pricing plan card with popular badge banner, feature checklist, and CTA."
      >
        <Showcase code={PRICING_CARD_CODE} width="md">
          <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <Card elevation="elevated" padded style={{ maxWidth: '340px', width: '100%', border: '2px solid var(--pui-primary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--pui-fg)' }}>Pro Team</span>
                <Badge tone="primary" variant="solid" pill>Most Popular</Badge>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem', margin: '0.75rem 0 1.25rem' }}>
                <span style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--pui-fg)' }}>$29</span>
                <span style={{ fontSize: '0.875rem', color: 'var(--pui-fg-muted)' }}>/ seat / month</span>
              </div>
              <Button variant="primary" fullWidth size="md">Start 14-day Free Trial</Button>
              <Separator style={{ margin: '1.25rem 0' }} />
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.625rem', fontSize: '0.875rem', color: 'var(--pui-fg)' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckIcon size={16} style={{ color: 'var(--pui-success-500)' }} />
                  <span>Unlimited projects & branches</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckIcon size={16} style={{ color: 'var(--pui-success-500)' }} />
                  <span>Custom domain SSL certificates</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckIcon size={16} style={{ color: 'var(--pui-success-500)' }} />
                  <span>Sub-second cold start edge runtime</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckIcon size={16} style={{ color: 'var(--pui-success-500)' }} />
                  <span>99.99% Guaranteed uptime SLA</span>
                </li>
              </ul>
            </Card>
          </div>
        </Showcase>
      </Section>

      <Section
        title="4. Interactive Hover-Lift Cards"
        description="Hover over cards to see smooth elevation translation, border brightening, and clickable behavior."
      >
        <Showcase
          code={`<Card interactive onClick={() => alert('Card clicked')} padded elevation="default">
  <h4>Interactive Card</h4>
  <p>Raises smoothly on pointer hover.</p>
</Card>`}
          width="md"
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', width: '100%' }}>
            <Card interactive padded elevation="default" onClick={() => alert('Clicked Card 1')}>
              <h4 style={{ margin: '0 0 0.375rem 0', color: 'var(--pui-fg)' }}>Documentation</h4>
              <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--pui-fg-muted)' }}>
                Read API specifications and guides.
              </p>
            </Card>
            <Card interactive padded elevation="default" onClick={() => alert('Clicked Card 2')}>
              <h4 style={{ margin: '0 0 0.375rem 0', color: 'var(--pui-fg)' }}>Components</h4>
              <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--pui-fg-muted)' }}>
                Browse over 50 accessible primitives.
              </p>
            </Card>
          </div>
        </Showcase>
      </Section>

      <Callout tone="tip" title="Compound Sub-components">
        Always assemble cards using <code>CardHeader</code>, <code>CardBody</code>, <code>CardFooter</code>, and <code>CardMedia</code> for guaranteed responsive margins across mobile and desktop.
      </Callout>

      <Section title="Props Reference">
        <PropsTable
          items={[
            { name: 'elevation', type: "'flat' | 'default' | 'elevated'", default: "'default'", description: 'Shadow depth style.' },
            { name: 'padded', type: 'boolean', default: 'false', description: 'Apply internal padding automatically.' },
            { name: 'interactive', type: 'boolean', default: 'false', description: 'Enable hover lift and pointer cursor.' },
            { name: 'as', type: "'div' | 'button' | 'article' | 'section'", default: "'div'", description: 'HTML tag rendered.' },
            { name: 'CardMedia.aspectRatio', type: 'string | number', default: "'16/9'", description: 'Aspect ratio container style.' },
            { name: 'CardMedia.src', type: 'string', description: 'Image source URL.' },
          ]}
        />
      </Section>
    </DocPage>
  );
}
