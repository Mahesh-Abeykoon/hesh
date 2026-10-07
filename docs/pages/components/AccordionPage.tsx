import React, { useState } from 'react';
import { Accordion, Badge, Button } from '../../../src/index';
import {
  SettingsIcon,
  LockIcon,
  CheckIcon,
} from '../../../src/index';
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
      subtitle: 'Manage payment methods and invoices',
      icon: <SettingsIcon />,
      badge: <Badge tone="primary" pill>Active</Badge>,
      content: 'Invoices are issued on the 1st of each month and charged to your primary payment method.',
    },
    {
      id: 'security',
      title: 'Security & Access',
      subtitle: 'Configure two-factor authentication',
      icon: <LockIcon />,
      content: 'Two-factor authentication is enforced across all organization accounts.',
    },
  ]}
/>`;

const VARIANTS_DEMO = `<Accordion
  variant="separated"
  items={[
    { id: '1', title: 'Separated Card 1', content: 'Card style with individual container borders.' },
    { id: '2', title: 'Separated Card 2', content: 'Each panel lives in its own elevated card surface.' },
  ]}
/>

<Accordion
  variant="pills"
  items={[
    { id: 'p1', title: 'Pill Item 1', content: 'Soft sunken pills with rounded borders.' },
    { id: 'p2', title: 'Pill Item 2', content: 'Smooth expansion into active surface.' },
  ]}
/>`;

export function AccordionPage() {
  const [open, setOpen] = useState<string[]>(['billing']);

  const richItems = [
    {
      id: 'billing',
      title: 'Billing & Invoicing',
      subtitle: 'Manage credit cards, VAT ID and monthly receipts',
      icon: <SettingsIcon size={18} />,
      badge: <Badge tone="success" pill>Current</Badge>,
      content: 'Invoices are issued on the 1st of each month and charged to your primary payment method. Detailed PDF receipts are emailed automatically to billing@example.com.',
    },
    {
      id: 'security',
      title: 'Security & Two-Factor Authentication',
      subtitle: 'Protect account with hardware keys or TOTP apps',
      icon: <LockIcon size={18} />,
      badge: <Badge tone="primary" pill>Recommended</Badge>,
      content: 'Two-factor authentication (2FA) is enforced across all team members with owner or developer permissions. WebAuthn security keys are supported.',
    },
    {
      id: 'api',
      title: 'API Keys & Webhook Subscriptions',
      subtitle: 'Programmatic access to runtime infrastructure',
      content: 'API keys grant full programmatic access to cluster provisioning and metric streaming. You can generate, rotate, and revoke keys at any time.',
    },
    {
      id: 'audit',
      title: 'Audit Logs (Enterprise Feature)',
      subtitle: 'Comprehensive immutable compliance trails',
      content: 'Available on the Enterprise tier with 365-day log retention.',
      disabled: true,
    },
  ];

  return (
    <DocPage
      eyebrow="Components"
      title="Accordion"
      lede="Vertically stacked interactive panels that allow users to show and hide sections of content, featuring icons, subtitles, badges, and multiple visual styles."
      importStatement="import { Accordion } from 'hesh';"
    >
      <Section
        title="Rich Interactive Accordion"
        description="Supports leading icons, descriptive subtitles, status badges, and multiple simultaneous open panels."
      >
        <Showcase code={ACCORDION_DEMO} defaultOpen width="md">
          <Accordion
            multiple
            open={open}
            onOpenChange={setOpen}
            items={richItems}
          />
        </Showcase>
      </Section>

      <Section
        title="Visual Styles & Variants"
        description="Choose between the default continuous border, separated cards, or soft pills."
      >
        <Showcase code={VARIANTS_DEMO} width="md">
          <div className="stack" style={{ gap: '1.5rem', width: '100%' }}>
            <div>
              <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--pui-fg-muted)', marginBottom: '0.5rem' }}>
                Separated Cards (variant="separated")
              </div>
              <Accordion
                variant="separated"
                items={[
                  { id: 's1', title: 'Cloud Infrastructure', subtitle: 'AWS & GCP multi-region cluster nodes', content: 'Automatically deploys across 4 regions with sub-5ms failover routing.' },
                  { id: 's2', title: 'Edge Caching Network', subtitle: 'Global CDN distribution layer', content: 'Edge cache invalidations take under 150ms globally.' },
                ]}
              />
            </div>

            <div>
              <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--pui-fg-muted)', marginBottom: '0.5rem' }}>
                Soft Pills (variant="pills")
              </div>
              <Accordion
                variant="pills"
                items={[
                  { id: 'p1', title: 'Automatic Backups', content: 'Daily incremental snapshots with 30-day point-in-time recovery.' },
                  { id: 'p2', title: 'DDoS Protection', content: 'Multi-terabit ingress mitigation filters traffic before hitting origins.' },
                ]}
              />
            </div>
          </div>
        </Showcase>
      </Section>

      <Section
        title="Sizes scale"
        description="Small size for compact sidebars and large size for primary FAQ showcases."
      >
        <Showcase code={`<Accordion size="sm" ... />\n<Accordion size="lg" ... />`} width="md">
          <div className="stack" style={{ gap: '1.5rem', width: '100%' }}>
            <div>
              <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--pui-fg-muted)', marginBottom: '0.5rem' }}>
                Small Accordion (size="sm")
              </div>
              <Accordion
                size="sm"
                items={[
                  { id: 'sm1', title: 'Quick Tip 1', content: 'Use keyboard shortcut ⌘K to quickly access the command palette.' },
                  { id: 'sm2', title: 'Quick Tip 2', content: 'Hold Shift while scrolling horizontally in data tables.' },
                ]}
              />
            </div>

            <div>
              <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--pui-fg-muted)', marginBottom: '0.5rem' }}>
                Large Accordion (size="lg")
              </div>
              <Accordion
                size="lg"
                items={[
                  { id: 'lg1', title: 'Frequently Asked Question #1', subtitle: 'Everything about pricing and subscriptions', content: 'Our plans scale transparently based on active team members and bandwidth.' },
                  { id: 'lg2', title: 'Frequently Asked Question #2', subtitle: 'Data privacy and regulatory compliance', content: 'We comply with GDPR, HIPAA, and SOC 2 Type II certified data isolation.' },
                ]}
              />
            </div>
          </div>
        </Showcase>
      </Section>

      <Section title="Accessibility">
        <Callout tone="info" title="WAI-ARIA Accordion Pattern">
          Triggers are rendered as semantic <code>&lt;button&gt;</code> elements with <code>aria-expanded</code> and <code>aria-controls</code> attributes. Panel regions have corresponding <code>role="region"</code> and <code>aria-labelledby</code> attributes.
        </Callout>
      </Section>

      <Section title="API Reference">
        <PropsTable
          rows={[
            {
              name: 'items',
              type: 'AccordionItem[]',
              required: true,
              description: 'Array of items with id, title, content, and optional icon, subtitle, badge, disabled.',
            },
            {
              name: 'multiple',
              type: 'boolean',
              default: 'false',
              description: 'Permit multiple panels to be open simultaneously.',
            },
            {
              name: 'variant',
              type: "'default' | 'bordered' | 'separated' | 'pills'",
              default: "'default'",
              description: 'Visual presentation style.',
            },
            {
              name: 'size',
              type: "'sm' | 'md' | 'lg'",
              default: "'md'",
              description: 'Size scale determining trigger padding and font sizes.',
            },
            {
              name: 'open',
              type: 'string[]',
              description: 'Controlled open item ids.',
            },
            {
              name: 'defaultOpen',
              type: 'string[]',
              default: '[]',
              description: 'Initial open item ids for uncontrolled usage.',
            },
            {
              name: 'onOpenChange',
              type: '(open: string[]) => void',
              description: 'Callback when open state changes.',
            },
          ]}
        />
      </Section>
    </DocPage>
  );
}
