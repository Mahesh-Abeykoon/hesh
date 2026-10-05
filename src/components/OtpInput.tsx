import React, {
  forwardRef,
  useRef,
  useState,
  useEffect,
  type KeyboardEvent,
  type ClipboardEvent,
  type ChangeEvent,
} from 'react';
import { cn } from '../utils/cn';

export interface OtpInputProps {
  /** Number of verification code slots. @default 6 */
  length?: number;
  /** Value of the code (controlled). */
  value?: string;
  /** Default value (uncontrolled). */
  defaultValue?: string;
  /** Callback fired whenever the entered code changes. */
  onChange?: (value: string) => void;
  /** Callback fired automatically when all slots are filled. */
  onComplete?: (value: string) => void;
  /** Input type allowed. @default 'numeric' */
  type?: 'numeric' | 'alphanumeric';
  /** Whether to mask the input for password/PIN privacy. @default false */
  mask?: boolean;
  /** Whether the inputs are disabled. */
  disabled?: boolean;
  /** Whether the field is in an invalid/error state. */
  invalid?: boolean;
  /** Accessible label for screen readers. @default 'Verification code' */
  'aria-label'?: string;
  /** Additional container CSS class. */
  className?: string;
}

/**
 * OtpInput provides a multi-digit input for 2FA, OTP, and PIN verification.
 * Automatically advances focus, supports copy-paste splitting, and provides full mobile responsiveness.
 */
export const OtpInput = forwardRef<HTMLDivElement, OtpInputProps>(
  (
    {
      length = 6,
      value: controlledValue,
      defaultValue = '',
      onChange,
      onComplete,
      type = 'numeric',
      mask = false,
      disabled = false,
      invalid = false,
      'aria-label': ariaLabel = 'Verification code',
      className,
    },
    ref
  ) => {
    const isControlled = controlledValue !== undefined;
    const [internalValue, setInternalValue] = useState(() => defaultValue.slice(0, length));
    const currentVal = isControlled ? controlledValue.slice(0, length) : internalValue;

    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const chars = Array.from({ length }, (_, i) => currentVal[i] || '');

    const isValidChar = (char: string) => {
      if (type === 'numeric') return /^[0-9]$/.test(char);
      return /^[a-zA-Z0-9]$/.test(char);
    };

    const updateValue = (newVal: string) => {
      if (!isControlled) {
        setInternalValue(newVal);
      }
      onChange?.(newVal);
      if (newVal.length === length) {
        onComplete?.(newVal);
      }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
      const incoming = e.target.value;
      if (!incoming) return;

      const lastChar = incoming[incoming.length - 1] || '';
      if (!isValidChar(lastChar)) return;

      const newChars = [...chars];
      newChars[index] = lastChar;
      const joined = newChars.join('');
      updateValue(joined);

      // Advance to next slot if available
      if (index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
      if (e.key === 'Backspace') {
        e.preventDefault();
        const newChars = [...chars];

        if (newChars[index]) {
          newChars[index] = '';
          updateValue(newChars.join(''));
        } else if (index > 0) {
          newChars[index - 1] = '';
          updateValue(newChars.join(''));
          inputRefs.current[index - 1]?.focus();
        }
      } else if (e.key === 'ArrowLeft' && index > 0) {
        e.preventDefault();
        inputRefs.current[index - 1]?.focus();
      } else if (e.key === 'ArrowRight' && index < length - 1) {
        e.preventDefault();
        inputRefs.current[index + 1]?.focus();
      }
    };

    const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const pasted = e.clipboardData.getData('text/plain').trim();
      const filtered = pasted
        .split('')
        .filter(isValidChar)
        .slice(0, length)
        .join('');

      if (!filtered) return;

      updateValue(filtered);

      const nextFocus = Math.min(filtered.length, length - 1);
      inputRefs.current[nextFocus]?.focus();
    };

    return (
      <div
        ref={ref}
        role="group"
        aria-label={ariaLabel}
        className={cn('pui-otp-input', invalid && 'pui-otp-input--invalid', className)}
      >
        {chars.map((char, i) => (
          <input
            key={i}
            ref={(el) => {
              inputRefs.current[i] = el;
            }}
            type={mask ? 'password' : 'text'}
            inputMode={type === 'numeric' ? 'numeric' : 'text'}
            pattern={type === 'numeric' ? '[0-9]*' : '[a-zA-Z0-9]*'}
            autoComplete="one-time-code"
            maxLength={1}
            value={char}
            disabled={disabled}
            aria-label={`Digit ${i + 1} of ${length}`}
            className={cn('pui-otp-slot', char && 'pui-otp-slot--filled')}
            onChange={(e) => handleChange(e, i)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            onPaste={handlePaste}
            onFocus={(e) => e.target.select()}
          />
        ))}
      </div>
    );
  }
);

OtpInput.displayName = 'OtpInput';
