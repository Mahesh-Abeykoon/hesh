import { useState } from 'react';
import {
  Alert,
  Button,
  Card,
  CardBody,
  EmptyState,
  Progress,
  Spinner,
  ToastProvider,
  useToast,
  type ToastTone,
} from '../../src/index';
import { Callout, PropsTable, Showcase } from '../components/Showcase';
import { DocPage, Section } from '../components/DocPage';

const TOAST_SETUP = `// Wrap your app once
<ToastProvider placement="bottom-right" duration={4500}>
  <App />
</ToastProvider>`;

const TOAST_USE = `const { toast } = useToast();

toast({
  title: 'Deployment started',
  description: 'api-gateway · production',
  tone: 'success',
});

// Keep it open until dismissed
toast({ title: 'Build failed', tone: 'danger', duration: 0 });`;

const ALERT = `<Alert tone="info" title="Heads up">
  Scheduled maintenance starts at 02:00 UTC.
</Alert>

<Alert tone="danger" title="Payment failed" onDismiss={close}>
  Update your card to avoid an interruption in service.
</Alert>`;

const EMPTY = `<EmptyState
  icon={<InboxIcon />}
  title="No deployments yet"
  description="Push a commit or trigger a manual deploy to see it here."
  action={<Button>Deploy now</Button>}
  secondaryAction={<Button variant="ghost">Read the docs</Button>}
/>`;

function ToastDemo() {
  const { toast } = useToast();
  const [value, setValue] = useState(40);

  const tones: ToastTone[] = ['info', 'success', 'warning', 'danger'];

  return (
    <div className="stack">
      <div className="row-wrap">
        {tones.map((tone) => (
          <Button
            key={tone}
            size="sm"
            variant={tone === 'danger' ? 'danger' : 'secondary'}
            onClick={() =>
              toast({
                tone,
                title: `${tone[0]!.toUpperCase()}${tone.slice(1)} notification`,
                description: 'Rendered inside the toast live region.',
              })
            }
          >
            {tone}
          </Button>
        ))}
        <Button
          size="sm"
          variant="outline"
          onClick={() =>
            toast({
              title: 'Stays open',
              description: 'duration={0} means it waits for the user.',
              duration: 0,
            })
          }
        >
          Persistent
        </Button>
      </div>
      <div className="progress-line">
        <span>Progress</span>
        <Progress value={value} tone={value > 80 ? 'danger' : 'primary'} />
        <span className="progress-line__value">{value}%</span>
      </div>
      <div className="row-wrap">
        <Button size="sm" variant="ghost" onClick={() => setValue((prev) => Math.max(0, prev - 20))}>
          −20%
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setValue((prev) => Math.min(100, prev + 20))}>
          +20%
        </Button>
      </div>
    </div>
  );
}

export function FeedbackPage() {
  const [showAlert, setShowAlert] = useState(true);

  return (
    <DocPage
      eyebrow="Overlays"
      title="Alert · Toast · Progress"
      lede="Communicating state. The important design decision here is which messages interrupt a screen reader and which wait their turn."
    >
      <Section title="Alert" description="Inline, persistent messages. Danger and warning tones use role='alert'; info and success use role='status'.">
        <Showcase code={ALERT} defaultOpen width="md">
          <div className="stack">
            <Alert tone="info" title="Scheduled maintenance">
              Read replicas will be unavailable for approximately 10 minutes starting
              at 02:00 UTC.
            </Alert>
            <Alert tone="success" title="Deploy succeeded">
              Version 4.2.0 is live in production.
            </Alert>
            <Alert tone="warning" title="Usage approaching limit">
              You have used 88% of your monthly event quota.
            </Alert>
            {showAlert && (
              <Alert tone="danger" title="Payment failed" onDismiss={() => setShowAlert(false)}>
                We could not charge your card ending 4242. Update your payment
                method to avoid an interruption.
              </Alert>
            )}
            {!showAlert && (
              <Button variant="secondary" size="sm" onClick={() => setShowAlert(true)}>
                Restore the payment alert
              </Button>
            )}
            <Alert tone="info">Message without a title — body text only.</Alert>
          </div>
        </Showcase>
        <Callout tone="warning" title="Do not make everything assertive">
          An <code>role="alert"</code> interrupts whatever the user is listening to.
          Use it for things that need attention now; use <code>role="status"</code>{' '}
          for confirmations that can wait a beat.
        </Callout>
      </Section>

      <Section title="Toast" description="Transient notifications in a fixed region. Mount the provider once near the root of your app.">
        <Showcase code={TOAST_SETUP} />
        <Showcase code={TOAST_USE} defaultOpen>
          <ToastProvider placement="bottom-right">
            <ToastDemo />
          </ToastProvider>
        </Showcase>
        <Callout tone="info" title="Focus is never stolen">
          Toasts appear in a polite live region and never take focus. Actions inside
          a toast are reachable by keyboard, but nothing moves on its own.
        </Callout>
      </Section>

      <Section title="Empty state" description="The first screen a new user sees. Give it a next action, not just an apology.">
        <Showcase code={EMPTY} defaultOpen>
          <EmptyState
            title="No deployments yet"
            description="Push a commit to main, or trigger a manual deploy to see it appear here."
            action={<Button>Deploy now</Button>}
            secondaryAction={<Button variant="ghost">Read the docs</Button>}
          />
        </Showcase>
      </Section>

      <Section title="Spinner">
        <Showcase>
          <div className="row-wrap" style={{ alignItems: 'center' }}>
            <Spinner size="sm" label="Loading small" />
            <Spinner label="Loading medium" />
            <Spinner size="lg" label="Loading large" />
            <span className="prose">
              Each spinner exposes <code>role="status"</code> with an accessible
              label, so announce-on-appearance is a one-liner.
            </span>
          </div>
        </Showcase>
      </Section>

      <Section title="API">
        <PropsTable
          rows={[
            { name: 'Alert.tone', type: "'info' | 'success' | 'warning' | 'danger'", default: "'info'", description: 'Colour and assertiveness. danger/warning interrupt.' },
            { name: 'Alert.onDismiss', type: '() => void', description: 'Renders a dismiss button.' },
            { name: 'EmptyState.action / secondaryAction', type: 'ReactNode', description: 'Primary and secondary next steps.' },
            { name: 'EmptyState.plain', type: 'boolean', default: 'false', description: 'Removes the dashed border for inline use.' },
            { name: 'ToastProvider.placement', type: "'bottom-right' | 'top-right' | 'bottom-left' | 'top-center'", default: "'bottom-right'", description: 'Screen corner.' },
            { name: 'ToastProvider.duration', type: 'number', default: '4500', description: 'Default lifetime in ms. 0 keeps a toast open.' },
            { name: 'ToastProvider.limit', type: 'number', default: '3', description: 'Maximum simultaneous toasts.' },
            { name: 'toast(options)', type: 'ToastOptions', description: 'Returns the toast id, which dismiss(id) accepts.' },
          ]}
        />
      </Section>
    </DocPage>
  );
}
