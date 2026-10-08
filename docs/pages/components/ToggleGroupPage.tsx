import { useState } from 'react';
import { ToggleGroup, ToggleGroupItem } from '../../../src/index';
import { Callout, PropsTable, Showcase } from '../../components/Showcase';
import { DocPage, Section } from '../../components/DocPage';

const TOGGLE_GROUP_DEMO = `const [align, setAlign] = useState('left');

<ToggleGroup type="single" value={align} onChange={setAlign}>
  <ToggleGroupItem value="left">Left</ToggleGroupItem>
  <ToggleGroupItem value="center">Center</ToggleGroupItem>
  <ToggleGroupItem value="right">Right</ToggleGroupItem>
</ToggleGroup>`;

export function ToggleGroupPage() {
  const [align, setAlign] = useState('left');
  const [formats, setFormats] = useState<string[]>(['bold']);

  return (
    <DocPage
      eyebrow="Components"
      title="ToggleGroup"
      lede="A set of two-state buttons that can be toggled on or off, supporting both single and multiple selection."
      importStatement="import { ToggleGroup, ToggleGroupItem } from 'hesh-ui';"
    >
      <Section
        title="Single Selection (Alignment Toolbar)"
        description="Only one option can be selected at a time, similar to a radio group."
      >
        <Showcase code={TOGGLE_GROUP_DEMO} defaultOpen width="md">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
            <ToggleGroup type="single" value={align} onChange={setAlign} aria-label="Text alignment">
              <ToggleGroupItem value="left">Left</ToggleGroupItem>
              <ToggleGroupItem value="center">Center</ToggleGroupItem>
              <ToggleGroupItem value="right">Right</ToggleGroupItem>
              <ToggleGroupItem value="justify">Justify</ToggleGroupItem>
            </ToggleGroup>
            <span className="cell-sub">Selected alignment: {align}</span>
          </div>
        </Showcase>
      </Section>

      <Section
        title="Multiple Selection (Text Formatting)"
        description="Multiple options can be active simultaneously, ideal for rich text styling."
      >
        <Showcase
          code={`<ToggleGroup type="multiple" value={formats} onChange={setFormats}>
  <ToggleGroupItem value="bold"><b>B</b></ToggleGroupItem>
  <ToggleGroupItem value="italic"><i>I</i></ToggleGroupItem>
  <ToggleGroupItem value="underline"><u>U</u></ToggleGroupItem>
</ToggleGroup>`}
          defaultOpen
          width="md"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
            <ToggleGroup type="multiple" value={formats} onChange={setFormats} aria-label="Text formatting">
              <ToggleGroupItem value="bold"><b>B</b></ToggleGroupItem>
              <ToggleGroupItem value="italic"><i>I</i></ToggleGroupItem>
              <ToggleGroupItem value="underline"><u>U</u></ToggleGroupItem>
              <ToggleGroupItem value="strike"><s>S</s></ToggleGroupItem>
            </ToggleGroup>
            <span className="cell-sub">Active styles: {formats.join(', ') || 'none'}</span>
          </div>
        </Showcase>
      </Section>

      <Section title="API Reference">
        <PropsTable
          rows={[
            { name: 'type', type: "'single' | 'multiple'", default: "'single'", description: 'Selection mode.' },
            { name: 'value', type: 'string | string[]', description: 'Controlled selection value.' },
            { name: 'onChange', type: '(value: any) => void', description: 'Callback fired on selection.' },
            { name: 'variant', type: "'default' | 'outline' | 'subtle'", default: "'default'", description: 'Visual styling.' },
            { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Item sizing.' },
            { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'Layout direction.' },
          ]}
        />
      </Section>
    </DocPage>
  );
}
