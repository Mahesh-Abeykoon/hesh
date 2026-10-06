import { useState } from 'react';
import { Textarea } from '../../../src/index';
import { Callout, PropsTable, Showcase } from '../../components/Showcase';
import { DocPage, Section } from '../../components/DocPage';
import { TextareaWorkbench } from '../../components/PropsWorkbench';

const TEXTAREA_DEMO = `const [notes, setNotes] = useState('');

<Textarea
  label="Release Notes"
  hint="Supports GitHub-flavored markdown syntax."
  placeholder="Summarize bug fixes, new features…"
  rows={4}
  value={notes}
  onChange={(e) => setNotes(e.target.value)}
/>`;

const COUNT_DEMO = `<Textarea
  label="Bio"
  placeholder="Tell us about yourself…"
  maxLength={160}
  showCount
  rows={3}
/>

{/* Approaching limit (≥90%) – counter turns amber */}
<Textarea
  label="Tweet"
  maxLength={280}
  showCount
  rows={3}
  defaultValue={'A'.repeat(260)}
/>

{/* Exceeded – counter turns red */}
<Textarea
  label="Exceeded"
  maxLength={50}
  showCount
  rows={2}
  defaultValue={'Way too long content that clearly exceeds the fifty character limit.'}
/>`;

const SIZES_DEMO = `<Textarea label="Small"  size="sm" rows={2} placeholder="sm" />
<Textarea label="Medium" size="md" rows={3} placeholder="md (default)" />
<Textarea label="Large"  size="lg" rows={4} placeholder="lg" />`;

const ERROR_DEMO = `<Textarea
  label="Project Description"
  error="Description must be between 30 and 280 characters."
  defaultValue="Too short."
/>`;

export function TextareaPage() {
  const [notes, setNotes] = useState('');
  const [bio, setBio] = useState('');

  return (
    <DocPage
      eyebrow="Components"
      title="Textarea"
      lede="Multi-line plain text field with label association, live character counter, size variants, and validation feedback."
      importStatement="import { Textarea } from 'hesh';"
    >
      {/* ── Interactive Props Workbench ── */}
      <Section
        title="Interactive Props Workbench"
        description="Configure rows, character counters, validation states, and sizes with real-time code generation."
      >
        <TextareaWorkbench />
      </Section>

      {/* ── Basic ── */}
      <Section
        title="Basic Textarea"
        description="Use label, hint, placeholder, and rows to define a standard multi-line input."
        code={TEXTAREA_DEMO}
      >
        <Showcase>
          <div style={{ width: '100%', maxWidth: 480 }}>
            <Textarea
              label="Release Notes"
              hint="Supports standard GitHub-flavored markdown syntax."
              placeholder="Summarize bug fixes, new features…"
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </Showcase>
      </Section>

      {/* ── Character counter ── */}
      <Section
        title="Character Counter"
        description="Add maxLength + showCount to show a live counter badge. Turns amber at 90% usage, red when exceeded."
        code={COUNT_DEMO}
      >
        <Showcase>
          <div style={{ width: '100%', maxWidth: 480, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <Textarea
              label="Bio (160 chars)"
              placeholder="Tell us about yourself…"
              maxLength={160}
              showCount
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
            <Textarea
              label="Tweet – near limit (amber)"
              maxLength={280}
              showCount
              rows={3}
              defaultValue={'A'.repeat(260)}
            />
            <Textarea
              label="Exceeded limit (red)"
              maxLength={50}
              showCount
              rows={2}
              defaultValue="Way too long content that clearly exceeds the fifty character maximum limit set on this field."
            />
          </div>
        </Showcase>
      </Section>

      {/* ── Sizes ── */}
      <Section
        title="Size Variants"
        description="Three sizes — sm, md (default), lg — scale the font size and padding uniformly."
        code={SIZES_DEMO}
      >
        <Showcase>
          <div style={{ width: '100%', maxWidth: 480, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <Textarea label="Small"  size="sm" placeholder="sm textarea" rows={2} />
            <Textarea label="Medium" size="md" placeholder="md textarea (default)" rows={3} />
            <Textarea label="Large"  size="lg" placeholder="lg textarea" rows={4} />
          </div>
        </Showcase>
      </Section>

      {/* ── Error state ── */}
      <Section
        title="Validation Error"
        description="Pass an error string to show inline feedback. The border, label, and icon all switch to the danger colour."
        code={ERROR_DEMO}
      >
        <Showcase>
          <div style={{ width: '100%', maxWidth: 480 }}>
            <Textarea
              label="Project Description"
              error="Description must be between 30 and 280 characters."
              defaultValue="Too short."
            />
          </div>
        </Showcase>
      </Section>

      {/* ── Optional ── */}
      <Section
        title="Optional Field"
        description="Add optionalText to surface a subdued badge next to the label for clearly optional fields."
        code={`<Textarea
  label="Additional Comments"
  optionalText="optional"
  hint="We read every message carefully."
  placeholder="Anything else you'd like to share?"
  rows={3}
/>`}
      >
        <Showcase>
          <div style={{ width: '100%', maxWidth: 480 }}>
            <Textarea
              label="Additional Comments"
              optionalText="optional"
              hint="We read every message carefully."
              placeholder="Anything else you'd like to share?"
              rows={3}
            />
          </div>
        </Showcase>
      </Section>

      {/* ── Disabled ── */}
      <Section
        title="Disabled"
        description="The disabled prop mutes the field and blocks all user interaction."
        code={`<Textarea label="Read-only notes" disabled defaultValue="This field is locked." rows={3} />`}
      >
        <Showcase>
          <div style={{ width: '100%', maxWidth: 480 }}>
            <Textarea
              label="Read-only notes"
              disabled
              defaultValue="This field is locked and cannot be edited."
              rows={3}
            />
          </div>
        </Showcase>
      </Section>

      <Callout type="tip" title="Auto-grow with CSS">
        For a textarea that grows with its content without JavaScript, use:
        {' '}<code>{'textarea { resize: none; field-sizing: content; min-height: 80px; }'}</code>
        {' '}The native <code>field-sizing: content</code> is supported in Chrome 123+ and Firefox 129+.
      </Callout>

      <Section title="API Reference">
        <PropsTable
          rows={[
            { name: 'label',        type: 'ReactNode',                    description: 'Visible label above the textarea.' },
            { name: 'hint',         type: 'ReactNode',                    description: 'Helper text below the field.' },
            { name: 'error',        type: 'ReactNode',                    description: 'Error message – turns border and label red.' },
            { name: 'required',     type: 'boolean',                      description: 'Marks field required, appends asterisk to label.' },
            { name: 'optionalText', type: 'string',                       description: 'Badge text when the field is optional.' },
            { name: 'size',         type: '"sm" | "md" | "lg"',           default: '"md"',   description: 'Controls font-size and padding.' },
            { name: 'rows',         type: 'number',                       default: '4',      description: 'Number of visible text rows.' },
            { name: 'maxLength',    type: 'number',                       description: 'Hard character limit. Pairs with showCount for the counter badge.' },
            { name: 'showCount',    type: 'boolean',                      default: 'false',  description: 'Shows live character counter. Turns amber at ≥90%, red when exceeded.' },
            { name: 'value',        type: 'string',                       description: 'Controlled value.' },
            { name: 'defaultValue', type: 'string',                       description: 'Uncontrolled initial value.' },
            { name: 'onChange',     type: 'ChangeEventHandler<textarea>', description: 'Fires on every keystroke.' },
            { name: 'disabled',     type: 'boolean',                      description: 'Mutes field and blocks interaction.' },
            { name: 'placeholder',  type: 'string',                       description: 'Ghost text shown when the field is empty.' },
          ]}
        />
      </Section>
    </DocPage>
  );
}
