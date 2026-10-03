import { useState } from 'react';
import { cn } from '../utils/cn';
import { useControllableState } from '../hooks/useControllableState';

export interface SliderProps {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  label?: string;
  className?: string;
}

/**
 * Single-thumb slider on a native `<input type="range">`, visually restyled.
 *
 * The native input stays in the DOM (transparent, on top) so dragging,
 * keyboard arrows, PageUp/Down, Home/End and touch all work for free — and
 * `aria-valuenow` is reported correctly without custom ARIA.
 */
export function Slider({
  value,
  defaultValue = 50,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  label,
  className,
}: SliderProps) {
  const [current, setCurrent] = useControllableState<number>({
    value,
    defaultValue,
    onChange: onValueChange,
  });
  const [dragging, setDragging] = useState(false);

  const pct = ((current - min) / (max - min || 1)) * 100;

  return (
    <div
      className={cn('pui-slider', className)}
      data-dragging={dragging || undefined}
      aria-disabled={disabled || undefined}
    >
      <div className="pui-slider__track">
        <div className="pui-slider__range" style={{ insetInlineStart: 0, width: `${pct}%` }} />
      </div>
      <div className="pui-slider__thumb" style={{ insetInlineStart: `${pct}%` }} aria-hidden="true" />
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={current}
        disabled={disabled}
        aria-label={label}
        aria-valuetext={label ? undefined : String(current)}
        onChange={(event) => setCurrent(Number(event.target.value))}
        onPointerDown={() => setDragging(true)}
        onPointerUp={() => setDragging(false)}
        onBlur={() => setDragging(false)}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          opacity: 0,
          cursor: disabled ? 'not-allowed' : 'pointer',
          margin: 0,
        }}
      />
    </div>
  );
}
