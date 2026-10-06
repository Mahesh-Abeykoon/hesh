import { useState } from 'react';
import { TagInput } from '../../../src/index';
import { Callout, PropsTable, Showcase } from '../../components/Showcase';
import { DocPage, Section } from '../../components/DocPage';

const DEMO_BASIC = `const [tags, setTags] = useState(['React', 'TypeScript', 'Design Systems']);

<TagInput
  value={tags}
  onChange={setTags}
  placeholder="Add technology…"
/>`;

const DEMO_EMAIL = `// Email tag input with max 5 recipients
<TagInput
  value={emails}
  onChange={setEmails}
  maxTags={5}
  placeholder="Type email and press Enter…"
/>`;

const DEMO_ADDBLUR = `// Adds the pending text as a tag when focus leaves
<TagInput
  value={skills}
  onChange={setSkills}
  addOnBlur
  placeholder="Type a skill…"
/>`;

export function TagInputPage() {
  const [tags, setTags] = useState(['React', 'TypeScript', 'Design Systems']);
  const [emails, setEmails] = useState(['alex@linear.app', 'elena@stripe.com']);
  const [skills, setSkills] = useState(['Communication', 'Problem Solving']);
  const [limited, setLimited] = useState(['Figma', 'Framer']);

  return (
    <DocPage
      eyebrow="Components"
      title="TagInput"
      lede="Chip-based input for tags, keyword filters, and multi-recipient lists. Press Enter or comma to add; Backspace on an empty input removes the last chip."
      importStatement="import { TagInput } from 'hesh';"
    >
      {/* ── Basic ── */}
      <Section
        title="Technology Stack Tags"
        description="Type a word and press Enter or comma (,) to create a chip. Click the × icon or press Backspace on an empty input to remove the last tag."
        code={DEMO_BASIC}
      >
        <Showcase>
          <div style={{ width: '100%', maxWidth: 480 }}>
            <div style={{ fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.375rem', color: 'var(--pui-fg)' }}>
              Skills & Technologies
            </div>
            <TagInput
              value={tags}
              onChange={setTags}
              placeholder="Add tech stack…"
            />
            <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--pui-fg-subtle)' }}>
              {tags.length} tag{tags.length !== 1 ? 's' : ''} · Press <kbd>Enter</kbd> or <kbd>,</kbd> to add
            </div>
          </div>
        </Showcase>
      </Section>

      {/* ── Email Recipients with Max ── */}
      <Section
        title="Email Recipients with Cap"
        description="Use maxTags to limit the number of entries. The input locks when the limit is reached."
        code={DEMO_EMAIL}
      >
        <Showcase>
          <div style={{ width: '100%', maxWidth: 480 }}>
            <div style={{ fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.375rem', color: 'var(--pui-fg)' }}>
              Invite Colleagues (Max 5)
            </div>
            <TagInput
              value={emails}
              onChange={setEmails}
              maxTags={5}
              placeholder="Type email and press Enter…"
            />
            <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--pui-fg-subtle)' }}>
              {emails.length} / 5 recipients
            </div>
          </div>
        </Showcase>
      </Section>

      {/* ── Max 2 tags (full lockout demo) ── */}
      <Section
        title="Strict Limit (Full Lock)"
        description="When the cap is hit the input placeholder changes to signal no more entries can be added."
        code={`<TagInput value={tags} onChange={setTags} maxTags={2} placeholder="Max 2 tags" />`}
      >
        <Showcase>
          <div style={{ width: '100%', maxWidth: 480 }}>
            <TagInput
              value={limited}
              onChange={setLimited}
              maxTags={2}
              placeholder="Max 2 tags"
            />
          </div>
        </Showcase>
      </Section>

      {/* ── addOnBlur ── */}
      <Section
        title="Add on Blur"
        description="Set addOnBlur to commit the pending text as a tag when the field loses focus — handy for form submission workflows."
        code={DEMO_ADDBLUR}
      >
        <Showcase>
          <div style={{ width: '100%', maxWidth: 480 }}>
            <TagInput
              value={skills}
              onChange={setSkills}
              addOnBlur
              placeholder="Type a skill and tab away…"
            />
          </div>
        </Showcase>
      </Section>

      {/* ── Disabled ── */}
      <Section
        title="Disabled"
        description="The disabled prop renders all chips as read-only and blocks new entries."
        code={`<TagInput value={['Locked', 'Read-only']} onChange={() => {}} disabled />`}
      >
        <Showcase>
          <div style={{ width: '100%', maxWidth: 480 }}>
            <TagInput
              value={['Locked', 'Read-only', 'Cannot Edit']}
              onChange={() => { }}
              disabled
            />
          </div>
        </Showcase>
      </Section>

      <Callout type="tip" title="Delimiter characters">
        By default, pressing <kbd>Enter</kbd> or <kbd>,</kbd> creates a new tag. The component
        strips leading/trailing whitespace and skips blank entries automatically.
        Duplicates are ignored unless you set <code>allowDuplicates</code>.
      </Callout>

      <Section title="API Reference">
        <PropsTable
          rows={[
            { name: 'value', type: 'string[]', description: 'Controlled array of tag strings.' },
            { name: 'onChange', type: '(tags: string[]) => void', description: 'Fires when tags are added or removed.' },
            { name: 'maxTags', type: 'number', description: 'Maximum number of allowed tags.' },
            { name: 'allowDuplicates', type: 'boolean', default: 'false', description: 'Whether identical tags can be added.' },
            { name: 'addOnBlur', type: 'boolean', default: 'false', description: 'Commits pending input as a tag on blur.' },
            { name: 'placeholder', type: 'string', default: '"Add tag…"', description: 'Input placeholder text.' },
            { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables adding or removing tags.' },
          ]}
        />
      </Section>
    </DocPage>
  );
}
