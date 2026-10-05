import { useState } from 'react';
import {
  BottomNav,
  BottomNavItem,
  HomeIcon,
  SearchIcon,
  BellIcon,
  UsersIcon,
  SettingsIcon,
} from '../../../src/index';
import { Callout, PropsTable, Showcase } from '../../components/Showcase';
import { DocPage, Section } from '../../components/DocPage';

const BOTTOM_NAV_DEMO = `const [active, setActive] = useState('home');

<BottomNav value={active} onChange={setActive}>
  <BottomNavItem value="home" label="Home" icon={<HomeIcon size={20} />} />
  <BottomNavItem value="search" label="Explore" icon={<SearchIcon size={20} />} />
  <BottomNavItem value="notifications" label="Alerts" icon={<BellIcon size={20} />} badge="3" />
  <BottomNavItem value="profile" label="Profile" icon={<UsersIcon size={20} />} />
</BottomNav>`;

export function BottomNavPage() {
  const [active, setActive] = useState('home');
  const [activeLabeled, setActiveLabeled] = useState('feed');

  return (
    <DocPage
      eyebrow="Components"
      title="BottomNav"
      lede="Mobile-optimized bottom navigation bar with active indicators, badges, keyboard navigation, and responsive layout."
      importStatement="import { BottomNav, BottomNavItem } from 'hesh';"
    >
      <Section
        title="Interactive Mobile Navigation Bar"
        description="Emulates native app bottom tabs. Click or use Left/Right arrow keys to switch active tabs."
      >
        <Showcase code={BOTTOM_NAV_DEMO} defaultOpen width="md">
          <div style={{ width: '100%', maxWidth: '420px', margin: '0 auto', border: '1px solid var(--pui-border)', borderRadius: '1rem', overflow: 'hidden', background: 'var(--pui-surface-subtle)' }}>
            <div style={{ padding: '2rem 1.5rem', textAlign: 'center', minHeight: '140px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--pui-fg)' }}>
                {active.toUpperCase()} SCREEN
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--pui-fg-muted)', marginTop: '0.25rem' }}>
                Active tab: <strong style={{ color: 'var(--pui-primary)' }}>{active}</strong>
              </p>
            </div>
            <BottomNav value={active} onChange={setActive} glass bordered>
              <BottomNavItem value="home" label="Home" icon={<HomeIcon size={20} />} />
              <BottomNavItem value="search" label="Search" icon={<SearchIcon size={20} />} />
              <BottomNavItem value="notifications" label="Alerts" icon={<BellIcon size={20} />} badge="4" />
              <BottomNavItem value="team" label="Team" icon={<UsersIcon size={20} />} />
              <BottomNavItem value="settings" label="Settings" icon={<SettingsIcon size={20} />} />
            </BottomNav>
          </div>
        </Showcase>
      </Section>

      <Section
        title="Label Visibility: Selected Only"
        description="Show labels only for the currently active tab to maximize screen economy on compact viewports."
      >
        <Showcase
          code={`<BottomNav labelVisibility="selected" value={active} onChange={setActive}>
  <BottomNavItem value="feed" label="Feed" icon={<HomeIcon size={20} />} />
  <BottomNavItem value="discover" label="Discover" icon={<SearchIcon size={20} />} />
  <BottomNavItem value="inbox" label="Inbox" icon={<BellIcon size={20} />} badge="9+" />
</BottomNav>`}
          width="md"
        >
          <div style={{ width: '100%', maxWidth: '360px', margin: '0 auto', border: '1px solid var(--pui-border)', borderRadius: '1rem', overflow: 'hidden' }}>
            <BottomNav labelVisibility="selected" value={activeLabeled} onChange={setActiveLabeled}>
              <BottomNavItem value="feed" label="Feed" icon={<HomeIcon size={20} />} />
              <BottomNavItem value="discover" label="Discover" icon={<SearchIcon size={20} />} />
              <BottomNavItem value="inbox" label="Inbox" icon={<BellIcon size={20} />} badge="9+" />
            </BottomNav>
          </div>
        </Showcase>
      </Section>

      <Callout tone="info" title="Safe Area Inset Support">
        BottomNav automatically includes <code>env(safe-area-inset-bottom)</code> padding to gracefully accommodate the iOS home bar and edge-to-edge displays.
      </Callout>

      <Section title="Props Reference">
        <PropsTable
          items={[
            { name: 'value', type: 'string', description: 'Active item identifier (controlled).' },
            { name: 'defaultValue', type: 'string', description: 'Default active item identifier (uncontrolled).' },
            { name: 'onChange', type: '(value: string) => void', description: 'Callback fired when a tab is selected.' },
            { name: 'position', type: "'fixed' | 'sticky' | 'relative'", default: "'relative'", description: 'Positioning strategy.' },
            { name: 'labelVisibility', type: "'always' | 'selected' | 'never'", default: "'always'", description: 'Label display behavior.' },
            { name: 'glass', type: 'boolean', default: 'true', description: 'Enable translucent backdrop-filter glassmorphism.' },
            { name: 'bordered', type: 'boolean', default: 'true', description: 'Display top divider border.' },
          ]}
        />
      </Section>
    </DocPage>
  );
}
