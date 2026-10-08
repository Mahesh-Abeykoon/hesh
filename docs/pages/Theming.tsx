import { useEffect, useState } from 'react';
import {
  Badge,
  Button,
  Card,
  CardBody,
  Input,
  Separator,
  Switch,
  PresetSwitch,
  useTheme,
  THEME_PRESETS,
} from '../../src/index';
import { CodeBlock } from '../components/CodeBlock';
import { Callout, Showcase } from '../components/Showcase';
import { DocPage, Section } from '../components/DocPage';

const BRAND_OVERRIDE = `/* Your global stylesheet — loaded after premium-ui.css */
:root {
  /* Rebrand: swap the 11 brand steps. Everything else follows. */
  --pui-brand-50:  #eef6ff;
  --pui-brand-100: #d9eaff;
  --pui-brand-200: #bcdaff;
  --pui-brand-300: #8ec2ff;
  --pui-brand-400: #59a1ff;
  --pui-brand-500: #2f7ff0;  /* primary */
  --pui-brand-600: #1a63d0;
  --pui-brand-700: #164ea6;
  --pui-brand-800: #164387;
  --pui-brand-900: #173a70;
  --pui-brand-950: #0f2547;
}`;

const SEMANTIC_OVERRIDE = `/* Prefer semantic tokens when you only need to retarget intent */
:root {
  --pui-primary:       #7c5cff;
  --pui-primary-hover: #6a49f2;
  --pui-danger:        #e5484d;
  --pui-radius-md:     0.25rem;   /* sharper UI */
  --pui-font-sans:     'Söhne', system-ui, sans-serif;
}`;

const SCOPED = `/* Scoped theming: invert a section without touching the rest of the page */
<section data-pui-theme="dark" className="hero">
  <Button>Works in here too</Button>
</section>`;

const DENSITY = `<html data-pui-density="compact">      <!-- 0.82× control height -->
<html data-pui-density="comfortable">  <!-- 1.18× control height -->`;

const PRESET_USAGE = `<!-- Apply directly to <html> or any container element -->
<html data-pui-preset="forest">   <!-- Calm emerald & pine (ops & infra) -->
<html data-pui-preset="sunset">   <!-- Warm terracotta & rose (consumer SaaS) -->
<html data-pui-preset="mono">     <!-- Monochromatic brutalist zinc (dev tools) -->
<html data-pui-preset="midnight"> <!-- Deep cyber navy & cyan (fintech & data) -->

<!-- Or control dynamically in React -->
import { useTheme, PresetSwitch } from 'hesh-ui';

function Header() {
  const { preset, setPreset } = useTheme();
  return <PresetSwitch />;
}`;

const TOKEN_LAYERS = [
  {
    layer: 'Layer 1 — Primitives',
    detail:
      'Raw values: --pui-brand-500, --pui-neutral-900, --pui-space-4. Change these to change the material.',
  },
  {
    layer: 'Layer 2 — Semantic',
    detail:
      'Intent: --pui-primary, --pui-fg-muted, --pui-border, --pui-surface. Components only ever read from this layer.',
  },
  {
    layer: 'Layer 3 — Component',
    detail:
      'Per-component knobs such as --btn-h or --ctrl-h, computed from Layer 2 × density. Override one button, not all of them.',
  },
];

function useTokenValue(token: string) {
  const [value, setValue] = useState('');

  useEffect(() => {
    const read = () => {
      const raw = getComputedStyle(document.documentElement).getPropertyValue(token).trim();
      setValue(raw);
    };
    read();
    // Re-read after a theme switch repaints.
    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-pui-theme', 'data-pui-density'] });
    return () => observer.disconnect();
  }, [token]);

  return value;
}

function Swatch({ token, label }: { token: string; label: string }) {
  const value = useTokenValue(token);
  return (
    <div className="swatch">
      <div
        className="swatch__chip"
        style={{ background: `var(${token})`, borderColor: 'var(--pui-border-strong)' }}
      />
      <div className="swatch__meta">
        <div className="swatch__name">{label}</div>
        <div className="swatch__token">{token}</div>
      </div>
    </div>
  );
}

export function ThemingPage() {
  const [notifications, setNotifications] = useState(true);
  const { preset, setPreset } = useTheme();

  return (
    <DocPage
      eyebrow="Foundations"
      title="Theming & tokens"
      lede={
        <>
          Three token layers, one stylesheet, no build step. Override a variable,
          not a component — and scope any override to a subtree if you need to.
        </>
      }
    >
      <Section
        title="How the layers fit together"
        description="Components never reference a primitive directly. That indirection is what makes a rebrand a 10-line change instead of a refactor."
      >
        <div className="layer-stack">
          {TOKEN_LAYERS.map((entry, index) => (
            <div key={entry.layer} className="layer">
              <div className="layer__badge">{index + 1}</div>
              <div>
                <div className="layer__title">{entry.layer}</div>
                <p className="layer__detail">{entry.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Live tokens" description="Read from the document right now — flip the theme in the header and these update instantly.">
        <div className="swatch-grid">
          <Swatch token="--pui-primary" label="Primary" />
          <Swatch token="--pui-primary-hover" label="Primary hover" />
          <Swatch token="--pui-surface" label="Surface" />
          <Swatch token="--pui-bg" label="Background" />
          <Swatch token="--pui-border" label="Border" />
          <Swatch token="--pui-fg" label="Foreground" />
          <Swatch token="--pui-fg-muted" label="Muted text" />
          <Swatch token="--pui-success" label="Success" />
          <Swatch token="--pui-warning" label="Warning" />
          <Swatch token="--pui-danger" label="Danger" />
          <Swatch token="--pui-info" label="Info" />
          <Swatch token="--pui-focus-ring" label="Focus ring" />
        </div>
      </Section>

      <Section title="Rebranding" description="Replace the brand ramp and the whole library follows — buttons, focus rings, active nav, badges, links.">
        <CodeBlock code={BRAND_OVERRIDE} language="css" />
        <Callout tone="info" title="Keep the ramp consistent">
          Pick steps that ascend monotonically in lightness. If step 500 is your
          button background, step 700 should remain readable as text on step 50 —
          that relationship is what <code>--pui-primary-fg</code> assumes.
        </Callout>
      </Section>

      <Section title="Semantic overrides" description="When you do not need a whole ramp, retarget intent instead.">
        <CodeBlock code={SEMANTIC_OVERRIDE} language="css" />
      </Section>

      <Section title="Scoped themes" description="data-pui-theme works on any element, not just <html>. Useful for hero sections, sidebars and embedded previews.">
        <CodeBlock code={SCOPED} />
        <Showcase>
          <div className="grid-2">
            <div className="scope-demo" data-pui-theme="light">
              <Badge tone="primary">Light scope</Badge>
              <Button size="sm">Button</Button>
              <Input label="Email" placeholder="you@company.com" />
            </div>
            <div className="scope-demo scope-demo--dark" data-pui-theme="dark">
              <Badge tone="primary">Dark scope</Badge>
              <Button size="sm">Button</Button>
              <Input label="Email" placeholder="you@company.com" />
            </div>
          </div>
        </Showcase>
      </Section>

      <Section
        title="Density"
        description="Set one attribute on <html> and every control reflows. Use the C / D / F switch in the site header to try it on this page."
      >
        <CodeBlock code={DENSITY} language="html" />
        <Showcase>
          <div className="grid-3">
            {(['compact', 'default', 'comfortable'] as const).map((value) => (
              <div key={value} data-pui-density={value === 'default' ? undefined : value} className="density-demo">
                <div className="density-demo__label">{value}</div>
                <Input label="Email" placeholder="you@company.com" />
                <Button size="sm" fullWidth>
                  Save changes
                </Button>
              </div>
            ))}
          </div>
        </Showcase>
      </Section>

      <Section
        title="Theme presets"
        description="Hesh ships with 5 built-in palettes. Switch them globally via [data-pui-preset] or use the interactive picker below."
      >
        <CodeBlock code={PRESET_USAGE} language="html" />
        <Showcase>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
              <div>
                <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--pui-fg)' }}>
                  Interactive Palette Picker
                </span>
                <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--pui-fg-muted)' }}>
                  Click any card to re-theme the entire documentation in real time
                </span>
              </div>
              <PresetSwitch />
            </div>

            <div className="preset-grid" role="radiogroup" aria-label="Theme color presets">
              {THEME_PRESETS.map((p) => {
                const isActive = preset === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    role="radio"
                    aria-checked={isActive}
                    className={`preset-card${isActive ? ' preset-card--active' : ''}`}
                    onClick={() => setPreset(p.id)}
                  >
                    <div className="preset-card__top">
                      <span
                        className="preset-card__swatch"
                        style={{
                          borderRadius: p.radius,
                          ...(p.badgeStyle || { backgroundColor: p.accentColor }),
                        }}
                        aria-hidden="true"
                      >
                        {isActive ? (
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        ) : (
                          'Aa'
                        )}
                      </span>
                      {isActive && <span className="preset-card__badge">Active</span>}
                    </div>

                    <div className="preset-card__title">{p.name}</div>
                    <p className="preset-card__desc">{p.description}</p>

                    <div className="preset-card__ramp" aria-hidden="true">
                      {p.palette.map((color, idx) => (
                        <span
                          key={idx}
                          className="preset-card__ramp-chip"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </Showcase>
      </Section>

      <Separator style={{ marginBlock: '2rem' }} />

      <Section title="Customising one component" description="Component-layer variables let you restyle a single element without forking it.">
        <Showcase
          code={`<Button style={{ '--btn-radius': '9999px', '--btn-px': '2rem' }}>
  Pill button
</Button>`}
        >
          <div className="row-wrap">
            <Button style={{ '--btn-radius': '9999px', '--btn-px': '2rem' } as React.CSSProperties}>
              Pill button
            </Button>
            <Button
              variant="secondary"
              style={{ '--btn-radius': '0.25rem', '--btn-h': '3rem' } as React.CSSProperties}
            >
              Square & tall
            </Button>
            <Button
              variant="outline"
              style={{ '--btn-radius': '0', '--btn-fs': '1.05rem' } as React.CSSProperties}
            >
              Brutalist
            </Button>
          </div>
        </Showcase>
      </Section>

      <Section title="Dark mode contract">
        <div className="prose-stack">
          <p className="prose">
            Dark mode is not a separate stylesheet — it is a second set of semantic
            values under <code>[data-pui-theme="dark"]</code>. Two rules make the
            difference between a passable dark theme and a good one:
          </p>
          <Card>
            <CardBody>
              <ul className="tick-list">
                <li>
                  <strong>Shadows are replaced by borders.</strong> A drop shadow is
                  invisible on a near-black surface, so elevation is carried by
                  <code> --pui-border</code> getting lighter as surfaces rise.
                </li>
                <li>
                  <strong>Saturated colours are lightened.</strong> Brand 500 works
                  on white but reads muddy on #0c0b0a, so dark mode uses brand 400
                  for <code>--pui-primary</code> and keeps text contrast above 4.5:1.
                </li>
              </ul>
              <div style={{ marginTop: '1rem' }}>
                <Switch
                  label="Show me an example of a stateful control"
                  description="Switch, checkbox and radio all recolor automatically."
                  checked={notifications}
                  onCheckedChange={setNotifications}
                />
              </div>
            </CardBody>
          </Card>
        </div>
      </Section>
    </DocPage>
  );
}
