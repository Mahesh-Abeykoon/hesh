import { useState } from 'react';
import { Checkbox } from '../../../src/index';
import { Callout, PropsTable, Showcase } from '../../components/Showcase';
import { DocPage, Section } from '../../components/DocPage';

const CHECKBOX_DEMO = `const [agreed, setAgreed] = useState(false);

<Checkbox
  label="I agree to the terms of service"
  description="You can unsubscribe at any time."
  checked={agreed}
  onChange={(e) => setAgreed(e.target.checked)}
/>

<Checkbox label="Remember this device" defaultChecked />
<Checkbox label="Admin privileges" indeterminate />
<Checkbox label="Disabled option" disabled />`;

export function CheckboxPage() {
  const [agreed, setAgreed] = useState(false);
  const [indeterminate, setIndeterminate] = useState(true);

  return (
    <DocPage
      eyebrow="Components"
      title="Checkbox"
      lede="Control that allows users to select one or more items, with support for indeterminate states, helper text, and validation."
      importStatement="import { Checkbox } from 'hesh';"
    >
      <Section
        title="Interactive Checkboxes"
        description="Supports boolean checked states, indeterminate (mixed) state, and supplementary descriptions."
      >
        <Showcase code={CHECKBOX_DEMO} defaultOpen width="md">
          <div className="stack" style={{ gap: '1rem' }}>
            <Checkbox
              label="I agree to the terms and privacy policy"
              description="You will receive critical security announcements by email."
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            <Checkbox label="Remember this workstation" defaultChecked />
            <Checkbox
              label="Indeterminate permissions"
              description="Indicates a partially selected parent folder or permissions set."
              indeterminate={indeterminate}
              onChange={() => setIndeterminate(false)}
            />
            <Checkbox label="Disabled permission" disabled />
          </div>
        </Showcase>
      </Section>

      <Section title="Accessibility">
        <Callout tone="info" title="Native Form Association">
          Built on top of native <code>&lt;input type="checkbox"&gt;</code> wrapped with associated labels and <code>aria-describedby</code> attributes. Standard spacebar toggling and keyboard focus indicators work out of the box.
        </Callout>
      </Section>

      <Section title="API Reference">
        <PropsTable
          rows={[
            { name: 'label', type: 'ReactNode', description: 'Primary label text associated with the checkbox.' },
            { name: 'description', type: 'ReactNode', description: 'Supplementary description placed below the label.' },
            { name: 'checked', type: 'boolean', description: 'Controlled checked boolean.' },
            { name: 'indeterminate', type: 'boolean', default: 'false', description: 'Renders minus/dash indeterminate icon.' },
            { name: 'disabled', type: 'boolean', default: 'false', description: 'Prevents user interaction.' },
            { name: 'onChange', type: '(e: ChangeEvent) => void', description: 'Standard native change event handler.' },
          ]}
        />
      </Section>
    </DocPage>
  );
}
