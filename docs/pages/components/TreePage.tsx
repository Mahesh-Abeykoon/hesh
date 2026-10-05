import { useState } from 'react';
import { Tree, type TreeNode } from '../../../src/index';
import { Callout, PropsTable, Showcase } from '../../components/Showcase';
import { DocPage, Section } from '../../components/DocPage';

const DEMO = `<Tree
  data={[
    {
      id: 'src',
      label: 'src',
      children: [
        { id: 'components', label: 'components', children: [{ id: 'Button.tsx', label: 'Button.tsx' }] },
        { id: 'index.ts', label: 'index.ts' },
      ],
    },
  ]}
  defaultExpandedIds={['src', 'components']}
/>`;

export function TreePage() {
  const [selected, setSelected] = useState<string>('app.tsx');

  const fileTreeData: TreeNode[] = [
    {
      id: 'root-src',
      label: 'src',
      children: [
        {
          id: 'components',
          label: 'components',
          children: [
            { id: 'Button.tsx', label: 'Button.tsx' },
            { id: 'Card.tsx', label: 'Card.tsx' },
            { id: 'Dialog.tsx', label: 'Dialog.tsx' },
            { id: 'OtpInput.tsx', label: 'OtpInput.tsx' },
          ],
        },
        {
          id: 'styles',
          label: 'styles',
          children: [
            { id: 'variables.css', label: 'variables.css' },
            { id: 'components.css', label: 'components.css' },
          ],
        },
        { id: 'app.tsx', label: 'App.tsx' },
        { id: 'index.ts', label: 'index.ts' },
      ],
    },
    {
      id: 'public',
      label: 'public',
      children: [
        { id: 'favicon.svg', label: 'favicon.svg' },
        { id: 'robots.txt', label: 'robots.txt' },
      ],
    },
    { id: 'package.json', label: 'package.json' },
    { id: 'tsconfig.json', label: 'tsconfig.json' },
  ];

  return (
    <DocPage
      eyebrow="Components"
      title="Tree"
      lede="A hierarchical directory explorer and file tree with expand/collapse animations, keyboard arrow navigation, and selection states."
      importStatement="import { Tree } from 'hesh';"
    >
      <Section
        title="Interactive File Explorer"
        description="Click folders to expand or collapse. Use arrow keys: Right expands, Left collapses, Up/Down traverses visible nodes, Enter selects."
      >
        <Showcase code={DEMO} defaultOpen width="md">
          <div style={{ width: '100%', maxWidth: '20rem', margin: '0 auto', background: 'var(--pui-surface)', borderRadius: 'var(--pui-radius-lg)', border: '1px solid var(--pui-border)', padding: '0.75rem', boxSizing: 'border-box' }}>
            <Tree
              data={fileTreeData}
              defaultExpandedIds={['root-src', 'components']}
              selectedId={selected}
              onSelect={(id) => setSelected(id)}
            />

            <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--pui-border-subtle)', fontSize: '0.75rem', color: 'var(--pui-fg-muted)' }}>
              Selected file: <strong style={{ color: 'var(--pui-primary)' }}>{selected}</strong>
            </div>
          </div>
        </Showcase>
      </Section>

      <Section title="API Reference">
        <PropsTable
          rows={[
            { name: 'data', type: 'readonly TreeNode[]', description: 'Hierarchical node tree with id, label, icon, and nested children.' },
            { name: 'expandedIds', type: 'string[]', description: 'Controlled array of expanded folder IDs.' },
            { name: 'defaultExpandedIds', type: 'string[]', description: 'Initial expanded folder IDs.' },
            { name: 'onToggle', type: '(id: string, expanded: boolean) => void', description: 'Callback fired when a node is toggled.' },
            { name: 'selectedId', type: 'string', description: 'ID of currently active/selected item.' },
            { name: 'onSelect', type: '(id: string, node: TreeNode) => void', description: 'Callback fired when a node is selected.' },
          ]}
        />
      </Section>
    </DocPage>
  );
}
