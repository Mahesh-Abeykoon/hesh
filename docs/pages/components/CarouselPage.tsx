import { Carousel, Badge, Button } from '../../../src/index';
import { Callout, PropsTable, Showcase } from '../../components/Showcase';
import { DocPage, Section } from '../../components/DocPage';
import { CarouselWorkbench } from '../../components/PropsWorkbench';

const HERO_CAROUSEL_DEMO = `<Carousel
  indicatorVariant="bars"
  arrowVariant="floating"
  autoPlay
  interval={4500}
>
  <div className="slide-mesh slide-mesh--primary">
    <Badge tone="primary" dot>Autonomous Cloud</Badge>
    <h3>Next-Gen AI Agents Orchestrator</h3>
    <p>Deploy multi-agent reasoning graphs across 300+ distributed edge nodes.</p>
    <div className="row-wrap">
      <Button size="sm" variant="primary">Deploy Model</Button>
      <Button size="sm" variant="secondary">Documentation</Button>
    </div>
  </div>

  <div className="slide-mesh slide-mesh--emerald">
    <Badge tone="success" dot>Global CDN</Badge>
    <h3>Sub-Millisecond Edge Routing</h3>
    <p>Dynamic packet routing with automatic multi-cloud failover.</p>
    <div className="row-wrap">
      <Button size="sm" variant="primary">View Live Nodes</Button>
      <Button size="sm" variant="secondary">Status Radar</Button>
    </div>
  </div>

  <div className="slide-mesh slide-mesh--violet">
    <Badge tone="info" dot>Enterprise Vault</Badge>
    <h3>Hardware Enclave HSM Keys</h3>
    <p>SOC-2 Type II compliant with zero-knowledge cryptographic rotation.</p>
    <div className="row-wrap">
      <Button size="sm" variant="primary">Security Whitepaper</Button>
      <Button size="sm" variant="secondary">Compliance Audit</Button>
    </div>
  </div>
</Carousel>`;

const NUMBERS_CAROUSEL_DEMO = `<Carousel indicatorVariant="numbers" arrowVariant="outline">
  <div className="p-6 text-center">Slide 1: Overview</div>
  <div className="p-6 text-center">Slide 2: Telemetry</div>
  <div className="p-6 text-center">Slide 3: Audit Trail</div>
</Carousel>`;

export function CarouselPage() {
  return (
    <DocPage
      eyebrow="Components"
      title="Carousel"
      lede="Touch-ready, accessible image and content slider with autoplay, loop, drag gestures, frosted glass navigation arrows, and modern expanding bar indicators."
      importStatement="import { Carousel } from 'hesh';"
    >
      <Section
        title="Interactive Props Workbench"
        description="Switch between modern expanding bars, refined dots, or numeric badges, customize floating frosted arrows, or live edit code."
      >
        <CarouselWorkbench />
      </Section>

      <Section
        title="Modern Hero Showcase with Expanding Bars"
        description="Features touch gestures on mobile, drag-to-swipe on desktop, keyboard arrow navigation, and modern expanding progress bars."
      >
        <Showcase code={HERO_CAROUSEL_DEMO} defaultOpen width="full">
          <div style={{ maxWidth: '44rem', margin: '0 auto', width: '100%' }}>
            <Carousel indicatorVariant="bars" arrowVariant="floating" autoPlay={false} interval={4500}>
              <div
                style={{
                  minHeight: 250,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'linear-gradient(135deg, rgba(37,99,235,0.12), var(--pui-surface))',
                  borderRadius: 'inherit',
                  padding: '2rem 1.5rem',
                  textAlign: 'center',
                  boxSizing: 'border-box',
                }}
              >
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <Badge tone="primary" dot>Autonomous Cloud</Badge>
                  <Badge tone="neutral" pill>v4.2.0</Badge>
                </div>
                <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.375rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
                  Next-Gen AI Agents Orchestrator
                </h3>
                <p style={{ margin: '0 0 1.25rem', color: 'var(--pui-fg-muted)', fontSize: '0.875rem', maxWidth: '28rem', lineHeight: 1.5 }}>
                  Deploy autonomous reasoning models across 300+ distributed edge nodes with zero cold-starts and streaming telemetry.
                </p>
                <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                  <Button size="sm" variant="primary">Deploy Agent Pipeline</Button>
                  <Button size="sm" variant="secondary">Documentation</Button>
                </div>
              </div>

              <div
                style={{
                  minHeight: 250,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'linear-gradient(135deg, rgba(5,150,105,0.12), var(--pui-surface))',
                  borderRadius: 'inherit',
                  padding: '2rem 1.5rem',
                  textAlign: 'center',
                  boxSizing: 'border-box',
                }}
              >
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <Badge tone="success" dot>Global CDN</Badge>
                  <Badge tone="neutral" pill>99.99% Uptime</Badge>
                </div>
                <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.375rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
                  Sub-Millisecond Edge Routing
                </h3>
                <p style={{ margin: '0 0 1.25rem', color: 'var(--pui-fg-muted)', fontSize: '0.875rem', maxWidth: '28rem', lineHeight: 1.5 }}>
                  Route packets around transit congestion dynamically with automated failover and p99 latency guaranteed under 12ms.
                </p>
                <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                  <Button size="sm" variant="primary">View Live Nodes</Button>
                  <Button size="sm" variant="secondary">Status Radar</Button>
                </div>
              </div>

              <div
                style={{
                  minHeight: 250,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'linear-gradient(135deg, rgba(124,58,237,0.12), var(--pui-surface))',
                  borderRadius: 'inherit',
                  padding: '2rem 1.5rem',
                  textAlign: 'center',
                  boxSizing: 'border-box',
                }}
              >
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <Badge tone="info" dot>Enterprise Vault</Badge>
                  <Badge tone="neutral" pill>SOC-2 Type II</Badge>
                </div>
                <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.375rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
                  Hardware-Isolated HSM Enclave Keys
                </h3>
                <p style={{ margin: '0 0 1.25rem', color: 'var(--pui-fg-muted)', fontSize: '0.875rem', maxWidth: '28rem', lineHeight: 1.5 }}>
                  FIPS 140-3 Level 3 hardware security modules with automated zero-knowledge asymmetric key rotation and audit logging.
                </p>
                <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                  <Button size="sm" variant="primary">Security Whitepaper</Button>
                  <Button size="sm" variant="secondary">Compliance Audit</Button>
                </div>
              </div>
            </Carousel>
          </div>
        </Showcase>
      </Section>

      <Section
        title="Compact Slider with Numeric Counter"
        description="Display sleek numeric position badges (e.g. 01 / 03) when screen real-estate is limited."
      >
        <Showcase code={NUMBERS_CAROUSEL_DEMO} width="md">
          <div style={{ maxWidth: '30rem', margin: '0 auto', width: '100%' }}>
            <Carousel indicatorVariant="numbers" arrowVariant="outline">
              <div style={{ padding: '2rem', textAlign: 'center', background: 'var(--pui-surface-subtle)' }}>
                <span className="mono-note">Feature Panel 01</span>
                <h4 style={{ margin: '0.5rem 0' }}>Collaborative Team Workspaces</h4>
                <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--pui-fg-muted)' }}>Invite members with granular RBAC permissions.</p>
              </div>
              <div style={{ padding: '2rem', textAlign: 'center', background: 'var(--pui-surface-subtle)' }}>
                <span className="mono-note">Feature Panel 02</span>
                <h4 style={{ margin: '0.5rem 0' }}>Real-time Audit Trails</h4>
                <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--pui-fg-muted)' }}>Stream events directly to SIEM pipelines.</p>
              </div>
              <div style={{ padding: '2rem', textAlign: 'center', background: 'var(--pui-surface-subtle)' }}>
                <span className="mono-note">Feature Panel 03</span>
                <h4 style={{ margin: '0.5rem 0' }}>Automated Backups</h4>
                <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--pui-fg-muted)' }}>Immutable point-in-time snapshots across edge regions.</p>
              </div>
            </Carousel>
          </div>
        </Showcase>
      </Section>

      <Section title="Accessibility">
        <Callout tone="info" title="Pause on Focus & Hover">
          Adheres to WCAG 2.2 criteria 2.2.2 (Pause, Stop, Hide). The autoplay cycle automatically pauses whenever the user hovers over the carousel with a pointer or moves keyboard focus into any interactive child element.
        </Callout>
      </Section>

      <Section title="API Reference">
        <PropsTable
          rows={[
            { name: 'indicatorVariant', type: "'bars' | 'dots' | 'numbers'", default: "'bars'", description: 'Pagination indicator styling theme.' },
            { name: 'arrowVariant', type: "'floating' | 'solid' | 'outline'", default: "'floating'", description: 'Navigation arrow button visual style.' },
            { name: 'autoPlay', type: 'boolean', default: 'false', description: 'Automatically advances slides on an interval.' },
            { name: 'interval', type: 'number', default: '4000', description: 'Duration per slide in milliseconds when autoplay is on.' },
            { name: 'loop', type: 'boolean', default: 'true', description: 'Infinite looping across ends.' },
            { name: 'showArrows', type: 'boolean', default: 'true', description: 'Show next and previous navigation arrows.' },
            { name: 'showDots', type: 'boolean', default: 'true', description: 'Show pagination indicators.' },
            { name: 'onSlideChange', type: '(index: number) => void', description: 'Callback fired when active slide changes.' },
          ]}
        />
      </Section>
    </DocPage>
  );
}
