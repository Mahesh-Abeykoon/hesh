import { useToast, Button, type ToastTone } from '../../../src/index';
import { Callout, PropsTable, Showcase } from '../../components/Showcase';
import { DocPage, Section } from '../../components/DocPage';

const TOAST_SETUP = `// 1. Mount ToastProvider near your application root
import { ToastProvider } from 'hesh';

function Root() {
  return (
    <ToastProvider placement="bottom-right" duration={4500}>
      <App />
    </ToastProvider>
  );
}`;

const TOAST_USE = `// 2. Trigger toasts with useToast hook
import { useToast } from 'hesh';

function MyComponent() {
  const { toast } = useToast();

  return (
    <Button onClick={() => toast({
      title: 'Deployment queued',
      description: 'Building container image...',
      tone: 'success',
    })}>
      Deploy
    </Button>
  );
}`;

export function ToastPage() {
  const { toast } = useToast();
  const tones: ToastTone[] = ['info', 'success', 'warning', 'danger'];

  return (
    <DocPage
      eyebrow="Components"
      title="Toast"
      lede="Transient feedback notifications that float non-intrusively in screen corners without stealing user focus."
      importStatement="import { useToast, ToastProvider } from 'hesh';"
    >
      <Section
        title="Trigger Toast Notifications"
        description="Click buttons below to trigger live toast messages in the bottom-right viewport."
      >
        <Showcase code={TOAST_USE} defaultOpen width="md">
          <div className="row-wrap" style={{ gap: '0.75rem' }}>
            {tones.map((tone) => (
              <Button
                key={tone}
                size="sm"
                variant={tone === 'danger' ? 'danger' : 'secondary'}
                onClick={() =>
                  toast({
                    tone,
                    title: `${tone[0]!.toUpperCase()}${tone.slice(1)} notification`,
                    description: 'Rendered smoothly into the active toast live region.',
                  })
                }
              >
                {tone} toast
              </Button>
            ))}
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                toast({
                  title: 'Persistent notification',
                  description: 'duration={0} keeps it open until dismissed manually.',
                  duration: 0,
                })
              }
            >
              Persistent toast
            </Button>
          </div>
        </Showcase>
      </Section>

      <Section
        title="Setup & Provider"
        description="Wrap your app once near the root with ToastProvider."
      >
        <Showcase code={TOAST_SETUP} width="md">
          <span className="prose">Mount the provider once; invoke from any descendant component using useToast().</span>
        </Showcase>
      </Section>

      <Section title="Accessibility">
        <Callout tone="info" title="Zero Focus Stealing">
          Toasts mount in polite ARIA live regions and never steal keyboard focus. Actions within toasts are keyboard reachable, but focus remains on the user's active task.
        </Callout>
      </Section>

      <Section title="API Reference">
        <PropsTable
          rows={[
            { name: 'toast({ title, description, tone, duration })', type: 'function', description: 'Triggers a new notification.' },
            { name: 'ToastOptions.tone', type: "'info' | 'success' | 'warning' | 'danger'", default: "'info'", description: 'Semantic status color.' },
            { name: 'ToastOptions.duration', type: 'number', default: '4500', description: 'Auto-dismiss delay in ms. Pass 0 to keep open indefinitely.' },
            { name: 'ToastProvider.placement', type: "'bottom-right' | 'top-right' | 'bottom-left' | 'top-center'", default: "'bottom-right'", description: 'Screen placement corner.' },
            { name: 'ToastProvider.limit', type: 'number', default: '3', description: 'Maximum simultaneous visible toasts.' },
          ]}
        />
      </Section>
    </DocPage>
  );
}
