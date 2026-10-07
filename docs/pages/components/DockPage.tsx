import { useState } from 'react';
import { Dock, DockIcon } from '../../../src/index';
import { ZapIcon, SearchIcon, MoonIcon, SunIcon, CheckIcon } from '../../../src/index';
import { Callout, PropsTable, Showcase } from '../../components/Showcase';
import { DocPage, Section } from '../../components/DocPage';

const DOCK_DEMO = `<Dock>
  <DockIcon label="Search"><SearchIcon /></DockIcon>
  <DockIcon label="Quick Actions" active><ZapIcon /></DockIcon>
  <DockIcon label="Toggle Theme"><MoonIcon /></DockIcon>
</Dock>`;

export function DockPage() {
  const [activeTab, setActiveTab] = useState('actions');

  return (
    <DocPage
      eyebrow="Components"
      title="Dock"
      lede="macOS-inspired floating action bar with glassmorphic elevation, hover magnification, and tooltip integration."
      importStatement="import { Dock, DockIcon } from 'hesh';"
    >
      <Section
        title="Interactive Floating Dock"
        description="Hover over dock icons to inspect elevation micro-animations and active indicator dots."
      >
        <Showcase code={DOCK_DEMO} defaultOpen width="md">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <Dock>
              <DockIcon
                label="Explore"
                active={activeTab === 'search'}
                onClick={() => setActiveTab('search')}
              >
                <SearchIcon size={18} />
              </DockIcon>
              <DockIcon
                label="Quick Actions"
                active={activeTab === 'actions'}
                onClick={() => setActiveTab('actions')}
              >
                <ZapIcon size={18} />
              </DockIcon>
              <DockIcon
                label="Light Theme"
                active={activeTab === 'sun'}
                onClick={() => setActiveTab('sun')}
              >
                <SunIcon size={18} />
              </DockIcon>
              <DockIcon
                label="Dark Theme"
                active={activeTab === 'moon'}
                onClick={() => setActiveTab('moon')}
              >
                <MoonIcon size={18} />
              </DockIcon>
            </Dock>
            <span className="cell-sub">Active Dock item: {activeTab}</span>
          </div>
        </Showcase>
      </Section>

      <Section title="API Reference">
        <PropsTable
          rows={[
            { name: 'variant', type: "'glass' | 'solid' | 'subtle'", default: "'glass'", description: 'Visual backdrop styling.' },
            { name: 'magnification', type: 'number', default: '52', description: 'Peak icon magnification size in px.' },
            { name: 'distance', type: 'number', default: '100', description: 'Cursor proximity distance in px.' },
          ]}
        />
      </Section>
    </DocPage>
  );
}
