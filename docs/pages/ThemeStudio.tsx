import { useMemo, useState } from 'react';
import {
  Avatar,
  AvatarGroup,
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  Combobox,
  Input,
  Progress,
  Radio,
  RadioGroup,
  Separator,
  Stat,
  Switch,
  Tabs,
} from '../../src/index';
import { CodeBlock } from '../components/CodeBlock';
import { Callout } from '../components/Showcase';
import { DocPage, Section } from '../components/DocPage';

interface Preset {
  name: string;
  hue: number;
  saturation: number;
}

const PRESETS: Preset[] = [
  { name: 'Electric Indigo', hue: 239, saturation: 84 },
  { name: 'Violet', hue: 268, saturation: 80 },
  { name: 'Sky', hue: 205, saturation: 85 },
  { name: 'Emerald', hue: 157, saturation: 68 },
  { name: 'Rose', hue: 350, saturation: 78 },
  { name: 'Graphite', hue: 220, saturation: 12 },
];

/** Lightness ladder for the 11-step ramp, tuned so 500 sits at ~50% L. */
const RAMP_L = [97, 94, 87, 76, 62, 50, 44, 38, 32, 26, 15];
const RAMP_KEYS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

function buildRamp(hue: number, saturation: number) {
  return RAMP_KEYS.map((key, index) => {
    const lightness = RAMP_L[index]!;
    // Nudge saturation down at the dark end so text stays readable.
    const sat = index >= 8 ? Math.max(saturation - 10, 8) : saturation;
    return { key, value: `hsl(${hue} ${sat}% ${lightness}%)` };
  });
}

function buildThemeVars(hue: number, saturation: number, radius: number): Record<string, string> {
  const ramp = buildRamp(hue, saturation);
  const vars: Record<string, string> = {};
  ramp.forEach((step) => {
    vars[`--pui-brand-${step.key}`] = step.value;
  });

  vars['--pui-primary'] = `var(--pui-brand-500)`;
  vars['--pui-primary-hover'] = `var(--pui-brand-600)`;
  vars['--pui-primary-active'] = `var(--pui-brand-700)`;
  // Derived with color-mix rather than pinned to ramp steps, so the preview
  // stays correct whether the surrounding site is in light or dark mode.
  vars['--pui-primary-subtle'] = `color-mix(in oklab, var(--pui-brand-500) 14%, transparent)`;
  vars['--pui-primary-border'] = `color-mix(in oklab, var(--pui-brand-500) 38%, transparent)`;
  vars['--pui-primary-fg'] = `color-mix(in oklab, var(--pui-brand-400) 78%, var(--pui-fg))`;
  vars['--pui-focus-ring'] = `var(--pui-brand-500)`;
  vars['--pui-radius-md'] = `${radius}px`;
  vars['--pui-radius-lg'] = `${radius * 1.5}px`;
  vars['--pui-radius-xl'] = `${radius * 2}px`;
  return vars;
}

function buildCss(hue: number, saturation: number, radius: number) {
  const ramp = buildRamp(hue, saturation);
  const lines = [
    ':root {',
    '  /* Brand ramp */',
    ...ramp.map((step) => `  --pui-brand-${step.key}: ${step.value};`),
    '',
    '  /* Semantic mapping */',
    '  --pui-primary:        var(--pui-brand-500);',
    '  --pui-primary-hover:  var(--pui-brand-600);',
    '  --pui-primary-active: var(--pui-brand-700);',
    '  --pui-primary-subtle: color-mix(in oklab, var(--pui-brand-500) 14%, transparent);',
    '  --pui-primary-border: color-mix(in oklab, var(--pui-brand-500) 38%, transparent);',
    '  --pui-primary-fg:     color-mix(in oklab, var(--pui-brand-400) 78%, var(--pui-fg));',
    '',
    '  /* Shape */',
    `  --pui-radius-md: ${radius}px;`,
    `  --pui-radius-lg: ${(radius * 1.5).toFixed(2)}px;`,
    `  --pui-radius-xl: ${(radius * 2).toFixed(2)}px;`,
    '}',
  ];
  return lines.join('\n');
}

export function ThemeStudioPage() {
  const [hue, setHue] = useState(239);
  const [saturation, setSaturation] = useState(84);
  const [radius, setRadius] = useState(10);
  const [activePreset, setActivePreset] = useState('Electric Indigo');

  const vars = useMemo(() => buildThemeVars(hue, saturation, radius), [hue, saturation, radius]);
  const css = useMemo(() => buildCss(hue, saturation, radius), [hue, saturation, radius]);
  const ramp = useMemo(() => buildRamp(hue, saturation), [hue, saturation]);

  const applyPreset = (preset: Preset) => {
    setHue(preset.hue);
    setSaturation(preset.saturation);
    setActivePreset(preset.name);
  };

  return (
    <DocPage
      eyebrow="Foundations"
      title="Theme studio"
      lede={
        <>
          Move the sliders and every component below re-themes in real time. The
          controls write real design tokens — nothing here is a mock-up. Copy the
          generated CSS straight into your project.
        </>
      }
    >
      <div className="studio">
        <aside className="studio__panel">
          <div className="studio__group">
            <div className="studio__label">Presets</div>
            <div className="studio__presets">
              {PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  className={`studio__preset${activePreset === preset.name ? ' studio__preset--active' : ''}`}
                  onClick={() => applyPreset(preset)}
                >
                  <span
                    className="studio__preset-dot"
                    style={{ background: `hsl(${preset.hue} ${preset.saturation}% 50%)` }}
                  />
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          <Separator />

          <div className="studio__group">
            <label className="studio__label" htmlFor="studio-hue">
              Hue
              <span className="studio__value">{hue}°</span>
            </label>
            <input
              id="studio-hue"
              type="range"
              min={0}
              max={360}
              value={hue}
              onChange={(event) => {
                setHue(Number(event.target.value));
                setActivePreset('Custom');
              }}
              className="studio__range studio__range--hue"
              style={{ background: `linear-gradient(90deg, ${[0, 60, 120, 180, 240, 300, 360].map((h) => `hsl(${h} ${saturation}% 50%)`).join(', ')})` }}
            />
          </div>

          <div className="studio__group">
            <label className="studio__label" htmlFor="studio-sat">
              Saturation
              <span className="studio__value">{saturation}%</span>
            </label>
            <input
              id="studio-sat"
              type="range"
              min={0}
              max={100}
              value={saturation}
              onChange={(event) => {
                setSaturation(Number(event.target.value));
                setActivePreset('Custom');
              }}
              className="studio__range"
            />
          </div>

          <div className="studio__group">
            <label className="studio__label" htmlFor="studio-radius">
              Corner radius
              <span className="studio__value">{radius}px</span>
            </label>
            <input
              id="studio-radius"
              type="range"
              min={0}
              max={20}
              value={radius}
              onChange={(event) => setRadius(Number(event.target.value))}
              className="studio__range"
            />
          </div>

          <Separator />

          <div className="studio__group">
            <div className="studio__label">Generated ramp</div>
            <div className="studio__ramp">
              {ramp.map((step) => (
                <div key={step.key} className="studio__ramp-step" style={{ background: step.value }}>
                  <span>{step.key}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* One attribute scope: everything inside reads the generated tokens. */}
        <div className="studio__preview" style={vars as React.CSSProperties}>
          <div className="studio__preview-inner">
            <div className="preview-grid">
              <Card>
                <CardHeader
                  title="Team invite"
                  description="Two seats left on the Growth plan."
                  action={<Badge tone="primary" dot>Active</Badge>}
                />
                <CardBody>
                  <div className="stack">
                    <Input label="Workspace name" placeholder="Acme Inc." defaultValue="Acme Inc." />
                    <Combobox
                      label="Role"
                      defaultValue="member"
                      options={[
                        { value: 'owner', label: 'Owner' },
                        { value: 'admin', label: 'Administrator' },
                        { value: 'member', label: 'Member' },
                        { value: 'viewer', label: 'Viewer' },
                      ]}
                    />
                    <RadioGroup defaultValue="email" aria-label="Delivery method">
                      <Radio value="email" label="Email invitation" />
                      <Radio value="link" label="Shareable link" description="Expires in 7 days" />
                    </RadioGroup>
                    <Separator />
                    <Switch defaultChecked label="Require 2FA for this workspace" />
                    <Checkbox defaultChecked label="Notify me when the invite is accepted" />
                    <div className="row-wrap">
                      <Button>Send invite</Button>
                      <Button variant="secondary">Save draft</Button>
                    </div>
                  </div>
                </CardBody>
              </Card>

              <div className="stack">
                <Card padded>
                  <div className="stat-row">
                    <Stat label="Monthly recurring" value="$48,290" delta={12.4} size="sm" />
                    <Stat label="Active seats" value="1,204" delta={-2.1} size="sm" />
                  </div>
                  <Separator style={{ marginBlock: '1rem' }} />
                  <div className="stack">
                    <div className="progress-line">
                      <span>Onboarding</span>
                      <Progress value={72} />
                      <span className="progress-line__value">72%</span>
                    </div>
                    <div className="progress-line">
                      <span>Storage</span>
                      <Progress value={38} tone="warning" />
                      <span className="progress-line__value">38%</span>
                    </div>
                  </div>
                </Card>

                <Card padded>
                  <div className="stack">
                    <div className="row-between">
                      <strong>Plan members</strong>
                      <AvatarGroup
                        people={[
                          { name: 'Ada Lovelace' },
                          { name: 'Grace Hopper' },
                          { name: 'Alan Turing' },
                          { name: 'Katherine Johnson' },
                          { name: 'Linus Torvalds' },
                        ]}
                        max={4}
                        size="sm"
                      />
                    </div>
                    <div className="row-between">
                      <Avatar name="Ada Lovelace" size="lg" status="online" />
                      <div className="stack" style={{ flex: 1, gap: '0.35rem' }}>
                        <div className="row-wrap">
                          <Badge tone="success">Healthy</Badge>
                          <Badge tone="warning">Trial</Badge>
                          <Badge tone="info">Beta</Badge>
                          <Badge tone="danger">Overdue</Badge>
                        </div>
                        <Progress value={64} tone="success" />
                      </div>
                    </div>
                  </div>
                </Card>

                <Card padded>
                  <Tabs
                    items={[
                      { value: 'overview', label: 'Overview', content: <p className="prose">Tabs inherit the accent colour from <code>--pui-primary-fg</code>.</p> },
                      { value: 'usage', label: 'Usage', content: <p className="prose">The active indicator is <code>--pui-primary</code>.</p> },
                      { value: 'billing', label: 'Billing', content: <p className="prose">Disabled states stay legible at every hue.</p> },
                    ]}
                  />
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Section title="Generated CSS" description="Paste into your global stylesheet, after the library import.">
        <CodeBlock code={css} language="css" />
        <Callout tone="info" title="Generated from real tokens">
          The sliders produce the same 11-step ramp structure the library ships
          with, so the generated CSS is complete — not a partial override.
        </Callout>
      </Section>
    </DocPage>
  );
}
