import { useEffect, type RefObject } from 'react';

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

function getFocusable(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (el) => el.offsetWidth > 0 || el.offsetHeight > 0 || el === document.activeElement
  );
}

/**
 * Traps Tab focus inside `container` while `active`.
 * Restores focus to the previously focused element on teardown, which is what
 * makes a dialog feel correct when it closes.
 *
 * Takes the node rather than a ref on purpose. `<Portal>` renders `null` on its
 * first commit, so a ref handed to this hook is still empty when the effect
 * runs and the trap would silently never engage. Consumers should pass a node
 * held in state (`ref={setNode}`), which re-runs the effect once the panel
 * actually exists.
 *
 * A `RefObject` is still accepted for panels that mount synchronously.
 */
export interface FocusTrapOptions {
  /** Focus this element on open instead of the first focusable child. */
  initialFocus?: RefObject<HTMLElement> | null;
}

export function useFocusTrap(
  container: HTMLElement | null | RefObject<HTMLElement>,
  active: boolean,
  options: FocusTrapOptions = {}
) {
  const node =
    container && typeof container === 'object' && 'current' in container
      ? container.current
      : (container as HTMLElement | null);

  const { initialFocus } = options;

  useEffect(() => {
    if (!active || !node) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;

    // Move focus in after paint so entry animations don't fight it.
    const raf = requestAnimationFrame(() => {
      const [first] = getFocusable(node);
      const target =
        initialFocus?.current ??
        node.querySelector<HTMLElement>('[data-autofocus]') ??
        first;
      target?.focus();
    });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;
      const items = getFocusable(node);
      if (items.length === 0) {
        event.preventDefault();
        return;
      }
      const first = items[0]!;
      const last = items[items.length - 1]!;
      const activeEl = document.activeElement;

      if (event.shiftKey && (activeEl === first || !node.contains(activeEl))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && activeEl === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown, true);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('keydown', onKeyDown, true);
      previouslyFocused?.focus?.();
    };
  }, [node, active, initialFocus]);
}
