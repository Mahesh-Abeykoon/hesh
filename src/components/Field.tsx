import {
  forwardRef,
  useId,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from 'react';
import { cn } from '../utils/cn';
import { AlertCircleIcon } from './icons';

/* ------------------------------------------------------------------ Field shell
   Shared label / hint / error plumbing so every control announces itself the
   same way to assistive tech. */

interface FieldShellProps {
  id: string;
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  optionalText?: string;
  className?: string;
  /**
   * Receives the `aria-describedby` value so the control can carry it.
   * Descriptions are only announced when they sit on the control itself —
   * putting them on a wrapper element is a silent no-op.
   */
  children: ReactNode | ((describedBy: string | undefined) => ReactNode);
}

export function FieldShell({
  id,
  label,
  hint,
  error,
  required,
  optionalText,
  className,
  children,
}: FieldShellProps) {
  const describedBy =
    [error ? `${id}-error` : null, hint ? `${id}-hint` : null].filter(Boolean).join(' ') ||
    undefined;

  const content = typeof children === 'function' ? children(describedBy) : children;

  return (
    <div className={cn('pui-field', className)} data-invalid={error ? '' : undefined}>
      {label && (
        <label htmlFor={id} className="pui-label">
          {label}
          {required ? (
            <>
              <span className="pui-label__req" aria-hidden="true">
                *
              </span>
              <span className="pui-sr-only">(required)</span>
            </>
          ) : (
            optionalText && <span className="pui-label__opt">{optionalText}</span>
          )}
        </label>
      )}
      {content}
      {error ? (
        <p id={`${id}-error`} className="pui-error" role="alert">
          <AlertCircleIcon />
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-hint`} className="pui-hint">
            {hint}
          </p>
        )
      )}
    </div>
  );
}

export interface FieldBaseProps {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  optionalText?: string;
  className?: string;
  containerClassName?: string;
}

/* ------------------------------------------------------------------ Input */

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'className'>,
    FieldBaseProps {
  size?: 'sm' | 'md' | 'lg';
  leftAddon?: ReactNode;
  rightAddon?: ReactNode;
  clearable?: boolean;
  onClear?: () => void;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    hint,
    error,
    optionalText,
    className,
    containerClassName,
    leftAddon,
    rightAddon,
    clearable = false,
    onClear,
    size = 'md',
    required,
    id: providedId,
    value,
    ...props
  },
  ref
) {
  const generated = useId();
  const id = providedId ?? generated;
  const showClear = clearable && Boolean(value);

  const renderControl = (describedBy?: string) => (
    <input
      ref={ref}
      id={id}
      required={required}
      aria-invalid={error ? true : undefined}
      aria-describedby={describedBy}
      value={value}
      className={cn('pui-control', size !== 'md' && `pui-control--${size}`, className)}
      {...props}
    />
  );

  const shell = (describedBy?: string) =>
    leftAddon || rightAddon || showClear ? (
      <div
        className={cn(
          'pui-input-wrap',
          leftAddon && 'pui-input-wrap--start',
          (rightAddon || showClear) && 'pui-input-wrap--end',
          size !== 'md' && `pui-input-wrap--${size}`
        )}
      >
        {leftAddon && <span className="pui-affix pui-affix--start">{leftAddon}</span>}
        {renderControl(describedBy)}
        {showClear && (
          <button
            type="button"
            aria-label="Clear input"
            onClick={onClear}
            className="pui-input-clear-btn"
          >
            ×
          </button>
        )}
        {rightAddon && <span className="pui-affix pui-affix--end">{rightAddon}</span>}
      </div>
    ) : (
      renderControl(describedBy)
    );

  return (
    <FieldShell
      id={id}
      label={label}
      hint={hint}
      error={error}
      required={required}
      optionalText={optionalText}
      className={containerClassName}
    >
      {(describedBy) => shell(describedBy)}
    </FieldShell>
  );
});

/* ------------------------------------------------------------------ Textarea */

export interface TextareaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'className' | 'size'>,
    FieldBaseProps {
  rows?: number;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
  maxLength?: number;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  {
    label,
    hint,
    error,
    optionalText,
    className,
    containerClassName,
    required,
    id: providedId,
    rows = 4,
    size = 'md',
    showCount = false,
    maxLength,
    value,
    defaultValue,
    onChange,
    ...props
  },
  ref
) {
  const generated = useId();
  const id = providedId ?? generated;
  const [internalVal, setInternalVal] = useState<string>(() => String(value ?? defaultValue ?? ''));

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInternalVal(e.target.value);
    onChange?.(e);
  };

  const currentLength = value !== undefined ? String(value).length : internalVal.length;
  const limitState = maxLength
    ? currentLength > maxLength
      ? 'exceeded'
      : currentLength >= maxLength * 0.9
        ? 'warning'
        : 'normal'
    : 'normal';

  return (
    <FieldShell
      id={id}
      label={label}
      hint={hint}
      error={error}
      required={required}
      optionalText={optionalText}
      className={containerClassName}
    >
      {(describedBy) => (
        <div className="pui-textarea-wrap">
          <textarea
            ref={ref}
            id={id}
            rows={rows}
            required={required}
            maxLength={maxLength}
            value={value}
            defaultValue={defaultValue}
            onChange={handleChange}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            className={cn('pui-control', size !== 'md' && `pui-control--${size}`, className)}
            {...props}
          />
          {showCount && (
            <div
              className="pui-textarea-count"
              data-limit={limitState}
              aria-live="polite"
            >
              {currentLength} {maxLength ? `/ ${maxLength}` : 'chars'}
            </div>
          )}
        </div>
      )}
    </FieldShell>
  );
});

/* ------------------------------------------------------------------ Select */

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  group?: string;
}

export interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'className' | 'children' | 'size'>,
    FieldBaseProps {
  options: readonly SelectOption[];
  placeholder?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Native `<select>`.
 *
 * Deliberately not a custom listbox: the native element gets free platform
 * behaviour on iOS/Android, typeahead, and screen-reader semantics. Reach for
 * <Combobox /> only when you need search or async loading.
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  {
    label,
    hint,
    error,
    optionalText,
    className,
    containerClassName,
    options,
    placeholder,
    size = 'md',
    required,
    id: providedId,
    ...props
  },
  ref
) {
  const generated = useId();
  const id = providedId ?? generated;

  // Group options if any option specifies a `group`
  const hasGroups = options.some((opt) => opt.group);
  const grouped = hasGroups
    ? options.reduce<Record<string, SelectOption[]>>((acc, opt) => {
        const grp = opt.group ?? 'Other';
        if (!acc[grp]) acc[grp] = [];
        acc[grp].push(opt);
        return acc;
      }, {})
    : null;

  return (
    <FieldShell
      id={id}
      label={label}
      hint={hint}
      error={error}
      required={required}
      optionalText={optionalText}
      className={containerClassName}
    >
      {(describedBy) => (
        <select
          ref={ref}
          id={id}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn('pui-control', size !== 'md' && `pui-control--${size}`, className)}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {grouped
            ? Object.entries(grouped).map(([groupName, groupOptions]) => (
                <optgroup key={groupName} label={groupName}>
                  {groupOptions.map((option) => (
                    <option key={option.value} value={option.value} disabled={option.disabled}>
                      {option.label}
                    </option>
                  ))}
                </optgroup>
              ))
            : options.map((option) => (
                <option key={option.value} value={option.value} disabled={option.disabled}>
                  {option.label}
                </option>
              ))}
        </select>
      )}
    </FieldShell>
  );
});
