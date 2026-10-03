import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type MutableRefObject,
  type RefObject,
} from 'react';

export type Placement = 'top' | 'bottom' | 'left' | 'right';
export type Align = 'start' | 'center' | 'end';

export interface FloatingCoords {
  x: number;
  y: number;
  placement: Placement;
}

const GAP = 6;
const VIEWPORT_PADDING = 8;

export interface UseFloatingReturn<T extends HTMLElement> {
  /**
   * Attach to the floating element. This is a *callback* ref, not a ref object:
   * the node is mirrored into state so positioning re-runs the moment it
   * appears. `<Portal>` mounts one commit after its parent, so a plain
   * `useRef` would still be empty when the layout effect first runs.
   */
  setFloating: (node: T | null) => void;
  /** Imperative escape hatch; kept in sync with `setFloating`. */
  floatingRef: MutableRefObject<T | null>;
  coords: FloatingCoords;
  placement: Placement;
  /** False until the element has been measured — keep it hidden until then. */
  ready: boolean;
  update: () => void;
}

/**
 * Dependency-free fixed-positioning for floating layers.
 * Flips when there is no room and shifts to stay inside the viewport.
 *
 * Position: `fixed` + portal means no ancestor can clip or transform it.
 */
export function useFloating<T extends HTMLElement>(
  anchorRef: RefObject<HTMLElement>,
  active: boolean,
  options: { placement?: Placement; align?: Align; offset?: number } = {}
): UseFloatingReturn<T> {
  const { placement: preferred = 'bottom', align = 'start', offset = GAP } = options;

  const floatingRef = useRef<T | null>(null) as MutableRefObject<T | null>;
  const [floatingNode, setFloatingNode] = useState<T | null>(null);
  const [coords, setCoords] = useState<FloatingCoords>({ x: 0, y: 0, placement: preferred });
  const [ready, setReady] = useState(false);

  const setFloating = useCallback((node: T | null) => {
    floatingRef.current = node;
    setFloatingNode(node);
  }, []);

  const update = useCallback(() => {
    const anchor = anchorRef.current;
    const floating = floatingNode;
    if (!anchor || !floating) return;

    const a = anchor.getBoundingClientRect();
    const f = floating.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    let placement: Placement = preferred;
    const fits = (p: Placement) => {
      switch (p) {
        case 'bottom': return a.bottom + offset + f.height <= vh - VIEWPORT_PADDING;
        case 'top':    return a.top - offset - f.height >= VIEWPORT_PADDING;
        case 'right':  return a.right + offset + f.width <= vw - VIEWPORT_PADDING;
        case 'left':   return a.left - offset - f.width >= VIEWPORT_PADDING;
      }
    };
    if (!fits(placement)) {
      const opposite: Record<Placement, Placement> = {
        bottom: 'top', top: 'bottom', right: 'left', left: 'right',
      };
      if (fits(opposite[placement])) placement = opposite[placement];
    }

    let x = 0;
    let y = 0;

    if (placement === 'bottom' || placement === 'top') {
      y = placement === 'bottom' ? a.bottom + offset : a.top - offset - f.height;
      if (align === 'start') x = a.left;
      else if (align === 'end') x = a.right - f.width;
      else x = a.left + a.width / 2 - f.width / 2;
      x = clamp(x, VIEWPORT_PADDING, vw - f.width - VIEWPORT_PADDING);
      y = clamp(y, VIEWPORT_PADDING, vh - f.height - VIEWPORT_PADDING);
    } else {
      x = placement === 'right' ? a.right + offset : a.left - offset - f.width;
      if (align === 'start') y = a.top;
      else if (align === 'end') y = a.bottom - f.height;
      else y = a.top + a.height / 2 - f.height / 2;
      y = clamp(y, VIEWPORT_PADDING, vh - f.height - VIEWPORT_PADDING);
      x = clamp(x, VIEWPORT_PADDING, vw - f.width - VIEWPORT_PADDING);
    }

    setCoords((prev) =>
      prev.x === x && prev.y === y && prev.placement === placement
        ? prev
        : { x, y, placement }
    );
    setReady(true);
  }, [anchorRef, floatingNode, preferred, align, offset]);

  useLayoutEffect(() => {
    if (!active) {
      setReady(false);
      return;
    }
    update();
  }, [active, update]);

  useEffect(() => {
    if (!active) return;
    const onScrollOrResize = () => update();
    window.addEventListener('scroll', onScrollOrResize, true);
    window.addEventListener('resize', onScrollOrResize);
    const observer = new ResizeObserver(update);
    if (floatingNode) observer.observe(floatingNode);
    return () => {
      window.removeEventListener('scroll', onScrollOrResize, true);
      window.removeEventListener('resize', onScrollOrResize);
      observer.disconnect();
    };
  }, [active, update, floatingNode]);

  return { setFloating, floatingRef, coords, placement: coords.placement, ready, update };
}

function clamp(value: number, min: number, max: number) {
  if (max < min) return min;
  return Math.min(Math.max(value, min), max);
}
