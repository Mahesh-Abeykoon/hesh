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

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  /** Leading status dot. Colour inherits from the tone. */
  dot?: boolean;
  pill?: boolean;
  children?: ReactNode;
}

export function Badge({ tone = 'neutral', dot = false, pill = false, className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn('pui-badge', `pui-badge--${tone}`, pill && 'pui-badge--pill', className)}
      {...props}
    >
      {dot && <span className="pui-badge__dot" aria-hidden="true" />}
      {children}
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
