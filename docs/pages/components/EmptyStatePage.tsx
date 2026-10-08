import { EmptyState, Button } from '../../../src/index';
import { Callout, PropsTable, Showcase } from '../../components/Showcase';
import { DocPage, Section } from '../../components/DocPage';

const EMPTY_DEMO = `<EmptyState
  title="No deployments found"
  description="Push a commit to main or trigger a manual deploy to see activity here."
  action={<Button>Deploy now</Button>}
  secondaryAction={<Button variant="ghost">Read deployment docs</Button>}
/>`;

export function EmptyStatePage() {
  return (
    <DocPage
      eyebrow="Components"
      title="EmptyState"
      lede="Engaging placeholder screen displayed when no data or content is present, steering users to clear next steps."
      importStatement="import { EmptyState } from 'hesh-ui';"
    >
      <Section
        title="Action-oriented Empty State"
        description="Never just display a dead end. Give the user an immediate primary and optional secondary action."
      >
        <Showcase code={EMPTY_DEMO} defaultOpen width="md">
          <EmptyState
            title="No deployments found"
            description="Push a commit to main or trigger a manual deploy to see activity here."
            action={<Button>Deploy now</Button>}
            secondaryAction={<Button variant="ghost">Read deployment docs</Button>}
          />
        </Showcase>
      </Section>

      <Section title="API Reference">
        <PropsTable
          rows={[
            { name: 'title', type: 'ReactNode', required: true, description: 'Primary heading message.' },
            { name: 'description', type: 'ReactNode', description: 'Helpful explanation and guidance.' },
            { name: 'action', type: 'ReactNode', description: 'Primary action button or control.' },
            { name: 'secondaryAction', type: 'ReactNode', description: 'Secondary button or link.' },
            { name: 'plain', type: 'boolean', default: 'false', description: 'Renders without the dashed outer container border.' },
          ]}
        />
      </Section>
    </DocPage>
  );
}
