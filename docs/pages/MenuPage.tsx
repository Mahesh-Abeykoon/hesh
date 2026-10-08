import React, { useState } from 'react';
import {
  Badge,
  Button,
  DropdownMenu,
  IconButton,
  Separator,
  useToast,
  type MenuEntry,
} from '../../src/index';
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
    <Button ref={props.ref} {...props}>
      Actions
    </Button>
  )}
  items={[
    { kind: 'item', label: 'Edit record', icon: <PencilIcon />, shortcut: '⌘E', onSelect: handleEdit },
    { kind: 'item', label: 'Duplicate', icon: <CopyIcon />, shortcut: '⌘D', onSelect: handleDup },
    { kind: 'separator' },
    { kind: 'item', label: 'Delete', icon: <TrashIcon />, tone: 'danger', shortcut: '⌫', onSelect: handleDelete },
  ]}
/>`;

const SUBMENU_DEMO = `<DropdownMenu
  trigger={({ ref, ...props }) => (
    <Button variant="secondary" ref={ref} {...props}>
      Project Options
    </Button>
  )}
  items={[
    { kind: 'item', label: 'Quick View', icon: <ExternalLinkIcon /> },
    {
      kind: 'submenu',
      label: 'Share Project',
      items: [
        { kind: 'item', label: 'Copy Invite Link', shortcut: '⌘L' },
        { kind: 'item', label: 'Email Team Members' },
        { kind: 'item', label: 'Publish to Community' },
      ],
    },
    {
      kind: 'submenu',
      label: 'Export As...',
      icon: <DownloadIcon />,
      items: [
        { kind: 'item', label: 'PDF Document (.pdf)' },
        { kind: 'item', label: 'CSV Spreadsheet (.csv)' },
        { kind: 'item', label: 'Raw JSON (.json)' },
      ],
    },
    { kind: 'separator' },
    { kind: 'item', label: 'Archive', tone: 'danger' },
  ]}
/>`;

const RADIO_ITEMS = `<DropdownMenu
  trigger={({ ref, ...props }) => (
    <Button variant="secondary" ref={ref} {...props}>
      Sort By ({sortBy})
    </Button>
  )}
  items={[
    { kind: 'label', label: 'Order records' },
    { kind: 'radio', value: 'recent', label: 'Most Recent', checked: sortBy === 'recent', onSelect: setSortBy },
    { kind: 'radio', value: 'popular', label: 'Most Popular', checked: sortBy === 'popular', onSelect: setSortBy },
    { kind: 'radio', value: 'name', label: 'Alphabetical (A-Z)', checked: sortBy === 'name', onSelect: setSortBy },
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
  const [sortBy, setSortBy] = useState('recent');
  const [density, setDensity] = useState('comfortable');

  const basicItems: MenuEntry[] = [
    {
      kind: 'item',
      label: 'Edit project',
      icon: <PencilIcon />,
      shortcut: '⌘E',
      onSelect: () => toast({ title: 'Edit selected' }),
    },
    {
      kind: 'item',
      label: 'Duplicate item',
      icon: <CopyIcon />,
      shortcut: '⌘D',
      onSelect: () => toast({ title: 'Duplicated successfully' }),
    },
    {
      kind: 'item',
      label: 'Export as CSV',
      icon: <DownloadIcon />,
      onSelect: () => toast({ title: 'Export started' }),
    },
    { kind: 'separator' },
    { kind: 'label', label: 'Danger zone' },
    {
      kind: 'item',
      label: 'Archive file',
      icon: <ExternalLinkIcon />,
      onSelect: () => toast({ title: 'Archived', tone: 'warning' }),
    },
    {
      kind: 'item',
      label: 'Delete permanently',
      icon: <TrashIcon />,
      tone: 'danger',
      onSelect: () => toast({ title: 'Deleted', tone: 'danger' }),
    },
    {
      kind: 'item',
      label: 'Unavailable action',
      disabled: true,
      onSelect: () => {},
    },
  ];

  const submenuItems: MenuEntry[] = [
    {
      kind: 'item',
      label: 'Quick Inspect',
      icon: <ExternalLinkIcon />,
      onSelect: () => toast({ title: 'Inspecting element' }),
    },
    {
      kind: 'submenu',
      label: 'Share Project',
      items: [
        {
          kind: 'item',
          label: 'Copy Invite Link',
          shortcut: '⌘L',
          onSelect: () => toast({ title: 'Link copied to clipboard' }),
        },
        {
          kind: 'item',
          label: 'Email Team Members',
          onSelect: () => toast({ title: 'Invite modal opened' }),
        },
        {
          kind: 'item',
          label: 'Publish to Community',
          onSelect: () => toast({ title: 'Publishing to web' }),
        },
      ],
    },
    {
      kind: 'submenu',
      label: 'Export As...',
      icon: <DownloadIcon />,
      items: [
        {
          kind: 'item',
          label: 'PDF Document (.pdf)',
          onSelect: () => toast({ title: 'Exporting as PDF' }),
        },
        {
          kind: 'item',
          label: 'CSV Spreadsheet (.csv)',
          onSelect: () => toast({ title: 'Exporting as CSV' }),
        },
        {
          kind: 'item',
          label: 'JSON Data (.json)',
          onSelect: () => toast({ title: 'Exporting as JSON' }),
        },
      ],
    },
    { kind: 'separator' },
    {
      kind: 'item',
      label: 'Archive Project',
      tone: 'danger',
      onSelect: () => toast({ title: 'Project archived', tone: 'warning' }),
    },
  ];

  const radioItems: MenuEntry[] = [
    { kind: 'label', label: 'Display density' },
    {
      kind: 'radio',
      value: 'compact',
      label: 'Compact',
      description: 'High-density view for data tables',
      checked: density === 'compact',
      onSelect: setDensity,
    },
    {
      kind: 'radio',
      value: 'comfortable',
      label: 'Comfortable',
      description: 'Default balanced spacing',
      checked: density === 'comfortable',
      onSelect: setDensity,
    },
    {
      kind: 'radio',
      value: 'spacious',
      label: 'Spacious',
      description: 'Generous padding for touch devices',
      checked: density === 'spacious',
      onSelect: setDensity,
    },
  ];

  return (
    <DocPage
      eyebrow="Overlays"
      title="Dropdown menu"
      lede="A menu button with full WAI-ARIA support: cascading submenus, radio groups, persistent checkbox rows, descriptions, wrapping arrow keys, and typeahead search."
    >
      <Section title="Basic">
        <Showcase code={BASIC} defaultOpen>
          <div className="row-wrap" style={{ gap: '1rem', alignItems: 'center' }}>
            <DropdownMenu
              items={basicItems}
              trigger={({ ref, ...props }) => (
                <Button ref={ref as React.Ref<HTMLButtonElement>} {...props}>
                  Actions
                </Button>
              )}
            />
            <DropdownMenu
              align="end"
              items={basicItems}
              trigger={({ ref, ...props }) => (
                <Button variant="secondary" ref={ref as React.Ref<HTMLButtonElement>} {...props}>
                  Aligned End
                </Button>
              )}
            />
            <DropdownMenu
              placement="top"
              arrow
              items={basicItems}
              trigger={({ ref, ...props }) => (
                <IconButton
                  aria-label="More actions"
                  variant="ghost"
                  ref={ref as React.Ref<HTMLButtonElement>}
                  {...props}
                >
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

      <Section
        title="Cascading Submenus"
        description="Nested flyout submenus with automatic collision bounds and keyboard navigation (ArrowRight opens, ArrowLeft returns)."
      >
        <Showcase code={SUBMENU_DEMO}>
          <div className="row-wrap">
            <DropdownMenu
              items={submenuItems}
              trigger={({ ref, ...props }) => (
                <Button variant="secondary" ref={ref as React.Ref<HTMLButtonElement>} {...props}>
                  Nested Submenus
                </Button>
              )}
            />
          </div>
        </Showcase>
      </Section>

      <Section
        title="Radio Groups & Descriptions"
        description="Mutually exclusive radio options with descriptive sub-captions and custom dot indicators."
      >
        <Showcase code={RADIO_ITEMS}>
          <div className="row-wrap" style={{ alignItems: 'center', gap: '1.5rem' }}>
            <DropdownMenu
              items={radioItems}
              trigger={({ ref, ...props }) => (
                <Button variant="secondary" ref={ref as React.Ref<HTMLButtonElement>} {...props}>
                  Density: {density}
                </Button>
              )}
            />
            <Badge tone="primary">Current Density: {density}</Badge>
          </div>
        </Showcase>
      </Section>

      <Section
        title="Checkbox rows"
        description="For persistent toggles like visible columns. The menu stays open so several can be changed in one session."
      >
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

      <Section
        title="Sizes scale"
        description="Available in small, medium, and large size scales to fit toolbars, data grids, or full dashboards."
      >
        <Showcase code={`<DropdownMenu size="sm" ... />\n<DropdownMenu size="lg" ... />`}>
          <div className="row-wrap" style={{ gap: '1rem' }}>
            <DropdownMenu
              size="sm"
              items={basicItems}
              trigger={({ ref, ...props }) => (
                <Button size="sm" variant="secondary" ref={ref as React.Ref<HTMLButtonElement>} {...props}>
                  Small Menu
                </Button>
              )}
            />
            <DropdownMenu
              size="md"
              items={basicItems}
              trigger={({ ref, ...props }) => (
                <Button size="md" variant="secondary" ref={ref as React.Ref<HTMLButtonElement>} {...props}>
                  Medium Menu
                </Button>
              )}
            />
            <DropdownMenu
              size="lg"
              items={basicItems}
              trigger={({ ref, ...props }) => (
                <Button size="lg" variant="secondary" ref={ref as React.Ref<HTMLButtonElement>} {...props}>
                  Large Menu
                </Button>
              )}
            />
          </div>
        </Showcase>
      </Section>

      <Section title="API Reference">
        <PropsTable
          rows={[
            {
              name: 'items',
              type: 'readonly MenuEntry[]',
              required: true,
              description: 'Array of items, checkboxes, radios, submenus, separators, or labels.',
            },
            {
              name: 'trigger',
              type: '(props: TriggerRenderProps) => ReactNode',
              required: true,
              description: 'Render prop providing anchor ref, open state, and accessibility ARIA props.',
            },
            {
              name: 'align',
              type: "'start' | 'center' | 'end'",
              default: "'start'",
              description: 'Cross-axis alignment relative to the trigger element.',
            },
            {
              name: 'placement',
              type: "'top' | 'bottom' | 'left' | 'right'",
              default: "'bottom'",
              description: 'Preferred placement side; flips automatically on viewport collision.',
            },
            {
              name: 'size',
              type: "'sm' | 'md' | 'lg'",
              default: "'md'",
              description: 'Size scale determining typography, item padding, and min-width.',
            },
            {
              name: 'arrow',
              type: 'boolean',
              default: 'false',
              description: 'Renders an anchor arrow pointing towards the trigger button.',
            },
            {
              name: 'modal',
              type: 'boolean',
              default: 'false',
              description: 'Renders a subtle backdrop overlay behind the floating menu.',
            },
            {
              name: 'offset',
              type: 'number',
              default: '6',
              description: 'Pixel distance between trigger and menu panel.',
            },
          ]}
        />
      </Section>

      <Section title="Accessibility">
        <ul className="tick-list">
          <li>
            Follows the WAI-ARIA Menu Button pattern: the trigger reports{' '}
            <code>aria-haspopup="menu"</code> and <code>aria-expanded</code>.
          </li>
          <li>
            The highlighted row is tracked with <code>aria-activedescendant</code>,
            so the option is announced without moving DOM focus off the menu.
          </li>
          <li>
            Cascading submenus follow the WAI-ARIA Submenu pattern with{' '}
            <code>ArrowRight</code> to enter and <code>ArrowLeft</code> to return.
          </li>
          <li>
            Radio options use <code>role="menuitemradio"</code> with{' '}
            <code>aria-checked</code> for single-choice sets.
          </li>
          <li>
            Checkbox rows use <code>role="menuitemcheckbox"</code> with{' '}
            <code>aria-checked</code>, staying open across multiple toggles.
          </li>
        </ul>
      </Section>
    </DocPage>
  );
}
