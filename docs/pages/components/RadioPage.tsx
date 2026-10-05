import { useState } from 'react';
import { Radio, RadioGroup } from '../../../src/index';
import { Callout, PropsTable, Showcase } from '../../components/Showcase';
import { DocPage, Section } from '../../components/DocPage';

const RADIO_DEMO = `const [plan, setPlan] = useState('pro');

<RadioGroup value={plan} onValueChange={setPlan}>
  <Radio value="starter" label="Starter Plan" description="$19/mo per user" />
  <Radio value="pro" label="Professional Plan" description="$49/mo per user (recommended)" />
  <Radio value="enterprise" label="Enterprise Custom" description="Dedicated clusters and SLA" />
</RadioGroup>`;

export function RadioPage() {
  const [plan, setPlan] = useState('pro');

  return (
    <DocPage
      eyebrow="Components"
      title="Radio"
      lede="Mutually exclusive single-choice options organized in an accessible RadioGroup with roving focus arrow key navigation."
      importStatement="import { Radio, RadioGroup } from 'hesh';"
    >
      <Section
        title="Interactive Radio Group"
        description="Select a single option from a set of related choices."
      >
        <Showcase code={RADIO_DEMO} defaultOpen width="md">
          <div className="stack" style={{ gap: '1rem' }}>
            <RadioGroup value={plan} onValueChange={setPlan}>
              <Radio value="starter" label="Starter Plan" description="$19/mo per active seat" />
              <Radio value="pro" label="Professional Plan" description="$49/mo with unlimited edge functions" />
              <Radio value="enterprise" label="Enterprise Plan" description="Custom contracts, SOC-2 report, and dedicated support" />
            </RadioGroup>
          </div>
        </Showcase>
      </Section>

      <Section title="Accessibility">
        <Callout tone="info" title="WAI-ARIA Roving Tabindex">
          Complies with the radio group keyboard interaction model. Arrow keys (<kbd className="pui-kbd">↑</kbd>, <kbd className="pui-kbd">↓</kbd>, <kbd className="pui-kbd">←</kbd>, <kbd className="pui-kbd">→</kbd>) move focus and selection between options. <kbd className="pui-kbd">Tab</kbd> navigates out of the group.
        </Callout>
      </Section>

      <Section title="API Reference">
        <PropsTable
          rows={[
            { name: 'value', type: 'string', description: 'Selected value within the group.' },
            { name: 'defaultValue', type: 'string', description: 'Initial value for uncontrolled usage.' },
            { name: 'onValueChange', type: '(val: string) => void', description: 'Callback fired when selection changes.' },
            { name: 'Radio.label', type: 'ReactNode', required: true, description: 'Label text associated with the radio option.' },
            { name: 'Radio.description', type: 'ReactNode', description: 'Secondary descriptive text.' },
            { name: 'Radio.disabled', type: 'boolean', default: 'false', description: 'Disables option interaction.' },
          ]}
        />
      </Section>
    </DocPage>
  );
}
