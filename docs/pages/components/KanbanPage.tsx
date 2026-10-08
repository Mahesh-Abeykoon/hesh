import { useState } from 'react';
import { Kanban, type KanbanCard } from '../../../src/index';
import { Callout, PropsTable, Showcase } from '../../components/Showcase';
import { DocPage, Section } from '../../components/DocPage';

const KANBAN_INITIAL: KanbanCard[] = [
  { id: '1', columnId: 'todo', title: 'Design new pricing page', description: 'Include annual billing switch and enterprise CTA', tags: [{ label: 'Design' }, { label: 'P1', tone: 'danger' }], assignee: { name: 'Ada Lovelace', initials: 'AL' }, priority: 'high', due: 'Today' },
  { id: '2', columnId: 'todo', title: 'Fix avatar upload', description: 'HEIC images fail silently on Safari mobile', tags: [{ label: 'Bug', tone: 'warning' }], assignee: { name: 'Grace Hopper', initials: 'GH' }, priority: 'medium' },
  { id: '3', columnId: 'doing', title: 'Implement command palette', description: 'Global ⌘K shortcut with search filtering', tags: [{ label: 'Feature', tone: 'primary' }], assignee: { name: 'Linus Torvalds', initials: 'LT' }, priority: 'urgent', due: 'Tomorrow' },
  { id: '4', columnId: 'doing', title: 'Write migration guide', tags: [{ label: 'Docs' }], assignee: { name: 'Katherine Johnson', initials: 'KJ' }, priority: 'low' },
  { id: '5', columnId: 'done', title: 'Ship dark mode rebrand', description: 'Contrast-ratio compliant token ramp', tags: [{ label: 'Done', tone: 'success' }], assignee: { name: 'Ada Lovelace', initials: 'AL' }, priority: 'medium' },
];

const KANBAN_DEMO = `const [cards, setCards] = useState(initialCards);

<Kanban
  columns={[
    { id: 'todo', title: 'To do' },
    { id: 'doing', title: 'In progress' },
    { id: 'done', title: 'Done' },
  ]}
  cards={cards}
  onMove={(cardId, toColumnId) =>
    setCards(prev => prev.map(c => c.id === cardId ? { ...c, columnId: toColumnId } : c))
  }
/>`;

export function KanbanPage() {
  const [cards, setCards] = useState<KanbanCard[]>(KANBAN_INITIAL);

  return (
    <DocPage
      eyebrow="Components"
      title="Kanban"
      lede="Drag-and-drop workflow board for project tasks, swimlanes, and multi-status tracking."
      importStatement="import { Kanban } from 'hesh-ui';"
    >
      <Section
        title="Interactive Board"
        description="Drag cards across columns or use card movement actions to update status in real-time."
      >
        <Showcase code={KANBAN_DEMO} defaultOpen width="full">
          <Kanban
            columns={[
              { id: 'todo', title: 'To do' },
              { id: 'doing', title: 'In progress' },
              { id: 'done', title: 'Done' },
            ]}
            cards={cards}
            onMove={(cardId, toColumnId) =>
              setCards((prev) =>
                prev.map((c) => (c.id === cardId ? { ...c, columnId: toColumnId } : c))
              )
            }
          />
        </Showcase>
      </Section>

      <Section title="API Reference">
        <PropsTable
          rows={[
            { name: 'columns', type: 'KanbanColumn[]', required: true, description: 'Columns with id and title.' },
            { name: 'cards', type: 'KanbanCard[]', required: true, description: 'Cards containing id, columnId, title, tags, and assignee.' },
            { name: 'onMove', type: '(cardId: string, toColumnId: string) => void', required: true, description: 'Callback fired when a card transitions between columns.' },
          ]}
        />
      </Section>
    </DocPage>
  );
}
