import { useState } from 'react';
import { Input, SearchIcon } from '../../../src/index';
import { Callout, PropsTable, Showcase } from '../../components/Showcase';
import { DocPage, Section } from '../../components/DocPage';

const BASIC_DEMO = `<Input
  label="Workspace subdomain"
  hint="Lowercase letters, numbers, and dashes only."
  placeholder="acme-corp"
  rightAddon=".hesh.dev"
/>

<Input
  label="Custom API Endpoint"
  leftAddon="https://"
  placeholder="api.company.com/v1"
/>

<Input
  label="Account Email"
  error="Please enter a valid work email address"
  defaultValue="invalid-email@"
/>`;

const CLEARABLE_DEMO = `const [searchQuery, setSearchQuery] = useState('Production Kubernetes');

<Input
  label="Search projects"
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
  clearable
  onClear={() => setSearchQuery('')}
  leftAddon={<SearchIcon size={16} />}
/>`;

export function InputPage() {
  const [subdomain, setSubdomain] = useState('acme-corp');
  const [search, setSearch] = useState('Design Systems');

  return (
    <DocPage
      eyebrow="Components"
      title="Input"
      lede="Text field with built-in accessible label association, helper hints, error validation, affixes, sizes, and clear actions."
      importStatement="import { Input } from 'hesh';"
    >
      <Section
        title="1. Labels, Add-ons & Validation States"
        description="Handles automatic ARIA label and error announcement wiring, plus prefix/suffix add-on attachments."
      >
        <Showcase code={BASIC_DEMO} defaultOpen width="md">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%', maxWidth: '380px' }}>
            <Input
              label="Workspace subdomain"
              hint="Lowercase letters, numbers, and dashes only."
              value={subdomain}
              onChange={(e) => setSubdomain(e.target.value)}
              placeholder="acme-corp"
              rightAddon=".hesh.dev"
            />
            <Input
              label="Custom API Endpoint"
              leftAddon="https://"
              placeholder="api.company.com/v1"
            />
            <Input
              label="Account Email"
              error="Please enter a valid work email address"
              defaultValue="invalid-email@"
            />
          </div>
        </Showcase>
      </Section>

      <Section
        title="2. Clearable Search Input"
        description="Includes an interactive clear button that appears when text is entered, resetting value on click."
      >
        <Showcase code={CLEARABLE_DEMO} width="md">
          <div style={{ width: '100%', maxWidth: '380px' }}>
            <Input
              label="Search projects"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              clearable
              onClear={() => setSearch('')}
              leftAddon={<SearchIcon size={16} />}
              placeholder="Type to filter..."
            />
            <span className="cell-sub" style={{ display: 'block', marginTop: '0.5rem' }}>
              Current query: <strong>{search || '(empty)'}</strong>
            </span>
          </div>
        </Showcase>
      </Section>

      <Section
        title="3. Field Sizes"
        description="Three calibrated input sizes: Small (sm, 32px), Medium (md, 38px), and Large (lg, 46px)."
      >
        <Showcase
          code={`<Input size="sm" placeholder="Small input (sm)" />
<Input size="md" placeholder="Medium input (md)" />
<Input size="lg" placeholder="Large input (lg)" />`}
          width="md"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: '380px' }}>
            <Input size="sm" placeholder="Small input (32px)" />
            <Input size="md" placeholder="Medium default input (38px)" />
            <Input size="lg" placeholder="Large input (46px)" />
          </div>
        </Showcase>
      </Section>

      <Section
        title="4. Disabled & Read-Only States"
        description="Disabled inputs prevent interaction and are grayed out; read-only fields remain selectable for copying."
      >
        <Showcase
          code={`<Input label="Read-only Deployment ID" value="dep_01H8Z7W3" readOnly />
<Input label="Disabled Setting" defaultValue="Managed by Organization" disabled />`}
          width="md"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%', maxWidth: '380px' }}>
            <Input label="Read-only Deployment ID" value="dep_01H8Z7W3" readOnly />
            <Input label="Disabled Setting" defaultValue="Managed by Organization" disabled />
          </div>
        </Showcase>
      </Section>

      <Callout tone="info" title="Automatic ID & ARIA Wiring">
        When <code>label</code>, <code>hint</code>, or <code>error</code> props are provided, unique IDs are automatically generated and linked via <code>htmlFor</code>, <code>aria-describedby</code>, and <code>aria-invalid="true"</code>.
      </Callout>

      <Section title="Props Reference">
        <PropsTable
          items={[
            { name: 'label', type: 'ReactNode', description: 'Associated label displayed above the field.' },
            { name: 'hint', type: 'ReactNode', description: 'Informational message displayed below the input.' },
            { name: 'error', type: 'ReactNode', description: 'Error message with assertive aria announcement.' },
            { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Field height and font scale.' },
            { name: 'leftAddon', type: 'ReactNode', description: 'Prefix adornment attached to input.' },
            { name: 'rightAddon', type: 'ReactNode', description: 'Suffix adornment attached to input.' },
            { name: 'clearable', type: 'boolean', default: 'false', description: 'Display 1-click clear button when input has value.' },
            { name: 'onClear', type: '() => void', description: 'Callback fired when clear button is clicked.' },
            { name: 'required', type: 'boolean', default: 'false', description: 'Marks field as required with asterisk.' },
          ]}
        />
      </Section>
    </DocPage>
  );
}
