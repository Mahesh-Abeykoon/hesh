import React, {
  forwardRef,
  useRef,
  useState,
  useEffect,
  type ReactNode,
  type HTMLAttributes,
} from 'react';
import { ChevronUpIcon, ChevronDownIcon, PlusIcon, MinusIcon } from './icons';
import { cn } from '../utils/cn';

export interface NumberInputProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'prefix'> {
  value?: number;
  defaultValue?: number;
  onChange?: (val: number | undefined) => void;
  min?: number;
  max?: number;
  step?: number;
  precision?: number;
  allowNegative?: boolean;
  prefix?: ReactNode;
  suffix?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  stepperPosition?: 'right' | 'split';
  disabled?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  name?: string;
  id?: string;
  required?: boolean;
  invalid?: boolean;
}

export const NumberInput = forwardRef<HTMLDivElement, NumberInputProps>(function NumberInput(
  {
    value: controlledValue,
    defaultValue,
    onChange,
    min,
    max,
    step = 1,
    precision,
    allowNegative = true,
    prefix,
    suffix,
    size = 'md',
    stepperPosition = 'right',
    disabled = false,
    readOnly = false,
    placeholder,
    name,
    id,
    required = false,
    invalid = false,
    className,
    ...props
  },
  ref
) {
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState<number | undefined>(
    defaultValue ?? controlledValue
  );
  const currentValue = isControlled ? controlledValue : internalValue;

  const [textValue, setTextValue] = useState<string>(
    currentValue !== undefined ? String(currentValue) : ''
  );

  useEffect(() => {
    if (isControlled) {
      setTextValue(controlledValue !== undefined ? String(controlledValue) : '');
    }
  }, [controlledValue, isControlled]);

  const clampAndRound = (num: number): number => {
    let result = num;
    if (min !== undefined && result < min) result = min;
    if (max !== undefined && result > max) result = max;
    if (precision !== undefined) {
      result = Number(result.toFixed(precision));
    }
    return result;
  };

  const updateValue = (newVal: number | undefined) => {
    if (disabled || readOnly) return;
    if (newVal !== undefined) {
      newVal = clampAndRound(newVal);
      setTextValue(String(newVal));
    } else {
      setTextValue('');
    }
    if (!isControlled) {
      setInternalValue(newVal);
    }
    onChange?.(newVal);
  };

  const handleStep = (direction: 'up' | 'down', multiplier = 1) => {
    const current = currentValue ?? min ?? 0;
    const delta = step * multiplier * (direction === 'up' ? 1 : -1);
    updateValue(current + delta);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (!allowNegative && val.includes('-')) return;
    setTextValue(val);
    const parsed = parseFloat(val);
    if (!isNaN(parsed)) {
      if (!isControlled) {
        setInternalValue(parsed);
      }
      onChange?.(parsed);
    } else if (val === '' || val === '-') {
      if (!isControlled) {
        setInternalValue(undefined);
      }
      onChange?.(undefined);
    }
  };

  const handleBlur = () => {
    if (textValue.trim() === '') {
      updateValue(undefined);
    } else {
      const parsed = parseFloat(textValue);
      if (!isNaN(parsed)) {
        updateValue(parsed);
      } else {
        updateValue(currentValue);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled || readOnly) return;
    const mult = e.shiftKey ? 10 : 1;
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      handleStep('up', mult);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      handleStep('down', mult);
    } else if (e.key === 'Home' && min !== undefined) {
      e.preventDefault();
      updateValue(min);
    } else if (e.key === 'End' && max !== undefined) {
      e.preventDefault();
      updateValue(max);
    }
  };

  const timerRef = useRef<number | null>(null);
  const startStepping = (direction: 'up' | 'down') => {
    if (disabled || readOnly) return;
    handleStep(direction);
    timerRef.current = window.setInterval(() => {
      handleStep(direction);
    }, 120);
  };

  const stopStepping = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  return (
    <div
      ref={ref}
      className={cn(
        'hesh-number-input',
        `hesh-number-input--${size}`,
        `hesh-number-input--stepper-${stepperPosition}`,
        disabled && 'hesh-number-input--disabled',
        readOnly && 'hesh-number-input--readonly',
        invalid && 'hesh-number-input--invalid',
        className
      )}
      {...props}
    >
      {stepperPosition === 'split' && (
        <button
          type="button"
          tabIndex={-1}
          disabled={disabled || readOnly || (min !== undefined && currentValue !== undefined && currentValue <= min)}
          onMouseDown={() => startStepping('down')}
          onMouseUp={stopStepping}
          onMouseLeave={stopStepping}
          aria-label="Decrement"
          className="hesh-number-input__btn hesh-number-input__btn--split-left"
        >
          <MinusIcon size={14} />
        </button>
      )}

      <div className="hesh-number-input__field">
        {prefix && <span className="hesh-number-input__prefix">{prefix}</span>}
        <input
          id={id}
          name={name}
          type="text"
          inputMode="decimal"
          role="spinbutton"
          aria-valuenow={currentValue}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-invalid={invalid}
          aria-required={required}
          disabled={disabled}
          readOnly={readOnly}
          placeholder={placeholder}
          value={textValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="hesh-number-input__input"
        />
        {suffix && <span className="hesh-number-input__suffix">{suffix}</span>}
      </div>

      {stepperPosition === 'split' ? (
        <button
          type="button"
          tabIndex={-1}
          disabled={disabled || readOnly || (max !== undefined && currentValue !== undefined && currentValue >= max)}
          onMouseDown={() => startStepping('up')}
          onMouseUp={stopStepping}
          onMouseLeave={stopStepping}
          aria-label="Increment"
          className="hesh-number-input__btn hesh-number-input__btn--split-right"
        >
          <PlusIcon size={14} />
        </button>
      ) : (
        <div className="hesh-number-input__steppers">
          <button
            type="button"
            tabIndex={-1}
            disabled={disabled || readOnly || (max !== undefined && currentValue !== undefined && currentValue >= max)}
            onMouseDown={() => startStepping('up')}
            onMouseUp={stopStepping}
            onMouseLeave={stopStepping}
            aria-label="Increment"
            className="hesh-number-input__stepper hesh-number-input__stepper--up"
          >
            <ChevronUpIcon size={12} />
          </button>
          <button
            type="button"
            tabIndex={-1}
            disabled={disabled || readOnly || (min !== undefined && currentValue !== undefined && currentValue <= min)}
            onMouseDown={() => startStepping('down')}
            onMouseUp={stopStepping}
            onMouseLeave={stopStepping}
            aria-label="Decrement"
            className="hesh-number-input__stepper hesh-number-input__stepper--down"
          >
            <ChevronDownIcon size={12} />
          </button>
        </div>
      )}
    </div>
  );
});
