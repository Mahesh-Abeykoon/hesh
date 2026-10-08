import { Stat, Card } from '../../../src/index';
import { Callout, PropsTable, Showcase } from '../../components/Showcase';
import { DocPage, Section } from '../../components/DocPage';

const STAT_DEMO = `<div className="grid-3">
  <Card padded>
    <Stat label="Monthly recurring revenue" value="$48,290" delta={12.4} />
  </Card>
  <Card padded>
    <Stat label="Churn rate" value="2.1%" delta={-0.4} />
  </Card>
  <Card padded>
    <Stat label="Active nodes" value="1,204" delta={0} deltaLabel="No change" />
  </Card>
</div>`;

export function StatPage() {
  return (
    <DocPage
      eyebrow="Components"
      title="Stat"
      lede="Displays prominent numerical KPIs, values, and percentage trend deltas with tabular figures."
      importStatement="import { Stat } from 'hesh-ui';"
    >
      <Section
        title="Key Metric Displays"
        description="Highlights big numbers alongside positive or negative trend indicators."
      >
        <Showcase code={STAT_DEMO} defaultOpen width="md">
          <div className="grid-3">
            <Card padded>
              <Stat label="Monthly recurring revenue" value="$48,290" delta={12.4} />
            </Card>
            <Card padded>
              <Stat label="Churn rate" value="2.1%" delta={-0.4} />
            </Card>
            <Card padded>
              <Stat label="Active nodes" value="1,204" delta={0} deltaLabel="No change" />
            </Card>
          </div>
        </Showcase>
      </Section>

      <Section title="Design Notes">
        <Callout tone="info" title="Tabular Numerals">
          Uses <code>font-variant-numeric: tabular-nums</code> so columns of fluctuating metrics do not jump horizontally as digits update.
        </Callout>
      </Section>

      <Section title="API Reference">
        <PropsTable
          rows={[
            { name: 'label', type: 'ReactNode', required: true, description: 'Descriptive title of the metric.' },
            { name: 'value', type: 'ReactNode', required: true, description: 'Primary numeric value.' },
            { name: 'delta', type: 'number', description: 'Percentage change number (positive or negative).' },
            { name: 'deltaLabel', type: 'string', description: 'Optional text replacement for the delta badge.' },
            { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Typography scale.' },
          ]}
        />
      </Section>
    </DocPage>
  );
}
