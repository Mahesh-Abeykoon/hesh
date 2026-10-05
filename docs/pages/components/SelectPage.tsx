import { useState } from 'react';
import { Select } from '../../../src/index';
import { Callout, PropsTable, Showcase } from '../../components/Showcase';
import { DocPage, Section } from '../../components/DocPage';

const SELECT_DEMO = `const [region, setRegion] = useState('us-east');

<Select
  label="Deployment Region"
  hint="Select the data center closest to your user base."
  value={region}
  onChange={(e) => setRegion(e.target.value)}
  options={[
    { value: 'us-east', label: 'US East (N. Virginia)' },
    { value: 'us-west', label: 'US West (Oregon)' },
    { value: 'eu-west', label: 'Europe (Frankfurt)' },
    { value: 'ap-east', label: 'Asia Pacific (Tokyo)' },
  ]}
/>`;

export function SelectPage() {
  const [region, setRegion] = useState('us-east');

  return (
    <DocPage
      eyebrow="Components"
      title="Select"
      lede="Native dropdown menu with custom chevron styling, full accessibility, hint descriptions, and validation states."
      importStatement="import { Select } from 'hesh';"
    >
      <Section
        title="Interactive Select Menu"
        description="Renders a restyled native select element guaranteeing 100% platform-native behavior and accessibility across mobile and desktop."
      >
        <Showcase code={SELECT_DEMO} defaultOpen width="md">
          <div style={{ maxWidth: '24rem', margin: '0 auto' }}>
            <Select
              label="Deployment Region"
              hint="Select the data center closest to your user base."
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              options={[
                { value: 'us-east', label: 'US East (N. Virginia)' },
                { value: 'us-west', label: 'US West (Oregon)' },
                { value: 'eu-west', label: 'Europe (Frankfurt)' },
                { value: 'ap-east', label: 'Asia Pacific (Tokyo)' },
              ]}
            />
          </div>
        </Showcase>
      </Section>

      <Section title="API Reference">
        <PropsTable
          rows={[
            { name: 'options', type: 'SelectOption[]', required: true, description: 'List of { value: string, label: string, disabled?: boolean }.' },
            { name: 'label', type: 'ReactNode', description: 'Associated label element.' },
            { name: 'hint', type: 'ReactNode', description: 'Supplementary hint message.' },
            { name: 'error', type: 'ReactNode', description: 'Validation error text.' },
            { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables user input.' },
          ]}
        />
      </Section>
    </DocPage>
  );
}
