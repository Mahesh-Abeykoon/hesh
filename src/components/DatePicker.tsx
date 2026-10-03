import { useState } from 'react';
import { Popover } from './Popover';
import { Calendar, type CalendarProps } from './Calendar';
import { ChevronDownIcon } from './icons';

export interface DatePickerProps extends Omit<CalendarProps, 'className'> {
  placeholder?: string;
  className?: string;
  format?: (date: Date) => string;
}

const defaultFormat = (date: Date) =>
  date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });

/** Calendar inside a Popover, with a text trigger showing the selection. */
export function DatePicker({
  placeholder = 'Select a date',
  className,
  format = defaultFormat,
  ...calendarProps
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const selected = calendarProps.value ?? calendarProps.defaultValue ?? null;

  return (
    <div className={className}>
      <Popover
        open={open}
        onOpenChange={setOpen}
        align="start"
        trigger={(props) => (
          <button
            type="button"
            {...props}
            className="pui-control"
            style={{ textAlign: 'start', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
          >
            <span style={{ flex: 1, color: selected ? undefined : 'var(--pui-fg-subtle)' }}>
              {selected ? format(selected) : placeholder}
            </span>
            <ChevronDownIcon size="1rem" />
          </button>
        )}
      >
        <Calendar
          {...calendarProps}
          onChange={(date) => {
            calendarProps.onChange?.(date);
            setOpen(false);
          }}
        />
      </Popover>
    </div>
  );
}
