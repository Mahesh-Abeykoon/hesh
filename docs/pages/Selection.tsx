import { useState } from 'react';
import { Checkbox, Radio, RadioGroup, Switch, Separator, Badge } from '../../src/index';
import { Callout, PropsTable, Showcase } from '../components/Showcase';
import { DocPage, Section } from '../components/DocPage';

const CHECKBOX = `const [all, setAll] = useState(false);

<Checkbox
  checked={all}
  onChange={(event) => setAll(event.target.checked)}
  indeterminate={someButNotAll}
  label="Select all permissions"
/>`;

const RADIO = `<RadioGroup defaultValue="weekly" aria-label="Digest frequency">
  <Radio value="realtime" label="Real time" description="Send as events happen." />
  <Radio value="daily" label="Daily" />
  <Radio value="weekly" label="Weekly" />
</RadioGroup>`;

const SWITCH = `<Switch
  checked={enabled}
  onCheckedChange={setEnabled}
  label="Two-factor authentication"
  description="Require a code from your authenticator app."
/>`;

const PERMISSIONS = ['Read projects', 'Create projects', 'Delete projects', 'Manage billing'];

export function SelectionPage() {
  const [checkedItems, setCheckedItems] = useState<string[]>(['Read projects']);
  const [notifications, setNotifications] = useState(true);
  const [betaFeatures, setBetaFeatures] = useState(false);

  const allSelected = checkedItems.length === PERMISSIONS.length;
  const someSelected = checkedItems.length > 0 && !allSelected;

  const toggleAll = () => {
    setCheckedItems(allSelected ? [] : PERMISSIONS);
  };

  const toggle = (item: string) => {
    setCheckedItems((prev) =>
      prev.includes(item) ? prev.filter((value) => value !== item) : [...prev, item]
    );
  };

  return (
    <DocPage
      eyebrow="Forms"
      title="Checkbox · Radio · Switch"
      lede="Three ways to collect a choice. Each one keeps the native input in the DOM so forms, autofill and assistive tech behave the way users expect."
    >
      <Section
        title="Checkbox"
        description="Supports the tri-state mixed value, which is a DOM property rather than an attribute — the component assigns it imperatively and exposes it as aria-checked='mixed'."
      >
        <Showcase code={CHECKBOX} defaultOpen width="md">
          <div className="stack">
            <Checkbox
              checked={allSelected}
              indeterminate={someSelected}
              onChange={toggleAll}
              label="Select all permissions"
              description={`${checkedItems.length} of ${PERMISSIONS.length} selected`}
            />
            <Separator />
            <div className="stack" style={{ paddingLeft: '1.75rem', gap: '0.75rem' }}>
              {PERMISSIONS.map((item) => (
                <Checkbox
                  key={item}
                  checked={checkedItems.includes(item)}
                  onChange={() => toggle(item)}
                  label={item}
                />
              ))}
            </div>
          </div>
        </Showcase>
      </Section>

      <Section title="Checkbox states">
        <Showcase width="md">
          <div className="stack">
            <Checkbox defaultChecked label="Checked" />
            <Checkbox label="Unchecked" />
            <Checkbox indeterminate label="Indeterminate (mixed)" />
            <Checkbox disabled label="Disabled" />
            <Checkbox defaultChecked disabled label="Checked and disabled" />
            <Checkbox
              label="With description"
              description="Applies to every workspace you own."
            />
          </div>
        </Showcase>
      </Section>

      <Section
        title="Radio group"
        description="A radio group is one tab stop: arrow keys move between options and selection follows focus, matching the native behaviour."
      >
        <Showcase code={RADIO} width="md">
          <RadioGroup defaultValue="weekly" aria-label="Digest frequency">
            <Radio value="realtime" label="Real time" description="Send as events happen." />
            <Radio value="daily" label="Daily" description="Once a day at 09:00." />
            <Radio value="weekly" label="Weekly" description="Every Monday morning." />
            <Radio value="never" label="Never" disabled />
          </RadioGroup>
        </Showcase>
        <Callout tone="info" title="Radios need a group">
          Always render <code>&lt;Radio&gt;</code> inside <code>&lt;RadioGroup&gt;</code>.
          The group owns the name, the roving focus and the radiogroup semantics.
        </Callout>
      </Section>

      <Section
        title="Switch"
        description="For settings that take effect immediately — not for choices inside a form that requires a Save action."
      >
        <Showcase code={SWITCH} width="md">
          <div className="stack" style={{ gap: '1.25rem' }}>
            <Switch
              checked={notifications}
              onCheckedChange={setNotifications}
              label="Email notifications"
              description="Product updates, delivered weekly."
            />
            <Switch
              checked={betaFeatures}
              onCheckedChange={setBetaFeatures}
              label="Early access features"
              description="Opt in to unreleased functionality. May be unstable."
            />
            <Separator />
            <div className="row-wrap">
              <Switch checked label="Checked" aria-label="Checked switch" />
              <Switch label="Unchecked" aria-label="Unchecked switch" />
              <Switch disabled label="Disabled" />
              <Switch defaultChecked disabled label="Checked, disabled" />
            </div>
          </div>
        </Showcase>
        <Callout tone="warning" title="Switch vs checkbox">
          Use a switch when the change applies the moment it is toggled. If the
          value is only committed when the user submits a form, a checkbox
          communicates that better.
        </Callout>
      </Section>

      <Section title="Live result">
        <Showcase>
          <div className="result-grid">
            <div>
              <div className="result-grid__label">Permissions</div>
              <div className="row-wrap">
                {checkedItems.length === 0 && <Badge tone="neutral">None</Badge>}
                {checkedItems.map((item) => (
                  <Badge key={item} tone="primary">
                    {item}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <div className="result-grid__label">Notifications</div>
              <Badge tone={notifications ? 'success' : 'neutral'} dot>
                {notifications ? 'Enabled' : 'Disabled'}
              </Badge>
            </div>
            <div>
              <div className="result-grid__label">Early access</div>
              <Badge tone={betaFeatures ? 'warning' : 'neutral'} dot>
                {betaFeatures ? 'Opted in' : 'Off'}
              </Badge>
            </div>
          </div>
        </Showcase>
      </Section>

      <Section title="API">
        <PropsTable
          rows={[
            { name: 'label', type: 'ReactNode', description: 'Checkbox, Radio, Switch. Visible label text.' },
            { name: 'description', type: 'ReactNode', description: 'Secondary line, linked with aria-describedby.' },
            { name: 'indeterminate', type: 'boolean', default: 'false', description: 'Checkbox only. Renders the mixed state.' },
            { name: 'checked / defaultChecked', type: 'boolean', description: 'Switch supports controlled and uncontrolled use.' },
            { name: 'onCheckedChange', type: '(checked: boolean) => void', description: 'Switch only. Fires with the next value.' },
            { name: 'value / defaultValue', type: 'string', description: 'RadioGroup. Controlled and uncontrolled selection.' },
            { name: 'onValueChange', type: '(value: string) => void', description: 'RadioGroup. Fires when the selection changes.' },
            { name: 'name', type: 'string', description: 'RadioGroup. Auto-generated when omitted.' },
          ]}
        />
      </Section>

      <Section title="Accessibility">
        <ul className="tick-list">
          <li>
            All three keep a real <code>&lt;input&gt;</code> in the DOM — visually
            hidden but focusable, so the focus ring appears on the styled box via{' '}
            <code>:focus-visible +</code>.
          </li>
          <li>
            A radio group is a single tab stop. <kbd className="pui-kbd">↑</kbd>{' '}
            <kbd className="pui-kbd">↓</kbd> move and select; <kbd className="pui-kbd">Tab</kbd>{' '}
            leaves the group.
          </li>
          <li>
            The switch uses <code>role="switch"</code> with{' '}
            <code>aria-checked</code>, so it is announced as "on" or "off" rather
            than "checked".
          </li>
          <li>
            Mixed checkboxes report <code>aria-checked="mixed"</code>, not just a
            different glyph.
          </li>
        </ul>
      </Section>
    </DocPage>
  );
}
