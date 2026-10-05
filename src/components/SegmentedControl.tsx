import React, {
  forwardRef,
  useRef,
  useState,
  useEffect,
  type ReactNode,
  type KeyboardEvent,
} from 'react';
import { cn } from '../utils/cn';

export interface SegmentedControlOption {
  value: string;
  label: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
}

export interface SegmentedControlProps {
  /** Array of selectable segments. */
  options: readonly SegmentedControlOption[];
  /** Controlled value of the selected segment. */
  value?: string;
  /** Uncontrolled default value. */
  defaultValue?: string;
  /** Callback fired when a segment is selected. */
  onChange?: (value: string) => void;
  /** Size variant. @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  /** Whether the control spans 100% width of its parent container. @default false */
  fullWidth?: boolean;
  /** Whether the entire control is disabled. */
  disabled?: boolean;
  /** Accessible label. @default 'Segmented options' */
  'aria-label'?: string;
  /** Custom container class name. */
  className?: string;
}

/**
 * SegmentedControl provides a linear set of mutually exclusive options.
 * Smooth animated indicator pill, full keyboard roving focus, and responsive mobile adaptation.
 */
export const SegmentedControl = forwardRef<HTMLDivElement, SegmentedControlProps>(
  (
    {
      options,
      value: controlledValue,
      defaultValue,
      onChange,
      size = 'md',
      fullWidth = false,
      disabled = false,
      'aria-label': ariaLabel = 'Segmented options',
      className,
    },
    ref
  ) => {
    const isControlled = controlledValue !== undefined;
    const [internalValue, setInternalValue] = useState<string>(() => {
      if (defaultValue !== undefined) return defaultValue;
      return options[0]?.value || '';
    });

    const activeValue = isControlled ? controlledValue : internalValue;
    const containerRef = useRef<HTMLDivElement | null>(null);
    const optionRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

    const [indicatorStyle, setIndicatorStyle] = useState<{
      left: number;
      top: number;
      width: number;
      height: number;
      ready: boolean;
    }>({
      left: 0,
      top: 0,
      width: 0,
      height: 0,
      ready: false,
    });

    const updateIndicator = () => {
      const container = containerRef.current;
      const targetBtn = optionRefs.current.get(activeValue);

      if (container && targetBtn) {
        const containerRect = container.getBoundingClientRect();
        const targetRect = targetBtn.getBoundingClientRect();
        setIndicatorStyle({
          left: targetRect.left - containerRect.left + container.scrollLeft,
          top: targetRect.top - containerRect.top + container.scrollTop,
          width: targetRect.width,
          height: targetRect.height,
          ready: true,
        });
      }
    };

    useEffect(() => {
      updateIndicator();
      const container = containerRef.current;
      const targetBtn = optionRefs.current.get(activeValue);

      // On mobile, keep selected option visible within scrolling viewport
      if (container && targetBtn && typeof targetBtn.scrollIntoView === 'function') {
        targetBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
      }

      window.addEventListener('resize', updateIndicator);

      let ro: ResizeObserver | null = null;
      if (typeof ResizeObserver !== 'undefined' && container) {
        ro = new ResizeObserver(() => updateIndicator());
        ro.observe(container);
      }

      return () => {
        window.removeEventListener('resize', updateIndicator);
        ro?.disconnect();
      };
    }, [activeValue, options]);

    const selectOption = (val: string) => {
      if (disabled) return;
      if (!isControlled) {
        setInternalValue(val);
      }
      onChange?.(val);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
      if (disabled) return;

      const enabledOptions = options.filter((o) => !o.disabled);
      const currentIdx = enabledOptions.findIndex((o) => o.value === activeValue);

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        const nextIdx = (currentIdx + 1) % enabledOptions.length;
        const nextVal = enabledOptions[nextIdx]?.value;
        if (nextVal) {
          selectOption(nextVal);
          optionRefs.current.get(nextVal)?.focus();
        }
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        const prevIdx = (currentIdx - 1 + enabledOptions.length) % enabledOptions.length;
        const prevVal = enabledOptions[prevIdx]?.value;
        if (prevVal) {
          selectOption(prevVal);
          optionRefs.current.get(prevVal)?.focus();
        }
      } else if (e.key === 'Home') {
        e.preventDefault();
        const firstVal = enabledOptions[0]?.value;
        if (firstVal) {
          selectOption(firstVal);
          optionRefs.current.get(firstVal)?.focus();
        }
      } else if (e.key === 'End') {
        e.preventDefault();
        const lastVal = enabledOptions[enabledOptions.length - 1]?.value;
        if (lastVal) {
          selectOption(lastVal);
          optionRefs.current.get(lastVal)?.focus();
        }
      }
    };

    return (
      <div
        ref={(node) => {
          containerRef.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) (ref as any).current = node;
        }}
        role="radiogroup"
        aria-label={ariaLabel}
        onKeyDown={handleKeyDown}
        className={cn(
          'pui-segmented',
          `pui-segmented--${size}`,
          fullWidth && 'pui-segmented--full',
          disabled && 'pui-segmented--disabled',
          className
        )}
      >
        {/* Animated sliding background indicator */}
        <span
          className="pui-segmented__indicator"
          style={{
            transform: `translate3d(${indicatorStyle.left}px, ${indicatorStyle.top}px, 0)`,
            width: `${indicatorStyle.width}px`,
            height: `${indicatorStyle.height}px`,
            opacity: indicatorStyle.ready ? 1 : 0,
          }}
          aria-hidden="true"
        />

        {options.map((opt) => {
          const isSelected = opt.value === activeValue;
          const isOptDisabled = disabled || opt.disabled;

          return (
            <button
              key={opt.value}
              ref={(el) => {
                if (el) optionRefs.current.set(opt.value, el);
                else optionRefs.current.delete(opt.value);
              }}
              type="button"
              role="radio"
              aria-checked={isSelected}
              disabled={isOptDisabled}
              tabIndex={isSelected ? 0 : -1}
              className={cn(
                'pui-segmented__item',
                isSelected && 'pui-segmented__item--selected',
                isOptDisabled && 'pui-segmented__item--disabled'
              )}
              onClick={() => selectOption(opt.value)}
            >
              {opt.icon && <span className="pui-segmented__icon">{opt.icon}</span>}
              <span className="pui-segmented__label">{opt.label}</span>
            </button>
          );
        })}
      </div>
    );
  }
);

SegmentedControl.displayName = 'SegmentedControl';
