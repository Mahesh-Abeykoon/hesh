import React, {
  createContext,
  useContext,
  forwardRef,
  type ReactNode,
  type HTMLAttributes,
  type ButtonHTMLAttributes,
} from 'react';
import { useControllableState } from '../hooks/useControllableState';
import { cn } from '../utils/cn';

export interface BottomNavItemSpec {
  value: string;
  label: string;
  icon: ReactNode;
  badge?: ReactNode;
  disabled?: boolean;
}

export interface BottomNavContextValue {
  value: string | undefined;
  setValue: (val: string) => void;
  labelVisibility: 'always' | 'selected' | 'never';
}

const BottomNavContext = createContext<BottomNavContextValue | null>(null);

export interface BottomNavProps extends Omit<HTMLAttributes<HTMLElement>, 'onChange'> {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  items?: BottomNavItemSpec[];
  children?: ReactNode;
  position?: 'fixed' | 'sticky' | 'relative';
  bordered?: boolean;
  glass?: boolean;
  labelVisibility?: 'always' | 'selected' | 'never';
}

export const BottomNav = forwardRef<HTMLElement, BottomNavProps>(function BottomNav(
  {
    value: controlledValue,
    defaultValue,
    onChange,
    items,
    children,
    position = 'relative',
    bordered = true,
    glass = true,
    labelVisibility = 'always',
    className,
    ...props
  },
  ref
) {
  const [activeValue, setActiveValue] = useControllableState<string>({
    value: controlledValue,
    defaultValue: defaultValue ?? items?.[0]?.value ?? '',
    onChange,
  });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      const buttons = Array.from(e.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]:not([disabled])'));
      const currentIndex = buttons.findIndex((btn) => btn === document.activeElement);
      if (currentIndex === -1) return;
      const nextIndex =
        e.key === 'ArrowRight'
          ? (currentIndex + 1) % buttons.length
          : (currentIndex - 1 + buttons.length) % buttons.length;
      buttons[nextIndex]?.focus();
      buttons[nextIndex]?.click();
      e.preventDefault();
    }
  };

  return (
    <BottomNavContext.Provider value={{ value: activeValue, setValue: setActiveValue, labelVisibility }}>
      <nav
        ref={ref}
        role="tablist"
        aria-label="Bottom Navigation"
        onKeyDown={handleKeyDown}
        className={cn(
          'hesh-bottom-nav',
          `hesh-bottom-nav--${position}`,
          bordered && 'hesh-bottom-nav--bordered',
          glass && 'hesh-bottom-nav--glass',
          className
        )}
        {...props}
      >
        <div className="hesh-bottom-nav__track">
          {items
            ? items.map((item) => (
                <BottomNavItem
                  key={item.value}
                  value={item.value}
                  label={item.label}
                  icon={item.icon}
                  badge={item.badge}
                  disabled={item.disabled}
                />
              ))
            : children}
        </div>
      </nav>
    </BottomNavContext.Provider>
  );
});

export interface BottomNavItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  label: string;
  icon: ReactNode;
  badge?: ReactNode;
}

export const BottomNavItem = forwardRef<HTMLButtonElement, BottomNavItemProps>(function BottomNavItem(
  { value, label, icon, badge, disabled, className, onClick, ...props },
  ref
) {
  const ctx = useContext(BottomNavContext);
  const isSelected = ctx?.value === value;
  const labelVisibility = ctx?.labelVisibility ?? 'always';

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    ctx?.setValue(value);
    onClick?.(e);
  };

  const showLabel =
    labelVisibility === 'always' || (labelVisibility === 'selected' && isSelected);

  return (
    <button
      ref={ref}
      type="button"
      role="tab"
      aria-selected={isSelected}
      aria-label={label}
      tabIndex={isSelected ? 0 : -1}
      disabled={disabled}
      onClick={handleClick}
      className={cn(
        'hesh-bottom-nav__item',
        isSelected && 'hesh-bottom-nav__item--active',
        disabled && 'hesh-bottom-nav__item--disabled',
        className
      )}
      {...props}
    >
      <div className="hesh-bottom-nav__icon-wrap">
        {icon}
        {badge !== undefined && badge !== false && (
          <span className="hesh-bottom-nav__badge">{badge === true ? null : badge}</span>
        )}
      </div>
      {showLabel && <span className="hesh-bottom-nav__label">{label}</span>}
      {isSelected && <span className="hesh-bottom-nav__indicator" aria-hidden="true" />}
    </button>
  );
});
