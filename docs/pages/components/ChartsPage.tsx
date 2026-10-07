import { useState } from 'react';
import {
  AreaChart,
  BarChart,
  DonutChart,
  ChartLegend,
  Sparkline,
  Card,
  CardBody,
  Badge,
  SegmentedControl,
} from '../../../src/index';
import { Callout, PropsTable, Showcase } from '../../components/Showcase';
import { DocPage, Section } from '../../components/DocPage';
import { ChartsWorkbench } from '../../components/PropsWorkbench';

const REVENUE_12M = [
  { label: 'Jan', value: 28 },
  { label: 'Feb', value: 34 },
  { label: 'Mar', value: 31 },
  { label: 'Apr', value: 42 },
  { label: 'May', value: 48 },
  { label: 'Jun', value: 45 },
  { label: 'Jul', value: 58 },
  { label: 'Aug', value: 68 },
  { label: 'Sep', value: 65 },
  { label: 'Oct', value: 84 },
  { label: 'Nov', value: 96 },
  { label: 'Dec', value: 112 },
];

const API_VOLUME = [
  { label: 'Mon', value: 24.2 },
  { label: 'Tue', value: 38.6 },
  { label: 'Wed', value: 42.1 },
  { label: 'Thu', value: 48.5 },
  { label: 'Fri', value: 45.8 },
  { label: 'Sat', value: 18.2 },
  { label: 'Sun', value: 14.5 },
];

const TRAFFIC_DISTRIBUTION = [
  { label: 'North America', value: 4210, color: '#2563eb' },
  { label: 'Europe (EU)', value: 3180, color: '#059669' },
  { label: 'Asia-Pacific', value: 2420, color: '#7c3aed' },
  { label: 'Latin America', value: 1140, color: '#f43f5e' },
  { label: 'Middle East', value: 680, color: '#d97706' },
];

const AREA_DEMO = `<AreaChart
  data={revenue}
  height={300}
  smooth
  color="var(--pui-chart-1)"
  format={(v) => \`$\${v}k\`}
/>`;

const BAR_DEMO = `<BarChart
  data={apiVolume}
  height={280}
  showTracks
  color="var(--pui-chart-2)"
  format={(v) => \`\${v}M reqs\`}
/>`;

const DONUT_DEMO = `<DonutChart
  data={traffic}
  size={220}
  thickness={26}
  centerValue="11.6k"
  centerLabel="Total Edge Nodes"
  format={(v) => v.toLocaleString()}
/>`;

export function ChartsPage() {
  const [timeframe, setTimeframe] = useState('12m');

  return (
    <DocPage
      eyebrow="Components"
      title="Charts"
      lede="Ultra-lightweight, zero-dependency SVG visualization primitives (Area, Bar, Donut, and Sparkline) designed for modern high-density SaaS dashboards and real-time operational telemetry."
      importStatement="import { AreaChart, BarChart, DonutChart, Sparkline } from 'hesh';"
    >
      <Section
        title="Interactive Props Workbench"
        description="Switch between smooth Bézier Area charts, background-track Bar charts, and Donut telemetry with live theme colors and in-browser code compiler."
      >
        <ChartsWorkbench />
      </Section>

      <Section
        title="1. Financial & Volume Area Chart"
        description="Smooth cubic Bézier spline interpolation with multi-stop gradient area fill and interactive hover coordinates."
      >
        <Showcase code={AREA_DEMO} defaultOpen width="full">
          <Card style={{ width: '100%', overflow: 'hidden' }}>
            <CardBody style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: 650, color: 'var(--pui-fg-muted)' }}>
                      Recurring Revenue Velocity
                    </span>
                    <Badge tone="success" pill>+28.4% YoY</Badge>
                  </div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--pui-fg)' }}>
                    $112,400 <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--pui-fg-subtle)' }}>ARR</span>
                  </div>
                </div>

                <SegmentedControl
                  size="sm"
                  value={timeframe}
                  onChange={setTimeframe}
                  options={[
                    { value: '30d', label: '30 Days' },
                    { value: '12m', label: '12 Months' },
                    { value: 'all', label: 'All Time' },
                  ]}
                />
              </div>

              <div style={{ width: '100%' }}>
                <AreaChart
                  data={REVENUE_12M}
                  height={300}
                  smooth
                  color="var(--pui-chart-1)"
                  format={(v) => `$${v}k`}
                />
              </div>
            </CardBody>
          </Card>
        </Showcase>
      </Section>

      <Section
        title="2. Modern Bar Chart with Track Pillars"
        description="Features translucent background pillar tracks, gradient column fills, rounded caps, and interactive hover focus."
      >
        <Showcase code={BAR_DEMO} defaultOpen width="full">
          <Card style={{ width: '100%' }}>
            <CardBody style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: 650, color: 'var(--pui-fg-muted)' }}>
                      Weekly API Gateway Throughput
                    </span>
                    <Badge tone="primary" pill>48.5M Peak</Badge>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--pui-fg-subtle)' }}>
                    High-resolution request distribution processed across edge proxies.
                  </p>
                </div>
              </div>

              <div style={{ width: '100%' }}>
                <BarChart
                  data={API_VOLUME}
                  height={280}
                  showTracks
                  color="var(--pui-chart-2)"
                  format={(v) => `${v}M`}
                />
              </div>
            </CardBody>
          </Card>
        </Showcase>
      </Section>

      <Section
        title="3. Donut Chart & Regional Breakdown"
        description="Generous 220px telemetry ring with segment spacing, active hover segment scaling, and centered KPI summaries."
      >
        <Showcase code={DONUT_DEMO} defaultOpen width="full">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', width: '100%' }}>
            <Card>
              <CardBody style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: '100%', marginBottom: '1rem' }}>
                  <div style={{ fontWeight: 650, fontSize: '0.9375rem' }}>Global Edge Distribution</div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--pui-fg-muted)' }}>Regional traffic breakdown</div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', padding: '1rem 0' }}>
                  <DonutChart
                    data={TRAFFIC_DISTRIBUTION}
                    size={220}
                    thickness={26}
                    centerValue="11.6k"
                    centerLabel="Edge Clusters"
                    format={(v) => `${v.toLocaleString()}`}
                  />
                </div>

                <div style={{ width: '100%', paddingTop: '0.5rem', borderTop: '1px solid var(--pui-border-subtle)' }}>
                  <ChartLegend items={TRAFFIC_DISTRIBUTION} />
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontWeight: 650, fontSize: '0.9375rem', marginBottom: '0.25rem' }}>Real-time Micro Sparklines</div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--pui-fg-muted)', marginBottom: '1.5rem' }}>
                    Zero-overhead inline trendline monitors for dashboard KPI tables.
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', background: 'var(--pui-surface-subtle)', borderRadius: 'var(--pui-radius-lg)' }}>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--pui-fg-muted)' }}>p99 API Latency</div>
                        <strong style={{ fontSize: '1rem' }}>11.8 ms</strong>
                      </div>
                      <Sparkline data={[18, 16, 14, 15, 12, 13, 11.8]} width={110} height={32} color="var(--pui-chart-3)" />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', background: 'var(--pui-surface-subtle)', borderRadius: 'var(--pui-radius-lg)' }}>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--pui-fg-muted)' }}>Memory Consumption</div>
                        <strong style={{ fontSize: '1rem' }}>64.2%</strong>
                      </div>
                      <Sparkline data={[42, 48, 52, 59, 61, 63, 64.2]} width={110} height={32} color="var(--pui-chart-1)" />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', background: 'var(--pui-surface-subtle)', borderRadius: 'var(--pui-radius-lg)' }}>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--pui-fg-muted)' }}>Failed Requests</div>
                        <strong style={{ fontSize: '1rem' }}>0.01%</strong>
                      </div>
                      <Sparkline data={[0.08, 0.06, 0.04, 0.03, 0.02, 0.01, 0.01]} width={110} height={32} color="var(--pui-chart-5)" filled={false} />
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </Showcase>
      </Section>

      <Section title="API Reference">
        <PropsTable
          rows={[
            { name: 'data', type: 'SeriesPoint[]', required: true, description: 'Array of { label: string, value: number } data points.' },
            { name: 'height', type: 'number', default: '260', description: 'Pixel height of the chart area.' },
            { name: 'smooth', type: 'boolean', default: 'true', description: 'Enable cubic Bézier spline smoothing on Area charts.' },
            { name: 'showTracks', type: 'boolean', default: 'true', description: 'Render translucent background pillar tracks behind bars.' },
            { name: 'showGrid', type: 'boolean', default: 'true', description: 'Display horizontal calibrated gridlines.' },
            { name: 'format', type: '(value: number) => string', description: 'Tooltip and axis scale value formatting function.' },
            { name: 'color', type: 'string', description: 'CSS color or theme token variable for fills and strokes.' },
          ]}
        />
      </Section>
    </DocPage>
  );
}
