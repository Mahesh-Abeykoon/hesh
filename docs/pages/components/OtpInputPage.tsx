import { useState } from 'react';
import { OtpInput, Button } from '../../../src/index';
import { Callout, PropsTable, Showcase } from '../../components/Showcase';
import { DocPage, Section } from '../../components/DocPage';

const DEMO = `const [code, setCode] = useState('');

<OtpInput
  length={6}
  value={code}
  onChange={setCode}
  onComplete={(completedCode) => alert('Code verified: ' + completedCode)}
/>`;

export function OtpInputPage() {
  const [code, setCode] = useState('');
  const [pin, setPin] = useState('');
  const [verified, setVerified] = useState(false);

  return (
    <DocPage
      eyebrow="Components"
      title="OtpInput"
      lede="A multi-digit input for 2-Factor Authentication (2FA), SMS verification codes, and secure security PINs."
      importStatement="import { OtpInput } from 'hesh';"
    >
      <Section
        title="6-Digit Verification Code"
        description="Type digits or paste a complete code. Focus automatically progresses to the next field, and backspace returns to the previous slot."
      >
        <Showcase code={DEMO} defaultOpen width="md">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem', padding: '1rem 0', width: '100%', maxWidth: '24rem', margin: '0 auto', boxSizing: 'border-box' }}>
            <div style={{ fontSize: '0.875rem', color: 'var(--pui-fg-muted)', textAlign: 'center' }}>
              We sent a verification code to <strong>user@example.com</strong>
            </div>

            <OtpInput
              length={6}
              value={code}
              onChange={(val) => {
                setCode(val);
                setVerified(false);
              }}
              onComplete={() => setVerified(true)}
            />

            {verified && (
              <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--pui-success-fg)' }}>
                ✓ Code complete and verified: {code}
              </div>
            )}
          </div>
        </Showcase>
      </Section>

      <Section
        title="4-Digit Masked Security PIN"
        description="Enable mask mode to obscure characters with confidential password bullets."
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', width: '100%', maxWidth: '18rem', margin: '0 auto', boxSizing: 'border-box' }}>
          <OtpInput
            length={4}
            mask
            value={pin}
            onChange={setPin}
          />
          <div style={{ fontSize: '0.75rem', color: 'var(--pui-fg-subtle)' }}>
            Entered PIN length: {pin.length} / 4
          </div>
        </div>
      </Section>

      <Section title="Mobile Optimization">
        <Callout tone="info" title="Automatic Numeric Keyboard">
          Includes `inputMode="numeric"` and `autoComplete="one-time-code"` so iOS and Android devices automatically present the numeric keypad and offer SMS autofill suggestions.
        </Callout>
      </Section>

      <Section title="API Reference">
        <PropsTable
          rows={[
            { name: 'length', type: 'number', default: '6', description: 'Number of input slots.' },
            { name: 'value', type: 'string', description: 'Controlled verification string.' },
            { name: 'onChange', type: '(val: string) => void', description: 'Callback fired on every digit change.' },
            { name: 'onComplete', type: '(val: string) => void', description: 'Fired automatically when all slots are populated.' },
            { name: 'mask', type: 'boolean', default: 'false', description: 'Masks digits as password bullets.' },
            { name: 'type', type: "'numeric' | 'alphanumeric'", default: "'numeric'", description: 'Permitted character types.' },
            { name: 'invalid', type: 'boolean', default: 'false', description: 'Renders in danger error state.' },
            { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables all input slots.' },
          ]}
        />
      </Section>
    </DocPage>
  );
}
