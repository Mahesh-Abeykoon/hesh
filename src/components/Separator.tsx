import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../utils/cn';

export interface SeparatorProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
  /** Renders a centred label with rules on either side (horizontal only). */
  label?: ReactNode;
  thick?: boolean;
}

/**
 * `role="separator"` + `aria-orientation`; decorative by default when no label
 * is supplied, so it does not pollute the accessibility tree.
 */
export function Separator({
  orientation = 'horizontal',
  label,
  thick = false,
  className,
  ...props
}: SeparatorProps) {
  if (label) {
    return (
      <div
        className={cn('pui-separator', 'pui-separator--label', className)}
        role="separator"
        aria-orientation="horizontal"
        {...props}
      >
        {label}
      </div>
    );
  }

  return (
    <div
      role="separator"
      aria-orientation={orientation}
      className={cn(
        'pui-separator',
        orientation === 'vertical' && 'pui-separator--vertical',
        thick && 'pui-separator--thick',
        className
      )}
      {...props}
    />
  );
}
