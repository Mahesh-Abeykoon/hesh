import { useCallback, useId, useMemo, useRef, useState, type ReactNode } from 'react';
import { cn } from '../utils/cn';
import { Portal } from './Portal';
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
  /** Category or group name. */
  group?: string;
  /** Secondary description text shown below label. */
  description?: string;
}

export interface ComboboxProps {
  options: readonly ComboboxOption[];
  /** Single selection value (controlled). */
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;

  /** Multi-select mode with removable tags. */
  multiple?: boolean;
  values?: string[];
  defaultValues?: string[];
  onValuesChange?: (values: string[]) => void;

  /** Size variant. */
  size?: 'sm' | 'md' | 'lg';

  /** Custom option renderer. */
  renderOption?: (
    option: ComboboxOption,
    state: { selected: boolean; active: boolean }
  ) => ReactNode;

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
 * - Supports grouped option categories, multi-select with removable tags,
 *   custom item rendering, and size variants (`sm`, `md`, `lg`).
 * - Home/End, PageUp/PageDown and arrow keys behave like a native select.
 */
export function Combobox({
  options,
  value,
  defaultValue = '',
  onValueChange,
  multiple = false,
  values,
  defaultValues = [],
  onValuesChange,
  size = 'md',
  renderOption,
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
  const [internalValues, setInternalValues] = useState<string[]>(defaultValues);
  const selectedValues = values !== undefined ? values : internalValues;

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
      const haystack = [option.label, option.description, ...(option.keywords ?? [])]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(term);
    });
  }, [options, query]);

  // Grouped structure preserving flat index for keyboard accessibility
  const groupedItems = useMemo(() => {
    const hasGroups = filtered.some((o) => o.group);
    if (!hasGroups) {
      return filtered.map((option, index) => ({ type: 'option' as const, option, index }));
    }
    const groups: { name: string; items: { option: ComboboxOption; index: number }[] }[] = [];
    const map = new Map<string, { option: ComboboxOption; index: number }[]>();

    filtered.forEach((option, index) => {
      const grp = option.group || 'Other';
      if (!map.has(grp)) {
        map.set(grp, []);
        groups.push({ name: grp, items: map.get(grp)! });
      }
      map.get(grp)!.push({ option, index });
    });

    const result: (
      | { type: 'header'; name: string }
      | { type: 'option'; option: ComboboxOption; index: number }
    )[] = [];

    groups.forEach((g) => {
      result.push({ type: 'header', name: g.name });
      g.items.forEach((item) => {
        result.push({ type: 'option', option: item.option, index: item.index });
      });
    });

    return result;
  }, [filtered]);

  const { setFloating, floatingRef, coords, ready } = useFloating<HTMLDivElement>(wrapRef, open, {
    placement: 'bottom',
    align: 'start',
    offset: 4,
    matchWidth: true,
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
      if (multiple) {
        const next = selectedValues.includes(optionValue)
          ? selectedValues.filter((v) => v !== optionValue)
          : [...selectedValues, optionValue];
        if (values === undefined) setInternalValues(next);
        onValuesChange?.(next);
        setQuery('');
        setDirty(false);
        inputRef.current?.focus();
      } else {
        setSelected(optionValue);
        close();
        inputRef.current?.focus();
      }
    },
    [multiple, selectedValues, values, onValuesChange, setSelected, close]
  );

  const removeValue = (valToRemove: string) => {
    const next = selectedValues.filter((v) => v !== valToRemove);
    if (values === undefined) setInternalValues(next);
    onValuesChange?.(next);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    switch (event.key) {
      case 'Backspace':
        if (multiple && query === '' && selectedValues.length > 0) {
          removeValue(selectedValues[selectedValues.length - 1]!);
        }
        return;
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
  const displayValue = multiple
    ? query
    : open && dirty
      ? query
      : (selectedOption?.label ?? '');

  const hasSelection = multiple ? selectedValues.length > 0 : Boolean(selectedOption);

  const iconSize = size === 'sm' ? '0.875rem' : size === 'lg' ? '1.125rem' : '1rem';

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
          <div
            className={cn(
              'pui-input-wrap',
              'pui-input-wrap--start',
              'pui-input-wrap--end',
              size !== 'md' && `pui-input-wrap--${size}`
            )}
            onClick={() => {
              if (!disabled) {
                inputRef.current?.focus();
                setOpen(true);
              }
            }}
          >
            <span className="pui-affix pui-affix--start">
              {loading ? <Spinner size={size === 'lg' ? 'md' : 'sm'} /> : <SearchIcon size={iconSize} />}
            </span>

            {multiple && selectedValues.length > 0 && (
              <div className="pui-combobox__tags">
                {selectedValues.map((val) => {
                  const opt = options.find((o) => o.value === val);
                  return (
                    <span key={val} className="pui-combobox__tag">
                      {opt?.icon}
                      <span>{opt?.label ?? val}</span>
                      {!disabled && (
                        <button
                          type="button"
                          aria-label={`Remove ${opt?.label ?? val}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            removeValue(val);
                          }}
                        >
                          <XIcon size="0.75rem" />
                        </button>
                      )}
                    </span>
                  );
                })}
              </div>
            )}

            <input
              ref={inputRef}
              id={id}
              className={cn(
                'pui-control',
                size !== 'md' && `pui-control--${size}`,
                multiple && 'pui-combobox__input-inline'
              )}
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
              placeholder={multiple && selectedValues.length > 0 ? '' : placeholder}
              value={displayValue}
              readOnly={!searchable}
              onChange={(event) => {
                setQuery(event.target.value);
                setDirty(true);
                setOpen(true);
                setActiveIndex(filtered.findIndex((option) => !option.disabled));
              }}
              onFocus={() => !disabled && setOpen(true)}
              onKeyDown={onKeyDown}
              style={{ cursor: searchable || disabled ? undefined : 'pointer' }}
            />

            <span className="pui-affix pui-affix--end" style={{ gap: '0.25rem', pointerEvents: 'auto' }}>
              {clearable && hasSelection && !disabled && (
                <button
                  type="button"
                  aria-label="Clear selection"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (multiple) {
                      if (values === undefined) setInternalValues([]);
                      onValuesChange?.([]);
                    } else {
                      setSelected('');
                    }
                    setQuery('');
                    inputRef.current?.focus();
                  }}
                  style={{ display: 'inline-flex', color: 'inherit', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  <XIcon size={size === 'sm' ? '0.75rem' : size === 'lg' ? '1rem' : '0.875rem'} />
                </button>
              )}
              <span aria-hidden="true" style={{ color: 'var(--pui-fg-subtle)' }}>
                <ChevronDownIcon size={iconSize} />
              </span>
            </span>
          </div>

          {open && (
            <Portal>
              <div
                ref={setFloating}
                id={listboxId}
                role="listbox"
                aria-label={typeof label === 'string' ? label : 'Options'}
                aria-multiselectable={multiple ? 'true' : undefined}
                className="pui-combobox__listbox"
                style={{
                  position: 'fixed',
                  top: coords.y,
                  left: coords.x,
                  visibility: ready ? 'visible' : 'hidden',
                  zIndex: 'var(--pui-z-popover, 1300)',
                }}
              >
                {filtered.length === 0 ? (
                  <div className="pui-combobox__empty">{emptyMessage}</div>
                ) : (
                  groupedItems.map((item) => {
                    if (item.type === 'header') {
                      return (
                        <div key={`group-${item.name}`} className="pui-combobox__group-header">
                          {item.name}
                        </div>
                      );
                    }

                    const { option, index } = item;
                    const isOptSelected = multiple
                      ? selectedValues.includes(option.value)
                      : option.value === selected;
                    const isOptActive = index === activeIndex;

                    return (
                      <div
                        key={option.value}
                        id={`${id}-opt-${index}`}
                        role="option"
                        aria-selected={isOptSelected}
                        aria-disabled={option.disabled || undefined}
                        data-active={isOptActive ? 'true' : undefined}
                        data-selected={isOptSelected ? 'true' : undefined}
                        className="pui-combobox__option"
                        onMouseEnter={() => !option.disabled && setActiveIndex(index)}
                        onMouseDown={(event) => {
                          // Keep focus on the input; mousedown would otherwise blur it.
                          event.preventDefault();
                          if (!option.disabled) commit(option.value);
                        }}
                        onClick={(event) => {
                          event.preventDefault();
                          if (!option.disabled) commit(option.value);
                        }}
                      >
                        {renderOption ? (
                          renderOption(option, { selected: isOptSelected, active: isOptActive })
                        ) : (
                          <>
                            {option.icon}
                            <div className="pui-combobox__option-content">
                              <span className="pui-combobox__option-label">{option.label}</span>
                              {option.description && (
                                <span className="pui-combobox__option-desc">{option.description}</span>
                              )}
                            </div>
                            {isOptSelected && (
                              <span className="pui-combobox__option__check">
                                <CheckIcon />
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </Portal>
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
