import React, {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { cn } from '../utils/cn';
import { Portal } from './Portal';
import { useFloating } from '../hooks/useFloating';
import { useDismiss } from '../hooks/useDismiss';
import { CheckIcon, ChevronRightIcon } from './icons';

export interface MenuItemSpec {
  id?: string;
  label: ReactNode;
  icon?: ReactNode;
  shortcut?: string;
  disabled?: boolean;
  tone?: 'default' | 'danger';
  inset?: boolean;
  description?: ReactNode;
  onSelect?: () => void;
}

export interface MenuCheckboxSpec {
  id?: string;
  label: ReactNode;
  checked: boolean;
  disabled?: boolean;
  inset?: boolean;
  description?: ReactNode;
  onCheckedChange: (checked: boolean) => void;
}

export interface MenuRadioSpec {
  id?: string;
  label: ReactNode;
  value: string;
  group?: string;
  checked?: boolean;
  disabled?: boolean;
  inset?: boolean;
  description?: ReactNode;
  onSelect?: (value: string) => void;
}

export interface MenuSubmenuSpec {
  id?: string;
  label: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
  inset?: boolean;
  description?: ReactNode;
  items: readonly MenuEntry[];
}

export type MenuEntry =
  | ({ kind: 'item' } & MenuItemSpec)
  | ({ kind: 'checkbox' } & MenuCheckboxSpec)
  | ({ kind: 'radio' } & MenuRadioSpec)
  | ({ kind: 'submenu' } & MenuSubmenuSpec)
  | { kind: 'separator'; id?: string }
  | { kind: 'label'; id?: string; label: ReactNode };

export interface TriggerRenderProps {
  ref: (node: HTMLElement | null) => void;
  open: boolean;
  'aria-haspopup': 'menu';
  'aria-expanded': boolean;
  'aria-controls': string;
  onClick: () => void;
  onKeyDown: (event: React.KeyboardEvent) => void;
}

export interface DropdownMenuProps {
  items: readonly MenuEntry[];
  trigger: (props: TriggerRenderProps) => ReactNode;
  align?: 'start' | 'center' | 'end';
  placement?: 'top' | 'bottom' | 'left' | 'right';
  size?: 'sm' | 'md' | 'lg';
  arrow?: boolean;
  offset?: number;
  modal?: boolean;
  className?: string;
}

export const isFocusableMenuEntry = (entry: MenuEntry): boolean =>
  (entry.kind === 'item' && !entry.disabled) ||
  (entry.kind === 'checkbox' && !entry.disabled) ||
  (entry.kind === 'radio' && !entry.disabled) ||
  (entry.kind === 'submenu' && !entry.disabled);

interface SubmenuFloatingProps {
  items: readonly MenuEntry[];
  parentItemEl: HTMLElement | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onCloseAll: () => void;
  onCloseSubmenu: () => void;
}

/**
 * Floating child submenu panel positioned adjacent to parent menu item.
 */
function SubmenuPanel({
  items,
  parentItemEl,
  size = 'md',
  className,
  onCloseAll,
  onCloseSubmenu,
}: SubmenuFloatingProps) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [ready, setReady] = useState(false);
  const submenuId = `pui-submenu-${useId()}`;

  const focusableIndexes = items
    .map((e, idx) => (isFocusableMenuEntry(e) ? idx : -1))
    .filter((idx) => idx !== -1);

  // Position submenu to right (or left if edge collision) of parentItemEl
  useEffect(() => {
    if (!parentItemEl) return;
    const parentRect = parentItemEl.getBoundingClientRect();
    const menuWidth = size === 'sm' ? 180 : size === 'lg' ? 240 : 200;
    const gap = 4;

    let x = parentRect.right + gap;
    if (x + menuWidth > window.innerWidth - 12) {
      x = Math.max(12, parentRect.left - menuWidth - gap);
    }

    let y = parentRect.top - 4;
    const estimatedHeight = Math.min(items.length * 36 + 16, 320);
    if (y + estimatedHeight > window.innerHeight - 12) {
      y = Math.max(12, window.innerHeight - estimatedHeight - 12);
    }

    setCoords({ x, y });
    setReady(true);
    requestAnimationFrame(() => {
      panelRef.current?.focus();
    });
  }, [parentItemEl, items.length, size]);

  const move = (delta: number) => {
    if (focusableIndexes.length === 0) return;
    const currentPos = focusableIndexes.indexOf(activeIndex);
    const nextPos =
      currentPos === -1
        ? delta > 0
          ? 0
          : focusableIndexes.length - 1
        : (currentPos + delta + focusableIndexes.length) % focusableIndexes.length;
    setActiveIndex(focusableIndexes[nextPos]!);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        move(1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        move(-1);
        break;
      case 'ArrowLeft':
        e.preventDefault();
        onCloseSubmenu();
        break;
      case 'Home':
        e.preventDefault();
        setActiveIndex(focusableIndexes[0] ?? -1);
        break;
      case 'End':
        e.preventDefault();
        setActiveIndex(focusableIndexes[focusableIndexes.length - 1] ?? -1);
        break;
      case 'Escape':
        e.preventDefault();
        onCloseAll();
        break;
      case 'Enter':
      case ' ': {
        e.preventDefault();
        const entry = items[activeIndex];
        if (!entry) break;
        if (entry.kind === 'item' && !entry.disabled) {
          entry.onSelect?.();
          onCloseAll();
        } else if (entry.kind === 'checkbox' && !entry.disabled) {
          entry.onCheckedChange(!entry.checked);
        } else if (entry.kind === 'radio' && !entry.disabled) {
          entry.onSelect?.(entry.value);
          onCloseAll();
        }
        break;
      }
    }
  };

  return (
    <Portal>
      <div
        ref={panelRef}
        id={submenuId}
        role="menu"
        tabIndex={-1}
        className={cn(
          'pui-menu',
          'pui-menu--submenu',
          `pui-menu--${size}`,
          className
        )}
        style={{
          position: 'fixed',
          left: coords.x,
          top: coords.y,
          visibility: ready ? 'visible' : 'hidden',
          zIndex: 'calc(var(--pui-z-popover, 1300) + 10)',
        }}
        onKeyDown={handleKeyDown}
      >
        {items.map((entry, index) => {
          const key = entry.id ?? `sub-${index}`;

          if (entry.kind === 'separator') {
            return <div key={key} role="separator" className="pui-menu__separator" />;
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
                className={cn('pui-menu__item', entry.inset && 'pui-menu__item--inset')}
                onClick={() => {
                  if (entry.disabled) return;
                  entry.onCheckedChange(!entry.checked);
                }}
                onMouseEnter={() => !entry.disabled && setActiveIndex(index)}
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
                className={cn('pui-menu__item', entry.inset && 'pui-menu__item--inset')}
                onClick={() => {
                  if (entry.disabled) return;
                  entry.onSelect?.(entry.value);
                  onCloseAll();
                }}
                onMouseEnter={() => !entry.disabled && setActiveIndex(index)}
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

          if (entry.kind === 'item') {
            return (
              <div
                key={key}
                role="menuitem"
                aria-disabled={entry.disabled || undefined}
                data-disabled={entry.disabled ? 'true' : undefined}
                data-active={index === activeIndex ? 'true' : undefined}
                className={cn(
                  'pui-menu__item',
                  entry.tone === 'danger' && 'pui-menu__item--danger',
                  entry.inset && 'pui-menu__item--inset'
                )}
                onClick={() => {
                  if (entry.disabled) return;
                  entry.onSelect?.();
                  onCloseAll();
                }}
                onMouseEnter={() => !entry.disabled && setActiveIndex(index)}
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
          }

          return null;
        })}
      </div>
    </Portal>
  );
}

/**
 * Menu button following the WAI-ARIA Menu Button pattern.
 *
 * - Trigger keeps DOM focus; popup uses `aria-activedescendant` for screen reader announcements.
 * - Arrow keys wrap, Home/End jump, Escape closes and returns focus to trigger.
 * - Supports cascading submenus, radio groups, checkboxes, descriptions, shortcuts, and sizes.
 */
export function DropdownMenu({
  items,
  trigger,
  align = 'start',
  placement = 'bottom',
  size = 'md',
  arrow = false,
  offset = 6,
  modal = false,
  className,
}: DropdownMenuProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [typeahead, setTypeahead] = useState('');
  const [openSubmenuIndex, setOpenSubmenuIndex] = useState<number | null>(null);

  const triggerRef = useRef<HTMLElement | null>(null);
  const itemElementsRef = useRef<Map<number, HTMLElement>>(new Map());
  const submenuTimerRef = useRef<number | null>(null);
  const menuId = `pui-menu-${useId()}`;

  const { setFloating, floatingRef, coords, ready } = useFloating<HTMLDivElement>(
    triggerRef as React.RefObject<HTMLElement>,
    open,
    { placement, align, offset }
  );

  const wrapperRef = useRef<HTMLDivElement>(null);
  const close = useCallback(() => {
    setOpen(false);
    setActiveIndex(-1);
    setTypeahead('');
    setOpenSubmenuIndex(null);
  }, []);

  useDismiss(wrapperRef, open, close, { escape: true, outside: true, ignore: [floatingRef] });

  // Move DOM focus into menu on open
  useEffect(() => {
    if (!open) return;
    const raf = requestAnimationFrame(() => floatingRef.current?.focus());
    return () => cancelAnimationFrame(raf);
  }, [open, floatingRef]);

  const focusableIndexes = items
    .map((entry, index) => (isFocusableMenuEntry(entry) ? index : -1))
    .filter((index) => index !== -1);

  const move = useCallback(
    (delta: number) => {
      if (focusableIndexes.length === 0) return;
      const currentPosition = focusableIndexes.indexOf(activeIndex);
      const nextPosition =
        currentPosition === -1
          ? delta > 0
            ? 0
            : focusableIndexes.length - 1
          : (currentPosition + delta + focusableIndexes.length) % focusableIndexes.length;
      setActiveIndex(focusableIndexes[nextPosition]!);
      setOpenSubmenuIndex(null);
    },
    [activeIndex, focusableIndexes]
  );

  const onTriggerKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setOpen(true);
      setActiveIndex(focusableIndexes[0] ?? -1);
    }
  };

  const onMenuKeyDown = (event: React.KeyboardEvent) => {
    const activeEntry = items[activeIndex];

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        move(1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        move(-1);
        break;
      case 'ArrowRight': {
        if (activeEntry && activeEntry.kind === 'submenu' && !activeEntry.disabled) {
          event.preventDefault();
          setOpenSubmenuIndex(activeIndex);
        }
        break;
      }
      case 'Home':
        event.preventDefault();
        setActiveIndex(focusableIndexes[0] ?? -1);
        setOpenSubmenuIndex(null);
        break;
      case 'End':
        event.preventDefault();
        setActiveIndex(focusableIndexes[focusableIndexes.length - 1] ?? -1);
        setOpenSubmenuIndex(null);
        break;
      case 'Tab':
        event.preventDefault();
        close();
        triggerRef.current?.focus();
        break;
      case 'Enter':
      case ' ': {
        event.preventDefault();
        if (!activeEntry) break;
        if (activeEntry.kind === 'submenu' && !activeEntry.disabled) {
          setOpenSubmenuIndex(activeIndex);
        } else if (activeEntry.kind === 'item' && !activeEntry.disabled) {
          activeEntry.onSelect?.();
          close();
          triggerRef.current?.focus();
        } else if (activeEntry.kind === 'checkbox' && !activeEntry.disabled) {
          activeEntry.onCheckedChange(!activeEntry.checked);
        } else if (activeEntry.kind === 'radio' && !activeEntry.disabled) {
          activeEntry.onSelect?.(activeEntry.value);
          close();
          triggerRef.current?.focus();
        }
        break;
      }
      default: {
        if (event.key.length === 1 && !event.metaKey && !event.ctrlKey && !event.altKey) {
          const next = typeahead + event.key.toLowerCase();
          setTypeahead(next);
          const match = focusableIndexes.find((index) => {
            const entry = items[index];
            const label =
              entry && 'label' in entry && typeof entry.label === 'string'
                ? entry.label.toLowerCase()
                : '';
            return label.startsWith(next);
          });
          if (match !== undefined) {
            setActiveIndex(match);
            setOpenSubmenuIndex(null);
          }
          window.clearTimeout((onMenuKeyDown as { _t?: number })._t);
          (onMenuKeyDown as { _t?: number })._t = window.setTimeout(() => setTypeahead(''), 600);
        }
      }
    }
  };

  // Keep highlighted row visible in scroll view
  useEffect(() => {
    if (!open || activeIndex < 0) return;
    const node = floatingRef.current?.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`);
    node?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex, open, floatingRef]);

  const scheduleSubmenuOpen = (index: number) => {
    if (submenuTimerRef.current) window.clearTimeout(submenuTimerRef.current);
    submenuTimerRef.current = window.setTimeout(() => {
      setOpenSubmenuIndex(index);
    }, 120);
  };

  const scheduleSubmenuClose = () => {
    if (submenuTimerRef.current) window.clearTimeout(submenuTimerRef.current);
    submenuTimerRef.current = window.setTimeout(() => {
      setOpenSubmenuIndex(null);
    }, 180);
  };

  const element = trigger({
    ref: (node) => {
      triggerRef.current = node;
    },
    open,
    'aria-haspopup': 'menu',
    'aria-expanded': open,
    'aria-controls': open ? menuId : '',
    onClick: () => {
      setOpen((prev) => !prev);
      setActiveIndex(focusableIndexes[0] ?? -1);
      setOpenSubmenuIndex(null);
    },
    onKeyDown: onTriggerKeyDown,
  });

  return (
    <div ref={wrapperRef} style={{ display: 'inline-flex' }}>
      {element}
      {open && (
        <>
          {modal && (
            <div
              className="pui-menu__backdrop"
              aria-hidden="true"
              onClick={close}
            />
          )}
          <Portal>
            <div
              ref={setFloating}
              id={menuId}
              role="menu"
              tabIndex={-1}
              aria-activedescendant={
                activeIndex >= 0 ? `${menuId}-opt-${activeIndex}` : undefined
              }
              className={cn(
                'pui-menu',
                `pui-menu--${size}`,
                className
              )}
              style={{
                position: 'fixed',
                top: coords.y,
                left: coords.x,
                visibility: ready ? 'visible' : 'hidden',
              }}
              onKeyDown={onMenuKeyDown}
            >
              {arrow && <div className="pui-menu__arrow" aria-hidden="true" />}
              {items.map((entry, index) => {
                const key = entry.id ?? `entry-${index}`;

                if (entry.kind === 'separator') {
                  return <div key={key} role="separator" className="pui-menu__separator" />;
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
                      id={`${menuId}-opt-${index}`}
                      role="menuitemcheckbox"
                      aria-checked={entry.checked}
                      aria-disabled={entry.disabled || undefined}
                      data-disabled={entry.disabled ? 'true' : undefined}
                      data-active={index === activeIndex ? 'true' : undefined}
                      data-index={index}
                      className={cn('pui-menu__item', entry.inset && 'pui-menu__item--inset')}
                      onClick={() => {
                        if (entry.disabled) return;
                        entry.onCheckedChange(!entry.checked);
                      }}
                      onMouseEnter={() => {
                        if (!entry.disabled) {
                          setActiveIndex(index);
                          scheduleSubmenuClose();
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
                      id={`${menuId}-opt-${index}`}
                      role="menuitemradio"
                      aria-checked={entry.checked}
                      aria-disabled={entry.disabled || undefined}
                      data-disabled={entry.disabled ? 'true' : undefined}
                      data-active={index === activeIndex ? 'true' : undefined}
                      data-index={index}
                      className={cn('pui-menu__item', entry.inset && 'pui-menu__item--inset')}
                      onClick={() => {
                        if (entry.disabled) return;
                        entry.onSelect?.(entry.value);
                        close();
                        triggerRef.current?.focus();
                      }}
                      onMouseEnter={() => {
                        if (!entry.disabled) {
                          setActiveIndex(index);
                          scheduleSubmenuClose();
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
                  const isSubmenuOpen = openSubmenuIndex === index;
                  return (
                    <div
                      key={key}
                      ref={(el) => {
                        if (el) itemElementsRef.current.set(index, el);
                        else itemElementsRef.current.delete(index);
                      }}
                      id={`${menuId}-opt-${index}`}
                      role="menuitem"
                      aria-haspopup="menu"
                      aria-expanded={isSubmenuOpen}
                      aria-disabled={entry.disabled || undefined}
                      data-disabled={entry.disabled ? 'true' : undefined}
                      data-active={index === activeIndex || isSubmenuOpen ? 'true' : undefined}
                      data-index={index}
                      className={cn(
                        'pui-menu__item',
                        'pui-menu__submenu-trigger',
                        entry.inset && 'pui-menu__item--inset'
                      )}
                      onClick={() => {
                        if (entry.disabled) return;
                        setOpenSubmenuIndex((prev) => (prev === index ? null : index));
                      }}
                      onMouseEnter={() => {
                        if (!entry.disabled) {
                          setActiveIndex(index);
                          scheduleSubmenuOpen(index);
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

                      {isSubmenuOpen && (
                        <SubmenuPanel
                          items={entry.items}
                          parentItemEl={itemElementsRef.current.get(index) ?? null}
                          size={size}
                          onCloseAll={close}
                          onCloseSubmenu={() => setOpenSubmenuIndex(null)}
                        />
                      )}
                    </div>
                  );
                }

                return (
                  <div
                    key={key}
                    id={`${menuId}-opt-${index}`}
                    role="menuitem"
                    aria-disabled={entry.disabled || undefined}
                    data-disabled={entry.disabled ? 'true' : undefined}
                    data-active={index === activeIndex ? 'true' : undefined}
                    data-index={index}
                    className={cn(
                      'pui-menu__item',
                      entry.tone === 'danger' && 'pui-menu__item--danger',
                      entry.inset && 'pui-menu__item--inset'
                    )}
                    onClick={() => {
                      if (entry.disabled) return;
                      entry.onSelect?.();
                      close();
                      triggerRef.current?.focus();
                    }}
                    onMouseEnter={() => {
                      if (!entry.disabled) {
                        setActiveIndex(index);
                        scheduleSubmenuClose();
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
        </>
      )}
    </div>
  );
}
