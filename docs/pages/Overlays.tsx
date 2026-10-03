import { useState } from 'react';
import {
  Button,
  Card,
  CardBody,
  ConfirmDialog,
  Dialog,
  Drawer,
  Input,
  Separator,
  Switch,
  Textarea,
  Tooltip,
} from '../../src/index';
import { Callout, PropsTable, Showcase } from '../components/Showcase';
import { DocPage, Section } from '../components/DocPage';

const DIALOG = `const [open, setOpen] = useState(false);

<Button onClick={() => setOpen(true)}>Invite teammate</Button>

<Dialog
  open={open}
  onClose={() => setOpen(false)}
  title="Invite teammate"
  description="They'll receive an email with a link to join."
  footer={
    <>
      <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
      <Button onClick={submit}>Send invite</Button>
    </>
  }
>
  <Input label="Email" type="email" placeholder="teammate@company.com" />
</Dialog>`;

const DRAWER = `<Drawer
  open={open}
  onClose={() => setOpen(false)}
  side="right"
  title="Filters"
  footer={<Button fullWidth>Apply filters</Button>}
>
  {/* filter controls */}
</Drawer>`;

const CONFIRM = `<ConfirmDialog
  open={open}
  onClose={() => setOpen(false)}
  onConfirm={remove}
  tone="danger"
  title="Delete this project?"
  confirmLabel="Delete project"
  description="This permanently removes the project and its 4,218 events."
/>`;

const TOOLTIP = `<Tooltip content="Copy invite link">
  <Button variant="secondary">Copy</Button>
</Tooltip>`;

export function OverlaysPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [scrollOpen, setScrollOpen] = useState(false);
  const [notify, setNotify] = useState(true);

  const runDelete = () => {
    setDeleting(true);
    window.setTimeout(() => {
      setDeleting(false);
      setConfirmOpen(false);
    }, 1200);
  };

  return (
    <DocPage
      eyebrow="Overlays"
      title="Dialog · Drawer · Tooltip"
      lede="Overlay components share one focus-management contract: trap focus while open, restore it to the trigger on close, lock background scroll, and close on Escape."
    >
      <Section title="Dialog" description="Centred modal for decisions that need the user's full attention.">
        <Showcase code={DIALOG} defaultOpen>
          <div className="row-wrap">
            <Button onClick={() => setDialogOpen(true)}>Invite teammate</Button>
            <Button variant="secondary" onClick={() => setScrollOpen(true)}>
              Long content
            </Button>
            <Button variant="danger" onClick={() => setConfirmOpen(true)}>
              Delete project
            </Button>
          </div>
        </Showcase>

        <Dialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          title="Invite teammate"
          description="They'll receive an email with a link to join your workspace."
          footer={
            <>
              <Button variant="secondary" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setDialogOpen(false)}>Send invite</Button>
            </>
          }
        >
          <div className="stack">
            <Input label="Email address" type="email" placeholder="teammate@company.com" />
            <Input label="Role" defaultValue="Member" readOnly />
            <Textarea
              label="Personal note"
              rows={3}
              optionalText="optional"
              placeholder="Say a few words about the project…"
            />
            <Separator />
            <Switch
              checked={notify}
              onCheckedChange={setNotify}
              label="Notify me when the invite is accepted"
            />
          </div>
        </Dialog>

        <Dialog
          open={scrollOpen}
          onClose={() => setScrollOpen(false)}
          title="Scrollable dialog"
          description="The header and footer stay fixed while the body scrolls."
          size="sm"
          footer={
            <Button onClick={() => setScrollOpen(false)} variant="secondary">
              Close
            </Button>
          }
        >
          <div className="stack">
            {Array.from({ length: 12 }, (_, index) => (
              <p key={index} className="prose">
                Paragraph {index + 1}. The body region is the only scrollable part, so
                the title and actions never leave the viewport — including on short
                mobile screens.
              </p>
            ))}
          </div>
        </Dialog>

        <ConfirmDialog
          open={confirmOpen}
          onClose={() => setConfirmOpen(false)}
          onConfirm={runDelete}
          loading={deleting}
          tone="danger"
          title="Delete this project?"
          confirmLabel="Delete project"
          description="This permanently removes the project and its 4,218 events. This action cannot be undone."
        />
      </Section>

      <Section title="Drawer" description="Edge-anchored panel for filters, detail views and secondary navigation.">
        <Showcase code={DRAWER}>
          <div className="row-wrap">
            <Button variant="secondary" onClick={() => setDrawerOpen(true)}>
              Open drawer
            </Button>
          </div>
        </Showcase>

        <Drawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          side="right"
          title="Filters"
          description="Narrow down the results below."
          footer={
            <>
              <Button variant="secondary" onClick={() => setDrawerOpen(false)}>
                Reset
              </Button>
              <Button fullWidth onClick={() => setDrawerOpen(false)}>
                Apply filters
              </Button>
            </>
          }
        >
          <div className="stack">
            <Input label="Search" placeholder="Filter by name…" />
            <Input label="Owner" placeholder="Any owner" />
            <Input label="Created after" type="date" />
            <Separator label="Status" />
            <Switch defaultChecked label="Active only" />
            <Switch label="Include archived" />
          </div>
        </Drawer>
      </Section>

      <Section title="Tooltip" description="Appears on hover after a short delay, and immediately on keyboard focus — a keyboard user has no hover state to wait for.">
        <Showcase code={TOOLTIP}>
          <div className="row-wrap">
            <Tooltip content="Copy invite link">
              <Button variant="secondary">Copy</Button>
            </Tooltip>
            <Tooltip content="Runs the full test suite" placement="bottom">
              <Button variant="outline">Run tests</Button>
            </Tooltip>
            <Tooltip content="Tooltip on the right" placement="right">
              <Button variant="ghost">Right</Button>
            </Tooltip>
            <Tooltip content="Tooltip on the left" placement="left">
              <Button variant="ghost">Left</Button>
            </Tooltip>
            <Tooltip content="This one is disabled" disabled>
              <Button variant="ghost">No tooltip</Button>
            </Tooltip>
          </div>
        </Showcase>
        <Callout tone="warning" title="Tooltips are not a substitute for labels">
          Tooltips are hidden from touch users entirely. Anything essential to
          completing a task belongs in visible text, or in an accessible name on the
          control itself.
        </Callout>
      </Section>

      <Section title="Focus behaviour">
        <Card>
          <CardBody>
            <ul className="tick-list">
              <li>
                On open, focus moves into the panel — to the element marked{' '}
                <code>data-autofocus</code> if present, otherwise the first focusable
                child.
              </li>
              <li>
                <kbd className="pui-kbd">Tab</kbd> cycles within the panel and{' '}
                <kbd className="pui-kbd">⇧Tab</kbd> cycles backwards. Focus cannot
                escape to the page behind.
              </li>
              <li>
                On close, focus returns to the element that opened the overlay. Skip
                this and keyboard users are dumped back at the top of the document.
              </li>
              <li>
                Background scroll is locked, with padding compensation so the page
                does not shift sideways when the scrollbar disappears.
              </li>
              <li>
                Tooltips use <code>aria-describedby</code> and never take focus.
              </li>
            </ul>
          </CardBody>
        </Card>
      </Section>

      <Section title="API">
        <PropsTable
          rows={[
            { name: 'open', type: 'boolean', required: true, description: 'Dialog, Drawer, ConfirmDialog. Controls visibility.' },
            { name: 'onClose', type: '() => void', required: true, description: 'Called on backdrop click, Escape, or the close button.' },
            { name: 'title / description', type: 'ReactNode', description: 'Wired via aria-labelledby and aria-describedby.' },
            { name: 'footer', type: 'ReactNode', description: 'Sticky action row.' },
            { name: 'size', type: "'sm' | 'md' | 'lg' | 'xl'", default: "'md'", description: 'Dialog max width. Drawer uses sm/md/lg for width.' },
            { name: 'dismissOnBackdrop', type: 'boolean', default: 'true', description: 'Set false for destructive or multi-step flows.' },
            { name: 'Draw.side', type: "'left' | 'right'", default: "'right'", description: 'Which edge the drawer slides from.' },
            { name: 'Tooltip.placement', type: "'top' | 'bottom' | 'left' | 'right'", default: "'top'", description: 'Preferred side; flips automatically if there is no room.' },
            { name: 'Tooltip.delay', type: 'number', default: '180', description: 'Hover delay in ms. Keyboard focus is always immediate.' },
          ]}
        />
      </Section>
    </DocPage>
  );
}
