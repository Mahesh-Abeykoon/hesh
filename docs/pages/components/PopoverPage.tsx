import { useState } from 'react';
import { Popover, Button, Switch } from '../../../src/index';
import { Callout, PropsTable, Showcase } from '../../components/Showcase';
import { DocPage, Section } from '../../components/DocPage';

const POPOVER_DEMO = `const [open, setOpen] = useState(false);

<Popover
  open={open}
  onOpenChange={setOpen}
  title="Deployment Settings"
  description="Select target cluster parameters"
  trigger={({ ref, ...props }) => (
    <Button variant="secondary" ref={ref} {...props}>
      Deployment Options
    </Button>
  )}
>
  <div className="stack">
    <Switch defaultChecked label="Run database migrations" />
    <Switch label="Notify on failure" />
    <Button size="sm" fullWidth onClick={() => setOpen(false)}>
      Deploy Now
    </Button>
  </div>
</Popover>`;

export function PopoverPage() {
  const [open, setOpen] = useState(false);

  return (
    <DocPage
      eyebrow="Components"
      title="Popover"
      lede="An anchored floating container for displaying rich interactive controls and supplementary content without locking page interaction."
      importStatement="import { Popover } from 'hesh';"
    >
      <Section
        title="Anchored Floating Panel"
        description="Positions cleanly relative to its trigger button with collision detection and click-outside dismissal."
      >
        <Showcase code={POPOVER_DEMO} defaultOpen width="md">
          <Popover
            open={open}
            onOpenChange={setOpen}
            title="Deployment Settings"
            description="Select target cluster parameters"
            trigger={({ ref, ...props }) => (
              <Button variant="secondary" ref={ref as React.Ref<HTMLButtonElement>} {...props}>
                Deployment Options
              </Button>
            )}
          >
            <div className="stack" style={{ gap: '0.75rem' }}>
              <Switch defaultChecked label="Run database migrations" />
              <Switch label="Notify on failure" />
              <Button size="sm" fullWidth onClick={() => setOpen(false)}>
                Deploy Now
              </Button>
            </div>
          </Popover>
        </Showcase>
      </Section>

      <Section title="Accessibility">
        <Callout tone="info" title="Non-modal Overlay">
          Unlike a modal dialog, a popover does not lock background document scrolling or trap focus inside, allowing users to interact with surrounding page content seamlessly.
        </Callout>
      </Section>

      <Section title="API Reference">
        <PropsTable
          rows={[
            { name: 'trigger', type: '(props) => ReactNode', required: true, description: 'Render prop providing anchor ref and accessible ARIA attributes.' },
            { name: 'open', type: 'boolean', description: 'Controlled open state.' },
            { name: 'onOpenChange', type: '(open: boolean) => void', description: 'Callback fired on open/close requests.' },
            { name: 'title', type: 'ReactNode', description: 'Header title text.' },
            { name: 'description', type: 'ReactNode', description: 'Header description text.' },
            { name: 'children', type: 'ReactNode', description: 'Content rendered inside the popover surface.' },
          ]}
        />
      </Section>
    </DocPage>
  );
}
