import { useState } from 'react';
import { Pagination, Badge, Button } from '../../../src/index';
import { Callout, PropsTable, Showcase } from '../../components/Showcase';
import { DocPage, Section } from '../../components/DocPage';

const STANDARD_DEMO = `const [page, setPage] = useState(1);

<Pagination
  page={page}
  pageCount={16}
  onPageChange={setPage}
/>`;

const TOTAL_AND_SIZE_DEMO = `const [page, setPage] = useState(3);
const [pageSize, setPageSize] = useState(20);

<Pagination
  page={page}
  total={384}
  pageSize={pageSize}
  showTotal={true}
  showSizeChanger={true}
  pageSizeOptions={[10, 20, 50, 100]}
  onPageChange={setPage}
  onPageSizeChange={(newSize) => {
    setPageSize(newSize);
    setPage(1);
  }}
/>`;

const SIMPLE_DEMO = `const [mobilePage, setMobilePage] = useState(2);

<Pagination
  page={mobilePage}
  total={180}
  pageSize={15}
  simple={true}
  showTotal={true}
  onPageChange={setMobilePage}
/>`;

export function PaginationPage() {
  const [page, setPage] = useState(1);
  const [largePage, setLargePage] = useState(7);
  const [pageWithTotal, setPageWithTotal] = useState(3);
  const [pageSize, setPageSize] = useState(20);
  const [simplePage, setSimplePage] = useState(2);
  const [customPage, setCustomPage] = useState(1);

  return (
    <DocPage
      eyebrow="Components"
      title="Pagination"
      lede="Responsive navigation for chunked datasets, tables, and product catalogs. Supports total summaries, page size changers, and compact mobile modes."
      importStatement="import { Pagination } from 'hesh';"
    >
      <Section
        title="Interactive Standard Pagination"
        description="Smart ellipsis windowing automatically pins the first, active, sibling, and terminal pages."
      >
        <Showcase code={STANDARD_DEMO} defaultOpen width="md">
          <div className="stack" style={{ gap: '1.25rem' }}>
            <div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--pui-fg-subtle)', marginBottom: '0.5rem' }}>
                Active Page: <Badge tone="primary" size="sm">{largePage}</Badge> of 16
              </div>
              <Pagination
                page={largePage}
                pageCount={16}
                onPageChange={setLargePage}
              />
            </div>
          </div>
        </Showcase>
      </Section>

      <Section
        title="Total Summary & Page Size Changer"
        description="Enterprise pagination showing record ranges alongside a per-page dropdown selector."
      >
        <Showcase code={TOTAL_AND_SIZE_DEMO} width="md">
          <div className="stack" style={{ gap: '1rem', width: '100%' }}>
            <Pagination
              page={pageWithTotal}
              total={482}
              pageSize={pageSize}
              showTotal={true}
              showSizeChanger={true}
              pageSizeOptions={[10, 20, 50, 100]}
              onPageChange={setPageWithTotal}
              onPageSizeChange={(newSize) => {
                setPageSize(newSize);
                setPageWithTotal(1);
              }}
            />
          </div>
        </Showcase>
      </Section>

      <Section
        title="Simple / Mobile Mode"
        description="Streamlined pagination layout optimized for mobile viewports, cards, and modal dialogs."
      >
        <Showcase code={SIMPLE_DEMO} width="md">
          <div style={{ maxWidth: '360px', width: '100%' }}>
            <Pagination
              page={simplePage}
              total={150}
              pageSize={15}
              simple={true}
              showTotal={true}
              onPageChange={setSimplePage}
            />
          </div>
        </Showcase>
      </Section>

      <Section
        title="Size Variations"
        description="Choose between small, medium, and large button hit targets for different UI densities."
      >
        <Showcase code={`<Pagination size="sm" | "md" | "lg" ... />`} width="md">
          <div className="stack" style={{ gap: '1.5rem', width: '100%' }}>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--pui-fg-subtle)', marginBottom: '0.375rem' }}>SMALL (sm)</div>
              <Pagination
                page={customPage}
                pageCount={8}
                size="sm"
                onPageChange={setCustomPage}
              />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--pui-fg-subtle)', marginBottom: '0.375rem' }}>MEDIUM (md - Default)</div>
              <Pagination
                page={customPage}
                pageCount={8}
                size="md"
                onPageChange={setCustomPage}
              />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--pui-fg-subtle)', marginBottom: '0.375rem' }}>LARGE (lg)</div>
              <Pagination
                page={customPage}
                pageCount={8}
                size="lg"
                onPageChange={setCustomPage}
              />
            </div>
          </div>
        </Showcase>
      </Section>

      <Section title="Accessibility">
        <Callout tone="info" title="Screen Reader Navigation">
          Rendered inside a semantic <code className="pui-code">&lt;nav aria-label=&quot;Pagination&quot;&gt;</code> landmark. Active page button receives <code className="pui-code">aria-current=&quot;page&quot;</code> and disabled edge controls report disabled states to assistive tech.
        </Callout>
      </Section>

      <Section title="API Reference">
        <PropsTable
          rows={[
            { name: 'page', type: 'number', required: true, description: 'Current active 1-based page index.' },
            { name: 'pageCount', type: 'number', description: 'Total number of pages. Automatically derived from total and pageSize if omitted.' },
            { name: 'total', type: 'number', description: 'Total count of records across the entire dataset.' },
            { name: 'pageSize', type: 'number', default: '10', description: 'Number of records displayed per page.' },
            { name: 'onPageChange', type: '(page: number) => void', required: true, description: 'Callback fired when a user selects a page or arrow.' },
            { name: 'showTotal', type: 'boolean | ((total, range) => ReactNode)', default: 'false', description: 'Renders record range and total counter.' },
            { name: 'showSizeChanger', type: 'boolean', default: 'false', description: 'Displays dropdown selector to adjust page size.' },
            { name: 'simple', type: 'boolean', default: 'false', description: 'Enables mobile-friendly compact layout.' },
            { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Button target scale.' },
          ]}
        />
      </Section>
    </DocPage>
  );
}
