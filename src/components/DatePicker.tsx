import { useState, useId, type ReactNode } from 'react';
import { Popover } from './Popover';
import { Calendar, type CalendarProps } from './Calendar';
import { ChevronDownIcon, XIcon } from './icons';
import { useControllableState } from '../hooks/useControllableState';
import { cn } from '../utils/cn';
import { FieldShell } from './Field';

export interface DatePickerPreset {
  label: string;
  date?: Date | (() => Date);
  range?: [Date, Date] | (() => [Date, Date]);
  getValue?: () => Date;
}

export interface DatePickerProps extends Omit<CalendarProps, 'className' | 'onChange'> {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  disabled?: boolean;
  id?: string;
  placeholder?: string;
  className?: string;
  format?: (date: Date) => string;
  formatRange?: (start: Date, end: Date) => string;
  presets?: DatePickerPreset[];
  clearable?: boolean;
  size?: 'sm' | 'md' | 'lg';
  onChange?: (date: Date | null) => void;
  onRangeChange?: (range: [Date | null, Date | null]) => void;
}

const defaultFormat = (date: Date) =>
  date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });

const defaultFormatRange = (start: Date, end: Date) =>
  `${defaultFormat(start)} – ${defaultFormat(end)}`;

/** Calendar inside a Popover, with preset buttons, clearable reset, and text trigger. */
export function DatePicker({
  mode = 'single',
  label,
  hint,
  error,
  disabled = false,
  id: providedId,
  placeholder,
  className,
  format = defaultFormat,
  formatRange = defaultFormatRange,
  value,
  defaultValue = null,
  onChange,
  rangeValue,
  defaultRangeValue = [null, null],
  onRangeChange,
  presets,
  clearable = false,
  size = 'md',
  ...calendarProps
}: DatePickerProps) {
  const generatedId = useId();
  const id = providedId ?? generatedId;

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useControllableState<Date | null>({
    value,
    defaultValue,
    onChange,
  });

  const [internalRange, setInternalRange] = useState<[Date | null, Date | null]>(() => defaultRangeValue ?? [null, null]);
  const currentRange = rangeValue !== undefined ? rangeValue : internalRange;
  const [rangeStart, rangeEnd] = currentRange;

  const defaultPlaceholder = mode === 'range' ? 'Select date range' : 'Select a date';
  const effectivePlaceholder = placeholder ?? defaultPlaceholder;

  const hasValue = mode === 'range' ? Boolean(rangeStart) : Boolean(selected);

  let labelText = effectivePlaceholder;
  if (mode === 'range') {
    if (rangeStart && rangeEnd) {
      labelText = formatRange(rangeStart, rangeEnd);
    } else if (rangeStart) {
      labelText = `${format(rangeStart)} – …`;
    }
  } else if (selected) {
    labelText = format(selected);
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (mode === 'range') {
      const resetRange: [Date | null, Date | null] = [null, null];
      if (rangeValue === undefined) setInternalRange(resetRange);
      onRangeChange?.(resetRange);
    } else {
      setSelected(null);
    }
  };

  const pickerPopover = (
    <Popover
      open={!disabled && open}
      onOpenChange={(next) => {
        if (!disabled) setOpen(next);
      }}
      align="start"
      trigger={(props) => (
        <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', width: '100%' }}>
          <button
            type="button"
            id={id}
            {...props}
            disabled={disabled}
            className={cn('pui-control', size !== 'md' && `pui-control--${size}`)}
            style={{
              textAlign: 'start',
              display: 'flex',
              alignItems: 'center',
              gap: '0.625rem',
              cursor: disabled ? 'not-allowed' : 'pointer',
              paddingInlineEnd: clearable && hasValue && !disabled ? '2.25rem' : undefined,
              opacity: disabled ? 0.6 : 1,
            }}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              style={{ color: 'var(--pui-fg-subtle)', flexShrink: 0 }}
              aria-hidden="true"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span style={{ flex: 1, color: hasValue ? undefined : 'var(--pui-fg-subtle)', fontSize: 'inherit' }}>
              {labelText}
            </span>
            <ChevronDownIcon size="0.875rem" />
          </button>
          {clearable && hasValue && !disabled && (
            <button
              type="button"
              aria-label="Clear date"
              onClick={handleClear}
              className="pui-input-clear-btn"
              style={{ position: 'absolute', right: '0.75rem', zIndex: 2 }}
            >
              <XIcon size={12} />
            </button>
          )}
        </div>
      )}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '0.25rem' }}>
        {presets && presets.length > 0 && (
          <div
            style={{
              display: 'flex',
              gap: '0.375rem',
              flexWrap: 'wrap',
              paddingBottom: '0.5rem',
              borderBottom: '1px solid var(--pui-border)',
            }}
          >
            {presets.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => {
                  const resolvedRange = typeof preset.range === 'function' ? preset.range() : preset.range;
                  const rawDate = preset.date ?? preset.getValue;
                  const resolvedDate = typeof rawDate === 'function' ? rawDate() : rawDate;

                  if (resolvedRange && mode === 'range') {
                    if (rangeValue === undefined) setInternalRange(resolvedRange);
                    onRangeChange?.(resolvedRange);
                    setOpen(false);
                  } else if (resolvedDate) {
                    if (mode === 'range') {
                      const newR: [Date | null, Date | null] = [resolvedDate, resolvedDate];
                      if (rangeValue === undefined) setInternalRange(newR);
                      onRangeChange?.(newR);
                    } else {
                      setSelected(resolvedDate);
                    }
                    setOpen(false);
                  }
                }}
                style={{
                  padding: '0.25rem 0.5rem',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  borderRadius: 'var(--pui-radius-sm)',
                  background: 'var(--pui-surface-subtle)',
                  border: '1px solid var(--pui-border)',
                  cursor: 'pointer',
                  color: 'var(--pui-fg)',
                }}
              >
                {preset.label}
              </button>
            ))}
          </div>
        )}
        <Calendar
          {...calendarProps}
          mode={mode}
          value={selected}
          rangeValue={currentRange}
          onChange={(date) => {
            setSelected(date);
            setOpen(false);
          }}
          onRangeChange={(newRange) => {
            if (rangeValue === undefined) setInternalRange(newRange);
            onRangeChange?.(newRange);
            if (newRange[0] && newRange[1]) {
              setOpen(false);
            }
          }}
        />
      </div>
    </Popover>
  );

  if (label || hint || error) {
    return (
      <FieldShell
        id={id}
        label={label}
        hint={hint}
        error={error}
        className={className}
      >
        {() => pickerPopover}
      </FieldShell>
    );
  }

  return <div className={className}>{pickerPopover}</div>;
}
