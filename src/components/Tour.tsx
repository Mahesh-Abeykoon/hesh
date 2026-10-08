import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  type ReactNode,
  type HTMLAttributes,
} from 'react';
import { Portal } from './Portal';
import { Button } from './Button';
import { XIcon, ChevronRightIcon, ChevronLeftIcon } from './icons';
import { cn } from '../utils/cn';

export interface TourStep {
  /** CSS selector or element query for the spotlight anchor (e.g. '#header-nav', '[data-tour="search"]') */
  target?: string | (() => HTMLElement | null);
  /** Title header for this tour step. */
  title: ReactNode;
  /** Detailed explanatory content or walkthrough guidance. */
  description: ReactNode;
  /** Preferred popover placement relative to target. Defaults to 'bottom'. */
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  /** Optional custom footer actions replacing default Previous/Next/Finish. */
  actions?: ReactNode;
  /** Optional custom icon or illustration to show at the top of the step card. */
  icon?: ReactNode;
}

export interface TourProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** The sequential array of walkthrough steps. */
  steps: TourStep[];
  /** Controlled visibility state of the tour modal. */
  open: boolean;
  /** Callback fired when the tour is closed, dismissed, or finished. */
  onClose: () => void;
  /** Controlled active step index (0-indexed). */
  current?: number;
  /** Callback fired when active step changes. */
  onChange?: (current: number) => void;
  /** Whether to render an elevated spotlight backdrop around the target. Defaults to true. */
  mask?: boolean;
  /** Whether clicking the backdrop dismisses the tour. Defaults to false. */
  maskClosable?: boolean;
  /** Custom text for finish button. Defaults to 'Get Started'. */
  finishText?: string;
}

interface TargetRect {
  top: number;
  left: number;
  width: number;
  height: number;
  bottom: number;
  right: number;
}

export function Tour({
  steps,
  open,
  onClose,
  current: controlledCurrent,
  onChange,
  mask = true,
  maskClosable = false,
  finishText = 'Get Started',
  className,
  ...rest
}: TourProps) {
  const [internalCurrent, setInternalCurrent] = useState(0);
  const activeIndex = controlledCurrent !== undefined ? controlledCurrent : internalCurrent;
  const currentStep = steps[activeIndex] || steps[0];

  const [rect, setRect] = useState<TargetRect | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const setCurrent = useCallback(
    (nextIndex: number) => {
      if (controlledCurrent === undefined) {
        setInternalCurrent(nextIndex);
      }
      onChange?.(nextIndex);
    },
    [controlledCurrent, onChange]
  );

  // Update target rect on step change or resize/scroll
  const updateRect = useCallback(() => {
    if (!open || !currentStep) {
      setRect(null);
      return;
    }

    let el: HTMLElement | null = null;
    if (typeof currentStep.target === 'function') {
      el = currentStep.target();
    } else if (typeof currentStep.target === 'string') {
      el = document.querySelector(currentStep.target);
    }

    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
      const b = el.getBoundingClientRect();
      const padding = 6;
      setRect({
        top: Math.max(0, b.top - padding),
        left: Math.max(0, b.left - padding),
        width: b.width + padding * 2,
        height: b.height + padding * 2,
        bottom: b.bottom + padding,
        right: b.right + padding,
      });
    } else {
      setRect(null);
    }
  }, [open, currentStep]);

  useEffect(() => {
    updateRect();
    window.addEventListener('resize', updateRect);
    window.addEventListener('scroll', updateRect, true);
    return () => {
      window.removeEventListener('resize', updateRect);
      window.removeEventListener('scroll', updateRect, true);
    };
  }, [updateRect]);

  // Keyboard navigation
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        if (activeIndex < steps.length - 1) setCurrent(activeIndex + 1);
      } else if (e.key === 'ArrowLeft') {
        if (activeIndex > 0) setCurrent(activeIndex - 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, activeIndex, steps.length, setCurrent, onClose]);

  if (!open || steps.length === 0 || !currentStep) return null;
  const step = currentStep;

  const isFirst = activeIndex === 0;
  const isLast = activeIndex === steps.length - 1;

  // Compute popover position relative to target rect
  const placement = step.placement || (rect ? 'bottom' : 'center');

  let popoverStyle: React.CSSProperties = {
    position: 'fixed',
    zIndex: 10001,
  };

  if (!rect || placement === 'center') {
    popoverStyle = {
      ...popoverStyle,
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
    };
  } else {
    const popoverWidth = 360;
    const margin = 14;

    if (placement === 'bottom') {
      const top = Math.min(window.innerHeight - 260, rect.bottom + margin);
      const left = Math.max(16, Math.min(window.innerWidth - popoverWidth - 16, rect.left + rect.width / 2 - popoverWidth / 2));
      popoverStyle = { ...popoverStyle, top: `${top}px`, left: `${left}px` };
    } else if (placement === 'top') {
      const top = Math.max(16, rect.top - margin - 220);
      const left = Math.max(16, Math.min(window.innerWidth - popoverWidth - 16, rect.left + rect.width / 2 - popoverWidth / 2));
      popoverStyle = { ...popoverStyle, top: `${top}px`, left: `${left}px` };
    } else if (placement === 'left') {
      const top = Math.max(16, Math.min(window.innerHeight - 240, rect.top + rect.height / 2 - 100));
      const left = Math.max(16, rect.left - popoverWidth - margin);
      popoverStyle = { ...popoverStyle, top: `${top}px`, left: `${left}px` };
    } else if (placement === 'right') {
      const top = Math.max(16, Math.min(window.innerHeight - 240, rect.top + rect.height / 2 - 100));
      const left = Math.min(window.innerWidth - popoverWidth - 16, rect.right + margin);
      popoverStyle = { ...popoverStyle, top: `${top}px`, left: `${left}px` };
    }
  }

  return (
    <Portal>
      {/* Mask with SVG cutout spotlight */}
      {mask && (
        <div
          onClick={maskClosable ? onClose : undefined}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10000,
            pointerEvents: maskClosable ? 'auto' : 'none',
          }}
        >
          <svg
            width="100%"
            height="100%"
            style={{
              position: 'fixed',
              inset: 0,
              width: '100vw',
              height: '100vh',
              pointerEvents: 'none',
            }}
          >
            <defs>
              <mask id="pui-tour-mask">
                <rect x="0" y="0" width="100%" height="100%" fill="#fff" />
                {rect && (
                  <rect
                    x={rect.left}
                    y={rect.top}
                    width={rect.width}
                    height={rect.height}
                    rx="8"
                    ry="8"
                    fill="#000"
                  />
                )}
              </mask>
            </defs>
            <rect
              x="0"
              y="0"
              width="100%"
              height="100%"
              fill="rgba(0, 0, 0, 0.65)"
              mask="url(#pui-tour-mask)"
            />
          </svg>

          {/* Glowing ring around spotlight target */}
          {rect && (
            <div
              style={{
                position: 'fixed',
                top: `${rect.top}px`,
                left: `${rect.left}px`,
                width: `${rect.width}px`,
                height: `${rect.height}px`,
                borderRadius: '8px',
                boxShadow: '0 0 0 2px var(--pui-primary, #6366f1), 0 0 20px rgba(99, 102, 241, 0.35)',
                pointerEvents: 'none',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            />
          )}
        </div>
      )}

      {/* Popover Step Card */}
      <div
        ref={popoverRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="pui-tour-title"
        className={cn('pui-tour-card', className)}
        style={{
          ...popoverStyle,
          width: '360px',
          maxWidth: 'calc(100vw - 32px)',
          background: 'var(--pui-surface, #ffffff)',
          color: 'var(--pui-fg, #0f172a)',
          border: '1px solid var(--pui-border, #e2e8f0)',
          borderRadius: 'var(--pui-radius-lg, 12px)',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.875rem',
          animation: 'pui-tour-pop 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        {...rest}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            {step.icon && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '2rem',
                  height: '2rem',
                  borderRadius: 'var(--pui-radius-md, 8px)',
                  background: 'var(--pui-primary-subtle, rgba(99, 102, 241, 0.1))',
                  color: 'var(--pui-primary, #6366f1)',
                  flexShrink: 0,
                }}
              >
                {step.icon}
              </span>
            )}
            <h3
              id="pui-tour-title"
              style={{
                margin: 0,
                fontSize: '1rem',
                fontWeight: 600,
                color: 'var(--pui-fg, #0f172a)',
                lineHeight: 1.3,
              }}
            >
              {step.title}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close tour"
            style={{
              background: 'none',
              border: 'none',
              padding: '0.25rem',
              color: 'var(--pui-fg-muted, #64748b)',
              cursor: 'pointer',
              borderRadius: 'var(--pui-radius-sm, 4px)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <XIcon size={16} />
          </button>
        </div>

        {/* Body content */}
        <div
          style={{
            fontSize: '0.875rem',
            color: 'var(--pui-fg-muted, #475569)',
            lineHeight: 1.5,
          }}
        >
          {step.description}
        </div>

        {/* Footer actions */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '0.5rem',
            borderTop: '1px solid var(--pui-border, #f1f5f9)',
            marginTop: '0.25rem',
          }}
        >
          {/* Step dots */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            {steps.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrent(i)}
                aria-label={`Jump to step ${i + 1}`}
                style={{
                  width: i === activeIndex ? '1.25rem' : '0.375rem',
                  height: '0.375rem',
                  borderRadius: '9999px',
                  background:
                    i === activeIndex
                      ? 'var(--pui-primary, #6366f1)'
                      : 'var(--pui-border-strong, #cbd5e1)',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              />
            ))}
            <span
              style={{
                marginLeft: '0.375rem',
                fontSize: '0.75rem',
                fontWeight: 500,
                color: 'var(--pui-fg-muted, #94a3b8)',
              }}
            >
              {activeIndex + 1}/{steps.length}
            </span>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {!isFirst && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrent(activeIndex - 1)}
              >
                <ChevronLeftIcon size={14} /> Back
              </Button>
            )}

            {isLast ? (
              <Button
                variant="primary"
                size="sm"
                onClick={onClose}
              >
                {finishText}
              </Button>
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setCurrent(activeIndex + 1)}
              >
                Next <ChevronRightIcon size={14} />
              </Button>
            )}
          </div>
        </div>
      </div>
    </Portal>
  );
}
