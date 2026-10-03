import {
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
import { CheckIcon } from './icons';

export interface MenuItemSpec {
  id?: string;
  label: ReactNode;
  icon?: ReactNode;
  shortcut?: string;
  disabled?: boolean;
  tone?: 'default' | 'danger';
  onSelect?: () => void;
}

export interface MenuCheckboxSpec {
  id?: string;
  label: ReactNode;
  checked: boolean;
  disabled?: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export type MenuEntry =
  | ({ kind: 'item' } & MenuItemSpec)
  | ({ kind: 'checkbox' } & MenuCheckboxSpec)
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
  placement?: 'top' | 'bottom';
  className?: string;
}

const isFocusable = (entry: MenuEntry) =>
  (entry.kind === 'item' && !entry.disabled) ||
  (entry.kind === 'checkbox' && !entry.disabled);

/**
 * Menu button following the WAI-ARIA Menu Button pattern.
 *
 * - Trigger keeps DOM focus; the popup uses `aria-activedescendant` so focus is
 *   never orphaned and screen readers announce options as you move.
 * - Arrow keys wrap, Home/End jump, Escape closes and returns focus to trigger,
 *   type-to-search jumps to the next matching label.
 */
export function DropdownMenu({
  items,
  trigger,
  align = 'start',
  placement = 'bottom',
  className,
}: DropdownMenuProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [typeahead, setTypeahead] = useState('');

  const triggerRef = useRef<HTMLElement | null>(null);
  const menuId = `pui-menu-${useId()}`;

  const { setFloating, floatingRef, coords, ready } = useFloating<HTMLDivElement>(
    triggerRef as React.RefObject<HTMLElement>,
    open,
    { placement, align, offset: 6 }
  );

  const wrapperRef = useRef<HTMLDivElement>(null);
  const close = useCallback(() => {
    setOpen(false);
    setActiveIndex(-1);
    setTypeahead('');
  }, []);

  // The menu renders in a portal, so it is not a DOM descendant of the trigger.
  // List it as `ignore` or clicking a menu row would close the menu first.
  useDismiss(wrapperRef, open, close, { escape: true, outside: true, ignore: [floatingRef] });

  // Move DOM focus into the menu so arrow keys work. The trigger keeps the
  // visual focus ring off; `aria-activedescendant` drives announcements.
  useEffect(() => {
    if (!open) return;
    const raf = requestAnimationFrame(() => floatingRef.current?.focus());
    return () => cancelAnimationFrame(raf);
  }, [open, floatingRef]);

  const focusableIndexes = items
    .map((entry, index) => (isFocusable(entry) ? index : -1))
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
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        move(1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        move(-1);
        break;
      case 'Home':
        event.preventDefault();
        setActiveIndex(focusableIndexes[0] ?? -1);
        break;
      case 'End':
        event.preventDefault();
        setActiveIndex(focusableIndexes[focusableIndexes.length - 1] ?? -1);
        break;
      case 'Tab':
        event.preventDefault();
        close();
        triggerRef.current?.focus();
        break;
      case 'Enter':
      case ' ': {
        event.preventDefault();
        const entry = items[activeIndex];
        if (!entry) break;
        if (entry.kind === 'item' && !entry.disabled) {
          entry.onSelect?.();
          close();
          triggerRef.current?.focus();
        } else if (entry.kind === 'checkbox' && !entry.disabled) {
          entry.onCheckedChange(!entry.checked);
        }
        break;
      }
      default: {
        // Type-to-search: printable characters only.
        if (event.key.length === 1 && !event.metaKey && !event.ctrlKey && !event.altKey) {
          const next = typeahead + event.key.toLowerCase();
          setTypeahead(next);
          const match = focusableIndexes.find((index) => {
            const entry = items[index];
            const label =
              entry && (entry.kind === 'item' || entry.kind === 'checkbox')
                ? String(entry.label).toLowerCase()
                : '';
            return label.startsWith(next);
          });
          if (match !== undefined) setActiveIndex(match);
          window.clearTimeout((onMenuKeyDown as { _t?: number })._t);
          (onMenuKeyDown as { _t?: number })._t = window.setTimeout(() => setTypeahead(''), 600);
        }
      }
    }
  };

  // Keep the highlighted row scrolled into view.
  useEffect(() => {
    if (!open || activeIndex < 0) return;
    const node = floatingRef.current?.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`);
    node?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex, open, floatingRef]);

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
    },
    onKeyDown: onTriggerKeyDown,
  });

  return (
    <div ref={wrapperRef} style={{ display: 'inline-flex' }}>
      {element}
      {open && (
        <Portal>
          <div
            ref={setFloating}
            id={menuId}
            role="menu"
            tabIndex={-1}
            aria-activedescendant={
              activeIndex >= 0 ? `${menuId}-opt-${activeIndex}` : undefined
            }
            className={cn('pui-menu', className)}
            style={{
              position: 'fixed',
              top: coords.y,
              left: coords.x,
              // Hidden until measured to avoid a visible jump on first paint.
              visibility: ready ? 'visible' : 'hidden',
            }}
            onKeyDown={onMenuKeyDown}
          >
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
                    className="pui-menu__item"
                    onClick={() => {
                      if (entry.disabled) return;
                      entry.onCheckedChange(!entry.checked);
                    }}
                    onMouseEnter={() => !entry.disabled && setActiveIndex(index)}
                  >
                    <span className="pui-menu__checkbox">
                      {entry.checked && <CheckIcon />}
                    </span>
                    <span className="pui-menu__item__body">{entry.label}</span>
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
                  className={cn('pui-menu__item', entry.tone === 'danger' && 'pui-menu__item--danger')}
                  onClick={() => {
                    if (entry.disabled) return;
                    entry.onSelect?.();
                    close();
                    triggerRef.current?.focus();
                  }}
                  onMouseEnter={() => !entry.disabled && setActiveIndex(index)}
                >
                  {entry.icon && <span className="pui-menu__item__icon">{entry.icon}</span>}
                  <span className="pui-menu__item__body">{entry.label}</span>
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
