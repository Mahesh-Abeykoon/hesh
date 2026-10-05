import { useState } from 'react';
import {
  SpeedDial,
  PencilIcon,
  TrashIcon,
  ShareIcon,
  CopyIcon,
  HeartIcon,
} from '../../../src/index';
import { Callout, PropsTable, Showcase } from '../../components/Showcase';
import { DocPage, Section } from '../../components/DocPage';

const SPEED_DIAL_DEMO = `<SpeedDial
  direction="up"
  actions={[
    { icon: <PencilIcon size={16} />, label: 'Create post', onClick: () => alert('Create') },
    { icon: <ShareIcon size={16} />, label: 'Share link', onClick: () => alert('Share') },
    { icon: <TrashIcon size={16} />, label: 'Delete selection', tone: 'danger', onClick: () => alert('Delete') },
  ]}
/>`;

export function SpeedDialPage() {
  const [lastAction, setLastAction] = useState<string>('None');

  return (
    <DocPage
      eyebrow="Components"
      title="SpeedDial"
      lede="Floating action button (FAB) that blossoms into a speed dial of quick contextual actions with micro-staggered animations."
      importStatement="import { SpeedDial } from 'hesh';"
    >
      <Section
        title="Interactive Speed Dial"
        description="Click the primary circular trigger to open the action tray. Dismiss by clicking outside or pressing Escape."
      >
        <Showcase code={SPEED_DIAL_DEMO} defaultOpen width="md">
          <div style={{ minHeight: '260px', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', paddingBottom: '1.5rem', width: '100%' }}>
            <div style={{ marginBottom: 'auto', textAlign: 'center' }}>
              <span className="cell-sub">Last triggered action: </span>
              <strong style={{ color: 'var(--pui-primary)' }}>{lastAction}</strong>
            </div>

            <SpeedDial
              direction="up"
              actions={[
                {
                  icon: <HeartIcon size={16} />,
                  label: 'Add to favorites',
                  onClick: () => setLastAction('Favorited!'),
                },
                {
                  icon: <ShareIcon size={16} />,
                  label: 'Share document',
                  onClick: () => setLastAction('Shared document!'),
                },
                {
                  icon: <CopyIcon size={16} />,
                  label: 'Duplicate item',
                  onClick: () => setLastAction('Duplicated item!'),
                },
                {
                  icon: <PencilIcon size={16} />,
                  label: 'Edit post',
                  tone: 'primary',
                  onClick: () => setLastAction('Editing post...'),
                },
                {
                  icon: <TrashIcon size={16} />,
                  label: 'Delete entry',
                  tone: 'danger',
                  onClick: () => setLastAction('Deleted entry!'),
                },
              ]}
            />
          </div>
        </Showcase>
      </Section>

      <Callout tone="tip" title="Fixed Screen Placement">
        Set <code>position="bottom-right"</code> to automatically pin the SpeedDial to the bottom right of the viewport with responsive safe margins.
      </Callout>

      <Section title="Props Reference">
        <PropsTable
          items={[
            { name: 'actions', type: 'SpeedDialActionSpec[]', description: 'Array of contextual action specifications (icon, label, onClick, tone).' },
            { name: 'direction', type: "'up' | 'down' | 'left' | 'right'", default: "'up'", description: 'Expansion direction of speed actions.' },
            { name: 'position', type: "'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'relative'", default: "'relative'", description: 'Screen docking alignment.' },
            { name: 'open', type: 'boolean', description: 'Controlled open state.' },
            { name: 'onOpenChange', type: '(open: boolean) => void', description: 'Callback fired when open state changes.' },
            { name: 'icon', type: 'ReactNode', default: '<PlusIcon />', description: 'Trigger icon before open.' },
            { name: 'activeIcon', type: 'ReactNode', description: 'Trigger icon while opened (defaults to 45deg rotation).' },
          ]}
        />
      </Section>
    </DocPage>
  );
}
