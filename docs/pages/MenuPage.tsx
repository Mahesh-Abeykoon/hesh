import { useState } from 'react';
import { Badge, Button, DropdownMenu, IconButton, Separator, useToast } from '../../src/index';
import {
  CopyIcon,
  DownloadIcon,
  ExternalLinkIcon,
  MoreHorizontalIcon,
  PencilIcon,
  TrashIcon,
} from '../../src/index';
import { Callout, PropsTable, Showcase } from '../components/Showcase';
import { DocPage, Section } from '../components/DocPage';

const BASIC = `<DropdownMenu
  trigger={({ ref, ...props }) => (
    <Button ref={props.ref} {...props} rightIcon={<ChevronDownIcon />}>
      Actions
    </Button>
  )}
  items={[
    { kind: 'item', label: 'Edit', icon: <PencilIcon />, shortcut: '⌘E', onSelect: edit },
    { kind: 'item', label: 'Duplicate', icon: <CopyIcon />, onSelect: duplicate },
    { kind: 'separator' },
    { kind: 'item', label: 'Delete', icon: <TrashIcon />, tone: 'danger', onSelect: remove },
  ]}
/>`;

const CHECKBOX_ITEMS = `<DropdownMenu
  trigger={({ ref, ...props }) => (
    <Button variant="secondary" ref={ref} {...props}>
      Columns
    </Button>
  )}
  items={[
    { kind: 'label', label: 'Visible columns' },
    { kind: 'checkbox', label: 'Name', checked: cols.name, onCheckedChange: toggle('name') },
    { kind: 'checkbox', label: 'Status', checked: cols.status, onCheckedChange: toggle('status') },
  ]}
/>`;

export function MenuPage() {
  const { toast } = useToast();
  const [columns, setColumns] = useState({ name: true, status: true, mrr: false });

  const items = [
    { kind: 'item' as const, label: 'Edit project', icon: <PencilIcon />, shortcut: '⌘E', onSelect: () => toast({ title: 'Edit selected' }) },
    { kind: 'item' as const, label: 'Duplicate', icon: <CopyIcon />, shortcut: '⌘D', onSelect: () => toast({ title: 'Duplicated' }) },
    { kind: 'item' as const, label: 'Export as CSV', icon: <DownloadIcon />, onSelect: () => toast({ title: 'Export started' }) },
    { kind: 'separator' as const },
    { kind: 'label' as const, label: 'Danger zone' },
    { kind: 'item' as const, label: 'Archive', icon: <ExternalLinkIcon />, onSelect: () => toast({ title: 'Archived', tone: 'warning' }) },
    { kind: 'item' as const, label: 'Delete', icon: <TrashIcon />, tone: 'danger' as const, onSelect: () => toast({ title: 'Deleted', tone: 'danger' }) },
    { kind: 'item' as const, label: 'Unavailable action', disabled: true, onSelect: () => {} },
  ];

  return (
    <DocPage
      eyebrow="Overlays"
      title="Dropdown menu"
      lede="A menu button with full keyboard support: type-to-search, wrapping arrow keys, Home/End, and separators, labels and checkbox rows."
    >
      <Section title="Basic">
        <Showcase code={BASIC} defaultOpen>
          <div className="row-wrap">
            <DropdownMenu
              items={items}
              trigger={({ ref, ...props }) => (
                <Button ref={ref as React.Ref<HTMLButtonElement>} {...props}>
                  Actions
                </Button>
              )}
            />
            <DropdownMenu
              align="end"
              items={items}
              trigger={({ ref, ...props }) => (
                <Button variant="secondary" ref={ref as React.Ref<HTMLButtonElement>} {...props}>
                  Aligned end
                </Button>
              )}
            />
            <DropdownMenu
              placement="top"
              items={items}
              trigger={({ ref, ...props }) => (
                <IconButton aria-label="More actions" variant="ghost" ref={ref as React.Ref<HTMLButtonElement>} {...props}>
                  <MoreHorizontalIcon />
                </IconButton>
              )}
            />
          </div>
        </Showcase>
        <Callout tone="info" title="Try the keyboard">
          Open a menu and press <kbd className="pui-kbd">↓</kbd>, then type{' '}
          <kbd className="pui-kbd">d</kbd> to jump to "Duplicate".{' '}
          <kbd className="pui-kbd">Esc</kbd> closes and returns focus to the trigger.
        </Callout>
      </Section>

      <Section title="Checkbox rows" description="For persistent toggles like visible columns. The menu stays open so several can be changed at once.">
        <Showcase code={CHECKBOX_ITEMS}>
          <div className="row-wrap">
            <DropdownMenu
              items={[
                { kind: 'label', label: 'Visible columns' },
                {
                  kind: 'checkbox',
                  label: 'Name',
                  checked: columns.name,
                  onCheckedChange: () => setColumns((prev) => ({ ...prev, name: !prev.name })),
                },
                {
                  kind: 'checkbox',
                  label: 'Status',
                  checked: columns.status,
                  onCheckedChange: () => setColumns((prev) => ({ ...prev, status: !prev.status })),
                },
                {
                  kind: 'checkbox',
                  label: 'MRR',
                  checked: columns.mrr,
                  onCheckedChange: () => setColumns((prev) => ({ ...prev, mrr: !prev.mrr })),
                },
              ]}
              trigger={({ ref, ...props }) => (
                <Button variant="secondary" ref={ref as React.Ref<HTMLButtonElement>} {...props}>
                  Columns
                </Button>
              )}
            />
          </div>
          <div style={{ marginTop: '1rem' }}>
            <div className="row-wrap">
              {Object.entries(columns)
                .filter(([, value]) => value)
                .map(([key]) => (
                  <Badge key={key} tone="primary">
                    {key}
                  </Badge>
                ))}
            </div>
          </div>
        </Showcase>
      </Section>

      <Section title="Placement">
        <p className="prose">
          Menus are positioned with fixed coordinates and flip when they would
          overflow the viewport. Repositioning also runs on scroll and resize, so a
          menu anchored to a moving element stays attached.
        </p>
        <Separator />
      </Section>

      <Section title="API">
        <PropsTable
          rows={[
            { name: 'items', type: 'MenuEntry[]', required: true, description: 'item | checkbox | separator | label entries.' },
            { name: 'trigger', type: '(props: TriggerRenderProps) => ReactNode', required: true, description: 'Render prop. Spread props onto your control and forward the ref.' },
            { name: 'align', type: "'start' | 'center' | 'end'", default: "'start'", description: 'Cross-axis alignment against the trigger.' },
            { name: 'placement', type: "'top' | 'bottom'", default: "'bottom'", description: 'Preferred side; flips when there is no room.' },
            { name: 'item.tone', type: "'default' | 'danger'", default: "'default'", description: 'Danger rows use destructive colours.' },
            { name: 'item.shortcut', type: 'string', description: 'Display-only hint, e.g. ⌘E.' },
          ]}
        />
      </Section>

      <Section title="Accessibility">
        <ul className="tick-list">
          <li>
            Follows the menu-button pattern: the trigger reports{' '}
            <code>aria-haspopup="menu"</code> and <code>aria-expanded</code>.
          </li>
          <li>
            The highlighted row is tracked with <code>aria-activedescendant</code>,
            so the option is announced without moving DOM focus off the menu.
          </li>
          <li>
            Checkbox rows use <code>role="menuitemcheckbox"</code> with{' '}
            <code>aria-checked</code>, and the menu stays open after toggling.
          </li>
          <li>
            Disabled rows keep their semantics with <code>aria-disabled</code> rather
            than being removed, so their existence is still announced.
          </li>
        </ul>
      </Section>
    </DocPage>
  );
}
