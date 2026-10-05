import { useState } from 'react';
import { PasswordInput } from '../../../src/index';
import { Callout, PropsTable, Showcase } from '../../components/Showcase';
import { DocPage, Section } from '../../components/DocPage';

const PASSWORD_DEMO = `const [pwd, setPwd] = useState('');

<PasswordInput
  value={pwd}
  onChange={(e) => setPwd(e.target.value)}
  strengthMeter
  showRequirements
  placeholder="Enter a secure password..."
/>`;

export function PasswordInputPage() {
  const [pwd, setPwd] = useState('Secret123!');
  const [simplePwd, setSimplePwd] = useState('');

  return (
    <DocPage
      eyebrow="Components"
      title="PasswordInput"
      lede="Password input with reveal/hide toggle, multi-tier strength calculation meter, and live interactive requirement checklist."
      importStatement="import { PasswordInput } from 'hesh';"
    >
      <Section
        title="Interactive Password Field with Strength Meter"
        description="Type in the field to see real-time password strength grading (Weak, Fair, Good, Strong) and dynamic requirement validation."
      >
        <Showcase code={PASSWORD_DEMO} defaultOpen width="md">
          <div style={{ width: '100%', maxWidth: '360px', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--pui-fg)', display: 'block', marginBottom: '0.375rem' }}>
                Create New Account Password
              </label>
              <PasswordInput
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
                strengthMeter
                showRequirements
                placeholder="Choose a strong password..."
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--pui-fg)', display: 'block', marginBottom: '0.375rem' }}>
                Simple Password (Toggle only, no checklist)
              </label>
              <PasswordInput
                value={simplePwd}
                onChange={(e) => setSimplePwd(e.target.value)}
                placeholder="Enter current password"
              />
            </div>
          </div>
        </Showcase>
      </Section>

      <Callout tone="success" title="Accessible & Responsive">
        The requirement checklist automatically wraps into a multi-column responsive grid on wider containers and collapses to a clean single column on narrow mobile screens.
      </Callout>

      <Section title="Props Reference">
        <PropsTable
          items={[
            { name: 'showToggle', type: 'boolean', default: 'true', description: 'Show eye toggle button to reveal password.' },
            { name: 'strengthMeter', type: 'boolean', default: 'false', description: 'Display 4-tier colored password strength progress bar.' },
            { name: 'showRequirements', type: 'boolean', default: 'false', description: 'Render interactive checklist of password criteria.' },
            { name: 'requirements', type: 'PasswordRequirement[]', description: 'Custom array of requirement rules ({ label, test }).' },
            { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Field height and typography scale.' },
            { name: 'invalid', type: 'boolean', default: 'false', description: 'Set error highlight ring and border.' },
          ]}
        />
      </Section>
    </DocPage>
  );
}
