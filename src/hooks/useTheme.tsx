import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'pui-theme';

interface ThemeContextValue {
  /** What the user asked for ('light' | 'dark' | 'system'). */
  mode: ThemeMode;
  /** What is actually rendered. */
  theme: ResolvedTheme;
  setMode: (mode: ThemeMode) => void;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function readStoredMode(): ThemeMode {
  if (typeof document === 'undefined') return 'system';
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'light' || stored === 'dark' || stored === 'system') return stored;
  } catch {
    /* private mode / SSR — fall through */
  }
  return 'system';
}

function safeMatchMedia(query: string): MediaQueryList | null {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return null;
  try {
    return window.matchMedia(query);
  } catch {
    return null;
  }
}

function systemTheme(): ResolvedTheme {
  return safeMatchMedia('(prefers-color-scheme: dark)')?.matches ? 'dark' : 'light';
}

export interface ThemeProviderProps {
  children: ReactNode;
  /** Initial mode, used when nothing is stored yet. */
  defaultMode?: ThemeMode;
  /** Element that receives `data-pui-theme`. Defaults to <html>. */
  target?: HTMLElement | null;
}

/**
 * Writes `data-pui-theme="light|dark"` on the target element.
 *
 * No class-name injection, no CSS-in-JS runtime: the stylesheet already ships
 * both themes, so switching is a single attribute write.
 */
export function ThemeProvider({ children, defaultMode = 'system', target }: ThemeProviderProps) {
  const [mode, setModeState] = useState<ThemeMode>(() =>
    typeof document === 'undefined' ? defaultMode : (readStoredMode() ?? defaultMode)
  );
  const [systemPreference, setSystemPreference] = useState<ResolvedTheme>(systemTheme);

  // Track the OS preference only while in 'system' mode.
  useEffect(() => {
    const query = safeMatchMedia('(prefers-color-scheme: dark)');
    if (!query) return;
    const onChange = (event: MediaQueryListEvent) =>
      setSystemPreference(event.matches ? 'dark' : 'light');
    // Safari < 14 only has the deprecated listener API.
    if (query.addEventListener) {
      query.addEventListener('change', onChange);
      return () => query.removeEventListener('change', onChange);
    }
    query.addListener(onChange);
    return () => query.removeListener(onChange);
  }, []);

  const theme: ResolvedTheme = mode === 'system' ? systemPreference : mode;

  useEffect(() => {
    const el = target ?? document.documentElement;
    if (!el) return;
    el.setAttribute('data-pui-theme', theme);
    // Keeps native form controls and scrollbars in sync with the theme.
    el.style.colorScheme = theme;
  }, [theme, target]);

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  const toggle = useCallback(() => {
    setMode(theme === 'dark' ? 'light' : 'dark');
  }, [setMode, theme]);

  const value = useMemo<ThemeContextValue>(
    () => ({ mode, theme, setMode, toggle }),
    [mode, theme, setMode, toggle]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme() must be used inside <ThemeProvider>.');
  }
  return context;
}

/**
 * Inline this in <head> to apply the stored theme before first paint,
 * eliminating the flash of light theme on a dark-mode page.
 *
 *   <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
 */
export const themeInitScript = `(function(){try{var m=localStorage.getItem('${THEME_STORAGE_KEY}')||'system';var d=m==='dark'||(m==='system'&&window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches);var t=d?'dark':'light';var e=document.documentElement;e.setAttribute('data-pui-theme',t);e.style.colorScheme=t;}catch(e){}})();`;
