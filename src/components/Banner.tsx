import React, { forwardRef, useState, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../utils/cn';
import { XIcon, PaletteIcon, AlertCircleIcon, CheckCircleIcon, InfoIcon } from './icons';

export type BannerTone = 'primary' | 'info' | 'success' | 'warning' | 'danger' | 'promo';

export interface BannerProps extends HTMLAttributes<HTMLDivElement> {
  /** Visual theme of the banner. */
  tone?: BannerTone;
  /** Custom leading icon. If not provided, an appropriate default is used. */
  icon?: ReactNode;
  /** Whether the banner includes a dismiss close button. */
  dismissible?: boolean;
  /** Callback fired when the user clicks the close button. */
  onDismiss?: () => void;
  /** Action element (e.g., CTA button or link). */
  action?: ReactNode;
  /** Controls visibility for controlled state. Defaults to uncontrolled internal state. */
  visible?: boolean;
  /** Content to display inside the banner. */
  children: ReactNode;
}

const DEFAULT_ICONS: Record<BannerTone, ReactNode> = {
  primary: <InfoIcon size={16} aria-hidden="true" />,
  info: <InfoIcon size={16} aria-hidden="true" />,
  success: <CheckCircleIcon size={16} aria-hidden="true" />,
  warning: <AlertCircleIcon size={16} aria-hidden="true" />,
  danger: <AlertCircleIcon size={16} aria-hidden="true" />,
  promo: <PaletteIcon size={16} aria-hidden="true" />,
};

/**
 * Banner highlights critical announcements, system status, or promotional updates.
 * Completely responsive on mobile, tablet, and desktop viewports.
 */
export const Banner = forwardRef<HTMLDivElement, BannerProps>(
  (
    {
      tone = 'primary',
      icon,
      dismissible = false,
      onDismiss,
      action,
      visible,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const [internalOpen, setInternalOpen] = useState(true);
    const isOpen = visible !== undefined ? visible : internalOpen;

    if (!isOpen) return null;

    const handleDismiss = () => {
      setInternalOpen(false);
      onDismiss?.();
    };

    const leadingIcon = icon !== undefined ? icon : DEFAULT_ICONS[tone];

    return (
      <aside
        ref={ref}
        role="region"
        aria-label="Announcement"
        className={cn('pui-banner', `pui-banner--${tone}`, className)}
        {...props}
      >
        <div className="pui-banner__container">
          <div className="pui-banner__content">
            {leadingIcon && <span className="pui-banner__icon">{leadingIcon}</span>}
            <div className="pui-banner__message">{children}</div>
          </div>

          <div className="pui-banner__actions">
            {action && <div className="pui-banner__action">{action}</div>}
            {dismissible && (
              <button
                type="button"
                className="pui-banner__dismiss"
                onClick={handleDismiss}
                aria-label="Dismiss banner"
              >
                <XIcon size={16} />
              </button>
            )}
          </div>
        </div>
      </aside>
    );
  }
);

Banner.displayName = 'Banner';
