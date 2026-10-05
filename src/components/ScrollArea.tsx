import {
  forwardRef,
  useRef,
  useState,
  useEffect,
  type HTMLAttributes,
  type ReactNode,
  type UIEvent,
} from 'react';
import { cn } from '../utils/cn';

export interface ScrollAreaProps extends HTMLAttributes<HTMLDivElement> {
  /** Scrollbar visibility behavior. @default 'hover' */
  type?: 'auto' | 'always' | 'scroll' | 'hover';
  /** Max height for the scroll container. */
  maxHeight?: string | number;
  /** Max width for the scroll container. */
  maxWidth?: string | number;
  /** Whether to apply soft gradient fade masks on scrollable edges. @default false */
  fadeEdges?: boolean;
  children?: ReactNode;
}

/**
 * ScrollArea provides custom cross-browser styled scrollbars with smooth inertia,
 * edge gradient fade masks, and hover visibility.
 */
export const ScrollArea = forwardRef<HTMLDivElement, ScrollAreaProps>(function ScrollArea(
  {
    type = 'hover',
    maxHeight,
    maxWidth,
    fadeEdges = false,
    className,
    children,
    style,
    ...props
  },
  forwardedRef
) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [canScrollTop, setCanScrollTop] = useState(false);
  const [canScrollBottom, setCanScrollBottom] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    const el = viewportRef.current;
    if (!el) return;
    setCanScrollTop(el.scrollTop > 2);
    setCanScrollBottom(el.scrollTop + el.clientHeight < el.scrollHeight - 2);
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 2);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [children]);

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    checkScroll();
    props.onScroll?.(e);
  };

  return (
    <div
      ref={forwardedRef}
      className={cn(
        'pui-scroll-area',
        `pui-scroll-area--${type}`,
        fadeEdges && 'pui-scroll-area--fade',
        canScrollTop && 'pui-scroll-area--can-top',
        canScrollBottom && 'pui-scroll-area--can-bottom',
        canScrollLeft && 'pui-scroll-area--can-left',
        canScrollRight && 'pui-scroll-area--can-right',
        className
      )}
      style={{
        maxHeight: typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight,
        maxWidth: typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth,
        ...style,
      }}
      {...props}
    >
      <div
        ref={viewportRef}
        className="pui-scroll-area__viewport"
        onScroll={handleScroll}
      >
        <div className="pui-scroll-area__content">{children}</div>
      </div>
    </div>
  );
});

ScrollArea.displayName = 'ScrollArea';
