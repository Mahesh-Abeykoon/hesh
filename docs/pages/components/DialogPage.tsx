import { useState } from 'react';
import { Dialog, ConfirmDialog, Button, Input } from '../../../src/index';
import { Callout, PropsTable, Showcase } from '../../components/Showcase';
import { DocPage, Section } from '../../components/DocPage';

const DIALOG_DEMO = `const [open, setOpen] = useState(false);

<Button onClick={() => setOpen(true)}>Invite Teammate</Button>

<Dialog
  open={open}
  onClose={() => setOpen(false)}
  title="Invite Teammate"
  description="They will receive an invitation email with a link to join your organization."
  footer={
    <>
      <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
      <Button onClick={() => setOpen(false)}>Send Invitation</Button>
    </>
  }
>
  <Input label="Email address" type="email" placeholder="teammate@company.com" autoFocus />
</Dialog>`;

const CONFIRM_DEMO = `const [confirmOpen, setConfirmOpen] = useState(false);

<Button variant="danger" onClick={() => setConfirmOpen(true)}>Delete Project</Button>

<ConfirmDialog
  open={confirmOpen}
  onClose={() => setConfirmOpen(false)}
  onConfirm={() => {}}
  tone="danger"
  title="Delete this project?"
  confirmLabel="Delete permanently"
  description="This action cannot be undone. All 4,218 records will be permanently erased."
/>`;

export function DialogPage() {
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <DocPage
      eyebrow="Components"
      title="Dialog"
      lede="A modal window that sits on an overlay layer to interrupt user workflow for critical decisions, forms, or confirmations."
      importStatement="import { Dialog, ConfirmDialog } from 'hesh';"
    >
      <Section
        title="Standard Modal Dialog"
        description="Traps focus inside the dialog, renders an accessible backdrop overlay, and restores trigger focus on close."
      >
        <Showcase code={DIALOG_DEMO} defaultOpen width="md">
          <div className="row-wrap">
            <Button onClick={() => setOpen(true)}>Invite Teammate</Button>
            <Button variant="danger" onClick={() => setConfirmOpen(true)}>Delete Project</Button>
          </div>

          <Dialog
            open={open}
            onClose={() => setOpen(false)}
            title="Invite Teammate"
            description="They will receive an invitation email with a link to join your organization."
            footer={
              <>
                <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
                <Button onClick={() => setOpen(false)}>Send Invitation</Button>
              </>
            }
          >
            <div className="stack" style={{ gap: '0.75rem', marginTop: '0.5rem' }}>
              <Input label="Email address" type="email" placeholder="teammate@company.com" />
            </div>
          </Dialog>

          <ConfirmDialog
            open={confirmOpen}
            onClose={() => setConfirmOpen(false)}
            onConfirm={() => { setConfirmOpen(false); alert('Project deleted'); }}
            tone="danger"
            title="Delete this project?"
            confirmLabel="Delete permanently"
            description="This action cannot be undone. All 4,218 records will be permanently erased."
          />
        </Showcase>
      </Section>

      <Section title="Accessibility">
        <Callout tone="info" title="Focus Trap & Scroll Lock">
          Implements the WAI-ARIA modal dialog pattern: focus is trapped inside the dialog using a focus trap loop, body scroll is automatically locked while open, and pressing <kbd className="pui-kbd">Esc</kbd> or clicking the backdrop dismisses the dialog.
        </Callout>
      </Section>

      <Section title="API Reference">
        <PropsTable
          rows={[
            { name: 'open', type: 'boolean', required: true, description: 'Controls whether the dialog is open or closed.' },
            { name: 'onClose', type: '() => void', required: true, description: 'Callback fired on backdrop click or escape key.' },
            { name: 'title', type: 'ReactNode', description: 'Heading title announced by screen readers.' },
            { name: 'description', type: 'ReactNode', description: 'Accessible description associated via aria-describedby.' },
            { name: 'footer', type: 'ReactNode', description: 'Action button area placed at the bottom of the dialog.' },
            { name: 'children', type: 'ReactNode', description: 'Body content of the modal dialog.' },
          ]}
        />
      </Section>
    </DocPage>
  );
}
