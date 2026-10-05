import { useState } from 'react';
import { DatePicker, Card } from '../../../src/index';
import { Callout, PropsTable, Showcase } from '../../components/Showcase';
import { DocPage, Section } from '../../components/DocPage';

const DATEPICKER_DEMO = `const [date, setDate] = useState<Date | null>(new Date());

<DatePicker
  value={date}
  onChange={setDate}
  placeholder="Select a launch date"
  min={new Date()}
/>`;

export function DatePickerPage() {
  const [date, setDate] = useState<Date | null>(new Date());

  return (
    <DocPage
      eyebrow="Components"
      title="DatePicker"
      lede="An input field with an anchored calendar dropdown for selecting and formatting single calendar dates."
      importStatement="import { DatePicker } from 'hesh';"
    >
      <Section
        title="Interactive Date Picker"
        description="Click the input or press down arrow to open the calendar dropdown. Supports date bounds and direct manual selection."
      >
        <Showcase code={DATEPICKER_DEMO} defaultOpen width="md">
          <div style={{ maxWidth: '20rem', margin: '0 auto' }}>
            <DatePicker
              value={date}
              onChange={setDate}
              placeholder="Pick a launch date"
              min={new Date()}
            />
          </div>
        </Showcase>
      </Section>

      <Section title="Accessibility">
        <Callout tone="info" title="Accessible Date Picker Pattern">
          Focus is managed smoothly between the input trigger and the popup calendar grid. Escape closes the popup and restores focus to the input.
        </Callout>
      </Section>

      <Section title="API Reference">
        <PropsTable
          rows={[
            { name: 'value', type: 'Date | null', description: 'Currently selected Date.' },
            { name: 'onChange', type: '(date: Date) => void', description: 'Callback fired when a date is selected.' },
            { name: 'placeholder', type: 'string', default: "'Pick a date'", description: 'Input placeholder text.' },
            { name: 'min', type: 'Date', description: 'Earliest selectable date.' },
            { name: 'max', type: 'Date', description: 'Latest selectable date.' },
            { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the input and dropdown trigger.' },
          ]}
        />
      </Section>
    </DocPage>
  );
}
