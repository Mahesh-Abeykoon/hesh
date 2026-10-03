import type { ReactNode } from 'react';
import { cn } from '../utils/cn';

export interface TimelineProps {
  children: ReactNode;
  className?: string;
}

export function Timeline({ children, className }: TimelineProps) {
  return <ol className={cn('pui-timeline', className)}>{children}</ol>;
}

export interface TimelineItemProps {
  timestamp?: string;
  title: ReactNode;
  description?: ReactNode;
  dot?: ReactNode;
  tone?: 'neutral' | 'primary' | 'success' | 'warning' | 'danger';
  active?: boolean;
  children?: ReactNode;
}

export function TimelineItem({
  timestamp,
  title,
  description,
  dot,
  tone = 'neutral',
  active = false,
  children,
}: TimelineItemProps) {
  return (
    <li className={cn('pui-timeline__item', active && 'pui-timeline__item--active', `pui-timeline__item--${tone}`)}>
      <div className="pui-timeline__dot-wrap">
        <span className="pui-timeline__dot">
          {dot ?? <span className="pui-timeline__dot-inner" />}
        </span>
        <span className="pui-timeline__line" aria-hidden="true" />
      </div>
      <div className="pui-timeline__content">
        <div className="pui-timeline__head">
          <div className="pui-timeline__title">{title}</div>
          {timestamp && <time className="pui-timeline__time">{timestamp}</time>}
        </div>
        {description && <div className="pui-timeline__desc">{description}</div>}
        {children && <div className="pui-timeline__body">{children}</div>}
      </div>
    </li>
  );
}
