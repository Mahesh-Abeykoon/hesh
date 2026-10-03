import { useEffect, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

/**
 * Renders children into `document.body` (or a custom container) once mounted.
 * Returns null during SSR so server and client markup stay identical.
 */
export function Portal({ children, container }: { children: ReactNode; container?: HTMLElement | null }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;
  return createPortal(children, container ?? document.body);
}

export { useScrollLock } from '../hooks/useScrollLock';
