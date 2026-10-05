import { useState } from 'react';
import { Pagination } from '../../../src/index';
import { Callout, PropsTable, Showcase } from '../../components/Showcase';
import { DocPage, Section } from '../../components/DocPage';

const PAGINATION_DEMO = `const [page, setPage] = useState(1);

<Pagination
  page={page}
  pageSize={10}
  total={124}
  onPageChange={setPage}
/>`;

export function PaginationPage() {
  const [page, setPage] = useState(1);

  return (
    <DocPage
      eyebrow="Components"
      title="Pagination"
      lede="Navigation controls for paginating large data collections with total count summaries and accessible page buttons."
      importStatement="import { Pagination } from 'hesh';"
    >
      <Section
        title="Interactive Pagination"
        description="Displays current range, total items, and previous/next page navigation buttons."
      >
        <Showcase code={PAGINATION_DEMO} defaultOpen width="md">
          <Pagination
            page={page}
            pageCount={12}
            onPageChange={setPage}
          />
        </Showcase>
      </Section>

      <Section title="API Reference">
        <PropsTable
          rows={[
            { name: 'page', type: 'number', required: true, description: 'Current active page (1-based index).' },
            { name: 'pageSize', type: 'number', required: true, description: 'Number of items per page.' },
            { name: 'total', type: 'number', required: true, description: 'Total count of records in dataset.' },
            { name: 'onPageChange', type: '(page: number) => void', required: true, description: 'Callback fired on page transition.' },
          ]}
        />
      </Section>
    </DocPage>
  );
}
