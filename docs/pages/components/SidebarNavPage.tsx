import { SidebarNav, HomeIcon, SettingsIcon, UsersIcon, BarChartIcon } from '../../../src/index';
import { Callout, PropsTable, Showcase } from '../../components/Showcase';
import { DocPage, Section } from '../../components/DocPage';

const SIDEBAR_NAV_DEMO = `<SidebarNav
  activeId="analytics"
  onSelect={(id) => console.log('Navigate to', id)}
  groups={[
    {
      title: 'Platform',
      items: [
        { id: 'overview', label: 'Overview', icon: <HomeIcon /> },
        { id: 'analytics', label: 'Analytics', icon: <BarChartIcon />, badge: 'Live' },
        { id: 'team', label: 'Team Members', icon: <UsersIcon /> },
      ],
    },
    {
      title: 'Settings',
      items: [
        { id: 'general', label: 'General', icon: <SettingsIcon /> },
      ],
    },
  ]}
/>`;

export function SidebarNavPage() {
  return (
    <DocPage
      eyebrow="Components"
      title="SidebarNav"
      lede="Structured sidebar navigation links grouped under category headers with icons, active state indicators, and counter badges."
      importStatement="import { SidebarNav } from 'hesh';"
    >
      <Section
        title="Navigation Groups"
        description="Renders grouped navigation lists with active highlight and accessible landmarks."
      >
        <Showcase code={SIDEBAR_NAV_DEMO} defaultOpen width="md">
          <div style={{ maxWidth: '16rem', margin: '0 auto', background: 'var(--pui-surface)', padding: '1rem', borderRadius: 'var(--pui-radius-lg)', border: '1px solid var(--pui-border-subtle)' }}>
            <SidebarNav
              activeId="analytics"
              onSelect={(id) => alert(`Selected ${id}`)}
              groups={[
                {
                  label: 'Platform',
                  items: [
                    { id: 'overview', label: 'Overview', icon: <HomeIcon /> },
                    { id: 'analytics', label: 'Analytics', icon: <BarChartIcon />, badge: 'Live' },
                    { id: 'team', label: 'Team Members', icon: <UsersIcon /> },
                  ],
                },
                {
                  label: 'Preferences',
                  items: [
                    { id: 'settings', label: 'Settings', icon: <SettingsIcon /> },
                  ],
                },
              ]}
            />
          </div>
        </Showcase>
      </Section>

      <Section title="API Reference">
        <PropsTable
          rows={[
            { name: 'groups', type: 'NavGroup[]', required: true, description: 'Groups of navigation items with title and items array.' },
            { name: 'activeId', type: 'string', description: 'ID of the currently active navigation item.' },
            { name: 'onSelect', type: '(id: string) => void', description: 'Callback fired when an item is clicked.' },
          ]}
        />
      </Section>
    </DocPage>
  );
}
