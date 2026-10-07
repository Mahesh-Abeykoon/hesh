import { useState } from 'react';
import { Alert, Button, ZapIcon } from '../../../src/index';
import { Callout, PropsTable, Showcase } from '../../components/Showcase';
import { DocPage, Section } from '../../components/DocPage';
import { AlertWorkbench } from '../../components/PropsWorkbench';

const SUBTLE_DEMO = `<Alert tone="info" title="Scheduled Maintenance">
  Read replicas will undergo scheduled database upgrades at 02:00 UTC.
</Alert>
<Alert tone="success" title="Deployment Successful">
  Version 4.2.0 is live in production across all edge regions.
</Alert>
<Alert tone="warning" title="Approaching Limit">
  You have utilized 85% of your allocated monthly bandwidth.
</Alert>
<Alert tone="danger" title="Payment Failed">
  Unable to charge card ending in 4242. Update your payment details.
</Alert>`;

const VARIANTS_DEMO = `<!-- Solid Fill -->
<Alert variant="solid" tone="danger" title="System Outage Detected">
  Core API cluster is experiencing elevated latency. Failover routing active.
</Alert>

<!-- Accent Left Stripe -->
<Alert variant="accent" tone="warning" title="SSL Certificate Expiring">
  Your custom domain certificate expires in 3 days. Renew before Friday.
</Alert>

<!-- Outlined Border -->
<Alert variant="outline" tone="info" title="API Deprecation Notice">
  GraphQL endpoint v1 will be turned off on December 31, 2026.
</Alert>

<!-- Glassmorphism -->
<Alert variant="glass" tone="info" title="AI Copilot Activated">
  Contextual embeddings indexed 42 project documentation files.
</Alert>`;

const ACTIONS_DEMO = `<Alert
  tone="warning"
  variant="accent"
  title="Storage Limit Reached"
  action={<Button size="sm" variant="primary">Upgrade to Pro</Button>}
  secondaryAction={<Button size="sm" variant="ghost">Learn More</Button>}
>
  Your team workspace is at 98% capacity. Additional uploads will be queued.
</Alert>`;

const ERROR_LIST_DEMO = `<Alert tone="danger" title="There were 3 errors with your submission">
  <ul style={{ margin: '0.375rem 0 0 1.25rem', padding: 0 }}>
    <li>Password must be at least 8 characters long</li>
    <li>Email address already in use by another workspace member</li>
    <li>Must accept the Master Services Agreement</li>
  </ul>
</Alert>`;

export function AlertPage() {
  const [showDismissible, setShowDismissible] = useState(true);

  return (
    <DocPage
      eyebrow="Components"
      title="Alert"
      lede="Displays prominent, persistent feedback and contextual banners in multiple tones, variants, and action compositions."
      importStatement="import { Alert } from 'hesh';"
    >
      <Section
        title="Interactive Props Workbench"
        description="Configure alert tones, visual finishes, titles, and live test TypeScript code."
      >
        <AlertWorkbench />
      </Section>

      <Section
        title="1. Semantic Tones (Subtle Tint)"
        description="Standard soft-tint alerts designed for non-disruptive feedback across five semantic tones: info, success, warning, danger, and neutral."
      >
        <Showcase code={SUBTLE_DEMO} defaultOpen width="md">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', width: '100%' }}>
            <Alert tone="info" title="Scheduled Maintenance">
              Read replicas will undergo scheduled database upgrades at 02:00 UTC.
            </Alert>
            <Alert tone="success" title="Deployment Successful">
              Version 4.2.0 is live in production across all edge regions.
            </Alert>
            <Alert tone="warning" title="Approaching Limit">
              You have utilized 85% of your allocated monthly bandwidth.
            </Alert>
            <Alert tone="danger" title="Payment Failed">
              Unable to charge card ending in 4242. Update your payment details to avoid disruption.
            </Alert>
            <Alert tone="neutral" title="Workspace Activity">
              Sarah Jenkins merged pull request #284 into main 14 minutes ago.
            </Alert>
          </div>
        </Showcase>
      </Section>

      <Section
        title="2. Visual Styling Variants"
        description="Every alert supports solid, accent left-stripe, outline, and frosted glass appearances."
      >
        <Showcase code={VARIANTS_DEMO} width="md">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', width: '100%' }}>
            <Alert variant="solid" tone="danger" title="Critical Security Event">
              Unusual authentication attempts detected from IP 192.0.2.1.
            </Alert>
            <Alert variant="solid" tone="success" title="Backup Complete">
              Snapshot successfully replicated to 3 geographic data centers.
            </Alert>
            <Alert variant="accent" tone="warning" title="SSL Certificate Expiring">
              Your custom domain certificate expires in 3 days. Renew now to prevent downtime.
            </Alert>
            <Alert variant="accent" tone="info" title="New SDK Released">
              Python and TypeScript SDK v3.0 are now available on package registries.
            </Alert>
            <Alert variant="outline" tone="info" title="API Deprecation Notice">
              GraphQL endpoint v1 will be sunset on December 31. Migrate to v2 REST.
            </Alert>
            <Alert variant="glass" tone="info" title="Glassmorphic Ambient Notice">
              Frosted blur styling for dark mode overlays, modals, and landing pages.
            </Alert>
          </div>
        </Showcase>
      </Section>

      <Section
        title="3. Alerts with Interactive Actions"
        description="Attach primary Call-To-Action buttons and secondary links directly inside the alert."
      >
        <Showcase code={ACTIONS_DEMO} width="md">
          <div style={{ width: '100%' }}>
            <Alert
              tone="warning"
              variant="accent"
              title="Storage Limit Reached"
              action={<Button size="sm" variant="primary">Upgrade to Pro</Button>}
              secondaryAction={<Button size="sm" variant="ghost">Learn More</Button>}
            >
              Your team workspace is at 98% capacity. Additional file uploads will be queued until expanded.
            </Alert>
          </div>
        </Showcase>
      </Section>

      <Section
        title="4. Multi-Line Validation Errors"
        description="Format structured bullet lists inside the alert body for form validation summaries."
      >
        <Showcase code={ERROR_LIST_DEMO} width="md">
          <div style={{ width: '100%' }}>
            <Alert tone="danger" title="There were 3 errors with your submission">
              <ul style={{ margin: '0.375rem 0 0 1.25rem', padding: 0, fontSize: '0.875rem' }}>
                <li>Password must be at least 8 characters long with a special character</li>
                <li>Organization slug is already claimed by another team</li>
                <li>Please agree to the Master Services Agreement</li>
              </ul>
            </Alert>
          </div>
        </Showcase>
      </Section>

      <Section
        title="5. Dismissible & Custom Icons"
        description="Add one-click dismissal buttons or customize icons with any React SVG component."
      >
        <Showcase
          code={`<Alert tone="info" icon={<ZapIcon size={18} />} title="Real-Time Telemetry">
  Live latency metrics and edge health diagnostics are streaming.
</Alert>`}
          width="md"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', width: '100%' }}>
            <Alert
              tone="info"
              icon={<ZapIcon size={18} />}
              title="Real-Time Telemetry Active"
              variant="subtle"
            >
              Live latency metrics and edge health diagnostics are streaming.
            </Alert>

            {showDismissible ? (
              <Alert
                tone="warning"
                title="Dismissible Alert"
                onDismiss={() => setShowDismissible(false)}
              >
                Click the '×' button on the right to dismiss this alert banner.
              </Alert>
            ) : (
              <Button size="sm" variant="subtle" onClick={() => setShowDismissible(true)}>
                Restore dismissed alert
              </Button>
            )}

            <Alert tone="neutral" icon={false} title="Clean Icon-less Callout">
              This alert is rendered with icon={false} for streamlined text notes.
            </Alert>
          </div>
        </Showcase>
      </Section>

      <Callout tone="warning" title="Polite vs Assertive Live Regions">
        Danger and warning alerts use <code>role="alert"</code>, which interrupts whatever the screen reader is announcing immediately. Info, success, and neutral alerts use <code>role="status"</code> with polite announcements.
      </Callout>

      <Section title="Props Reference">
        <PropsTable
          items={[
            { name: 'tone', type: "'info' | 'success' | 'warning' | 'danger' | 'neutral'", default: "'info'", description: 'Semantic color palette and ARIA announcement level.' },
            { name: 'variant', type: "'subtle' | 'solid' | 'outline' | 'accent' | 'glass'", default: "'subtle'", description: 'Visual styling appearance.' },
            { name: 'title', type: 'ReactNode', description: 'Bold header text displayed above the body.' },
            { name: 'icon', type: 'ReactNode | false', description: 'Custom leading icon, or false to omit icon entirely.' },
            { name: 'action', type: 'ReactNode', description: 'Primary action element (e.g. CTA Button).' },
            { name: 'secondaryAction', type: 'ReactNode', description: 'Secondary action element (e.g. Ghost Button).' },
            { name: 'onDismiss', type: '() => void', description: 'Callback that renders an accessible dismiss button when provided.' },
            { name: 'children', type: 'ReactNode', description: 'Body text or content of the alert.' },
          ]}
        />
      </Section>
    </DocPage>
  );
}
