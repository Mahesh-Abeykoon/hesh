import { useCallback, useId, useRef, type ReactNode } from 'react';
import { cn } from '../utils/cn';
import { Portal } from './Portal';
import { useFloating } from '../hooks/useFloating';
import { useDismiss } from '../hooks/useDismiss';

export interface PopoverProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger: (props: {
    ref: (node: HTMLElement | null) => void;
    onClick: () => void;
    'aria-expanded': boolean;
    'aria-haspopup': 'dialog';
    'aria-controls': string;
  }) => ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  align?: 'start' | 'center' | 'end';
  placement?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

/**
 * A dismissible, focusable panel anchored to a trigger.
 *
 * Unlike a Dialog it does not trap focus or lock scroll — it is for
 * supplementary UI (filters, detail cards) that the user can ignore.
 */
export function Popover({
  open,
  onOpenChange,
  trigger,
  title,
  description,
  children,
  align = 'start',
  placement = 'bottom',
  className,
}: PopoverProps) {
  const triggerRef = useRef<HTMLElement | null>(null);
  const id = `pui-popover-${useId()}`;

  const { setFloating, floatingRef, coords, ready } = useFloating<HTMLDivElement>(
    triggerRef as React.RefObject<HTMLElement>,
    open,
    { placement, align, offset: 8 }
  );

  const close = useCallback(() => onOpenChange(false), [onOpenChange]);
  useDismiss(triggerRef, open, close, { escape: true, outside: true, ignore: [floatingRef] });

  return (
    <>
      {trigger({
        ref: (node) => {
          triggerRef.current = node;
        },
        onClick: () => onOpenChange(!open),
        'aria-expanded': open,
        'aria-haspopup': 'dialog',
        'aria-controls': open ? id : '',
      })}
      {open && (
        <Portal>
          <div
            ref={setFloating}
            id={id}
            role="dialog"
            tabIndex={-1}
            aria-labelledby={title ? `${id}-title` : undefined}
            className={cn('pui-popover', className)}
            style={{ top: coords.y, left: coords.x, visibility: ready ? 'visible' : 'hidden' }}
          >
            {title && (
              <div id={`${id}-title`} className="pui-popover__title">
                {title}
              </div>
            )}
            {description && <div className="pui-popover__desc">{description}</div>}
            {children}
          </div>
        </Portal>
      )}
    </>
  );
}
