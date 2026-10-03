import { useEffect } from 'react';

/**
 * Prevents background scroll while an overlay is open.
 *
 * Compensates for the disappearing scrollbar with padding so the page behind
 * does not jump sideways, and restores the exact previous values on cleanup.
 */
export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active || typeof document === 'undefined') return;

    const { body } = document;
    const previousOverflow = body.style.overflow;
    const previousPaddingRight = body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPaddingRight;
    };
  }, [active]);
}
