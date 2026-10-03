import {
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { Portal } from './Portal';
import { useScrollLock } from '../hooks/useScrollLock';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { useDismiss } from '../hooks/useDismiss';
import { SearchIcon } from './icons';

export interface CommandItem {
  id: string;
  label: string;
  group?: string;
  hint?: string;
  icon?: ReactNode;
  keywords?: string[];
  disabled?: boolean;
  onSelect?: () => void;
}

export interface CommandProps {
  items: CommandItem[];
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  placeholder?: string;
  emptyMessage?: string;
}

/**
 * ⌘K command palette.
 *
 * Implements the combobox-with-listbox pattern: the search input keeps DOM
 * focus, the highlighted row is tracked with `aria-activedescendant`, arrow
 * keys wrap, Home/End jump, and Enter activates.
 */
export function Command({
  items,
  open: openProp,
  onOpenChange,
  placeholder = 'Search commands…',
  emptyMessage = 'No results found',
}: CommandProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const open = openProp ?? uncontrolledOpen;
  const setOpen = onOpenChange ?? setUncontrolledOpen;

  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [panel, setPanel] = useState<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const baseId = `pui-cmd-${useId()}`;

  useScrollLock(open);
  useFocusTrap(panel, open);
  // The footer advertises "esc" — so it has to work. Backdrop clicks are
  // handled by the overlay, not here.
  useDismiss(panel, open, () => setOpen(false), { escape: true, outside: false });

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return items;
    return items.filter((item) =>
      `${item.label} ${item.group ?? ''} ${(item.keywords ?? []).join(' ')}`
        .toLowerCase()
        .includes(term)
    );
  }, [items, query]);

  const enabled = useMemo(
    () =>
      filtered
        .map((item, index) => (item.disabled ? -1 : index))
        .filter((index) => index !== -1),
    [filtered]
  );

  // Reset the highlight whenever the search query or open state changes.
  useEffect(() => {
    setActiveIndex(enabled[0] ?? 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, open]);

  useEffect(() => {
    if (!open) setQuery('');
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen(false);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, setOpen]);

  useLayoutEffect(() => {
    if (!open || activeIndex < 0) return;
    listRef.current
      ?.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`)
      ?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex, open]);

  const activate = (index: number) => {
    const item = filtered[index];
    if (!item || item.disabled) return;
    setOpen(false);
    item.onSelect?.();
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setActiveIndex((prev) => {
          const pos = enabled.indexOf(prev);
          return enabled[(pos + 1) % enabled.length] ?? prev;
        });
        break;
      case 'ArrowUp':
        event.preventDefault();
        setActiveIndex((prev) => {
          const pos = enabled.indexOf(prev);
          return enabled[(pos - 1 + enabled.length) % enabled.length] ?? prev;
        });
        break;
      case 'Home':
        event.preventDefault();
        setActiveIndex(enabled[0] ?? 0);
        break;
      case 'End':
        event.preventDefault();
        setActiveIndex(enabled[enabled.length - 1] ?? 0);
        break;
      case 'Enter':
        event.preventDefault();
        activate(activeIndex);
        break;
    }
  };

  if (!open) return null;

  // Group while preserving the filtered order.
  const groups: { name: string; items: { item: CommandItem; index: number }[] }[] = [];
  filtered.forEach((item, index) => {
    const name = item.group ?? '';
    let group = groups.find((entry) => entry.name === name);
    if (!group) {
      group = { name, items: [] };
      groups.push(group);
    }
    group.items.push({ item, index });
  });

  return (
    <Portal>
      <div
        className="pui-command-overlay"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) setOpen(false);
        }}
      >
        <div
          ref={setPanel}
          role="dialog"
          aria-modal="true"
          aria-label="Command palette"
          className="pui-command"
          onMouseDown={(event) => event.stopPropagation()}
          onKeyDown={onKeyDown}
        >
          <div className="pui-command__search">
            <SearchIcon />
            <input
              className="pui-command__input"
              role="combobox"
              aria-expanded="true"
              aria-controls={`${baseId}-list`}
              aria-activedescendant={
                filtered[activeIndex] ? `${baseId}-opt-${activeIndex}` : undefined
              }
              aria-autocomplete="list"
              autoComplete="off"
              placeholder={placeholder}
              value={query}
              data-autofocus
              onChange={(event) => setQuery(event.target.value)}
            />
            <kbd className="pui-kbd pui-command__kbd">esc</kbd>
          </div>

          <div className="pui-command__list" ref={listRef} id={`${baseId}-list`} role="listbox">
            {filtered.length === 0 ? (
              <div className="pui-command__empty">{emptyMessage}</div>
            ) : (
              groups.map((group) => (
                <div key={group.name} className="pui-command__group" role="group" aria-label={group.name || undefined}>
                  {group.name && <div className="pui-command__group-label">{group.name}</div>}
                  {group.items.map(({ item, index }) => (
                    <div
                      key={item.id}
                      id={`${baseId}-opt-${index}`}
                      role="option"
                      aria-selected={index === activeIndex}
                      aria-disabled={item.disabled || undefined}
                      data-index={index}
                      data-active={index === activeIndex ? 'true' : undefined}
                      data-disabled={item.disabled ? 'true' : undefined}
                      className="pui-command__item"
                      onMouseEnter={() => !item.disabled && setActiveIndex(index)}
                      onMouseDown={(event) => {
                        event.preventDefault();
                        activate(index);
                      }}
                    >
                      {item.icon && <span className="pui-command__item__icon">{item.icon}</span>}
                      <span className="pui-command__item__label">{item.label}</span>
                      {item.hint && <span className="pui-command__item__hint">{item.hint}</span>}
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>

          <div className="pui-command__footer">
            <span>
              <kbd className="pui-kbd">↑</kbd> <kbd className="pui-kbd">↓</kbd> navigate
            </span>
            <span>
              <kbd className="pui-kbd">↵</kbd> select
            </span>
            <span style={{ marginInlineStart: 'auto' }}>{filtered.length} results</span>
          </div>
        </div>
      </div>
    </Portal>
  );
}

/** Registers the ⌘K shortcut and reports whether the palette should open. */
export function useCommandShortcut(onToggle: () => void) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        onToggle();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onToggle]);
}
