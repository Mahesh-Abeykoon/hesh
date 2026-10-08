import {
  forwardRef,
  useState,
  useRef,
  type InputHTMLAttributes,
  type ChangeEvent,
} from 'react';
import { cn } from '../utils/cn';
import { useControllableState } from '../hooks/useControllableState';

export interface ColorPickerProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'defaultValue' | 'onChange' | 'size'> {
  /** Current controlled color value (hex, e.g. '#6366f1'). */
  value?: string;
  /** Default uncontrolled color. */
  defaultValue?: string;
  /** Callback fired when color changes. */
  onChange?: (color: string) => void;
  /** Palette of quick-select preset colors. */
  presets?: string[];
  /** Size variant. @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  /** Whether the color picker is disabled. */
  disabled?: boolean;
}

const DEFAULT_PRESETS = [
  '#0f172a', '#475569', '#ef4444', '#f97316',
  '#eab308', '#22c55e', '#06b6d4', '#3b82f6',
  '#6366f1', '#a855f7', '#ec4899', '#ffffff',
];

/**
 * ColorPicker with interactive color swatch, preset palette, hex input, and native color dialog integration.
 */
export const ColorPicker = forwardRef<HTMLDivElement, ColorPickerProps>(function ColorPicker(
  {
    value: controlledValue,
    defaultValue = '#6366f1',
    onChange,
    presets = DEFAULT_PRESETS,
    size = 'md',
    disabled = false,
    className,
    ...props
  },
  ref
) {
  const [color, setColor] = useControllableState<string>({
    value: controlledValue,
    defaultValue,
    onChange,
  });

  const nativeInputRef = useRef<HTMLInputElement | null>(null);

  const handleHexChange = (e: ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.trim();
    if (!val.startsWith('#')) val = `#${val}`;
    setColor(val);
  };

  const handleNativeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setColor(e.target.value);
  };

  const openNativePicker = () => {
    if (disabled) return;
    nativeInputRef.current?.click();
  };

  return (
    <div
      ref={ref}
      className={cn(
        'pui-color-picker',
        `pui-color-picker--${size}`,
        disabled && 'pui-color-picker--disabled',
        className
      )}
    >
      {/* Hidden native color input for browser color wheel */}
      <input
        ref={nativeInputRef}
        type="color"
        value={color.length === 7 ? color : '#6366f1'}
        onChange={handleNativeChange}
        disabled={disabled}
        className="pui-color-picker__native"
        tabIndex={-1}
        aria-hidden="true"
      />

      <div className="pui-color-picker__input-row">
        {/* Clickable Swatch */}
        <button
          type="button"
          onClick={openNativePicker}
          disabled={disabled}
          className="pui-color-picker__swatch"
          style={{ backgroundColor: color }}
          title="Click to open color picker"
          aria-label={`Current color: ${color}`}
        />

        {/* Text hex input */}
        <input
          type="text"
          value={color}
          onChange={handleHexChange}
          disabled={disabled}
          maxLength={7}
          spellCheck={false}
          className="pui-color-picker__hex-input"
          {...props}
        />
      </div>

      {/* Preset Swatches Palette */}
      {presets && presets.length > 0 && (
        <div className="pui-color-picker__presets" role="radiogroup" aria-label="Preset colors">
          {presets.map((preset) => (
            <button
              key={preset}
              type="button"
              role="radio"
              aria-checked={color.toLowerCase() === preset.toLowerCase()}
              disabled={disabled}
              className={cn(
                'pui-color-picker__preset-btn',
                color.toLowerCase() === preset.toLowerCase() && 'pui-color-picker__preset-btn--selected'
              )}
              style={{ backgroundColor: preset }}
              onClick={() => setColor(preset)}
              title={preset}
              aria-label={preset}
            />
          ))}
        </div>
      )}
    </div>
  );
});

ColorPicker.displayName = 'ColorPicker';
