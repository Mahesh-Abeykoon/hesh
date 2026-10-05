import { useState } from 'react';
import { TagInput } from '../../../src/index';
import { Callout, PropsTable, Showcase } from '../../components/Showcase';
import { DocPage, Section } from '../../components/DocPage';

const DEMO = `const [tags, setTags] = useState(['React', 'TypeScript', 'Design Systems']);

<TagInput
  value={tags}
  onChange={setTags}
  placeholder="Add technology..."
/>`;

export function TagInputPage() {
  const [tags, setTags] = useState(['React', 'TypeScript', 'Design Systems']);
  const [emails, setEmails] = useState(['alex@linear.app', 'elena@stripe.com']);

  return (
    <DocPage
      eyebrow="Components"
      title="TagInput"
      lede="An interactive chip-based input field for tags, keyword filters, and multi-recipient lists with automatic keyboard creation and removal."
      importStatement="import { TagInput } from 'hesh';"
    >
      <Section
        title="Interactive Tag Creation"
        description="Type a word and press Enter or comma. Press Backspace with an empty input to delete the most recent chip."
      >
        <Showcase code={DEMO} defaultOpen width="md">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: '28rem', margin: '0 auto', boxSizing: 'border-box' }}>
            <div>
              <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--pui-fg)', marginBottom: '0.375rem' }}>
                Skills & Technologies
              </div>
              <TagInput
                value={tags}
                onChange={setTags}
                placeholder="Add tech stack..."
              />
            </div>

            <div style={{ fontSize: '0.75rem', color: 'var(--pui-fg-muted)' }}>
              Tags count: <strong>{tags.length}</strong> · Press <kbd>Enter</kbd> or <kbd>,</kbd> to submit
            </div>
          </div>
        </Showcase>
      </Section>

      <Section
        title="Max Limit & Email Recipients"
        description="Constrain total allowed tags with maxTags."
      >
        <div style={{ maxWidth: '28rem', width: '100%', boxSizing: 'border-box' }}>
          <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--pui-fg)', marginBottom: '0.375rem' }}>
            Invite Colleagues (Max 3)
          </div>
          <TagInput
            value={emails}
            onChange={setEmails}
            maxTags={3}
            placeholder="Type email address..."
          />
        </div>
      </Section>

      <Section title="API Reference">
        <PropsTable
          rows={[
            { name: 'value', type: 'string[]', description: 'Controlled array of tags.' },
            { name: 'onChange', type: '(tags: string[]) => void', description: 'Callback fired when tags are added or removed.' },
            { name: 'maxTags', type: 'number', description: 'Maximum allowed tags.' },
            { name: 'allowDuplicates', type: 'boolean', default: 'false', description: 'Whether identical tags can be added.' },
            { name: 'addOnBlur', type: 'boolean', default: 'false', description: 'Adds pending input as tag when focus leaves.' },
            { name: 'placeholder', type: 'string', default: "'Add tag...'", description: 'Input placeholder.' },
            { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables editing.' },
          ]}
        />
      </Section>
    </DocPage>
  );
}
