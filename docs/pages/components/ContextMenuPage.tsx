import React, { useState } from 'react';
import { ContextMenu, Badge, type MenuEntry } from '../../../src/index';
import { Callout, PropsTable, Showcase } from '../../components/Showcase';
import { DocPage, Section } from '../../components/DocPage';

const DEMO = `<ContextMenu
  items={[
    { kind: 'label', label: 'Actions' },
    { kind: 'item', label: 'Open in new tab', shortcut: '⌘T', onSelect: () => {} },
    { kind: 'item', label: 'Copy share link', shortcut: '⌘C', onSelect: () => {} },
    { kind: 'checkbox', label: 'Bookmark record', checked: bookmarked, onCheckedChange: setBookmarked },
    { kind: 'separator' },
    {
      kind: 'submenu',
      label: 'Export As...',
      items: [
        { kind: 'item', label: 'JSON Data (.json)', onSelect: () => {} },
        { kind: 'item', label: 'CSV Spreadsheet (.csv)', onSelect: () => {} },
      ],
    },
    { kind: 'separator' },
    { kind: 'item', label: 'Archive record', tone: 'danger', shortcut: '⌫', onSelect: () => {} },
  ]}
>
  <div className="canvas-box">
    Right-click or long-press on mobile
  </div>
</ContextMenu>`;

export function ContextMenuPage() {
  const [lastAction, setLastAction] = useState<string>('None');
  const [bookmarked, setBookmarked] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<string>('split');

  const menuItems: MenuEntry[] = [
    { kind: 'label', label: 'Actions' },
    {
      kind: 'item',
      label: 'Open in new tab',
      shortcut: '⌘T',
      onSelect: () => setLastAction('Opened in new tab'),
    },
    {
      kind: 'item',
      label: 'Copy share link',
      shortcut: '⌘C',
      onSelect: () => setLastAction('Share link copied to clipboard'),
    },
    {
      kind: 'checkbox',
      label: 'Add to bookmarks',
      checked: bookmarked,
      onCheckedChange: (c) => {
        setBookmarked(c);
        setLastAction(`Bookmark set to ${c}`);
      },
    },
    { kind: 'separator' },
    { kind: 'label', label: 'View mode' },
    {
      kind: 'radio',
      value: 'single',
      label: 'Single Editor',
      checked: viewMode === 'single',
      onSelect: (v) => {
        setViewMode(v);
        setLastAction(`View mode: ${v}`);
      },
    },
    {
      kind: 'radio',
      value: 'split',
      label: 'Split Editor',
      checked: viewMode === 'split',
      onSelect: (v) => {
        setViewMode(v);
        setLastAction(`View mode: ${v}`);
      },
    },
    { kind: 'separator' },
    {
      kind: 'submenu',
      label: 'Export record',
      items: [
        {
          kind: 'item',
          label: 'Export JSON',
          shortcut: '⇧⌘E',
          onSelect: () => setLastAction('Exported JSON'),
        },
        {
          kind: 'item',
          label: 'Export CSV',
          onSelect: () => setLastAction('Exported CSV'),
        },
      ],
    },
    {
      kind: 'item',
      label: 'Archive item',
      tone: 'danger',
      shortcut: '⌫',
      onSelect: () => setLastAction('Item archived'),
    },
  ];

  return (
    <DocPage
      eyebrow="Components"
      title="ContextMenu"
      lede="Displays a floating action menu positioned at cursor coordinates on right-click or long-press on touch devices, with viewport collision detection and full keyboard accessibility."
      importStatement="import { ContextMenu } from 'hesh-ui';"
    >
      <Section
        title="Interactive Context Menu"
        description="Right-click inside the trigger region. Includes radio view-mode selection, submenus, shortcuts, and persistent checkboxes."
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
              <div
                style={{
                  fontSize: '1rem',
                  fontWeight: 650,
                  color: 'var(--pui-fg)',
                  marginBottom: '0.25rem',
                }}
              >
                Right-click anywhere in this zone
              </div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--pui-fg-muted)' }}>
                On touch devices, long-press for 500ms to open
              </div>
              <div
                style={{
                  marginTop: '1.25rem',
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '0.75rem',
                  flexWrap: 'wrap',
                }}
              >
                <Badge tone="primary">Last action: {lastAction}</Badge>
                <Badge tone="neutral">View Mode: {viewMode}</Badge>
              </div>
            </div>
          </ContextMenu>
        </Showcase>
      </Section>

      <Section title="Mobile Touch Accessibility">
        <Callout tone="info" title="Touch Device Long-Press">
          On smartphones and tablets where secondary mouse click is unavailable, holding a touch gesture for 500ms automatically triggers the context menu. If the user begins scrolling, the timer is safely canceled.
        </Callout>
      </Section>

      <Section title="API Reference">
        <PropsTable
          rows={[
            {
              name: 'items',
              type: 'readonly MenuEntry[]',
              required: true,
              description: 'Array of menu items, checkboxes, radios, submenus, separators, and labels.',
            },
            {
              name: 'children',
              type: 'ReactNode',
              required: true,
              description: 'Trigger container elements providing the context-click area.',
            },
            {
              name: 'size',
              type: "'sm' | 'md' | 'lg'",
              default: "'md'",
              description: 'Size scale determining typography and padding.',
            },
            {
              name: 'disabled',
              type: 'boolean',
              default: 'false',
              description: 'Disables right-click and long-press event listeners.',
            },
            {
              name: 'menuClassName',
              type: 'string',
              description: 'Optional custom CSS class for the floating menu panel portal.',
            },
          ]}
        />
      </Section>
    </DocPage>
  );
}
