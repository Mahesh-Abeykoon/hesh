import type { HTMLAttributes } from 'react';
import { cn } from '../utils/cn';

export interface SkeletonProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'block' | 'text' | 'circle';
  width?: number | string;
  height?: number | string;
  /** Renders N stacked lines — handy for text placeholders. */
  lines?: number;
}

export function Skeleton({ variant = 'block', width, height, lines, className, style, ...props }: SkeletonProps) {
  if (lines && lines > 1) {
    return (
      <span className={cn('pui-field', className)} style={{ gap: 'var(--pui-space-2)' }} {...props}>
        {Array.from({ length: lines }, (_, index) => (
          <Skeleton
            key={index}
            variant="text"
            width={index === lines - 1 ? '62%' : width ?? '100%'}
          />
        ))}
      </span>
    );
  }

  return (
    <span
      aria-hidden="true"
      className={cn('pui-skeleton', variant === 'text' && 'pui-skeleton--text', variant === 'circle' && 'pui-skeleton--circle', className)}
      style={{ width, height, ...style }}
      {...props}
    />
  );
}
