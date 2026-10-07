import { useState, useMemo, useEffect } from 'react';
import {
  Drawer,
  Dialog,
  Textarea,
  Button,
  Badge,
  Switch,
  Input,
  Separator,
  useTheme,
  useToast,
  THEME_PRESETS,
  type CustomThemeConfig,
  type ThemePreset,
  type UiDensity,
  generateThemeCss,
  hexToHsl,
  hslToHex,
  buildBrandRamp,
  NEUTRAL_PALETTES,
  type NeutralBase,
  getContrastRatio,
  getWcagRating,
} from '../../src/index';
import { PaletteIcon, CopyIcon } from '../../src/components/icons';
import { cn } from '../../src/utils/cn';

const EXTRA_PRESETS = [
  { name: 'Violet', hex: '#8b5cf6', hue: 258, sat: 90 },
  { name: 'Sky', hex: '#0284c7', hue: 201, sat: 96 },
  { name: 'Emerald', hex: '#059669', hue: 160, sat: 84 },
  { name: 'Amber', hex: '#d97706', hue: 37, sat: 92 },
  { name: 'Rose', hex: '#e11d48', hue: 346, sat: 77 },
];

const RADIUS_PRESETS = [
  { label: 'Sharp (0px)', value: 0 },
  { label: 'Compact (4px)', value: 4 },
  { label: 'Smooth (8px)', value: 8 },
  { label: 'Rounded (12px)', value: 12 },
  { label: 'Pill (16px)', value: 16 },
];

const FONT_PRESETS = [
  { label: 'Default (Inter)', value: "'Inter', system-ui, -apple-system, sans-serif" },
  { label: 'Geometric', value: "'Plus Jakarta Sans', 'Outfit', sans-serif" },
  { label: 'Monospace', value: "'JetBrains Mono', 'Fira Code', monospace" },
  { label: 'Editorial Serif', value: "Georgia, Cambria, 'Times New Roman', serif" },
];

export interface ThemeCustomizerProps {
  open?: boolean;
  onClose?: () => void;
  showFab?: boolean;
}

export function ThemeCustomizerTrigger({
  onClick,
  className,
}: {
  onClick: () => void;
  className?: string;
}) {
  const { customTheme } = useTheme();
  return (
    <button
      type="button"
      className={cn('topbar__customizer-btn', className)}
      onClick={onClick}
      aria-label="Open theme customizer"
      title="Customize theme (colors, radius, density)"
    >
      <PaletteIcon size={14} />
      <span className="topbar__customizer-btn__text">Theme</span>
      {customTheme && <span className="topbar__customizer-btn__dot" aria-hidden="true" />}
    </button>
  );
}

export function ThemeCustomizer({
  open: controlledOpen,
  onClose: controlledOnClose,
  showFab = false,
}: ThemeCustomizerProps) {
  const {
    preset,
    setPreset,
    customTheme,
    setCustomTheme,
    resetCustomTheme,
    density,
    setDensity,
  } = useTheme();

  const { toast: showToast } = useToast();
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const handleClose = () => {
    if (controlledOnClose) controlledOnClose();
    else setInternalOpen(false);
  };

  const [copied, setCopied] = useState(false);

  // Active color values
  const currentHex = useMemo(() => {
    if (customTheme?.primaryColor) return customTheme.primaryColor;
    if (customTheme?.hue !== undefined) {
      return hslToHex(customTheme.hue, customTheme.saturation ?? 84, 50);
    }
    const found = THEME_PRESETS.find((p) => p.id === preset);
    return found ? found.accentColor : '#6366f1';
  }, [customTheme, preset]);

  const hsl = useMemo(() => hexToHsl(currentHex), [currentHex]);
  const [hue, setHue] = useState(hsl.h);
  const [saturation, setSaturation] = useState(hsl.s);
  const [radius, setRadius] = useState<number>(() => {
    if (typeof customTheme?.radius === 'number') return customTheme.radius;
    if (typeof customTheme?.radius === 'string') return parseFloat(customTheme.radius) || 8;
    return 8;
  });
  const [fontFamily, setFontFamily] = useState<string>(customTheme?.fontFamily ?? '');
  const [neutralBase, setNeutralBase] = useState<NeutralBase>(customTheme?.neutralBase ?? 'neutral');
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');

  // Keep internal state in sync with active theme
  useEffect(() => {
    setHue(hsl.h);
    setSaturation(hsl.s);
    if (customTheme?.radius !== undefined) {
      const r = typeof customTheme.radius === 'number' ? customTheme.radius : parseFloat(customTheme.radius) || 8;
      setRadius(r);
    } else {
      setRadius(8);
    }
    setFontFamily(customTheme?.fontFamily ?? '');
    setNeutralBase(customTheme?.neutralBase ?? 'neutral');
  }, [hsl, customTheme]);

  const ramp = useMemo(() => buildBrandRamp(hue, saturation), [hue, saturation]);

  // Real-time WCAG 2.1 contrast calculations
  const contrastWhite = useMemo(() => getContrastRatio(currentHex, '#ffffff'), [currentHex]);
  const contrastDark = useMemo(() => {
    const darkBg = neutralBase === 'oled' ? '#000000' : (NEUTRAL_PALETTES[neutralBase]?.ramps[900] ?? '#0f172a');
    return getContrastRatio(currentHex, darkBg);
  }, [currentHex, neutralBase]);

  const ratingWhite = useMemo(() => getWcagRating(contrastWhite), [contrastWhite]);
  const ratingDark = useMemo(() => getWcagRating(contrastDark), [contrastDark]);

  const handleColorChange = (newHex: string) => {
    const nextHsl = hexToHsl(newHex);
    setHue(nextHsl.h);
    setSaturation(nextHsl.s);
    setCustomTheme({
      primaryColor: newHex,
      hue: nextHsl.h,
      saturation: nextHsl.s,
      radius,
      fontFamily: fontFamily || undefined,
      density,
      neutralBase,
    });
  };

  const handleHueSatChange = (newHue: number, newSat: number) => {
    setHue(newHue);
    setSaturation(newSat);
    const newHex = hslToHex(newHue, newSat, 50);
    setCustomTheme({
      primaryColor: newHex,
      hue: newHue,
      saturation: newSat,
      radius,
      fontFamily: fontFamily || undefined,
      density,
      neutralBase,
    });
  };

  const handleNeutralChange = (base: NeutralBase) => {
    setNeutralBase(base);
    setCustomTheme({
      ...(customTheme ?? { primaryColor: currentHex, hue, saturation, radius, density }),
      neutralBase: base,
    });
  };

  const handleRadiusChange = (newRadius: number) => {
    setRadius(newRadius);
    setCustomTheme({
      ...(customTheme ?? { primaryColor: currentHex, hue, saturation }),
      radius: newRadius,
    });
  };

  const handleFontChange = (font: string) => {
    setFontFamily(font);
    setCustomTheme({
      ...(customTheme ?? { primaryColor: currentHex, hue, saturation }),
      fontFamily: font || undefined,
    });
  };

  const handleBuiltinPreset = (id: ThemePreset) => {
    setPreset(id);
    const p = THEME_PRESETS.find((item) => item.id === id);
    if (p) {
      const pHsl = hexToHsl(p.accentColor);
      setHue(pHsl.h);
      setSaturation(pHsl.s);
    }
  };

  const handleExtraPreset = (extra: (typeof EXTRA_PRESETS)[0]) => {
    handleHueSatChange(extra.hue, extra.sat);
  };

  const handleCopyCss = () => {
    const activeConfig: CustomThemeConfig = {
      primaryColor: currentHex,
      hue,
      saturation,
      radius,
      fontFamily: fontFamily || undefined,
      density,
      neutralBase,
    };
    const css = generateThemeCss(activeConfig);
    navigator.clipboard.writeText(css).then(() => {
      setCopied(true);
      showToast({
        title: 'Theme CSS copied to clipboard!',
        description: 'Paste into your global stylesheet to use these tokens.',
        tone: 'success',
      });
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleExportJson = () => {
    const json = JSON.stringify(
      {
        primaryColor: currentHex,
        hue,
        saturation,
        neutralBase,
        radius: `${radius}px`,
        density,
        fontFamily: fontFamily || undefined,
      },
      null,
      2
    );
    navigator.clipboard.writeText(json).then(() => {
      showToast({
        title: 'Theme JSON configuration copied!',
        description: 'You can store or import this configuration anytime.',
        tone: 'info',
      });
    });
  };

  const handleApplyImportJson = () => {
    try {
      const parsed = JSON.parse(importJsonText);
      if (!parsed || typeof parsed !== 'object') throw new Error('Invalid JSON');
      setCustomTheme(parsed);
      if (parsed.primaryColor) {
        const ph = hexToHsl(parsed.primaryColor);
        setHue(ph.h);
        setSaturation(ph.s);
      }
      if (parsed.neutralBase) setNeutralBase(parsed.neutralBase);
      if (parsed.radius !== undefined) {
        setRadius(typeof parsed.radius === 'number' ? parsed.radius : parseFloat(parsed.radius) || 8);
      }
      if (parsed.fontFamily !== undefined) setFontFamily(parsed.fontFamily);
      if (parsed.density) setDensity(parsed.density);
      setImportDialogOpen(false);
      showToast({
        title: 'Theme imported successfully!',
        description: 'New tokens and parameters are now live.',
        tone: 'success',
      });
    } catch {
      showToast({
        title: 'Failed to import JSON',
        description: 'Please ensure valid JSON format with proper quotes.',
        tone: 'danger',
      });
    }
  };

  const handleReset = () => {
    resetCustomTheme();
    setRadius(8);
    setFontFamily('');
    setNeutralBase('neutral');
    showToast({
      title: 'Restored default theme',
      description: 'Reset all tokens and density back to initial Indigo setup.',
      tone: 'info',
    });
  };

  return (
    <>
      {/* Optional Floating Trigger (if enabled) */}
      {showFab && (
        <aside aria-label="Theme Customizer" className="pui-customizer-fab-wrap">
          <button
            type="button"
            className="pui-customizer-fab"
            onClick={() => setInternalOpen(true)}
            aria-label="Open global theme customizer"
            title="Open Theme Customizer"
          >
            <span className="pui-customizer-fab__icon">
              <PaletteIcon size={18} />
            </span>
            <span className="pui-customizer-fab__label">Customizer</span>
            {customTheme && <span className="pui-customizer-fab__badge" title="Custom theme active" />}
          </button>
        </aside>
      )}

      {/* Slide-over Theme Customizer Drawer */}
      <Drawer
        open={isOpen}
        onClose={handleClose}
        title={
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.625rem' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '1.75rem',
                height: '1.75rem',
                borderRadius: 'var(--pui-radius-md)',
                background: 'var(--pui-primary-subtle)',
                color: 'var(--pui-primary)',
              }}
            >
              <PaletteIcon size={16} />
            </span>
            <span>Theme Customizer</span>
          </span>
        }
        description="Tune brand colors, radii, density, and typography. Updates every component across the entire library in real time."
        footer={
          <div className="pui-customizer-actions" style={{ width: '100%' }}>
            <Button
              variant="primary"
              size="sm"
              onClick={handleCopyCss}
              style={{ flex: 1 }}
            >
              <CopyIcon size={14} />
              <span>{copied ? 'Copied CSS!' : 'Copy CSS (:root)'}</span>
            </Button>

            <Button
              variant="secondary"
              size="sm"
              onClick={handleExportJson}
            >
              Export JSON
            </Button>

            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setImportJsonText(
                  JSON.stringify(
                    {
                      primaryColor: currentHex,
                      neutralBase,
                      radius: `${radius}px`,
                      fontFamily: fontFamily || undefined,
                      density,
                    },
                    null,
                    2
                  )
                );
                setImportDialogOpen(true);
              }}
            >
              Import JSON
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              title="Reset all settings to default"
            >
              Reset
            </Button>
          </div>
        }
      >
        <div className="pui-customizer-content">
          {/* 1. Quick Presets */}
          <section className="pui-customizer-sec">
            <div className="pui-customizer-sec__head">
              <span className="pui-customizer-sec__title">Curated Presets</span>
              <span className="pui-customizer-sec__hint">One-click cohesive palettes</span>
            </div>
            <div className="pui-customizer-palette-grid">
              {THEME_PRESETS.map((p) => {
                const isActive = !customTheme && preset === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    className={`pui-customizer-swatch-btn ${isActive ? 'pui-customizer-swatch-btn--active' : ''}`}
                    onClick={() => handleBuiltinPreset(p.id)}
                    title={p.description}
                  >
                    <span
                      className="pui-customizer-swatch-circle"
                      style={{ background: p.accentColor }}
                    />
                    <span className="pui-customizer-swatch-name">{p.name}</span>
                  </button>
                );
              })}

              {EXTRA_PRESETS.map((extra) => {
                const isActive = customTheme?.primaryColor === extra.hex;
                return (
                  <button
                    key={extra.name}
                    type="button"
                    className={`pui-customizer-swatch-btn ${isActive ? 'pui-customizer-swatch-btn--active' : ''}`}
                    onClick={() => handleExtraPreset(extra)}
                  >
                    <span
                      className="pui-customizer-swatch-circle"
                      style={{ background: extra.hex }}
                    />
                    <span className="pui-customizer-swatch-name">{extra.name}</span>
                  </button>
                );
              })}
            </div>
          </section>

          <Separator />

          {/* 2. Custom Brand Color */}
          <section className="pui-customizer-sec">
            <div className="pui-customizer-sec__head">
              <span className="pui-customizer-sec__title">Primary Brand Color</span>
              <span className="pui-customizer-sec__badge">{currentHex.toUpperCase()}</span>
            </div>

            <div className="pui-customizer-color-row">
              <div className="pui-customizer-color-input-wrap">
                <input
                  type="color"
                  className="pui-customizer-color-picker"
                  value={currentHex.length === 7 ? currentHex : '#6366f1'}
                  onChange={(e) => handleColorChange(e.target.value)}
                  aria-label="Pick color"
                />
                <span className="pui-customizer-color-code">{currentHex}</span>
              </div>

              <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--pui-fg-muted)' }}>
                  <span>Hue ({hue}°)</span>
                  <span>Sat ({saturation}%)</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={360}
                  value={hue}
                  onChange={(e) => handleHueSatChange(Number(e.target.value), saturation)}
                  className="pui-customizer-slider pui-customizer-slider--hue"
                  aria-label="Brand hue"
                />
              </div>
            </div>

            {/* Generated 11-step Ramp */}
            <div className="pui-customizer-ramp" aria-label="11-step brand ramp">
              {ramp.map((step) => (
                <div
                  key={step.key}
                  className="pui-customizer-ramp__chip"
                  style={{ background: step.value }}
                  title={`--pui-brand-${step.key}: ${step.hex}`}
                  onClick={() => handleColorChange(step.hex)}
                >
                  <span className="pui-customizer-ramp__num">{step.key}</span>
                </div>
              ))}
            </div>

            {/* Real-time WCAG 2.1 Contrast Indicator */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.5rem',
                padding: '0.625rem 0.875rem',
                background: 'var(--pui-surface-subtle, #f8fafc)',
                borderRadius: 'var(--pui-radius-md, 8px)',
                border: '1px solid var(--pui-border, #e2e8f0)',
                marginTop: '0.75rem',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--pui-fg)' }}>
                  WCAG Accessibility
                </span>
                <span style={{ fontSize: '0.6875rem', color: 'var(--pui-fg-muted)' }}>
                  Surface compliance
                </span>
              </div>

              <div style={{ display: 'flex', gap: '0.375rem', alignItems: 'center' }}>
                <Badge
                  size="sm"
                  tone={ratingWhite.pass ? 'success' : 'warning'}
                  variant="subtle"
                  title={`Contrast ratio against #FFFFFF light surface: ${contrastWhite}:1`}
                >
                  Light: {ratingWhite.label}
                </Badge>
                <Badge
                  size="sm"
                  tone={ratingDark.pass ? 'success' : 'warning'}
                  variant="subtle"
                  title={`Contrast ratio against dark surface: ${contrastDark}:1`}
                >
                  Dark: {ratingDark.label}
                </Badge>
              </div>
            </div>
          </section>

          <Separator />

          {/* Neutral Base Surface Palette */}
          <section className="pui-customizer-sec">
            <div className="pui-customizer-sec__head">
              <span className="pui-customizer-sec__title">Neutral Base Palette</span>
              <span className="pui-customizer-sec__badge">{NEUTRAL_PALETTES[neutralBase]?.name ?? 'Neutral'}</span>
            </div>

            <div className="pui-customizer-chip-group">
              {(Object.keys(NEUTRAL_PALETTES) as NeutralBase[]).map((base) => {
                const pal = NEUTRAL_PALETTES[base];
                const isActive = neutralBase === base;
                return (
                  <button
                    key={base}
                    type="button"
                    className={`pui-customizer-chip ${isActive ? 'pui-customizer-chip--active' : ''}`}
                    onClick={() => handleNeutralChange(base)}
                    title={pal.description}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                  >
                    <span
                      style={{
                        width: '0.625rem',
                        height: '0.625rem',
                        borderRadius: '9999px',
                        background: pal.swatch,
                        border: '1px solid rgba(255,255,255,0.2)',
                      }}
                    />
                    <span>{pal.name}</span>
                  </button>
                );
              })}
            </div>
          </section>

          <Separator />

          {/* 3. Corner Radius Scale */}
          <section className="pui-customizer-sec">
            <div className="pui-customizer-sec__head">
              <span className="pui-customizer-sec__title">Corner Radius</span>
              <span className="pui-customizer-sec__badge">{radius}px</span>
            </div>

            <div className="pui-customizer-chip-group">
              {RADIUS_PRESETS.map((rp) => (
                <button
                  key={rp.value}
                  type="button"
                  className={`pui-customizer-chip ${radius === rp.value ? 'pui-customizer-chip--active' : ''}`}
                  onClick={() => handleRadiusChange(rp.value)}
                >
                  {rp.label}
                </button>
              ))}
            </div>

            <div style={{ marginTop: '0.75rem' }}>
              <input
                type="range"
                min={0}
                max={24}
                value={radius}
                onChange={(e) => handleRadiusChange(Number(e.target.value))}
                className="pui-customizer-slider"
                aria-label="Fine tune corner radius"
              />
            </div>
          </section>

          <Separator />

          {/* 4. UI Density */}
          <section className="pui-customizer-sec">
            <div className="pui-customizer-sec__head">
              <span className="pui-customizer-sec__title">Component Density</span>
              <span className="pui-customizer-sec__badge">{density}</span>
            </div>

            <div className="pui-customizer-chip-group">
              {(['compact', 'default', 'comfortable'] as UiDensity[]).map((d) => (
                <button
                  key={d}
                  type="button"
                  className={`pui-customizer-chip ${density === d ? 'pui-customizer-chip--active' : ''}`}
                  onClick={() => setDensity(d)}
                >
                  {d === 'compact' ? 'Compact (0.82×)' : d === 'default' ? 'Default (1.0×)' : 'Comfortable (1.18×)'}
                </button>
              ))}
            </div>
          </section>

          <Separator />

          {/* 5. Typography Font Family */}
          <section className="pui-customizer-sec">
            <div className="pui-customizer-sec__head">
              <span className="pui-customizer-sec__title">Font Family</span>
            </div>

            <div className="pui-customizer-chip-group">
              {FONT_PRESETS.map((f) => {
                const isActive = (fontFamily === '' && f.label.startsWith('Default')) || fontFamily === f.value;
                return (
                  <button
                    key={f.label}
                    type="button"
                    className={`pui-customizer-chip ${isActive ? 'pui-customizer-chip--active' : ''}`}
                    onClick={() => handleFontChange(f.label.startsWith('Default') ? '' : f.value)}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>
          </section>

          <Separator />

          {/* 6. Live Interactive Preview Widget */}
          <section className="pui-customizer-sec">
            <div className="pui-customizer-sec__head">
              <span className="pui-customizer-sec__title">Live Preview Controls</span>
            </div>
            <div className="pui-customizer-preview-box">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Interactive Controls</span>
                <Badge variant="subtle" tone="primary">Live Tokens</Badge>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <Button variant="primary" size="sm">Primary</Button>
                <Button variant="secondary" size="sm">Secondary</Button>
                <Switch defaultChecked aria-label="Demo switch" />
              </div>

              <div>
                <Input size="sm" defaultValue="Live typed value" placeholder="Type here…" aria-label="Demo input" />
              </div>
            </div>
          </section>
        </div>
      </Drawer>

      {/* Import Theme JSON Dialog */}
      <Dialog
        open={importDialogOpen}
        onClose={() => setImportDialogOpen(false)}
        title="Import Theme JSON"
        description="Paste your theme configuration JSON below to apply custom brand colors, neutral palette, and radii in real time."
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', width: '100%' }}>
            <Button variant="ghost" onClick={() => setImportDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleApplyImportJson}>
              Apply Theme
            </Button>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
          <Textarea
            value={importJsonText}
            onChange={(e) => setImportJsonText(e.target.value)}
            rows={8}
            placeholder='{\n  "primaryColor": "#6366f1",\n  "neutralBase": "zinc",\n  "radius": 8\n}'
            style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.8125rem' }}
          />
        </div>
      </Dialog>
    </>
  );
}
