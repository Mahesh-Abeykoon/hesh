import { useState } from 'react';
import { Switch } from '../../../src/index';
import { Callout, PropsTable, Showcase } from '../../components/Showcase';
import { DocPage, Section } from '../../components/DocPage';

const SWITCH_DEMO = `const [enabled, setEnabled] = useState(true);

<Switch
  label="Automatic database backups"
  description="Snapshots taken daily at 00:00 UTC."
  checked={enabled}
  onChange={(e) => setEnabled(e.target.checked)}
/>

<Switch label="Dark mode theme" defaultChecked />
<Switch label="Maintenance mode" disabled />`;

export function SwitchPage() {
  const [enabled, setEnabled] = useState(true);

  return (
    <DocPage
      eyebrow="Components"
      title="Switch"
      lede="A toggle switch that allows users to switch between instantaneous on and off settings states."
      importStatement="import { Switch } from 'hesh';"
    >
      <Section
        title="Interactive Toggle Switches"
        description="Immediate state toggle with smooth thumb transitions and descriptive labels."
      >
        <Showcase code={SWITCH_DEMO} defaultOpen width="md">
          <div className="stack" style={{ gap: '1.25rem' }}>
            <Switch
              label="Automatic database backups"
              description="Snapshots taken daily at 00:00 UTC."
              checked={enabled}
              onCheckedChange={setEnabled}
            />
            <Switch label="Dark mode theme" defaultChecked />
            <Switch label="Maintenance mode" disabled />
          </div>
        </Showcase>
      </Section>

      <Section title="Accessibility">
        <Callout tone="info" title="WAI-ARIA Switch Role">
          Exposes <code>role="switch"</code> with <code>aria-checked</code>. Toggled via mouse click or <kbd className="pui-kbd">Space</kbd> key.
        </Callout>
      </Section>

      <Section title="API Reference">
        <PropsTable
          rows={[
            { name: 'label', type: 'ReactNode', description: 'Label text beside the toggle.' },
            { name: 'description', type: 'ReactNode', description: 'Supplementary description below the label.' },
            { name: 'checked', type: 'boolean', description: 'Controlled boolean state.' },
            { name: 'defaultChecked', type: 'boolean', description: 'Initial state for uncontrolled usage.' },
            { name: 'onChange', type: '(e: ChangeEvent) => void', description: 'Native change event callback.' },
            { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables switch interaction.' },
          ]}
        />
      </Section>
    </DocPage>
  );
}
