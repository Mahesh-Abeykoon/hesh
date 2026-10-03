import {
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

export interface TooltipProps {
  content: ReactNode;
  children: ReactElement;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  /** Milliseconds before the tooltip appears on hover. */
  delay?: number;
  disabled?: boolean;
  className?: string;
}

/**
 * Tooltip wired for both input methods:
 *
 * - Hover (pointer) shows after `delay`.
 * - Keyboard focus shows immediately, because a keyboard user has no hover.
 * - Escape hides.
 * - The trigger element gets `aria-describedby`; the tooltip itself is never
 *   a focusable element, and content is mirrored to screen readers via the
 *   description rather than a live region.
 */
export function Tooltip({
  content,
  children,
  placement = 'top',
  delay = 180,
  disabled = false,
  className,
}: TooltipProps) {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLElement | null>(null);
  const timerRef = useRef<number | null>(null);
  const id = `pui-tip-${useId()}`;

  const { setFloating, coords, ready } = useFloating<HTMLDivElement>(
    anchorRef as React.RefObject<HTMLElement>,
    open && !disabled,
    { placement, align: 'center', offset: 8 }
  );

  const show = (immediate = false) => {
    if (disabled) return;
    if (timerRef.current) window.clearTimeout(timerRef.current);
    if (immediate) setOpen(true);
    else timerRef.current = window.setTimeout(() => setOpen(true), delay);
  };

  const hide = () => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    setOpen(false);
  };

  const trigger = cloneElement(children, {
    ref: (node: HTMLElement | null) => {
      anchorRef.current = node;
      // Preserve any ref the consumer already set on the child.
      const childRef = (children as ReactElement & { ref?: unknown }).ref;
      if (typeof childRef === 'function') childRef(node);
      else if (childRef && typeof childRef === 'object') {
        (childRef as { current: unknown }).current = node;
      }
    },
    'aria-describedby': open && !disabled ? id : undefined,
    onMouseEnter: (event: React.MouseEvent) => {
      show(false);
      (children.props as { onMouseEnter?: (e: React.MouseEvent) => void }).onMouseEnter?.(event);
    },
    onMouseLeave: (event: React.MouseEvent) => {
      hide();
      (children.props as { onMouseLeave?: (e: React.MouseEvent) => void }).onMouseLeave?.(event);
    },
    onFocus: (event: React.FocusEvent) => {
      show(true);
      (children.props as { onFocus?: (e: React.FocusEvent) => void }).onFocus?.(event);
    },
    onBlur: (event: React.FocusEvent) => {
      hide();
      (children.props as { onBlur?: (e: React.FocusEvent) => void }).onBlur?.(event);
    },
    onKeyDown: (event: React.KeyboardEvent) => {
      if (event.key === 'Escape') hide();
      (children.props as { onKeyDown?: (e: React.KeyboardEvent) => void }).onKeyDown?.(event);
    },
  } as Partial<unknown> as never);

  return (
    <>
      {trigger}
      {open && !disabled && (
        <Portal>
          <div
            ref={setFloating}
            id={id}
            role="tooltip"
            className={cn('pui-tooltip', className)}
            style={{
              top: coords.y,
              left: coords.x,
              visibility: ready ? 'visible' : 'hidden',
            }}
          >
            {content}
          </div>
        </Portal>
      )}
    </>
  );
}
