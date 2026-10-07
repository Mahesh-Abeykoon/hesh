/**
 * Theme & Token Generator Utilities for Hesh UI.
 *
 * Provides dynamic brand ramp calculation, hex/HSL color parsing,
 * token generation, and stylesheet export functions.
 */

export type NeutralBase = 'slate' | 'zinc' | 'stone' | 'neutral' | 'oled';

export interface CustomThemeConfig {
  /** Primary brand color in HEX format (e.g. '#6366f1') or HSL. */
  primaryColor?: string;
  /** Primary brand hue (0-360) if controlling directly. */
  hue?: number;
  /** Primary brand saturation (0-100). */
  saturation?: number;
  /** Corner radius in pixels (e.g. 0, 4, 8, 12, 16) or CSS size string. */
  radius?: number | string;
  /** Sans font family stack override. */
  fontFamily?: string;
  /** UI density scale. */
  density?: 'compact' | 'default' | 'comfortable';
  /** Base neutral tone palette (Slate, Zinc, Stone, Neutral, OLED). */
  neutralBase?: NeutralBase;
}

export const NEUTRAL_PALETTES: Record<
  NeutralBase,
  {
    name: string;
    description: string;
    swatch: string;
    ramps: Record<number, string>;
  }
> = {
  slate: {
    name: 'Slate',
    description: 'Cool blue-tinted modern gray',
    swatch: '#64748b',
    ramps: {
      0: '#ffffff',
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
      950: '#020617',
    },
  },
  zinc: {
    name: 'Zinc',
    description: 'Industrial high-tech neutral',
    swatch: '#71717a',
    ramps: {
      0: '#ffffff',
      50: '#fafafa',
      100: '#f4f4f5',
      200: '#e4e4e7',
      300: '#d4d4d8',
      400: '#a1a1aa',
      500: '#71717a',
      600: '#52525b',
      700: '#3f3f46',
      800: '#27272a',
      900: '#18181b',
      950: '#09090b',
    },
  },
  stone: {
    name: 'Stone',
    description: 'Warm artisan earthy neutral',
    swatch: '#78716c',
    ramps: {
      0: '#ffffff',
      50: '#fafaf9',
      100: '#f5f5f4',
      200: '#e7e5e4',
      300: '#d6d3d1',
      400: '#a8a29e',
      500: '#78716c',
      600: '#57534e',
      700: '#44403c',
      800: '#292524',
      900: '#1c1917',
      950: '#0c0a09',
    },
  },
  neutral: {
    name: 'Neutral',
    description: 'Clean balanced graphite',
    swatch: '#737373',
    ramps: {
      0: '#ffffff',
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#e5e5e5',
      300: '#d4d4d4',
      400: '#a3a3a3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717',
      950: '#0a0a0a',
    },
  },
  oled: {
    name: 'OLED Black',
    description: 'Pure #000000 contrast for deep OLED displays',
    swatch: '#000000',
    ramps: {
      0: '#ffffff',
      50: '#fafafa',
      100: '#f4f4f5',
      200: '#e4e4e7',
      300: '#d4d4d8',
      400: '#a1a1aa',
      500: '#52525b',
      600: '#3f3f46',
      700: '#27272a',
      800: '#141416',
      900: '#08080a',
      950: '#000000',
    },
  },
};

/**
 * Calculates WCAG 2.1 relative luminance and contrast ratio.
 */
export function getContrastRatio(hex1: string, hex2: string): number {
  function getLuminance(hex: string): number {
    let clean = hex.trim().replace(/^#/, '');
    if (clean.length === 3) clean = clean.split('').map((c) => c + c).join('');
    if (clean.length !== 6) return 0.5;
    const r = parseInt(clean.substring(0, 2), 16) / 255;
    const g = parseInt(clean.substring(2, 4), 16) / 255;
    const b = parseInt(clean.substring(4, 6), 16) / 255;
    const a = [r, g, b].map((v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
    return 0.2126 * (a[0] ?? 0) + 0.7152 * (a[1] ?? 0) + 0.0722 * (a[2] ?? 0);
  }
  const l1 = getLuminance(hex1);
  const l2 = getLuminance(hex2);
  const max = Math.max(l1, l2);
  const min = Math.min(l1, l2);
  return Number(((max + 0.05) / (min + 0.05)).toFixed(2));
}

export function getWcagRating(ratio: number): {
  level: 'AAA' | 'AA' | 'Fail';
  pass: boolean;
  label: string;
} {
  if (ratio >= 7.0) return { level: 'AAA', pass: true, label: `AAA Pass (${ratio}:1)` };
  if (ratio >= 4.5) return { level: 'AA', pass: true, label: `AA Pass (${ratio}:1)` };
  if (ratio >= 3.0) return { level: 'AA', pass: true, label: `AA Large (${ratio}:1)` };
  return { level: 'Fail', pass: false, label: `Low (${ratio}:1)` };
}

export interface BrandRampStep {
  key: number;
  value: string;
  hex: string;
}

/** 11-step lightness ladder tuned so 500 sits at ~50% L */
const RAMP_L = [97, 94, 87, 76, 62, 50, 44, 38, 32, 26, 15];
const RAMP_KEYS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

/**
 * Converts a hex string (#RGB, #RRGGBB) to HSL values { h, s, l }.
 */
export function hexToHsl(hex: string): { h: number; s: number; l: number } {
  let cleaned = hex.trim().replace(/^#/, '');
  if (cleaned.length === 3) {
    cleaned = cleaned
      .split('')
      .map((c) => c + c)
      .join('');
  }
  if (cleaned.length !== 6) {
    return { h: 239, s: 84, l: 50 }; // fallback to indigo
  }

  const r = parseInt(cleaned.substring(0, 2), 16) / 255;
  const g = parseInt(cleaned.substring(2, 4), 16) / 255;
  const b = parseInt(cleaned.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h = h / 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

/**
 * Converts HSL values (h: 0-360, s: 0-100, l: 0-100) to hex string (#RRGGBB).
 */
export function hslToHex(h: number, s: number, l: number): string {
  const normS = s / 100;
  const normL = l / 100;

  const c = (1 - Math.abs(2 * normL - 1)) * normS;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = normL - c / 2;
  let r = 0;
  let g = 0;
  let b = 0;

  if (h >= 0 && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (h >= 60 && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (h >= 180 && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (h >= 240 && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (h >= 300 && h < 360) {
    r = c;
    g = 0;
    b = x;
  }

  const toHex = (n: number) => {
    const val = Math.round((n + m) * 255);
    return Math.max(0, Math.min(255, val)).toString(16).padStart(2, '0');
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Builds the 11-step brand color ramp from hue and saturation.
 */
export function buildBrandRamp(hue: number, saturation: number): BrandRampStep[] {
  return RAMP_KEYS.map((key, index) => {
    const lightness = RAMP_L[index]!;
    // Nudge saturation down slightly at the dark end to maintain text contrast
    const sat = index >= 8 ? Math.max(saturation - 10, 8) : saturation;
    return {
      key,
      value: `hsl(${hue} ${sat}% ${lightness}%)`,
      hex: hslToHex(hue, sat, lightness),
    };
  });
}

/**
 * Generates an object of CSS variables for a custom theme configuration.
 */
export function generateThemeVariables(config: CustomThemeConfig): Record<string, string> {
  let hue = config.hue ?? 239;
  let saturation = config.saturation ?? 84;

  if (config.primaryColor && !config.hue) {
    const hsl = hexToHsl(config.primaryColor);
    hue = hsl.h;
    saturation = hsl.s;
  }

  const ramp = buildBrandRamp(hue, saturation);
  const vars: Record<string, string> = {};

  ramp.forEach((step) => {
    vars[`--pui-brand-${step.key}`] = step.value;
  });

  vars['--pui-primary'] = 'var(--pui-brand-500)';
  vars['--pui-primary-hover'] = 'var(--pui-brand-600)';
  vars['--pui-primary-active'] = 'var(--pui-brand-700)';
  vars['--pui-primary-subtle'] = 'color-mix(in oklab, var(--pui-brand-500) 14%, transparent)';
  vars['--pui-primary-border'] = 'color-mix(in oklab, var(--pui-brand-500) 38%, transparent)';
  vars['--pui-primary-fg'] = 'color-mix(in oklab, var(--pui-brand-400) 78%, var(--pui-fg))';
  vars['--pui-focus-ring'] = 'var(--pui-brand-500)';

  if (config.radius !== undefined) {
    const radNum = typeof config.radius === 'number' ? config.radius : parseFloat(config.radius);
    const validRad = isNaN(radNum) ? 8 : Math.max(0, radNum);
    vars['--pui-radius-sm'] = `${Math.round(validRad * 0.5)}px`;
    vars['--pui-radius-md'] = `${Math.round(validRad)}px`;
    vars['--pui-radius-lg'] = `${Math.round(validRad * 1.5)}px`;
    vars['--pui-radius-xl'] = `${Math.round(validRad * 2)}px`;
  }

  if (config.fontFamily) {
    vars['--pui-font-sans'] = config.fontFamily;
  }

  if (config.neutralBase && NEUTRAL_PALETTES[config.neutralBase]) {
    const pal = NEUTRAL_PALETTES[config.neutralBase].ramps;
    Object.entries(pal).forEach(([key, val]) => {
      vars[`--pui-neutral-${key}`] = val;
    });
    if (config.neutralBase === 'oled') {
      vars['--pui-bg'] = '#000000';
      vars['--pui-surface'] = '#09090b';
      vars['--pui-border'] = '#27272a';
    }
  }

  return vars;
}

/**
 * Generates copy-paste ready CSS string for :root or a custom selector.
 */
export function generateThemeCss(config: CustomThemeConfig, selector = ':root'): string {
  const vars = generateThemeVariables(config);
  const lines: string[] = [`${selector} {`, '  /* Brand ramp */'];

  RAMP_KEYS.forEach((key) => {
    const varName = `--pui-brand-${key}`;
    if (vars[varName]) {
      lines.push(`  ${varName.padEnd(20)}: ${vars[varName]};`);
    }
  });

  lines.push('');
  lines.push('  /* Semantic bindings */');
  lines.push('  --pui-primary:        var(--pui-brand-500);');
  lines.push('  --pui-primary-hover:  var(--pui-brand-600);');
  lines.push('  --pui-primary-active: var(--pui-brand-700);');
  lines.push('  --pui-primary-subtle: color-mix(in oklab, var(--pui-brand-500) 14%, transparent);');
  lines.push('  --pui-primary-border: color-mix(in oklab, var(--pui-brand-500) 38%, transparent);');
  lines.push('  --pui-primary-fg:     color-mix(in oklab, var(--pui-brand-400) 78%, var(--pui-fg));');
  lines.push('  --pui-focus-ring:     var(--pui-brand-500);');

  if (vars['--pui-radius-md']) {
    lines.push('');
    lines.push('  /* Corner radius */');
    lines.push(`  --pui-radius-sm:      ${vars['--pui-radius-sm']};`);
    lines.push(`  --pui-radius-md:      ${vars['--pui-radius-md']};`);
    lines.push(`  --pui-radius-lg:      ${vars['--pui-radius-lg']};`);
    lines.push(`  --pui-radius-xl:      ${vars['--pui-radius-xl']};`);
  }

  if (vars['--pui-font-sans']) {
    lines.push('');
    lines.push('  /* Typography */');
    lines.push(`  --pui-font-sans:      ${vars['--pui-font-sans']};`);
  }

  if (config.neutralBase && NEUTRAL_PALETTES[config.neutralBase]) {
    lines.push('');
    lines.push(`  /* Neutral palette (${NEUTRAL_PALETTES[config.neutralBase].name}) */`);
    const pal = NEUTRAL_PALETTES[config.neutralBase].ramps;
    Object.entries(pal).forEach(([key, val]) => {
      lines.push(`  --pui-neutral-${key}: ${val};`);
    });
    if (config.neutralBase === 'oled') {
      lines.push('  --pui-bg:             #000000;');
      lines.push('  --pui-surface:        #09090b;');
      lines.push('  --pui-border:         #27272a;');
    }
  }

  lines.push('}');
  return lines.join('\n');
}

const STYLE_TAG_ID = 'pui-custom-theme-vars';

/**
 * Injects or updates custom CSS variables in the document head.
 */
export function applyThemeStyle(css: string): void {
  if (typeof document === 'undefined') return;
  let tag = document.getElementById(STYLE_TAG_ID) as HTMLStyleElement | null;
  if (!tag) {
    tag = document.createElement('style');
    tag.id = STYLE_TAG_ID;
    document.head.appendChild(tag);
  }
  tag.textContent = css;
}

/**
 * Removes custom theme CSS variables from the document head.
 */
export function removeThemeStyle(): void {
  if (typeof document === 'undefined') return;
  const tag = document.getElementById(STYLE_TAG_ID);
  if (tag && tag.parentNode) {
    tag.parentNode.removeChild(tag);
  }
}
