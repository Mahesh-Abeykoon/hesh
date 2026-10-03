import { useEffect, type RefObject } from 'react';

/** The dismiss target: a live node, or a ref that resolves to one. */
export type DismissTarget = HTMLElement | null | RefObject<HTMLElement>;

export interface UseDismissOptions {
  escape?: boolean;
  outside?: boolean;
  /**
   * Extra nodes that count as "inside" — e.g. a menu rendered through a portal,
   * which is not a DOM descendant of its trigger.
   */
  ignore?: RefObject<HTMLElement>[];
}

/**
 * Runs `handler` on pointerdown outside `ref` and on Escape.
 * Used by menus, popovers, comboboxes and tooltips.
 *
 * Uses `pointerdown` (not `click`) so the menu closes before a click lands on
 * whatever is underneath — avoids the classic "click passed through" bug.
 */
export function useDismiss(
  ref: DismissTarget,
  active: boolean,
  handler: () => void,
  options: UseDismissOptions = {}
) {
  const { escape = true, outside = true, ignore = [] } = options;

  const self =
    ref && typeof ref === 'object' && 'current' in ref ? ref.current : (ref as HTMLElement | null);

  useEffect(() => {
    if (!active) return;
    const handlerRef = { current: handler };
    handlerRef.current = handler;

    const onPointerDown = (event: PointerEvent) => {
      if (!outside) return;
      const target = event.target as Node | null;
      if (!target) return;
      if (self?.contains(target)) return;
      if (ignore.some((item) => item.current?.contains(target))) return;
      handlerRef.current();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (escape && event.key === 'Escape') {
        event.stopPropagation();
        handlerRef.current();
      }
    };

    document.addEventListener('pointerdown', onPointerDown, true);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown, true);
      document.removeEventListener('keydown', onKeyDown);
    };
    // `ignore` is a fresh array literal each render, so key on its contents.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [self, active, handler, escape, outside, ...ignore]);
}
