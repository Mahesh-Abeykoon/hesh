import { Marquee, Badge, ZapIcon } from '../../../src/index';
import { Callout, PropsTable, Showcase } from '../../components/Showcase';
import { DocPage, Section } from '../../components/DocPage';

const MARQUEE_DEMO = `<Marquee speed={20} pauseOnHover fade>
  <div className="partner-card">⚡ Stripe</div>
  <div className="partner-card">🚀 Vercel</div>
  <div className="partner-card">📦 GitHub</div>
  <div className="partner-card">🔥 Supabase</div>
</Marquee>`;

export function MarqueePage() {
  const PARTNERS = [
    { name: 'Stripe', tag: 'Payments' },
    { name: 'Vercel', tag: 'Hosting' },
    { name: 'Linear', tag: 'Issues' },
    { name: 'Supabase', tag: 'Database' },
    { name: 'Resend', tag: 'Emails' },
    { name: 'Cloudflare', tag: 'Edge' },
    { name: 'Datadog', tag: 'Monitoring' },
  ];

  return (
    <DocPage
      eyebrow="Components"
      title="Marquee"
      lede="Smooth infinite looping marquee ticker for client logos, partner showcases, reviews, and announcement banners."
      importStatement="import { Marquee } from 'hesh-ui';"
    >
      <Section
        title="Interactive Logo & Partner Ticker"
        description="Continuously scrolls seamlessly. Hover over any item to pause the animation."
      >
        <Showcase code={MARQUEE_DEMO} defaultOpen width="full">
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <Marquee speed={25} pauseOnHover fade gap="1.5rem">
              {PARTNERS.map((p, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.625rem',
                    padding: '0.625rem 1.25rem',
                    borderRadius: '9999px',
                    border: '1px solid var(--pui-border)',
                    background: 'var(--pui-surface)',
                    boxShadow: 'var(--pui-shadow-sm)',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: 'var(--pui-fg)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <ZapIcon size={16} />
                  <span>{p.name}</span>
                  <Badge tone="neutral">{p.tag}</Badge>
                </div>
              ))}
            </Marquee>

            <Marquee speed={30} direction="right" pauseOnHover fade gap="1.5rem">
              {PARTNERS.slice().reverse().map((p, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.625rem',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    border: '1px solid var(--pui-border)',
                    background: 'var(--pui-surface-subtle)',
                    fontSize: '0.8125rem',
                    color: 'var(--pui-fg-muted)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <span>Customer Review #{i + 1}: Excellent developer ergonomics!</span>
                </div>
              ))}
            </Marquee>
          </div>
        </Showcase>
      </Section>

      <Callout tone="tip" title="Edge Fade Masks">
        With <code>fade={true}</code>, gradient alpha masks are automatically applied to the outer edges so content floats smoothly into view without hard cuts.
      </Callout>

      <Section title="Props Reference">
        <PropsTable
          items={[
            { name: 'direction', type: "'left' | 'right' | 'up' | 'down'", default: "'left'", description: 'Scroll trajectory direction.' },
            { name: 'speed', type: 'number', default: '25', description: 'Duration of one full cycle in seconds.' },
            { name: 'pauseOnHover', type: 'boolean', default: 'true', description: 'Pause animation when pointer hovers over marquee.' },
            { name: 'fade', type: 'boolean', default: 'true', description: 'Apply gradient alpha mask to leading & trailing edges.' },
            { name: 'gap', type: 'string', default: "'2rem'", description: 'Spacing between adjacent elements.' },
            { name: 'repeat', type: 'number', default: '2', description: 'Number of element duplicates rendered for seamless looping.' },
          ]}
        />
      </Section>
    </DocPage>
  );
}
