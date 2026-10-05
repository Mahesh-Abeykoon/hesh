import React, { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../utils/cn';

export interface AspectRatioProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * The aspect ratio of the container (width / height).
   * @default 16 / 9
   * @example 16 / 9, 4 / 3, 1, 21 / 9
   */
  ratio?: number;
  /** Content to be constrained within the aspect ratio. */
  children: ReactNode;
}

/**
 * AspectRatio displays content within a desired ratio.
 * Perfectly responsive across all screen dimensions.
 */
export const AspectRatio = forwardRef<HTMLDivElement, AspectRatioProps>(
  ({ ratio = 16 / 9, className, style, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('pui-aspect-ratio', className)}
        style={{
          aspectRatio: `${ratio}`,
          ...style,
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

AspectRatio.displayName = 'AspectRatio';
