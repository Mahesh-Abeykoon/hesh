import {
  createContext,
  useCallback,
  useContext,
  useId,
  useRef,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { cn } from '../utils/cn';
import { useControllableState } from '../hooks/useControllableState';

export interface TabItem {
  value: string;
  label: ReactNode;
  content?: ReactNode;
  disabled?: boolean;
  /** Small trailing pill, e.g. an unread count. */
  count?: number | string;
  icon?: ReactNode;
}

export interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'children'> {
  items: readonly TabItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  orientation?: 'horizontal' | 'vertical';
  /** Skip rendering inactive panels. Use for expensive or stateful content. */
  lazy?: boolean;
}

interface TabsContextValue {
  value: string;
  select: (value: string) => void;
  baseId: string;
  registerRef: (value: string, node: HTMLButtonElement | null) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

/**
 * Roving-tabindex tabs (WAI-ARIA Tabs pattern).
 *
 * The tab list is a single tab stop: Tab moves in/out of the list, arrow keys
 * move between tabs, Home/End jump to the ends. Disabled tabs are skipped but
 * stay reachable by screen readers.
 */
export function Tabs({
  items,
  value,
  defaultValue,
  onValueChange,
  orientation = 'horizontal',
  lazy = false,
  className,
  ...props
}: TabsProps) {
  const [selected, setSelected] = useControllableState<string>({
    value,
    defaultValue: defaultValue ?? items[0]?.value ?? '',
    onChange: onValueChange,
  });

  const baseId = useId();
  const refs = useRef(new Map<string, HTMLButtonElement | null>());

  const registerRef = useCallback((tabValue: string, node: HTMLButtonElement | null) => {
    if (node) refs.current.set(tabValue, node);
    else refs.current.delete(tabValue);
  }, []);

  const select = useCallback(
    (next: string) => {
      if (items.find((item) => item.value === next)?.disabled) return;
      setSelected(next);
    },
    [items, setSelected]
  );

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const enabled = items.filter((item) => !item.disabled);
    if (enabled.length === 0) return;

    const currentIndex = enabled.findIndex((item) => item.value === selected);
    const nextKey = orientation === 'horizontal' ? 'ArrowRight' : 'ArrowDown';
    const prevKey = orientation === 'horizontal' ? 'ArrowLeft' : 'ArrowUp';

    let target: string | undefined;

    if (event.key === nextKey) {
      target = enabled[(currentIndex + 1) % enabled.length]?.value;
    } else if (event.key === prevKey) {
      target = enabled[(currentIndex - 1 + enabled.length) % enabled.length]?.value;
    } else if (event.key === 'Home') {
      target = enabled[0]?.value;
    } else if (event.key === 'End') {
      target = enabled[enabled.length - 1]?.value;
    }

    if (target) {
      event.preventDefault();
      select(target);
      refs.current.get(target)?.focus();
    }
  };

  const activeItem = items.find((item) => item.value === selected);

  return (
    <TabsContext.Provider value={{ value: selected, select, baseId, registerRef }}>
      <div
        className={cn('pui-tabs', orientation === 'vertical' && 'pui-tabs--vertical', className)}
        {...props}
      >
        <div
          role="tablist"
          aria-orientation={orientation}
          className="pui-tabs__list"
          onKeyDown={onKeyDown}
        >
          {items.map((item) => {
            const isActive = item.value === selected;
            return (
              <button
                key={item.value}
                ref={(node) => registerRef(item.value, node)}
                type="button"
                role="tab"
                id={`${baseId}-tab-${item.value}`}
                aria-selected={isActive}
                aria-controls={`${baseId}-panel-${item.value}`}
                // Roving tabindex: only the active tab is in the tab sequence.
                tabIndex={isActive ? 0 : -1}
                disabled={item.disabled}
                className="pui-tab"
                onClick={() => select(item.value)}
              >
                {item.icon && <span className="pui-btn__icon">{item.icon}</span>}
                {item.label}
                {item.count !== undefined && <span className="pui-tab__count">{item.count}</span>}
              </button>
            );
          })}
        </div>

        {items.map((item) => {
          const isActive = item.value === selected;
          if (lazy && !isActive) return null;
          return (
            <div
              key={item.value}
              role="tabpanel"
              id={`${baseId}-panel-${item.value}`}
              aria-labelledby={`${baseId}-tab-${item.value}`}
              hidden={!isActive}
              tabIndex={0}
              className="pui-tabs__panel"
            >
              {item.content}
            </div>
          );
        })}
        {!activeItem && null}
      </div>
    </TabsContext.Provider>
  );
}

export function useTabsContext() {
  const context = useContext(TabsContext);
  if (!context) throw new Error('Tab components must be used inside <Tabs>.');
  return context;
}
