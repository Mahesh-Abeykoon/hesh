import { HoverCard, Avatar, Button, Badge } from '../../../src/index';
import { Callout, PropsTable, Showcase } from '../../components/Showcase';
import { DocPage, Section } from '../../components/DocPage';

const DEMO = `<HoverCard
  content={
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <Avatar name="Sarah Connor" size="lg" />
        <div>
          <div style={{ fontWeight: 700 }}>Sarah Connor</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--pui-fg-muted)' }}>@sconnor</div>
        </div>
      </div>
      <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--pui-fg-muted)' }}>
        Staff Systems Architect building distributed cloud runtimes at Cyberdyne.
      </p>
    </div>
  }
>
  <a href="#/hover-card" style={{ fontWeight: 600, color: 'var(--pui-primary)' }}>
    @sconnor
  </a>
</HoverCard>`;

export function HoverCardPage() {
  const profileCard = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%', maxWidth: '18rem', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <Avatar name="Sarah Connor" size="md" status="online" />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--pui-fg)' }}>Sarah Connor</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--pui-fg-muted)' }}>@sconnor · Joined 2021</div>
        </div>
        <Badge tone="primary" pill>Core</Badge>
      </div>

      <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--pui-fg-muted)', lineHeight: 1.5 }}>
        Staff Systems Architect building distributed cloud runtimes and design systems.
      </p>

      <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: 'var(--pui-fg-subtle)' }}>
        <div><strong style={{ color: 'var(--pui-fg)' }}>1.4k</strong> Following</div>
        <div><strong style={{ color: 'var(--pui-fg)' }}>24.8k</strong> Followers</div>
      </div>
    </div>
  );

  return (
    <DocPage
      eyebrow="Components"
      title="HoverCard"
      lede="Displays rich preview cards on hover or keyboard focus, enabling users to glimpse contextual metadata without navigating away."
      importStatement="import { HoverCard } from 'hesh';"
    >
      <Section
        title="Interactive Profile Preview"
        description="Hover over the author link below. Notice how you can effortlessly glide your pointer into the floating preview card."
      >
        <Showcase code={DEMO} defaultOpen width="md">
          <div style={{ padding: 'clamp(1rem, 4vw, 2rem) 0.5rem', textAlign: 'center', width: '100%' }}>
            <span style={{ fontSize: '0.9375rem', color: 'var(--pui-fg-muted)' }}>
              Component crafted with care by{' '}
              <HoverCard content={profileCard} placement="top" align="center">
                <span
                  style={{
                    fontWeight: 700,
                    color: 'var(--pui-primary)',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                  }}
                >
                  @sconnor
                </span>
              </HoverCard>
              {' '}and distributed under MIT license.
            </span>
          </div>
        </Showcase>
      </Section>

      <Section title="API Reference">
        <PropsTable
          rows={[
            { name: 'content', type: 'ReactNode', description: 'Rich content rendered inside the floating card.' },
            { name: 'children', type: 'ReactElement', description: 'Single trigger element that activates the card.' },
            { name: 'placement', type: "'top' | 'bottom' | 'left' | 'right'", default: "'bottom'", description: 'Preferred direction relative to the trigger.' },
            { name: 'align', type: "'start' | 'center' | 'end'", default: "'start'", description: 'Alignment along trigger edge.' },
            { name: 'openDelay', type: 'number', default: '250', description: 'Hover delay before opening (in ms).' },
            { name: 'closeDelay', type: 'number', default: '300', description: 'Grace period before closing (in ms).' },
          ]}
        />
      </Section>
    </DocPage>
  );
}
