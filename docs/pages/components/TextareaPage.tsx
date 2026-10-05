import { useState } from 'react';
import { Textarea } from '../../../src/index';
import { Callout, PropsTable, Showcase } from '../../components/Showcase';
import { DocPage, Section } from '../../components/DocPage';

const TEXTAREA_DEMO = `const [notes, setNotes] = useState('');

<Textarea
  label="Release Notes"
  hint="Supports standard GitHub-flavored markdown syntax."
  placeholder="Summarize bug fixes, new features, and breaking changes…"
  rows={4}
  value={notes}
  onChange={(e) => setNotes(e.target.value)}
/>

<Textarea
  label="Project Description"
  error="Description cannot exceed 280 characters."
  defaultValue="Too long text here..."
/>`;

export function TextareaPage() {
  const [notes, setNotes] = useState('');

  return (
    <DocPage
      eyebrow="Components"
      title="Textarea"
      lede="Multi-line plain text editing field with label association, validation feedback, and auto-growing capabilities."
      importStatement="import { Textarea } from 'hesh';"
    >
      <Section
        title="Multi-line Text Field"
        description="Handles multi-line user input with accessible labels and validation error messaging."
      >
        <Showcase code={TEXTAREA_DEMO} defaultOpen width="md">
          <div className="stack" style={{ gap: '1.25rem' }}>
            <Textarea
              label="Release Notes"
              hint="Supports standard GitHub-flavored markdown syntax."
              placeholder="Summarize bug fixes, new features, and breaking changes…"
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            <Textarea
              label="Project Description"
              error="Description cannot exceed 280 characters."
              defaultValue="Invalid project description exceeding limits."
            />
          </div>
        </Showcase>
      </Section>

      <Section title="API Reference">
        <PropsTable
          rows={[
            { name: 'label', type: 'ReactNode', description: 'Associated label displayed above the textarea.' },
            { name: 'hint', type: 'ReactNode', description: 'Informational message below the textarea.' },
            { name: 'error', type: 'ReactNode', description: 'Validation error text.' },
            { name: 'rows', type: 'number', default: '3', description: 'Default visible text rows.' },
            { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables user input.' },
          ]}
        />
      </Section>
    </DocPage>
  );
}
