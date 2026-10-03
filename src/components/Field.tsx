import {
  forwardRef,
  useId,
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
  leftAddon?: ReactNode;
  rightAddon?: ReactNode;
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
    required,
    id: providedId,
    ...props
  },
  ref
) {
  const generated = useId();
  const id = providedId ?? generated;

  const renderControl = (describedBy?: string) => (
    <input
      ref={ref}
      id={id}
      required={required}
      aria-invalid={error ? true : undefined}
      aria-describedby={describedBy}
      className={cn('pui-control', className)}
      {...props}
    />
  );

  const shell = (describedBy?: string) =>
    leftAddon || rightAddon ? (
      <div
        className={cn(
          'pui-input-wrap',
          leftAddon && 'pui-input-wrap--start',
          rightAddon && 'pui-input-wrap--end'
        )}
      >
        {leftAddon && <span className="pui-affix pui-affix--start">{leftAddon}</span>}
        {renderControl(describedBy)}
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
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'className'>,
    FieldBaseProps {
  rows?: number;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, hint, error, optionalText, className, containerClassName, required, id: providedId, rows = 4, ...props },
  ref
) {
  const generated = useId();
  const id = providedId ?? generated;

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
        <textarea
          ref={ref}
          id={id}
          rows={rows}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn('pui-control', className)}
          {...props}
        />
      )}
    </FieldShell>
  );
});

/* ------------------------------------------------------------------ Select */

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'className' | 'children'>,
    FieldBaseProps {
  options: readonly SelectOption[];
  placeholder?: string;
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
    required,
    id: providedId,
    ...props
  },
  ref
) {
  const generated = useId();
  const id = providedId ?? generated;

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
          className={cn('pui-control', className)}
          {...props}
        >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>
      )}
    </FieldShell>
  );
});
