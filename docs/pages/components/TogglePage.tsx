import { useState } from 'react';
import { Toggle } from '../../../src/index';
import { Callout, PropsTable, Showcase } from '../../components/Showcase';
import { DocPage, Section } from '../../components/DocPage';

const TOGGLE_DEMO = `const [pressed, setPressed] = useState(false);

<Toggle pressed={pressed} onPressedChange={setPressed}>
  {pressed ? 'Bookmarked' : 'Bookmark'}
</Toggle>`;

export function TogglePage() {
  const [b1, setB1] = useState(false);
  const [b2, setB2] = useState(true);
  const [b3, setB3] = useState(false);

  return (
    <DocPage
      eyebrow="Components"
      title="Toggle"
      lede="A two-state button that can be either pressed or unpressed, with complete ARIA compliance."
      importStatement="import { Toggle } from 'hesh';"
    >
      <Section
        title="Interactive Toggle"
        description="Click to toggle pressed state. Supports default, outline, and subtle variants."
      >
        <Showcase code={TOGGLE_DEMO} defaultOpen width="md">
          <div className="row-wrap" style={{ gap: '0.75rem', alignItems: 'center' }}>
            <Toggle pressed={b1} onPressedChange={setB1}>
              {b1 ? '★ Bookmarked' : '☆ Bookmark'}
            </Toggle>
            <Toggle variant="outline" pressed={b2} onPressedChange={setB2}>
              {b2 ? 'Muted' : 'Unmuted'}
            </Toggle>
            <Toggle variant="subtle" size="sm" pressed={b3} onPressedChange={setB3}>
              Pin to top
            </Toggle>
            <Toggle disabled>Disabled</Toggle>
          </div>
        </Showcase>
      </Section>

      <Section title="Sizes">
        <div className="row-wrap" style={{ gap: '0.75rem', alignItems: 'center' }}>
          <Toggle size="sm" variant="outline">Small</Toggle>
          <Toggle size="md" variant="outline">Medium</Toggle>
          <Toggle size="lg" variant="outline">Large</Toggle>
        </div>
      </Section>

      <Section title="API Reference">
        <PropsTable
          rows={[
            { name: 'pressed', type: 'boolean', description: 'Controlled pressed state.' },
            { name: 'defaultPressed', type: 'boolean', default: 'false', description: 'Default pressed state.' },
            { name: 'onPressedChange', type: '(pressed: boolean) => void', description: 'Callback fired on state change.' },
            { name: 'variant', type: "'default' | 'outline' | 'subtle'", default: "'default'", description: 'Visual appearance.' },
            { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Button sizing.' },
            { name: 'disabled', type: 'boolean', default: 'false', description: 'Whether the button is disabled.' },
          ]}
        />
      </Section>
    </DocPage>
  );
}
