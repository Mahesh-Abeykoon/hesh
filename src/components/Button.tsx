import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '../utils/cn';
import { Slot } from '../primitives/Slot';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'danger'
  | 'subtle'
  | 'link';

export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Swaps the label for a spinner and blocks interaction. */
  loading?: boolean;
  /** Replaces the label while loading — keeps layout from shifting. */
  loadingText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
  iconOnly?: boolean;
  /** Merge button styles and behavior onto an immediate child element (e.g. Next.js or React Router Link) */
  asChild?: boolean;
}

/**
 * The workhorse action element.
 *
 * Accessibility notes
 * - A native `<button>`: Space/Enter activation and form submission work for free.
 * - `loading` sets `aria-busy` and `aria-disabled` rather than the `disabled`
 *   attribute, so the button keeps its place in the tab order (no focus loss).
 * - `asChild` renders using `<Slot>` to delegate attributes cleanly to router `<Link>` or `<a>`.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'md',
    loading = false,
    loadingText,
    leftIcon,
    rightIcon,
    fullWidth = false,
    iconOnly = false,
    disabled,
    className,
    children,
    type = 'button',
    asChild = false,
    ...props
  },
  ref
) {
  const isInert = disabled || loading;
  const Comp = asChild ? Slot : 'button';

  const buttonClass = cn(
    'pui-btn',
    `pui-btn--${variant}`,
    `pui-btn--${size}`,
    fullWidth && 'pui-btn--block',
    iconOnly && 'pui-btn--icon-only',
    className
  );

  if (asChild) {
    return (
      <Comp
        ref={ref}
        aria-busy={loading || undefined}
        aria-disabled={isInert || undefined}
        className={buttonClass}
        {...props}
      >
        {children}
      </Comp>
    );
  }

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || undefined}
      aria-busy={loading || undefined}
      aria-disabled={isInert || undefined}
      className={buttonClass}
      {...props}
    >
      {loading ? (
        <span className="pui-btn__spinner" />
      ) : (
        leftIcon && <span className="pui-btn__icon">{leftIcon}</span>
      )}
      {loading && loadingText ? loadingText : children}
      {!loading && rightIcon && <span className="pui-btn__icon">{rightIcon}</span>}
    </button>
  );
});

export interface IconButtonProps extends Omit<ButtonProps, 'iconOnly' | 'leftIcon' | 'rightIcon'> {
  /** Required — an icon-only control has no accessible name otherwise. */
  'aria-label': string;
  children: ReactNode;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { size = 'md', className, children, ...props },
  ref
) {
  return (
    <Button
      ref={ref}
      iconOnly
      size={size}
      className={cn('pui-btn--icon-only', className)}
      {...props}
    >
      {children}
    </Button>
  );
});

export interface ButtonGroupProps {
  children: ReactNode;
  className?: string;
  'aria-label'?: string;
}

export function ButtonGroup({ children, className, ...props }: ButtonGroupProps) {
  return (
    <div role="group" className={cn('pui-btn-group', className)} {...props}>
      {children}
    </div>
  );
}
