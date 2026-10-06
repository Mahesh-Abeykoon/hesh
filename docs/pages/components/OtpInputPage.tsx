import { useState } from 'react';
import { OtpInput, Button } from '../../../src/index';
import { Callout, PropsTable, Showcase } from '../../components/Showcase';
import { DocPage, Section } from '../../components/DocPage';
import { OtpInputWorkbench } from '../../components/PropsWorkbench';

const DEMO_6 = `const [code, setCode] = useState('');
const [verified, setVerified] = useState(false);

<OtpInput
  length={6}
  value={code}
  onChange={setCode}
  onComplete={() => setVerified(true)}
/>`;

const DEMO_4_PIN = `<OtpInput
  length={4}
  mask
  value={pin}
  onChange={setPin}
/>`;

const DEMO_ALPHA = `<OtpInput
  length={8}
  type="alphanumeric"
  value={token}
  onChange={setToken}
  placeholder="-"
/>`;

const DEMO_INVALID = `<OtpInput
  length={6}
  value="12345X"
  invalid
/>`;

export function OtpInputPage() {
  const [code, setCode] = useState('');
  const [verified, setVerified] = useState(false);
  const [pin, setPin] = useState('');
  const [token, setToken] = useState('');
  const [errCode, setErrCode] = useState('');
  const [errShown, setErrShown] = useState(false);

  return (
    <DocPage
      eyebrow="Components"
      title="OtpInput"
      lede="Multi-digit slot input for 2FA codes, SMS verification, masked PINs, and alphanumeric tokens — with paste support and automatic focus progression."
      importStatement="import { OtpInput } from 'hesh';"
    >
      {/* ── Interactive Props Workbench ── */}
      <Section
        title="Interactive Props Workbench"
        description="Configure slot count, numeric vs alphanumeric, PIN masking, and validation error states with real-time code generation."
      >
        <OtpInputWorkbench />
      </Section>

      {/* ── 6-digit 2FA ── */}
      <Section
        title="6-Digit Verification Code (2FA)"
        description="Type digits or paste a complete code. Focus auto-advances to the next slot; Backspace retreats to the previous one."
        code={DEMO_6}
      >
        <Showcase>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', width: '100%', maxWidth: 360 }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--pui-fg-subtle)', textAlign: 'center', margin: 0 }}>
              We sent a code to <strong>user@example.com</strong>
            </p>
            <OtpInput
              length={6}
              value={code}
              onChange={(val) => { setCode(val); setVerified(false); }}
              onComplete={() => setVerified(true)}
            />
            {verified && (
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--pui-success-fg)' }}>
                ✓ Verified: {code}
              </span>
            )}
            {!verified && code.length > 0 && (
              <Button variant="ghost" size="sm" onClick={() => setCode('')}>Clear</Button>
            )}
          </div>
        </Showcase>
      </Section>

      {/* ── 4-digit masked PIN ── */}
      <Section
        title="4-Digit Masked Security PIN"
        description="Enable mask to hide the entered digits behind password bullets — ideal for device PINs and ATM-style flows."
        code={DEMO_4_PIN}
      >
        <Showcase>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', width: '100%', maxWidth: 280 }}>
            <OtpInput
              length={4}
              mask
              value={pin}
              onChange={setPin}
            />
            <span style={{ fontSize: '0.75rem', color: 'var(--pui-fg-subtle)' }}>
              {pin.length} / 4 digits entered
            </span>
          </div>
        </Showcase>
      </Section>

      {/* ── Alphanumeric token ── */}
      <Section
        title="Alphanumeric Recovery Token"
        description="Set type='alphanumeric' for 8-character backup codes, invite tokens, or license keys."
        code={DEMO_ALPHA}
      >
        <Showcase>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', width: '100%', maxWidth: 420 }}>
            <OtpInput
              length={8}
              type="alphanumeric"
              value={token}
              onChange={setToken}
            />
            <span style={{ fontSize: '0.75rem', color: 'var(--pui-fg-subtle)', letterSpacing: '0.05em' }}>
              RECOVERY-TOKEN
            </span>
          </div>
        </Showcase>
      </Section>

      {/* ── Error / invalid ── */}
      <Section
        title="Error State"
        description="Pass invalid to show the slots in the danger style — used when the submitted code doesn't match."
        code={DEMO_INVALID}
      >
        <Showcase>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', width: '100%', maxWidth: 360 }}>
            <OtpInput
              length={6}
              value={errCode}
              onChange={(v) => { setErrCode(v); setErrShown(false); }}
              onComplete={() => setErrShown(true)}
              invalid={errShown && errCode !== '123456'}
            />
            {errShown && errCode !== '123456' && (
              <span style={{ fontSize: '0.8125rem', color: 'var(--pui-danger-fg)' }}>
                ✗ Incorrect code. Try again. (Hint: 123456)
              </span>
            )}
          </div>
        </Showcase>
      </Section>

      {/* ── Disabled ── */}
      <Section
        title="Disabled"
        description="The disabled prop locks all slots and prevents interaction."
        code={`<OtpInput length={6} value="123456" disabled />`}
      >
        <Showcase>
          <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <OtpInput length={6} value="123456" disabled />
          </div>
        </Showcase>
      </Section>

      <Callout type="tip" title="Mobile autofill">
        OtpInput automatically sets <code>inputMode="numeric"</code> (for digit-only mode) and{' '}
        <code>autoComplete="one-time-code"</code>, so iOS and Android will suggest the code from an SMS message.
      </Callout>

      <Section title="API Reference">
        <PropsTable
          rows={[
            { name: 'length',     type: 'number',                          default: '6',          description: 'Number of input slots.' },
            { name: 'value',      type: 'string',                          description: 'Controlled value string.' },
            { name: 'onChange',   type: '(val: string) => void',           description: 'Fires on every character change.' },
            { name: 'onComplete', type: '(val: string) => void',           description: 'Fires when all slots are filled.' },
            { name: 'type',       type: '"numeric" | "alphanumeric"',      default: '"numeric"',  description: 'Restricts accepted characters.' },
            { name: 'mask',       type: 'boolean',                         default: 'false',      description: 'Masks digits as password bullets.' },
            { name: 'invalid',    type: 'boolean',                         default: 'false',      description: 'Renders slots in danger/error style.' },
            { name: 'disabled',   type: 'boolean',                         default: 'false',      description: 'Disables all input slots.' },
            { name: 'placeholder',type: 'string',                          default: '"·"',        description: 'Character shown in empty slots.' },
          ]}
        />
      </Section>
    </DocPage>
  );
}
