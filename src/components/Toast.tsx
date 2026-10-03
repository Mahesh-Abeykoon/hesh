import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { cn } from '../utils/cn';
import { Portal } from './Portal';
import {
  AlertCircleIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  InfoIcon,
  XIcon,
} from './icons';

export type ToastTone = 'info' | 'success' | 'warning' | 'danger';

export interface ToastOptions {
  title: ReactNode;
  description?: ReactNode;
  tone?: ToastTone;
  /** Milliseconds before auto-dismiss. Pass 0 to keep it open. */
  duration?: number;
  action?: ReactNode;
}

interface ToastRecord extends ToastOptions {
  id: number;
  leaving?: boolean;
}

interface ToastContextValue {
  toast: (options: ToastOptions) => number;
  dismiss: (id: number) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const TONE_ICONS: Record<ToastTone, typeof InfoIcon> = {
  info: InfoIcon,
  success: CheckCircleIcon,
  warning: AlertTriangleIcon,
  danger: AlertCircleIcon,
};

export type ToastPlacement = 'bottom-right' | 'top-right' | 'bottom-left' | 'top-center';

export interface ToastProviderProps {
  children: ReactNode;
  placement?: ToastPlacement;
  /** Default lifetime for toasts that do not specify one. */
  duration?: number;
  /** Maximum simultaneous toasts; oldest are dropped first. */
  limit?: number;
}

/**
 * Toast host. Mount once near the root; call `useToast().toast()` anywhere.
 *
 * The live region is `role="status"` / `aria-live="polite"`, so messages are
 * announced without stealing focus. Interruptive tones switch to
 * `aria-live="assertive"` because dropping them silently would be worse.
 */
export function ToastProvider({
  children,
  placement = 'bottom-right',
  duration = 4500,
  limit = 3,
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastRecord[]>([]);
  const nextId = useRef(1);
  const timers = useRef(new Map<number, number>());

  const dismiss = useCallback((id: number) => {
    // Let the exit animation play before unmounting.
    setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, leaving: true } : t)));
    window.setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 180);

    const timer = timers.current.get(id);
    if (timer) {
      window.clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const toast = useCallback(
    (options: ToastOptions) => {
      const id = nextId.current;
      nextId.current += 1;

      setToasts((prev) => [...prev, { ...options, id }].slice(-limit));

      const lifetime = options.duration ?? duration;
      if (lifetime > 0) {
        timers.current.set(id, window.setTimeout(() => dismiss(id), lifetime));
      }
      return id;
    },
    [duration, dismiss, limit]
  );

  const value = useMemo(() => ({ toast, dismiss }), [toast, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Portal>
        <div
          className={cn('pui-toaster', `pui-toaster--${placement}`)}
          role="region"
          aria-label="Notifications"
        >
          {toasts.map((record) => {
            const IconComponent = TONE_ICONS[record.tone ?? 'info'];
            const assertive = record.tone === 'danger' || record.tone === 'warning';
            return (
              <div
                key={record.id}
                role={assertive ? 'alert' : 'status'}
                aria-live={assertive ? 'assertive' : 'polite'}
                aria-atomic="true"
                className={cn(
                  'pui-toast',
                  `pui-toast--${record.tone ?? 'info'}`,
                  record.leaving && 'pui-toast--leaving'
                )}
              >
                <span className="pui-toast__icon">
                  <IconComponent />
                </span>
                <div className="pui-toast__body">
                  <div className="pui-toast__title">{record.title}</div>
                  {record.description && (
                    <div className="pui-toast__desc">{record.description}</div>
                  )}
                  {record.action && <div style={{ marginTop: 'var(--pui-space-2)' }}>{record.action}</div>}
                </div>
                <button
                  type="button"
                  className="pui-toast__close"
                  aria-label="Dismiss notification"
                  onClick={() => dismiss(record.id)}
                >
                  <XIcon size="1rem" />
                </button>
              </div>
            );
          })}
        </div>
      </Portal>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast() must be used inside <ToastProvider>.');
  }
  return context;
}
