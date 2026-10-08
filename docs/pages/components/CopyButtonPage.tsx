import { CopyButton, CodeSnippet } from '../../../src/index';
import { Callout, PropsTable, Showcase } from '../../components/Showcase';
import { DocPage, Section } from '../../components/DocPage';

const COPY_DEMO = `<CopyButton value="npm install hesh" label="Copy command" />`;

const SNIPPET_DEMO = `<CodeSnippet
  language="bash"
  title="Terminal"
  code="npm install hesh\\nnpx hesh init --theme=slate"
  showLineNumbers
/>`;

export function CopyButtonPage() {
  return (
    <DocPage
      eyebrow="Components"
      title="CopyButton"
      lede="One-click clipboard copy utility with micro-animation checkmark feedback, plus preformatted CodeSnippet blocks."
      importStatement="import { CopyButton, CodeSnippet } from 'hesh-ui';"
    >
      <Section
        title="Copy Buttons"
        description="Click to copy text to system clipboard. Resets back to idle state after timeout."
      >
        <Showcase code={COPY_DEMO} defaultOpen width="md">
          <div className="row-wrap" style={{ gap: '0.75rem', alignItems: 'center' }}>
            <CopyButton value="npm install hesh" label="Copy install command" variant="secondary" />
            <CopyButton value="sk_test_51MzQ..." variant="outline" label="API Key" />
            <CopyButton value="export const config = {};" variant="solid" label="Copy code" />
            <CopyButton value="Quick copy" variant="ghost" />
          </div>
        </Showcase>
      </Section>

      <Section
        title="CodeSnippet Wrapper"
        description="Formatted code block with language indicator, optional line numbering, and integrated CopyButton."
      >
        <Showcase code={SNIPPET_DEMO} defaultOpen width="md">
          <div style={{ width: '100%', maxWidth: '28rem' }}>
            <CodeSnippet
              language="bash"
              title="Quick Start"
              showLineNumbers
              code={`npm install hesh
npm run dev -- --open
# Ready at http://localhost:5173`}
            />
          </div>
        </Showcase>
      </Section>

      <Section title="API Reference">
        <PropsTable
          rows={[
            { name: 'value', type: 'string', required: true, description: 'Text string copied to clipboard.' },
            { name: 'label', type: 'ReactNode', description: 'Optional text label displayed alongside icon.' },
            { name: 'timeout', type: 'number', default: '2000', description: 'Duration in ms before resetting checkmark.' },
            { name: 'variant', type: "'ghost' | 'outline' | 'secondary' | 'solid'", default: "'ghost'", description: 'Button appearance.' },
            { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Button sizing.' },
            { name: 'onCopySuccess', type: '(value: string) => void', description: 'Callback fired upon successful copy.' },
          ]}
        />
      </Section>
    </DocPage>
  );
}
