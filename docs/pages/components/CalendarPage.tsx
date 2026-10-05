import { useState } from 'react';
import { Calendar, Card } from '../../../src/index';
import { Callout, PropsTable, Showcase } from '../../components/Showcase';
import { DocPage, Section } from '../../components/DocPage';

const CALENDAR_DEMO = `const [date, setDate] = useState<Date | null>(new Date());

<Calendar value={date} onChange={setDate} />`;

export function CalendarPage() {
  const [date, setDate] = useState<Date | null>(new Date());

  return (
    <DocPage
      eyebrow="Components"
      title="Calendar"
      lede="A keyboard-accessible month and date grid adhering strictly to the WAI-ARIA datepicker pattern without heavy external moment/dayjs dependencies."
      importStatement="import { Calendar } from 'hesh';"
    >
      <Section
        title="Interactive Month Grid"
        description="Select single dates with comprehensive keyboard shortcuts and localized month/day names."
      >
        <Showcase code={CALENDAR_DEMO} defaultOpen width="md">
          <div style={{ maxWidth: '20rem', margin: '0 auto' }}>
            <Card padded>
              <Calendar value={date} onChange={setDate} />
            </Card>
          </div>
        </Showcase>
      </Section>

      <Section title="Keyboard Navigation">
        <div className="key-grid">
          {[
            { keys: ['←', '→'], text: 'Previous / next day' },
            { keys: ['↑', '↓'], text: 'Previous / next week' },
            { keys: ['Home', 'End'], text: 'Start / end of the week' },
            { keys: ['PgUp', 'PgDn'], text: 'Previous / next month' },
            { keys: ['Shift', 'PgUp'], text: 'Previous year' },
            { keys: ['Shift', 'PgDn'], text: 'Next year' },
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
      </Section>

      <Section title="API Reference">
        <PropsTable
          rows={[
            { name: 'value', type: 'Date | null', description: 'Currently selected Date.' },
            { name: 'onChange', type: '(date: Date) => void', description: 'Callback fired on date selection.' },
            { name: 'min', type: 'Date', description: 'Earliest selectable date.' },
            { name: 'max', type: 'Date', description: 'Latest selectable date.' },
          ]}
        />
      </Section>
    </DocPage>
  );
}
