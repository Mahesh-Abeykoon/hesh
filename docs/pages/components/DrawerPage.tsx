import { useState } from 'react';
import { Drawer, Button, Switch, Separator } from '../../../src/index';
import { Callout, PropsTable, Showcase } from '../../components/Showcase';
import { DocPage, Section } from '../../components/DocPage';

const DRAWER_DEMO = `const [open, setOpen] = useState(false);

<Button onClick={() => setOpen(true)}>Open Filter Drawer</Button>

<Drawer
  open={open}
  onClose={() => setOpen(false)}
  side="right"
  title="Filter Activity"
  footer={<Button fullWidth onClick={() => setOpen(false)}>Apply Filters</Button>}
>
  <div className="stack">
    <Switch label="Show archived projects" />
    <Switch label="Notify on failure" defaultChecked />
  </div>
</Drawer>`;

export function DrawerPage() {
  const [open, setOpen] = useState(false);

  return (
    <DocPage
      eyebrow="Components"
      title="Drawer"
      lede="A panel that slides out from the edge of the viewport to display secondary controls, navigation, or detail views."
      importStatement="import { Drawer } from 'hesh';"
    >
      <Section
        title="Slide-out Panel"
        description="Slides smoothly from the right (or left) screen boundary with an ambient backdrop scrim."
      >
        <Showcase code={DRAWER_DEMO} defaultOpen width="md">
          <Button onClick={() => setOpen(true)}>Open Filter Drawer</Button>

          <Drawer
            open={open}
            onClose={() => setOpen(false)}
            side="right"
            title="Filter Activity"
            footer={<Button fullWidth onClick={() => setOpen(false)}>Apply Filters</Button>}
          >
            <div className="stack" style={{ gap: '1rem', marginTop: '0.5rem' }}>
              <Switch label="Show archived repositories" />
              <Switch label="Filter by production environment" defaultChecked />
              <Switch label="Only include active contributors" defaultChecked />
              <Separator />
              <span className="prose">
                Drawers preserve background context while giving ample room for extensive forms and filters.
              </span>
            </div>
          </Drawer>
        </Showcase>
      </Section>

      <Section title="Accessibility">
        <Callout tone="info" title="Smooth Transitions & Escape handling">
          Shares the modal dialog focus-trap contract. Locks background scroll, auto-focuses the first focusable element inside the drawer, and slides out smoothly on close.
        </Callout>
      </Section>

      <Section title="API Reference">
        <PropsTable
          rows={[
            { name: 'open', type: 'boolean', required: true, description: 'Controls drawer visibility.' },
            { name: 'onClose', type: '() => void', required: true, description: 'Callback fired when dismissed.' },
            { name: 'side', type: "'left' | 'right'", default: "'right'", description: 'Edge of the viewport the drawer slides from.' },
            { name: 'title', type: 'ReactNode', description: 'Heading title in the drawer header.' },
            { name: 'footer', type: 'ReactNode', description: 'Pinned actions at the bottom of the drawer.' },
            { name: 'children', type: 'ReactNode', description: 'Body content of the drawer.' },
          ]}
        />
      </Section>
    </DocPage>
  );
}
