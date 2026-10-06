import { useState } from 'react';
import { Calendar, Card } from '../../../src/index';
import { Callout, PropsTable, Showcase } from '../../components/Showcase';
import { DocPage, Section } from '../../components/DocPage';

const CALENDAR_DEMO = `const [date, setDate] = useState<Date | null>(new Date());

<Calendar value={date} onChange={setDate} />`;

const RANGE_DEMO = `const [range, setRange] = useState<[Date | null, Date | null]>([
  new Date(),
  new Date(Date.now() + 6 * 86400000),
]);

<Calendar
  mode="range"
  rangeValue={range}
  onRangeChange={setRange}
/>`;

const BOUNDS_DEMO = `// Allow only current month
const start = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
const end   = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

<Calendar value={date} onChange={setDate} min={start} max={end} />`;

function getMonthStart() {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1);
}
function getMonthEnd() {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}

export function CalendarPage() {
  const [date, setDate] = useState<Date | null>(new Date());
  const [range, setRange] = useState<[Date | null, Date | null]>([
    new Date(),
    new Date(Date.now() + 6 * 86400000),
  ]);
  const [bounded, setBounded] = useState<Date | null>(new Date());

  const formatDate = (d: Date | null) =>
    d ? d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

  return (
    <DocPage
      eyebrow="Components"
      title="Calendar"
      lede="Keyboard-accessible month grid supporting single-date and date-range selection with hover preview, adhering to the WAI-ARIA datepicker pattern without external dependencies."
      importStatement="import { Calendar } from 'hesh';"
    >
      {/* ── Basic ── */}
      <Section
        title="Interactive Month Grid"
        description="Click any day cell to select it. Arrow keys navigate day by day, PageUp/Down switches months, and Shift+Page flips the year."
        code={CALENDAR_DEMO}
      >
        <Showcase>
          <div style={{ maxWidth: '20rem', margin: '0 auto' }}>
            <Card padded>
              <Calendar value={date} onChange={setDate} />
            </Card>
            {date && (
              <p style={{ textAlign: 'center', marginTop: '0.75rem', fontSize: '0.875rem', color: 'var(--pui-fg-subtle)' }}>
                Selected: <strong>{date.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</strong>
              </p>
            )}
          </div>
        </Showcase>
      </Section>

      {/* ── Date Range Selection ── */}
      <Section
        title="Date Range Selection"
        description="Set mode='range' to enable picking start and end dates with interactive hover range highlighting."
        code={RANGE_DEMO}
      >
        <Showcase>
          <div style={{ maxWidth: '20rem', margin: '0 auto' }}>
            <Card padded>
              <Calendar
                mode="range"
                rangeValue={range}
                onRangeChange={setRange}
              />
            </Card>
            <div style={{ textAlign: 'center', marginTop: '0.75rem', fontSize: '0.875rem', color: 'var(--pui-fg-subtle)' }}>
              <span>Range: </span>
              <strong>{formatDate(range[0])}</strong>
              <span> → </span>
              <strong>{formatDate(range[1])}</strong>
            </div>
          </div>
        </Showcase>
      </Section>

      {/* ── Min/Max Bounds ── */}
      <Section
        title="Date Bounds"
        description="Use min and max to restrict the selectable range. Days outside the window are rendered disabled and non-interactive."
        code={BOUNDS_DEMO}
      >
        <Showcase>
          <div style={{ maxWidth: '20rem', margin: '0 auto' }}>
            <Card padded>
              <Calendar
                value={bounded}
                onChange={setBounded}
                min={getMonthStart()}
                max={getMonthEnd()}
              />
            </Card>
            <p style={{ textAlign: 'center', marginTop: '0.5rem', fontSize: '0.8125rem', color: 'var(--pui-fg-subtle)' }}>
              Only dates in the current month are selectable
            </p>
          </div>
        </Showcase>
      </Section>

      {/* ── Keyboard Nav ── */}
      <Section title="Keyboard Navigation">
        <Showcase>
          <div className="key-grid">
            {[
              { keys: ['←', '→'],         text: 'Previous / next day' },
              { keys: ['↑', '↓'],         text: 'Previous / next week' },
              { keys: ['Home', 'End'],    text: 'First / last day of the week' },
              { keys: ['PgUp', 'PgDn'],  text: 'Previous / next month' },
              { keys: ['Shift', 'PgUp'], text: 'Previous year' },
              { keys: ['Shift', 'PgDn'], text: 'Next year' },
              { keys: ['Enter', 'Space'], text: 'Select focused date' },
              { keys: ['Esc'],            text: 'Close (when in DatePicker popup)' },
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
        </Showcase>
      </Section>

      <Callout type="tip" title="Embedded vs popup">
        Use <strong>Calendar</strong> when the grid should always be visible (booking interfaces,
        dashboards). For triggered inputs, use <strong>DatePicker</strong> which wraps Calendar in
        a popover anchored to an input field.
      </Callout>

      <Section title="API Reference">
        <PropsTable
          rows={[
            { name: 'mode',          type: "'single' | 'range'",       default: "'single'", description: 'Selection mode: single date or continuous date range.' },
            { name: 'value',         type: 'Date | null',              description: 'Controlled single selected date.' },
            { name: 'defaultValue',  type: 'Date | null',              description: 'Default uncontrolled single date.' },
            { name: 'onChange',      type: '(date: Date) => void',     description: 'Fires when a single date cell is clicked.' },
            { name: 'rangeValue',    type: '[Date | null, Date | null]', description: 'Controlled [start, end] date range.' },
            { name: 'onRangeChange', type: '(range: [Date | null, Date | null]) => void', description: 'Fires when start or end range changes.' },
            { name: 'min',           type: 'Date',                     description: 'Earliest selectable date. Earlier dates are rendered disabled.' },
            { name: 'max',           type: 'Date',                     description: 'Latest selectable date. Later dates are rendered disabled.' },
          ]}
        />
      </Section>
    </DocPage>
  );
}
