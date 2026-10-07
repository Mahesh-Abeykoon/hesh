import {
  useState,
  useEffect,
  useRef,
  useCallback,
  forwardRef,
  type ReactNode,
  type HTMLAttributes,
} from 'react';
import { cn } from '../utils/cn';

export interface CarouselProps extends HTMLAttributes<HTMLDivElement> {
  /** Slides or content elements to display */
  children?: ReactNode;
  /** Number of slides visible simultaneously. @default 1 */
  itemsPerView?: number;
  /** Gap between slides in pixels when itemsPerView > 1. @default 16 */
  gap?: number;
  /** Automatically transition to next slide */
  autoPlay?: boolean;
  /** Autoplay interval in milliseconds (default: 4000) */
  interval?: number;
  /** Whether navigation wraps around at ends (default: true for single slide, false for multi-item) */
  loop?: boolean;
  /** Show previous/next arrow buttons (default: true) */
  showArrows?: boolean;
  /** Show pagination dot indicators (default: true) */
  showDots?: boolean;
  /** Indicator pagination style: modern expanding bars, refined dots, or numeric badge. @default 'bars' */
  indicatorVariant?: 'bars' | 'dots' | 'numbers';
  /** Arrow button visual variant: floating frosted glass, solid, or outline. @default 'floating' */
  arrowVariant?: 'floating' | 'solid' | 'outline';
  /** Position of pagination indicators: inside slide viewport or outside below track. @default 'inside' */
  dotsPosition?: 'inside' | 'outside';
  /** Callback fired when active slide index changes */
  onSlideChange?: (index: number) => void;
  /** Accessible label describing the carousel */
  'aria-label'?: string;
}

export const Carousel = forwardRef<HTMLDivElement, CarouselProps>(function Carousel(
  {
    children,
    itemsPerView = 1,
    gap = 16,
    autoPlay = false,
    interval = 4000,
    loop,
    showArrows = true,
    showDots = true,
    indicatorVariant = 'bars',
    arrowVariant = 'floating',
    dotsPosition = 'inside',
    onSlideChange,
    className,
    'aria-label': ariaLabel = 'Image and content carousel',
    ...props
  },
  ref
) {
  const slides = Array.isArray(children) ? children.filter(Boolean) : children ? [children] : [];
  const slideCount = slides.length;
  const clampedItemsPerView = Math.max(1, Math.min(itemsPerView, slideCount || 1));
  const maxIndex = Math.max(0, slideCount - clampedItemsPerView);
  const effectiveLoop = loop !== undefined ? loop : clampedItemsPerView <= 1;

  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const isMultiItem = clampedItemsPerView > 1;
  const totalStops = isMultiItem ? maxIndex + 1 : slideCount;

  useEffect(() => {
    if (current > maxIndex) {
      setCurrent(maxIndex);
    }
  }, [maxIndex, current]);

  const goTo = useCallback(
    (index: number) => {
      let target = index;
      if (target < 0) {
        target = effectiveLoop ? maxIndex : 0;
      } else if (target > maxIndex) {
        target = effectiveLoop ? 0 : maxIndex;
      }
      setCurrent(target);
      onSlideChange?.(target);
    },
    [effectiveLoop, maxIndex, onSlideChange]
  );

  const prev = useCallback(() => goTo(current - 1), [goTo, current]);
  const next = useCallback(() => goTo(current + 1), [goTo, current]);

  useEffect(() => {
    if (!autoPlay || isPaused || slideCount <= clampedItemsPerView) return;
    const timer = window.setInterval(next, interval);
    return () => window.clearInterval(timer);
  }, [autoPlay, isPaused, slideCount, clampedItemsPerView, interval, next]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      next();
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 40;
    if (diff > threshold) {
      next();
    } else if (diff < -threshold) {
      prev();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  if (slideCount === 0) return null;

  const trackTransform = isMultiItem
    ? `translateX(calc(-${current} * ((100% + ${gap}px) / ${clampedItemsPerView})))`
    : `translateX(-${current * 100}%)`;

  const trackStyle: React.CSSProperties = {
    transform: trackTransform,
    ...(isMultiItem ? { gap: `${gap}px` } : {}),
  };

  const slideStyle: React.CSSProperties | undefined = isMultiItem
    ? {
        flex: `0 0 calc((100% - ${(clampedItemsPerView - 1) * gap}px) / ${clampedItemsPerView})`,
        minWidth: `calc((100% - ${(clampedItemsPerView - 1) * gap}px) / ${clampedItemsPerView})`,
        width: `calc((100% - ${(clampedItemsPerView - 1) * gap}px) / ${clampedItemsPerView})`,
        boxSizing: 'border-box',
      }
    : undefined;

  return (
    <div
      ref={ref}
      className={cn(
        'pui-carousel',
        dotsPosition === 'outside' && 'pui-carousel--dots-outside',
        clampedItemsPerView > 1 && 'pui-carousel--multi-item',
        className
      )}
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      tabIndex={0}
      {...props}
    >
      <div
        className="pui-carousel__viewport"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="pui-carousel__track"
          style={trackStyle}
        >
          {slides.map((slide, idx) => {
            const isVisible = isMultiItem
              ? idx >= current && idx < current + clampedItemsPerView
              : idx === current;
            return (
              <div
                key={idx}
                className={cn('pui-carousel__slide', isVisible && 'pui-carousel__slide--active')}
                style={slideStyle}
                role="group"
                aria-roledescription="slide"
                aria-label={`Slide ${idx + 1} of ${slideCount}`}
                aria-hidden={!isVisible}
              >
                {slide}
              </div>
            );
          })}
        </div>
      </div>

      {showArrows && slideCount > clampedItemsPerView && (
        <>
          <button
            type="button"
            className={cn(
              'pui-carousel__arrow pui-carousel__arrow--prev',
              `pui-carousel__arrow--${arrowVariant}`
            )}
            aria-label="Previous slide"
            onClick={prev}
            disabled={!effectiveLoop && current === 0}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            className={cn(
              'pui-carousel__arrow pui-carousel__arrow--next',
              `pui-carousel__arrow--${arrowVariant}`
            )}
            aria-label="Next slide"
            onClick={next}
            disabled={!effectiveLoop && current >= maxIndex}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {showDots && totalStops > 1 && (
        indicatorVariant === 'numbers' ? (
          <div className="pui-carousel__counter" aria-live="polite">
            <span className="pui-carousel__counter-current">{String(current + 1).padStart(2, '0')}</span>
            <span className="pui-carousel__counter-divider">/</span>
            <span className="pui-carousel__counter-total">{String(totalStops).padStart(2, '0')}</span>
          </div>
        ) : (
          <div
            className={cn(
              'pui-carousel__dots',
              indicatorVariant === 'bars' ? 'pui-carousel__dots--bars' : 'pui-carousel__dots--dots'
            )}
            role="tablist"
            aria-label="Slides"
          >
            {Array.from({ length: totalStops }).map((_, idx) => (
              <button
                key={idx}
                type="button"
                role="tab"
                aria-selected={idx === current}
                aria-label={`Go to slide position ${idx + 1}`}
                className={cn(
                  'pui-carousel__dot',
                  indicatorVariant === 'bars' && 'pui-carousel__dot--bar',
                  idx === current && 'pui-carousel__dot--active'
                )}
                onClick={() => goTo(idx)}
              />
            ))}
          </div>
        )
      )}
    </div>
  );
});
