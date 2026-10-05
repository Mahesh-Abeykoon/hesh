import { useState } from 'react';
import { ContextMenu, Card, type MenuEntry } from '../../../src/index';
import { Callout, PropsTable, Showcase } from '../../components/Showcase';
import { DocPage, Section } from '../../components/DocPage';

const DEMO = `<ContextMenu
  items={[
    { kind: 'item', label: 'Inspect element', shortcut: '⌥⌘I', onSelect: () => {} },
    { kind: 'item', label: 'Copy link address', shortcut: '⌘C', onSelect: () => {} },
    { kind: 'separator' },
    { kind: 'item', label: 'Delete record', tone: 'danger', shortcut: '⌫', onSelect: () => {} },
  ]}
>
  <div style={{
    border: '2px dashed var(--pui-border-strong)',
    borderRadius: 'var(--pui-radius-lg)',
    padding: '3rem 2rem',
    textAlign: 'center',
    cursor: 'context-menu',
  }}>
    Right-click anywhere in this box (or long-press on mobile)
  </div>
</ContextMenu>`;

export function ContextMenuPage() {
  const [lastAction, setLastAction] = useState<string>('None');
  const [bookmarked, setBookmarked] = useState<boolean>(true);

  const menuItems: MenuEntry[] = [
    { kind: 'label', label: 'Actions' },
    { kind: 'item', label: 'Open in new tab', shortcut: '⌘T', onSelect: () => setLastAction('Opened in new tab') },
    { kind: 'item', label: 'Copy share link', shortcut: '⌘C', onSelect: () => setLastAction('Link copied') },
    { kind: 'checkbox', label: 'Add to bookmarks', checked: bookmarked, onCheckedChange: setBookmarked },
    { kind: 'separator' },
    { kind: 'item', label: 'Export JSON', shortcut: '⇧⌘E', onSelect: () => setLastAction('Exported JSON') },
    { kind: 'item', label: 'Archive item', tone: 'danger', shortcut: '⌫', onSelect: () => setLastAction('Archived') },
  ];

  return (
    <DocPage
      eyebrow="Components"
      title="ContextMenu"
      lede="Displays a floating action menu positioned at cursor coordinates on right-click or long-press on touch devices."
      importStatement="import { ContextMenu } from 'hesh';"
    >
      <Section
        title="Interactive Context Menu"
        description="Right-click inside the trigger region. Built with collision detection so it never overflows off-screen edges."
      >
        <Showcase code={DEMO} defaultOpen width="md">
          <ContextMenu items={menuItems}>
            <div
              style={{
                border: '2px dashed var(--pui-border-strong)',
                borderRadius: 'var(--pui-radius-xl)',
                background: 'var(--pui-surface-sunken)',
                padding: 'clamp(2rem, 5vw, 3.5rem) 1rem',
                textAlign: 'center',
                userSelect: 'none',
                cursor: 'context-menu',
                width: '100%',
                boxSizing: 'border-box',
              }}
            >
              <div style={{ fontSize: '1rem', fontWeight: 650, color: 'var(--pui-fg)', marginBottom: '0.25rem' }}>
                Right-click anywhere here
              </div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--pui-fg-muted)' }}>
                On touch devices, long-press for 500ms to trigger
              </div>
              <div style={{ marginTop: '1rem', fontSize: '0.75rem', color: 'var(--pui-primary)', fontWeight: 600 }}>
                Last triggered action: {lastAction}
              </div>
            </div>
          </ContextMenu>
        </Showcase>
      </Section>

      <Section title="Mobile Touch Accessibility">
        <Callout tone="info" title="Touch Device Long-Press">
          On smartphones and tablets where secondary mouse click is unavailable, holding a touch gesture for 550ms automatically triggers the context menu.
        </Callout>
      </Section>

      <Section title="API Reference">
        <PropsTable
          rows={[
            { name: 'items', type: 'readonly MenuEntry[]', description: 'Array of menu items, checkboxes, separators, and labels.' },
            { name: 'children', type: 'ReactNode', description: 'Trigger container elements.' },
            { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables right-click and long-press trigger.' },
            { name: 'menuClassName', type: 'string', description: 'Additional class for floating menu portal.' },
          ]}
        />
      </Section>
    </DocPage>
  );
}
