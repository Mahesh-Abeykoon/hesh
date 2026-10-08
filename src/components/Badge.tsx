import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../utils/cn';

export type BadgeTone =
  | 'neutral'
  | 'primary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'outline';

export type BadgeVariant = 'subtle' | 'solid' | 'outline' | 'glass';
export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  variant?: BadgeVariant;
  size?: BadgeSize;
  /** Leading status dot. Colour inherits from the tone. */
  dot?: boolean;
  /** Enable pulsing glow animation on dot. */
  pulse?: boolean;
  pill?: boolean;
  icon?: ReactNode;
  removable?: boolean;
  onRemove?: () => void;
  count?: number;
  children?: ReactNode;
}

export function Badge({
  tone = 'neutral',
  variant = 'subtle',
  size = 'md',
  dot = false,
  pulse = false,
  pill = false,
  icon,
  removable = false,
  onRemove,
  count,
  className,
  children,
  ...props
}: BadgeProps) {
  const isCount = count !== undefined;

  return (
    <span
      className={cn(
        'pui-badge',
        `pui-badge--${tone}`,
        variant !== 'subtle' && `pui-badge--${variant}`,
        size !== 'md' && `pui-badge--${size}`,
        (pill || isCount) && 'pui-badge--pill',
        removable && 'pui-badge--removable',
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn('pui-badge__dot', pulse && 'pui-badge__dot--pulse')}
          aria-hidden="true"
        />
      )}
      {icon && <span className="pui-badge__icon">{icon}</span>}
      {isCount ? (count > 99 ? '99+' : count) : children}
      {removable && (
        <button
          type="button"
          aria-label="Remove badge"
          onClick={(e) => {
            e.stopPropagation();
            onRemove?.();
          }}
          className="pui-badge__close-btn"
        >
          ×
        </button>
      )}
    </span>
  );
}

// Re-exports for backwards compatibility
export { Avatar, AvatarGroup, initialsOf } from './Avatar';
export type { AvatarProps, AvatarGroupProps, AvatarSize, AvatarStatus } from './Avatar';

export { Separator } from './Separator';
export type { SeparatorProps } from './Separator';

export { Skeleton } from './Skeleton';
export type { SkeletonProps } from './Skeleton';
