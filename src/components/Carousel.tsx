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
  /** Automatically transition to next slide */
  autoPlay?: boolean;
  /** Autoplay interval in milliseconds (default: 4000) */
  interval?: number;
  /** Whether navigation wraps around at ends (default: true) */
  loop?: boolean;
  /** Show previous/next arrow buttons (default: true) */
  showArrows?: boolean;
  /** Show pagination dot indicators (default: true) */
  showDots?: boolean;
  /** Indicator pagination style: modern expanding bars, refined dots, or numeric badge. @default 'bars' */
  indicatorVariant?: 'bars' | 'dots' | 'numbers';
  /** Arrow button visual variant: floating frosted glass, solid, or outline. @default 'floating' */
  arrowVariant?: 'floating' | 'solid' | 'outline';
  /** Callback fired when active slide index changes */
  onSlideChange?: (index: number) => void;
  /** Accessible label describing the carousel */
  'aria-label'?: string;
}

export const Carousel = forwardRef<HTMLDivElement, CarouselProps>(function Carousel(
  {
    children,
    autoPlay = false,
    interval = 4000,
    loop = true,
    showArrows = true,
    showDots = true,
    indicatorVariant = 'bars',
    arrowVariant = 'floating',
    onSlideChange,
    className,
    'aria-label': ariaLabel = 'Image and content carousel',
    ...props
  },
  ref
) {
  const slides = Array.isArray(children) ? children.filter(Boolean) : children ? [children] : [];
  const slideCount = slides.length;
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const goTo = useCallback(
    (index: number) => {
      let target = index;
      if (target < 0) {
        target = loop ? slideCount - 1 : 0;
      } else if (target >= slideCount) {
        target = loop ? 0 : slideCount - 1;
      }
      setCurrent(target);
      onSlideChange?.(target);
    },
    [loop, slideCount, onSlideChange]
  );

  const prev = useCallback(() => goTo(current - 1), [goTo, current]);
  const next = useCallback(() => goTo(current + 1), [goTo, current]);

  useEffect(() => {
    if (!autoPlay || isPaused || slideCount <= 1) return;
    const timer = window.setInterval(next, interval);
    return () => window.clearInterval(timer);
  }, [autoPlay, isPaused, slideCount, interval, next]);

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

  return (
    <div
      ref={ref}
      className={cn('pui-carousel', className)}
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
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {slides.map((slide, idx) => (
            <div
              key={idx}
              className={cn('pui-carousel__slide', idx === current && 'pui-carousel__slide--active')}
              role="group"
              aria-roledescription="slide"
              aria-label={`Slide ${idx + 1} of ${slideCount}`}
              aria-hidden={idx !== current}
            >
              {slide}
            </div>
          ))}
        </div>
      </div>

      {showArrows && slideCount > 1 && (
        <>
          <button
            type="button"
            className={cn(
              'pui-carousel__arrow pui-carousel__arrow--prev',
              `pui-carousel__arrow--${arrowVariant}`
            )}
            aria-label="Previous slide"
            onClick={prev}
            disabled={!loop && current === 0}
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
            disabled={!loop && current === slideCount - 1}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {showDots && slideCount > 1 && (
        indicatorVariant === 'numbers' ? (
          <div className="pui-carousel__counter" aria-live="polite">
            <span className="pui-carousel__counter-current">{String(current + 1).padStart(2, '0')}</span>
            <span className="pui-carousel__counter-divider">/</span>
            <span className="pui-carousel__counter-total">{String(slideCount).padStart(2, '0')}</span>
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
            {slides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                role="tab"
                aria-selected={idx === current}
                aria-label={`Go to slide ${idx + 1}`}
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
