import React, {
  createContext,
  useContext,
  useState,
  useRef,
  forwardRef,
  type ReactNode,
  type HTMLAttributes,
  type ButtonHTMLAttributes,
  type AnchorHTMLAttributes,
} from 'react';
import { ChevronDownIcon } from './icons';
import { useDismiss } from '../hooks/useDismiss';
import { cn } from '../utils/cn';

interface NavigationMenuContextValue {
  activeItem: string | null;
  setActiveItem: (id: string | null) => void;
}

const NavigationMenuContext = createContext<NavigationMenuContextValue | null>(null);

export interface NavigationMenuProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
}

export const NavigationMenu = forwardRef<HTMLElement, NavigationMenuProps>(function NavigationMenu(
  { children, className, ...props },
  ref
) {
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const containerRef = useRef<HTMLElement | null>(null);

  useDismiss(containerRef, activeItem !== null, () => setActiveItem(null));

  return (
    <NavigationMenuContext.Provider value={{ activeItem, setActiveItem }}>
      <nav
        ref={(node) => {
          containerRef.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
        }}
        aria-label="Main Navigation"
        className={cn('hesh-nav-menu', className)}
        {...props}
      >
        {children}
      </nav>
    </NavigationMenuContext.Provider>
  );
});

export interface NavigationMenuListProps extends HTMLAttributes<HTMLUListElement> {
  children?: ReactNode;
}

export const NavigationMenuList = forwardRef<HTMLUListElement, NavigationMenuListProps>(
  function NavigationMenuList({ children, className, ...props }, ref) {
    return (
      <ul ref={ref} role="menubar" className={cn('hesh-nav-menu__list', className)} {...props}>
        {children}
      </ul>
    );
  }
);

export interface NavigationMenuItemProps extends HTMLAttributes<HTMLLIElement> {
  value?: string;
  children?: ReactNode;
}

export const NavigationMenuItem = forwardRef<HTMLLIElement, NavigationMenuItemProps>(
  function NavigationMenuItem({ value, children, className, ...props }, ref) {
    return (
      <li ref={ref} role="none" className={cn('hesh-nav-menu__item', className)} {...props}>
        {children}
      </li>
    );
  }
);

export interface NavigationMenuTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  children?: ReactNode;
}

export const NavigationMenuTrigger = forwardRef<HTMLButtonElement, NavigationMenuTriggerProps>(
  function NavigationMenuTrigger({ value, children, className, onClick, ...props }, ref) {
    const ctx = useContext(NavigationMenuContext);
    const isOpen = ctx?.activeItem === value;

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      ctx?.setActiveItem(isOpen ? null : value);
      onClick?.(e);
    };

    return (
      <button
        ref={ref}
        type="button"
        role="menuitem"
        aria-haspopup="true"
        aria-expanded={isOpen}
        onClick={handleClick}
        className={cn(
          'hesh-nav-menu__trigger',
          isOpen && 'hesh-nav-menu__trigger--open',
          className
        )}
        {...props}
      >
        <span>{children}</span>
        <ChevronDownIcon
          size={14}
          className={cn(
            'hesh-nav-menu__chevron',
            isOpen && 'hesh-nav-menu__chevron--rotated'
          )}
        />
      </button>
    );
  }
);

export interface NavigationMenuContentProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
  children?: ReactNode;
}

export const NavigationMenuContent = forwardRef<HTMLDivElement, NavigationMenuContentProps>(
  function NavigationMenuContent({ value, children, className, ...props }, ref) {
    const ctx = useContext(NavigationMenuContext);
    const isOpen = ctx?.activeItem === value;

    if (!isOpen) return null;

    return (
      <div
        ref={ref}
        role="region"
        className={cn('hesh-nav-menu__content', className)}
        {...props}
      >
        <div className="hesh-nav-menu__content-inner">{children}</div>
      </div>
    );
  }
);

export interface NavigationMenuLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  title?: string;
  description?: ReactNode;
  icon?: ReactNode;
  badge?: ReactNode;
  active?: boolean;
}

export const NavigationMenuLink = forwardRef<HTMLAnchorElement, NavigationMenuLinkProps>(
  function NavigationMenuLink(
    { title, description, icon, badge, active, children, className, ...props },
    ref
  ) {
    return (
      <a
        ref={ref}
        role="menuitem"
        className={cn(
          'hesh-nav-menu__link',
          active && 'hesh-nav-menu__link--active',
          className
        )}
        {...props}
      >
        {icon && <div className="hesh-nav-menu__link-icon">{icon}</div>}
        <div className="hesh-nav-menu__link-text">
          {title && (
            <div className="hesh-nav-menu__link-title">
              {title}
              {badge && <span className="hesh-nav-menu__link-badge">{badge}</span>}
            </div>
          )}
          {description && <div className="hesh-nav-menu__link-desc">{description}</div>}
          {children}
        </div>
      </a>
    );
  }
);
