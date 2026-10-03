import { useId, type ReactNode } from 'react';
import { cn } from '../utils/cn';
import { useControllableState } from '../hooks/useControllableState';
import { ChevronDownIcon } from './icons';

export interface AccordionItem {
  id: string;
  title: ReactNode;
  content: ReactNode;
  disabled?: boolean;
}

export interface AccordionProps {
  items: AccordionItem[];
  /** Controlled or uncontrolled list of open ids. */
  open?: string[];
  defaultOpen?: string[];
  onOpenChange?: (open: string[]) => void;
  /** Allow more than one panel open at a time. */
  multiple?: boolean;
  className?: string;
}

/**
 * Buttons carry `aria-expanded` and `aria-controls`; panels carry
 * `role="region"` + `aria-labelledby`. That pairing is what lets a screen
 * reader announce "collapsed / expanded" as the user toggles.
 */
export function Accordion({
  items,
  open,
  defaultOpen = [],
  onOpenChange,
  multiple = false,
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
    <div className={cn('pui-accordion', className)}>
      {items.map((item) => {
        const isOpen = state.includes(item.id);
        return (
          <div key={item.id} className="pui-accordion__item">
            <h3>
              <button
                type="button"
                className="pui-accordion__trigger"
                aria-expanded={isOpen}
                aria-controls={`${baseId}-panel-${item.id}`}
                id={`${baseId}-trigger-${item.id}`}
                disabled={item.disabled}
                onClick={() => toggle(item.id)}
              >
                {item.title}
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
