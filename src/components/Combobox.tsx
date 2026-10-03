import { useCallback, useId, useMemo, useRef, useState, type ReactNode } from 'react';
import { cn } from '../utils/cn';
import { useFloating } from '../hooks/useFloating';
import { useDismiss } from '../hooks/useDismiss';
import { FieldShell } from './Field';
import { CheckIcon, ChevronDownIcon, SearchIcon, XIcon } from './icons';
import { Spinner } from './Feedback';

export interface ComboboxOption {
  value: string;
  label: string;
  /** Extra text matched by the filter but shown as a secondary line. */
  keywords?: string[];
  disabled?: boolean;
  icon?: ReactNode;
}

export interface ComboboxProps {
  options: readonly ComboboxOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  placeholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  loading?: boolean;
  /** Let the user type to narrow the list. */
  searchable?: boolean;
  /** Clear the selection with an inline X. */
  clearable?: boolean;
  className?: string;
  id?: string;
}

/**
 * Accessible combobox (WAI-ARIA 1.2 editable combobox with listbox popup).
 *
 * - The input keeps DOM focus; the highlighted option is tracked with
 *   `aria-activedescendant`, so screen readers announce it without moving focus.
 * - `aria-autocomplete="list"` + `aria-expanded` + `aria-controls` on the input.
 * - Home/End, PageUp/PageDown and arrow keys behave like a native select.
 */
export function Combobox({
  options,
  value,
  defaultValue = '',
  onValueChange,
  label,
  hint,
  error,
  placeholder = 'Select…',
  emptyMessage = 'No results found',
  disabled = false,
  loading = false,
  searchable = true,
  clearable = false,
  className,
  id: providedId,
}: ComboboxProps) {
  const generatedId = useId();
  const id = providedId ?? generatedId;
  const listboxId = `${id}-listbox`;

  const [selected, setSelected] = useControlled(value, defaultValue, onValueChange);
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [dirty, setDirty] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return options;
    return options.filter((option) => {
      const haystack = [option.label, ...(option.keywords ?? [])].join(' ').toLowerCase();
      return haystack.includes(term);
    });
  }, [options, query]);

  const { setFloating, floatingRef } = useFloating<HTMLDivElement>(wrapRef, open, {
    placement: 'bottom',
    align: 'start',
    offset: 4,
  });

  const close = useCallback(() => {
    setOpen(false);
    setActiveIndex(-1);
    setQuery('');
    setDirty(false);
  }, []);

  useDismiss(wrapRef, open, close, { escape: true, outside: true, ignore: [floatingRef] });

  const commit = useCallback(
    (optionValue: string) => {
      setSelected(optionValue);
      close();
      inputRef.current?.focus();
    },
    [setSelected, close]
  );

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (!open) {
          setOpen(true);
          setActiveIndex(filtered.findIndex((option) => !option.disabled));
          return;
        }
        setActiveIndex((prev) => nextEnabled(filtered, prev, 1));
        return;
      case 'ArrowUp':
        event.preventDefault();
        setActiveIndex((prev) => nextEnabled(filtered, prev, -1));
        return;
      case 'Home':
        if (!open) return;
        event.preventDefault();
        setActiveIndex(filtered.findIndex((option) => !option.disabled));
        return;
      case 'End':
        if (!open) return;
        event.preventDefault();
        setActiveIndex(findLastEnabled(filtered));
        return;
      case 'Enter':
        if (open && activeIndex >= 0) {
          event.preventDefault();
          const option = filtered[activeIndex];
          if (option && !option.disabled) commit(option.value);
        }
        return;
      case 'Escape':
        if (open) {
          event.preventDefault();
          close();
        }
        return;
      case 'Tab':
        if (open) close();
        return;
      default:
        if (!searchable && event.key.length === 1) event.preventDefault();
    }
  };

  const selectedOption = options.find((option) => option.value === selected);
  const displayValue = open && dirty ? query : (selectedOption?.label ?? '');

  return (
    <FieldShell
      id={id}
      label={label}
      hint={hint}
      error={error}
      className={cn('pui-combobox', className)}
    >
      {(describedBy) => (
      <div ref={wrapRef} style={{ position: 'relative' }}>
        <div className={cn('pui-input-wrap', 'pui-input-wrap--start', 'pui-input-wrap--end')}>
          <span className="pui-affix pui-affix--start">
            {loading ? <Spinner size="sm" /> : <SearchIcon />}
          </span>

          <input
            ref={inputRef}
            id={id}
            className="pui-control"
            role="combobox"
            aria-expanded={open}
            aria-controls={listboxId}
            aria-autocomplete={searchable ? 'list' : 'none'}
            aria-activedescendant={
              open && activeIndex >= 0 ? `${id}-opt-${activeIndex}` : undefined
            }
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            autoComplete="off"
            disabled={disabled}
            placeholder={placeholder}
            value={displayValue}
            readOnly={!searchable}
            onChange={(event) => {
              setQuery(event.target.value);
              setDirty(true);
              setOpen(true);
              setActiveIndex(filtered.findIndex((option) => !option.disabled));
            }}
            onFocus={() => !disabled && setOpen(true)}
            onClick={() => !disabled && setOpen((prev) => !prev)}
            onKeyDown={onKeyDown}
            style={{ cursor: searchable || disabled ? undefined : 'pointer' }}
          />

          <span className="pui-affix pui-affix--end" style={{ gap: '0.25rem', pointerEvents: 'auto' }}>
            {clearable && selectedOption && !disabled && (
              <button
                type="button"
                aria-label="Clear selection"
                onClick={() => {
                  setSelected('');
                  setQuery('');
                  inputRef.current?.focus();
                }}
                style={{ display: 'inline-flex', color: 'inherit' }}
              >
                <XIcon size="0.875rem" />
              </button>
            )}
            <span aria-hidden="true" style={{ color: 'var(--pui-fg-subtle)' }}>
              <ChevronDownIcon size="1rem" />
            </span>
          </span>
        </div>

        {open && (
          <div
            ref={setFloating}
            id={listboxId}
            role="listbox"
            aria-label={typeof label === 'string' ? label : 'Options'}
            className="pui-combobox__listbox"
            style={{ position: 'absolute' }}
          >
            {filtered.length === 0 ? (
              <div className="pui-combobox__empty">{emptyMessage}</div>
            ) : (
              filtered.map((option, index) => (
                <div
                  key={option.value}
                  id={`${id}-opt-${index}`}
                  role="option"
                  aria-selected={option.value === selected}
                  aria-disabled={option.disabled || undefined}
                  data-active={index === activeIndex ? 'true' : undefined}
                  data-selected={option.value === selected ? 'true' : undefined}
                  className="pui-combobox__option"
                  onMouseEnter={() => !option.disabled && setActiveIndex(index)}
                  onMouseDown={(event) => {
                    // Keep focus on the input; mousedown would otherwise blur it.
                    event.preventDefault();
                    if (!option.disabled) commit(option.value);
                  }}
                >
                  {option.icon}
                  <span>{option.label}</span>
                  {option.value === selected && (
                    <span className="pui-combobox__option__check">
                      <CheckIcon />
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
      )}
    </FieldShell>
  );
}

function useControlled(
  value: string | undefined,
  defaultValue: string,
  onValueChange?: (value: string) => void
) {
  const [internal, setInternal] = useState(defaultValue);
  const isControlled = value !== undefined;
  const current = isControlled ? value : internal;

  const setSelected = useCallback(
    (next: string) => {
      if (!isControlled) setInternal(next);
      onValueChange?.(next);
    },
    [isControlled, onValueChange]
  );

  return [current, setSelected] as const;
}

function nextEnabled(options: readonly ComboboxOption[], from: number, delta: number) {
  if (options.length === 0) return -1;
  let index = from;
  for (let step = 0; step < options.length; step += 1) {
    index = (index + delta + options.length) % options.length;
    if (!options[index]?.disabled) return index;
  }
  return from;
}

function findLastEnabled(options: readonly ComboboxOption[]) {
  for (let index = options.length - 1; index >= 0; index -= 1) {
    if (!options[index]?.disabled) return index;
  }
  return -1;
}
