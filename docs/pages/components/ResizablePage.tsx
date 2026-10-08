import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '../../../src/index';
import { Callout, PropsTable, Showcase } from '../../components/Showcase';
import { DocPage, Section } from '../../components/DocPage';

const RESIZABLE_DEMO = `<ResizablePanelGroup direction="horizontal">
  <ResizablePanel defaultSize={35} minSize={20}>
    <SidebarContent />
  </ResizablePanel>
  <ResizableHandle withHandle />
  <ResizablePanel defaultSize={65} minSize={30}>
    <MainContent />
  </ResizablePanel>
</ResizablePanelGroup>`;

export function ResizablePage() {
  return (
    <DocPage
      eyebrow="Components"
      title="Resizable"
      lede="Accessible, draggable split-pane layouts supporting horizontal and vertical directions with min/max constraints."
      importStatement="import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from 'hesh-ui';"
    >
      <Section
        title="Horizontal Split Panels"
        description="Drag the middle divider bar horizontally to resize the left and right panels."
      >
        <Showcase code={RESIZABLE_DEMO} defaultOpen width="lg">
          <div style={{ width: '100%', height: '16rem' }}>
            <ResizablePanelGroup direction="horizontal">
              <ResizablePanel defaultSize={35} minSize={20}>
                <div style={{ padding: '1rem', height: '100%', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>Navigation</div>
                  <div className="cell-sub" style={{ fontSize: '0.8125rem' }}>Drag handle to inspect flexible layout.</div>
                  <div style={{ marginTop: 'auto', padding: '0.5rem', background: 'var(--pui-surface-sunken)', borderRadius: 'var(--pui-radius-sm)', fontSize: '0.75rem' }}>
                    Min width: 20%
                  </div>
                </div>
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={65} minSize={30}>
                <div style={{ padding: '1rem', height: '100%', background: 'var(--pui-surface-sunken)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>Editor Workspace</div>
                  <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--pui-fg-muted)', lineHeight: 1.5 }}>
                    Fluidly adapts content when dragging the split divider bar. Supports minimum and maximum percentage constraints.
                  </p>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>
        </Showcase>
      </Section>

      <Section title="API Reference">
        <PropsTable
          rows={[
            { name: 'direction', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'Splitting orientation.' },
            { name: 'defaultSize', type: 'number', default: '50', description: 'Initial size percentage of a panel (1-100).' },
            { name: 'minSize', type: 'number', default: '15', description: 'Minimum size percentage allowed.' },
            { name: 'maxSize', type: 'number', default: '85', description: 'Maximum size percentage allowed.' },
            { name: 'withHandle', type: 'boolean', default: 'true', description: 'Whether to show the center grip handle.' },
          ]}
        />
      </Section>
    </DocPage>
  );
}
