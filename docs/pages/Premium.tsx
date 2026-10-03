import { useState } from 'react';
import {
  Badge,
  Button,
  Card,
  CardBody,
  Dropzone,
  Kanban,
  Timeline,
  TimelineItem,
  useToast,
  type DropzoneFile,
  type KanbanCard,
} from '../../src/index';
import { Callout, PropsTable, Showcase } from '../components/Showcase';
import { DocPage, Section } from '../components/DocPage';

const CODE = {
  dropzone: `<Dropzone
  accept="image/*,.pdf"
  maxFiles={5}
  maxSize={5 * 1024 * 1024}
  hint="PNG, JPG or PDF — max 5MB"
  onFiles={(files) => upload(files)}
/>`,
  kanban: `const [cards, setCards] = useState(initialCards);

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
  onCardClick={(card) => openDetail(card)}
/>`,
  timeline: `<Timeline>
  <TimelineItem timestamp="2h ago" title="Deployed to production" tone="success" active>
    Release v2.4.1 — 12 commits by Ada and Grace
  </TimelineItem>
  <TimelineItem timestamp="5h ago" title="Feature flag enabled" tone="primary" description="Rollout to 25% of users" />
  <TimelineItem timestamp="Yesterday" title="Incident resolved" tone="warning" />
</Timeline>`,
};

const KANBAN_INITIAL: KanbanCard[] = [
  { id: '1', columnId: 'todo', title: 'Design new pricing page', description: 'Include annual toggle and enterprise CTA', tags: [{ label: 'Design' }, { label: 'P1', tone: 'danger' }], assignee: { name: 'Ada Lovelace', initials: 'AL' }, priority: 'high', due: 'Today' },
  { id: '2', columnId: 'todo', title: 'Fix avatar upload', description: 'HEIC files fail silently on Safari', tags: [{ label: 'Bug', tone: 'warning' }], assignee: { name: 'Grace Hopper', initials: 'GH' }, priority: 'medium' },
  { id: '3', columnId: 'doing', title: 'Implement command palette', description: 'Global ⌘K with fuzzy search', tags: [{ label: 'Feature', tone: 'primary' }], assignee: { name: 'Linus Torvalds', initials: 'LT' }, priority: 'urgent', due: 'Tomorrow' },
  { id: '4', columnId: 'doing', title: 'Write migration guide', tags: [{ label: 'Docs' }], assignee: { name: 'Katherine Johnson', initials: 'KJ' }, priority: 'low' },
  { id: '5', columnId: 'done', title: 'Ship indigo rebrand', description: 'New brand ramp, chart palette, hero blobs', tags: [{ label: 'Done', tone: 'success' }], assignee: { name: 'Ada Lovelace', initials: 'AL' }, priority: 'medium' },
  { id: '6', columnId: 'done', title: 'Add smoke tests for advanced', tags: [{ label: 'QA', tone: 'success' }], assignee: { name: 'Alan Turing', initials: 'AT' } },
];

export function PremiumPage() {
  const { toast } = useToast();
  const [files, setFiles] = useState<DropzoneFile[]>([]);
  const [cards, setCards] = useState<KanbanCard[]>(KANBAN_INITIAL);

  const handleMove = (cardId: string, toColumnId: string) => {
    setCards((prev) => prev.map((c) => (c.id === cardId ? { ...c, columnId: toColumnId } : c)));
    toast({ title: 'Card moved', description: `Moved to ${toColumnId}`, tone: 'info' });
  };

  return (
    <DocPage
      eyebrow="Premium"
      title="Dropzone · Kanban · Timeline"
      lede="Real product UI — not demo toys. Drag-and-drop file upload with previews, a kanban board with native HTML5 drag, and a timeline with semantic tones. All token-driven, zero dependencies."
    >
      <Section
        title="Dropzone"
        description="Dashed border, glow on hover, drag-over state with elevation, file list with thumbnails and simulated progress. Keyboard accessible — Enter/Space opens the picker."
      >
        <Showcase code={CODE.dropzone} defaultOpen>
          <Dropzone
            accept="image/*,.pdf"
            maxFiles={5}
            maxSize={5 * 1024 * 1024}
            hint="PNG, JPG or PDF — max 5MB, 5 files"
            files={files}
            onFilesChange={setFiles}
            onFiles={(incoming) => toast({ title: `${incoming.length} file${incoming.length > 1 ? 's' : ''} added`, tone: 'success' })}
          />
        </Showcase>
        <Callout tone="info" title="Why it feels premium">
          The glow is a radial gradient behind the dashed border. The file cards pop in on a spring curve and the progress bar is a real width transition — no fake spinner. Images get object URLs for instant previews, revoked on remove.
        </Callout>
      </Section>

      <Section
        title="Kanban board"
        description="Horizontal scroll on mobile, sticky column headers, native drag-and-drop with visual feedback. No dnd-kit, no framer-motion — just draggable + CSS transforms."
      >
        <Showcase code={CODE.kanban} bleed>
          <div style={{ padding: '1rem' }}>
            <Kanban columns={[{ id: 'todo', title: 'To do' }, { id: 'doing', title: 'In progress' }, { id: 'done', title: 'Done' }]} cards={cards} onMove={handleMove} onCardClick={(card) => toast({ title: card.title, description: card.description, tone: 'info' })} />
          </div>
        </Showcase>
        <Callout tone="success" title="Drag it">
          Try dragging cards between columns. The column lights up with a primary ring, the card rotates 1° and scales down while dragging — a tiny detail that makes it feel physical.
        </Callout>
      </Section>

      <Section title="Timeline" description="Vertical timeline with dot tones, active ring, and a card slot. Used for audits, deploys, onboarding — anywhere you need to show history.">
        <Showcase code={CODE.timeline} width="md">
          <Card padded>
            <Timeline>
              <TimelineItem timestamp="2h ago" title="Deployed to production" tone="success" active description="Release v2.4.1 — 12 commits by Ada and Grace">
                <div className="pui-timeline__card">
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <Badge tone="success">12 commits</Badge>
                    <Badge tone="primary">Production</Badge>
                    <Badge tone="neutral">v2.4.1</Badge>
                  </div>
                </div>
              </TimelineItem>
              <TimelineItem timestamp="5h ago" title="Feature flag enabled" tone="primary" description="Rollout to 25% of users — auto rollback on error rate >1%" />
              <TimelineItem timestamp="Yesterday · 4:32 PM" title="Incident resolved" tone="warning" description="API latency spike — root cause: missing index on events table" />
              <TimelineItem timestamp="2 days ago" title="New teammate joined" tone="neutral" description="Grace Hopper joined as Staff Engineer">
                <Button size="sm" variant="secondary">Say hi</Button>
              </TimelineItem>
              <TimelineItem timestamp="3 days ago" title="Design review" tone="danger" description="Pricing page feedback — 8 comments" />
            </Timeline>
          </Card>
        </Showcase>
      </Section>

      <Section title="Why these are premium">
        <div className="grid-2">
          <Card padded>
            <div className="section__title" style={{ fontSize: '0.9375rem', marginBottom: '0.5rem' }}>Most libraries don't have them</div>
            <p className="prose">Dropzone, kanban and timeline are product patterns, not primitives. You usually build them yourself or pull in 3 separate libraries. Here they share the same tokens and focus handling as Button and Input.</p>
          </Card>
          <Card padded>
            <div className="section__title" style={{ fontSize: '0.9375rem', marginBottom: '0.5rem' }}>Zero dependency, zero config</div>
            <p className="prose">No react-dropzone, no dnd-kit, no date-fns. Just React + CSS. The bundle cost is ~4.2kB gzip for all three combined — less than most single-dependency solutions.</p>
          </Card>
        </div>
      </Section>

      <Section title="API">
        <PropsTable
          rows={[
            { name: 'Dropzone.accept', type: 'string', description: 'Passed to the hidden file input.' },
            { name: 'Dropzone.maxSize', type: 'number', description: 'Max file size in bytes. Oversize files show an alert.' },
            { name: 'Dropzone.files / onFilesChange', type: 'DropzoneFile[]', description: 'Controlled mode. Leave undefined for internal state.' },
            { name: 'Kanban.columns', type: '{ id, title, icon? }[]', required: true, description: 'Column definitions.' },
            { name: 'Kanban.cards', type: 'KanbanCard[]', required: true, description: '{ id, columnId, title, description?, tags?, assignee?, priority?, due? }.' },
            { name: 'Kanban.onMove', type: '(cardId, toColumnId, toIndex) => void', description: 'Called on drop. Update your state.' },
            { name: 'TimelineItem.tone', type: 'neutral | primary | success | warning | danger', default: 'neutral', description: 'Dot color.' },
            { name: 'TimelineItem.active', type: 'boolean', default: 'false', description: 'Adds a focus ring to the dot.' },
          ]}
        />
      </Section>
    </DocPage>
  );
}
