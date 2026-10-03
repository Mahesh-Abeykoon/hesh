import { useState } from 'react';
import { Input, Textarea, Select, MailIcon, SearchIcon } from '../../src/index';
import { Callout, PropsTable, Showcase } from '../components/Showcase';
import { DocPage, Section } from '../components/DocPage';

const BASIC = `import { Input } from 'hesh';

<Input label="Work email" type="email" placeholder="you@company.com" required />
<Input
  label="Password"
  type="password"
  hint="At least 12 characters."
/>
<Input
  label="Subdomain"
  error="That subdomain is already taken."
  defaultValue="acme"
/>`;

const AFFIX = `<Input
  label="Search"
  placeholder="Search customers…"
  leftAddon={<SearchIcon />}
/>

<Input
  label="Website"
  placeholder="acme.com"
  rightAddon={<span>.com</span>}
/>`;

const SELECT = `<Select
  label="Plan"
  defaultValue="growth"
  options={[
    { value: 'starter', label: 'Starter — $19/mo' },
    { value: 'growth', label: 'Growth — $49/mo' },
    { value: 'scale', label: 'Scale — $149/mo', disabled: true },
  ]}
/>`;

const TEXTAREA = `<Textarea
  label="Release notes"
  rows={5}
  hint="Markdown is supported."
  placeholder="What changed in this release?"
/>`;

export function InputsPage() {
  const [email, setEmail] = useState('not-an-email');
  const [bio, setBio] = useState('');

  const emailError =
    email.length > 0 && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)
      ? 'Enter a valid email address.'
      : undefined;

  return (
    <DocPage
      eyebrow="Forms"
      title="Input · Textarea · Select"
      lede="Field components that own their label, hint and error wiring. Every control associates its description and error message automatically, so screen readers announce validation without extra props."
    >
      <Section title="Anatomy" description="Label, control, then hint or error. Errors replace hints so the field never shows two lines of competing guidance.">
        <Showcase code={BASIC} defaultOpen width="md">
          <div className="stack">
            <Input
              label="Work email"
              type="email"
              placeholder="you@company.com"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              error={emailError}
              hint="We'll only use this for account notifications."
            />
            <Input label="Password" type="password" hint="At least 12 characters." />
            <Input label="Subdomain" error="That subdomain is already taken." defaultValue="acme" />
          </div>
        </Showcase>
        <Callout tone="success" title="Validation is wired for you">
          When <code>error</code> is set, the component sets <code>aria-invalid</code>,
          points <code>aria-describedby</code> at the message, and gives the message{' '}
          <code>role="alert"</code> so it is announced when it appears.
        </Callout>
      </Section>

      <Section title="Affixes" description="Icons or inline text inside the control. Padding is applied by the wrapper, so the value never sits under the icon.">
        <Showcase code={AFFIX} width="md">
          <div className="stack">
            <Input label="Search" placeholder="Search customers…" leftAddon={<SearchIcon />} />
            <Input label="Website" placeholder="acme" rightAddon={<span>.com</span>} />
            <Input
              label="Email"
              type="email"
              placeholder="you@company.com"
              leftAddon={<MailIcon />}
              hint="We'll send a verification link."
            />
          </div>
        </Showcase>
      </Section>

      <Section title="States">
        <Showcase width="md">
          <div className="stack">
            <Input label="Default" placeholder="Placeholder text" />
            <Input label="Focused" placeholder="Tab into me" autoFocus={false} />
            <Input label="With value" defaultValue="Ada Lovelace" />
            <Input label="Disabled" placeholder="Unavailable" disabled />
            <Input label="Read only" defaultValue="acme-inc" readOnly />
            <Input label="Invalid" defaultValue="123" error="Must contain at least one letter." />
          </div>
        </Showcase>
      </Section>

      <Section title="Textarea">
        <Showcase code={TEXTAREA} width="md">
          <Textarea
            label="Release notes"
            rows={5}
            hint="Markdown is supported."
            placeholder="What changed in this release?"
            value={bio}
            onChange={(event) => setBio(event.target.value)}
          />
          <div style={{ marginTop: '0.75rem' }}>
            <span className="mono-note">{bio.length} characters</span>
          </div>
        </Showcase>
      </Section>

      <Section
        title="Select"
        description="A native <select>. On mobile it hands off to the platform picker, which is consistently better than a custom listbox. Use Combobox when you need search."
      >
        <Showcase code={SELECT} width="md">
          <div className="stack">
            <Select
              label="Plan"
              defaultValue="growth"
              options={[
                { value: 'starter', label: 'Starter — $19/mo' },
                { value: 'growth', label: 'Growth — $49/mo' },
                { value: 'scale', label: 'Scale — $149/mo', disabled: true },
              ]}
            />
            <Select
              label="Timezone"
              placeholder="Choose a timezone"
              options={[
                { value: 'utc', label: 'UTC' },
                { value: 'pst', label: 'Pacific Time (PT)' },
                { value: 'cet', label: 'Central European Time (CET)' },
              ]}
            />
            <Select
              label="Region"
              error="Select a region to continue."
              options={[{ value: 'us', label: 'United States' }, { value: 'eu', label: 'European Union' }]}
            />
          </div>
        </Showcase>
      </Section>

      <Section title="API — shared by all three">
        <PropsTable
          rows={[
            { name: 'label', type: 'ReactNode', description: 'Associates a <label> with the control via generated id.' },
            { name: 'hint', type: 'ReactNode', description: 'Helper text below the control. Hidden while error is set.' },
            { name: 'error', type: 'ReactNode', description: 'Error message. Sets aria-invalid and role="alert".' },
            { name: 'required', type: 'boolean', default: 'false', description: 'Adds a marker and aria-required.' },
            { name: 'optionalText', type: 'string', description: 'Marks the field as optional instead.' },
            { name: 'containerClassName', type: 'string', description: 'Class for the outer field wrapper.' },
            { name: 'leftAddon / rightAddon', type: 'ReactNode', description: 'Input only. Icon or inline text inside the control.' },
            { name: 'options', type: 'SelectOption[]', description: 'Select only. { value, label, disabled }.' },
            { name: '...rest', type: 'InputHTMLAttributes', description: 'Spread onto the native element, including refs.' },
          ]}
        />
      </Section>

      <Section title="Accessibility">
        <ul className="tick-list">
          <li>
            Every control gets a generated <code>id</code> and a matching{' '}
            <code>&lt;label htmlFor&gt;</code>. Pass your own <code>id</code> when you
            need to link from elsewhere.
          </li>
          <li>
            <code>aria-describedby</code> points at the hint, the error, or both —
            announced after the label, not instead of it.
          </li>
          <li>
            Required fields get both a visual marker and a screen-reader-only
            "(required)" so the state is not conveyed by colour alone.
          </li>
          <li>
            Placeholders are never used as labels: they disappear on input and
            usually fail contrast requirements.
          </li>
        </ul>
      </Section>
    </DocPage>
  );
}
