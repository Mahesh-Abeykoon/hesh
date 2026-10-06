import { useMemo, useRef, useState } from 'react';
import { cn } from '../utils/cn';
import { useControllableState } from '../hooks/useControllableState';
import { ChevronLeftIcon, ChevronRightIcon } from './icons';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const DOW = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

export type CalendarSelectionMode = 'single' | 'range';

export interface CalendarProps {
  mode?: CalendarSelectionMode;
  /** Single date selection (when mode='single'). */
  value?: Date | null;
  defaultValue?: Date | null;
  onChange?: (date: Date) => void;
  /** Range date selection (when mode='range'). */
  rangeValue?: [Date | null, Date | null];
  defaultRangeValue?: [Date | null, Date | null];
  onRangeChange?: (range: [Date | null, Date | null]) => void;
  /** Earliest selectable date. */
  min?: Date;
  max?: Date;
  className?: string;
}

const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());
const sameDay = (a: Date | null, b: Date | null) =>
  !!a && !!b && startOfDay(a).getTime() === startOfDay(b).getTime();

/**
 * Month grid with full keyboard support (WAI-ARIA Date Picker pattern):
 * arrows move by day, PageUp/PageDown by month, Home/End to week bounds,
 * Shift+PageUp/Down by year. Uses `role="grid"` with `aria-selected` cells.
 * Supports both single-date selection and date-range selection with hover preview.
 */
export function Calendar({
  mode = 'single',
  value,
  defaultValue = null,
  onChange,
  rangeValue,
  defaultRangeValue = [null, null],
  onRangeChange,
  min,
  max,
  className,
}: CalendarProps) {
  const [selected, setSelected] = useControllableState<Date | null>({
    value,
    defaultValue,
    onChange: onChange as ((next: Date | null) => void) | undefined,
  });

  const [internalRange, setInternalRange] = useState<[Date | null, Date | null]>(() => defaultRangeValue ?? [null, null]);
  const currentRange = rangeValue !== undefined ? rangeValue : internalRange;
  const [rangeStart, rangeEnd] = currentRange;
  const [hoverDate, setHoverDate] = useState<Date | null>(null);

  const initialCursor = mode === 'range' ? (rangeStart ?? new Date()) : (selected ?? new Date());
  const [cursor, setCursor] = useState<Date>(() => initialCursor);
  const [focused, setFocused] = useState<Date>(() => initialCursor);
  const gridRef = useRef<HTMLDivElement>(null);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const today = startOfDay(new Date());

  const days = useMemo(() => {
    const first = new Date(year, month, 1);
    const startOffset = (first.getDay() + 6) % 7; // Monday-first
    const cells: { date: Date; outside: boolean }[] = [];

    for (let i = startOffset; i > 0; i -= 1) {
      cells.push({ date: new Date(year, month, 1 - i), outside: true });
    }
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let day = 1; day <= daysInMonth; day += 1) {
      cells.push({ date: new Date(year, month, day), outside: false });
    }
    while (cells.length % 7 !== 0) {
      const last = cells[cells.length - 1]!.date;
      cells.push({ date: new Date(last.getFullYear(), last.getMonth(), last.getDate() + 1), outside: true });
    }
    return cells;
  }, [year, month]);

  const isDisabled = (date: Date) =>
    (min && startOfDay(date) < startOfDay(min)) || (max && startOfDay(date) > startOfDay(max));

  const commit = (date: Date) => {
    if (isDisabled(date)) return;
    if (mode === 'range') {
      if (!rangeStart || (rangeStart && rangeEnd)) {
        // Start fresh range selection
        const nextRange: [Date | null, Date | null] = [date, null];
        if (rangeValue === undefined) setInternalRange(nextRange);
        onRangeChange?.(nextRange);
      } else {
        // Start exists, end was pending
        if (startOfDay(date) < startOfDay(rangeStart)) {
          const nextRange: [Date | null, Date | null] = [date, null];
          if (rangeValue === undefined) setInternalRange(nextRange);
          onRangeChange?.(nextRange);
        } else {
          const nextRange: [Date | null, Date | null] = [rangeStart, date];
          if (rangeValue === undefined) setInternalRange(nextRange);
          onRangeChange?.(nextRange);
        }
      }
      setFocused(date);
    } else {
      setSelected(date);
      setFocused(date);
    }
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    const move = (daysCount: number) => {
      const next = new Date(focused.getFullYear(), focused.getMonth(), focused.getDate() + daysCount);
      setFocused(next);
      if (next.getMonth() !== month || next.getFullYear() !== year) setCursor(next);
    };
    const moveMonth = (monthsCount: number) => {
      const next = new Date(focused.getFullYear(), focused.getMonth() + monthsCount, 1);
      setFocused(next);
      setCursor(next);
    };

    switch (event.key) {
      case 'ArrowLeft': event.preventDefault(); move(-1); break;
      case 'ArrowRight': event.preventDefault(); move(1); break;
      case 'ArrowUp': event.preventDefault(); move(-7); break;
      case 'ArrowDown': event.preventDefault(); move(7); break;
      case 'Home': event.preventDefault(); move(-((focused.getDay() + 6) % 7)); break;
      case 'End': event.preventDefault(); move(6 - ((focused.getDay() + 6) % 7)); break;
      case 'PageUp': event.preventDefault(); moveMonth(event.shiftKey ? -12 : -1); break;
      case 'PageDown': event.preventDefault(); moveMonth(event.shiftKey ? 12 : 1); break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        commit(focused);
        break;
      default:
        return;
    }
    requestAnimationFrame(() => {
      gridRef.current?.querySelector<HTMLElement>('[tabindex="0"]')?.focus();
    });
  };

  return (
    <div className={cn('pui-calendar', className)}>
      <div className="pui-calendar__header">
        <button
          type="button"
          className="pui-calendar__nav"
          aria-label="Previous month"
          onClick={() => setCursor(new Date(year, month - 1, 1))}
        >
          <ChevronLeftIcon />
        </button>
        <div className="pui-calendar__title" aria-live="polite">
          {MONTHS[month]} {year}
        </div>
        <button
          type="button"
          className="pui-calendar__nav"
          aria-label="Next month"
          onClick={() => setCursor(new Date(year, month + 1, 1))}
        >
          <ChevronRightIcon />
        </button>
      </div>

      <div
        className="pui-calendar__grid"
        role="grid"
        ref={gridRef}
        onKeyDown={onKeyDown}
        onMouseLeave={() => setHoverDate(null)}
      >
        {DOW.map((day) => (
          <div key={day} className="pui-calendar__dow" role="columnheader" aria-label={day}>
            {day}
          </div>
        ))}
        {days.map(({ date, outside }) => {
          const isSelected = mode === 'range'
            ? sameDay(date, rangeStart) || sameDay(date, rangeEnd)
            : sameDay(date, selected);
          const isToday = sameDay(date, today);
          const disabled = isDisabled(date);
          const isFocused = sameDay(date, focused);

          const isRangeStart = mode === 'range' && sameDay(date, rangeStart);
          const isRangeEnd = mode === 'range' && sameDay(date, rangeEnd);
          const effectiveRangeEnd = rangeEnd ?? (rangeStart && hoverDate && startOfDay(hoverDate) >= startOfDay(rangeStart) ? hoverDate : null);
          const inRange = Boolean(
            mode === 'range' &&
            rangeStart &&
            effectiveRangeEnd &&
            startOfDay(date) >= startOfDay(rangeStart) &&
            startOfDay(date) <= startOfDay(effectiveRangeEnd)
          );

          return (
            <button
              key={date.toISOString()}
              type="button"
              role="gridcell"
              className="pui-calendar__day"
              tabIndex={isFocused ? 0 : -1}
              aria-selected={isSelected}
              aria-current={isToday ? 'date' : undefined}
              data-outside={outside || undefined}
              data-today={isToday || undefined}
              data-selected={isSelected || undefined}
              data-range-start={isRangeStart || undefined}
              data-range-end={isRangeEnd || undefined}
              data-in-range={inRange || undefined}
              data-disabled={disabled || undefined}
              disabled={disabled}
              onClick={() => commit(date)}
              onMouseEnter={() => {
                if (mode === 'range' && rangeStart && !rangeEnd) {
                  setHoverDate(date);
                }
              }}
              onFocus={() => setFocused(date)}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
