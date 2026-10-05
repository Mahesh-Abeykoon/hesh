import {
  forwardRef,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
  type MouseEvent as ReactMouseEvent,
} from 'react';
import { cn } from '../utils/cn';

export interface DockProps extends HTMLAttributes<HTMLDivElement> {
  /** Maximum icon size on magnification (px). @default 56 */
  magnification?: number;
  /** Distance around cursor to apply magnification (px). @default 120 */
  distance?: number;
  /** Visual variant. @default 'glass' */
  variant?: 'glass' | 'solid' | 'subtle';
  children: ReactNode;
}

/**
 * Dock provides a floating macOS-style action bar with smooth cursor magnification
 * and glassmorphic elevated backdrop.
 */
export const Dock = forwardRef<HTMLDivElement, DockProps>(function Dock(
  {
    magnification = 52,
    distance = 100,
    variant = 'glass',
    className,
    children,
    ...props
  },
  ref
) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [mouseX, setMouseX] = useState<number | null>(null);

  const handleMouseMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    setMouseX(e.clientX);
  };

  const handleMouseLeave = () => {
    setMouseX(null);
  };

  return (
    <div
      ref={(node) => {
        containerRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as any).current = node;
      }}
      role="toolbar"
      aria-label="Floating action dock"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        'pui-dock',
        `pui-dock--${variant}`,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Dock.displayName = 'Dock';

export interface DockIconProps extends HTMLAttributes<HTMLButtonElement> {
  /** Accessible label and tooltip title. */
  label: string;
  /** Whether the dock item is active. */
  active?: boolean;
  children: ReactNode;
}

export const DockIcon = forwardRef<HTMLButtonElement, DockIconProps>(function DockIcon(
  { label, active = false, className, children, onClick, ...props },
  ref
) {
  return (
    <button
      ref={ref}
      type="button"
      aria-label={label}
      title={label}
      data-active={active || undefined}
      onClick={onClick}
      className={cn('pui-dock__icon', active && 'pui-dock__icon--active', className)}
      {...props}
    >
      <span className="pui-dock__icon-content">{children}</span>
      {active && <span className="pui-dock__dot" aria-hidden="true" />}
    </button>
  );
});

DockIcon.displayName = 'DockIcon';
