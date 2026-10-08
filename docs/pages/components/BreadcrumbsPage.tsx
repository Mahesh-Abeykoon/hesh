import { Breadcrumbs } from '../../../src/index';
import { Callout, PropsTable, Showcase } from '../../components/Showcase';
import { DocPage, Section } from '../../components/DocPage';

const BREADCRUMBS_DEMO = `<Breadcrumbs
  items={[
    { label: 'Workspaces', href: '#/workspaces' },
    { label: 'Acme Corp', href: '#/workspaces/acme' },
    { label: 'Production API', href: '#/workspaces/acme/prod' },
    { label: 'Environment Variables' },
  ]}
/>`;

export function BreadcrumbsPage() {
  return (
    <DocPage
      eyebrow="Components"
      title="Breadcrumbs"
      lede="Displays the current location within a hierarchical hierarchy with accessible landmark structure."
      importStatement="import { Breadcrumbs } from 'hesh-ui';"
    >
      <Section
        title="Hierarchical path"
        description="Renders a navigable chain of ancestor pages ending with the current unlinked page."
      >
        <Showcase code={BREADCRUMBS_DEMO} defaultOpen width="md">
          <Breadcrumbs
            items={[
              { label: 'Workspaces', href: '#/workspaces' },
              { label: 'Acme Corp', href: '#/workspaces/acme' },
              { label: 'Production API', href: '#/workspaces/acme/prod' },
              { label: 'Environment Variables' },
            ]}
          />
        </Showcase>
      </Section>

      <Section title="Accessibility">
        <Callout tone="info" title="Accessible Navigation Landmark">
          Wrapped in a semantic <code>&lt;nav aria-label="Breadcrumbs"&gt;</code> element containing an ordered list <code>&lt;ol&gt;</code>. The current page is marked with <code>aria-current="page"</code>, and separators are hidden from assistive technology.
        </Callout>
      </Section>

      <Section title="API Reference">
        <PropsTable
          rows={[
            { name: 'items', type: 'BreadcrumbItem[]', required: true, description: 'Array of items with label, optional href, and optional onClick.' },
            { name: 'separator', type: 'ReactNode', default: "'/'", description: 'Custom separator character or icon between items.' },
          ]}
        />
      </Section>
    </DocPage>
  );
}
