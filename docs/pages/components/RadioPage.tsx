import { useState } from 'react';
import { Radio, RadioGroup, ChoiceCard, Badge } from '../../../src/index';
import { Callout, PropsTable, Showcase } from '../../components/Showcase';
import { DocPage, Section } from '../../components/DocPage';

const BASIC_DEMO = `const [plan, setPlan] = useState('pro');

<RadioGroup value={plan} onValueChange={setPlan}>
  <Radio value="starter" label="Starter Plan" description="$19/mo per active seat" />
  <Radio value="pro" label="Professional Plan" description="$49/mo with unlimited edge functions" />
  <Radio value="enterprise" label="Enterprise Plan" description="Custom contracts, SOC-2, and dedicated support" />
</RadioGroup>`;

const CARDS_DEMO = `const [tier, setTier] = useState('team');

<RadioGroup value={tier} onValueChange={setTier}>
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
    <ChoiceCard checked={tier === 'hobby'} onClick={() => setTier('hobby')}>
      <Radio value="hobby" />
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600 }}>Hobby</div>
        <div style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0.25rem 0' }}>Free</div>
        <div style={{ fontSize: '0.8125rem', color: 'var(--pui-fg-subtle)' }}>For personal side projects.</div>
      </div>
    </ChoiceCard>

    <ChoiceCard checked={tier === 'team'} onClick={() => setTier('team')}>
      <Radio value="team" />
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 600 }}>Pro Team</span>
          <Badge tone="primary" size="sm">Popular</Badge>
        </div>
        <div style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0.25rem 0' }}>$29 <span style={{ fontSize: '0.8125rem', fontWeight: 400, color: 'var(--pui-fg-subtle)' }}>/mo</span></div>
        <div style={{ fontSize: '0.8125rem', color: 'var(--pui-fg-subtle)' }}>For growing product teams.</div>
      </div>
    </ChoiceCard>
  </div>
</RadioGroup>`;

export function RadioPage() {
  const [plan, setPlan] = useState('pro');
  const [tier, setTier] = useState('team');
  const [billing, setBilling] = useState('yearly');
  const [size, setSize] = useState('md');

  return (
    <DocPage
      eyebrow="Components"
      title="Radio"
      lede="Mutually exclusive single-choice controls organized in an accessible RadioGroup with roving keyboard arrow focus and rich selectable card styles."
      importStatement="import { Radio, RadioGroup, ChoiceCard } from 'hesh-ui';"
    >
      <Section
        title="Interactive Radio Group"
        description="Select a single option from a set of related choices."
      >
        <Showcase code={BASIC_DEMO} defaultOpen width="md">
          <div className="stack" style={{ gap: '1rem' }}>
            <RadioGroup value={plan} onValueChange={setPlan}>
              <Radio value="starter" label="Starter Plan" description="$19/mo per active seat" />
              <Radio value="pro" label="Professional Plan" description="$49/mo with unlimited edge functions" />
              <Radio value="enterprise" label="Enterprise Plan" description="Custom contracts, SOC-2 report, and dedicated support" />
              <Radio value="deprecated" label="Legacy 2023 Tier" description="No longer available for new customers" disabled />
            </RadioGroup>
          </div>
        </Showcase>
      </Section>

      <Section
        title="Selectable Radio Cards (ChoiceCard)"
        description="Transform radio inputs into high-converting pricing or option cards with responsive column wrapping."
      >
        <Showcase code={CARDS_DEMO} width="md">
          <RadioGroup value={tier} onValueChange={setTier}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', width: '100%' }}>
              <ChoiceCard checked={tier === 'hobby'} onClick={() => setTier('hobby')}>
                <Radio value="hobby" />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600 }}>Hobby</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0.25rem 0' }}>Free</div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--pui-fg-subtle)' }}>For experiments & personal sites.</div>
                </div>
              </ChoiceCard>

              <ChoiceCard checked={tier === 'team'} onClick={() => setTier('team')}>
                <Radio value="team" />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 600 }}>Pro Team</span>
                    <Badge tone="primary" size="sm">Popular</Badge>
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0.25rem 0' }}>$29 <span style={{ fontSize: '0.8125rem', fontWeight: 400, color: 'var(--pui-fg-subtle)' }}>/mo</span></div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--pui-fg-subtle)' }}>Collaborative workspaces & previews.</div>
                </div>
              </ChoiceCard>

              <ChoiceCard checked={tier === 'scale'} onClick={() => setTier('scale')}>
                <Radio value="scale" />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600 }}>Enterprise Scale</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0.25rem 0' }}>$199 <span style={{ fontSize: '0.8125rem', fontWeight: 400, color: 'var(--pui-fg-subtle)' }}>/mo</span></div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--pui-fg-subtle)' }}>Dedicated IP, 99.99% SLA, SSO.</div>
                </div>
              </ChoiceCard>
            </div>
          </RadioGroup>
        </Showcase>
      </Section>

      <Section
        title="Horizontal Radio Alignment"
        description="Place radio options inline for compact preferences such as billing intervals."
      >
        <Showcase code={`<RadioGroup className="row-wrap" ... />`} width="md">
          <RadioGroup value={billing} onValueChange={setBilling} className="row-wrap" style={{ gap: '1.5rem' }}>
            <Radio value="monthly" label="Monthly Billing" />
            <Radio
              value="yearly"
              label={
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>Annual Billing</span>
                  <Badge tone="success" size="sm">Save 20%</Badge>
                </span>
              }
            />
          </RadioGroup>
        </Showcase>
      </Section>

      <Section
        title="Sizes (sm, md, lg)"
        description="Adjust radio target sizing for compact forms or touch screens."
      >
        <Showcase code={`<Radio size="sm" ... />\n<Radio size="md" ... />\n<Radio size="lg" ... />`} width="md">
          <div className="stack" style={{ gap: '1rem' }}>
            <Radio size="sm" value="sm" label="Small radio button (sm)" checked={size === 'sm'} onChange={() => setSize('sm')} />
            <Radio size="md" value="md" label="Medium radio button (md - default)" checked={size === 'md'} onChange={() => setSize('md')} />
            <Radio size="lg" value="lg" label="Large radio button (lg)" checked={size === 'lg'} onChange={() => setSize('lg')} />
          </div>
        </Showcase>
      </Section>

      <Section title="Accessibility">
        <Callout tone="info" title="WAI-ARIA Roving Tabindex">
          Complies with the radio group keyboard interaction model. Arrow keys (<kbd className="pui-kbd">↑</kbd>, <kbd className="pui-kbd">↓</kbd>, <kbd className="pui-kbd">←</kbd>, <kbd className="pui-kbd">→</kbd>) move focus and selection between options. <kbd className="pui-kbd">Tab</kbd> enters and leaves the group as a single logical stop.
        </Callout>
      </Section>

      <Section title="API Reference">
        <PropsTable
          rows={[
            { name: 'value', type: 'string', description: 'Selected value within the group.' },
            { name: 'defaultValue', type: 'string', description: 'Initial value for uncontrolled usage.' },
            { name: 'onValueChange', type: '(val: string) => void', description: 'Callback fired when selection changes.' },
            { name: 'Radio.value', type: 'string', required: true, description: 'Unique value represented by the radio button.' },
            { name: 'Radio.label', type: 'ReactNode', description: 'Label text associated with the radio option.' },
            { name: 'Radio.description', type: 'ReactNode', description: 'Secondary descriptive text.' },
            { name: 'Radio.size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Sizing scale.' },
            { name: 'Radio.disabled', type: 'boolean', default: 'false', description: 'Disables option interaction.' },
          ]}
        />
      </Section>
    </DocPage>
  );
}
