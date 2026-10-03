import { useCallback, useRef, useState } from 'react';

/**
 * Supports both controlled (`value` + `onChange`) and uncontrolled
 * (`defaultValue`) usage with a single code path.
 *
 * Returned setter is stable across renders, so it is safe in deps arrays.
 */
export function useControllableState<T>(options: {
  value?: T;
  defaultValue: T;
  onChange?: (value: T) => void;
}): [T, (next: T | ((prev: T) => T)) => void] {
  const { value, defaultValue, onChange } = options;
  const isControlled = value !== undefined;

  const [uncontrolled, setUncontrolled] = useState<T>(defaultValue);
  const current = isControlled ? (value as T) : uncontrolled;

  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const setValue = useCallback(
    (next: T | ((prev: T) => T)) => {
      const resolver = (prev: T): T =>
        typeof next === 'function' ? (next as (p: T) => T)(prev) : next;

      if (!isControlled) setUncontrolled(resolver);
      onChangeRef.current?.(resolver(isControlled ? (value as T) : uncontrolled));
    },
    [isControlled, value, uncontrolled]
  );

  return [current, setValue];
}
