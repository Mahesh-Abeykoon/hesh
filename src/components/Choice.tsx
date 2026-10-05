import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useId,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';
import { cn } from '../utils/cn';
import { useControllableState } from '../hooks/useControllableState';
import { CheckIcon, MinusIcon } from './icons';

/* ------------------------------------------------------------------ Checkbox */

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size' | 'children'> {
  label?: ReactNode;
  description?: ReactNode;
  indeterminate?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, description, indeterminate = false, size = 'md', disabled, className, id: providedId, ...props },
  forwardedRef
) {
  const generated = useId();
  const id = providedId ?? generated;
  const descriptionId = description ? `${id}-description` : undefined;

  // `indeterminate` is a DOM property with no HTML attribute, so it has to be
  // assigned imperatively whenever the node or the flag changes.
  const setRef = useCallback(
    (node: HTMLInputElement | null) => {
      if (node) node.indeterminate = indeterminate;
      if (typeof forwardedRef === 'function') forwardedRef(node);
      else if (forwardedRef) forwardedRef.current = node;
    },
    [forwardedRef, indeterminate]
  );

  return (
    <label
      htmlFor={id}
      className={cn(
        'pui-choice',
        `pui-choice--${size}`,
        disabled && 'pui-choice--disabled',
        className
      )}
    >
      <input
        ref={setRef}
        id={id}
        type="checkbox"
        disabled={disabled}
        aria-describedby={descriptionId}
        // Mixed state must be announced, not just drawn.
        aria-checked={indeterminate ? 'mixed' : undefined}
        {...props}
      />
      <span className="pui-choice__box pui-choice__box--checkbox">
        {indeterminate ? <MinusIcon /> : <CheckIcon />}
      </span>
      {(label || description) && (
        <span className="pui-choice__text">
          {label}
          {description && (
            <span id={descriptionId} className="pui-choice__desc">
              {description}
            </span>
          )}
        </span>
      )}
    </label>
  );
});

/* ------------------------------------------------------------------ Radio */

export interface RadioGroupProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  name?: string;
  children: ReactNode;
  className?: string;
  'aria-label'?: string;
}

/** Owning group — one tab stop for the whole set, arrow keys to move. */
export function RadioGroup({
  value,
  defaultValue,
  onValueChange,
  name,
  children,
  className,
  ...props
}: RadioGroupProps) {
  const [selected, setSelected] = useControllableState<string>({
    value,
    defaultValue: defaultValue ?? '',
    onChange: onValueChange,
  });
  const autoName = useId();
  const groupName = name ?? autoName;

  return (
    <div
      role="radiogroup"
      className={cn('pui-field', className)}
      data-value={selected}
      {...props}
    >
      <RadioGroupContext.Provider value={{ name: groupName, selected, setSelected }}>
        {children}
      </RadioGroupContext.Provider>
    </div>
  );
}

interface RadioGroupContextValue {
  name: string;
  selected: string;
  setSelected: (value: string) => void;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

export interface RadioProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'name' | 'checked' | 'value' | 'onChange' | 'size'> {
  value: string;
  label?: ReactNode;
  description?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { value, label, description, size = 'md', disabled, className, id: providedId, ...props },
  ref
) {
  const context = useContext(RadioGroupContext);
  const generated = useId();
  const id = providedId ?? generated;
  const descriptionId = description ? `${id}-description` : undefined;

  const checked = context ? context.selected === value : false;

  return (
    <label
      htmlFor={id}
      className={cn(
        'pui-choice',
        `pui-choice--${size}`,
        disabled && 'pui-choice--disabled',
        className
      )}
    >
      <input
        ref={ref}
        id={id}
        type="radio"
        value={value}
        checked={checked}
        disabled={disabled}
        aria-describedby={descriptionId}
        onChange={() => context?.setSelected(value)}
        {...props}
      />
      <span className="pui-choice__box pui-choice__box--radio">
        <span
          style={{
            width: '0.4375rem',
            height: '0.4375rem',
            borderRadius: '9999px',
            background: 'currentColor',
            color: 'var(--pui-on-primary)',
          }}
        />
      </span>
      {(label || description) && (
        <span className="pui-choice__text">
          {label}
          {description && (
            <span id={descriptionId} className="pui-choice__desc">
              {description}
            </span>
          )}
        </span>
      )}
    </label>
  );
});

/* ------------------------------------------------------------------ Switch */

export interface SwitchProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange' | 'value' | 'type'> {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label?: ReactNode;
  description?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * `role="switch"` on a `<button>` rather than a hidden checkbox: full styling
 * control with correct semantics, and Space/Enter both toggle natively.
 */
export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(function Switch(
  {
    checked,
    defaultChecked = false,
    onCheckedChange,
    label,
    description,
    size = 'md',
    disabled,
    className,
    id: providedId,
    ...props
  },
  ref
) {
  const [isChecked, setChecked] = useControllableState<boolean>({
    value: checked,
    defaultValue: defaultChecked,
    onChange: onCheckedChange,
  });

  const generated = useId();
  const id = providedId ?? generated;
  const descriptionId = description ? `${id}-description` : undefined;

  const control = (
    <button
      ref={ref}
      id={id}
      type="button"
      role="switch"
      aria-checked={isChecked}
      aria-describedby={descriptionId}
      aria-label={typeof label === 'string' ? label : undefined}
      disabled={disabled}
      data-state={isChecked ? 'checked' : 'unchecked'}
      data-size={size}
      className={cn('pui-switch', className)}
      onClick={() => setChecked(!isChecked)}
      {...props}
    >
      <span className="pui-switch__thumb" />
    </button>
  );

  if (!label && !description) return control;

  return (
    <span className={cn('pui-choice', `pui-choice--${size}`, disabled && 'pui-choice--disabled')}>
      {control}
      {(label || description) && (
        <span className="pui-choice__text">
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label
            htmlFor={id}
            onClick={(event) => {
              event.preventDefault();
              if (!disabled) setChecked(!isChecked);
            }}
            style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
          >
            {label}
          </label>
          {description && (
            <span id={descriptionId} className="pui-choice__desc">
              {description}
            </span>
          )}
        </span>
      )}
    </span>
  );
});

/* ------------------------------------------------------------------ ChoiceCard */

export interface ChoiceCardProps extends React.HTMLAttributes<HTMLDivElement> {
  checked?: boolean;
  disabled?: boolean;
  children: ReactNode;
}

/**
 * Selectable card container for Checkbox and Radio items with active ring highlight.
 */
export const ChoiceCard = forwardRef<HTMLDivElement, ChoiceCardProps>(function ChoiceCard(
  { checked, disabled, className, children, ...props },
  ref
) {
  return (
    <div
      ref={ref}
      data-checked={checked || undefined}
      className={cn('pui-choice-card', disabled && 'pui-choice-card--disabled', className)}
      {...props}
    >
      {children}
    </div>
  );
});
