import { useState } from 'react';
import { Checkbox, ChoiceCard, Badge } from '../../../src/index';
import { Callout, PropsTable, Showcase } from '../../components/Showcase';
import { DocPage, Section } from '../../components/DocPage';
import { CheckboxWorkbench } from '../../components/PropsWorkbench';

const BASIC_DEMO = `const [agreed, setAgreed] = useState(false);

<Checkbox
  label="I agree to the terms and privacy policy"
  description="You will receive critical security announcements by email."
  checked={agreed}
  onChange={(e) => setAgreed(e.target.checked)}
/>`;

const HIERARCHY_DEMO = `// Parent controls all children; partial child selection sets indeterminate
const allChecked = children.every(c => c.checked);
const someChecked = children.some(c => c.checked);

<Checkbox
  label="Select all permissions"
  checked={allChecked}
  indeterminate={someChecked && !allChecked}
  onChange={(e) => setAll(e.target.checked)}
/>`;

const CARDS_DEMO = `<ChoiceCard checked={notifications} onClick={() => setNotifications(!notifications)}>
  <Checkbox checked={notifications} onChange={() => {}} />
  <div style={{ flex: 1 }}>
    <div style={{ fontWeight: 600 }}>Production Alerting</div>
    <div style={{ fontSize: '0.8125rem', color: 'var(--pui-fg-subtle)' }}>
      Send instant Slack and PagerDuty notifications when 5xx errors breach 1%.
    </div>
  </div>
  <Badge tone="info" size="sm">Included</Badge>
</ChoiceCard>`;

export function CheckboxPage() {
  const [agreed, setAgreed] = useState(false);
  const [parentChecked, setParentChecked] = useState(false);
  const [childA, setChildA] = useState(true);
  const [childB, setChildB] = useState(false);
  const [childC, setChildC] = useState(false);
  const [cardA, setCardA] = useState(true);
  const [cardB, setCardB] = useState(false);
  const [cardC, setCardC] = useState(false);

  const someChildren = (childA ? 1 : 0) + (childB ? 1 : 0) + (childC ? 1 : 0);
  const isParentIndeterminate = someChildren > 0 && someChildren < 3;
  const isParentChecked = someChildren === 3;

  const handleParentChange = (checked: boolean) => {
    setChildA(checked);
    setChildB(checked);
    setChildC(checked);
  };

  return (
    <DocPage
      eyebrow="Components"
      title="Checkbox"
      lede="Control that allows users to select one or multiple items, supporting indeterminate states, hierarchical trees, sizing scales, and selectable cards."
      importStatement="import { Checkbox, ChoiceCard } from 'hesh';"
    >
      {/* ── Interactive Props Workbench ── */}
      <Section
        title="Interactive Props Workbench"
        description="Configure checked and indeterminate states, size tokens, description subtext, and disabled states with real-time code generation."
      >
        <CheckboxWorkbench />
      </Section>

      <Section
        title="Interactive Checkboxes"
        description="Standard single or multi-select inputs with label and secondary description text."
      >
        <Showcase code={BASIC_DEMO} defaultOpen width="md">
          <div className="stack" style={{ gap: '1rem' }}>
            <Checkbox
              label="I agree to the terms and privacy policy"
              description="You will receive critical security announcements by email."
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            <Checkbox label="Remember this workstation for 30 days" defaultChecked />
            <Checkbox label="Disabled option" disabled />
            <Checkbox label="Disabled checked option" defaultChecked disabled />
          </div>
        </Showcase>
      </Section>

      <Section
        title="Hierarchical Tree with Indeterminate State"
        description="Parent checkbox automatically calculates its checked or indeterminate (mixed) state based on child selections."
      >
        <Showcase code={HIERARCHY_DEMO} width="md">
          <div className="stack" style={{ gap: '0.875rem', padding: '1rem', background: 'var(--pui-surface-subtle)', borderRadius: 'var(--pui-radius-lg)', border: '1px solid var(--pui-border)' }}>
            <Checkbox
              label={<strong>Database Privileges (All)</strong>}
              checked={isParentChecked}
              indeterminate={isParentIndeterminate}
              onChange={(e) => handleParentChange(e.target.checked)}
            />
            <div className="stack" style={{ gap: '0.625rem', paddingInlineStart: '1.75rem' }}>
              <Checkbox
                label="SELECT & READ (Query replicas)"
                checked={childA}
                onChange={(e) => setChildA(e.target.checked)}
              />
              <Checkbox
                label="INSERT & UPDATE (Write primary)"
                checked={childB}
                onChange={(e) => setChildB(e.target.checked)}
              />
              <Checkbox
                label="DROP & TRUNCATE (Schema migrations)"
                checked={childC}
                onChange={(e) => setChildC(e.target.checked)}
              />
            </div>
          </div>
        </Showcase>
      </Section>

      <Section
        title="Selectable Checkbox Cards (ChoiceCard)"
        description="High-converting choice cards for addon features, plan upgrades, and multi-selection settings."
      >
        <Showcase code={CARDS_DEMO} width="md">
          <div className="stack" style={{ gap: '0.75rem' }}>
            <ChoiceCard checked={cardA} onClick={() => setCardA(!cardA)}>
              <Checkbox checked={cardA} onChange={() => {}} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '0.9375rem' }}>SOC2 Type II Compliance Bundle</div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--pui-fg-subtle)' }}>
                  Continuous audit trails, automated vulnerability scans, and access review exports.
                </div>
              </div>
              <Badge tone="success" size="sm">Active</Badge>
            </ChoiceCard>

            <ChoiceCard checked={cardB} onClick={() => setCardB(!cardB)}>
              <Checkbox checked={cardB} onChange={() => {}} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '0.9375rem' }}>Multi-Region Hot Failover</div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--pui-fg-subtle)' }}>
                  Zero-downtime automated failover across us-east, eu-west, and ap-south.
                </div>
              </div>
              <Badge tone="neutral" size="sm">+$49/mo</Badge>
            </ChoiceCard>

            <ChoiceCard checked={cardC} onClick={() => setCardC(!cardC)}>
              <Checkbox checked={cardC} onChange={() => {}} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '0.9375rem' }}>Dedicated VPC Peering</div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--pui-fg-subtle)' }}>
                  Private AWS Transit Gateway and Direct Connect tunneling without public IP exposure.
                </div>
              </div>
              <Badge tone="neutral" size="sm">+$99/mo</Badge>
            </ChoiceCard>
          </div>
        </Showcase>
      </Section>

      <Section
        title="Sizes (sm, md, lg)"
        description="Scale checkbox hitboxes and typography for dense tables or touch-friendly forms."
      >
        <Showcase code={`<Checkbox size="sm" ... />\n<Checkbox size="md" ... />\n<Checkbox size="lg" ... />`} width="md">
          <div className="stack" style={{ gap: '1rem' }}>
            <Checkbox size="sm" label="Small checkbox (sm) for compact tables" defaultChecked />
            <Checkbox size="md" label="Medium checkbox (md - default)" defaultChecked />
            <Checkbox size="lg" label="Large checkbox (lg) for touch interfaces" defaultChecked />
          </div>
        </Showcase>
      </Section>

      <Section title="Accessibility">
        <Callout tone="info" title="WAI-ARIA Tri-State Semantics">
          Built on native <code className="pui-code">&lt;input type=&quot;checkbox&quot;&gt;</code>. Indeterminate states are explicitly announced to screen readers using <code className="pui-code">aria-checked=&quot;mixed&quot;</code> and programmatic DOM synchronization.
        </Callout>
      </Section>

      <Section title="API Reference">
        <PropsTable
          rows={[
            { name: 'label', type: 'ReactNode', description: 'Primary label text associated with the checkbox.' },
            { name: 'description', type: 'ReactNode', description: 'Supplementary description placed below the label.' },
            { name: 'checked', type: 'boolean', description: 'Controlled checked boolean.' },
            { name: 'defaultChecked', type: 'boolean', description: 'Uncontrolled initial checked state.' },
            { name: 'indeterminate', type: 'boolean', default: 'false', description: 'Renders minus icon and aria-checked="mixed".' },
            { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Sizing scale.' },
            { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables user interaction.' },
            { name: 'onChange', type: '(e: ChangeEvent) => void', description: 'Standard native change event handler.' },
          ]}
        />
      </Section>
    </DocPage>
  );
}
