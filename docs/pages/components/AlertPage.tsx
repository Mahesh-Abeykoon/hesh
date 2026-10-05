import { useState } from 'react';
import { Alert, Button } from '../../../src/index';
import { Callout, PropsTable, Showcase } from '../../components/Showcase';
import { DocPage, Section } from '../../components/DocPage';

const ALERT_DEMO = `<Alert tone="info" title="Scheduled Maintenance">
  Read replicas will undergo scheduled database upgrades at 02:00 UTC.
</Alert>

<Alert tone="success" title="Deployment Successful">
  Version 4.2.0 is live in production.
</Alert>

<Alert tone="warning" title="Approaching Limit">
  You have utilized 85% of your allocated monthly bandwidth.
</Alert>

<Alert tone="danger" title="Payment Failed" onDismiss={() => alert('Dismissed')}>
  Unable to charge card ending in 4242. Update your payment details.
</Alert>`;

export function AlertPage() {
  const [showDismissible, setShowDismissible] = useState(true);

  return (
    <DocPage
      eyebrow="Components"
      title="Alert"
      lede="Displays a prominent, persistent message to capture attention or communicate meaningful feedback."
      importStatement="import { Alert } from 'hesh';"
    >
      <Section
        title="Tones & Variants"
        description="Alert provides four semantic tones for various severity levels: info, success, warning, and danger."
      >
        <Showcase code={ALERT_DEMO} defaultOpen width="md">
          <div className="stack">
            <Alert tone="info" title="Scheduled Maintenance">
              Read replicas will undergo scheduled database upgrades at 02:00 UTC.
            </Alert>
            <Alert tone="success" title="Deployment Successful">
              Version 4.2.0 is live in production across all edge regions.
            </Alert>
            <Alert tone="warning" title="Approaching Limit">
              You have utilized 85% of your allocated monthly bandwidth.
            </Alert>
            {showDismissible ? (
              <Alert
                tone="danger"
                title="Payment Failed"
                onDismiss={() => setShowDismissible(false)}
              >
                Unable to charge card ending in 4242. Update your payment details to avoid disruption.
              </Alert>
            ) : (
              <Button size="sm" variant="secondary" onClick={() => setShowDismissible(true)}>
                Reset dismissible alert
              </Button>
            )}
            <Alert tone="info">
              Body text only alert without an explicit title.
            </Alert>
          </div>
        </Showcase>
      </Section>

      <Section title="Accessibility">
        <Callout tone="warning" title="Polite vs Assertive Live Regions">
          Danger and warning alerts use <code>role="alert"</code>, which interrupts whatever the screen reader is announcing immediately. Use them sparingly. Info and success alerts use <code>role="status"</code> with polite announcements.
        </Callout>
      </Section>

      <Section title="API Reference">
        <PropsTable
          rows={[
            { name: 'tone', type: "'info' | 'success' | 'warning' | 'danger'", default: "'info'", description: 'Visual appearance and semantic ARIA live region level.' },
            { name: 'title', type: 'ReactNode', description: 'Bold header text displayed above the alert body.' },
            { name: 'onDismiss', type: '() => void', description: 'Callback that renders an accessible dismiss button when provided.' },
            { name: 'children', type: 'ReactNode', description: 'Body content of the alert.' },
          ]}
        />
      </Section>
    </DocPage>
  );
}
