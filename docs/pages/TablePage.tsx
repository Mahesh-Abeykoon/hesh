import { useMemo, useState } from 'react';
import {
  Avatar,
  Badge,
  Button,
  Card,
  CardBody,
  DataTable,
  EmptyState,
  Input,
  Pagination,
  type Column,
  type SortState,
} from '../../src/index';
import { PlusIcon, SearchIcon } from '../../src/index';
import { Callout, PropsTable, Showcase } from '../components/Showcase';
import { DocPage, Section } from '../components/DocPage';

interface Customer {
  id: string;
  name: string;
  email: string;
  plan: 'Starter' | 'Growth' | 'Scale';
  status: 'active' | 'trialing' | 'past_due';
  mrr: number;
}

const CUSTOMERS: Customer[] = [
  { id: '1', name: 'Ada Lovelace', email: 'ada@analytical.engine', plan: 'Scale', status: 'active', mrr: 1490 },
  { id: '2', name: 'Grace Hopper', email: 'grace@compiler.dev', plan: 'Growth', status: 'active', mrr: 490 },
  { id: '3', name: 'Alan Turing', email: 'alan@bletchley.uk', plan: 'Scale', status: 'trialing', mrr: 0 },
  { id: '4', name: 'Katherine Johnson', email: 'kj@nasa.gov', plan: 'Growth', status: 'past_due', mrr: 490 },
  { id: '5', name: 'Linus Torvalds', email: 'linus@kernel.org', plan: 'Starter', status: 'active', mrr: 190 },
  { id: '6', name: 'Margaret Hamilton', email: 'mh@apollo.dev', plan: 'Scale', status: 'active', mrr: 1490 },
  { id: '7', name: 'Barbara Liskov', email: 'bl@substitution.cs', plan: 'Growth', status: 'trialing', mrr: 0 },
  { id: '8', name: 'Tim Berners-Lee', email: 'tim@web.foundation', plan: 'Starter', status: 'active', mrr: 190 },
  { id: '9', name: 'Radia Perlman', email: 'radia@spanning.tree', plan: 'Growth', status: 'past_due', mrr: 490 },
  { id: '10', name: 'Ken Thompson', email: 'ken@bell.labs', plan: 'Scale', status: 'active', mrr: 1490 },
  { id: '11', name: 'Anita Borg', email: 'anita@institute.org', plan: 'Starter', status: 'trialing', mrr: 0 },
  { id: '12', name: 'Shafi Goldwasser', email: 'shafi@crypto.mit', plan: 'Growth', status: 'active', mrr: 490 },
];

const STATUS_TONE = {
  active: 'success',
  trialing: 'info',
  past_due: 'danger',
} as const;

const STATUS_LABEL = {
  active: 'Active',
  trialing: 'Trialing',
  past_due: 'Past due',
} as const;

const COLUMNS = `const columns: Column<Customer>[] = [
  {
    id: 'name',
    header: 'Customer',
    accessor: (row) => row.name,
    sortable: true,
    cell: (row) => (
      <div className="row-wrap">
        <Avatar name={row.name} size="sm" />
        <div>
          <div className="pui-table__primary">{row.name}</div>
          <div className="cell-sub">{row.email}</div>
        </div>
      </div>
    ),
  },
  { id: 'plan', header: 'Plan', accessor: (row) => row.plan, sortable: true },
  {
    id: 'mrr',
    header: 'MRR',
    accessor: (row) => row.mrr,
    sortable: true,
    numeric: true,
    align: 'end',
    cell: (row) => \`$\${row.mrr.toLocaleString()}\`,
  },
];`;

const USAGE = `<DataTable
  columns={columns}
  data={page}
  rowKey={(row) => row.id}
  sort={sort}
  onSortChange={setSort}
  selectable
  selectedKeys={selected}
  onSelectionChange={setSelected}
  loading={loading}
  emptyState={<EmptyState title="No customers" />}
  toolbar={<Input placeholder="Search…" leftAddon={<SearchIcon />} />}
  footer={<Pagination page={page} pageCount={pageCount} onPageChange={setPage} />}
/>`;

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

function buildColumns(): Column<Customer>[] {
  return [
    {
      id: 'name',
      header: 'Customer',
      accessor: (row) => row.name,
      sortable: true,
      cell: (row) => (
        <div className="row-wrap" style={{ gap: '0.625rem' }}>
          <Avatar name={row.name} size="sm" />
          <div>
            <div className="pui-table__primary">{row.name}</div>
            <div className="cell-sub">{row.email}</div>
          </div>
        </div>
      ),
    },
    { id: 'plan', header: 'Plan', accessor: (row) => row.plan, sortable: true, hideBelow: 'mobile' },
    {
      id: 'status',
      header: 'Status',
      accessor: (row) => row.status,
      sortable: true,
      cell: (row) => (
        <Badge tone={STATUS_TONE[row.status]} dot>
          {STATUS_LABEL[row.status]}
        </Badge>
      ),
    },
    {
      id: 'mrr',
      header: 'MRR',
      accessor: (row) => row.mrr,
      sortable: true,
      numeric: true,
      align: 'end',
      cell: (row) => currency.format(row.mrr),
    },
  ];
}

export function TablePage() {
  const [sort, setSort] = useState<SortState | null>({ column: 'mrr', direction: 'desc' });
  const [selected, setSelected] = useState<string[]>([]);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [density, setDensity] = useState<'compact' | 'comfortable' | 'spacious'>('comfortable');
  const [striped, setStriped] = useState(false);
  const [bordered, setBorderd] = useState(false);

  const columns = useMemo(buildColumns, []);

  const sorted = useMemo(() => {
    const rows = [...CUSTOMERS];
    const term = query.trim().toLowerCase();
    const filtered = term
      ? rows.filter((row) =>
          `${row.name} ${row.email} ${row.plan}`.toLowerCase().includes(term)
        )
      : rows;

    if (!sort) return filtered;
    const column = columns.find((entry) => entry.id === sort.column);
    if (!column?.accessor) return filtered;

    return filtered.sort((a, b) => {
      const left = column.accessor!(a);
      const right = column.accessor!(b);
      const result =
        typeof left === 'number' && typeof right === 'number'
          ? left - right
          : String(left).localeCompare(String(right));
      return sort.direction === 'asc' ? result : -result;
    });
  }, [columns, sort, query]);

  const pageSize = 5;
  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const pageRows = sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <DocPage
      eyebrow="Layout & display"
      title="Data table"
      lede="Sorting, row selection, expandable details, density scales, loading skeletons and empty states — with full WAI-ARIA grid accessibility semantics."
    >
      <Section title="Columns" description="Give each column an accessor and the table can sort it for you; give it a cell and you control the rendering.">
        <Showcase code={COLUMNS} defaultOpen />
      </Section>

      <Section
        title="Full Interactive Table"
        description="Search, sort, multi-row selection, density switcher, and pagination. Try selecting rows and clicking column headers."
      >
        <Showcase code={USAGE} bleed defaultOpen>
          <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--pui-border)', display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--pui-fg-muted)' }}>Density:</span>
            {(['compact', 'comfortable', 'spacious'] as const).map((d) => (
              <Button
                key={d}
                size="sm"
                variant={density === d ? 'primary' : 'ghost'}
                onClick={() => setDensity(d)}
              >
                {d.charAt(0).toUpperCase() + d.slice(1)}
              </Button>
            ))}
            <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem' }}>
              <Button
                size="sm"
                variant={striped ? 'secondary' : 'ghost'}
                onClick={() => setStriped(!striped)}
              >
                {striped ? 'Striped: On' : 'Striped: Off'}
              </Button>
              <Button
                size="sm"
                variant={bordered ? 'secondary' : 'ghost'}
                onClick={() => setBorderd(!bordered)}
              >
                {bordered ? 'Bordered: On' : 'Bordered: Off'}
              </Button>
            </div>
          </div>
          <DataTable
            columns={columns}
            data={pageRows}
            rowKey={(row) => row.id}
            sort={sort}
            onSortChange={setSort}
            selectable
            selectedKeys={selected}
            onSelectionChange={setSelected}
            density={density}
            striped={striped}
            bordered={bordered}
            loading={loading}
            expandedRowRender={(row) => (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', fontSize: '0.8125rem' }}>
                <div>
                  <div style={{ color: 'var(--pui-fg-muted)', fontSize: '0.75rem', marginBottom: '0.25rem' }}>Customer Details</div>
                  <div><strong>ID:</strong> cust_{row.id}9824</div>
                  <div><strong>Email:</strong> {row.email}</div>
                </div>
                <div>
                  <div style={{ color: 'var(--pui-fg-muted)', fontSize: '0.75rem', marginBottom: '0.25rem' }}>Billing Plan</div>
                  <div><strong>Tier:</strong> {row.plan} Enterprise</div>
                  <div><strong>Annual ARR:</strong> ${((row.mrr * 12) || 0).toLocaleString()}</div>
                </div>
                <div>
                  <div style={{ color: 'var(--pui-fg-muted)', fontSize: '0.75rem', marginBottom: '0.25rem' }}>Account Status</div>
                  <div><Badge tone={STATUS_TONE[row.status]}>{STATUS_LABEL[row.status]}</Badge></div>
                </div>
              </div>
            )}
            emptyState={
              <EmptyState
                title="No customers match"
                description="Try a different search term, or clear the filters."
                action={
                  <Button size="sm" variant="secondary" onClick={() => setQuery('')}>
                    Clear search
                  </Button>
                }
              />
            }
            toolbar={
              <div className="row-wrap" style={{ flex: 1 }}>
                <div style={{ minWidth: 240, flex: 1 }}>
                  <Input
                    placeholder="Search customers…"
                    value={query}
                    onChange={(event) => {
                      setQuery(event.target.value);
                      setPage(1);
                    }}
                    leftAddon={<SearchIcon />}
                  />
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setLoading(true);
                    window.setTimeout(() => setLoading(false), 1000);
                  }}
                >
                  {loading ? 'Loading…' : 'Refetch'}
                </Button>
                <Button size="sm" leftIcon={<PlusIcon />}>
                  Add customer
                </Button>
              </div>
            }
            footer={
              <>
                <span>
                  {selected.length > 0
                    ? `${selected.length} of ${sorted.length} selected`
                    : `Showing ${pageRows.length} of ${sorted.length}`}
                </span>
                <Pagination page={currentPage} pageCount={pageCount} onPageChange={setPage} />
              </>
            }
          />
        </Showcase>
      </Section>

      <Section title="Empty and loading">
        <div className="grid-2">
          <Showcase>
            <DataTable
              columns={columns.slice(0, 3)}
              data={[]}
              rowKey={(row) => row.id}
              emptyState={
                <EmptyState
                  title="No customers yet"
                  description="Connect a data source or import a CSV to get started."
                  action={<Button size="sm">Import CSV</Button>}
                />
              }
            />
          </Showcase>
          <Showcase>
            <DataTable
              columns={columns.slice(0, 3)}
              data={[]}
              rowKey={(row) => row.id}
              loading
              loadingRows={4}
            />
          </Showcase>
        </div>
        <Callout tone="info" title="Skeletons match the content">
          Loading rows use the same column widths as real rows, so the table does
          not reflow when data arrives. Set <code>loadingRows</code> to match the
          number of rows you expect to fetch.
        </Callout>
      </Section>

      <Section title="API Reference">
        <PropsTable
          rows={[
            { name: 'columns', type: 'readonly Column<T>[]', required: true, description: 'id, header, accessor, cell, sortable, numeric, align, width, hideBelow.' },
            { name: 'data', type: 'readonly T[]', required: true, description: 'Row objects for the current page.' },
            { name: 'rowKey', type: '(row: T, index: number) => string', required: true, description: 'Stable identity for selection and reconciliation.' },
            { name: 'sort', type: 'SortState | null', description: 'Controlled sorting state.' },
            { name: 'onSortChange', type: '(sort: SortState | null) => void', description: 'Clicking header cycles asc → desc → null.' },
            { name: 'selectable', type: 'boolean', default: 'false', description: 'Adds checkbox selection column with tri-state header.' },
            { name: 'selectedKeys', type: 'readonly string[]', description: 'Controlled array of selected row keys.' },
            { name: 'onSelectionChange', type: '(keys: string[]) => void', description: 'Callback fired on row selection.' },
            { name: 'density', type: "'compact' | 'comfortable' | 'spacious'", default: "'comfortable'", description: 'Vertical padding density scale.' },
            { name: 'striped', type: 'boolean', default: 'false', description: 'Alternating zebra background striping.' },
            { name: 'bordered', type: 'boolean', default: 'false', description: 'Full grid cell borders.' },
            { name: 'expandedRowRender', type: '(row: T, index: number) => ReactNode', description: 'Renderer for expandable sub-row panels with toggle chevrons.' },
            { name: 'loading', type: 'boolean', default: 'false', description: 'Shows skeleton rows and screen-reader status.' },
            { name: 'loadingRows', type: 'number', default: '5', description: 'Number of skeleton placeholder rows.' },
            { name: 'emptyState', type: 'ReactNode', description: 'Rendered across full width when data is empty.' },
            { name: 'toolbar', type: 'ReactNode', description: 'Toolbar container rendered above header.' },
            { name: 'footer', type: 'ReactNode', description: 'Footer container rendered below table body.' },
          ]}
        />
      </Section>

      <Section title="Accessibility">
        <Card>
          <CardBody>
            <ul className="tick-list">
              <li>
                Sortable headers are real <code>&lt;button&gt;</code>s inside{' '}
                <code>&lt;th scope="col"&gt;</code>, and the active column reports{' '}
                <code>aria-sort="ascending" | "descending"</code>.
              </li>
              <li>
                The select-all checkbox reports <code>aria-checked="mixed"</code>{' '}
                when only some rows are selected — the indeterminate DOM property
                alone is not announced.
              </li>
              <li>
                Row checkboxes carry per-row accessible names ("Select row 3"), so
                they are distinguishable when navigated out of context.
              </li>
              <li>
                Expandable row toggles report <code>aria-expanded</code> and accessible labels.
              </li>
            </ul>
          </CardBody>
        </Card>
      </Section>
    </DocPage>
  );
}
