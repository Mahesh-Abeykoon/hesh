import {
  createContext,
  forwardRef,
  useContext,
  type ReactNode,
  type KeyboardEvent,
} from 'react';
import { cn } from '../utils/cn';
import { useControllableState } from '../hooks/useControllableState';

interface ToggleGroupContextValue {
  type: 'single' | 'multiple';
  value: string | string[];
  onItemToggle: (itemValue: string) => void;
  variant: 'default' | 'outline' | 'subtle';
  size: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

const ToggleGroupContext = createContext<ToggleGroupContextValue | null>(null);

export interface ToggleGroupProps {
  /** Selection mode: 'single' (radio-like) or 'multiple' (checkbox-like). @default 'single' */
  type?: 'single' | 'multiple';
  /** Controlled value (string for single, string[] for multiple). */
  value?: string | string[];
  /** Default value when uncontrolled. */
  defaultValue?: string | string[];
  /** Callback fired when selection changes. */
  onChange?: (value: any) => void;
  /** Visual variant. @default 'default' */
  variant?: 'default' | 'outline' | 'subtle';
  /** Size variant. @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  /** Orientation. @default 'horizontal' */
  orientation?: 'horizontal' | 'vertical';
  /** Whether the entire group is disabled. */
  disabled?: boolean;
  /** Accessible label. */
  'aria-label'?: string;
  /** Custom class name. */
  className?: string;
  children?: ReactNode;
}

/**
 * ToggleGroup manages a set of mutually exclusive (single) or non-exclusive (multiple) toggle buttons.
 */
export const ToggleGroup = forwardRef<HTMLDivElement, ToggleGroupProps>(function ToggleGroup(
  {
    type = 'single',
    value: controlledValue,
    defaultValue,
    onChange,
    variant = 'default',
    size = 'md',
    orientation = 'horizontal',
    disabled = false,
    'aria-label': ariaLabel,
    className,
    children,
    ...props
  },
  ref
) {
  const [currentValue, setCurrentValue] = useControllableState<string | string[]>({
    value: controlledValue,
    defaultValue: defaultValue ?? (type === 'multiple' ? [] : ''),
    onChange,
  });

  const onItemToggle = (itemValue: string) => {
    if (disabled) return;
    if (type === 'single') {
      const next = currentValue === itemValue ? '' : itemValue;
      setCurrentValue(next);
    } else {
      const arr = Array.isArray(currentValue) ? currentValue : [];
      const next = arr.includes(itemValue)
        ? arr.filter((v) => v !== itemValue)
        : [...arr, itemValue];
      setCurrentValue(next);
    }
  };

  return (
    <ToggleGroupContext.Provider
      value={{
        type,
        value: currentValue,
        onItemToggle,
        variant,
        size,
        disabled,
      }}
    >
      <div
        ref={ref}
        role="group"
        aria-label={ariaLabel}
        aria-orientation={orientation}
        className={cn(
          'pui-toggle-group',
          `pui-toggle-group--${orientation}`,
          `pui-toggle-group--${variant}`,
          `pui-toggle-group--${size}`,
          disabled && 'pui-toggle-group--disabled',
          className
        )}
        {...props}
      >
        {children}
      </div>
    </ToggleGroupContext.Provider>
  );
});

ToggleGroup.displayName = 'ToggleGroup';

export interface ToggleGroupItemProps {
  /** Unique value representing this option. */
  value: string;
  /** Whether this specific item is disabled. */
  disabled?: boolean;
  /** Accessible label. */
  'aria-label'?: string;
  /** Custom class name. */
  className?: string;
  children?: ReactNode;
}

export const ToggleGroupItem = forwardRef<HTMLButtonElement, ToggleGroupItemProps>(
  function ToggleGroupItem(
    { value, disabled: itemDisabled, className, children, 'aria-label': ariaLabel, ...props },
    ref
  ) {
    const ctx = useContext(ToggleGroupContext);
    if (!ctx) {
      throw new Error('ToggleGroupItem must be used within a ToggleGroup');
    }

    const isSelected =
      ctx.type === 'single'
        ? ctx.value === value
        : Array.isArray(ctx.value) && ctx.value.includes(value);

    const isDisabled = ctx.disabled || itemDisabled;

    return (
      <button
        ref={ref}
        type="button"
        role="radio"
        aria-checked={isSelected}
        aria-pressed={isSelected}
        aria-label={ariaLabel}
        disabled={isDisabled}
        data-state={isSelected ? 'on' : 'off'}
        onClick={() => ctx.onItemToggle(value)}
        className={cn(
          'pui-toggle-group__item',
          isSelected && 'pui-toggle-group__item--selected',
          isDisabled && 'pui-toggle-group__item--disabled',
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

ToggleGroupItem.displayName = 'ToggleGroupItem';
