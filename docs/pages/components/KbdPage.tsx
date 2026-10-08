import { Kbd } from '../../../src/index';
import { Callout, PropsTable, Showcase } from '../../components/Showcase';
import { DocPage, Section } from '../../components/DocPage';

const KBD_DEMO = `<p>Press <Kbd>⌘</Kbd> <Kbd>K</Kbd> to open the command palette.</p>
<p>Use <Kbd>Esc</Kbd> to dismiss open dialogs.</p>
<p>Hold <Kbd>Shift</Kbd> + <Kbd>Tab</Kbd> to navigate backwards.</p>`;

export function KbdPage() {
  return (
    <DocPage
      eyebrow="Components"
      title="Kbd"
      lede="Displays keyboard keys, input shortcuts, and combinations with a realistic beveled mechanical keyboard appearance."
      importStatement="import { Kbd } from 'hesh-ui';"
    >
      <Section
        title="Keyboard Shortcuts"
        description="Render individual key representations inline within text and documentation."
      >
        <Showcase code={KBD_DEMO} defaultOpen width="md">
          <div className="stack" style={{ gap: '0.75rem' }}>
            <p>Press <Kbd>⌘</Kbd> <Kbd>K</Kbd> to toggle the search palette.</p>
            <p>Press <Kbd>Esc</Kbd> to dismiss floating panels and menus.</p>
            <p>Hold <Kbd>Shift</Kbd> + <Kbd>Tab</Kbd> to navigate backwards.</p>
          </div>
        </Showcase>
      </Section>

      <Section title="API Reference">
        <PropsTable
          rows={[
            { name: 'children', type: 'ReactNode', required: true, description: 'Key text or symbol (e.g. ⌘, Shift, Enter).' },
          ]}
        />
      </Section>
    </DocPage>
  );
}
