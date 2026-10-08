import React, { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../utils/cn';
import { CheckIcon } from './icons';

export interface StepItem {
  /** Title of the step. */
  title: ReactNode;
  /** Optional secondary subtitle or explanation. */
  description?: ReactNode;
  /** Optional custom step icon. */
  icon?: ReactNode;
  /** Optional custom status override. */
  status?: 'completed' | 'current' | 'upcoming' | 'error';
  /** Whether this individual step is disabled for click navigation. */
  disabled?: boolean;
}

export interface StepperProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Array of step definitions. */
  steps: readonly StepItem[];
  /** Zero-based index of the currently active step. */
  current: number;
  /** Callback fired when a step indicator is clicked. */
  onChange?: (stepIndex: number) => void;
  /** Layout orientation. @default 'horizontal' */
  orientation?: 'horizontal' | 'vertical';
  /** Size variant. @default 'md' */
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Stepper displays a sequence of numbered or icon stages in a multi-step workflow.
 * Completely responsive across vertical and horizontal configurations for mobile and desktop.
 */
export const Stepper = forwardRef<HTMLDivElement, StepperProps>(
  (
    {
      steps,
      current,
      onChange,
      orientation = 'horizontal',
      size = 'md',
      className,
      ...props
    },
    ref
  ) => {
    return (
      <nav
        ref={ref}
        aria-label="Progress"
        className={cn(
          'pui-stepper',
          `pui-stepper--${orientation}`,
          `pui-stepper--${size}`,
          className
        )}
        {...props}
      >
        <ol className="pui-stepper__list">
          {steps.map((step, idx) => {
            const isClickable = Boolean(onChange && !step.disabled && idx <= current);
            const status =
              step.status ||
              (idx < current ? 'completed' : idx === current ? 'current' : 'upcoming');
            const isCompleted = idx < current || step.status === 'completed';

            return (
              <React.Fragment key={idx}>
                <li
                  className={cn('pui-stepper__item', `pui-stepper__item--${status}`)}
                  aria-current={status === 'current' ? 'step' : undefined}
                >
                  <button
                    type="button"
                    disabled={!isClickable}
                    className={cn(
                      'pui-stepper__button',
                      isClickable && 'pui-stepper__button--clickable'
                    )}
                    onClick={() => isClickable && onChange?.(idx)}
                  >
                    <span className="pui-stepper__indicator" aria-hidden="true">
                      {status === 'completed' ? (
                        step.icon || <CheckIcon size={14} />
                      ) : (
                        step.icon || <span className="pui-stepper__number">{idx + 1}</span>
                      )}
                    </span>

                    <span className="pui-stepper__content">
                      <span className="pui-stepper__title">{step.title}</span>
                      {step.description && (
                        <span className="pui-stepper__description">{step.description}</span>
                      )}
                    </span>
                  </button>
                </li>

                {idx < steps.length - 1 && (
                  <li
                    className={cn(
                      'pui-stepper__connector-item',
                      isCompleted && 'pui-stepper__connector-item--active'
                    )}
                    aria-hidden="true"
                  >
                    <div className="pui-stepper__connector" />
                  </li>
                )}
              </React.Fragment>
            );
          })}
        </ol>
      </nav>
    );
  }
);

Stepper.displayName = 'Stepper';
