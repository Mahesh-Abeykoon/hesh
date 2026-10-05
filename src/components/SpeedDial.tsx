import React, {
  forwardRef,
  useRef,
  type ReactNode,
  type HTMLAttributes,
  type ButtonHTMLAttributes,
} from 'react';
import { useControllableState } from '../hooks/useControllableState';
import { useDismiss } from '../hooks/useDismiss';
import { PlusIcon } from './icons';
import { cn } from '../utils/cn';

export interface SpeedDialActionSpec {
  icon: ReactNode;
  label: ReactNode;
  onClick?: () => void;
  tone?: 'neutral' | 'primary' | 'danger';
  disabled?: boolean;
}

export interface SpeedDialProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  direction?: 'up' | 'down' | 'left' | 'right';
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'relative';
  icon?: ReactNode;
  activeIcon?: ReactNode;
  label?: string;
  actions?: SpeedDialActionSpec[];
  children?: ReactNode;
}

export const SpeedDial = forwardRef<HTMLDivElement, SpeedDialProps>(function SpeedDial(
  {
    open: controlledOpen,
    defaultOpen = false,
    onOpenChange,
    direction = 'up',
    position = 'relative',
    icon = <PlusIcon size={20} />,
    activeIcon,
    label = 'Speed dial actions',
    actions = [],
    children,
    className,
    ...props
  },
  ref
) {
  const [isOpen, setIsOpen] = useControllableState<boolean>({
    value: controlledOpen,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });

  const rootRef = useRef<HTMLDivElement | null>(null);

  useDismiss(rootRef, isOpen, () => setIsOpen(false));

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      ref={(node) => {
        rootRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      }}
      className={cn(
        'hesh-speed-dial',
        `hesh-speed-dial--${direction}`,
        position !== 'relative' && `hesh-speed-dial--${position}`,
        isOpen && 'hesh-speed-dial--open',
        className
      )}
      {...props}
    >
      {/* Expanded Actions List */}
      <div
        className={cn(
          'hesh-speed-dial__actions',
          `hesh-speed-dial__actions--${direction}`,
          isOpen && 'hesh-speed-dial__actions--visible'
        )}
        role="menu"
        aria-hidden={!isOpen}
      >
        {actions.map((act, idx) => (
          <div
            key={idx}
            className="hesh-speed-dial__action-row"
            style={{ '--action-index': idx } as React.CSSProperties}
          >
            {act.label && (
              <span className="hesh-speed-dial__label" id={`speed-dial-label-${idx}`}>
                {act.label}
              </span>
            )}
            <button
              type="button"
              role="menuitem"
              disabled={act.disabled}
              aria-labelledby={act.label ? `speed-dial-label-${idx}` : undefined}
              aria-label={typeof act.label === 'string' ? act.label : undefined}
              className={cn(
                'hesh-speed-dial__action-btn',
                act.tone && `hesh-speed-dial__action-btn--${act.tone}`
              )}
              onClick={() => {
                act.onClick?.();
                setIsOpen(false);
              }}
            >
              {act.icon}
            </button>
          </div>
        ))}
        {children}
      </div>

      {/* Main Trigger FAB */}
      <button
        type="button"
        aria-label={label}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        onClick={toggleOpen}
        className={cn(
          'hesh-speed-dial__trigger',
          isOpen && 'hesh-speed-dial__trigger--active'
        )}
      >
        <span
          className={cn(
            'hesh-speed-dial__icon-holder',
            isOpen && !activeIcon && 'hesh-speed-dial__icon-holder--rotated'
          )}
        >
          {isOpen && activeIcon ? activeIcon : icon}
        </span>
      </button>
    </div>
  );
});
