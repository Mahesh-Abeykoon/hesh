import { useState } from 'react';
import {
  Accordion,
  AreaChart,
  BarChart,
  Button,
  Calendar,
  Card,
  CardBody,
  ChartLegend,
  Command,
  DatePicker,
  DonutChart,
  Kbd,
  Popover,
  Slider,
  Sparkline,
  Switch,
  useToast,
} from '../../src/index';
import { BarChartIcon, HomeIcon, SettingsIcon, SparklesIcon, UsersIcon } from '../../src/index';
import { Callout, PropsTable, Showcase } from '../components/Showcase';
import { DocPage, Section } from '../components/DocPage';

/* ------------------------------------------------------------------ data */

const REVENUE = [
  { label: 'Jan', value: 28 }, { label: 'Feb', value: 31 }, { label: 'Mar', value: 29 },
  { label: 'Apr', value: 36 }, { label: 'May', value: 42 }, { label: 'Jun', value: 40 },
  { label: 'Jul', value: 48 }, { label: 'Aug', value: 54 }, { label: 'Sep', value: 51 },
  { label: 'Oct', value: 58 }, { label: 'Nov', value: 63 }, { label: 'Dec', value: 71 },
];

const SIGNUPS = REVENUE.map((d) => ({ label: d.label, value: Math.round(d.value * 21.4) }));

const TRAFFIC = [
  { label: 'Direct', value: 4210 },
  { label: 'Organic', value: 3180 },
  { label: 'Referral', value: 1640 },
  { label: 'Social', value: 980 },
  { label: 'Email', value: 640 },
];

const CODE = {
  command: `const [open, setOpen] = useState(false);
useCommandShortcut(() => setOpen((prev) => !prev));

<Command
  items={[
    { id: 'home', label: 'Go to Overview', group: 'Navigate', hint: '#/home',
      icon: <HomeIcon />, onSelect: () => navigate('home') },
    { id: 'settings', label: 'Open settings', group: 'Navigate',
      icon: <SettingsIcon />, onSelect: openSettings },
  ]}
  open={open}
  onOpenChange={setOpen}
/>`,
  popover: `<Popover
  open={open}
  onOpenChange={setOpen}
  title="Deployment target"
  description="Where should this build go?"
  trigger={({ ref, ...props }) => (
    <Button variant="secondary" ref={ref} {...props}>Choose…</Button>
  )}
>
  <RadioGroup defaultValue="prod">
    <Radio value="prod" label="Production" />
    <Radio value="staging" label="Staging" />
  </RadioGroup>
</Popover>`,
  accordion: `<Accordion
  multiple
  defaultOpen={['billing']}
  items={[
    { id: 'billing', title: 'Billing', content: <BillingForm /> },
    { id: 'security', title: 'Security', content: <SecurityForm /> },
    { id: 'api', title: 'API keys', content: <ApiKeys /> },
  ]}
/>`,
  slider: `<Slider
  label="Volume"
  value={volume}
  onValueChange={setVolume}
  min={0}
  max={100}
  step={1}
/>`,
  datepicker: `<DatePicker
  value={date}
  onChange={setDate}
  min={new Date()}
  placeholder="Pick a launch date"
/>`,
  charts: `<AreaChart data={revenue} height={220} format={(v) => \`$\${v}k\`} />
<BarChart data={signups} color="var(--pui-chart-2)" />
<DonutChart data={traffic} centerValue="10.6k" centerLabel="sessions" />
<Sparkline data={[12, 18, 14, 22, 28, 24, 31]} />`,
};

export function AdvancedPage() {
  const { toast } = useToast();
  const [commandOpen, setCommandOpen] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [volume, setVolume] = useState(64);
  const [date, setDate] = useState<Date | null>(new Date());
  const [accordionOpen, setAccordionOpen] = useState<string[]>(['billing']);

  const commandItems = [
    { id: 'home', label: 'Go to Overview', group: 'Navigate', hint: '#/home', icon: <HomeIcon />, onSelect: () => (window.location.hash = '/home') },
    { id: 'dash', label: 'Go to Dashboard', group: 'Navigate', hint: '#/dashboard', icon: <BarChartIcon />, onSelect: () => (window.location.hash = '/dashboard') },
    { id: 'team', label: 'Invite teammate', group: 'Actions', hint: '⌘I', icon: <UsersIcon />, onSelect: () => toast({ title: 'Invite flow', tone: 'info' }) },
    { id: 'theme', label: 'Toggle theme', group: 'Actions', icon: <SparklesIcon />, onSelect: () => toast({ title: 'Theme toggled', tone: 'success' }) },
    { id: 'danger', label: 'Delete workspace', group: 'Danger zone', icon: <SettingsIcon />, disabled: true, onSelect: () => {} },
  ];

  return (
    <DocPage
      eyebrow="Advanced"
      title="Command · Charts · Date picker"
      lede="The components that usually force you to add a dependency: a ⌘K palette, data visualisation, and a keyboard-driven date picker. All of them are here, reading from the same token layer."
    >
      <Section
        title="Command palette"
        description="A searchable action palette with grouped results, type-to-filter and full keyboard control. Register the shortcut with useCommandShortcut."
      >
        <Showcase code={CODE.command} defaultOpen>
          <div className="stack">
            <div className="row-wrap">
              <Button onClick={() => setCommandOpen(true)}>Open palette</Button>
              <span className="prose">
                Or press <Kbd>⌘</Kbd> <Kbd>K</Kbd> right now — one is mounted
                globally on this site.
              </span>
            </div>
          </div>
        </Showcase>
        <Command items={commandItems} open={commandOpen} onOpenChange={setCommandOpen} />
        <Callout tone="info" title="Keyboard">
          <Kbd>↑</Kbd> <Kbd>↓</Kbd> move · <Kbd>Home</Kbd>/<Kbd>End</Kbd> jump ·{' '}
          <Kbd>↵</Kbd> select · <Kbd>Esc</Kbd> dismiss. Disabled rows are skipped
          rather than removed, so their existence is still announced.
        </Callout>
      </Section>

      <Section title="Popover" description="An anchored panel for supplementary UI. Unlike a dialog it does not trap focus or lock scrolling — the user can ignore it and keep working.">
        <Showcase code={CODE.popover}>
          <Popover
            open={popoverOpen}
            onOpenChange={setPopoverOpen}
            title="Deployment target"
            description="Where should this build go?"
            trigger={({ ref, ...props }) => (
              <Button variant="secondary" ref={ref as React.Ref<HTMLButtonElement>} {...props}>
                Choose target…
              </Button>
            )}
          >
            <div className="stack">
              <Switch defaultChecked label="Run migrations" />
              <Switch label="Notify on failure" />
              <Button size="sm" fullWidth onClick={() => setPopoverOpen(false)}>
                Deploy to production
              </Button>
            </div>
          </Popover>
        </Showcase>
      </Section>

      <Section title="Accordion" description="Collapsible sections. Triggers carry aria-expanded; panels are labelled regions, so a screen reader announces open and closed state.">
        <Showcase code={CODE.accordion} width="md">
          <Accordion
            multiple
            open={accordionOpen}
            onOpenChange={setAccordionOpen}
            items={[
              { id: 'billing', title: 'Billing', content: 'Invoices are issued on the 1st of each month and charged to your default payment method.' },
              { id: 'security', title: 'Security', content: 'Two-factor authentication is enforced for all members with owner or admin roles.' },
              { id: 'api', title: 'API keys', content: 'Keys are shown once at creation. Rotate them from the workspace settings.' },
              { id: 'audit', title: 'Audit log (coming soon)', disabled: true, content: '' },
            ]}
          />
        </Showcase>
      </Section>

      <Section
        title="Slider"
        description="A native range input, restyled. The native element stays on top and transparent, so dragging, arrow keys, PageUp/Down, Home/End and touch all work without custom ARIA."
      >
        <Showcase code={CODE.slider} width="md">
          <div className="stack">
            <Slider label="Volume" value={volume} onValueChange={setVolume} />
            <div className="row-between">
              <span className="prose">Value: <strong>{volume}</strong></span>
              <span className="prose">Try arrow keys and PageUp / PageDown</span>
            </div>
            <Slider label="Disabled" defaultValue={30} disabled />
          </div>
        </Showcase>
      </Section>

      <Section title="Date picker" description="A calendar grid with the full WAI-ARIA date picker keyboard model — no popper library, no date library.">
        <Showcase code={CODE.datepicker} width="md">
          <div className="grid-2">
            <DatePicker value={date} onChange={setDate} placeholder="Pick a launch date" />
            <Card padded>
              <Calendar value={date} onChange={setDate} />
            </Card>
          </div>
        </Showcase>
        <div className="key-grid" style={{ marginTop: '1rem' }}>
          {[
            { keys: ['←', '→'], text: 'Previous / next day' },
            { keys: ['↑', '↓'], text: 'Previous / next week' },
            { keys: ['Home', 'End'], text: 'First / last day of the week' },
            { keys: ['PgUp', 'PgDn'], text: 'Previous / next month' },
            { keys: ['⇧', 'PgUp'], text: 'Previous / next year' },
          ].map((row) => (
            <div key={row.text} className="key-row">
              <span className="key-row__keys">
                {row.keys.map((key) => (
                  <kbd key={key} className="pui-kbd">{key}</kbd>
                ))}
              </span>
              <span>{row.text}</span>
            </div>
          ))}
        </div>
        <Callout tone="success" title="Dates stay plain">
          The API takes and returns native <code>Date</code> objects. Formatting is
          yours — pass a <code>format</code> function or use{' '}
          <code>Intl.DateTimeFormat</code> directly.
        </Callout>
      </Section>

      <Section
        title="Charts"
        description="Area, bar, donut and sparkline. They read colour from the token layer, so they re-theme with everything else and add no charting dependency."
      >
        <Showcase code={CODE.charts} defaultOpen>
          <div className="stack">
            <Card>
              <CardBody>
                <div className="section__title" style={{ fontSize: '0.9375rem', marginBottom: '0.75rem' }}>
                  Recurring revenue
                </div>
                <AreaChart data={REVENUE} height={220} format={(v) => `$${v}k`} />
              </CardBody>
            </Card>

            <div className="grid-2">
              <Card>
                <CardBody>
                  <div className="section__title" style={{ fontSize: '0.9375rem', marginBottom: '0.75rem' }}>
                    New signups
                  </div>
                  <BarChart data={SIGNUPS} height={190} color="var(--pui-chart-2)" />
                </CardBody>
              </Card>

              <Card>
                <CardBody>
                  <div className="section__title" style={{ fontSize: '0.9375rem', marginBottom: '1rem' }}>
                    Traffic sources
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <DonutChart data={TRAFFIC} size={168} centerValue="10.6k" centerLabel="sessions" />
                  </div>
                  <ChartLegend items={TRAFFIC} />
                </CardBody>
              </Card>
            </div>

            <Card padded>
              <div className="row-between">
                <span className="prose">Inline sparklines for metric cards</span>
                <div className="row-wrap">
                  <Sparkline data={[12, 18, 14, 22, 28, 24, 31]} />
                  <Sparkline data={[30, 26, 28, 22, 18, 20, 14]} color="var(--pui-chart-6)" />
                  <Sparkline data={[8, 12, 11, 16, 14, 19, 24]} color="var(--pui-chart-3)" filled={false} />
                </div>
              </div>
            </Card>
          </div>
        </Showcase>
        <Callout tone="info" title="Tooltips are an enhancement, not the API">
          Every chart carries <code>role="img"</code> and a generated{' '}
          <code>aria-label</code> summarising the range. Hover tooltips are for
          mouse users; the numbers are never only available on hover.
        </Callout>
      </Section>

      <Section title="API">
        <PropsTable
          rows={[
            { name: 'Command.items', type: 'CommandItem[]', required: true, description: '{ id, label, group?, hint?, icon?, keywords?, disabled?, onSelect? }.' },
            { name: 'useCommandShortcut', type: '(onToggle: () => void) => void', description: 'Registers the ⌘K / Ctrl+K listener.' },
            { name: 'Popover.trigger', type: '(props) => ReactNode', required: true, description: 'Render prop; spread props and forward the ref.' },
            { name: 'Accordion.multiple', type: 'boolean', default: 'false', description: 'Allow several panels open at once.' },
            { name: 'Slider.min / max / step', type: 'number', default: '0 / 100 / 1', description: 'Range and increment.' },
            { name: 'Calendar.min / max', type: 'Date', description: 'Bounds outside which days are disabled.' },
            { name: 'DatePicker.format', type: '(date: Date) => string', description: 'Formats the trigger label. Defaults to the locale short form.' },
            { name: 'AreaChart.data', type: '{ label, value }[]', required: true, description: 'Series points.' },
            { name: 'AreaChart.format', type: '(value: number) => string', description: 'Formats axis ticks and tooltips.' },
            { name: 'DonutChart.data', type: '{ label, value, color? }[]', required: true, description: 'Slices; colours fall back to the chart palette.' },
            { name: 'Sparkline.filled', type: 'boolean', default: 'true', description: 'Fill the area beneath the line.' },
          ]}
        />
      </Section>
    </DocPage>
  );
}
