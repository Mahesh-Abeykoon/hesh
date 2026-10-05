import React, {
  cloneElement,
  useId,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react';
import { cn } from '../utils/cn';
import { Portal } from './Portal';
import { useFloating } from '../hooks/useFloating';
import { useDismiss } from '../hooks/useDismiss';

export interface HoverCardProps {
  /** Rich preview content rendered inside the floating card. */
  content: ReactNode;
  /** Trigger element that spawns the hover card. */
  children: ReactElement;
  /** Placement direction relative to the trigger. @default 'bottom' */
  placement?: 'top' | 'bottom' | 'left' | 'right';
  /** Alignment along the placement edge. @default 'start' */
  align?: 'start' | 'center' | 'end';
  /** Delay in milliseconds before opening on pointer hover. @default 250 */
  openDelay?: number;
  /** Delay in milliseconds before closing when pointer leaves. @default 300 */
  closeDelay?: number;
  /** Whether the hover card is disabled. */
  disabled?: boolean;
  /** Optional custom class for the floating card container. */
  cardClassName?: string;
}

/**
 * HoverCard renders a rich floating preview popup on hover or focus.
 * Includes interactive hover buffer so users can move their cursor into the card.
 */
export function HoverCard({
  content,
  children,
  placement = 'bottom',
  align = 'start',
  openDelay = 250,
  closeDelay = 300,
  disabled = false,
  cardClassName,
}: HoverCardProps) {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const openTimerRef = useRef<number | null>(null);
  const closeTimerRef = useRef<number | null>(null);
  const id = `pui-hover-card-${useId()}`;

  const { setFloating, coords, ready } = useFloating<HTMLDivElement>(
    anchorRef as React.RefObject<HTMLElement>,
    open && !disabled,
    { placement, align, offset: 8 }
  );

  const clearTimers = () => {
    if (openTimerRef.current) {
      window.clearTimeout(openTimerRef.current);
      openTimerRef.current = null;
    }
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const scheduleOpen = (immediate = false) => {
    if (disabled) return;
    clearTimers();
    if (immediate) {
      setOpen(true);
    } else {
      openTimerRef.current = window.setTimeout(() => setOpen(true), openDelay);
    }
  };

  const scheduleClose = (immediate = false) => {
    clearTimers();
    if (immediate) {
      setOpen(false);
    } else {
      closeTimerRef.current = window.setTimeout(() => setOpen(false), closeDelay);
    }
  };

  useDismiss(cardRef, open, () => scheduleClose(true), { ignore: [anchorRef] });

  const trigger = cloneElement(children, {
    ref: (node: HTMLElement | null) => {
      anchorRef.current = node;
      const childRef = (children as any).ref;
      if (typeof childRef === 'function') childRef(node);
      else if (childRef && typeof childRef === 'object') childRef.current = node;
    },
    'aria-haspopup': 'dialog',
    'aria-expanded': open,
    'aria-controls': open ? id : undefined,
    onMouseEnter: (e: React.MouseEvent) => {
      scheduleOpen();
      children.props.onMouseEnter?.(e);
    },
    onMouseLeave: (e: React.MouseEvent) => {
      scheduleClose();
      children.props.onMouseLeave?.(e);
    },
    onFocus: (e: React.FocusEvent) => {
      scheduleOpen(true);
      children.props.onFocus?.(e);
    },
    onBlur: (e: React.FocusEvent) => {
      scheduleClose();
      children.props.onBlur?.(e);
    },
    onClick: (e: React.MouseEvent) => {
      // Toggle on touch devices where hover is unavailable
      if ('ontouchstart' in window || (typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0)) {
        setOpen((prev) => !prev);
      }
      children.props.onClick?.(e);
    },
  });

  return (
    <>
      {trigger}

      {open && (
        <Portal>
          <div
            ref={(node) => {
              cardRef.current = node;
              setFloating(node);
            }}
            id={id}
            role="dialog"
            aria-label="Hover Card Preview"
            className={cn('pui-hover-card', cardClassName)}
            style={{
              position: 'fixed',
              left: `${coords.x}px`,
              top: `${coords.y}px`,
              visibility: ready ? 'visible' : 'hidden',
              zIndex: 'var(--pui-z-popover, 1300)',
            }}
            onMouseEnter={clearTimers}
            onMouseLeave={() => scheduleClose()}
          >
            {content}
          </div>
        </Portal>
      )}
    </>
  );
}
