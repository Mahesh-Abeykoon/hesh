import { useState } from 'react';
import { Command, Button, Kbd, useCommandShortcut } from '../../../src/index';
import { HomeIcon, SettingsIcon, PaletteIcon, UsersIcon } from '../../../src/index';
import { Callout, PropsTable, Showcase } from '../../components/Showcase';
import { DocPage, Section } from '../../components/DocPage';

const COMMAND_DEMO = `const [open, setOpen] = useState(false);
useCommandShortcut(() => setOpen((prev) => !prev));

<Button onClick={() => setOpen(true)}>Open Palette</Button>

<Command
  open={open}
  onOpenChange={setOpen}
  items={[
    { id: 'home', label: 'Go to Overview', group: 'Navigation', icon: <HomeIcon />, onSelect: () => {} },
    { id: 'team', label: 'Invite Teammate', group: 'Actions', hint: '⌘I', icon: <UsersIcon />, onSelect: () => {} },
    { id: 'settings', label: 'Preferences', group: 'Settings', icon: <SettingsIcon />, onSelect: () => {} },
  ]}
/>`;

export function CommandPage() {
  const [open, setOpen] = useState(false);

  const items = [
    { id: 'home', label: 'Go to Overview', group: 'Navigation', hint: '#/home', icon: <HomeIcon />, onSelect: () => (window.location.hash = '/home') },
    { id: 'team', label: 'Invite teammate', group: 'Actions', hint: '⌘I', icon: <UsersIcon />, onSelect: () => alert('Invite dialog') },
    { id: 'theme', label: 'Toggle theme', group: 'Actions', icon: <PaletteIcon />, onSelect: () => alert('Theme toggled') },
    { id: 'settings', label: 'Account settings', group: 'Settings', icon: <SettingsIcon />, onSelect: () => alert('Settings opened') },
  ];

  return (
    <DocPage
      eyebrow="Components"
      title="Command"
      lede="A fast, keyboard-navigable command palette with fuzzy filtering, grouped search results, and global shortcut listeners."
      importStatement="import { Command, useCommandShortcut } from 'hesh-ui';"
    >
      <Section
        title="Command Palette Trigger"
        description="Launch an accessible modal command menu by clicking below or pressing ⌘K / Ctrl+K anywhere on the documentation site."
      >
        <Showcase code={COMMAND_DEMO} defaultOpen width="md">
          <div className="row-wrap" style={{ alignItems: 'center', gap: '1rem' }}>
            <Button onClick={() => setOpen(true)}>Open Command Palette</Button>
            <span className="prose">
              Or press <Kbd>⌘</Kbd> <Kbd>K</Kbd> on your keyboard.
            </span>
          </div>
          <Command items={items} open={open} onOpenChange={setOpen} />
        </Showcase>
      </Section>

      <Section title="Keyboard Navigation">
        <Callout tone="info" title="Full Keyboard Model">
          <Kbd>↑</Kbd> <Kbd>↓</Kbd> moves highlight · <Kbd>Home</Kbd>/<Kbd>End</Kbd> jump to top/bottom · <Kbd>Enter</Kbd> executes selected command · <Kbd>Esc</Kbd> dismisses the dialog.
        </Callout>
      </Section>

      <Section title="API Reference">
        <PropsTable
          rows={[
            { name: 'items', type: 'CommandItem[]', required: true, description: 'Items with id, label, optional group, hint, icon, and onSelect.' },
            { name: 'open', type: 'boolean', required: true, description: 'Controlled visibility state.' },
            { name: 'onOpenChange', type: '(open: boolean) => void', required: true, description: 'Callback fired on open/close requests.' },
            { name: 'placeholder', type: 'string', default: "'Type a command or search…'", description: 'Search input placeholder text.' },
          ]}
        />
      </Section>
    </DocPage>
  );
}
