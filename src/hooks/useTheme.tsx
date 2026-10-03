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
export type ThemePreset = 'indigo' | 'forest' | 'sunset' | 'mono' | 'midnight';

export const THEME_STORAGE_KEY = 'pui-theme';
export const PRESET_STORAGE_KEY = 'pui-preset';

export interface ThemePresetMeta {
  id: ThemePreset;
  name: string;
  accentColor: string;
  description: string;
  palette: [string, string, string, string];
  radius: string;
  badgeStyle?: Record<string, string>;
}

export const THEME_PRESETS: ThemePresetMeta[] = [
  {
    id: 'indigo',
    name: 'Indigo',
    accentColor: '#6366f1',
    description: 'Linear & Stripe electric indigo default',
    palette: ['#6366f1', '#818cf8', '#c7d2fe', '#1e1b4b'],
    radius: '0.5rem',
  },
  {
    id: 'forest',
    name: 'Forest',
    accentColor: '#10b981',
    description: 'Calm emerald & pine with compact radii for ops',
    palette: ['#059669', '#10b981', '#a7f3d0', '#022c22'],
    radius: '0.375rem',
  },
  {
    id: 'sunset',
    name: 'Sunset',
    accentColor: '#f43f5e',
    description: 'Warm terracotta & rose with soft rounded radii',
    palette: ['#f43f5e', '#fb7185', '#fecdd3', '#4c0519'],
    radius: '0.75rem',
  },
  {
    id: 'mono',
    name: 'Mono',
    accentColor: '#18181b',
    description: 'Monochrome brutalist zinc with square radii',
    palette: ['#18181b', '#71717a', '#d4d4d8', '#09090b'],
    radius: '0px',
    badgeStyle: {
      background: 'linear-gradient(135deg, #ffffff 50%, #18181b 50%)',
      borderColor: 'rgba(255, 255, 255, 0.4)',
    },
  },
  {
    id: 'midnight',
    name: 'Midnight',
    accentColor: '#06b6d4',
    description: 'Deep cyber navy & electric cyan for data',
    palette: ['#0891b2', '#06b6d4', '#a5f3fc', '#020617'],
    radius: '0.625rem',
  },
];

export interface ThemeContextValue {
  /** What the user asked for ('light' | 'dark' | 'system'). */
  mode: ThemeMode;
  /** What is actually rendered. */
  theme: ResolvedTheme;
  setMode: (mode: ThemeMode) => void;
  toggle: () => void;
  /** Active theme preset ('indigo' | 'forest' | 'sunset' | 'mono' | 'midnight'). */
  preset: ThemePreset;
  setPreset: (preset: ThemePreset) => void;
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

function readStoredPreset(): ThemePreset {
  if (typeof document === 'undefined') return 'indigo';
  try {
    const stored = localStorage.getItem(PRESET_STORAGE_KEY) as ThemePreset;
    if (stored && ['indigo', 'forest', 'sunset', 'mono', 'midnight'].includes(stored)) {
      return stored;
    }
  } catch {
    /* private mode / SSR — fall through */
  }
  return 'indigo';
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
  /** Initial theme preset, used when nothing is stored yet. */
  defaultPreset?: ThemePreset;
  /** Element that receives `data-pui-theme` and `data-pui-preset`. Defaults to <html>. */
  target?: HTMLElement | null;
}

/**
 * Writes `data-pui-theme="light|dark"` and `data-pui-preset="forest|sunset|mono|midnight"` on the target element.
 *
 * No class-name injection, no CSS-in-JS runtime: the stylesheet already ships
 * themes and presets, so switching is a fast attribute write.
 */
export function ThemeProvider({
  children,
  defaultMode = 'system',
  defaultPreset = 'indigo',
  target,
}: ThemeProviderProps) {
  const [mode, setModeState] = useState<ThemeMode>(() =>
    typeof document === 'undefined' ? defaultMode : (readStoredMode() ?? defaultMode)
  );
  const [preset, setPresetState] = useState<ThemePreset>(() =>
    typeof document === 'undefined' ? defaultPreset : (readStoredPreset() ?? defaultPreset)
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

  useEffect(() => {
    const el = target ?? document.documentElement;
    if (!el) return;
    if (preset === 'indigo') {
      el.removeAttribute('data-pui-preset');
    } else {
      el.setAttribute('data-pui-preset', preset);
    }
  }, [preset, target]);

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  const setPreset = useCallback((next: ThemePreset) => {
    setPresetState(next);
    try {
      localStorage.setItem(PRESET_STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  const toggle = useCallback(() => {
    setMode(theme === 'dark' ? 'light' : 'dark');
  }, [setMode, theme]);

  const value = useMemo<ThemeContextValue>(
    () => ({ mode, theme, setMode, toggle, preset, setPreset }),
    [mode, theme, setMode, toggle, preset, setPreset]
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
export const themeInitScript = `(function(){try{var m=localStorage.getItem('${THEME_STORAGE_KEY}')||'system';var d=m==='dark'||(m==='system'&&window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches);var t=d?'dark':'light';var e=document.documentElement;e.setAttribute('data-pui-theme',t);e.style.colorScheme=t;var p=localStorage.getItem('${PRESET_STORAGE_KEY}');if(p&&p!=='indigo')e.setAttribute('data-pui-preset',p);}catch(e){}})();`;
