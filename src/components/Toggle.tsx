import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '../utils/cn';
import { useControllableState } from '../hooks/useControllableState';

export interface ToggleProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange' | 'value'> {
  /** Controlled pressed state. */
  pressed?: boolean;
  /** Default pressed state when uncontrolled. */
  defaultPressed?: boolean;
  /** Callback fired when pressed state toggles. */
  onPressedChange?: (pressed: boolean) => void;
  /** Visual variant. @default 'default' */
  variant?: 'default' | 'outline' | 'subtle';
  /** Size variant. @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  /** Child content or icon. */
  children?: ReactNode;
}

/**
 * Toggle button with 2-state on/off behavior and full ARIA `aria-pressed` compliance.
 */
export const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(function Toggle(
  {
    pressed: controlledPressed,
    defaultPressed = false,
    onPressedChange,
    variant = 'default',
    size = 'md',
    disabled = false,
    className,
    children,
    onClick,
    ...props
  },
  ref
) {
  const [isPressed, setIsPressed] = useControllableState({
    value: controlledPressed,
    defaultValue: defaultPressed,
    onChange: onPressedChange,
  });

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    setIsPressed(!isPressed);
    onClick?.(e);
  };

  return (
    <button
      ref={ref}
      type="button"
      aria-pressed={isPressed}
      disabled={disabled}
      data-state={isPressed ? 'on' : 'off'}
      onClick={handleClick}
      className={cn(
        'pui-toggle',
        `pui-toggle--${variant}`,
        `pui-toggle--${size}`,
        isPressed && 'pui-toggle--pressed',
        disabled && 'pui-toggle--disabled',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
});

Toggle.displayName = 'Toggle';
