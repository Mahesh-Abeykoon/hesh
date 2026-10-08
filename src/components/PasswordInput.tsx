import React, {
  forwardRef,
  useState,
  useId,
  type InputHTMLAttributes,
} from 'react';
import { EyeIcon, EyeOffIcon, CheckIcon } from './icons';
import { cn } from '../utils/cn';

export interface PasswordRequirement {
  label: string;
  test: (val: string) => boolean;
}

export const DEFAULT_PASSWORD_REQUIREMENTS: PasswordRequirement[] = [
  { label: 'At least 8 characters', test: (val) => val.length >= 8 },
  { label: 'At least 1 uppercase letter', test: (val) => /[A-Z]/.test(val) },
  { label: 'At least 1 number', test: (val) => /[0-9]/.test(val) },
  { label: 'At least 1 special character', test: (val) => /[^A-Za-z0-9]/.test(val) },
];

export interface PasswordInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  showToggle?: boolean;
  strengthMeter?: boolean;
  showRequirements?: boolean;
  requirements?: PasswordRequirement[];
  size?: 'sm' | 'md' | 'lg';
  invalid?: boolean;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(function PasswordInput(
  {
    value: controlledValue,
    defaultValue,
    onChange,
    showToggle = true,
    strengthMeter = false,
    showRequirements = false,
    requirements = DEFAULT_PASSWORD_REQUIREMENTS,
    size = 'md',
    invalid = false,
    disabled = false,
    className,
    id: customId,
    ...props
  },
  ref
) {
  const [internalValue, setInternalValue] = useState<string>(
    typeof defaultValue === 'string' ? defaultValue : ''
  );
  const [visible, setVisible] = useState(false);
  const generatedId = useId();
  const inputId = customId ?? generatedId;

  const currentValue =
    typeof controlledValue === 'string' ? controlledValue : internalValue;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (controlledValue === undefined) {
      setInternalValue(e.target.value);
    }
    onChange?.(e);
  };

  // Calculate score based on passed requirements
  const metCount = requirements.reduce(
    (acc, req) => (req.test(currentValue) ? acc + 1 : acc),
    0
  );
  const strengthPercent = requirements.length > 0 ? (metCount / requirements.length) * 100 : 0;

  const getStrengthTier = () => {
    if (!currentValue) return { label: '', tone: 'neutral' };
    if (strengthPercent <= 25) return { label: 'Weak', tone: 'danger' };
    if (strengthPercent <= 50) return { label: 'Fair', tone: 'warning' };
    if (strengthPercent <= 75) return { label: 'Good', tone: 'primary' };
    return { label: 'Strong', tone: 'success' };
  };

  const tier = getStrengthTier();

  return (
    <div className={cn('hesh-password-input-wrap', className)}>
      <div
        className={cn(
          'hesh-password-input',
          `hesh-password-input--${size}`,
          disabled && 'hesh-password-input--disabled',
          invalid && 'hesh-password-input--invalid'
        )}
      >
        <input
          ref={ref}
          id={inputId}
          type={visible ? 'text' : 'password'}
          value={controlledValue !== undefined ? controlledValue : internalValue}
          onChange={handleChange}
          disabled={disabled}
          aria-invalid={invalid}
          className="hesh-password-input__field"
          {...props}
        />

        {showToggle && (
          <button
            type="button"
            disabled={disabled}
            aria-label={visible ? 'Hide password' : 'Show password'}
            onClick={() => setVisible(!visible)}
            className="hesh-password-input__toggle"
          >
            {visible ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
          </button>
        )}
      </div>

      {strengthMeter && currentValue.length > 0 && (
        <div className="hesh-password-meter" aria-live="polite">
          <div className="hesh-password-meter__bars">
            {requirements.map((_, idx) => {
              const active = idx < metCount;
              return (
                <div
                  key={idx}
                  className={cn(
                    'hesh-password-meter__bar',
                    active && `hesh-password-meter__bar--${tier.tone}`
                  )}
                />
              );
            })}
          </div>
          <div className="hesh-password-meter__label-row">
            <span className="hesh-password-meter__label">Password strength:</span>
            <span className={cn('hesh-password-meter__tier', `hesh-password-meter__tier--${tier.tone}`)}>
              {tier.label}
            </span>
          </div>
        </div>
      )}

      {showRequirements && (
        <ul className="hesh-password-requirements">
          {requirements.map((req, idx) => {
            const isMet = req.test(currentValue);
            return (
              <li
                key={idx}
                className={cn(
                  'hesh-password-requirement-item',
                  isMet && 'hesh-password-requirement-item--met'
                )}
              >
                <span className="hesh-password-requirement-item__icon">
                  {isMet ? <CheckIcon size={12} /> : <span className="hesh-password-requirement-item__bullet" />}
                </span>
                <span>{req.label}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
});
