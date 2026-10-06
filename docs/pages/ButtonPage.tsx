import { useState } from 'react';
import {
  Button,
  ButtonGroup,
  IconButton,
  Tooltip,
  DropdownMenu,
  ChevronDownIcon,
  SparklesIcon,
  ArrowRightIcon,
  PlusIcon,
  TrashIcon,
  CheckIcon,
} from '../../src/index';
import { Callout, PropsTable, Showcase } from '../components/Showcase';
import { DocPage, Section } from '../components/DocPage';
import { ButtonWorkbench } from '../components/PropsWorkbench';

const ALL_VARIANTS_CODE = `<!-- Standard Tones -->
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="subtle">Subtle</Button>
<Button variant="success">Success</Button>
<Button variant="danger">Danger</Button>
<Button variant="link">Link</Button>

<!-- Premium Modern Finishes -->
<Button variant="gradient">Gradient Glow</Button>
<Button variant="glass">Glassmorphic</Button>`;

const SHAPES_GLOW_CODE = `<!-- Pill Shape -->
<Button shape="pill" variant="primary">Pill Button</Button>
<Button shape="pill" variant="gradient">Gradient Pill</Button>

<!-- Glow Ambient Shadow -->
<Button glow variant="primary">Glow Primary</Button>
<Button glow variant="gradient">Glow Gradient</Button>

<!-- Square Shape -->
<Button shape="square" variant="secondary">Sharp Square</Button>`;

const SPLIT_BUTTON_CODE = `<ButtonGroup attached>
  <Button variant="primary" leftIcon={<SparklesIcon size={16} />}>Deploy Branch</Button>
  <DropdownMenu
    items={[
      { type: 'item', label: 'Deploy to Staging', onSelect: () => {} },
      { type: 'item', label: 'Deploy to Production', onSelect: () => {} },
      { type: 'separator' },
      { type: 'item', label: 'Export Dockerfile', onSelect: () => {} },
    ]}
  >
    <IconButton aria-label="More deploy options" variant="primary" style={{ borderLeft: '1px solid rgba(255,255,255,0.2)' }}>
      <ChevronDownIcon size={16} />
    </IconButton>
  </DropdownMenu>
</ButtonGroup>`;

export function ButtonPage() {
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const runSave = () => {
    setSaving(true);
    window.setTimeout(() => setSaving(false), 1800);
  };

  const runDelete = () => {
    setDeleting(true);
    window.setTimeout(() => setDeleting(false), 1800);
  };

  return (
    <DocPage
      eyebrow="Components"
      title="Button"
      lede="The core interactive action primitive. Fully accessible, featuring 10 variants, 5 sizes, custom shapes, glow effects, loading states, and split button combos."
      importStatement="import { Button, IconButton, ButtonGroup } from 'hesh';"
    >
      <Section
        title="Interactive Props Workbench"
        description="Inspect and manipulate all button props in real-time."
      >
        <ButtonWorkbench />
      </Section>

      <Section
        title="1. All 10 Visual Variants"
        description="Includes standard semantic tones as well as high-end gradient and frosted glassmorphic finishes."
      >
        <Showcase code={ALL_VARIANTS_CODE} defaultOpen width="full">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="subtle">Subtle</Button>
            <Button variant="success" leftIcon={<CheckIcon size={16} />}>Success</Button>
            <Button variant="danger">Danger</Button>
            <Button variant="gradient" leftIcon={<SparklesIcon size={16} />}>Gradient</Button>
            <Button variant="glass">Glass</Button>
            <Button variant="link">Link action</Button>
          </div>
        </Showcase>
      </Section>

      <Section
        title="2. Shapes & Ambient Glow"
        description="Switch between standard rounded, pill (full capsule), or sharp square geometries, and enable ambient glow."
      >
        <Showcase code={SHAPES_GLOW_CODE} width="full">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
            <Button shape="pill" variant="primary">Pill Primary</Button>
            <Button shape="pill" variant="gradient" leftIcon={<SparklesIcon size={16} />}>Gradient Pill</Button>
            <Button glow variant="primary">Glow Primary</Button>
            <Button glow variant="gradient">Glow Gradient</Button>
            <Button shape="square" variant="secondary">Sharp Square</Button>
            <Button shape="pill" variant="outline">Pill Outline</Button>
          </div>
        </Showcase>
      </Section>

      <Section
        title="3. Split Combo Dropdown Button"
        description="Combine primary action buttons with dropdown menus using an attached ButtonGroup."
      >
        <Showcase code={SPLIT_BUTTON_CODE} width="md">
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <ButtonGroup attached>
              <Button variant="primary" leftIcon={<SparklesIcon size={16} />}>
                Deploy Branch
              </Button>
              <DropdownMenu
                items={[
                  { kind: 'item', label: 'Deploy to Preview', onSelect: () => alert('Preview') },
                  { kind: 'item', label: 'Deploy to Staging', onSelect: () => alert('Staging') },
                  { kind: 'separator' },
                  { kind: 'item', label: 'Production Release', onSelect: () => alert('Production') },
                ]}
                trigger={(triggerProps) => (
                  <IconButton
                    {...triggerProps}
                    aria-label="More deploy options"
                    variant="primary"
                    style={{ borderLeft: '1px solid rgba(255,255,255,0.25)' }}
                  >
                    <ChevronDownIcon size={16} />
                  </IconButton>
                )}
              />
            </ButtonGroup>

            <ButtonGroup attached>
              <Button variant="secondary">Save Draft</Button>
              <DropdownMenu
                items={[
                  { kind: 'item', label: 'Save as Template', onSelect: () => {} },
                  { kind: 'item', label: 'Discard Draft', onSelect: () => {} },
                ]}
                trigger={(triggerProps) => (
                  <IconButton {...triggerProps} aria-label="More draft options" variant="secondary">
                    <ChevronDownIcon size={16} />
                  </IconButton>
                )}
              />
            </ButtonGroup>
          </div>
        </Showcase>
      </Section>

      <Section
        title="4. Button Groups (Horizontal & Vertical)"
        description="Group multiple buttons into attached toolbars or detached segmented sets."
      >
        <Showcase
          code={`<!-- Attached Toolbar -->
<ButtonGroup attached aria-label="View options">
  <Button variant="secondary">Day</Button>
  <Button variant="secondary">Week</Button>
  <Button variant="secondary">Month</Button>
  <Button variant="secondary">Year</Button>
</ButtonGroup>

<!-- Vertical Stacked Group -->
<ButtonGroup orientation="vertical" attached aria-label="Vertical navigation">
  <Button variant="secondary">Overview</Button>
  <Button variant="secondary">Team members</Button>
  <Button variant="secondary">Billing</Button>
</ButtonGroup>`}
          width="md"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <span className="cell-sub" style={{ display: 'block', marginBottom: '0.5rem' }}>Attached Horizontal:</span>
              <ButtonGroup attached aria-label="View mode">
                <Button variant="secondary">Day</Button>
                <Button variant="secondary">Week</Button>
                <Button variant="secondary">Month</Button>
                <Button variant="secondary">Year</Button>
              </ButtonGroup>
            </div>

            <div>
              <span className="cell-sub" style={{ display: 'block', marginBottom: '0.5rem' }}>Detached with Gap:</span>
              <ButtonGroup attached={false} aria-label="Quick actions">
                <Button variant="outline" size="sm">Filter</Button>
                <Button variant="outline" size="sm">Export</Button>
                <Button variant="primary" size="sm" leftIcon={<PlusIcon size={14} />}>Add Column</Button>
              </ButtonGroup>
            </div>

            <div>
              <span className="cell-sub" style={{ display: 'block', marginBottom: '0.5rem' }}>Vertical Group:</span>
              <div style={{ maxWidth: '240px' }}>
                <ButtonGroup orientation="vertical" attached aria-label="Settings navigation">
                  <Button variant="secondary">Account Settings</Button>
                  <Button variant="secondary">Notifications</Button>
                  <Button variant="secondary">API Keys</Button>
                </ButtonGroup>
              </div>
            </div>
          </div>
        </Showcase>
      </Section>

      <Section
        title="5. Loading States with Zero Layout Shift"
        description="The button replaces content with an animated spinner while keeping its exact dimensions and maintaining accessibility focus."
      >
        <Showcase
          code={`<Button loading={saving} loadingText="Saving changes…" onClick={runSave}>
  Save Profile
</Button>`}
          width="md"
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
            <Button loading={saving} loadingText="Saving changes…" onClick={runSave}>
              Save Profile
            </Button>
            <Button variant="secondary" loading>
              Spinner only
            </Button>
            <Button variant="danger" loading={deleting} loadingText="Deleting record…" onClick={runDelete}>
              Delete Record
            </Button>
          </div>
        </Showcase>
      </Section>

      <Section
        title="6. Full Width Mobile CTA"
        description="Expands to 100% of the parent container for mobile modal submit triggers and bottom checkout bars."
      >
        <Showcase code={`<Button fullWidth size="lg">Complete Purchase ($49.00)</Button>`} width="md">
          <div style={{ width: '100%', maxWidth: '380px' }}>
            <Button fullWidth size="lg" variant="primary" rightIcon={<ArrowRightIcon size={18} />}>
              Complete Purchase ($49.00)
            </Button>
          </div>
        </Showcase>
      </Section>

      <Callout tone="info" title="Accessibility & Focus Handling">
        Button renders a native <code>&lt;button&gt;</code> element. While in <code>loading</code> state, it retains focus and marks <code>aria-busy="true"</code> and <code>aria-disabled="true"</code> rather than disabling the DOM node, preventing jarring focus jumps for assistive technologies.
      </Callout>

      <Section title="Props Reference">
        <PropsTable
          items={[
            { name: 'variant', type: "'primary' | 'secondary' | 'outline' | 'ghost' | 'subtle' | 'danger' | 'success' | 'gradient' | 'glass' | 'link'", default: "'primary'", description: 'Visual appearance variant.' },
            { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'md'", description: 'Button height, padding, and text sizing.' },
            { name: 'shape', type: "'rounded' | 'pill' | 'square'", default: "'rounded'", description: 'Corner geometry.' },
            { name: 'glow', type: 'boolean', default: 'false', description: 'Enable ambient colored drop-shadow glow.' },
            { name: 'loading', type: 'boolean', default: 'false', description: 'Display animated spinner and block interaction.' },
            { name: 'loadingText', type: 'string', description: 'Optional text replacement while loading.' },
            { name: 'leftIcon', type: 'ReactNode', description: 'Leading icon.' },
            { name: 'rightIcon', type: 'ReactNode', description: 'Trailing icon.' },
            { name: 'fullWidth', type: 'boolean', default: 'false', description: 'Expand to 100% of parent width.' },
            { name: 'iconOnly', type: 'boolean', default: 'false', description: 'Square aspect ratio for icon buttons.' },
            { name: 'asChild', type: 'boolean', default: 'false', description: 'Delegate rendering to child element using Slot.' },
          ]}
        />
      </Section>
    </DocPage>
  );
}
