import { useState } from 'react';
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
  Button,
} from '../../../src/index';
import { Callout, PropsTable, Showcase } from '../../components/Showcase';
import { DocPage, Section } from '../../components/DocPage';

const COLLAPSIBLE_DEMO = `const [open, setOpen] = useState(false);

<Collapsible open={open} onOpenChange={setOpen}>
  <CollapsibleTrigger asChild>
    <Button variant="outline">
      {open ? 'Hide details' : 'Show details'}
    </Button>
  </CollapsibleTrigger>
  <CollapsibleContent>
    <div style={{ padding: '0.75rem', background: 'var(--pui-surface-sunken)', borderRadius: 'var(--pui-radius-md)' }}>
      Secret credentials and diagnostics information.
    </div>
  </CollapsibleContent>
</Collapsible>`;

export function CollapsiblePage() {
  const [open, setOpen] = useState(false);

  return (
    <DocPage
      eyebrow="Components"
      title="Collapsible"
      lede="An interactive disclosure component that allows users to toggle the visibility of specific content."
      importStatement="import { Collapsible, CollapsibleTrigger, CollapsibleContent } from 'hesh';"
    >
      <Section
        title="Interactive Disclosure"
        description="Click trigger button to toggle collapsible body content."
      >
        <Showcase code={COLLAPSIBLE_DEMO} defaultOpen width="md">
          <div style={{ width: '100%', maxWidth: '24rem' }}>
            <Collapsible open={open} onOpenChange={setOpen}>
              <div className="row-between" style={{ padding: '0.5rem 0', alignItems: 'center' }}>
                <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>@radix-ui/primitives</span>
                <CollapsibleTrigger>
                  {open ? 'Collapse ▲' : 'Expand details ▼'}
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent>
                <div
                  style={{
                    padding: '0.875rem',
                    background: 'var(--pui-surface-sunken)',
                    borderRadius: 'var(--pui-radius-lg)',
                    border: '1px solid var(--pui-border)',
                    fontSize: '0.8125rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.375rem',
                  }}
                >
                  <div style={{ fontWeight: 500, color: 'var(--pui-fg)' }}>Package Metadata</div>
                  <div className="cell-sub">License: MIT · Dependencies: 0</div>
                  <div className="cell-sub">Weekly downloads: 1,840,290</div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </Showcase>
      </Section>

      <Section title="API Reference">
        <PropsTable
          rows={[
            { name: 'open', type: 'boolean', description: 'Controlled open state.' },
            { name: 'defaultOpen', type: 'boolean', default: 'false', description: 'Default open state when uncontrolled.' },
            { name: 'onOpenChange', type: '(open: boolean) => void', description: 'Callback fired on open state change.' },
            { name: 'disabled', type: 'boolean', default: 'false', description: 'Whether the collapsible is disabled.' },
          ]}
        />
      </Section>
    </DocPage>
  );
}
