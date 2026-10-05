import { useState } from 'react';
import { Accordion } from '../../../src/index';
import { Callout, PropsTable, Showcase } from '../../components/Showcase';
import { DocPage, Section } from '../../components/DocPage';

const ACCORDION_DEMO = `const [open, setOpen] = useState<string[]>(['billing']);

<Accordion
  multiple
  open={open}
  onOpenChange={setOpen}
  items={[
    {
      id: 'billing',
      title: 'Billing & Invoicing',
      content: 'Invoices are issued on the 1st of each month and charged to your primary payment method.',
    },
    {
      id: 'security',
      title: 'Security & Access',
      content: 'Two-factor authentication is enforced across all organization accounts.',
    },
    {
      id: 'api',
      title: 'API Keys & Webhooks',
      content: 'API keys have full read/write permissions. Keep them confidential.',
    },
  ]}
/>`;

const ACCORDION_SINGLE = `<Accordion
  items={[
    { id: 'q1', title: 'What is Hesh UI?', content: 'A production-grade, zero-dependency React component library.' },
    { id: 'q2', title: 'Is TypeScript required?', content: 'TypeScript is fully supported with first-class type definitions, but vanilla JS also works seamlessly.' },
    { id: 'q3', title: 'Can I customize styles?', content: 'Yes, all styling reads directly from CSS custom properties and token layers.' },
  ]}
/>`;

export function AccordionPage() {
  const [open, setOpen] = useState<string[]>(['billing']);

  return (
    <DocPage
      eyebrow="Components"
      title="Accordion"
      lede="Vertically stacked interactive panels that allow users to show and hide sections of content."
      importStatement="import { Accordion } from 'hesh';"
    >
      <Section
        title="Multiple open panels"
        description="Allow users to expand multiple sections simultaneously. Useful for multi-topic settings and FAQs."
      >
        <Showcase code={ACCORDION_DEMO} defaultOpen width="md">
          <Accordion
            multiple
            open={open}
            onOpenChange={setOpen}
            items={[
              {
                id: 'billing',
                title: 'Billing & Invoicing',
                content: 'Invoices are issued on the 1st of each month and charged to your primary payment method. Receipts are emailed automatically.',
              },
              {
                id: 'security',
                title: 'Security & Access',
                content: 'Two-factor authentication (2FA) is enforced across all team members with owner or developer permissions.',
              },
              {
                id: 'api',
                title: 'API Keys & Webhooks',
                content: 'API keys grant full programmatic access. You can generate, revoke, and rotate keys at any time.',
              },
              {
                id: 'audit',
                title: 'Audit Logs (Enterprise)',
                content: '',
                disabled: true,
              },
            ]}
          />
        </Showcase>
      </Section>

      <Section
        title="Single accordion (Exclusive)"
        description="By default, opening one panel collapses any currently active panel."
      >
        <Showcase code={ACCORDION_SINGLE} width="md">
          <Accordion
            items={[
              { id: 'q1', title: 'What is Hesh UI?', content: 'A production-grade, zero-dependency React component library.' },
              { id: 'q2', title: 'Is TypeScript required?', content: 'TypeScript is fully supported with first-class type definitions, but vanilla JS also works seamlessly.' },
              { id: 'q3', title: 'Can I customize styles?', content: 'Yes, all styling reads directly from CSS custom properties and token layers.' },
            ]}
          />
        </Showcase>
      </Section>

      <Section title="Accessibility">
        <Callout tone="info" title="WAI-ARIA Accordion Pattern">
          Triggers are rendered as semantic <code>&lt;button&gt;</code> elements with <code>aria-expanded</code> and <code>aria-controls</code> attributes. Panel regions have corresponding <code>aria-labelledby</code> attributes. Full keyboard navigation (<kbd className="pui-kbd">Enter</kbd>, <kbd className="pui-kbd">Space</kbd>, <kbd className="pui-kbd">↑</kbd>, <kbd className="pui-kbd">↓</kbd>) is supported.
        </Callout>
      </Section>

      <Section title="API Reference">
        <PropsTable
          rows={[
            { name: 'items', type: 'AccordionItem[]', required: true, description: 'List of items with id, title, content, and optional disabled state.' },
            { name: 'multiple', type: 'boolean', default: 'false', description: 'Permit multiple panels to be open simultaneously.' },
            { name: 'open', type: 'string[]', description: 'Controlled open item ids.' },
            { name: 'defaultOpen', type: 'string[]', description: 'Initial open item ids for uncontrolled usage.' },
            { name: 'onOpenChange', type: '(open: string[]) => void', description: 'Callback when open state changes.' },
          ]}
        />
      </Section>
    </DocPage>
  );
}
