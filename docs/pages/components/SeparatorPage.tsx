import { Separator } from '../../../src/index';
import { Callout, PropsTable, Showcase } from '../../components/Showcase';
import { DocPage, Section } from '../../components/DocPage';

const SEPARATOR_DEMO = `<Separator />

<Separator label="or continue with" />

<div className="row-wrap" style={{ alignItems: 'center', height: 32 }}>
  <span>Left item</span>
  <Separator orientation="vertical" style={{ height: 20 }} />
  <span>Right item</span>
</div>`;

export function SeparatorPage() {
  return (
    <DocPage
      eyebrow="Components"
      title="Separator"
      lede="Visual divider that separates content into distinct sections, with support for horizontal rules, vertical bars, and centered text labels."
      importStatement="import { Separator } from 'hesh-ui';"
    >
      <Section
        title="Horizontal & Vertical Dividers"
        description="Supports both orientations and centered text divider labels."
      >
        <Showcase code={SEPARATOR_DEMO} defaultOpen width="md">
          <div className="stack" style={{ gap: '1.25rem' }}>
            <span className="prose">Content above horizontal separator</span>
            <Separator />
            <span className="prose">Content below horizontal separator</span>
            <Separator label="or continue with" />
            <div className="row-wrap" style={{ alignItems: 'center', gap: '1rem' }}>
              <span>Dashboard</span>
              <Separator orientation="vertical" style={{ height: 20, alignSelf: 'auto' }} />
              <span>Settings</span>
              <Separator orientation="vertical" style={{ height: 20, alignSelf: 'auto' }} />
              <span>Billing</span>
            </div>
          </div>
        </Showcase>
      </Section>

      <Section title="Accessibility">
        <Callout tone="info" title="Semantic Separator">
          Carries <code>role="separator"</code> and appropriate <code>aria-orientation</code> metadata so assistive technologies recognize page section boundaries.
        </Callout>
      </Section>

      <Section title="API Reference">
        <PropsTable
          rows={[
            { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'Axis orientation of the rule.' },
            { name: 'label', type: 'ReactNode', description: 'Centered text or element embedded in the divider.' },
          ]}
        />
      </Section>
    </DocPage>
  );
}
