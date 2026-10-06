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
  /** Optional custom card width or max-width. */
  width?: number | string;
  /** Render an anchor arrow pointer. @default false */
  arrow?: boolean;
  /** Delay in milliseconds before opening on pointer hover. @default 200 */
  openDelay?: number;
  /** Delay in milliseconds before closing when pointer leaves. @default 250 */
  closeDelay?: number;
  /** Pixel distance between trigger and card. @default 8 */
  offset?: number;
  /** Whether the hover card is disabled. @default false */
  disabled?: boolean;
  /** Controlled open state. */
  open?: boolean;
  /** Callback fired when open state changes. */
  onOpenChange?: (open: boolean) => void;
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
  width,
  arrow = false,
  openDelay = 200,
  closeDelay = 250,
  offset = 8,
  disabled = false,
  open: controlledOpen,
  onOpenChange,
  cardClassName,
}: HoverCardProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const isOpen = (isControlled ? controlledOpen : uncontrolledOpen) && !disabled;

  const anchorRef = useRef<HTMLElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const openTimerRef = useRef<number | null>(null);
  const closeTimerRef = useRef<number | null>(null);
  const id = `pui-hover-card-${useId()}`;

  const { setFloating, coords, ready } = useFloating<HTMLDivElement>(
    anchorRef as React.RefObject<HTMLElement>,
    isOpen,
    { placement, align, offset }
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

  const setOpenState = (next: boolean) => {
    if (!isControlled) setUncontrolledOpen(next);
    onOpenChange?.(next);
  };

  const scheduleOpen = (immediate = false) => {
    if (disabled) return;
    clearTimers();
    if (immediate) {
      setOpenState(true);
    } else {
      openTimerRef.current = window.setTimeout(() => setOpenState(true), openDelay);
    }
  };

  const scheduleClose = (immediate = false) => {
    clearTimers();
    if (immediate) {
      setOpenState(false);
    } else {
      closeTimerRef.current = window.setTimeout(() => setOpenState(false), closeDelay);
    }
  };

  useDismiss(cardRef, isOpen, () => scheduleClose(true), { ignore: [anchorRef] });

  const trigger = cloneElement(children, {
    ref: (node: HTMLElement | null) => {
      anchorRef.current = node;
      const childRef = (children as ReactElement & { ref?: unknown }).ref;
      if (typeof childRef === 'function') childRef(node);
      else if (childRef && typeof childRef === 'object') {
        (childRef as { current: unknown }).current = node;
      }
    },
    'aria-haspopup': 'dialog',
    'aria-expanded': isOpen,
    'aria-controls': isOpen ? id : undefined,
    onMouseEnter: (e: React.MouseEvent) => {
      scheduleOpen();
      (children.props as { onMouseEnter?: (e: React.MouseEvent) => void }).onMouseEnter?.(e);
    },
    onMouseLeave: (e: React.MouseEvent) => {
      scheduleClose();
      (children.props as { onMouseLeave?: (e: React.MouseEvent) => void }).onMouseLeave?.(e);
    },
    onFocus: (e: React.FocusEvent) => {
      scheduleOpen(true);
      (children.props as { onFocus?: (e: React.FocusEvent) => void }).onFocus?.(e);
    },
    onBlur: (e: React.FocusEvent) => {
      scheduleClose();
      (children.props as { onBlur?: (e: React.FocusEvent) => void }).onBlur?.(e);
    },
    onClick: (e: React.MouseEvent) => {
      if (
        'ontouchstart' in window ||
        (typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0)
      ) {
        setOpenState(!isOpen);
      }
      (children.props as { onClick?: (e: React.MouseEvent) => void }).onClick?.(e);
    },
  } as Partial<unknown> as never);

  return (
    <>
      {trigger}

      {isOpen && (
        <Portal>
          <div
            ref={(node) => {
              cardRef.current = node;
              setFloating(node);
            }}
            id={id}
            role="dialog"
            aria-label="Hover Card Preview"
            className={cn(
              'pui-hover-card',
              `pui-hover-card--${placement}`,
              cardClassName
            )}
            style={{
              position: 'fixed',
              left: `${coords.x}px`,
              top: `${coords.y}px`,
              visibility: ready ? 'visible' : 'hidden',
              width: width ?? undefined,
            }}
            onMouseEnter={clearTimers}
            onMouseLeave={() => scheduleClose()}
          >
            {arrow && <div className="pui-hover-card__arrow" aria-hidden="true" />}
            {content}
          </div>
        </Portal>
      )}
    </>
  );
}
