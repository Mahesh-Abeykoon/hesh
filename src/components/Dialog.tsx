import {
  useCallback,
  useId,
  useState,
  type HTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from 'react';
import { cn } from '../utils/cn';
import { Portal, useScrollLock } from './Portal';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { useDismiss } from '../hooks/useDismiss';
import { Button, IconButton } from './Button';
import { XIcon } from './icons';

type Size = 'sm' | 'md' | 'lg' | 'xl';

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  size?: Size;
  /** Clicking the backdrop closes the dialog. Disable for destructive flows. */
  dismissOnBackdrop?: boolean;
  hideCloseButton?: boolean;
  className?: string;
  overlayClassName?: string;
  /** Element inside the dialog to focus first. Falls back to the first focusable. */
  initialFocusRef?: React.RefObject<HTMLElement>;
}

/**
 * Modal dialog following the WAI-ARIA Dialog pattern:
 * focus is trapped, focus returns to the trigger on close, Escape closes,
 * background scroll is locked, and the rest of the page is `aria-hidden`
 * while open.
 */
export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  initialFocusRef,
  dismissOnBackdrop = true,
  hideCloseButton = false,
  className,
  overlayClassName,
}: DialogProps) {
  const dialogId = useId();
  // Held in state, not a ref: <Portal> mounts one commit after this component,
  // so a ref would still be empty when the focus-trap effect runs.
  const [panel, setPanel] = useState<HTMLDivElement | null>(null);

  useScrollLock(open);
  useFocusTrap(panel, open, { initialFocus: initialFocusRef });
  // Escape closes unless the dialog is non-dismissible.
  useDismiss(panel, open && dismissOnBackdrop, onClose, { escape: true, outside: false });

  const onBackdropMouseDown = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      // Only close when the press starts *and* ends on the backdrop, so a
      // drag that began inside the panel does not dismiss it.
      if (!dismissOnBackdrop) return;
      if (event.target === event.currentTarget) onClose();
    },
    [dismissOnBackdrop, onClose]
  );

  if (!open) return null;

  const titleId = title ? `pui-dialog-title-${dialogId}` : undefined;
  const descId = description ? `pui-dialog-desc-${dialogId}` : undefined;

  return (
    <Portal>
      <div
        className={cn('pui-overlay', overlayClassName)}
        onMouseDown={onBackdropMouseDown}
        // The overlay itself is not focusable; the panel receives focus.
        aria-hidden="true"
      >
        <div
          ref={setPanel}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={descId}
          className={cn('pui-dialog', `pui-dialog--${size}`, className)}
          onMouseDown={(event) => event.stopPropagation()}
        >
          {(title || description || !hideCloseButton) && (
            <div className="pui-dialog__header">
              <div className="pui-dialog__heading">
                {title && (
                  <h2 id={titleId} className="pui-dialog__title">
                    {title}
                  </h2>
                )}
                {description && (
                  <p id={descId} className="pui-dialog__desc">
                    {description}
                  </p>
                )}
              </div>
              {!hideCloseButton && (
                <IconButton
                  variant="ghost"
                  size="sm"
                  aria-label="Close dialog"
                  className="pui-dialog__close"
                  onClick={onClose}
                >
                  <XIcon />
                </IconButton>
              )}
            </div>
          )}

          {children && <div className="pui-dialog__body">{children}</div>}
          {footer && <div className="pui-dialog__footer">{footer}</div>}
        </div>
      </div>
    </Portal>
  );
}

export interface DrawerProps extends Omit<DialogProps, 'size' | 'overlayClassName'> {
  side?: 'left' | 'right';
  size?: 'sm' | 'md' | 'lg';
}

/** Edge-anchored panel. Same a11y guarantees as Dialog, different motion. */
export function Drawer({ side = 'right', size = 'md', className, ...props }: DrawerProps) {
  const [panel, setPanel] = useState<HTMLDivElement | null>(null);
  useScrollLock(props.open);
  useFocusTrap(panel, props.open);
  useDismiss(panel, props.open && props.dismissOnBackdrop !== false, props.onClose, {
    escape: true,
    outside: false,
  });

  if (!props.open) return null;

  return (
    <Portal>
      <div
        className={cn('pui-overlay', `pui-overlay--drawer-${side}`)}
        onMouseDown={(event) => {
          if (props.dismissOnBackdrop !== false && event.target === event.currentTarget) {
            props.onClose();
          }
        }}
        aria-hidden="true"
      >
        <div
          ref={setPanel}
          role="dialog"
          aria-modal="true"
          aria-labelledby={props.title ? 'pui-drawer-title' : undefined}
          className={cn('pui-dialog', 'pui-drawer', `pui-drawer--${size}`, className)}
          onMouseDown={(event) => event.stopPropagation()}
        >
          {(props.title || !props.hideCloseButton) && (
            <div className="pui-dialog__header">
              <div className="pui-dialog__heading">
                {props.title && (
                  <h2 id="pui-drawer-title" className="pui-dialog__title">
                    {props.title}
                  </h2>
                )}
                {props.description && (
                  <p className="pui-dialog__desc">{props.description}</p>
                )}
              </div>
              {!props.hideCloseButton && (
                <IconButton
                  variant="ghost"
                  size="sm"
                  aria-label="Close panel"
                  className="pui-dialog__close"
                  onClick={props.onClose}
                >
                  <XIcon />
                </IconButton>
              )}
            </div>
          )}
          {props.children && <div className="pui-dialog__body">{props.children}</div>}
          {props.footer && <div className="pui-dialog__footer">{props.footer}</div>}
        </div>
      </div>
    </Portal>
  );
}

/** Convenience: a Dialog wired to a boolean pair, for confirm-style flows. */
export interface ConfirmDialogProps extends Omit<DialogProps, 'title' | 'footer'> {
  title?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: 'primary' | 'danger';
  onConfirm: () => void;
  loading?: boolean;
}

export function ConfirmDialog({
  title = 'Are you sure?',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  tone = 'primary',
  onConfirm,
  loading,
  ...props
}: ConfirmDialogProps) {
  return (
    <Dialog
      {...props}
      title={title}
      size="sm"
      footer={
        <>
          <Button variant="secondary" size="md" onClick={props.onClose}>
            {cancelLabel}
          </Button>
          <Button
            variant={tone}
            size="md"
            data-autofocus
            onClick={onConfirm}
            loading={loading}
          >
            {confirmLabel}
          </Button>
        </>
      }
    />
  );
}

export function DialogBody(props: HTMLAttributes<HTMLDivElement>) {
  return <div className="pui-dialog__body" {...props} />;
}
