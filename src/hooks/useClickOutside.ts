import { useEffect, type RefObject } from 'react';

export type ClickOutsideTarget = RefObject<HTMLElement | null> | HTMLElement | null | undefined;

/**
 * Invokes `callback` when a pointerdown or touch event occurs outside all target elements.
 */
export function useClickOutside(
  elements: ClickOutsideTarget | ClickOutsideTarget[],
  callback: (event: MouseEvent | TouchEvent) => void,
  active = true
) {
  useEffect(() => {
    if (!active || typeof document === 'undefined') return;

    const elementList = Array.isArray(elements) ? elements : [elements];

    const listener = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node | null;
      if (!target) return;

      const isInside = elementList.some((el) => {
        const dom = el && 'current' in el ? el.current : el;
        return dom ? dom.contains(target) : false;
      });

      if (!isInside) {
        callback(event);
      }
    };

    document.addEventListener('pointerdown', listener);
    return () => {
      document.removeEventListener('pointerdown', listener);
    };
  }, [elements, callback, active]);
}
