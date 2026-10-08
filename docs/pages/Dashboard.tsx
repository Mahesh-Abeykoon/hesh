import { useMemo, useState } from 'react';
import {
  Avatar,
  AvatarGroup,
  Badge,
  Breadcrumbs,
  Button,
  Card,
  CardBody,
  CardHeader,
  Combobox,
  DataTable,
  DropdownMenu,
  IconButton,
  Input,
  PageHeader,
  Progress,
  Separator,
  SidebarNav,
  Stat,
  Tabs,
  ToastProvider,
  Tooltip,
  useToast,
  type Column,
} from '../../src/index';
import {
  ArrowDownIcon,
  ArrowRightIcon,
  BarChartIcon,
  BellIcon,
  ChevronDownIcon,
  CreditCardIcon,
  DownloadIcon,
  HomeIcon,
  LayoutIcon,
  PlusIcon,
  SearchIcon,
  SettingsIcon,
  ZapIcon,
  TrendingUpIcon,
  UsersIcon,
} from '../../src/index';
import { Showcase } from '../components/Showcase';
import { DocPage, Section } from '../components/DocPage';

/* ------------------------------------------------------------------ data */

interface Metric {
  id: string;
  label: string;
  value: string;
  delta: number;
  series: number[];
}

const METRICS: Metric[] = [
  { id: 'mrr', label: 'Monthly recurring revenue', value: '$48,290', delta: 12.4, series: [28, 31, 30, 35, 38, 37, 42, 45, 44, 48, 51, 54] },
  { id: 'customers', label: 'Active customers', value: '1,204', delta: 8.1, series: [820, 860, 890, 910, 940, 980, 1010, 1040, 1080, 1120, 1170, 1204] },
  { id: 'churn', label: 'Net churn', value: '2.1%', delta: -18.6, series: [4.2, 4.0, 3.8, 3.9, 3.5, 3.3, 3.1, 3.0, 2.7, 2.5, 2.3, 2.1] },
  { id: 'conversion', label: 'Trial conversion', value: '34.8%', delta: 4.2, series: [22, 24, 23, 26, 27, 29, 28, 31, 32, 33, 34, 34.8] },
];

interface Customer {
  id: string;
  name: string;
  email: string;
  plan: string;
  mrr: number;
  health: number;
}

const CUSTOMERS: Customer[] = [
  { id: '1', name: 'Ada Lovelace', email: 'ada@analytical.engine', plan: 'Scale', mrr: 1490, health: 96 },
  { id: '2', name: 'Grace Hopper', email: 'grace@compiler.dev', plan: 'Growth', mrr: 490, health: 88 },
  { id: '3', name: 'Alan Turing', email: 'alan@bletchley.uk', plan: 'Scale', mrr: 1490, health: 41 },
  { id: '4', name: 'Katherine Johnson', email: 'kj@nasa.gov', plan: 'Growth', mrr: 490, health: 72 },
  { id: '5', name: 'Linus Torvalds', email: 'linus@kernel.org', plan: 'Starter', mrr: 190, health: 91 },
  { id: '6', name: 'Margaret Hamilton', email: 'mh@apollo.dev', plan: 'Scale', mrr: 1490, health: 84 },
];

const ACTIVITY = [
  { who: 'Ada Lovelace', what: 'upgraded to Scale', when: '2m ago', tone: 'success' as const },
  { who: 'Grace Hopper', what: 'invited 3 teammates', when: '18m ago', tone: 'info' as const },
  { who: 'Alan Turing', what: 'payment failed', when: '1h ago', tone: 'danger' as const },
  { who: 'Katherine Johnson', what: 'created an API key', when: '3h ago', tone: 'neutral' as const },
  { who: 'Linus Torvalds', what: 'downgraded to Starter', when: '5h ago', tone: 'warning' as const },
];

/* ------------------------------------------------------------------ charts */

function Sparkline({ data, tone = 'var(--pui-primary)', height = 34 }: { data: number[]; tone?: string; height?: number }) {
  const width = 120;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((value - min) / span) * (height - 4) - 2;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const id = useMemo(() => `spark-${Math.random().toString(36).slice(2, 9)}`, []);

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={tone} stopOpacity="0.25" />
          <stop offset="100%" stopColor={tone} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,${height} ${points.join(' ')} ${width},${height}`} fill={`url(#${id})`} />
      <polyline points={points.join(' ')} stroke={tone} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function AreaChart() {
  const data = METRICS[0]!.series;
  const width = 720;
  const height = 220;
  const padding = { top: 16, right: 16, bottom: 28, left: 44 };
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;

  const min = Math.min(...data) * 0.9;
  const max = Math.max(...data) * 1.05;
  const span = max - min;

  const x = (index: number) => padding.left + (index / (data.length - 1)) * innerW;
  const y = (value: number) => padding.top + innerH - ((value - min) / span) * innerH;

  const line = data.map((value, index) => `${x(index).toFixed(1)},${y(value).toFixed(1)}`).join(' ');
  const area = `${padding.left},${padding.top + innerH} ${line} ${padding.left + innerW},${padding.top + innerH}`;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const [hover, setHover] = useState<number | null>(null);

  return (
    <div className="chart">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="chart__svg"
        role="img"
        aria-label="Monthly recurring revenue over the last twelve months, rising from 28,000 to 54,000 dollars."
        onMouseLeave={() => setHover(null)}
      >
        <defs>
          <linearGradient id="area-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--pui-primary)" stopOpacity="0.28" />
            <stop offset="100%" stopColor="var(--pui-primary)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
          const value = min + span * (1 - ratio);
          const gy = padding.top + innerH * ratio;
          return (
            <g key={ratio}>
              <line x1={padding.left} x2={width - padding.right} y1={gy} y2={gy} stroke="var(--pui-border)" strokeWidth="1" strokeDasharray={ratio === 1 ? undefined : '3 4'} />
              <text x={padding.left - 10} y={gy + 4} textAnchor="end" className="chart__axis">
                {Math.round(value / 1000)}k
              </text>
            </g>
          );
        })}

        <polygon points={area} fill="url(#area-fill)" />
        <polyline points={line} fill="none" stroke="var(--pui-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

        {data.map((value, index) => (
          <g key={index}>
            <rect
              x={x(index) - innerW / data.length / 2}
              y={padding.top}
              width={innerW / data.length}
              height={innerH}
              fill="transparent"
              onMouseEnter={() => setHover(index)}
            />
            <circle
              cx={x(index)}
              cy={y(value)}
              r={hover === index ? 5 : 3}
              fill="var(--pui-surface)"
              stroke="var(--pui-primary)"
              strokeWidth={hover === index ? 3 : 2}
              style={{ transition: 'r 120ms' }}
            />
            <text x={x(index)} y={height - 8} textAnchor="middle" className="chart__axis">
              {months[index]}
            </text>
          </g>
        ))}

        {hover !== null && (
          <g>
            <line x1={x(hover)} x2={x(hover)} y1={padding.top} y2={padding.top + innerH} stroke="var(--pui-primary)" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
          </g>
        )}
      </svg>

      {hover !== null && (
        <div
          className="chart__tip"
          style={{
            left: `${(x(hover) / width) * 100}%`,
            top: `${(y(data[hover]!) / height) * 100}%`,
          }}
        >
          <div className="chart__tip-label">{months[hover]} · MRR</div>
          <div className="chart__tip-value">${(data[hover]! * 1000).toLocaleString()}</div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ screen */

function DashboardScreen() {
  const { toast } = useToast();
  const [active, setActive] = useState('overview');
  const [range, setRange] = useState('30d');

  const columns: Column<Customer>[] = [
    {
      id: 'name',
      header: 'Customer',
      sortable: true,
      accessor: (row) => row.name,
      cell: (row) => (
        <div className="row-wrap" style={{ gap: '0.5rem', alignItems: 'center' }}>
          <Avatar name={row.name} size="sm" status={row.health > 80 ? 'online' : row.health > 60 ? 'away' : 'busy'} />
          <div style={{ minWidth: 0 }}>
            <div className="pui-table__primary" style={{ fontSize: '0.8125rem', whiteSpace: 'nowrap' }}>{row.name}</div>
            <div className="cell-sub" style={{ fontSize: '0.6875rem' }}>{row.email}</div>
          </div>
        </div>
      ),
    },
    { id: 'plan', header: 'Plan', sortable: true, accessor: (row) => row.plan },
    {
      id: 'health',
      header: 'Account health',
      sortable: true,
      accessor: (row) => row.health,
      hideBelow: 'mobile',
      width: 160,
      cell: (row) => (
        <div className="row-wrap" style={{ gap: '0.5rem' }}>
          <Progress
            value={row.health}
            tone={row.health > 80 ? 'success' : row.health > 60 ? 'warning' : 'danger'}
          />
          <span className="cell-sub">{row.health}</span>
        </div>
      ),
    },
    {
      id: 'mrr',
      header: 'MRR',
      sortable: true,
      numeric: true,
      align: 'end',
      accessor: (row) => row.mrr,
      cell: (row) => `$${row.mrr.toLocaleString()}`,
    },
  ];

  return (
    <div className="dash">
      {/* Sidebar */}
      <aside className="dash__sidebar">
        <div className="dash__brand">
          <span className="dash__logo">
            <ZapIcon size={16} />
          </span>
          <span className="dash__brand-name">Northwind</span>
        </div>

        <SidebarNav
          activeId={active}
          aria-label="Dashboard navigation"
          groups={[
            {
              items: [
                { id: 'overview', label: 'Overview', icon: <HomeIcon size={13} />, onClick: () => setActive('overview') },
                { id: 'analytics', label: 'Analytics', icon: <BarChartIcon size={13} />, onClick: () => setActive('analytics') },
                { id: 'customers', label: 'Customers', icon: <UsersIcon size={13} />, badge: <Badge tone="primary" pill>1.2k</Badge>, onClick: () => setActive('customers') },
                { id: 'projects', label: 'Projects', icon: <LayoutIcon size={13} />, onClick: () => setActive('projects') },
              ],
            },
            {
              label: 'Account',
              items: [
                { id: 'billing', label: 'Billing', icon: <CreditCardIcon size={13} />, onClick: () => setActive('billing') },
                { id: 'settings', label: 'Settings', icon: <SettingsIcon size={13} />, onClick: () => setActive('settings') },
              ],
            },
          ]}
        />

        <div className="dash__sidebar-foot">
          <Card padded>
            <div className="stack" style={{ gap: '0.5rem' }}>
              <Badge tone="warning" dot>
                Trial · 7 days
              </Badge>
              <p className="dash__upsell">
                You are on the Growth trial. Add a payment method to keep your
                projects online.
              </p>
              <Button size="sm" fullWidth onClick={() => toast({ title: 'Upgrade flow opened', tone: 'info' })}>
                Upgrade
              </Button>
            </div>
          </Card>
        </div>
      </aside>

      {/* Main */}
      <div className="dash__main">
        <header className="dash__topbar">
          <Breadcrumbs items={[{ label: 'Northwind' }, { label: active.charAt(0).toUpperCase() + active.slice(1) }]} />
          <div className="dash__topbar-actions">
            <div className="dash__search">
              <Input placeholder="Search…" leftAddon={<SearchIcon />} />
            </div>
            <Tooltip content="Notifications">
              <IconButton aria-label="Notifications" variant="ghost" size="sm">
                <BellIcon />
              </IconButton>
            </Tooltip>
            <DropdownMenu
              align="end"
              items={[
                { kind: 'label', label: 'Signed in as' },
                { kind: 'item', label: 'Ada Lovelace', disabled: true, onSelect: () => {} },
                { kind: 'separator' },
                { kind: 'item', label: 'Profile settings', onSelect: () => toast({ title: 'Profile settings' }) },
                { kind: 'item', label: 'Billing', onSelect: () => toast({ title: 'Billing' }) },
                { kind: 'separator' },
                { kind: 'item', label: 'Sign out', tone: 'danger', onSelect: () => toast({ title: 'Signed out', tone: 'warning' }) },
              ]}
              trigger={({ ref, ...props }) => (
                <button type="button" className="dash__user" ref={ref as React.Ref<HTMLButtonElement>} {...props}>
                  <Avatar name="Ada Lovelace" size="sm" status="online" />
                  <span className="dash__user-name">Ada</span>
                  <ChevronDownIcon size={14} />
                </button>
              )}
            />
          </div>
        </header>

        <div className="dash__content">
          <PageHeader
            eyebrow={active.charAt(0).toUpperCase() + active.slice(1)}
            title={active === 'overview' ? 'Good morning, Ada' : `${active.charAt(0).toUpperCase() + active.slice(1)} Overview`}
            description={
              active === 'overview'
                ? 'Here is how Northwind performed over the last thirty days.'
                : `Live metrics, audit events, and controls for ${active}.`
            }
            actions={
              <>
                <DropdownMenu
                  align="end"
                  items={[
                    { kind: 'item', label: 'Last 7 days', onSelect: () => setRange('7d') },
                    { kind: 'item', label: 'Last 30 days', onSelect: () => setRange('30d') },
                    { kind: 'item', label: 'Last quarter', onSelect: () => setRange('90d') },
                  ]}
                  trigger={({ ref, ...props }) => (
                    <Button variant="secondary" rightIcon={<ChevronDownIcon />} ref={ref as React.Ref<HTMLButtonElement>} {...props}>
                      {range === '7d' ? 'Last 7 days' : range === '30d' ? 'Last 30 days' : 'Last quarter'}
                    </Button>
                  )}
                />
                <Button
                  variant="secondary"
                  leftIcon={<DownloadIcon />}
                  onClick={() => toast({ title: 'Export queued', description: 'You will get an email when it is ready.', tone: 'success' })}
                >
                  Export
                </Button>
                <Button leftIcon={<PlusIcon />} onClick={() => toast({ title: 'New project created', tone: 'success' })}>
                  New project
                </Button>
              </>
            }
          />

          {/* Metrics */}
          <div className="dash__metrics">
            {METRICS.map((metric) => (
              <Card key={metric.id} padded interactive>
                <div className="dash__metric">
                  <Stat
                    label={metric.label}
                    value={metric.value}
                    delta={metric.delta}
                    size="sm"
                  />
                  <div className="dash__metric-spark">
                    <Sparkline
                      data={metric.series}
                      tone={
                        metric.id === 'churn'
                          ? 'var(--pui-danger)'
                          : metric.id === 'conversion'
                            ? 'var(--pui-success)'
                            : 'var(--pui-primary)'
                      }
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Chart + activity */}
          <div className="dash__split">
            <Card>
              <CardHeader
                title="Recurring revenue"
                description="Monthly recurring revenue, last 12 months."
                action={<Badge tone="success" dot>On track</Badge>}
              />
              <CardBody>
                <AreaChart />
              </CardBody>
            </Card>

            <Card>
              <CardHeader title="Recent activity" description="Live from your workspace." />
              <CardBody>
                <div className="dash__activity">
                  {ACTIVITY.map((entry, index) => (
                    <div key={index} className="dash__activity-row">
                      <Avatar name={entry.who} size="sm" />
                      <div className="dash__activity-text">
                        <div>
                          <strong>{entry.who}</strong> {entry.what}
                        </div>
                        <span className="cell-sub">{entry.when}</span>
                      </div>
                      <Badge tone={entry.tone} dot>
                        {entry.tone}
                      </Badge>
                    </div>
                  ))}
                </div>
                <Separator style={{ marginBlock: '1rem' }} />
                <div className="row-between">
                  <AvatarGroup
                    size="sm"
                    max={4}
                    people={[
                      { name: 'Grace Hopper' },
                      { name: 'Alan Turing' },
                      { name: 'Katherine Johnson' },
                      { name: 'Linus Torvalds' },
                      { name: 'Margaret Hamilton' },
                    ]}
                  />
                  <Button variant="link" size="sm" rightIcon={<ArrowRightIcon />}>
                    View all
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Table */}
          <Card>
            <CardHeader
              title="Top customers"
              description="Ranked by monthly recurring revenue."
              action={
                <DropdownMenu
                  align="end"
                  items={[
                    { kind: 'item', label: 'Export CSV', icon: <DownloadIcon />, onSelect: () => toast({ title: 'Export started' }) },
                    { kind: 'item', label: 'Manage columns', onSelect: () => toast({ title: 'Column manager' }) },
                  ]}
                  trigger={({ ref, ...props }) => (
                    <IconButton aria-label="Table actions" variant="ghost" size="sm" ref={ref as React.Ref<HTMLButtonElement>} {...props}>
                      <BarChartIcon />
                    </IconButton>
                  )}
                />
              }
            />
            <CardBody style={{ padding: 0 }}>
              <DataTable
                columns={columns}
                data={CUSTOMERS}
                rowKey={(row) => row.id}
                sort={{ column: 'mrr', direction: 'desc' }}
                onRowClick={(row) => toast({ title: `Opened ${row.name}` })}
                className="dash__table"
              />
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ page */

export function DashboardPage() {
  return (
    <DocPage
      eyebrow="Examples"
      title="Dashboard screen"
      lede="A complete analytics screen assembled entirely from library components. Every element below is live — switch themes, change density in the header, and the whole screen reflows."
    >
      <Section title="The screen">
        <Showcase bleed defaultOpen={false}>
          <ToastProvider placement="bottom-right">
            <DashboardScreen />
          </ToastProvider>
        </Showcase>
      </Section>

      <Section title="What to reuse">
        <div className="compare-grid">
          <div className="compare">
            <Badge tone="primary">Metric cards</Badge>
            <p className="prose">
              <code>Stat</code> plus an inline SVG sparkline inside an interactive{' '}
              <code>Card</code>. The sparkline is hand-written SVG — no charting
              dependency.
            </p>
          </div>
          <div className="compare">
            <Badge tone="primary">Activity feed</Badge>
            <p className="prose">
              <code>Avatar</code>, <code>Badge</code> and <code>Separator</code> in a
              flex column. No dedicated feed component needed.
            </p>
          </div>
          <div className="compare">
            <Badge tone="primary">Revenue chart</Badge>
            <p className="prose">
              A ~90-line SVG area chart reading colours straight from the token
              layer, so it re-themes with everything else.
            </p>
          </div>
        </div>
      </Section>
    </DocPage>
  );
}
