import React, { useId, type ReactNode } from 'react';
import { cn } from '../utils/cn';
import { useControllableState } from '../hooks/useControllableState';
import { ChevronDownIcon } from './icons';

export interface AccordionItem {
  id: string;
  title: ReactNode;
  content: ReactNode;
  /** Sub-caption displayed beneath title. */
  subtitle?: ReactNode;
  /** Leading icon indicator. */
  icon?: ReactNode;
  /** Trailing tag or status badge. */
  badge?: ReactNode;
  disabled?: boolean;
}

export interface AccordionProps {
  items: AccordionItem[];
  /** Controlled or uncontrolled list of open item ids. */
  open?: string[];
  defaultOpen?: string[];
  onOpenChange?: (open: string[]) => void;
  /** Allow more than one panel open simultaneously. @default false */
  multiple?: boolean;
  /** Visual presentation style. @default 'default' */
  variant?: 'default' | 'bordered' | 'separated' | 'pills';
  /** Size scale of trigger padding and typography. @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Buttons carry `aria-expanded` and `aria-controls`; panels carry
 * `role="region"` + `aria-labelledby`. That pairing lets screen readers
 * announce "collapsed / expanded" as the user toggles.
 */
export function Accordion({
  items,
  open,
  defaultOpen = [],
  onOpenChange,
  multiple = false,
  variant = 'default',
  size = 'md',
  className,
}: AccordionProps) {
  const [state, setState] = useControllableState<string[]>({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });

  const toggle = (id: string) => {
    setState((prev) => {
      const isOpen = prev.includes(id);
      if (multiple) return isOpen ? prev.filter((v) => v !== id) : [...prev, id];
      return isOpen ? [] : [id];
    });
  };

  const baseId = useId();

  return (
    <div
      className={cn(
        'pui-accordion',
        `pui-accordion--${variant}`,
        `pui-accordion--${size}`,
        className
      )}
    >
      {items.map((item) => {
        const isOpen = state.includes(item.id);
        return (
          <div
            key={item.id}
            className={cn('pui-accordion__item', isOpen && 'pui-accordion__item--open')}
          >
            <h3 style={{ margin: 0 }}>
              <button
                type="button"
                className="pui-accordion__trigger"
                aria-expanded={isOpen}
                aria-controls={`${baseId}-panel-${item.id}`}
                id={`${baseId}-trigger-${item.id}`}
                disabled={item.disabled}
                onClick={() => toggle(item.id)}
              >
                {item.icon && <span className="pui-accordion__icon">{item.icon}</span>}
                <div className="pui-accordion__text-wrap">
                  <span className="pui-accordion__title">{item.title}</span>
                  {item.subtitle && (
                    <span className="pui-accordion__subtitle">{item.subtitle}</span>
                  )}
                </div>
                {item.badge && <span className="pui-accordion__badge">{item.badge}</span>}
                <span className="pui-accordion__trigger-icon" aria-hidden="true">
                  <ChevronDownIcon />
                </span>
              </button>
            </h3>
            {isOpen && (
              <div
                id={`${baseId}-panel-${item.id}`}
                role="region"
                aria-labelledby={`${baseId}-trigger-${item.id}`}
                className="pui-accordion__panel"
              >
                <div className="pui-accordion__panel-inner">{item.content}</div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
