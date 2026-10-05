import { AreaChart, BarChart, DonutChart, ChartLegend, Sparkline, Card, CardBody } from '../../../src/index';
import { Callout, PropsTable, Showcase } from '../../components/Showcase';
import { DocPage, Section } from '../../components/DocPage';

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

const CHARTS_DEMO = `<AreaChart data={revenue} height={220} format={(v) => \`$\${v}k\`} />
<BarChart data={signups} color="var(--pui-chart-2)" />
<DonutChart data={traffic} centerValue="10.6k" centerLabel="sessions" />
<Sparkline data={[12, 18, 14, 22, 28, 24, 31]} />`;

export function ChartsPage() {
  return (
    <DocPage
      eyebrow="Components"
      title="Charts"
      lede="Lightweight, reactive SVG charting primitives (Area, Bar, Donut, and Sparkline) reading colors from the active theme tokens."
      importStatement="import { AreaChart, BarChart, DonutChart, Sparkline } from 'hesh';"
    >
      <Section
        title="Area Chart"
        description="Ideal for continuous volume and financial trends over time."
      >
        <Showcase code={`<AreaChart data={REVENUE} height={220} format={(v) => \`$\${v}k\`} />`} defaultOpen width="md">
          <Card>
            <CardBody>
              <div style={{ fontWeight: 600, marginBottom: '0.75rem' }}>Recurring Revenue Trend</div>
              <AreaChart data={REVENUE} height={220} format={(v) => `$${v}k`} />
            </CardBody>
          </Card>
        </Showcase>
      </Section>

      <Section
        title="Bar & Donut Charts"
        description="Discrete distribution and breakdown charts with interactive tooltips and legends."
      >
        <Showcase code={`<BarChart data={SIGNUPS} height={190} color="var(--pui-chart-2)" />\n<DonutChart data={TRAFFIC} size={168} centerValue="10.6k" centerLabel="sessions" />`} width="md">
          <div className="grid-2">
            <Card>
              <CardBody>
                <div style={{ fontWeight: 600, marginBottom: '0.75rem' }}>New Signups</div>
                <BarChart data={SIGNUPS} height={190} color="var(--pui-chart-2)" />
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <div style={{ fontWeight: 600, marginBottom: '0.75rem' }}>Traffic Sources</div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <DonutChart data={TRAFFIC} size={168} centerValue="10.6k" centerLabel="sessions" />
                </div>
                <ChartLegend items={TRAFFIC} />
              </CardBody>
            </Card>
          </div>
        </Showcase>
      </Section>

      <Section
        title="Sparklines"
        description="Compact inline trends designed to fit inside stat cards and table rows."
      >
        <Showcase code={`<Sparkline data={[12, 18, 14, 22, 28, 24, 31]} />`} width="md">
          <div className="row-wrap" style={{ gap: '1.5rem', alignItems: 'center' }}>
            <Sparkline data={[12, 18, 14, 22, 28, 24, 31]} />
            <Sparkline data={[30, 26, 28, 22, 18, 20, 14]} color="var(--pui-chart-6)" />
            <Sparkline data={[8, 12, 11, 16, 14, 19, 24]} color="var(--pui-chart-3)" filled={false} />
          </div>
        </Showcase>
      </Section>

      <Section title="API Reference">
        <PropsTable
          rows={[
            { name: 'data', type: 'SeriesPoint[]', required: true, description: 'Array of { label: string, value: number } data points.' },
            { name: 'height', type: 'number', default: '200', description: 'Pixel height of the chart.' },
            { name: 'format', type: '(value: number) => string', description: 'Tooltip and axis formatting function.' },
            { name: 'color', type: 'string', description: 'Custom CSS stroke or fill color token.' },
          ]}
        />
      </Section>
    </DocPage>
  );
}
