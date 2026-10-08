import React, { useState } from 'react';
import { Popover, Button, Switch, Input, Badge } from '../../../src/index';
import { Callout, PropsTable, Showcase } from '../../components/Showcase';
import { DocPage, Section } from '../../components/DocPage';

const CONTROLLED_DEMO = `const [open, setOpen] = useState(false);

<Popover
  open={open}
  onOpenChange={setOpen}
  title="Deployment Settings"
  description="Select target cluster parameters"
  arrow
  trigger={({ ref, ...props }) => (
    <Button variant="secondary" ref={ref} {...props}>
      Deployment Options
    </Button>
  )}
>
  <div className="stack" style={{ gap: '0.75rem' }}>
    <Switch defaultChecked label="Run database migrations" />
    <Switch label="Notify on build failure" />
    <Button size="sm" fullWidth onClick={() => setOpen(false)}>
      Deploy Now
    </Button>
  </div>
</Popover>`;

const UNCONTROLLED_DEMO = `<Popover
  title="Quick Filter"
  description="Filter table results by keyword"
  arrow
  trigger={({ ref, ...props }) => (
    <Button variant="outline" ref={ref} {...props}>
      Filter Search
    </Button>
  )}
>
  <div className="stack" style={{ gap: '0.75rem', minWidth: '16rem' }}>
    <Input placeholder="Search records..." size="sm" />
    <div className="row-wrap" style={{ justifyContent: 'flex-end', gap: '0.5rem' }}>
      <Button size="sm" variant="ghost">Reset</Button>
      <Button size="sm">Apply</Button>
    </div>
  </div>
</Popover>`;

const MODAL_DEMO = `<Popover
  modal
  arrow
  title="Confirm Action"
  description="This configuration update requires an environment restart."
  trigger={({ ref, ...props }) => (
    <Button variant="danger" ref={ref} {...props}>
      Restart Cluster
    </Button>
  )}
>
  <div className="stack" style={{ gap: '0.75rem' }}>
    <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--pui-fg-muted)' }}>
      Expected downtime: approximately 30 seconds.
    </p>
    <Button size="sm" tone="danger" fullWidth>Confirm Restart</Button>
  </div>
</Popover>`;

export function PopoverPage() {
  const [open, setOpen] = useState(false);
  const [migrations, setMigrations] = useState(true);
  const [notifications, setNotifications] = useState(false);

  return (
    <DocPage
      eyebrow="Components"
      title="Popover"
      lede="An anchored floating container for displaying rich interactive controls and supplementary content, featuring title headers, dedicated close buttons, anchor arrows, uncontrolled support, and modal backdrops."
      importStatement="import { Popover } from 'hesh-ui';"
    >
      <Section
        title="Anchored Floating Panel"
        description="Positions cleanly relative to its trigger button with collision detection, arrow pointer, header close button, and click-outside dismissal."
      >
        <Showcase code={CONTROLLED_DEMO} defaultOpen width="md">
          <Popover
            open={open}
            onOpenChange={setOpen}
            title="Deployment Settings"
            description="Select target cluster parameters"
            arrow
            trigger={({ ref, ...props }) => (
              <Button variant="secondary" ref={ref as React.Ref<HTMLButtonElement>} {...props}>
                Deployment Options
              </Button>
            )}
          >
            <div className="stack" style={{ gap: '0.75rem', minWidth: '16rem' }}>
              <Switch
                checked={migrations}
                onCheckedChange={setMigrations}
                label="Run database migrations"
              />
              <Switch
                checked={notifications}
                onCheckedChange={setNotifications}
                label="Notify on failure"
              />
              <Button size="sm" fullWidth onClick={() => setOpen(false)}>
                Save & Deploy
              </Button>
            </div>
          </Popover>
        </Showcase>
      </Section>

      <Section
        title="Uncontrolled Mode"
        description="Works out of the box with zero external state required for simple interactive forms and inline filters."
      >
        <Showcase code={UNCONTROLLED_DEMO}>
          <div className="row-wrap">
            <Popover
              title="Quick Search Filter"
              description="Filter results by tag or keyword"
              arrow
              trigger={({ ref, ...props }) => (
                <Button variant="outline" ref={ref as React.Ref<HTMLButtonElement>} {...props}>
                  Filter Records
                </Button>
              )}
            >
              <div className="stack" style={{ gap: '0.75rem', minWidth: '16rem' }}>
                <Input placeholder="Search query..." size="sm" />
                <div className="row-wrap" style={{ justifyContent: 'flex-end', gap: '0.5rem' }}>
                  <Button size="sm" variant="ghost">Clear</Button>
                  <Button size="sm">Apply Filter</Button>
                </div>
              </div>
            </Popover>
          </div>
        </Showcase>
      </Section>

      <Section
        title="Modal Backdrop"
        description="Adds a dimmed backdrop overlay behind the floating popover to focus attention on high-impact settings."
      >
        <Showcase code={MODAL_DEMO}>
          <div className="row-wrap">
            <Popover
              modal
              arrow
              title="Confirm Cluster Restart"
              description="This configuration update requires an environment restart."
              trigger={({ ref, ...props }) => (
                <Button variant="danger" ref={ref as React.Ref<HTMLButtonElement>} {...props}>
                  Restart Environment
                </Button>
              )}
            >
              <div className="stack" style={{ gap: '0.75rem', minWidth: '16rem' }}>
                <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--pui-fg-muted)' }}>
                  Expected downtime: ~30 seconds. All active connections will seamlessly drain.
                </p>
                <Button size="sm" variant="danger" fullWidth>
                  Proceed with Restart
                </Button>
              </div>
            </Popover>
          </div>
        </Showcase>
      </Section>

      <Section title="Accessibility">
        <Callout tone="info" title="Accessible Dialog Semantics">
          Popovers implement <code>role="dialog"</code> and link their title and description via <code>aria-labelledby</code> and <code>aria-describedby</code>. Pressing <kbd className="pui-kbd">Esc</kbd> or clicking outside dismisses the popover.
        </Callout>
      </Section>

      <Section title="API Reference">
        <PropsTable
          rows={[
            {
              name: 'trigger',
              type: '(props: PopoverTriggerRenderProps) => ReactNode',
              required: true,
              description: 'Render prop providing anchor ref, click handler, and ARIA attributes.',
            },
            {
              name: 'open',
              type: 'boolean',
              description: 'Controlled open state.',
            },
            {
              name: 'defaultOpen',
              type: 'boolean',
              default: 'false',
              description: 'Initial open state for uncontrolled mode.',
            },
            {
              name: 'onOpenChange',
              type: '(open: boolean) => void',
              description: 'Callback fired when open state changes.',
            },
            {
              name: 'title',
              type: 'ReactNode',
              description: 'Header title text or element.',
            },
            {
              name: 'description',
              type: 'ReactNode',
              description: 'Header description subtitle.',
            },
            {
              name: 'children',
              type: 'ReactNode',
              description: 'Interactive content rendered inside the floating card.',
            },
            {
              name: 'showCloseButton',
              type: 'boolean',
              default: 'true (when title exists)',
              description: 'Renders an accessible (X) dismiss button in the header.',
            },
            {
              name: 'arrow',
              type: 'boolean',
              default: 'false',
              description: 'Renders an anchor arrow pointing towards the trigger.',
            },
            {
              name: 'size',
              type: "'sm' | 'md' | 'lg'",
              default: "'md'",
              description: 'Size scale determining card width and padding.',
            },
            {
              name: 'modal',
              type: 'boolean',
              default: 'false',
              description: 'Renders a dimmed backdrop overlay behind the floating popover.',
            },
            {
              name: 'placement',
              type: "'top' | 'bottom' | 'left' | 'right'",
              default: "'bottom'",
              description: 'Preferred placement edge relative to trigger.',
            },
            {
              name: 'align',
              type: "'start' | 'center' | 'end'",
              default: "'start'",
              description: 'Cross-axis alignment along the trigger edge.',
            },
            {
              name: 'offset',
              type: 'number',
              default: '8',
              description: 'Pixel distance between trigger and popover.',
            },
          ]}
        />
      </Section>
    </DocPage>
  );
}
