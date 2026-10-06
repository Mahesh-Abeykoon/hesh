/**
 * Theme & Token Generator Utilities for Hesh UI.
 *
 * Provides dynamic brand ramp calculation, hex/HSL color parsing,
 * token generation, and stylesheet export functions.
 */

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
