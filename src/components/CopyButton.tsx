import {
  forwardRef,
  useState,
  type ButtonHTMLAttributes,
  type ReactNode,
} from 'react';
import { cn } from '../utils/cn';
import { CheckIcon, CopyIcon } from './icons';

export interface CopyButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Text content to be copied to the clipboard. */
  value: string;
  /** Duration in ms for the copied state before resetting. @default 2000 */
  timeout?: number;
  /** Size variant. @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  /** Visual variant. @default 'ghost' */
  variant?: 'ghost' | 'outline' | 'secondary' | 'solid';
  /** Optional custom label next to icon. */
  label?: ReactNode;
  /** Callback fired upon successful copy. */
  onCopySuccess?: (copiedValue: string) => void;
}

/**
 * CopyButton provides a one-click clipboard copy action with instant checkmark feedback.
 */
export const CopyButton = forwardRef<HTMLButtonElement, CopyButtonProps>(function CopyButton(
  {
    value,
    timeout = 2000,
    size = 'md',
    variant = 'ghost',
    label,
    onCopySuccess,
    className,
    disabled = false,
    onClick,
    ...props
  },
  ref
) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      onCopySuccess?.(value);
      setTimeout(() => setCopied(false), timeout);
    } catch (err) {
      console.error('Failed to copy to clipboard', err);
    }
    onClick?.(e);
  };

  return (
    <button
      ref={ref}
      type="button"
      disabled={disabled}
      aria-label={copied ? 'Copied to clipboard' : 'Copy to clipboard'}
      data-copied={copied || undefined}
      onClick={handleCopy}
      className={cn(
        'pui-copy-btn',
        `pui-copy-btn--${variant}`,
        `pui-copy-btn--${size}`,
        copied && 'pui-copy-btn--copied',
        className
      )}
      {...props}
    >
      <span className="pui-copy-btn__icon" aria-hidden="true">
        {copied ? <CheckIcon /> : <CopyIcon />}
      </span>
      {label && <span className="pui-copy-btn__label">{copied ? 'Copied!' : label}</span>}
    </button>
  );
});

CopyButton.displayName = 'CopyButton';
