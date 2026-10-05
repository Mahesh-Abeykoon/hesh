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
import { CheckIcon } from './icons';
import type { MenuEntry } from './Menu';

export interface ContextMenuProps extends HTMLAttributes<HTMLDivElement> {
  /** Array of menu items, checkboxes, separators, or section labels. */
  items: readonly MenuEntry[];
  /** Elements that act as the right-click trigger area. */
  children: ReactNode;
  /** Whether the context menu is disabled. */
  disabled?: boolean;
  /** Optional custom class for the floating menu panel. */
  menuClassName?: string;
}

const isFocusable = (entry: MenuEntry) =>
  (entry.kind === 'item' && !entry.disabled) ||
  (entry.kind === 'checkbox' && !entry.disabled);

/**
 * ContextMenu displays a floating menu when triggered by right-click or long-press.
 * Fully keyboard accessible and handles viewport collision on desktop and mobile.
 */
export function ContextMenu({
  items,
  children,
  disabled = false,
  className,
  menuClassName,
  ...props
}: ContextMenuProps) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [activeIndex, setActiveIndex] = useState(-1);
  const menuId = useId();
  const menuRef = useRef<HTMLDivElement | null>(null);
  const touchTimerRef = useRef<number | null>(null);

  const focusableIndexes = items
    .map((e, i) => (isFocusable(e) ? i : -1))
    .filter((i) => i >= 0);

  const close = useCallback(() => {
    setOpen(false);
    setActiveIndex(-1);
  }, []);

  useDismiss(menuRef, open, close);

  const openAt = useCallback((clientX: number, clientY: number) => {
    // Dynamic viewport bounding tailored for mobile and desktop screens
    const menuWidth = Math.min(220, window.innerWidth - 24);
    const menuHeight = Math.min(300, window.innerHeight - 24);
    const maxX = Math.max(12, window.innerWidth - menuWidth - 12);
    const maxY = Math.max(12, window.innerHeight - menuHeight - 12);

    const x = Math.max(12, Math.min(clientX, maxX));
    const y = Math.max(12, Math.min(clientY, maxY));

    setPosition({ x, y });
    setOpen(true);
    setActiveIndex(-1);
  }, []);

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
    }, 550);
  };

  const handleTouchEnd = () => {
    if (touchTimerRef.current) {
      window.clearTimeout(touchTimerRef.current);
      touchTimerRef.current = null;
    }
  };

  // Keyboard navigation within menu
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIdx = focusableIndexes.findIndex((i) => i > activeIndex);
      setActiveIndex(nextIdx >= 0 ? focusableIndexes[nextIdx]! : focusableIndexes[0] ?? -1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndexes = focusableIndexes.filter((i) => i < activeIndex);
      setActiveIndex(
        prevIndexes.length > 0
          ? prevIndexes[prevIndexes.length - 1]!
          : focusableIndexes[focusableIndexes.length - 1] ?? -1
      );
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const activeEntry = items[activeIndex];
      if (activeEntry) {
        if (activeEntry.kind === 'item' && !activeEntry.disabled) {
          activeEntry.onSelect?.();
          close();
        } else if (activeEntry.kind === 'checkbox' && !activeEntry.disabled) {
          activeEntry.onCheckedChange(!activeEntry.checked);
        }
      }
    } else if (e.key === 'Escape') {
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
            className={cn('pui-menu', 'pui-context-menu', menuClassName)}
            style={{
              position: 'fixed',
              left: `${position.x}px`,
              top: `${position.y}px`,
              zIndex: 'var(--pui-z-dropdown, 1000)',
            }}
          >
            {items.map((entry, index) => {
              if (entry.kind === 'separator') {
                return <div key={entry.id ?? `sep-${index}`} className="pui-menu__separator" role="separator" />;
              }

              if (entry.kind === 'label') {
                return (
                  <div key={entry.id ?? `lbl-${index}`} className="pui-menu__label">
                    {entry.label}
                  </div>
                );
              }

              if (entry.kind === 'checkbox') {
                return (
                  <button
                    key={entry.id ?? `chk-${index}`}
                    type="button"
                    role="menuitemcheckbox"
                    aria-checked={entry.checked}
                    disabled={entry.disabled}
                    data-index={index}
                    tabIndex={index === activeIndex ? 0 : -1}
                    className={cn(
                      'pui-menu__item',
                      'pui-menu__item--checkbox',
                      index === activeIndex && 'pui-menu__item--active'
                    )}
                    onClick={() => {
                      if (!entry.disabled) {
                        entry.onCheckedChange(!entry.checked);
                      }
                    }}
                  >
                    <span className="pui-menu__check" aria-hidden="true">
                      {entry.checked && <CheckIcon size={14} />}
                    </span>
                    <span className="pui-menu__text">{entry.label}</span>
                  </button>
                );
              }

              return (
                <button
                  key={entry.id ?? `item-${index}`}
                  type="button"
                  role="menuitem"
                  disabled={entry.disabled}
                  data-index={index}
                  tabIndex={index === activeIndex ? 0 : -1}
                  className={cn(
                    'pui-menu__item',
                    entry.tone === 'danger' && 'pui-menu__item--danger',
                    index === activeIndex && 'pui-menu__item--active'
                  )}
                  onClick={() => {
                    if (!entry.disabled) {
                      entry.onSelect?.();
                      close();
                    }
                  }}
                >
                  {entry.icon && <span className="pui-menu__icon">{entry.icon}</span>}
                  <span className="pui-menu__text">{entry.label}</span>
                  {entry.shortcut && <kbd className="pui-menu__shortcut">{entry.shortcut}</kbd>}
                </button>
              );
            })}
          </div>
        </Portal>
      )}
    </div>
  );
}
