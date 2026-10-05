import {
  createContext,
  forwardRef,
  useContext,
  useRef,
  useState,
  useCallback,
  type HTMLAttributes,
  type ReactNode,
  type MouseEvent as ReactMouseEvent,
} from 'react';
import { cn } from '../utils/cn';

interface ResizableContextValue {
  direction: 'horizontal' | 'vertical';
  isDragging: boolean;
  startDragging: (index: number) => void;
}

const ResizableContext = createContext<ResizableContextValue | null>(null);

export interface ResizablePanelGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** Layout direction: 'horizontal' or 'vertical'. @default 'horizontal' */
  direction?: 'horizontal' | 'vertical';
  children: ReactNode;
}

/**
 * ResizablePanelGroup manages flexible, draggable split panels.
 */
export const ResizablePanelGroup = forwardRef<HTMLDivElement, ResizablePanelGroupProps>(
  function ResizablePanelGroup({ direction = 'horizontal', className, children, ...props }, ref) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const activeHandleRef = useRef<number | null>(null);

    const startDragging = useCallback((handleIndex: number) => {
      setIsDragging(true);
      activeHandleRef.current = handleIndex;

      const handleMouseMove = (e: globalThis.MouseEvent) => {
        if (!containerRef.current || activeHandleRef.current === null) return;
        const rect = containerRef.current.getBoundingClientRect();

        const panels = Array.from(
          containerRef.current.querySelectorAll<HTMLElement>(':scope > .pui-resizable__panel')
        );
        const idx = activeHandleRef.current;
        if (!panels[idx] || !panels[idx + 1]) return;

        let deltaPercentage: number;
        if (direction === 'horizontal') {
          const totalWidth = rect.width;
          const currentX = e.clientX - rect.left;
          deltaPercentage = Math.max(15, Math.min(85, (currentX / totalWidth) * 100));
        } else {
          const totalHeight = rect.height;
          const currentY = e.clientY - rect.top;
          deltaPercentage = Math.max(15, Math.min(85, (currentY / totalHeight) * 100));
        }

        const p1 = panels[idx];
        const p2 = panels[idx + 1];
        if (p1 && p2) {
          p1.style.flex = `${deltaPercentage} 1 0%`;
          p2.style.flex = `${100 - deltaPercentage} 1 0%`;
        }
      };

      const handleMouseUp = () => {
        setIsDragging(false);
        activeHandleRef.current = null;
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };

      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }, [direction]);

    return (
      <ResizableContext.Provider value={{ direction, isDragging, startDragging }}>
        <div
          ref={(node) => {
            containerRef.current = node;
            if (typeof ref === 'function') ref(node);
            else if (ref) (ref as any).current = node;
          }}
          className={cn(
            'pui-resizable',
            `pui-resizable--${direction}`,
            isDragging && 'pui-resizable--dragging',
            className
          )}
          {...props}
        >
          {children}
        </div>
      </ResizableContext.Provider>
    );
  }
);

ResizablePanelGroup.displayName = 'ResizablePanelGroup';

export interface ResizablePanelProps extends HTMLAttributes<HTMLDivElement> {
  /** Initial flex percentage (1-100). @default 50 */
  defaultSize?: number;
  /** Minimum flex percentage. @default 15 */
  minSize?: number;
  /** Maximum flex percentage. @default 85 */
  maxSize?: number;
  children?: ReactNode;
}

export const ResizablePanel = forwardRef<HTMLDivElement, ResizablePanelProps>(
  function ResizablePanel({ defaultSize = 50, minSize = 15, maxSize = 85, className, children, style, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={cn('pui-resizable__panel', className)}
        style={{
          flex: `${defaultSize} 1 0%`,
          ...style,
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ResizablePanel.displayName = 'ResizablePanel';

export interface ResizableHandleProps extends HTMLAttributes<HTMLDivElement> {
  /** Whether to render an explicit visual grip indicator icon. @default true */
  withHandle?: boolean;
  /** Whether the splitter handle is disabled. */
  disabled?: boolean;
  /** Index of the handle in the group. */
  index?: number;
}

export const ResizableHandle = forwardRef<HTMLDivElement, ResizableHandleProps>(
  function ResizableHandle({ withHandle = true, disabled = false, index = 0, className, ...props }, ref) {
    const ctx = useContext(ResizableContext);

    const handleMouseDown = (e: ReactMouseEvent<HTMLDivElement>) => {
      if (disabled || !ctx) return;
      e.preventDefault();
      ctx.startDragging(index);
    };

    return (
      <div
        ref={ref}
        role="separator"
        aria-orientation={ctx?.direction === 'vertical' ? 'horizontal' : 'vertical'}
        tabIndex={disabled ? -1 : 0}
        onMouseDown={handleMouseDown}
        className={cn(
          'pui-resizable__handle',
          disabled && 'pui-resizable__handle--disabled',
          className
        )}
        {...props}
      >
        {withHandle && (
          <div className="pui-resizable__handle-bar">
            <span className="pui-resizable__handle-grip" />
          </div>
        )}
      </div>
    );
  }
);

ResizableHandle.displayName = 'ResizableHandle';
