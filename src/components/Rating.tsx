import React, {
  forwardRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { cn } from '../utils/cn';
import { StarIcon } from './icons';

export interface RatingProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Total number of rating items. @default 5 */
  count?: number;
  /** Current rating value (controlled). */
  value?: number;
  /** Default rating value (uncontrolled). @default 0 */
  defaultValue?: number;
  /** Precision allowed: full stars (1) or half stars (0.5). @default 1 */
  precision?: 1 | 0.5;
  /** Callback fired when rating changes. */
  onChange?: (value: number) => void;
  /** Whether the rating is read-only. @default false */
  readOnly?: boolean;
  /** Whether the rating is disabled. @default false */
  disabled?: boolean;
  /** Sizing of the rating icons. @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  /** Custom icon generator. Defaults to StarIcon. */
  icon?: (filled: boolean, value: number) => ReactNode;
}

const SIZE_MAP = {
  sm: 16,
  md: 20,
  lg: 26,
};

/**
 * Rating displays interactive or read-only star reviews.
 * Supports half-star precision, hover preview, and full keyboard navigation.
 */
export const Rating = forwardRef<HTMLDivElement, RatingProps>(
  (
    {
      count = 5,
      value: controlledValue,
      defaultValue = 0,
      precision = 1,
      onChange,
      readOnly = false,
      disabled = false,
      size = 'md',
      icon,
      className,
      ...props
    },
    ref
  ) => {
    const isControlled = controlledValue !== undefined;
    const [internalValue, setInternalValue] = useState(defaultValue);
    const [hoverValue, setHoverValue] = useState<number | null>(null);

    const currentValue = isControlled ? controlledValue : internalValue;
    const displayValue = hoverValue !== null ? hoverValue : currentValue;

    const iconSize = SIZE_MAP[size];

    const setValue = (newVal: number) => {
      if (readOnly || disabled) return;
      if (!isControlled) {
        setInternalValue(newVal);
      }
      onChange?.(newVal);
    };

    const handleMouseMove = (e: MouseEvent<HTMLSpanElement>, index: number) => {
      if (readOnly || disabled) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const isLeftHalf = e.clientX - rect.left < rect.width / 2;
      const starVal = index + 1;
      const calculatedVal = precision === 0.5 && isLeftHalf ? starVal - 0.5 : starVal;
      setHoverValue(calculatedVal);
    };

    const handleClick = (e: MouseEvent<HTMLSpanElement>, index: number) => {
      if (readOnly || disabled) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const isLeftHalf = e.clientX - rect.left < rect.width / 2;
      const starVal = index + 1;
      const calculatedVal = precision === 0.5 && isLeftHalf ? starVal - 0.5 : starVal;
      // If clicking same value, can toggle off or retain
      setValue(calculatedVal);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
      if (readOnly || disabled) return;

      const step = precision;
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
        e.preventDefault();
        setValue(Math.min(count, Number((currentValue + step).toFixed(1))));
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
        e.preventDefault();
        setValue(Math.max(0, Number((currentValue - step).toFixed(1))));
      } else if (e.key === 'Home') {
        e.preventDefault();
        setValue(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        setValue(count);
      }
    };

    return (
      <div
        ref={ref}
        role={readOnly ? 'img' : 'slider'}
        aria-label={readOnly ? `Rated ${currentValue} out of ${count} stars` : 'Rating'}
        aria-valuemin={0}
        aria-valuemax={count}
        aria-valuenow={currentValue}
        tabIndex={disabled || readOnly ? -1 : 0}
        onKeyDown={handleKeyDown}
        onMouseLeave={() => setHoverValue(null)}
        className={cn(
          'pui-rating',
          `pui-rating--${size}`,
          readOnly && 'pui-rating--readonly',
          disabled && 'pui-rating--disabled',
          className
        )}
        {...props}
      >
        {Array.from({ length: count }, (_, i) => {
          const starIndex = i + 1;
          const fillRatio = Math.max(0, Math.min(1, displayValue - i));

          return (
            <span
              key={i}
              className={cn(
                'pui-rating__star',
                fillRatio === 1 && 'pui-rating__star--full',
                fillRatio > 0 && fillRatio < 1 && 'pui-rating__star--half',
                fillRatio === 0 && 'pui-rating__star--empty'
              )}
              onMouseMove={(e) => handleMouseMove(e, i)}
              onClick={(e) => handleClick(e, i)}
            >
              {icon ? (
                icon(fillRatio > 0, starIndex)
              ) : (
                <span className="pui-rating__star-inner" style={{ width: iconSize, height: iconSize }}>
                  {/* Background base outline star */}
                  <span className="pui-rating__star-base">
                    <StarIcon size={iconSize} />
                  </span>
                  {/* Filled star foreground clipped to fillRatio */}
                  <span
                    className="pui-rating__star-fill"
                    style={{ width: `${fillRatio * 100}%` }}
                    aria-hidden="true"
                  >
                    <StarIcon size={iconSize} />
                  </span>
                </span>
              )}
            </span>
          );
        })}
        <span className="pui-rating__value-label" aria-hidden="true">
          {displayValue > 0 ? displayValue.toFixed(precision === 0.5 ? 1 : 0) : ''}
        </span>
      </div>
    );
  }
);

Rating.displayName = 'Rating';
