import { useState } from 'react';
import { Input } from '../../../src/index';
import { Callout, PropsTable, Showcase } from '../../components/Showcase';
import { DocPage, Section } from '../../components/DocPage';

const INPUT_DEMO = `<Input
  label="Workspace subdomain"
  hint="Letters, numbers and hyphens only."
  placeholder="acme-corp"
  suffix=".hesh.dev"
/>

<Input
  label="API Key"
  error="Invalid key format. Expected hesh_live_..."
  defaultValue="invalid_key"
/>

<Input
  label="Read-only token"
  defaultValue="tok_live_94829103"
  readOnly
/>`;

export function InputPage() {
  const [val, setVal] = useState('acme-corp');

  return (
    <DocPage
      eyebrow="Components"
      title="Input"
      lede="Text field with built-in accessible label association, helper hints, error validation messaging, and prefix/suffix add-ons."
      importStatement="import { Input } from 'hesh';"
    >
      <Section
        title="Form Field States"
        description="Handles focus rings, error states, hint descriptions, and input adornments."
      >
        <Showcase code={INPUT_DEMO} defaultOpen width="md">
          <div className="stack" style={{ gap: '1.25rem' }}>
            <Input
              label="Workspace subdomain"
              hint="Letters, numbers and hyphens only."
              value={val}
              onChange={(e) => setVal(e.target.value)}
              placeholder="acme-corp"
              rightAddon=".hesh.dev"
            />
            <Input
              label="Secret API Key"
              error="Invalid key format. Expected hesh_live_..."
              defaultValue="invalid_key"
            />
            <Input
              label="Read-only deployment token"
              defaultValue="tok_live_94829103"
              readOnly
            />
          </div>
        </Showcase>
      </Section>

      <Section title="Accessibility">
        <Callout tone="info" title="Automatic ID & ARIA Wiring">
          When <code>label</code>, <code>hint</code>, or <code>error</code> props are provided, unique IDs are automatically assigned and linked via <code>htmlFor</code>, <code>aria-describedby</code>, and <code>aria-invalid="true"</code>.
        </Callout>
      </Section>

      <Section title="API Reference">
        <PropsTable
          rows={[
            { name: 'label', type: 'ReactNode', description: 'Associated label displayed above the field.' },
            { name: 'hint', type: 'ReactNode', description: 'Informational message displayed below the input.' },
            { name: 'error', type: 'ReactNode', description: 'Error message with assertive aria announcement.' },
            { name: 'prefix', type: 'ReactNode', description: 'Element placed inside the leading edge of the input.' },
            { name: 'suffix', type: 'ReactNode', description: 'Element placed inside the trailing edge of the input.' },
          ]}
        />
      </Section>
    </DocPage>
  );
}
