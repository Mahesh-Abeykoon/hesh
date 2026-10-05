import { useState } from 'react';
import { ColorPicker } from '../../../src/index';
import { Callout, PropsTable, Showcase } from '../../components/Showcase';
import { DocPage, Section } from '../../components/DocPage';

const COLOR_DEMO = `const [color, setColor] = useState('#6366f1');

<ColorPicker value={color} onChange={setColor} />`;

export function ColorPickerPage() {
  const [color, setColor] = useState('#6366f1');
  const [accent, setAccent] = useState('#22c55e');

  return (
    <DocPage
      eyebrow="Components"
      title="ColorPicker"
      lede="Color selection control with clickable swatch, preset palette swatches, hex text entry, and native color dialog integration."
      importStatement="import { ColorPicker } from 'hesh';"
    >
      <Section
        title="Interactive Color Picker"
        description="Click the swatch to invoke the system color wheel or choose from curated palette presets."
      >
        <Showcase code={COLOR_DEMO} defaultOpen width="md">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', alignItems: 'center' }}>
            <ColorPicker value={color} onChange={setColor} />
            <div
              style={{
                width: '100%',
                maxWidth: '20rem',
                padding: '1rem',
                borderRadius: 'var(--pui-radius-lg)',
                backgroundColor: color,
                color: '#ffffff',
                textAlign: 'center',
                fontWeight: 600,
                boxShadow: 'var(--pui-shadow-md)',
                transition: 'background-color 150ms ease',
              }}
            >
              Current Color: {color}
            </div>
          </div>
        </Showcase>
      </Section>

      <Section title="Sizes">
        <div className="row-wrap" style={{ gap: '1.5rem', alignItems: 'flex-start' }}>
          <div>
            <div className="cell-sub" style={{ marginBottom: '0.5rem' }}>Small</div>
            <ColorPicker size="sm" value={accent} onChange={setAccent} />
          </div>
          <div>
            <div className="cell-sub" style={{ marginBottom: '0.5rem' }}>Medium</div>
            <ColorPicker size="md" value={color} onChange={setColor} />
          </div>
        </div>
      </Section>

      <Section title="API Reference">
        <PropsTable
          rows={[
            { name: 'value', type: 'string', description: 'Controlled hex color string (e.g. #6366f1).' },
            { name: 'defaultValue', type: 'string', default: "'#6366f1'", description: 'Default color.' },
            { name: 'onChange', type: '(color: string) => void', description: 'Callback fired on color change.' },
            { name: 'presets', type: 'string[]', description: 'Array of preset hex swatches.' },
            { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Control sizing.' },
            { name: 'disabled', type: 'boolean', default: 'false', description: 'Whether the control is disabled.' },
          ]}
        />
      </Section>
    </DocPage>
  );
}
