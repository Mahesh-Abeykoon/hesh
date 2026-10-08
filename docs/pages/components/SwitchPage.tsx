import { useState } from 'react';
import { Switch, Badge, Separator } from '../../../src/index';
import { Callout, PropsTable, Showcase } from '../../components/Showcase';
import { DocPage, Section } from '../../components/DocPage';
import { SwitchWorkbench } from '../../components/PropsWorkbench';

const BASIC_DEMO = `const [enabled, setEnabled] = useState(true);

<Switch
  label="Automatic database backups"
  description="Snapshots taken daily at 00:00 UTC."
  checked={enabled}
  onCheckedChange={setEnabled}
/>`;

const SIZES_DEMO = `<Switch size="sm" label="Small switch (sm)" defaultChecked />
<Switch size="md" label="Medium switch (md - default)" defaultChecked />
<Switch size="lg" label="Large switch (lg)" defaultChecked />`;

const SETTINGS_LIST_DEMO = `<div className="stack" style={{ gap: '1rem' }}>
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <div>
      <div style={{ fontWeight: 600 }}>Two-Factor Authentication</div>
      <div style={{ fontSize: '0.8125rem', color: 'var(--pui-fg-subtle)' }}>Require a TOTP token when logging in from new devices.</div>
    </div>
    <Switch defaultChecked />
  </div>
</div>`;

export function SwitchPage() {
  const [backups, setBackups] = useState(true);
  const [telemetry, setTelemetry] = useState(false);
  const [mfa, setMfa] = useState(true);
  const [autopay, setAutopay] = useState(true);
  const [preview, setPreview] = useState(false);

  return (
    <DocPage
      eyebrow="Components"
      title="Switch"
      lede="A toggle control that switches instantly between on and off states. Implements WAI-ARIA role='switch' with keyboard space and enter triggers."
      importStatement="import { Switch } from 'hesh-ui';"
    >
      {/* ── Interactive Props Workbench ── */}
      <Section
        title="Interactive Props Workbench"
        description="Toggle live state, size tokens, description subtext, and disabled states with real-time code generation."
      >
        <SwitchWorkbench />
      </Section>

      <Section
        title="Interactive Toggle Switches"
        description="Instantaneous binary setting with smooth animated thumb gliding."
      >
        <Showcase code={BASIC_DEMO} defaultOpen width="md">
          <div className="stack" style={{ gap: '1.25rem' }}>
            <Switch
              label="Automatic database snapshots"
              description="Backups captured daily and archived to encrypted S3 Glacier."
              checked={backups}
              onCheckedChange={setBackups}
            />
            <Switch
              label="Anonymous telemetry reporting"
              description="Help us improve performance by sharing anonymized execution latencies."
              checked={telemetry}
              onCheckedChange={setTelemetry}
            />
            <Switch label="Maintenance banner lock" disabled />
            <Switch label="Hardware security module (HSM)" defaultChecked disabled />
          </div>
        </Showcase>
      </Section>

      <Section
        title="Settings Preference List"
        description="Common pattern for account preferences and application settings where switches are right-aligned."
      >
        <Showcase code={SETTINGS_LIST_DEMO} width="md">
          <div className="stack" style={{ gap: '1.25rem', padding: '1.25rem', background: 'var(--pui-surface-subtle)', borderRadius: 'var(--pui-radius-xl)', border: '1px solid var(--pui-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.9375rem' }}>Two-Factor Authentication</span>
                  <Badge tone="success" size="sm">Recommended</Badge>
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--pui-fg-subtle)', marginTop: '0.125rem' }}>
                  Require a biometric or TOTP token whenever signing in from an untrusted browser.
                </div>
              </div>
              <Switch checked={mfa} onCheckedChange={setMfa} />
            </div>

            <Separator />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9375rem' }}>Automatic Invoice Payment</div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--pui-fg-subtle)', marginTop: '0.125rem' }}>
                  Charge primary corporate card on the 1st of each calendar month.
                </div>
              </div>
              <Switch checked={autopay} onCheckedChange={setAutopay} />
            </div>

            <Separator />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.9375rem' }}>Preview Features & Beta Labs</span>
                  <Badge tone="warning" size="sm">Beta</Badge>
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--pui-fg-subtle)', marginTop: '0.125rem' }}>
                  Opt-in to experimental query engine optimizations and preview SDK features.
                </div>
              </div>
              <Switch checked={preview} onCheckedChange={setPreview} />
            </div>
          </div>
        </Showcase>
      </Section>

      <Section
        title="Sizes (sm, md, lg)"
        description="Choose small for dense table rows and headers, medium for general forms, and large for touch ergonomics."
      >
        <Showcase code={SIZES_DEMO} width="md">
          <div className="stack" style={{ gap: '1.25rem' }}>
            <Switch size="sm" label="Small switch (sm: 2rem)" defaultChecked />
            <Switch size="md" label="Medium switch (md: 2.5rem - default)" defaultChecked />
            <Switch size="lg" label="Large switch (lg: 3rem)" defaultChecked />
          </div>
        </Showcase>
      </Section>

      <Section title="Accessibility">
        <Callout tone="info" title="WAI-ARIA Switch Pattern">
          Implemented using <code className="pui-code">&lt;button role=&quot;switch&quot;&gt;</code> rather than a masked checkbox. This gives native keyboard operability (<kbd className="pui-kbd">Space</kbd> and <kbd className="pui-kbd">Enter</kbd>), reports <code className="pui-code">aria-checked</code>, and prevents mobile input bugs.
        </Callout>
      </Section>

      <Section title="API Reference">
        <PropsTable
          rows={[
            { name: 'label', type: 'ReactNode', description: 'Label text beside the toggle.' },
            { name: 'description', type: 'ReactNode', description: 'Supplementary description below the label.' },
            { name: 'checked', type: 'boolean', description: 'Controlled boolean state.' },
            { name: 'defaultChecked', type: 'boolean', default: 'false', description: 'Initial state for uncontrolled usage.' },
            { name: 'onCheckedChange', type: '(checked: boolean) => void', description: 'Callback fired with the new boolean state.' },
            { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Sizing scale of the switch track and thumb.' },
            { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables switch interaction.' },
          ]}
        />
      </Section>
    </DocPage>
  );
}
