import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../utils/cn';
import {
  AlertCircleIcon,
  AlertTriangleIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  CheckCircleIcon,
  InfoIcon,
  InboxIcon,
} from './icons';

/* ------------------------------------------------------------------ Spinner */

export interface SpinnerProps extends HTMLAttributes<HTMLSpanElement> {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

export const Spinner = forwardRef<HTMLSpanElement, SpinnerProps>(function Spinner(
  { size = 'md', label = 'Loading', className, ...props },
  ref
) {
  return (
    <span ref={ref} className={cn('pui-spinner', size !== 'md' && `pui-spinner--${size}`, className)} role="status" aria-label={label} {...props} />
  );
});

export function LoadingRow({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="pui-loading-row" role="status">
      <Spinner />
      {label}
    </div>
  );
}

/* ------------------------------------------------------------------ Alert */

export type AlertTone = 'info' | 'success' | 'warning' | 'danger' | 'neutral';
export type AlertVariant = 'subtle' | 'solid' | 'outline' | 'accent' | 'glass';

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  tone?: AlertTone;
  variant?: AlertVariant;
  title?: ReactNode;
  icon?: ReactNode | false;
  action?: ReactNode;
  secondaryAction?: ReactNode;
  /** Renders a dismiss button. */
  onDismiss?: () => void;
}

const ALERT_ICONS: Record<AlertTone, typeof InfoIcon> = {
  info: InfoIcon,
  success: CheckCircleIcon,
  warning: AlertTriangleIcon,
  danger: AlertCircleIcon,
  neutral: InfoIcon,
};

/**
 * `role="status"` for informational tones, `role="alert"` for danger/warning so
 * those interrupt the screen reader. Assertive announcements on every alert
 * would be hostile to assistive-tech users.
 */
export function Alert({
  tone = 'info',
  variant = 'subtle',
  title,
  icon,
  action,
  secondaryAction,
  onDismiss,
  children,
  className,
  ...props
}: AlertProps) {
  const IconComponent = ALERT_ICONS[tone] ?? InfoIcon;
  const assertive = tone === 'danger' || tone === 'warning';
  const renderIcon = icon !== false;

  return (
    <div
      role={assertive ? 'alert' : 'status'}
      className={cn(
        'pui-alert',
        `pui-alert--${tone}`,
        variant !== 'subtle' && `pui-alert--${variant}`,
        className
      )}
      {...props}
    >
      {renderIcon && (
        <span className="pui-alert__icon">
          {icon ?? <IconComponent />}
        </span>
      )}
      <div className="pui-alert__body">
        {title && <div className="pui-alert__title">{title}</div>}
        {children && <div className="pui-alert__desc">{children}</div>}
        {(action || secondaryAction) && (
          <div className="pui-alert__actions">
            {action}
            {secondaryAction}
          </div>
        )}
      </div>
      {onDismiss && (
        <button
          type="button"
          aria-label="Dismiss"
          onClick={onDismiss}
          className="pui-alert__dismiss"
        >
          <span aria-hidden="true" style={{ fontSize: '1.25rem', lineHeight: 1 }}>
            ×
          </span>
        </button>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ EmptyState */

export interface EmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  secondaryAction?: ReactNode;
  /** Removes the dashed border and background for inline use. */
  plain?: boolean;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
  plain = false,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div className={cn('pui-empty', plain && 'pui-empty--plain', className)} {...props}>
      <span className="pui-empty__icon">{icon ?? <InboxIcon />}</span>
      <h3 className="pui-empty__title">{title}</h3>
      {description && <p className="pui-empty__desc">{description}</p>}
      {(action || secondaryAction) && (
        <div className="pui-empty__actions">
          {action}
          {secondaryAction}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ Progress */

export interface ProgressSegment {
  value: number;
  tone?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
  label?: string;
}

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  tone?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'gradient';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  striped?: boolean;
  animated?: boolean;
  showValue?: boolean;
  segments?: ProgressSegment[];
  /** Unknown duration — animates a sweeping bar instead of a fixed width. */
  indeterminate?: boolean;
  label?: string;
}

export function Progress({
  value = 0,
  max = 100,
  tone = 'primary',
  size = 'md',
  striped = false,
  animated = false,
  showValue = false,
  segments,
  indeterminate = false,
  label,
  className,
  ...props
}: ProgressProps) {
  const pct = max <= 0 ? 0 : Math.min(100, Math.max(0, (value / max) * 100));

  const progressNode = (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={indeterminate ? undefined : max}
      aria-valuenow={indeterminate ? undefined : value}
      aria-label={label}
      className={cn(
        'pui-progress',
        `pui-progress--${size}`,
        tone !== 'primary' && `pui-progress--${tone}`,
        striped && 'pui-progress--striped',
        animated && 'pui-progress--animated',
        indeterminate && 'pui-progress--indeterminate',
        className
      )}
      {...props}
    >
      {segments && segments.length > 0 ? (
        segments.map((seg, i) => {
          const segPct = max <= 0 ? 0 : Math.min(100, (seg.value / max) * 100);
          return (
            <div
              key={i}
              className={cn(
                'pui-progress__segment',
                `pui-progress__segment--${seg.tone ?? 'primary'}`
              )}
              style={{ width: `${segPct}%` }}
              title={seg.label ? `${seg.label}: ${seg.value}` : undefined}
            />
          );
        })
      ) : (
        <div
          className="pui-progress__bar"
          style={indeterminate ? undefined : { width: `${pct}%` }}
        />
      )}
    </div>
  );

  if (showValue || label) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', width: '100%' }}>
        {(label || showValue) && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8125rem' }}>
            {label && <span style={{ fontWeight: 500, color: 'var(--pui-fg)' }}>{label}</span>}
            {showValue && !indeterminate && (
              <span style={{ fontWeight: 600, color: 'var(--pui-fg-subtle)', marginInlineStart: 'auto' }}>
                {Math.round(pct)}%
              </span>
            )}
          </div>
        )}
        {progressNode}
      </div>
    );
  }

  return progressNode;
}

/* ------------------------------------------------------------------ Stat */

export interface StatProps extends HTMLAttributes<HTMLDivElement> {
  label: ReactNode;
  value: ReactNode;
  /** Percentage change. Sign is inferred from the number. */
  delta?: number;
  /** Overrides the auto up/down icon and wording. */
  deltaLabel?: ReactNode;
  /** Rendered under the value — typically a small sparkline. */
  children?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export function Stat({ label, value, delta, deltaLabel, children, size = 'md', className, ...props }: StatProps) {
  const direction = delta === undefined ? 'flat' : delta > 0 ? 'up' : delta < 0 ? 'down' : 'flat';
  const IconComponent = direction === 'up' ? ArrowUpIcon : ArrowDownIcon;

  return (
    <div className={cn('pui-stat', className)} {...props}>
      <div className="pui-stat__label">{label}</div>
      <div
        className="pui-stat__value"
        style={size === 'sm' ? { fontSize: 'var(--pui-text-2xl)' } : size === 'lg' ? { fontSize: 'var(--pui-text-4xl)' } : undefined}
      >
        {value}
      </div>
      {delta !== undefined && (
        <div className={cn('pui-stat__delta', `pui-stat__delta--${direction}`)}>
          <IconComponent />
          {deltaLabel ?? `${Math.abs(delta).toFixed(1)}%`}
          <span style={{ color: 'var(--pui-fg-subtle)', fontWeight: 400 }}>vs last month</span>
        </div>
      )}
      {deltaLabel && delta === undefined && (
        <div className="pui-stat__delta pui-stat__delta--flat">{deltaLabel}</div>
      )}
      {children && <div className="pui-stat__spark">{children}</div>}
    </div>
  );
}

/* ------------------------------------------------------------------ Kbd */

export function Kbd({ children }: { children: ReactNode }) {
  return <kbd className="pui-kbd">{children}</kbd>;
}
