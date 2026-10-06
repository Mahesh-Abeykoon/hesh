import React, {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
  type MouseEvent,
  type TouchEvent,
} from 'react';
import { cn } from '../utils/cn';
import { Portal } from './Portal';
import { useDismiss } from '../hooks/useDismiss';
import { CheckIcon, ChevronRightIcon } from './icons';
import { isFocusableMenuEntry, type MenuEntry } from './Menu';

export interface ContextMenuProps extends HTMLAttributes<HTMLDivElement> {
  /** Array of menu items, checkboxes, radios, submenus, separators, or section labels. */
  items: readonly MenuEntry[];
  /** Elements that act as the right-click trigger area. */
  children: ReactNode;
  /** Whether the context menu is disabled. */
  disabled?: boolean;
  /** Size scale of the menu panel. @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  /** Optional custom class for the floating menu panel. */
  menuClassName?: string;
}

/**
 * ContextMenu displays a floating menu when triggered by right-click or long-press.
 * Fully keyboard accessible, supports cascading submenus, checkboxes, radios,
 * and handles viewport collisions on desktop and mobile screens.
 */
export function ContextMenu({
  items,
  children,
  disabled = false,
  size = 'md',
  className,
  menuClassName,
  ...props
}: ContextMenuProps) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [activeIndex, setActiveIndex] = useState(-1);
  const [openSubmenuIndex, setOpenSubmenuIndex] = useState<number | null>(null);

  const menuId = useId();
  const menuRef = useRef<HTMLDivElement | null>(null);
  const touchTimerRef = useRef<number | null>(null);
  const itemElementsRef = useRef<Map<number, HTMLElement>>(new Map());

  const focusableIndexes = items
    .map((e, i) => (isFocusableMenuEntry(e) ? i : -1))
    .filter((i) => i >= 0);

  const close = useCallback(() => {
    setOpen(false);
    setActiveIndex(-1);
    setOpenSubmenuIndex(null);
  }, []);

  useDismiss(menuRef, open, close);

  const openAt = useCallback((clientX: number, clientY: number) => {
    const menuWidth = size === 'sm' ? 190 : size === 'lg' ? 260 : 220;
    const menuHeight = Math.min(items.length * 38 + 24, 380);
    const maxX = Math.max(12, window.innerWidth - menuWidth - 12);
    const maxY = Math.max(12, window.innerHeight - menuHeight - 12);

    const x = Math.max(12, Math.min(clientX, maxX));
    const y = Math.max(12, Math.min(clientY, maxY));

    setPosition({ x, y });
    setOpen(true);
    setActiveIndex(0);
    setOpenSubmenuIndex(null);
  }, [items.length, size]);

  const handleContextMenu = (e: MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    e.preventDefault();
    openAt(e.clientX, e.clientY);
  };

  // Support mobile long press (500ms)
  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    if (disabled) return;
    const touch = e.touches[0];
    if (!touch) return;
    const { clientX, clientY } = touch;

    touchTimerRef.current = window.setTimeout(() => {
      openAt(clientX, clientY);
    }, 500);
  };

  const handleTouchEnd = () => {
    if (touchTimerRef.current) {
      window.clearTimeout(touchTimerRef.current);
      touchTimerRef.current = null;
    }
  };

  // Keyboard navigation within root context menu
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) return;
    const activeEntry = items[activeIndex];

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIdx = focusableIndexes.findIndex((i) => i > activeIndex);
      setActiveIndex(nextIdx >= 0 ? focusableIndexes[nextIdx]! : focusableIndexes[0] ?? -1);
      setOpenSubmenuIndex(null);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndexes = focusableIndexes.filter((i) => i < activeIndex);
      setActiveIndex(
        prevIndexes.length > 0
          ? prevIndexes[prevIndexes.length - 1]!
          : focusableIndexes[focusableIndexes.length - 1] ?? -1
      );
      setOpenSubmenuIndex(null);
    } else if (e.key === 'ArrowRight') {
      if (activeEntry && activeEntry.kind === 'submenu' && !activeEntry.disabled) {
        e.preventDefault();
        setOpenSubmenuIndex(activeIndex);
      }
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!activeEntry) return;
      if (activeEntry.kind === 'submenu' && !activeEntry.disabled) {
        setOpenSubmenuIndex(activeIndex);
      } else if (activeEntry.kind === 'item' && !activeEntry.disabled) {
        activeEntry.onSelect?.();
        close();
      } else if (activeEntry.kind === 'checkbox' && !activeEntry.disabled) {
        activeEntry.onCheckedChange(!activeEntry.checked);
      } else if (activeEntry.kind === 'radio' && !activeEntry.disabled) {
        activeEntry.onSelect?.(activeEntry.value);
        close();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      close();
    }
  };

  // Focus active item
  useEffect(() => {
    if (open && activeIndex >= 0 && menuRef.current) {
      const itemsElements = menuRef.current.querySelectorAll<HTMLElement>('[role^="menuitem"]');
      const target = Array.from(itemsElements).find(
        (el) => el.getAttribute('data-index') === String(activeIndex)
      );
      target?.focus();
    }
  }, [open, activeIndex]);

  return (
    <div
      className={cn('pui-context-menu-trigger', className)}
      onContextMenu={handleContextMenu}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchEnd}
      {...props}
    >
      {children}

      {open && (
        <Portal>
          <div
            ref={menuRef}
            id={menuId}
            role="menu"
            aria-orientation="vertical"
            tabIndex={-1}
            onKeyDown={handleKeyDown}
            className={cn(
              'pui-menu',
              'pui-context-menu',
              `pui-menu--${size}`,
              menuClassName
            )}
            style={{
              position: 'fixed',
              left: `${position.x}px`,
              top: `${position.y}px`,
              zIndex: 'var(--pui-z-popover, 1300)',
            }}
          >
            {items.map((entry, index) => {
              const key = entry.id ?? `ctx-${index}`;

              if (entry.kind === 'separator') {
                return <div key={key} className="pui-menu__separator" role="separator" />;
              }

              if (entry.kind === 'label') {
                return (
                  <div key={key} className="pui-menu__label">
                    {entry.label}
                  </div>
                );
              }

              if (entry.kind === 'checkbox') {
                return (
                  <div
                    key={key}
                    role="menuitemcheckbox"
                    aria-checked={entry.checked}
                    aria-disabled={entry.disabled || undefined}
                    data-disabled={entry.disabled ? 'true' : undefined}
                    data-active={index === activeIndex ? 'true' : undefined}
                    data-index={index}
                    tabIndex={index === activeIndex ? 0 : -1}
                    className={cn(
                      'pui-menu__item',
                      entry.inset && 'pui-menu__item--inset'
                    )}
                    onClick={() => {
                      if (!entry.disabled) {
                        entry.onCheckedChange(!entry.checked);
                      }
                    }}
                    onMouseEnter={() => {
                      if (!entry.disabled) {
                        setActiveIndex(index);
                        setOpenSubmenuIndex(null);
                      }
                    }}
                  >
                    <span className="pui-menu__checkbox" aria-hidden="true">
                      {entry.checked && <CheckIcon size={14} />}
                    </span>
                    <div className="pui-menu__item__body">
                      <div className="pui-menu__item__title">{entry.label}</div>
                      {entry.description && (
                        <div className="pui-menu__item__desc">{entry.description}</div>
                      )}
                    </div>
                  </div>
                );
              }

              if (entry.kind === 'radio') {
                return (
                  <div
                    key={key}
                    role="menuitemradio"
                    aria-checked={entry.checked}
                    aria-disabled={entry.disabled || undefined}
                    data-disabled={entry.disabled ? 'true' : undefined}
                    data-active={index === activeIndex ? 'true' : undefined}
                    data-index={index}
                    tabIndex={index === activeIndex ? 0 : -1}
                    className={cn(
                      'pui-menu__item',
                      entry.inset && 'pui-menu__item--inset'
                    )}
                    onClick={() => {
                      if (!entry.disabled) {
                        entry.onSelect?.(entry.value);
                        close();
                      }
                    }}
                    onMouseEnter={() => {
                      if (!entry.disabled) {
                        setActiveIndex(index);
                        setOpenSubmenuIndex(null);
                      }
                    }}
                  >
                    <span className="pui-menu__radio" aria-hidden="true">
                      {entry.checked && <span className="pui-menu__radio-bullet" />}
                    </span>
                    <div className="pui-menu__item__body">
                      <div className="pui-menu__item__title">{entry.label}</div>
                      {entry.description && (
                        <div className="pui-menu__item__desc">{entry.description}</div>
                      )}
                    </div>
                  </div>
                );
              }

              if (entry.kind === 'submenu') {
                const isSubOpen = openSubmenuIndex === index;
                return (
                  <div
                    key={key}
                    ref={(el) => {
                      if (el) itemElementsRef.current.set(index, el);
                      else itemElementsRef.current.delete(index);
                    }}
                    role="menuitem"
                    aria-haspopup="menu"
                    aria-expanded={isSubOpen}
                    aria-disabled={entry.disabled || undefined}
                    data-disabled={entry.disabled ? 'true' : undefined}
                    data-active={index === activeIndex || isSubOpen ? 'true' : undefined}
                    data-index={index}
                    tabIndex={index === activeIndex ? 0 : -1}
                    className={cn(
                      'pui-menu__item',
                      'pui-menu__submenu-trigger',
                      entry.inset && 'pui-menu__item--inset'
                    )}
                    onClick={() => {
                      if (!entry.disabled) {
                        setOpenSubmenuIndex((prev) => (prev === index ? null : index));
                      }
                    }}
                    onMouseEnter={() => {
                      if (!entry.disabled) {
                        setActiveIndex(index);
                        setOpenSubmenuIndex(index);
                      }
                    }}
                  >
                    {entry.icon && <span className="pui-menu__item__icon">{entry.icon}</span>}
                    <div className="pui-menu__item__body">
                      <div className="pui-menu__item__title">{entry.label}</div>
                      {entry.description && (
                        <div className="pui-menu__item__desc">{entry.description}</div>
                      )}
                    </div>
                    <span className="pui-menu__chevron" aria-hidden="true">
                      <ChevronRightIcon size={14} />
                    </span>
                  </div>
                );
              }

              return (
                <div
                  key={key}
                  role="menuitem"
                  aria-disabled={entry.disabled || undefined}
                  data-disabled={entry.disabled ? 'true' : undefined}
                  data-active={index === activeIndex ? 'true' : undefined}
                  data-index={index}
                  tabIndex={index === activeIndex ? 0 : -1}
                  className={cn(
                    'pui-menu__item',
                    entry.tone === 'danger' && 'pui-menu__item--danger',
                    entry.inset && 'pui-menu__item--inset'
                  )}
                  onClick={() => {
                    if (!entry.disabled) {
                      entry.onSelect?.();
                      close();
                    }
                  }}
                  onMouseEnter={() => {
                    if (!entry.disabled) {
                      setActiveIndex(index);
                      setOpenSubmenuIndex(null);
                    }
                  }}
                >
                  {entry.icon && <span className="pui-menu__item__icon">{entry.icon}</span>}
                  <div className="pui-menu__item__body">
                    <div className="pui-menu__item__title">{entry.label}</div>
                    {entry.description && (
                      <div className="pui-menu__item__desc">{entry.description}</div>
                    )}
                  </div>
                  {entry.shortcut && (
                    <span className="pui-menu__item__shortcut">{entry.shortcut}</span>
                  )}
                </div>
              );
            })}
          </div>
        </Portal>
      )}
    </div>
  );
}
