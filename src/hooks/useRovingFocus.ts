import { useCallback, useRef, useState, type KeyboardEvent } from 'react';

export interface UseRovingFocusOptions {
  orientation?: 'vertical' | 'horizontal' | 'both';
  loop?: boolean;
  onSelect?: (index: number) => void;
}

/**
 * Roving focus hook for lists, menus, toolbars, and selects.
 * Handles arrow key navigation, Home/End, Enter/Space, and 500ms typeahead search.
 */
export function useRovingFocus(
  itemsLength: number,
  options: UseRovingFocusOptions = {}
) {
  const { orientation = 'vertical', loop = true, onSelect } = options;
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const typeaheadBuffer = useRef('');
  const typeaheadTimer = useRef<number | undefined>(undefined);

  const move = useCallback(
    (step: number) => {
      setActiveIndex((current) => {
        if (itemsLength === 0) return -1;
        if (current === -1) return step > 0 ? 0 : itemsLength - 1;
        let next = current + step;
        if (loop) {
          next = (next + itemsLength) % itemsLength;
        } else {
          next = Math.max(0, Math.min(itemsLength - 1, next));
        }
        return next;
      });
    },
    [itemsLength, loop]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent, itemLabels?: string[]) => {
      const isVertical = orientation === 'vertical' || orientation === 'both';
      const isHorizontal = orientation === 'horizontal' || orientation === 'both';

      if ((isVertical && e.key === 'ArrowDown') || (isHorizontal && e.key === 'ArrowRight')) {
        e.preventDefault();
        move(1);
        return;
      }
      if ((isVertical && e.key === 'ArrowUp') || (isHorizontal && e.key === 'ArrowLeft')) {
        e.preventDefault();
        move(-1);
        return;
      }
      if (e.key === 'Home') {
        e.preventDefault();
        setActiveIndex(0);
        return;
      }
      if (e.key === 'End') {
        e.preventDefault();
        setActiveIndex(itemsLength - 1);
        return;
      }
      if ((e.key === 'Enter' || e.key === ' ') && activeIndex >= 0) {
        e.preventDefault();
        onSelect?.(activeIndex);
        return;
      }

      // Typeahead single-character search
      if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey && itemLabels) {
        if (typeaheadTimer.current) window.clearTimeout(typeaheadTimer.current);
        typeaheadBuffer.current += e.key.toLowerCase();
        typeaheadTimer.current = window.setTimeout(() => {
          typeaheadBuffer.current = '';
        }, 500);

        const search = typeaheadBuffer.current;
        const start = (activeIndex + 1) % itemsLength;
        for (let i = 0; i < itemsLength; i++) {
          const idx = (start + i) % itemsLength;
          const label = itemLabels[idx]?.toLowerCase() || '';
          if (label.startsWith(search)) {
            setActiveIndex(idx);
            break;
          }
        }
      }
    },
    [orientation, move, itemsLength, activeIndex, onSelect]
  );

  return {
    activeIndex,
    setActiveIndex,
    handleKeyDown,
    move,
  };
}
