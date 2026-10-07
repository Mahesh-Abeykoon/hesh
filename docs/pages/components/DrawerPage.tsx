import { useState } from 'react';
import { Drawer, Button, Switch, Separator, Badge, Input } from '../../../src/index';
import { Callout, PropsTable, Showcase } from '../../components/Showcase';
import { DocPage, Section } from '../../components/DocPage';

const SIDES_DEMO = `const [activeSide, setActiveSide] = useState<null | 'left' | 'right' | 'bottom' | 'top'>(null);

<div className="row-wrap">
  <Button variant="outline" onClick={() => setActiveSide('right')}>Right Drawer</Button>
  <Button variant="outline" onClick={() => setActiveSide('left')}>Left Drawer</Button>
  <Button variant="outline" onClick={() => setActiveSide('bottom')}>Bottom Sheet</Button>
  <Button variant="outline" onClick={() => setActiveSide('top')}>Top Tray</Button>
</div>

<Drawer
  open={Boolean(activeSide)}
  onClose={() => setActiveSide(null)}
  side={activeSide || 'right'}
  title={\`\${activeSide?.toUpperCase()} Drawer\`}
  description="Edge-anchored drawer matching mobile and desktop navigation patterns."
  footer={<Button fullWidth onClick={() => setActiveSide(null)}>Dismiss</Button>}
>
  <p className="prose">
    Drawers slide in from whichever edge best matches the context of the user interaction.
  </p>
</Drawer>`;

const BOTTOM_SHEET_DEMO = `const [sheetOpen, setSheetOpen] = useState(false);

<Button onClick={() => setSheetOpen(true)}>Open Mobile Actions Sheet</Button>

<Drawer
  open={sheetOpen}
  onClose={() => setSheetOpen(false)}
  side="bottom"
  handle={true}
  title="Share Resource"
  description="Quickly export or distribute this asset with collaborators."
  footer={<Button variant="secondary" fullWidth onClick={() => setSheetOpen(false)}>Cancel</Button>}
>
  <div className="stack" style={{ gap: '0.75rem', marginTop: '0.5rem' }}>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(75px, 1fr))', gap: '0.75rem', textAlign: 'center' }}>
      {['Copy Link', 'Email', 'Slack', 'Export PDF'].map((action, i) => (
        <button
          key={i}
          type="button"
          onClick={() => setSheetOpen(false)}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 0.5rem',
            background: 'var(--pui-surface-subtle)',
            border: '1px solid var(--pui-border)',
            borderRadius: 'var(--pui-radius-lg)',
            cursor: 'pointer',
            color: 'var(--pui-fg)',
            fontSize: '0.8125rem',
          }}
        >
          <div style={{ width: '2rem', height: '2rem', borderRadius: '50%', background: 'var(--pui-primary-subtle)', color: 'var(--pui-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>
            {action[0]}
          </div>
          <span>{action}</span>
        </button>
      ))}
    </div>
  </div>
</Drawer>`;

const CART_DEMO = `const [cartOpen, setCartOpen] = useState(false);

<Button onClick={() => setCartOpen(true)}>View Cart (3 items)</Button>

<Drawer
  open={cartOpen}
  onClose={() => setCartOpen(false)}
  side="right"
  size="md"
  title={
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
      <span>Shopping Cart</span>
      <Badge tone="primary" size="sm">3 items</Badge>
    </div>
  }
  footer={
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, fontSize: '1rem' }}>
        <span>Subtotal</span>
        <span>$489.00</span>
      </div>
      <Button variant="primary" fullWidth size="lg" onClick={() => setCartOpen(false)}>
        Checkout Now
      </Button>
    </div>
  }
>
  {/* Cart line items */}
</Drawer>`;

export function DrawerPage() {
  const [activeSide, setActiveSide] = useState<null | 'left' | 'right' | 'bottom' | 'top'>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [activeSize, setActiveSize] = useState<null | 'sm' | 'md' | 'lg' | 'full'>(null);

  return (
    <DocPage
      eyebrow="Components"
      title="Drawer"
      lede="An edge-anchored sliding panel for secondary navigation, filters, contextual workflows, and mobile bottom sheets."
      importStatement="import { Drawer } from 'hesh';"
    >
      <Section
        title="Edge Placements"
        description="Dock drawers to any viewport boundary: right, left, bottom (sheet with handle), or top (tray)."
      >
        <Showcase code={SIDES_DEMO} defaultOpen width="md">
          <div className="row-wrap">
            <Button variant="outline" onClick={() => setActiveSide('right')}>Right Drawer</Button>
            <Button variant="outline" onClick={() => setActiveSide('left')}>Left Drawer</Button>
            <Button variant="outline" onClick={() => setActiveSide('bottom')}>Bottom Sheet</Button>
            <Button variant="outline" onClick={() => setActiveSide('top')}>Top Tray</Button>
          </div>

          <Drawer
            open={Boolean(activeSide)}
            onClose={() => setActiveSide(null)}
            side={activeSide || 'right'}
            title={`${activeSide?.toUpperCase()} Drawer`}
            description="Smooth CSS translate entrance with spring physics and backdrop scrim."
            footer={<Button fullWidth onClick={() => setActiveSide(null)}>Close Drawer</Button>}
          >
            <div className="stack" style={{ gap: '0.75rem', marginTop: '0.5rem' }}>
              <p className="prose">
                This drawer is anchored to <strong>side=&quot;{activeSide}&quot;</strong>. On mobile devices, bottom sheets and full-width side drawers adapt naturally without awkward viewport overflows.
              </p>
            </div>
          </Drawer>
        </Showcase>
      </Section>

      <Section
        title="Mobile Bottom Sheet"
        description="Designed specifically for mobile action sheets, share panels, and quick choices with an ergonomic grab handle."
      >
        <Showcase code={BOTTOM_SHEET_DEMO} width="md">
          <Button onClick={() => setSheetOpen(true)}>Open Action Sheet</Button>

          <Drawer
            open={sheetOpen}
            onClose={() => setSheetOpen(false)}
            side="bottom"
            handle={true}
            title="Share Project"
            description="Distribute this repository with team members or generate shareable access tokens."
            footer={<Button variant="secondary" fullWidth onClick={() => setSheetOpen(false)}>Done</Button>}
          >
            <div className="stack" style={{ gap: '1rem', marginTop: '0.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))', gap: '0.75rem', textAlign: 'center' }}>
                {[
                  { name: 'Copy Link', icon: '🔗' },
                  { name: 'Email', icon: '✉️' },
                  { name: 'Slack', icon: '💬' },
                  { name: 'Export PDF', icon: '📄' },
                ].map((action, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSheetOpen(false)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.75rem 0.5rem',
                      background: 'var(--pui-surface-subtle)',
                      border: '1px solid var(--pui-border)',
                      borderRadius: 'var(--pui-radius-lg)',
                      cursor: 'pointer',
                      color: 'var(--pui-fg)',
                      fontSize: '0.8125rem',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <span style={{ fontSize: '1.25rem' }}>{action.icon}</span>
                    <span style={{ fontWeight: 500 }}>{action.name}</span>
                  </button>
                ))}
              </div>
              <Separator />
              <Input label="Invite collaborator by email" placeholder="teammate@company.com" />
            </div>
          </Drawer>
        </Showcase>
      </Section>

      <Section
        title="Drawer Width Sizes"
        description="Choose between small, medium, large, or full-viewport widths depending on data density."
      >
        <Showcase code={`<Drawer size="sm" | "md" | "lg" | "full" ... />`} width="md">
          <div className="row-wrap">
            <Button variant="outline" size="sm" onClick={() => setActiveSize('sm')}>Small (sm: 22rem)</Button>
            <Button variant="outline" size="sm" onClick={() => setActiveSize('md')}>Medium (md: 30rem)</Button>
            <Button variant="outline" size="sm" onClick={() => setActiveSize('lg')}>Large (lg: 42rem)</Button>
            <Button variant="outline" size="sm" onClick={() => setActiveSize('full')}>Full Viewport (full)</Button>
          </div>

          <Drawer
            open={Boolean(activeSize)}
            onClose={() => setActiveSize(null)}
            side="right"
            size={activeSize || 'md'}
            title={`Drawer Width: ${activeSize?.toUpperCase()}`}
            footer={<Button onClick={() => setActiveSize(null)}>Close</Button>}
          >
            <p className="prose" style={{ marginTop: '0.5rem' }}>
              Rendering with <strong>size=&quot;{activeSize}&quot;</strong>. Perfect for inspection sidebars, audit trails, and multi-step configurations.
            </p>
          </Drawer>
        </Showcase>
      </Section>

      <Section
        title="Slide-Out Cart & Checkout"
        description="E-commerce slide-out drawer featuring line items, badge counts, and a pinned checkout summary footer."
      >
        <Showcase code={CART_DEMO} width="md">
          <Button onClick={() => setCartOpen(true)}>Open Shopping Cart (3 items)</Button>

          <Drawer
            open={cartOpen}
            onClose={() => setCartOpen(false)}
            side="right"
            size="md"
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span>Shopping Cart</span>
                <Badge tone="primary" size="sm">3 items</Badge>
              </div>
            }
            footer={
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, fontSize: '0.9375rem' }}>
                  <span style={{ color: 'var(--pui-fg-subtle)' }}>Subtotal</span>
                  <span>$489.00 USD</span>
                </div>
                <Button variant="primary" fullWidth size="lg" onClick={() => setCartOpen(false)}>
                  Proceed to Checkout
                </Button>
              </div>
            }
          >
            <div className="stack" style={{ gap: '1rem', marginTop: '0.5rem' }}>
              {[
                { name: 'Mechanical Keyboard v2', desc: 'Gateron Brown Switches', price: '$189.00', qty: 1 },
                { name: 'Studio Monitor Arm', desc: 'Matte Anodized Aluminum', price: '$140.00', qty: 1 },
                { name: 'Desk Mat Ultra', desc: '900x400mm Charcoal Felt', price: '$40.00', qty: 2 },
              ].map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem',
                    background: 'var(--pui-surface-subtle)',
                    borderRadius: 'var(--pui-radius-lg)',
                    border: '1px solid var(--pui-border)',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{item.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--pui-fg-subtle)' }}>{item.desc} &bull; Qty {item.qty}</div>
                  </div>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{item.price}</div>
                </div>
              ))}
            </div>
          </Drawer>
        </Showcase>
      </Section>

      <Section
        title="Deep Filter Panel"
        description="Comprehensive filter drawer with switches, categorical filters, and sticky commit actions."
      >
        <Showcase code={`<Drawer title="Filter Activity" ... />`} width="md">
          <Button variant="outline" onClick={() => setFilterOpen(true)}>Filter Activity Log</Button>

          <Drawer
            open={filterOpen}
            onClose={() => setFilterOpen(false)}
            side="right"
            title="Filter Activity"
            footer={
              <div style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
                <Button variant="secondary" onClick={() => setFilterOpen(false)}>Reset</Button>
                <Button variant="primary" fullWidth onClick={() => setFilterOpen(false)}>Apply 3 Filters</Button>
              </div>
            }
          >
            <div className="stack" style={{ gap: '1rem', marginTop: '0.5rem' }}>
              <Switch label="Show archived audit events" />
              <Switch label="Only high-severity alerts" defaultChecked />
              <Switch label="Exclude automated bot triggers" defaultChecked />
              <Separator />
              <Input label="Filter by IP address or subnet" placeholder="192.168.1.0/24" />
            </div>
          </Drawer>
        </Showcase>
      </Section>

      <Section title="Accessibility">
        <Callout tone="info" title="A11y Standards Compliance">
          Drawers share the modal dialog focus-trap contract. Background scrolling is locked, focus is restored to the opener element upon dismiss, and keyboard users can press <kbd className="pui-kbd">Esc</kbd> at any point to dismiss.
        </Callout>
      </Section>

      <Section title="API Reference">
        <PropsTable
          rows={[
            { name: 'open', type: 'boolean', required: true, description: 'Controls whether the drawer is mounted and visible.' },
            { name: 'onClose', type: '() => void', required: true, description: 'Callback fired when dismissed via backdrop or Esc.' },
            { name: 'side', type: "'left' | 'right' | 'top' | 'bottom'", default: "'right'", description: 'Viewport edge from which the drawer enters.' },
            { name: 'size', type: "'sm' | 'md' | 'lg' | 'full'", default: "'md'", description: 'Width on desktop (or height on top/bottom).' },
            { name: 'handle', type: 'boolean', default: 'true on bottom', description: 'Renders an accessible mobile drag handle bar on bottom sheets.' },
            { name: 'title', type: 'ReactNode', description: 'Heading title in the drawer header.' },
            { name: 'description', type: 'ReactNode', description: 'Subtitle description.' },
            { name: 'footer', type: 'ReactNode', description: 'Pinned action bar at the drawer bottom.' },
            { name: 'children', type: 'ReactNode', description: 'Body content of the drawer.' },
          ]}
        />
      </Section>
    </DocPage>
  );
}
