import { PageHeader, Button, Badge } from '../../../src/index';
import { Callout, PropsTable, Showcase } from '../../components/Showcase';
import { DocPage, Section } from '../../components/DocPage';

const HEADER_DEMO = `<PageHeader
  title="API Gateways"
  description="Manage ingress routing, edge middleware, and rate limiting."
  actions={
    <>
      <Button variant="secondary">View logs</Button>
      <Button>Create gateway</Button>
    </>
  }
/>`;

export function PageHeaderPage() {
  return (
    <DocPage
      eyebrow="Components"
      title="PageHeader"
      lede="Top landmark for application pages containing page title, description, badge tags, and primary action buttons."
      importStatement="import { PageHeader } from 'hesh';"
    >
      <Section
        title="Standard Page Header"
        description="Responsive layout aligning title content on the left with action buttons on the right."
      >
        <Showcase code={HEADER_DEMO} defaultOpen width="md">
          <PageHeader
            title="API Gateways"
            description="Manage ingress routing, edge middleware, and rate limiting across your infrastructure."
            actions={
              <div className="row-wrap" style={{ gap: '0.5rem' }}>
                <Button variant="secondary" size="sm">View logs</Button>
                <Button size="sm">Create gateway</Button>
              </div>
            }
          />
        </Showcase>
      </Section>

      <Section title="API Reference">
        <PropsTable
          rows={[
            { name: 'title', type: 'ReactNode', required: true, description: 'Primary page title heading.' },
            { name: 'description', type: 'ReactNode', description: 'Subtitle or description paragraph.' },
            { name: 'actions', type: 'ReactNode', description: 'Action button controls.' },
            { name: 'breadcrumbs', type: 'ReactNode', description: 'Breadcrumbs displayed above the heading.' },
          ]}
        />
      </Section>
    </DocPage>
  );
}
