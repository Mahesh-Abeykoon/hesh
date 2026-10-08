import { useState } from 'react';
import { Banner, Button } from '../../../src/index';
import { Callout, PropsTable, Showcase } from '../../components/Showcase';
import { DocPage, Section } from '../../components/DocPage';

const DEMO = `<Banner
  tone="primary"
  action={<Button size="sm" variant="secondary">Explore v2.0</Button>}
  dismissible
>
  Hesh UI v2.0 is now live with 45+ enterprise components!
</Banner>`;

export function BannerPage() {
  const [showPromo, setShowPromo] = useState(true);

  return (
    <DocPage
      eyebrow="Components"
      title="Banner"
      lede="Top announcement and status bar for prominent site-wide notifications, promotional campaigns, and service alerts."
      importStatement="import { Banner } from 'hesh-ui';"
    >
      <Section
        title="Announcement Banner"
        description="Highlights announcements with leading icons, call-to-action buttons, and smooth dismiss capability."
      >
        <Showcase code={DEMO} defaultOpen width="full">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%' }}>
            {showPromo ? (
              <Banner
                tone="primary"
                dismissible
                onDismiss={() => setShowPromo(false)}
                action={<Button size="sm" variant="secondary">Explore v2.0</Button>}
              >
                Hesh UI v2.0 is now live with 45+ enterprise components!
              </Banner>
            ) : (
              <Button size="sm" variant="secondary" onClick={() => setShowPromo(true)}>
                Reopen announcement banner
              </Button>
            )}

            <Banner
              tone="promo"
              action={<Button size="sm" variant="secondary">Upgrade</Button>}
            >
              Get 30% off your annual team plan through October 31.
            </Banner>

            <Banner tone="warning" dismissible>
              Scheduled database maintenance on Sunday at 02:00 UTC. Expect brief service blips.
            </Banner>
          </div>
        </Showcase>
      </Section>

      <Section title="Semantic Tones">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <Banner tone="info">New documentation guides have been added to our foundations section.</Banner>
          <Banner tone="success">All systems are currently operational with 99.99% uptime.</Banner>
          <Banner tone="danger">Webhook deliveries are experiencing intermittent latency.</Banner>
        </div>
      </Section>

      <Section title="API Reference">
        <PropsTable
          rows={[
            { name: 'tone', type: "'primary' | 'info' | 'success' | 'warning' | 'danger' | 'promo'", default: "'primary'", description: 'Visual appearance theme.' },
            { name: 'dismissible', type: 'boolean', default: 'false', description: 'Whether the banner includes a close dismiss button.' },
            { name: 'onDismiss', type: '() => void', description: 'Callback fired when dismissed.' },
            { name: 'action', type: 'ReactNode', description: 'Call-to-action element placed on the right side.' },
            { name: 'icon', type: 'ReactNode', description: 'Custom leading icon override.' },
          ]}
        />
      </Section>
    </DocPage>
  );
}
