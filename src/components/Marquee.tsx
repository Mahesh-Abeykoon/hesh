import React, {
  forwardRef,
  type ReactNode,
  type HTMLAttributes,
} from 'react';
import { cn } from '../utils/cn';

export interface MarqueeProps extends HTMLAttributes<HTMLDivElement> {
  direction?: 'left' | 'right' | 'up' | 'down';
  speed?: number; // duration in seconds
  pauseOnHover?: boolean;
  pauseOnClick?: boolean;
  gap?: string;
  fade?: boolean;
  repeat?: number;
  children: ReactNode;
}

export const Marquee = forwardRef<HTMLDivElement, MarqueeProps>(function Marquee(
  {
    direction = 'left',
    speed = 25,
    pauseOnHover = true,
    pauseOnClick = false,
    gap = '2rem',
    fade = true,
    repeat = 2,
    children,
    className,
    style,
    ...props
  },
  ref
) {
  const isVertical = direction === 'up' || direction === 'down';

  return (
    <div
      ref={ref}
      className={cn(
        'hesh-marquee',
        `hesh-marquee--${direction}`,
        pauseOnHover && 'hesh-marquee--pause-hover',
        pauseOnClick && 'hesh-marquee--pause-click',
        fade && (isVertical ? 'hesh-marquee--fade-y' : 'hesh-marquee--fade-x'),
        className
      )}
      style={
        {
          '--marquee-duration': `${speed}s`,
          '--marquee-gap': gap,
          ...style,
        } as React.CSSProperties
      }
      {...props}
    >
      {Array.from({ length: repeat }).map((_, index) => (
        <div
          key={index}
          className="hesh-marquee__content"
          aria-hidden={index > 0 ? true : undefined}
        >
          {children}
        </div>
      ))}
    </div>
  );
});
