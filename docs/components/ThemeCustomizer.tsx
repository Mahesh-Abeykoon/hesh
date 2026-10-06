import { useState, useMemo, useEffect } from 'react';
import {
  Drawer,
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
} from '../../src/index';
import { SparklesIcon, CopyIcon, CheckIcon, XIcon } from '../../src/components/icons';

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

export function ThemeCustomizer() {
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
  const [open, setOpen] = useState(false);
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

  // Keep internal state in sync with active theme
  useEffect(() => {
    setHue(hsl.h);
    setSaturation(hsl.s);
  }, [hsl]);

  const ramp = useMemo(() => buildBrandRamp(hue, saturation), [hue, saturation]);

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

  const handleReset = () => {
    resetCustomTheme();
    setRadius(8);
    setFontFamily('');
    showToast({
      title: 'Restored default theme',
      description: 'Reset all tokens and density back to initial Indigo setup.',
      tone: 'info',
    });
  };

  return (
    <>
      {/* Floating Action Trigger Button */}
      <aside aria-label="Theme Customizer" className="pui-customizer-fab-wrap">
        <button
          type="button"
          className="pui-customizer-fab"
          onClick={() => setOpen(true)}
          aria-label="Open global theme customizer"
          title="Open Theme Customizer"
        >
          <span className="pui-customizer-fab__icon">
            <SparklesIcon size={18} />
          </span>
          <span className="pui-customizer-fab__label">Customizer</span>
          {customTheme && <span className="pui-customizer-fab__badge" title="Custom theme active" />}
        </button>
      </aside>

      {/* Slide-over Theme Customizer Drawer */}
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '1.875rem',
                height: '1.875rem',
                borderRadius: 'var(--pui-radius-md)',
                background: 'var(--pui-primary-subtle)',
                color: 'var(--pui-primary)',
              }}
            >
              <SparklesIcon size={18} />
            </span>
            <span>Theme Customizer</span>
          </div>
        }
        description="Tune brand colors, radii, density, and typography. Every component across all 72 routes updates in real time."
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
              <span className="pui-customizer-sec__title">Live Preview Preview</span>
            </div>
            <div className="pui-customizer-preview-box">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Interactive Controls</span>
                <Badge variant="subtle" tone="primary">Live Tokens</Badge>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <Button variant="primary" size="sm">Primary Action</Button>
                <Button variant="secondary" size="sm">Secondary</Button>
                <Switch defaultChecked aria-label="Demo switch" />
              </div>

              <div>
                <Input size="sm" defaultValue="Live typed value" placeholder="Type here…" aria-label="Demo input" />
              </div>
            </div>
          </section>

          {/* 7. Action Buttons */}
          <div className="pui-customizer-actions">
            <Button
              variant="primary"
              onClick={handleCopyCss}
              style={{ flex: 1 }}
            >
              <CopyIcon size={16} />
              <span>{copied ? 'Copied CSS!' : 'Copy CSS (:root)'}</span>
            </Button>

            <Button
              variant="secondary"
              onClick={handleExportJson}
            >
              Export JSON
            </Button>

            <Button
              variant="ghost"
              onClick={handleReset}
              title="Reset all settings to default"
            >
              Reset
            </Button>
          </div>
        </div>
      </Drawer>
    </>
  );
}
