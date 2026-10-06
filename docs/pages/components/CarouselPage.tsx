import { Carousel, Badge } from '../../../src/index';
import { Callout, PropsTable, Showcase } from '../../components/Showcase';
import { DocPage, Section } from '../../components/DocPage';

const CAROUSEL_DEMO = `<Carousel autoPlay interval={4000}>
  <div className="demo-slide">
    <Badge tone="primary" dot>Next-gen</Badge>
    <h3>Real-time Analytics Engine</h3>
    <p>Stream live operational metrics with sub-millisecond p99 latency.</p>
  </div>

  <div className="demo-slide">
    <Badge tone="success" dot>Enterprise</Badge>
    <h3>Bank-Grade Security</h3>
    <p>SOC-2 Type II compliant with hardware security modules.</p>
  </div>

  <div className="demo-slide">
    <Badge tone="info" dot>Global CDN</Badge>
    <h3>Edge Routing Network</h3>
    <p>Zero cold-starts and automatic geo-routing across 300+ PoPs worldwide.</p>
  </div>
</Carousel>`;

export function CarouselPage() {
  return (
    <DocPage
      eyebrow="Components"
      title="Carousel"
      lede="Touch-ready, accessible image and content slider with autoplay, loop, drag gestures, and keyboard navigation."
      importStatement="import { Carousel } from 'hesh';"
    >
      <Section
        title="Interactive Carousel"
        description="Features touch swiping on mobile, drag-to-swipe on desktop, keyboard arrow keys, autoplay pause on hover, and dot pagination."
      >
        <Showcase code={CAROUSEL_DEMO} defaultOpen width="md">
          <div style={{ maxWidth: '40rem', margin: '0 auto' }}>
            <Carousel autoPlay={false} interval={4000}>
              <div
                style={{
                  height: 220,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'linear-gradient(135deg, var(--pui-primary-subtle), var(--pui-surface))',
                  borderRadius: 'inherit',
                  padding: '1.5rem',
                  textAlign: 'center',
                }}
              >
                <Badge tone="primary" dot>Next-gen</Badge>
                <h3 style={{ margin: '0.75rem 0 0.25rem', fontSize: '1.25rem', fontWeight: 700 }}>Real-time Analytics Engine</h3>
                <p style={{ margin: 0, color: 'var(--pui-fg-muted)', fontSize: '0.875rem', maxWidth: '28rem' }}>
                  Stream live operational metrics with sub-millisecond p99 latency across distributed clusters.
                </p>
              </div>

              <div
                style={{
                  height: 220,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'linear-gradient(135deg, var(--pui-surface-sunken), var(--pui-surface))',
                  borderRadius: 'inherit',
                  padding: '1.5rem',
                  textAlign: 'center',
                }}
              >
                <Badge tone="success" dot>Enterprise</Badge>
                <h3 style={{ margin: '0.75rem 0 0.25rem', fontSize: '1.25rem', fontWeight: 700 }}>Bank-Grade Security</h3>
                <p style={{ margin: 0, color: 'var(--pui-fg-muted)', fontSize: '0.875rem', maxWidth: '28rem' }}>
                  SOC-2 Type II compliant with hardware security modules and automatic key rotation.
                </p>
              </div>

              <div
                style={{
                  height: 220,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'linear-gradient(135deg, var(--pui-primary-subtle), var(--pui-surface-elevated))',
                  borderRadius: 'inherit',
                  padding: '1.5rem',
                  textAlign: 'center',
                }}
              >
                <Badge tone="info" dot>Global CDN</Badge>
                <h3 style={{ margin: '0.75rem 0 0.25rem', fontSize: '1.25rem', fontWeight: 700 }}>Edge Routing Network</h3>
                <p style={{ margin: 0, color: 'var(--pui-fg-muted)', fontSize: '0.875rem', maxWidth: '28rem' }}>
                  Zero cold-starts and automatic geo-routing across 300+ PoPs worldwide.
                </p>
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
            { name: 'autoPlay', type: 'boolean', default: 'false', description: 'Automatically advances slides on an interval.' },
            { name: 'interval', type: 'number', default: '4000', description: 'Duration per slide in milliseconds when autoplay is on.' },
            { name: 'loop', type: 'boolean', default: 'true', description: 'Infinite looping across ends.' },
            { name: 'showArrows', type: 'boolean', default: 'true', description: 'Show next and previous navigation arrows.' },
            { name: 'showDots', type: 'boolean', default: 'true', description: 'Show dot pagination indicators.' },
            { name: 'onSlideChange', type: '(index: number) => void', description: 'Callback fired when active slide changes.' },
          ]}
        />
      </Section>
    </DocPage>
  );
}
