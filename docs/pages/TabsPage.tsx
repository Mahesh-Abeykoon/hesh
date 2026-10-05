import { useState } from 'react';
import { Badge, Card, CardBody, Separator, Tabs } from '../../src/index';
import { BarChartIcon, SettingsIcon, UsersIcon } from '../../src/index';
import { Callout, PropsTable, Showcase } from '../components/Showcase';
import { DocPage, Section } from '../components/DocPage';

const BASIC = `<Tabs
  items={[
    { value: 'overview', label: 'Overview', content: <Overview /> },
    { value: 'members', label: 'Members', content: <Members /> },
    { value: 'settings', label: 'Settings', content: <Settings /> },
  ]}
  defaultValue="overview"
/>`;

const CONTROLLED = `const [tab, setTab] = useState('overview');

<Tabs items={items} value={tab} onValueChange={setTab} />`;

const VERTICAL = `<Tabs orientation="vertical" items={items} />`;

export function TabsPage() {
  const [tab, setTab] = useState('overview');

  const items = [
    {
      value: 'overview',
      label: 'Overview',
      icon: <BarChartIcon size={15} />,
      content: (
        <div className="stack">
          <p className="prose">
            Tabs switch between views in the same context. Use them when the panels
            are peers — not as navigation between separate pages.
          </p>
          <div className="grid-3">
            <Card padded>
              <div className="stat-mini">
                <span>Requests</span>
                <strong>2.4M</strong>
              </div>
            </Card>
            <Card padded>
              <div className="stat-mini">
                <span>Latency</span>
                <strong>184ms</strong>
              </div>
            </Card>
            <Card padded>
              <div className="stat-mini">
                <span>Errors</span>
                <strong>0.02%</strong>
              </div>
            </Card>
          </div>
        </div>
      ),
    },
    {
      value: 'members',
      label: 'Members',
      count: 12,
      icon: <UsersIcon size={15} />,
      content: (
        <div className="stack">
          {['Ada Lovelace', 'Grace Hopper', 'Alan Turing'].map((name) => (
            <div key={name} className="member-row">
              <span>{name}</span>
              <Badge tone="success">Active</Badge>
            </div>
          ))}
        </div>
      ),
    },
    {
      value: 'settings',
      label: 'Settings',
      icon: <SettingsIcon size={15} />,
      content: (
        <p className="prose">
          Settings panels belong in their own tab when they relate to the same
          object the other tabs are editing.
        </p>
      ),
    },
    {
      value: 'audit',
      label: 'Audit log',
      disabled: true,
      content: null,
    },
  ];

  return (
    <DocPage
      eyebrow="Layout & display"
      title="Tabs"
      lede="Roving-tabindex tabs: one tab stop for the whole list, arrow keys to move, Home and End to jump. Selection follows focus, which is what native platforms do."
    >
      <Section title="Basic">
        <Showcase code={BASIC} defaultOpen>
          <Tabs items={items} defaultValue="overview" />
        </Showcase>
      </Section>

      <Section title="Controlled" description="Drive the selection from your own state — useful for persisting the active tab in the URL.">
        <Showcase code={CONTROLLED}>
          <div className="stack">
            <div className="row-wrap">
              <span className="mono-note">active: {tab}</span>
            </div>
            <Tabs items={items} value={tab} onValueChange={setTab} />
          </div>
        </Showcase>
      </Section>

      <Section title="Vertical" description="For settings screens where the tab list doubles as a section index.">
        <Showcase code={VERTICAL}>
          <Tabs orientation="vertical" items={items} defaultValue="overview" />
        </Showcase>
      </Section>

      <Section title="Visual Variants" description="Choose between classic underline (line), modern capsule tabs (pills), and enclosed tab cards (boxed).">
        <Showcase code={`<Tabs variant="pills" items={items} />\n<Tabs variant="boxed" items={items} />`} defaultOpen>
          <div className="stack" style={{ gap: '2rem' }}>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--pui-fg-subtle)', marginBottom: '0.5rem' }}>PILLS VARIANT (variant="pills")</div>
              <Tabs variant="pills" items={items.slice(0, 3)} defaultValue="overview" />
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--pui-fg-subtle)', marginBottom: '0.5rem' }}>BOXED / ENCLOSED VARIANT (variant="boxed")</div>
              <Tabs variant="boxed" items={items.slice(0, 3)} defaultValue="overview" />
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--pui-fg-subtle)', marginBottom: '0.5rem' }}>FULL WIDTH EQUAL DISTRIBUTION (fullWidth)</div>
              <Tabs variant="pills" fullWidth items={items.slice(0, 3)} defaultValue="overview" />
            </div>
          </div>
        </Showcase>
      </Section>

      <Section title="Sizes" description="Compact sm tabs for dense tables and inspector sidebars, md for standard pages, and lg for hero sections.">
        <Showcase code={`<Tabs size="sm" ... />\n<Tabs size="lg" ... />`}>
          <div className="stack" style={{ gap: '1.5rem' }}>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--pui-fg-subtle)', marginBottom: '0.375rem' }}>SMALL (sm)</div>
              <Tabs size="sm" variant="pills" items={items.slice(0, 3)} defaultValue="overview" />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--pui-fg-subtle)', marginBottom: '0.375rem' }}>LARGE (lg)</div>
              <Tabs size="lg" variant="pills" items={items.slice(0, 3)} defaultValue="overview" />
            </div>
          </div>
        </Showcase>
      </Section>

      <Section title="Lazy panels" description="By default inactive panels stay mounted (hidden) so their state survives. Set lazy to mount only the active one.">
        <Showcase
          code={`<Tabs lazy items={items} />`}
          footer={
            <Callout tone="info">
              Mounted-and-hidden preserves scroll position and form state. Lazy
              mounting avoids the cost of rendering an expensive panel. Pick per
              screen — there is no universally right answer.
            </Callout>
          }
        >
          <div className="stack">
            <Separator label="lazy" />
            <Tabs lazy items={items} defaultValue="settings" />
          </div>
        </Showcase>
      </Section>

      <Section title="API">
        <PropsTable
          rows={[
            { name: 'items', type: 'TabItem[]', required: true, description: '{ value, label, content, icon, count, disabled }.' },
            { name: 'value / defaultValue', type: 'string', description: 'Controlled and uncontrolled selection.' },
            { name: 'onValueChange', type: '(value: string) => void', description: 'Fires when the user changes tab.' },
            { name: 'variant', type: "'line' | 'pills' | 'boxed'", default: "'line'", description: 'Visual display style.' },
            { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Button target scale.' },
            { name: 'fullWidth', type: 'boolean', default: 'false', description: 'Evenly stretches tabs across the container width.' },
            { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'Arrow keys follow the orientation.' },
            { name: 'lazy', type: 'boolean', default: 'false', description: 'Mount only the active panel.' },
          ]}
        />
      </Section>

      <Section title="Accessibility">
        <ul className="tick-list">
          <li>
            Implements the WAI-ARIA Tabs pattern: <code>role="tablist"</code>,{' '}
            <code>role="tab"</code>, <code>role="tabpanel"</code>, with{' '}
            <code>aria-selected</code> and <code>aria-controls</code> wired both ways.
          </li>
          <li>
            Roving tabindex — the list is one tab stop, and{' '}
            <kbd className="pui-kbd">←</kbd> <kbd className="pui-kbd">→</kbd> (or{' '}
            <kbd className="pui-kbd">↑</kbd> <kbd className="pui-kbd">↓</kbd>) move
            between tabs with wraparound.
          </li>
          <li>
            <kbd className="pui-kbd">Home</kbd> and <kbd className="pui-kbd">End</kbd>{' '}
            jump to the first and last enabled tab. Disabled tabs are skipped.
          </li>
          <li>Disabled tabs keep their semantics but are removed from interaction.</li>
        </ul>
      </Section>
    </DocPage>
  );
}
