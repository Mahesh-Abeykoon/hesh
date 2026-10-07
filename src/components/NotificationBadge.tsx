import React, { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../utils/cn';

export type NotificationBadgeTone = 'danger' | 'primary' | 'success' | 'warning' | 'neutral';
export type NotificationBadgePlacement = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

export interface NotificationBadgeProps extends HTMLAttributes<HTMLDivElement> {
  /** Number to display inside the badge. */
  count?: number;
  /** Maximum number to show before displaying as `{max}+`. Defaults to 99. */
  max?: number;
  /** If true, renders a compact status dot instead of a count. */
  dot?: boolean;
  /** If true, renders an animated pinging pulse ring behind the badge. */
  pulse?: boolean;
  /** Color theme tone of the badge. Defaults to 'danger'. */
  tone?: NotificationBadgeTone;
  /** Corner anchor placement. Defaults to 'top-right'. */
  placement?: NotificationBadgePlacement;
  /** Whether to show the badge when count is 0. Defaults to false. */
  showZero?: boolean;
  /** The child component (Avatar, Button, Icon) to anchor to. */
  children?: ReactNode;
}

export const NotificationBadge = forwardRef<HTMLDivElement, NotificationBadgeProps>(
  function NotificationBadge(
    {
      count,
      max = 99,
      dot = false,
      pulse = false,
      tone = 'danger',
      placement = 'top-right',
      showZero = false,
      children,
      className,
      style,
      ...rest
    },
    ref
  ) {
    const isHidden = !dot && count !== undefined && count <= 0 && !showZero;

    const displayCount =
      count !== undefined ? (count > max ? `${max}+` : String(count)) : null;

    const toneStyles: Record<NotificationBadgeTone, { bg: string; color: string; border: string }> = {
      danger: {
        bg: 'var(--pui-danger, #ef4444)',
        color: '#ffffff',
        border: 'var(--pui-surface, #ffffff)',
      },
      primary: {
        bg: 'var(--pui-primary, #6366f1)',
        color: '#ffffff',
        border: 'var(--pui-surface, #ffffff)',
      },
      success: {
        bg: 'var(--pui-success, #10b981)',
        color: '#ffffff',
        border: 'var(--pui-surface, #ffffff)',
      },
      warning: {
        bg: 'var(--pui-warning, #f59e0b)',
        color: '#000000',
        border: 'var(--pui-surface, #ffffff)',
      },
      neutral: {
        bg: 'var(--pui-fg-muted, #71717a)',
        color: '#ffffff',
        border: 'var(--pui-surface, #ffffff)',
      },
    };

    const currentTone = toneStyles[tone];

    const placementStyles: Record<NotificationBadgePlacement, React.CSSProperties> = {
      'top-right': { top: 0, right: 0, transform: 'translate(45%, -45%)' },
      'top-left': { top: 0, left: 0, transform: 'translate(-45%, -45%)' },
      'bottom-right': { bottom: 0, right: 0, transform: 'translate(45%, 45%)' },
      'bottom-left': { bottom: 0, left: 0, transform: 'translate(-45%, 45%)' },
    };

    if (!children) {
      // Standalone badge
      if (isHidden) return null;
      return (
        <span
          ref={ref as any}
          className={cn('pui-badge-count', className)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: dot ? '3px' : '0 6px',
            minWidth: dot ? '8px' : '18px',
            height: dot ? '8px' : '18px',
            borderRadius: '9999px',
            fontSize: '0.6875rem',
            fontWeight: 700,
            lineHeight: 1,
            backgroundColor: currentTone.bg,
            color: currentTone.color,
            ...style,
          }}
          {...(rest as any)}
        >
          {!dot && displayCount}
        </span>
      );
    }

    return (
      <div
        ref={ref}
        className={cn('pui-badge-anchor', className)}
        style={{
          position: 'relative',
          display: 'inline-flex',
          verticalAlign: 'middle',
          flexShrink: 0,
          ...style,
        }}
        {...rest}
      >
        {children}

        {!isHidden && (
          <span
            style={{
              position: 'absolute',
              zIndex: 10,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: dot ? 0 : '0 5px',
              minWidth: dot ? '9px' : '18px',
              height: dot ? '9px' : '18px',
              borderRadius: '9999px',
              fontSize: '0.6875rem',
              fontWeight: 700,
              lineHeight: 1,
              whiteSpace: 'nowrap',
              backgroundColor: currentTone.bg,
              color: currentTone.color,
              border: `2px solid ${currentTone.border}`,
              boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
              userSelect: 'none',
              pointerEvents: 'none',
              ...placementStyles[placement],
            }}
          >
            {pulse && (
              <span
                style={{
                  position: 'absolute',
                  inset: -2,
                  borderRadius: '9999px',
                  backgroundColor: currentTone.bg,
                  opacity: 0.6,
                  animation: 'pui-ping 1.4s cubic-bezier(0, 0, 0.2, 1) infinite',
                  zIndex: -1,
                }}
              />
            )}
            {!dot && displayCount}
          </span>
        )}
      </div>
    );
  }
);
