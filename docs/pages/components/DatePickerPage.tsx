import { useState } from 'react';
import { DatePicker } from '../../../src/index';
import { Callout, PropsTable, Showcase } from '../../components/Showcase';
import { DocPage, Section } from '../../components/DocPage';

const DEMO_BASIC = `const [date, setDate] = useState<Date | null>(new Date());

<DatePicker
  label="Launch Date"
  value={date}
  onChange={setDate}
  placeholder="Select a date"
/>`;

const DEMO_PRESETS = `// Quick-select buttons for common date offsets
<DatePicker
  label="Due Date"
  value={date}
  onChange={setDate}
  presets={[
    { label: 'Today',     getValue: () => new Date() },
    { label: 'Tomorrow',  getValue: () => addDays(new Date(), 1) },
    { label: 'Next week', getValue: () => addDays(new Date(), 7) },
    { label: 'Next month',getValue: () => addMonths(new Date(), 1) },
  ]}
/>`;

const DEMO_BOUNDS = `// Block past dates and cap at 90 days from now
const today = new Date();
const maxDate = addDays(today, 90);

<DatePicker
  label="Event Date"
  value={date}
  onChange={setDate}
  min={today}
  max={maxDate}
  clearable
/>`;

const DEMO_SIZES = `<DatePicker label="Small"  size="sm" />
<DatePicker label="Medium" size="md" />
<DatePicker label="Large"  size="lg" />`;

function addDays(d: Date, n: number) {
  const r = new Date(d); r.setDate(r.getDate() + n); return r;
}
function addMonths(d: Date, n: number) {
  const r = new Date(d); r.setMonth(r.getMonth() + n); return r;
}

export function DatePickerPage() {
  const [date, setDate] = useState<Date | null>(new Date());
  const [eventDate, setEventDate] = useState<Date | null>(null);
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [bookingRange, setBookingRange] = useState<[Date | null, Date | null]>([
    new Date(),
    addDays(new Date(), 7),
  ]);

  const today = new Date();
  const maxDate = addDays(today, 90);

  return (
    <DocPage
      eyebrow="Components"
      title="DatePicker"
      lede="Input field with an anchored calendar dropdown for selecting single dates — supports presets, min/max bounds, a clearable button, and three size scales."
      importStatement="import { DatePicker } from 'hesh';"
    >
      {/* ── Basic ── */}
      <Section
        title="Basic Date Picker"
        description="Click the input or press ↓ to open the calendar. Press Escape to close and restore focus to the trigger."
        code={DEMO_BASIC}
      >
        <Showcase>
          <div style={{ width: '100%', maxWidth: 320 }}>
            <DatePicker
              label="Launch Date"
              value={date}
              onChange={setDate}
              placeholder="Select a date"
            />
            {date && (
              <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--pui-fg-subtle)' }}>
                Selected: <strong>{date.toLocaleDateString()}</strong>
              </p>
            )}
          </div>
        </Showcase>
      </Section>

      {/* ── Presets ── */}
      <Section
        title="Quick-Select Presets"
        description="Provide a presets array to render shortcut buttons (Today, Tomorrow, Next week, Next month) alongside the calendar grid."
        code={DEMO_PRESETS}
      >
        <Showcase>
          <div style={{ width: '100%', maxWidth: 320 }}>
            <DatePicker
              label="Due Date"
              value={dueDate}
              onChange={setDueDate}
              placeholder="Select or pick preset…"
              clearable
              presets={[
                { label: 'Today',      getValue: () => new Date() },
                { label: 'Tomorrow',   getValue: () => addDays(new Date(), 1) },
                { label: 'Next week',  getValue: () => addDays(new Date(), 7) },
                { label: 'Next month', getValue: () => addMonths(new Date(), 1) },
              ]}
            />
          </div>
        </Showcase>
      </Section>

      {/* ── Range Picker ── */}
      <Section
        title="Date Range Picker & Range Presets"
        description="Set mode='range' to select a start and end date interval with range presets (Next 7 Days, Next 30 Days) and formatted range display."
        code={`const [range, setRange] = useState<[Date | null, Date | null]>([new Date(), addDays(new Date(), 7)]);

<DatePicker
  label="Booking Window"
  mode="range"
  rangeValue={range}
  onRangeChange={setRange}
  presets={[
    { label: 'Today', range: [new Date(), new Date()] },
    { label: 'Next 7 Days', range: [new Date(), addDays(new Date(), 7)] },
    { label: 'Next 30 Days', range: [new Date(), addDays(new Date(), 30)] },
  ]}
  clearable
/>`}
      >
        <Showcase>
          <div style={{ width: '100%', maxWidth: 360 }}>
            <DatePicker
              label="Booking Window"
              mode="range"
              rangeValue={bookingRange}
              onRangeChange={setBookingRange}
              presets={[
                { label: 'Today', range: [new Date(), new Date()] },
                { label: 'Next 7 Days', range: [new Date(), addDays(new Date(), 7)] },
                { label: 'Next 30 Days', range: [new Date(), addDays(new Date(), 30)] },
              ]}
              clearable
            />
          </div>
        </Showcase>
      </Section>

      {/* ── Min/Max + Clearable ── */}
      <Section
        title="Date Bounds & Clearable"
        description="Use min and max to constrain the selectable range. clearable adds an × button to reset the value to null."
        code={DEMO_BOUNDS}
      >
        <Showcase>
          <div style={{ width: '100%', maxWidth: 320 }}>
            <DatePicker
              label="Event Date"
              hint="Must be within the next 90 days."
              value={eventDate}
              onChange={setEventDate}
              placeholder="Within next 90 days"
              min={today}
              max={maxDate}
              clearable
            />
          </div>
        </Showcase>
      </Section>

      {/* ── Sizes ── */}
      <Section
        title="Size Variants"
        description="Three size scales — sm, md (default), lg — scale the input height and font."
        code={DEMO_SIZES}
      >
        <Showcase>
          <div style={{ width: '100%', maxWidth: 320, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <DatePicker label="Small"  size="sm" placeholder="sm date picker" />
            <DatePicker label="Medium" size="md" placeholder="md (default)" />
            <DatePicker label="Large"  size="lg" placeholder="lg date picker" />
          </div>
        </Showcase>
      </Section>

      {/* ── Disabled ── */}
      <Section
        title="Disabled"
        description="The disabled prop locks the input and hides the calendar trigger entirely."
        code={`<DatePicker label="Locked Date" value={new Date()} disabled />`}
      >
        <Showcase>
          <div style={{ width: '100%', maxWidth: 320 }}>
            <DatePicker label="Locked Date" value={new Date()} disabled />
          </div>
        </Showcase>
      </Section>

      <Callout type="tip" title="No external date libraries">
        DatePicker is built without moment.js or date-fns. Dates are native{' '}
        <code>Date</code> objects, so there is no extra bundle weight.
      </Callout>

      <Section title="API Reference">
        <PropsTable
          rows={[
            { name: 'mode',          type: "'single' | 'range'",                   default: "'single'", description: 'Selection mode for single date or continuous date range.' },
            { name: 'value',         type: 'Date | null',                          description: 'Controlled selected date (single mode).' },
            { name: 'onChange',      type: '(date: Date | null) => void',          description: 'Callback fired when a date is selected or cleared (single mode).' },
            { name: 'rangeValue',    type: '[Date | null, Date | null]',           description: 'Controlled date range tuple [start, end] (range mode).' },
            { name: 'onRangeChange', type: '(range: [Date | null, Date | null]) => void', description: 'Callback fired when date range changes.' },
            { name: 'label',         type: 'ReactNode',                            description: 'Visible label above the input.' },
            { name: 'hint',          type: 'ReactNode',                            description: 'Helper text below the field.' },
            { name: 'error',         type: 'ReactNode',                            description: 'Validation error message.' },
            { name: 'placeholder',   type: 'string',                               default: "'Select a date'", description: 'Input placeholder.' },
            { name: 'min',           type: 'Date',                                 description: 'Earliest selectable date (past dates disabled).' },
            { name: 'max',           type: 'Date',                                 description: 'Latest selectable date (future dates disabled).' },
            { name: 'clearable',     type: 'boolean',                              default: 'false',    description: 'Shows an × button to reset the value.' },
            { name: 'size',          type: "'sm' | 'md' | 'lg'",                   default: "'md'",     description: 'Input height and font scale.' },
            { name: 'presets',       type: 'DatePickerPreset[]',                   description: 'Array of { label, date?, range?, getValue? } quick-select shortcuts.' },
            { name: 'disabled',      type: 'boolean',                              default: 'false',    description: 'Disables the input and calendar popup.' },
          ]}
        />
      </Section>
    </DocPage>
  );
}



