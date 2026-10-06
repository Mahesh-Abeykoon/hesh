import { useState } from 'react';
import { Select, Badge } from '../../../src/index';
import { Callout, PropsTable, Showcase } from '../../components/Showcase';
import { DocPage, Section } from '../../components/DocPage';

const BASIC_DEMO = `const [region, setRegion] = useState('us-east');

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

const GROUPED_DEMO = `const [framework, setFramework] = useState('react');

<Select
  label="Frontend Framework"
  value={framework}
  onChange={(e) => setFramework(e.target.value)}
  options={[
    { value: 'react', label: 'React / Next.js', group: 'JavaScript / TypeScript' },
    { value: 'vue', label: 'Vue / Nuxt', group: 'JavaScript / TypeScript' },
    { value: 'svelte', label: 'Svelte / SvelteKit', group: 'JavaScript / TypeScript' },
    { value: 'django', label: 'Django', group: 'Python' },
    { value: 'fastapi', label: 'FastAPI', group: 'Python' },
    { value: 'rails', label: 'Ruby on Rails', group: 'Ruby' },
    { value: 'laravel', label: 'Laravel', group: 'PHP' },
  ]}
/>`;

const SIZES_DEMO = `<Select size="sm" label="Small (sm)" options={options} />
<Select size="md" label="Medium (md - default)" options={options} />
<Select size="lg" label="Large (lg)" options={options} />`;

export function SelectPage() {
  const [region, setRegion] = useState('us-east');
  const [framework, setFramework] = useState('react');
  const [errorVal, setErrorVal] = useState('');

  const sampleOptions = [
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' },
    { value: '3', label: 'Option 3' },
  ];

  return (
    <DocPage
      eyebrow="Components"
      title="Select"
      lede="Restyled native dropdown menu delivering 100% native operating system behavior on iOS, Android, macOS, and Windows with optgroups, sizes, and validation states."
      importStatement="import { Select } from 'hesh';"
    >
      <Section
        title="Interactive Select Menu"
        description="Renders a restyled native select element guaranteeing zero mobile zoom bugs and flawless system sheet controls."
      >
        <Showcase code={BASIC_DEMO} defaultOpen width="md">
          <div style={{ maxWidth: '24rem', width: '100%' }}>
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

      <Section
        title="Grouped Categories (optgroup)"
        description="Automatically organize items into categorized groups by specifying the group attribute on options."
      >
        <Showcase code={GROUPED_DEMO} width="md">
          <div style={{ maxWidth: '24rem', width: '100%' }}>
            <Select
              label="Frontend Framework"
              hint="Grouped into language ecosystems."
              value={framework}
              onChange={(e) => setFramework(e.target.value)}
              options={[
                { value: 'react', label: 'React / Next.js', group: 'JavaScript / TypeScript' },
                { value: 'vue', label: 'Vue / Nuxt', group: 'JavaScript / TypeScript' },
                { value: 'svelte', label: 'Svelte / SvelteKit', group: 'JavaScript / TypeScript' },
                { value: 'django', label: 'Django', group: 'Python' },
                { value: 'fastapi', label: 'FastAPI', group: 'Python' },
                { value: 'rails', label: 'Ruby on Rails', group: 'Ruby' },
                { value: 'laravel', label: 'Laravel', group: 'PHP' },
              ]}
            />
          </div>
        </Showcase>
      </Section>

      <Section
        title="Sizes (sm, md, lg)"
        description="Choose small for dense table filter toolbars, medium for general forms, and large for prominent signups."
      >
        <Showcase code={SIZES_DEMO} width="md">
          <div className="stack" style={{ gap: '1.25rem', maxWidth: '24rem', width: '100%' }}>
            <Select size="sm" label="Small Select (sm)" options={sampleOptions} />
            <Select size="md" label="Medium Select (md - Default)" options={sampleOptions} />
            <Select size="lg" label="Large Select (lg)" options={sampleOptions} />
          </div>
        </Showcase>
      </Section>

      <Section
        title="Validation & Disabled States"
        description="Communicate input errors with red borders and assistive screen reader alerts."
      >
        <Showcase code={`<Select error="Please select an active cluster." ... />`} width="md">
          <div className="stack" style={{ gap: '1.25rem', maxWidth: '24rem', width: '100%' }}>
            <Select
              label="Primary Database Cluster"
              placeholder="Select a cluster..."
              value={errorVal}
              onChange={(e) => setErrorVal(e.target.value)}
              error={!errorVal ? 'Please choose an active database cluster to attach.' : undefined}
              options={[
                { value: 'pg-main', label: 'PostgreSQL Primary (Active)' },
                { value: 'redis-cache', label: 'Redis Cluster (Active)' },
                { value: 'mongo-doc', label: 'MongoDB Replica (Paused)', disabled: true },
              ]}
            />
            <Select
              label="Archived Storage Tier"
              disabled
              options={[{ value: 'glacier', label: 'S3 Glacier Deep Archive' }]}
            />
          </div>
        </Showcase>
      </Section>

      <Section title="Guidance">
        <Callout tone="info" title="Select vs. Combobox">
          Use <strong>Select</strong> for static collections under 15–20 items where native mobile scrolling pickers shine. Use <strong>Combobox</strong> when users need live keyword searching, multi-select tags, or async remote API lookups.
        </Callout>
      </Section>

      <Section title="API Reference">
        <PropsTable
          rows={[
            { name: 'options', type: 'SelectOption[]', required: true, description: 'List of { value: string, label: string, group?: string, disabled?: boolean }.' },
            { name: 'label', type: 'ReactNode', description: 'Associated label element.' },
            { name: 'hint', type: 'ReactNode', description: 'Supplementary hint message.' },
            { name: 'error', type: 'ReactNode', description: 'Validation error text.' },
            { name: 'placeholder', type: 'string', description: 'Initial disabled option text.' },
            { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Control height and typography scale.' },
            { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables user input.' },
          ]}
        />
      </Section>
    </DocPage>
  );
}
