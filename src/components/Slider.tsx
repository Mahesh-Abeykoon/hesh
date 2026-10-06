import { useState, useRef, type ReactNode } from 'react';
import { cn } from '../utils/cn';
import { useControllableState } from '../hooks/useControllableState';

export interface SliderMark {
  value: number;
  label?: ReactNode;
}

export interface SliderProps {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  marks?: SliderMark[];
  showTooltip?: boolean;
  formatTooltip?: (val: number) => ReactNode;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  label?: string;
  className?: string;
}

export interface RangeSliderProps {
  value?: [number, number];
  defaultValue?: [number, number];
  onValueChange?: (value: [number, number]) => void;
  min?: number;
  max?: number;
  step?: number;
  marks?: SliderMark[];
  showTooltip?: boolean;
  formatTooltip?: (val: number) => ReactNode;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  label?: string;
  className?: string;
}

/**
 * Single-thumb slider on a native `<input type="range">`, visually restyled.
 * With marks, tooltip values, and size scales.
 */
export function Slider({
  value,
  defaultValue = 50,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  marks,
  showTooltip = false,
  formatTooltip = (v) => v,
  size = 'md',
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

  const pct = Math.min(100, Math.max(0, ((current - min) / (max - min || 1)) * 100));

  return (
    <div
      className={cn('pui-slider', `pui-slider--${size}`, className)}
      data-dragging={dragging || undefined}
      aria-disabled={disabled || undefined}
    >
      <div className="pui-slider__track">
        <div className="pui-slider__range" style={{ insetInlineStart: 0, width: `${pct}%` }} />
        {marks?.map((mark) => {
          const markPct = Math.min(100, Math.max(0, ((mark.value - min) / (max - min || 1)) * 100));
          return (
            <div
              key={mark.value}
              className="pui-slider__mark"
              data-active={mark.value <= current || undefined}
              style={{ left: `${markPct}%` }}
            />
          );
        })}
      </div>

      <div className="pui-slider__thumb" style={{ insetInlineStart: `${pct}%` }} aria-hidden="true">
        {showTooltip && (
          <div className="pui-slider__tooltip">
            {formatTooltip(current)}
          </div>
        )}
      </div>

      {marks?.map((mark) => {
        if (!mark.label) return null;
        const markPct = Math.min(100, Math.max(0, ((mark.value - min) / (max - min || 1)) * 100));
        return (
          <div
            key={`lbl-${mark.value}`}
            className="pui-slider__mark-label"
            style={{ left: `${markPct}%` }}
          >
            {mark.label}
          </div>
        );
      })}

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
          zIndex: 3,
        }}
      />
    </div>
  );
}

/**
 * Dual-thumb RangeSlider for min/max intervals (e.g., pricing filters).
 */
export function RangeSlider({
  value,
  defaultValue = [20, 80],
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  marks,
  showTooltip = false,
  formatTooltip = (v) => v,
  size = 'md',
  disabled = false,
  label,
  className,
}: RangeSliderProps) {
  const [current, setCurrent] = useControllableState<[number, number]>({
    value,
    defaultValue,
    onChange: onValueChange,
  });
  const [dragging, setDragging] = useState<'min' | 'max' | null>(null);

  const minPct = Math.min(100, Math.max(0, ((current[0] - min) / (max - min || 1)) * 100));
  const maxPct = Math.min(100, Math.max(0, ((current[1] - min) / (max - min || 1)) * 100));

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.min(Number(e.target.value), current[1] - step);
    setCurrent([val, current[1]]);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.max(Number(e.target.value), current[0] + step);
    setCurrent([current[0], val]);
  };

  return (
    <div
      className={cn('pui-slider', `pui-slider--${size}`, className)}
      data-dragging={Boolean(dragging) || undefined}
      aria-disabled={disabled || undefined}
      style={{ position: 'relative' }}
    >
      <div className="pui-slider__track">
        <div
          className="pui-slider__range"
          style={{ insetInlineStart: `${minPct}%`, width: `${maxPct - minPct}%` }}
        />
        {marks?.map((mark) => {
          const markPct = Math.min(100, Math.max(0, ((mark.value - min) / (max - min || 1)) * 100));
          const inRange = mark.value >= current[0] && mark.value <= current[1];
          return (
            <div
              key={mark.value}
              className="pui-slider__mark"
              data-active={inRange || undefined}
              style={{ left: `${markPct}%` }}
            />
          );
        })}
      </div>

      {/* Min Thumb */}
      <div
        className="pui-slider__thumb"
        style={{ insetInlineStart: `${minPct}%` }}
        aria-hidden="true"
      >
        {showTooltip && (
          <div className="pui-slider__tooltip">
            {formatTooltip(current[0])}
          </div>
        )}
      </div>

      {/* Max Thumb */}
      <div
        className="pui-slider__thumb"
        style={{ insetInlineStart: `${maxPct}%` }}
        aria-hidden="true"
      >
        {showTooltip && (
          <div className="pui-slider__tooltip">
            {formatTooltip(current[1])}
          </div>
        )}
      </div>

      {marks?.map((mark) => {
        if (!mark.label) return null;
        const markPct = Math.min(100, Math.max(0, ((mark.value - min) / (max - min || 1)) * 100));
        return (
          <div
            key={`lbl-${mark.value}`}
            className="pui-slider__mark-label"
            style={{ left: `${markPct}%` }}
          >
            {mark.label}
          </div>
        );
      })}

      {/* Native Min Input */}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={current[0]}
        disabled={disabled}
        aria-label={label ? `${label} minimum` : 'Minimum value'}
        onChange={handleMinChange}
        onPointerDown={() => setDragging('min')}
        onPointerUp={() => setDragging(null)}
        onBlur={() => setDragging(null)}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          opacity: 0,
          cursor: disabled ? 'not-allowed' : 'pointer',
          margin: 0,
          zIndex: current[0] > max - 10 ? 5 : 3,
        }}
      />

      {/* Native Max Input */}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={current[1]}
        disabled={disabled}
        aria-label={label ? `${label} maximum` : 'Maximum value'}
        onChange={handleMaxChange}
        onPointerDown={() => setDragging('max')}
        onPointerUp={() => setDragging(null)}
        onBlur={() => setDragging(null)}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          opacity: 0,
          cursor: disabled ? 'not-allowed' : 'pointer',
          margin: 0,
          zIndex: 4,
        }}
      />
    </div>
  );
}
