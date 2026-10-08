import { ScrollArea } from '../../../src/index';
import { Callout, PropsTable, Showcase } from '../../components/Showcase';
import { DocPage, Section } from '../../components/DocPage';

const SCROLL_DEMO = `<ScrollArea maxHeight={200} fadeEdges>
  <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
    {tags.map((tag) => (
      <div key={tag} className="row-between" style={{ padding: '0.5rem', background: 'var(--pui-bg-muted)', borderRadius: 'var(--pui-radius-sm)' }}>
        <span>v1.{tag}.0 release tags</span>
      </div>
    ))}
  </div>
</ScrollArea>`;

const TAGS = Array.from({ length: 25 }, (_, i) => 25 - i);

export function ScrollAreaPage() {
  return (
    <DocPage
      eyebrow="Components"
      title="ScrollArea"
      lede="Custom cross-browser styled scrollable container with inertia, edge gradient masks, and hover visibility."
      importStatement="import { ScrollArea } from 'hesh-ui';"
    >
      <Section
        title="Scroll Container with Edge Fades"
        description="Scroll smoothly inside constrained height with subtle top/bottom gradient masks."
      >
        <Showcase code={SCROLL_DEMO} defaultOpen width="md">
          <div style={{ width: '100%', maxWidth: '22rem', border: '1px solid var(--pui-border)', borderRadius: 'var(--pui-radius-xl)', overflow: 'hidden' }}>
            <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--pui-border)', fontWeight: 600, fontSize: '0.875rem' }}>
              Changelog Releases
            </div>
            <ScrollArea maxHeight={220} fadeEdges>
              <div style={{ padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                {TAGS.map((tag) => (
                  <div
                    key={tag}
                    className="row-between"
                    style={{
                      padding: '0.4375rem 0.75rem',
                      background: 'var(--pui-surface-sunken)',
                      borderRadius: 'var(--pui-radius-md)',
                      fontSize: '0.8125rem',
                    }}
                  >
                    <span style={{ fontWeight: 500 }}>v1.{tag}.0</span>
                    <span className="cell-sub">Fixed performance regression #{tag * 14}</span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </Showcase>
      </Section>

      <Section title="API Reference">
        <PropsTable
          rows={[
            { name: 'maxHeight', type: 'string | number', description: 'Maximum height of the scroll container.' },
            { name: 'maxWidth', type: 'string | number', description: 'Maximum width of the scroll container.' },
            { name: 'fadeEdges', type: 'boolean', default: 'false', description: 'Whether to show gradient fade masks on scrollable edges.' },
            { name: 'type', type: "'auto' | 'always' | 'scroll' | 'hover'", default: "'hover'", description: 'Scrollbar visibility mode.' },
          ]}
        />
      </Section>
    </DocPage>
  );
}
