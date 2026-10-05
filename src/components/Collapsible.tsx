import {
  createContext,
  forwardRef,
  useContext,
  useId,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { cn } from '../utils/cn';
import { useControllableState } from '../hooks/useControllableState';

interface CollapsibleContextValue {
  open: boolean;
  toggle: () => void;
  disabled?: boolean;
  contentId: string;
}

const CollapsibleContext = createContext<CollapsibleContextValue | null>(null);

export interface CollapsibleProps extends HTMLAttributes<HTMLDivElement> {
  /** Controlled open state. */
  open?: boolean;
  /** Default open state when uncontrolled. */
  defaultOpen?: boolean;
  /** Callback fired when open state changes. */
  onOpenChange?: (open: boolean) => void;
  /** Whether the collapsible is disabled. */
  disabled?: boolean;
  children: ReactNode;
}

/**
 * Collapsible provides an interactive disclosure container that can expand or collapse.
 */
export const Collapsible = forwardRef<HTMLDivElement, CollapsibleProps>(function Collapsible(
  {
    open: controlledOpen,
    defaultOpen = false,
    onOpenChange,
    disabled = false,
    className,
    children,
    ...props
  },
  ref
) {
  const [open, setOpen] = useControllableState<boolean>({
    value: controlledOpen,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });

  const contentId = useId();

  const toggle = () => {
    if (disabled) return;
    setOpen(!open);
  };

  return (
    <CollapsibleContext.Provider value={{ open, toggle, disabled, contentId }}>
      <div
        ref={ref}
        data-state={open ? 'open' : 'closed'}
        className={cn('pui-collapsible', open && 'pui-collapsible--open', className)}
        {...props}
      >
        {children}
      </div>
    </CollapsibleContext.Provider>
  );
});

Collapsible.displayName = 'Collapsible';

export interface CollapsibleTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
}

export const CollapsibleTrigger = forwardRef<HTMLButtonElement, CollapsibleTriggerProps>(
  function CollapsibleTrigger({ className, children, onClick, ...props }, ref) {
    const ctx = useContext(CollapsibleContext);
    if (!ctx) throw new Error('CollapsibleTrigger must be used within a Collapsible');

    return (
      <button
        ref={ref}
        type="button"
        aria-expanded={ctx.open}
        aria-controls={ctx.contentId}
        disabled={ctx.disabled || props.disabled}
        data-state={ctx.open ? 'open' : 'closed'}
        onClick={(e) => {
          ctx.toggle();
          onClick?.(e);
        }}
        className={cn('pui-collapsible__trigger', className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

CollapsibleTrigger.displayName = 'CollapsibleTrigger';

export interface CollapsibleContentProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export const CollapsibleContent = forwardRef<HTMLDivElement, CollapsibleContentProps>(
  function CollapsibleContent({ className, children, ...props }, ref) {
    const ctx = useContext(CollapsibleContext);
    if (!ctx) throw new Error('CollapsibleContent must be used within a Collapsible');

    if (!ctx.open) return null;

    return (
      <div
        ref={ref}
        id={ctx.contentId}
        data-state={ctx.open ? 'open' : 'closed'}
        className={cn('pui-collapsible__content', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CollapsibleContent.displayName = 'CollapsibleContent';
