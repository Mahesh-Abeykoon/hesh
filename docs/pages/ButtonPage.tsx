import { useState } from 'react';
import { Button, ButtonGroup, IconButton, Tooltip } from '../../src/index';
import { ArrowRightIcon, PlusIcon, SparklesIcon, TrashIcon } from '../../src/index';
import { Callout, PropsTable, Showcase } from '../components/Showcase';
import { DocPage, Section } from '../components/DocPage';

const VARIANTS = `import { Button } from 'hesh';

<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="subtle">Subtle</Button>
<Button variant="danger">Danger</Button>
<Button variant="link">Link</Button>`;

const SIZES = `<Button size="xs">Extra small</Button>
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
<Button size="xl">Extra large</Button>`;

const LOADING = `const [saving, setSaving] = useState(false);

<Button loading={saving} loadingText="Saving…" onClick={submit}>
  Save changes
</Button>`;

const ICONS = `<Button leftIcon={<PlusIcon />}>New project</Button>
<Button variant="secondary" rightIcon={<ArrowRightIcon />}>Continue</Button>

<IconButton aria-label="Delete project" variant="ghost">
  <TrashIcon />
</IconButton>`;

export function ButtonPage() {
  const [saving, setSaving] = useState(false);

  const runSave = () => {
    setSaving(true);
    window.setTimeout(() => setSaving(false), 1800);
  };

  return (
    <DocPage
      eyebrow="Forms"
      title="Button"
      lede="Actions. Seven variants, five sizes, loading and icon support — all built on a native <button>, so form submission and keyboard activation work without extra wiring."
    >
      <Section title="Variants" description="Each variant maps to a semantic token, so rebranding updates every button at once.">
        <Showcase code={VARIANTS} defaultOpen>
          <div className="row-wrap">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="subtle">Subtle</Button>
            <Button variant="danger">Danger</Button>
            <Button variant="link">Link</Button>
          </div>
        </Showcase>
        <Callout tone="info" title="One primary per view">
          Primary is reserved for the single most important action in a view.
          Multiple competing primaries flatten the hierarchy and make the page
          harder to scan.
        </Callout>
      </Section>

      <Section title="Sizes">
        <Showcase code={SIZES}>
          <div className="row-wrap" style={{ alignItems: 'center' }}>
            <Button size="xs">Extra small</Button>
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
            <Button size="xl">Extra large</Button>
          </div>
        </Showcase>
        <p className="prose">
          Sizes are multipliers on the density token, not fixed pixel values. Set{' '}
          <code>data-pui-density="compact"</code> on any ancestor and all five sizes
          scale together.
        </p>
      </Section>

      <Section
        title="Loading"
        description="The button keeps its place in the tab order while busy — aria-busy and aria-disabled are used instead of the disabled attribute, so focus is never lost mid-action."
      >
        <Showcase code={LOADING}>
          <div className="row-wrap">
            <Button loading={saving} loadingText="Saving…" onClick={runSave}>
              Save changes
            </Button>
            <Button variant="secondary" loading>
              With spinner only
            </Button>
            <Button variant="danger" loading={saving} loadingText="Deleting…" onClick={runSave}>
              Delete
            </Button>
          </div>
        </Showcase>
      </Section>

      <Section title="With icons" description="Icons are aria-hidden; the label carries the accessible name. Icon-only buttons must supply aria-label.">
        <Showcase code={ICONS}>
          <div className="row-wrap">
            <Button leftIcon={<PlusIcon />}>New project</Button>
            <Button variant="secondary" rightIcon={<ArrowRightIcon />}>
              Continue
            </Button>
            <Button variant="outline" leftIcon={<SparklesIcon />}>
              Upgrade
            </Button>
            <Tooltip content="Delete project">
              <IconButton aria-label="Delete project" variant="ghost">
                <TrashIcon />
              </IconButton>
            </Tooltip>
          </div>
        </Showcase>
      </Section>

      <Section title="Groups and full width">
        <Showcase
          code={`<ButtonGroup aria-label="View mode">
  <Button variant="secondary">Day</Button>
  <Button variant="secondary">Week</Button>
  <Button variant="secondary">Month</Button>
</ButtonGroup>

<Button fullWidth size="lg">Create account</Button>`}
        >
          <div className="stack" style={{ maxWidth: 420 }}>
            <ButtonGroup aria-label="View mode">
              <Button variant="secondary">Day</Button>
              <Button variant="secondary">Week</Button>
              <Button variant="secondary">Month</Button>
            </ButtonGroup>
            <Button fullWidth size="lg">
              Create account
            </Button>
          </div>
        </Showcase>
      </Section>

      <Section title="API">
        <PropsTable
          rows={[
            { name: 'variant', type: "'primary' | 'secondary' | 'outline' | 'ghost' | 'subtle' | 'danger' | 'link'", default: "'primary'", description: 'Visual emphasis. Maps to semantic tokens.' },
            { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'md'", description: 'Scales with the density token.' },
            { name: 'loading', type: 'boolean', default: 'false', description: 'Shows a spinner, sets aria-busy, blocks activation.' },
            { name: 'loadingText', type: 'string', default: '—', description: 'Replaces the label while loading to prevent layout shift.' },
            { name: 'leftIcon / rightIcon', type: 'ReactNode', default: '—', description: 'Decorative icon; hidden from assistive tech.' },
            { name: 'fullWidth', type: 'boolean', default: 'false', description: 'Stretches to the container width.' },
            { name: 'iconOnly', type: 'boolean', default: 'false', description: 'Square padding. Requires aria-label.' },
            { name: '...rest', type: 'ButtonHTMLAttributes', default: '—', description: 'Spread onto the underlying <button>.' },
          ]}
        />
      </Section>

      <Section title="Accessibility">
        <ul className="tick-list">
          <li>
            Renders a native <code>&lt;button&gt;</code>, so <kbd className="pui-kbd">Space</kbd> and{' '}
            <kbd className="pui-kbd">Enter</kbd> activate it and it works inside forms.
          </li>
          <li>
            Focus is shown with <code>:focus-visible</code> only — mouse users do not
            see a ring, keyboard users always do.
          </li>
          <li>
            While <code>loading</code>, the button stays focusable and announces
            <code> aria-busy</code>. Removing a focused button from the tab order
            mid-task is a common source of lost focus.
          </li>
          <li>
            Decorative icons are <code>aria-hidden</code>; the visible label is the
            accessible name.
          </li>
        </ul>
      </Section>
    </DocPage>
  );
}
