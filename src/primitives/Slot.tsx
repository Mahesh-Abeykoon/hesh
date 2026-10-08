import * as React from 'react';
import { cn } from '../utils/cn';

/** Compose multiple refs into a single callback ref. */
export function composeRefs<T>(...refs: Array<React.Ref<T> | undefined>) {
  return (node: T | null) => {
    for (const ref of refs) {
      if (typeof ref === 'function') ref(node);
      else if (ref) (ref as React.MutableRefObject<T | null>).current = node;
    }
  };
}

const REACT_MAJOR = parseInt(React.version || '18', 10);

function getElementRef(element: React.ReactElement): React.Ref<unknown> | undefined {
  // React 19 exposes `ref` as a prop; React 18 keeps it on the element object.
  if (REACT_MAJOR >= 19) return (element.props as { ref?: React.Ref<unknown> }).ref;
  return (element as unknown as { ref?: React.Ref<unknown> }).ref;
}

type AnyProps = Record<string, unknown>;

function mergeProps(slotProps: AnyProps, childProps: AnyProps): AnyProps {
  const merged: AnyProps = { ...slotProps, ...childProps };
  for (const key of Object.keys(slotProps)) {
    const a = slotProps[key];
    const b = childProps[key];
    if (/^on[A-Z]/.test(key)) {
      if (typeof a === 'function' && typeof b === 'function') {
        merged[key] = (...args: unknown[]) => {
          (b as (...a: unknown[]) => void)(...args);
          (a as (...a: unknown[]) => void)(...args);
        };
      } else if (typeof a === 'function') {
        merged[key] = a;
      }
    } else if (key === 'className') {
      merged[key] = cn(a as string, b as string);
    } else if (key === 'style') {
      merged[key] = { ...(a as object), ...(b as object) };
    }
  }
  return merged;
}

export interface SlotProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
}

/**
 * Slot enables `asChild` composition: merges props, styles, event handlers,
 * and forwarded refs directly onto its immediate child element.
 */
export const Slot = React.forwardRef<HTMLElement, SlotProps>(function Slot(
  { children, ...slotProps },
  forwardedRef
) {
  if (!React.isValidElement(children)) return null;
  const child = children as React.ReactElement<AnyProps>;
  const childRef = getElementRef(child);
  return React.cloneElement(child, {
    ...mergeProps(slotProps as AnyProps, child.props),
    ref: forwardedRef ? composeRefs(forwardedRef, childRef as React.Ref<HTMLElement>) : childRef,
  });
});
