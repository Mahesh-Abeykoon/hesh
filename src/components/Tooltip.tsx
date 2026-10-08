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

export type TooltipTone = 'dark' | 'light' | 'primary' | 'invert';

export interface TooltipProps {
  /** Text or rich content rendered inside the tooltip bubble. */
  content: ReactNode;
  /** Trigger element that spawns the tooltip. */
  children: ReactElement;
  /** Placement direction relative to the trigger element. @default 'top' */
  placement?: 'top' | 'bottom' | 'left' | 'right';
  /** Visual tone styling theme. @default 'dark' */
  tone?: TooltipTone;
  /** Render an anchor arrow pointer. @default false */
  arrow?: boolean;
  /** Optional keyboard shortcut badge displayed alongside content (e.g. '⌘K'). */
  shortcut?: string;
  /** Whether the user can hover into the tooltip itself (e.g. to click links or copy text). @default false */
  interactive?: boolean;
  /** Milliseconds before the tooltip appears on hover. @default 180 */
  delay?: number;
  /** Milliseconds before the tooltip hides after pointer leaves. @default 100 */
  closeDelay?: number;
  /** Pixel distance between trigger and tooltip. @default 8 */
  offset?: number;
  /** Disable the tooltip completely. */
  disabled?: boolean;
  /** Controlled open state. */
  open?: boolean;
  /** Callback fired when open state changes in controlled mode. */
  onOpenChange?: (open: boolean) => void;
  /** Optional custom class name. */
  className?: string;
}

/**
 * Tooltip wired for both input methods:
 *
 * - Hover (pointer) shows after `delay`.
 * - Keyboard focus shows immediately, ensuring full keyboard parity.
 * - Escape hides immediately.
 * - Supports tones ('dark', 'light', 'primary'), arrows, shortcuts, and interactive mode.
 */
export function Tooltip({
  content,
  children,
  placement = 'top',
  tone = 'dark',
  arrow = false,
  shortcut,
  interactive = false,
  delay = 180,
  closeDelay = 100,
  offset = 8,
  disabled = false,
  open: controlledOpen,
  onOpenChange,
  className,
}: TooltipProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const isOpen = (isControlled ? controlledOpen : uncontrolledOpen) && !disabled;

  const anchorRef = useRef<HTMLElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const timerRef = useRef<number | null>(null);
  const id = `pui-tip-${useId()}`;

  const { setFloating, coords, ready } = useFloating<HTMLDivElement>(
    anchorRef as React.RefObject<HTMLElement>,
    isOpen,
    { placement, align: 'center', offset }
  );

  const clearTimer = () => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const setOpenState = (next: boolean) => {
    if (!isControlled) setUncontrolledOpen(next);
    onOpenChange?.(next);
  };

  const show = (immediate = false) => {
    if (disabled) return;
    clearTimer();
    if (immediate) {
      setOpenState(true);
    } else {
      timerRef.current = window.setTimeout(() => setOpenState(true), delay);
    }
  };

  const hide = (immediate = false) => {
    clearTimer();
    if (immediate || !interactive) {
      setOpenState(false);
    } else {
      timerRef.current = window.setTimeout(() => setOpenState(false), closeDelay);
    }
  };

  const trigger = cloneElement(children, {
    ref: (node: HTMLElement | null) => {
      anchorRef.current = node;
      const childRef = (children as ReactElement & { ref?: unknown }).ref;
      if (typeof childRef === 'function') childRef(node);
      else if (childRef && typeof childRef === 'object') {
        (childRef as { current: unknown }).current = node;
      }
    },
    'aria-describedby': isOpen ? id : undefined,
    onMouseEnter: (event: React.MouseEvent) => {
      show(false);
      (children.props as { onMouseEnter?: (e: React.MouseEvent) => void }).onMouseEnter?.(event);
    },
    onMouseLeave: (event: React.MouseEvent) => {
      hide(false);
      (children.props as { onMouseLeave?: (e: React.MouseEvent) => void }).onMouseLeave?.(event);
    },
    onFocus: (event: React.FocusEvent) => {
      show(true);
      (children.props as { onFocus?: (e: React.FocusEvent) => void }).onFocus?.(event);
    },
    onBlur: (event: React.FocusEvent) => {
      hide(true);
      (children.props as { onBlur?: (e: React.FocusEvent) => void }).onBlur?.(event);
    },
    onKeyDown: (event: React.KeyboardEvent) => {
      if (event.key === 'Escape') hide(true);
      (children.props as { onKeyDown?: (e: React.KeyboardEvent) => void }).onKeyDown?.(event);
    },
  } as Partial<unknown> as never);

  return (
    <>
      {trigger}
      {isOpen && (
        <Portal>
          <div
            ref={(node) => {
              tooltipRef.current = node;
              setFloating(node);
            }}
            id={id}
            role="tooltip"
            className={cn(
              'pui-tooltip',
              `pui-tooltip--${tone}`,
              `pui-tooltip--${placement}`,
              interactive && 'pui-tooltip--interactive',
              className
            )}
            style={{
              top: coords.y,
              left: coords.x,
              visibility: ready ? 'visible' : 'hidden',
              pointerEvents: interactive ? 'auto' : 'none',
            }}
            onMouseEnter={interactive ? () => clearTimer() : undefined}
            onMouseLeave={interactive ? () => hide(false) : undefined}
          >
            {arrow && <span className="pui-tooltip__arrow" aria-hidden="true" />}
            <span className="pui-tooltip__content">{content}</span>
            {shortcut && (
              <kbd className="pui-tooltip__kbd" aria-hidden="true">
                {shortcut}
              </kbd>
            )}
          </div>
        </Portal>
      )}
    </>
  );
}
