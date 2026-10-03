import { useMemo, useRef, useState } from 'react';
import { cn } from '../utils/cn';
import { useControllableState } from '../hooks/useControllableState';
import { ChevronLeftIcon, ChevronRightIcon } from './icons';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const DOW = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

export interface CalendarProps {
  value?: Date | null;
  defaultValue?: Date | null;
  onChange?: (date: Date) => void;
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
 */
export function Calendar({
  value,
  defaultValue = null,
  onChange,
  min,
  max,
  className,
}: CalendarProps) {
  const [selected, setSelected] = useControllableState<Date | null>({
    value,
    defaultValue,
    onChange: onChange as ((next: Date | null) => void) | undefined,
  });

  const [cursor, setCursor] = useState<Date>(() => selected ?? new Date());
  const [focused, setFocused] = useState<Date>(() => selected ?? new Date());
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
    setSelected(date);
    setFocused(date);
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

      <div className="pui-calendar__grid" role="grid" ref={gridRef} onKeyDown={onKeyDown}>
        {DOW.map((day) => (
          <div key={day} className="pui-calendar__dow" role="columnheader" aria-label={day}>
            {day}
          </div>
        ))}
        {days.map(({ date, outside }) => {
          const isSelected = sameDay(date, selected);
          const isToday = sameDay(date, today);
          const disabled = isDisabled(date);
          const isFocused = sameDay(date, focused);
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
              data-disabled={disabled || undefined}
              disabled={disabled}
              onClick={() => commit(date)}
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
