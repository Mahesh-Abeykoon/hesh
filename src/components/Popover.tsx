import React, {
  useCallback,
  useId,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { cn } from '../utils/cn';
import { Portal } from './Portal';
import { useFloating } from '../hooks/useFloating';
import { useDismiss } from '../hooks/useDismiss';
import { XIcon } from './icons';

export interface PopoverTriggerRenderProps {
  ref: (node: HTMLElement | null) => void;
  onClick: () => void;
  'aria-expanded': boolean;
  'aria-haspopup': 'dialog';
  'aria-controls': string;
}

export interface PopoverProps {
  /** Controlled open state. */
  open?: boolean;
  /** Uncontrolled initial open state. @default false */
  defaultOpen?: boolean;
  /** Callback fired when open state changes. */
  onOpenChange?: (open: boolean) => void;
  /** Render prop providing trigger attributes and click handler. */
  trigger: (props: PopoverTriggerRenderProps) => ReactNode;
  /** Header title text or element. */
  title?: ReactNode;
  /** Header description text or element. */
  description?: ReactNode;
  /** Content rendered inside the floating popover body. */
  children?: ReactNode;
  /** Whether to show a dedicated close button in the header. @default true when title exists */
  showCloseButton?: boolean;
  /** Whether to render an anchor arrow pointing towards the trigger. @default false */
  arrow?: boolean;
  /** Size scale of the popover card. @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  /** Modal backdrop overlay. @default false */
  modal?: boolean;
  /** Alignment along the placement edge. @default 'start' */
  align?: 'start' | 'center' | 'end';
  /** Preferred placement relative to the trigger. @default 'bottom' */
  placement?: 'top' | 'bottom' | 'left' | 'right';
  /** Pixel distance between trigger and popover. @default 8 */
  offset?: number;
  /** Optional custom class name. */
  className?: string;
}

/**
 * A dismissible, focusable panel anchored to a trigger.
 *
 * Supports controlled and uncontrolled modes, header title and description,
 * dedicated close button, arrow anchor, and modal backdrop option.
 */
export function Popover({
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  trigger,
  title,
  description,
  children,
  showCloseButton,
  arrow = false,
  size = 'md',
  modal = false,
  align = 'start',
  placement = 'bottom',
  offset = 8,
  className,
}: PopoverProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const triggerRef = useRef<HTMLElement | null>(null);
  const id = `pui-popover-${useId()}`;

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) setUncontrolledOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange]
  );

  const { setFloating, floatingRef, coords, ready } = useFloating<HTMLDivElement>(
    triggerRef as React.RefObject<HTMLElement>,
    open,
    { placement, align, offset }
  );

  const close = useCallback(() => setOpen(false), [setOpen]);
  useDismiss(triggerRef, open, close, { escape: true, outside: true, ignore: [floatingRef] });

  const shouldShowClose = showCloseButton ?? Boolean(title);

  return (
    <>
      {trigger({
        ref: (node) => {
          triggerRef.current = node;
        },
        onClick: () => setOpen(!open),
        'aria-expanded': open,
        'aria-haspopup': 'dialog',
        'aria-controls': open ? id : '',
      })}
      {open && (
        <>
          {modal && (
            <div
              className="pui-popover__backdrop"
              aria-hidden="true"
              onClick={close}
            />
          )}
          <Portal>
            <div
              ref={setFloating}
              id={id}
              role="dialog"
              aria-modal={modal ? 'true' : undefined}
              tabIndex={-1}
              aria-labelledby={title ? `${id}-title` : undefined}
              aria-describedby={description ? `${id}-desc` : undefined}
              className={cn(
                'pui-popover',
                `pui-popover--${size}`,
                `pui-popover--${placement}`,
                className
              )}
              style={{
                position: 'fixed',
                top: coords.y,
                left: coords.x,
                visibility: ready ? 'visible' : 'hidden',
              }}
            >
              {arrow && <div className="pui-popover__arrow" aria-hidden="true" />}

              {(title || shouldShowClose) && (
                <div className="pui-popover__header">
                  {title && (
                    <div id={`${id}-title`} className="pui-popover__title">
                      {title}
                    </div>
                  )}
                  {shouldShowClose && (
                    <button
                      type="button"
                      className="pui-popover__close-btn"
                      onClick={close}
                      aria-label="Close popover"
                    >
                      <XIcon size={14} />
                    </button>
                  )}
                </div>
              )}

              {description && (
                <div id={`${id}-desc`} className="pui-popover__desc">
                  {description}
                </div>
              )}

              <div className="pui-popover__body">{children}</div>
            </div>
          </Portal>
        </>
      )}
    </>
  );
}
