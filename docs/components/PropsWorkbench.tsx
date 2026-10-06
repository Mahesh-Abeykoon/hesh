import { useEffect, useState, type ReactNode } from 'react';
import {
  Badge,
  Button,
  Checkbox,
  Input,
  NumberInput,
  OtpInput,
  PasswordInput,
  SegmentedControl,
  Select,
  Slider,
  Switch,
  TagInput,
  Textarea,
  type ButtonVariant,
  type ButtonSize,
  type BadgeTone,
  type SliderMark,
  type SegmentedControlOption,
} from '../../src/index';
import { ArrowRightIcon, PlusIcon, SparklesIcon, TrashIcon } from '../../src/index';
import { CodeBlock } from './CodeBlock';
import { LiveCodeEditor, LiveErrorBoundary, useLiveCompiler } from './LivePlayground';

/* ------------------------------------------------------------------ Generic Wrapper */

export interface PropsWorkbenchProps {
  title: string;
  badge?: string;
  preview: ReactNode;
  controls: ReactNode;
  code: string;
}

export function PropsWorkbench({
  title,
  badge = 'Interactive',
  preview,
  controls,
  code,
}: PropsWorkbenchProps) {
  const [mode, setMode] = useState<'controls' | 'live'>('controls');
  const [liveCode, setLiveCode] = useState(code);

  useEffect(() => {
    if (mode === 'controls') {
      setLiveCode(code);
    }
  }, [code, mode]);

  const { element: liveElement, error: liveError } = useLiveCompiler(liveCode);

  return (
    <div className="workbench">
      <div className="workbench__header">
        <div className="workbench__title">
          <span>{title}</span>
          <Badge tone="primary" pill>
            {badge}
          </Badge>
        </div>

        <div className="workbench__mode-switcher">
          <button
            type="button"
            className={`workbench__mode-btn${mode === 'controls' ? ' workbench__mode-btn--active' : ''}`}
            onClick={() => setMode('controls')}
          >
            ⚙️ Visual Controls
          </button>
          <button
            type="button"
            className={`workbench__mode-btn${mode === 'live' ? ' workbench__mode-btn--active' : ''}`}
            onClick={() => setMode('live')}
          >
            💻 Live Code Editor
          </button>
        </div>
      </div>

      <div className="workbench__body">
        <div className="workbench__preview">
          {mode === 'controls' ? (
            preview
          ) : liveError ? (
            <div className="live-error">
              <div className="live-error__title">Transform / Syntax Notice</div>
              <div className="live-error__message">{liveError.message}</div>
            </div>
          ) : (
            <LiveErrorBoundary
              fallback={(runtimeErr) => (
                <div className="live-error">
                  <div className="live-error__title">Runtime Notice</div>
                  <div className="live-error__message">{runtimeErr.message}</div>
                </div>
              )}
              resetKey={liveCode}
            >
              {liveElement}
            </LiveErrorBoundary>
          )}
        </div>

        {mode === 'controls' ? (
          <div className="workbench__controls">{controls}</div>
        ) : (
          <div className="workbench__controls" style={{ padding: 0 }}>
            <LiveCodeEditor
              code={liveCode}
              onChange={setLiveCode}
              onReset={() => setLiveCode(code)}
              minHeight="220px"
              maxHeight="380px"
            />
          </div>
        )}
      </div>

      {mode === 'controls' && (
        <div className="workbench__code-footer">
          <CodeBlock code={code} language="tsx" />
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ Button Workbench */

export function ButtonWorkbench() {
  const [variant, setVariant] = useState<ButtonVariant>('primary');
  const [size, setSize] = useState<ButtonSize>('md');
  const [text, setText] = useState('Explore library');
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [icon, setIcon] = useState<'none' | 'left' | 'right' | 'both'>('left');

  const variants: ButtonVariant[] = ['primary', 'secondary', 'outline', 'ghost', 'subtle', 'danger', 'link'];
  const sizes: ButtonSize[] = ['xs', 'sm', 'md', 'lg', 'xl'];

  const leftIcon = icon === 'left' || icon === 'both' ? <SparklesIcon size={size === 'xs' ? 12 : 14} /> : undefined;
  const rightIcon = icon === 'right' || icon === 'both' ? <ArrowRightIcon size={size === 'xs' ? 12 : 14} /> : undefined;

  // Generate clean JSX string
  const propList: string[] = [];
  if (variant !== 'primary') propList.push(`variant="${variant}"`);
  if (size !== 'md') propList.push(`size="${size}"`);
  if (loading) propList.push('loading');
  if (disabled) propList.push('disabled');
  if (icon === 'left' || icon === 'both') propList.push('leftIcon={<SparklesIcon />}');
  if (icon === 'right' || icon === 'both') propList.push('rightIcon={<ArrowRightIcon />}');

  const jsx = propList.length > 0
    ? `<Button ${propList.join(' ')}>\n  ${text}\n</Button>`
    : `<Button>\n  ${text}\n</Button>`;

  return (
    <PropsWorkbench
      title="Button Workbench"
      preview={
        <Button
          variant={variant}
          size={size}
          loading={loading}
          disabled={disabled}
          leftIcon={leftIcon}
          rightIcon={rightIcon}
        >
          {text}
        </Button>
      }
      controls={
        <>
          <div className="workbench__control-group">
            <span className="workbench__control-label">Variant</span>
            <div className="workbench__pills">
              {variants.map((v) => (
                <button
                  key={v}
                  type="button"
                  className={`workbench__pill${variant === v ? ' workbench__pill--active' : ''}`}
                  onClick={() => setVariant(v)}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          <div className="workbench__control-group">
            <span className="workbench__control-label">Size</span>
            <div className="workbench__pills">
              {sizes.map((s) => (
                <button
                  key={s}
                  type="button"
                  className={`workbench__pill${size === s ? ' workbench__pill--active' : ''}`}
                  onClick={() => setSize(s)}
                >
                  {s.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="workbench__control-group">
            <span className="workbench__control-label">Icons</span>
            <div className="workbench__pills">
              {(['none', 'left', 'right', 'both'] as const).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  className={`workbench__pill${icon === opt ? ' workbench__pill--active' : ''}`}
                  onClick={() => setIcon(opt)}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div className="workbench__control-group">
            <span className="workbench__control-label">Label Text</span>
            <Input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Button text"
            />
          </div>

          <div className="workbench__switches">
            <Switch
              label="Loading state"
              checked={loading}
              onCheckedChange={setLoading}
            />
            <Switch
              label="Disabled"
              checked={disabled}
              onCheckedChange={setDisabled}
            />
          </div>
        </>
      }
      code={jsx}
    />
  );
}

/* ------------------------------------------------------------------ Badge Workbench */

export function BadgeWorkbench() {
  const [tone, setTone] = useState<BadgeTone>('primary');
  const [dot, setDot] = useState(true);
  const [pill, setPill] = useState(true);
  const [text, setText] = useState('New feature');

  const tones: BadgeTone[] = ['primary', 'neutral', 'success', 'warning', 'danger', 'info', 'outline'];

  const propList: string[] = [];
  if (tone !== 'neutral') propList.push(`tone="${tone}"`);
  if (dot) propList.push('dot');
  if (pill) propList.push('pill');

  const jsx = propList.length > 0
    ? `<Badge ${propList.join(' ')}>${text}</Badge>`
    : `<Badge>${text}</Badge>`;

  return (
    <PropsWorkbench
      title="Badge Workbench"
      preview={
        <Badge tone={tone} dot={dot} pill={pill}>
          {text}
        </Badge>
      }
      controls={
        <>
          <div className="workbench__control-group">
            <span className="workbench__control-label">Tone</span>
            <div className="workbench__pills">
              {tones.map((t) => (
                <button
                  key={t}
                  type="button"
                  className={`workbench__pill${tone === t ? ' workbench__pill--active' : ''}`}
                  onClick={() => setTone(t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="workbench__control-group">
            <span className="workbench__control-label">Label</span>
            <Input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Badge label"
            />
          </div>

          <div className="workbench__switches">
            <Switch label="Leading status dot" checked={dot} onCheckedChange={setDot} />
            <Switch label="Pill radius" checked={pill} onCheckedChange={setPill} />
          </div>
        </>
      }
      code={jsx}
    />
  );
}

/* ------------------------------------------------------------------ Input Workbench */

export function InputWorkbench() {
  const [label, setLabel] = useState('Email address');
  const [placeholder, setPlaceholder] = useState('alex@example.com');
  const [hint, setHint] = useState('We will never share your email.');
  const [error, setError] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [value, setValue] = useState('');

  const propList: string[] = [];
  if (label) propList.push(`label="${label}"`);
  if (placeholder) propList.push(`placeholder="${placeholder}"`);
  if (hint && !error) propList.push(`hint="${hint}"`);
  if (error) propList.push('error="Please enter a valid work email"');
  if (disabled) propList.push('disabled');

  const jsx = `<Input\n  ${propList.join('\n  ')}\n/>`;

  return (
    <PropsWorkbench
      title="Input Workbench"
      preview={
        <div style={{ width: '100%', maxWidth: '22rem' }}>
          <Input
            label={label}
            placeholder={placeholder}
            hint={hint}
            error={error ? 'Please enter a valid work email' : undefined}
            disabled={disabled}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>
      }
      controls={
        <>
          <div className="workbench__control-group">
            <span className="workbench__control-label">Label text</span>
            <Input value={label} onChange={(e) => setLabel(e.target.value)} />
          </div>

          <div className="workbench__control-group">
            <span className="workbench__control-label">Placeholder</span>
            <Input value={placeholder} onChange={(e) => setPlaceholder(e.target.value)} />
          </div>

          <div className="workbench__control-group">
            <span className="workbench__control-label">Help hint</span>
            <Input value={hint} onChange={(e) => setHint(e.target.value)} />
          </div>

          <div className="workbench__switches">
            <Switch
              label="Error state"
              checked={error}
              onCheckedChange={setError}
            />
            <Switch
              label="Disabled"
              checked={disabled}
              onCheckedChange={setDisabled}
            />
          </div>
        </>
      }
      code={jsx}
    />
  );
}

/* ------------------------------------------------------------------ TagInput Workbench */

export function TagInputWorkbench() {
  const [tags, setTags] = useState<string[]>(['React', 'TypeScript', 'Tailwind']);
  const [placeholder, setPlaceholder] = useState('Add framework…');
  const [maxTags, setMaxTags] = useState<number | undefined>(6);
  const [allowDuplicates, setAllowDuplicates] = useState(false);
  const [addOnBlur, setAddOnBlur] = useState(true);
  const [disabled, setDisabled] = useState(false);

  const propList: string[] = ['value={tags}', 'onChange={setTags}'];
  if (placeholder && placeholder !== 'Add tag...') propList.push(`placeholder="${placeholder}"`);
  if (maxTags !== undefined) propList.push(`maxTags={${maxTags}}`);
  if (allowDuplicates) propList.push('allowDuplicates');
  if (addOnBlur) propList.push('addOnBlur');
  if (disabled) propList.push('disabled');

  const jsx = `const [tags, setTags] = useState<string[]>(${JSON.stringify(tags)});\n\n<TagInput\n  ${propList.join('\n  ')}\n/>`;

  return (
    <PropsWorkbench
      title="TagInput Workbench"
      preview={
        <div style={{ width: '100%', maxWidth: '28rem' }}>
          <TagInput
            value={tags}
            onChange={setTags}
            placeholder={placeholder}
            maxTags={maxTags}
            allowDuplicates={allowDuplicates}
            addOnBlur={addOnBlur}
            disabled={disabled}
          />
          <div style={{ marginTop: '0.625rem', fontSize: '0.75rem', color: 'var(--pui-fg-muted)' }}>
            Active tag count: <strong>{tags.length}</strong> {maxTags ? `of ${maxTags} max` : ''}
          </div>
        </div>
      }
      controls={
        <>
          <div className="workbench__control-group">
            <span className="workbench__control-label">Placeholder</span>
            <Input value={placeholder} onChange={(e) => setPlaceholder(e.target.value)} />
          </div>

          <div className="workbench__control-group">
            <span className="workbench__control-label">Max Tags Limit</span>
            <div className="workbench__pills">
              {([undefined, 3, 5, 8] as const).map((limit) => (
                <button
                  key={String(limit)}
                  type="button"
                  className={`workbench__pill${maxTags === limit ? ' workbench__pill--active' : ''}`}
                  onClick={() => setMaxTags(limit)}
                >
                  {limit === undefined ? 'None' : limit}
                </button>
              ))}
            </div>
          </div>

          <div className="workbench__switches">
            <Switch
              label="Commit on blur (addOnBlur)"
              checked={addOnBlur}
              onCheckedChange={setAddOnBlur}
            />
            <Switch
              label="Allow duplicate tags"
              checked={allowDuplicates}
              onCheckedChange={setAllowDuplicates}
            />
            <Switch
              label="Disabled"
              checked={disabled}
              onCheckedChange={setDisabled}
            />
          </div>
        </>
      }
      code={jsx}
    />
  );
}

/* ------------------------------------------------------------------ Slider Workbench */

export function SliderWorkbench() {
  const [val, setVal] = useState(60);
  const [size, setSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [showTooltip, setShowTooltip] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const [hasMarks, setHasMarks] = useState(false);

  const marks: SliderMark[] = [
    { value: 0, label: '0%' },
    { value: 25, label: '25%' },
    { value: 50, label: '50%' },
    { value: 75, label: '75%' },
    { value: 100, label: '100%' },
  ];

  const propList: string[] = ['value={value}', 'onValueChange={setValue}'];
  if (size !== 'md') propList.push(`size="${size}"`);
  if (showTooltip) propList.push('showTooltip');
  if (disabled) propList.push('disabled');
  if (hasMarks) propList.push('marks={marks}');

  const jsx = `const [value, setValue] = useState(${val});\n\n<Slider\n  label="Volume Control"\n  ${propList.join('\n  ')}\n/>`;

  return (
    <PropsWorkbench
      title="Slider Workbench"
      preview={
        <div style={{ width: '100%', maxWidth: '24rem', paddingBottom: hasMarks ? '1rem' : 0 }}>
          <Slider
            label="Volume Control"
            value={val}
            onValueChange={setVal}
            size={size}
            showTooltip={showTooltip}
            disabled={disabled}
            marks={hasMarks ? marks : undefined}
          />
          <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: 'var(--pui-fg-muted)' }}>
            Current value: <strong>{val}%</strong>
          </div>
        </div>
      }
      controls={
        <>
          <div className="workbench__control-group">
            <span className="workbench__control-label">Size</span>
            <div className="workbench__pills">
              {(['sm', 'md', 'lg'] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  className={`workbench__pill${size === s ? ' workbench__pill--active' : ''}`}
                  onClick={() => setSize(s)}
                >
                  {s.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="workbench__switches">
            <Switch
              label="Live tooltip on thumb"
              checked={showTooltip}
              onCheckedChange={setShowTooltip}
            />
            <Switch
              label="Step marks & ticks"
              checked={hasMarks}
              onCheckedChange={setHasMarks}
            />
            <Switch
              label="Disabled"
              checked={disabled}
              onCheckedChange={setDisabled}
            />
          </div>
        </>
      }
      code={jsx}
    />
  );
}

/* ------------------------------------------------------------------ Select Workbench */

export function SelectWorkbench() {
  const [val, setVal] = useState('us-east');
  const [size, setSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [hasPlaceholder, setHasPlaceholder] = useState(false);
  const [hasHint, setHasHint] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isGrouped, setIsGrouped] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [required, setRequired] = useState(false);

  const flatOptions = [
    { value: 'us-east', label: 'US East (N. Virginia)' },
    { value: 'us-west', label: 'US West (Oregon)' },
    { value: 'eu-west', label: 'Europe (Frankfurt)' },
    { value: 'ap-east', label: 'Asia Pacific (Tokyo)' },
  ];

  const groupedOptions = [
    { value: 'us-east', label: 'US East (N. Virginia)', group: 'Americas' },
    { value: 'us-west', label: 'US West (Oregon)', group: 'Americas' },
    { value: 'eu-west', label: 'Europe (Frankfurt)', group: 'Europe' },
    { value: 'eu-central', label: 'Europe (Zurich)', group: 'Europe' },
    { value: 'ap-east', label: 'Asia Pacific (Tokyo)', group: 'Asia-Pacific' },
  ];

  const activeOptions = isGrouped ? groupedOptions : flatOptions;

  const propList: string[] = [
    'label="Deployment Region"',
    'value={region}',
    'onChange={(e) => setRegion(e.target.value)}',
  ];
  if (size !== 'md') propList.push(`size="${size}"`);
  if (hasPlaceholder) propList.push('placeholder="Select a deployment region…"');
  if (hasHint) propList.push('hint="Traffic will route to this nearest region."');
  if (hasError) propList.push('error="Selected region is temporarily at capacity."');
  if (required) propList.push('required');
  if (disabled) propList.push('disabled');
  propList.push('options={options}');

  const jsx = `const [region, setRegion] = useState('${val}');\n\n<Select\n  ${propList.join('\n  ')}\n/>`;

  return (
    <PropsWorkbench
      title="Select Workbench"
      preview={
        <div style={{ width: '100%', maxWidth: '24rem' }}>
          <Select
            label="Deployment Region"
            value={val}
            onChange={(e) => setVal(e.target.value)}
            size={size}
            placeholder={hasPlaceholder ? 'Select a deployment region…' : undefined}
            hint={hasHint ? 'Traffic will route to this nearest region.' : undefined}
            error={hasError ? 'Selected region is temporarily at capacity.' : undefined}
            required={required}
            disabled={disabled}
            options={activeOptions}
          />
          <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: 'var(--pui-fg-muted)' }}>
            Selected value: <code>"{val}"</code>
          </div>
        </div>
      }
      controls={
        <>
          <div className="workbench__control-group">
            <span className="workbench__control-label">Size</span>
            <div className="workbench__pills">
              {(['sm', 'md', 'lg'] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  className={`workbench__pill${size === s ? ' workbench__pill--active' : ''}`}
                  onClick={() => setSize(s)}
                >
                  {s.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="workbench__switches">
            <Switch
              label="Grouped options (optgroup)"
              checked={isGrouped}
              onCheckedChange={setIsGrouped}
            />
            <Switch
              label="Placeholder prompt"
              checked={hasPlaceholder}
              onCheckedChange={setHasPlaceholder}
            />
            <Switch
              label="Hint text"
              checked={hasHint}
              onCheckedChange={setHasHint}
            />
            <Switch
              label="Validation error"
              checked={hasError}
              onCheckedChange={setHasError}
            />
            <Switch
              label="Required indicator"
              checked={required}
              onCheckedChange={setRequired}
            />
            <Switch
              label="Disabled"
              checked={disabled}
              onCheckedChange={setDisabled}
            />
          </div>
        </>
      }
      code={jsx}
    />
  );
}

/* ------------------------------------------------------------------ Textarea Workbench */

export function TextareaWorkbench() {
  const [val, setVal] = useState('Production incidents must follow the standard post-mortem template.');
  const [size, setSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [rows, setRows] = useState(4);
  const [showCount, setShowCount] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [required, setRequired] = useState(false);

  const propList: string[] = [
    'label="Incident Summary"',
    'value={summary}',
    'onChange={(e) => setSummary(e.target.value)}',
  ];
  if (size !== 'md') propList.push(`size="${size}"`);
  if (rows !== 4) propList.push(`rows={${rows}}`);
  if (showCount) {
    propList.push('showCount');
    propList.push('maxLength={200}');
  }
  if (hasError) propList.push('error="Summary must include impact assessment."');
  if (required) propList.push('required');
  if (disabled) propList.push('disabled');

  const jsx = `const [summary, setSummary] = useState('${val}');\n\n<Textarea\n  ${propList.join('\n  ')}\n/>`;

  return (
    <PropsWorkbench
      title="Textarea Workbench"
      preview={
        <div style={{ width: '100%', maxWidth: '24rem' }}>
          <Textarea
            label="Incident Summary"
            value={val}
            onChange={(e) => setVal(e.target.value)}
            size={size}
            rows={rows}
            showCount={showCount}
            maxLength={showCount ? 200 : undefined}
            error={hasError ? 'Summary must include impact assessment.' : undefined}
            required={required}
            disabled={disabled}
            placeholder="Describe the incident details…"
          />
        </div>
      }
      controls={
        <>
          <div className="workbench__control-group">
            <span className="workbench__control-label">Size</span>
            <div className="workbench__pills">
              {(['sm', 'md', 'lg'] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  className={`workbench__pill${size === s ? ' workbench__pill--active' : ''}`}
                  onClick={() => setSize(s)}
                >
                  {s.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="workbench__control-group">
            <span className="workbench__control-label">Rows</span>
            <div className="workbench__pills">
              {[2, 4, 6].map((r) => (
                <button
                  key={r}
                  type="button"
                  className={`workbench__pill${rows === r ? ' workbench__pill--active' : ''}`}
                  onClick={() => setRows(r)}
                >
                  {r} ROWS
                </button>
              ))}
            </div>
          </div>

          <div className="workbench__switches">
            <Switch
              label="Live character counter"
              checked={showCount}
              onCheckedChange={setShowCount}
            />
            <Switch
              label="Validation error"
              checked={hasError}
              onCheckedChange={setHasError}
            />
            <Switch
              label="Required indicator"
              checked={required}
              onCheckedChange={setRequired}
            />
            <Switch
              label="Disabled"
              checked={disabled}
              onCheckedChange={setDisabled}
            />
          </div>
        </>
      }
      code={jsx}
    />
  );
}

/* ------------------------------------------------------------------ Switch Workbench */

export function SwitchWorkbench() {
  const [checked, setChecked] = useState(true);
  const [size, setSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [hasDesc, setHasDesc] = useState(true);
  const [disabled, setDisabled] = useState(false);

  const propList: string[] = [
    'checked={enabled}',
    'onCheckedChange={setEnabled}',
    'label="Automated Deployments"',
  ];
  if (size !== 'md') propList.push(`size="${size}"`);
  if (hasDesc) propList.push('description="Automatically trigger canary builds on merge to main."');
  if (disabled) propList.push('disabled');

  const jsx = `const [enabled, setEnabled] = useState(${checked});\n\n<Switch\n  ${propList.join('\n  ')}\n/>`;

  return (
    <PropsWorkbench
      title="Switch Workbench"
      preview={
        <div style={{ width: '100%', maxWidth: '24rem' }}>
          <Switch
            checked={checked}
            onCheckedChange={setChecked}
            size={size}
            label="Automated Deployments"
            description={hasDesc ? 'Automatically trigger canary builds on merge to main.' : undefined}
            disabled={disabled}
          />
          <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: 'var(--pui-fg-muted)' }}>
            Switch state: <strong>{checked ? 'Enabled' : 'Disabled'}</strong>
          </div>
        </div>
      }
      controls={
        <>
          <div className="workbench__control-group">
            <span className="workbench__control-label">Size</span>
            <div className="workbench__pills">
              {(['sm', 'md', 'lg'] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  className={`workbench__pill${size === s ? ' workbench__pill--active' : ''}`}
                  onClick={() => setSize(s)}
                >
                  {s.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="workbench__switches">
            <Switch
              label="Helpful description"
              checked={hasDesc}
              onCheckedChange={setHasDesc}
            />
            <Switch
              label="Disabled"
              checked={disabled}
              onCheckedChange={setDisabled}
            />
          </div>
        </>
      }
      code={jsx}
    />
  );
}

/* ------------------------------------------------------------------ Checkbox Workbench */

export function CheckboxWorkbench() {
  const [checked, setChecked] = useState(true);
  const [indeterminate, setIndeterminate] = useState(false);
  const [size, setSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [hasDesc, setHasDesc] = useState(true);
  const [disabled, setDisabled] = useState(false);

  const propList: string[] = [
    'checked={checked}',
    'onChange={(e) => setChecked(e.target.checked)}',
    'label="Email notification alerts"',
  ];
  if (size !== 'md') propList.push(`size="${size}"`);
  if (indeterminate) propList.push('indeterminate');
  if (hasDesc) propList.push('description="Receive digest emails when team members mention your handle."');
  if (disabled) propList.push('disabled');

  const jsx = `const [checked, setChecked] = useState(${checked});\n\n<Checkbox\n  ${propList.join('\n  ')}\n/>`;

  return (
    <PropsWorkbench
      title="Checkbox Workbench"
      preview={
        <div style={{ width: '100%', maxWidth: '24rem' }}>
          <Checkbox
            checked={checked}
            indeterminate={indeterminate}
            onChange={(e) => {
              if (indeterminate) setIndeterminate(false);
              setChecked(e.target.checked);
            }}
            size={size}
            label="Email notification alerts"
            description={hasDesc ? 'Receive digest emails when team members mention your handle.' : undefined}
            disabled={disabled}
          />
          <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: 'var(--pui-fg-muted)' }}>
            Status:{' '}
            <strong>
              {indeterminate ? 'Indeterminate (mixed)' : checked ? 'Checked' : 'Unchecked'}
            </strong>
          </div>
        </div>
      }
      controls={
        <>
          <div className="workbench__control-group">
            <span className="workbench__control-label">Size</span>
            <div className="workbench__pills">
              {(['sm', 'md', 'lg'] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  className={`workbench__pill${size === s ? ' workbench__pill--active' : ''}`}
                  onClick={() => setSize(s)}
                >
                  {s.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="workbench__switches">
            <Switch
              label="Indeterminate (mixed state)"
              checked={indeterminate}
              onCheckedChange={setIndeterminate}
            />
            <Switch
              label="Helpful description"
              checked={hasDesc}
              onCheckedChange={setHasDesc}
            />
            <Switch
              label="Disabled"
              checked={disabled}
              onCheckedChange={setDisabled}
            />
          </div>
        </>
      }
      code={jsx}
    />
  );
}

/* ------------------------------------------------------------------ OtpInput Workbench */

export function OtpInputWorkbench() {
  const [val, setVal] = useState('4829');
  const [length, setLength] = useState<number>(6);
  const [type, setType] = useState<'numeric' | 'alphanumeric'>('numeric');
  const [mask, setMask] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const propList: string[] = ['value={code}', 'onChange={setCode}'];
  if (length !== 6) propList.push(`length={${length}}`);
  if (type !== 'numeric') propList.push(`type="${type}"`);
  if (mask) propList.push('mask');
  if (invalid) propList.push('invalid');
  if (disabled) propList.push('disabled');
  propList.push('onComplete={(code) => console.log("Submitted:", code)}');

  const jsx = `const [code, setCode] = useState('${val}');\n\n<OtpInput\n  ${propList.join('\n  ')}\n/>`;

  return (
    <PropsWorkbench
      title="OtpInput Workbench"
      preview={
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
          <OtpInput
            length={length}
            type={type}
            mask={mask}
            invalid={invalid}
            disabled={disabled}
            value={val}
            onChange={setVal}
            onComplete={(code) => console.log('Completed code:', code)}
          />
          <div style={{ fontSize: '0.75rem', color: 'var(--pui-fg-muted)' }}>
            Entered code: <code>{val ? `"${val}"` : '(empty)'}</code>
          </div>
        </div>
      }
      controls={
        <>
          <div className="workbench__control-group">
            <span className="workbench__control-label">Length</span>
            <div className="workbench__pills">
              {[4, 6, 8].map((l) => (
                <button
                  key={l}
                  type="button"
                  className={`workbench__pill${length === l ? ' workbench__pill--active' : ''}`}
                  onClick={() => setLength(l)}
                >
                  {l} DIGITS
                </button>
              ))}
            </div>
          </div>

          <div className="workbench__control-group">
            <span className="workbench__control-label">Type</span>
            <div className="workbench__pills">
              {(['numeric', 'alphanumeric'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  className={`workbench__pill${type === t ? ' workbench__pill--active' : ''}`}
                  onClick={() => setType(t)}
                >
                  {t.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="workbench__switches">
            <Switch
              label="Mask characters (PIN dots)"
              checked={mask}
              onCheckedChange={setMask}
            />
            <Switch
              label="Validation error state"
              checked={invalid}
              onCheckedChange={setInvalid}
            />
            <Switch
              label="Disabled"
              checked={disabled}
              onCheckedChange={setDisabled}
            />
          </div>
        </>
      }
      code={jsx}
    />
  );
}

/* ------------------------------------------------------------------ PasswordInput Workbench */

export function PasswordInputWorkbench() {
  const [val, setVal] = useState('Passw0rd!');
  const [size, setSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [showToggle, setShowToggle] = useState(true);
  const [strengthMeter, setStrengthMeter] = useState(true);
  const [showRequirements, setShowRequirements] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const propList: string[] = [
    'value={password}',
    'onChange={(e) => setPassword(e.target.value)}',
    'placeholder="Enter strong password…"',
  ];
  if (size !== 'md') propList.push(`size="${size}"`);
  if (!showToggle) propList.push('showToggle={false}');
  if (strengthMeter) propList.push('strengthMeter');
  if (showRequirements) propList.push('showRequirements');
  if (invalid) propList.push('invalid');
  if (disabled) propList.push('disabled');

  const jsx = `const [password, setPassword] = useState('${val}');\n\n<PasswordInput\n  ${propList.join('\n  ')}\n/>`;

  return (
    <PropsWorkbench
      title="PasswordInput Workbench"
      preview={
        <div style={{ width: '100%', maxWidth: '24rem' }}>
          <PasswordInput
            value={val}
            onChange={(e) => setVal(e.target.value)}
            size={size}
            showToggle={showToggle}
            strengthMeter={strengthMeter}
            showRequirements={showRequirements}
            invalid={invalid}
            disabled={disabled}
            placeholder="Enter strong password…"
          />
        </div>
      }
      controls={
        <>
          <div className="workbench__control-group">
            <span className="workbench__control-label">Size</span>
            <div className="workbench__pills">
              {(['sm', 'md', 'lg'] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  className={`workbench__pill${size === s ? ' workbench__pill--active' : ''}`}
                  onClick={() => setSize(s)}
                >
                  {s.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="workbench__switches">
            <Switch
              label="Show strength meter"
              checked={strengthMeter}
              onCheckedChange={setStrengthMeter}
            />
            <Switch
              label="Show live requirements checklist"
              checked={showRequirements}
              onCheckedChange={setShowRequirements}
            />
            <Switch
              label="Reveal toggle button"
              checked={showToggle}
              onCheckedChange={setShowToggle}
            />
            <Switch
              label="Invalid / error state"
              checked={invalid}
              onCheckedChange={setInvalid}
            />
            <Switch
              label="Disabled"
              checked={disabled}
              onCheckedChange={setDisabled}
            />
          </div>
        </>
      }
      code={jsx}
    />
  );
}

/* ------------------------------------------------------------------ NumberInput Workbench */

export function NumberInputWorkbench() {
  const [val, setVal] = useState<number | undefined>(25);
  const [size, setSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [stepperPosition, setStepperPosition] = useState<'right' | 'split'>('right');
  const [hasPrefix, setHasPrefix] = useState(true);
  const [hasSuffix, setHasSuffix] = useState(false);
  const [hasLimits, setHasLimits] = useState(true);
  const [disabled, setDisabled] = useState(false);

  const propList: string[] = ['value={value}', 'onChange={setValue}'];
  if (size !== 'md') propList.push(`size="${size}"`);
  if (stepperPosition !== 'right') propList.push('stepperPosition="split"');
  if (hasLimits) {
    propList.push('min={0}');
    propList.push('max={100}');
    propList.push('step={5}');
  }
  if (hasPrefix) propList.push('prefix="$"');
  if (hasSuffix) propList.push('suffix="/mo"');
  if (disabled) propList.push('disabled');

  const jsx = `const [value, setValue] = useState(${val});\n\n<NumberInput\n  ${propList.join('\n  ')}\n/>`;

  return (
    <PropsWorkbench
      title="NumberInput Workbench"
      preview={
        <div style={{ width: '100%', maxWidth: '20rem' }}>
          <NumberInput
            value={val}
            onChange={setVal}
            size={size}
            stepperPosition={stepperPosition}
            min={hasLimits ? 0 : undefined}
            max={hasLimits ? 100 : undefined}
            step={hasLimits ? 5 : 1}
            prefix={hasPrefix ? '$' : undefined}
            suffix={hasSuffix ? '/mo' : undefined}
            disabled={disabled}
          />
          <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: 'var(--pui-fg-muted)' }}>
            Numerical value: <code>{val !== undefined ? val : 'undefined'}</code>
          </div>
        </div>
      }
      controls={
        <>
          <div className="workbench__control-group">
            <span className="workbench__control-label">Size</span>
            <div className="workbench__pills">
              {(['sm', 'md', 'lg'] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  className={`workbench__pill${size === s ? ' workbench__pill--active' : ''}`}
                  onClick={() => setSize(s)}
                >
                  {s.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="workbench__control-group">
            <span className="workbench__control-label">Stepper Layout</span>
            <div className="workbench__pills">
              {(['right', 'split'] as const).map((pos) => (
                <button
                  key={pos}
                  type="button"
                  className={`workbench__pill${stepperPosition === pos ? ' workbench__pill--active' : ''}`}
                  onClick={() => setStepperPosition(pos)}
                >
                  {pos.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="workbench__switches">
            <Switch
              label="Currency prefix ($)"
              checked={hasPrefix}
              onCheckedChange={setHasPrefix}
            />
            <Switch
              label="Duration suffix (/mo)"
              checked={hasSuffix}
              onCheckedChange={setHasSuffix}
            />
            <Switch
              label="Min=0, Max=100, Step=5"
              checked={hasLimits}
              onCheckedChange={setHasLimits}
            />
            <Switch
              label="Disabled"
              checked={disabled}
              onCheckedChange={setDisabled}
            />
          </div>
        </>
      }
      code={jsx}
    />
  );
}

/* ------------------------------------------------------------------ SegmentedControl Workbench */

export function SegmentedControlWorkbench() {
  const [val, setVal] = useState('daily');
  const [size, setSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [fullWidth, setFullWidth] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const options: SegmentedControlOption[] = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'annual', label: 'Annual' },
  ];

  const propList: string[] = ['value={frequency}', 'onChange={setFrequency}'];
  if (size !== 'md') propList.push(`size="${size}"`);
  if (fullWidth) propList.push('fullWidth');
  if (disabled) propList.push('disabled');
  propList.push('options={options}');

  const jsx = `const [frequency, setFrequency] = useState('${val}');\n\n<SegmentedControl\n  ${propList.join('\n  ')}\n/>`;

  return (
    <PropsWorkbench
      title="SegmentedControl Workbench"
      preview={
        <div style={{ width: '100%', maxWidth: fullWidth ? '100%' : '24rem' }}>
          <SegmentedControl
            options={options}
            value={val}
            onChange={setVal}
            size={size}
            fullWidth={fullWidth}
            disabled={disabled}
          />
          <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: 'var(--pui-fg-muted)' }}>
            Active segment: <code>"{val}"</code>
          </div>
        </div>
      }
      controls={
        <>
          <div className="workbench__control-group">
            <span className="workbench__control-label">Size</span>
            <div className="workbench__pills">
              {(['sm', 'md', 'lg'] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  className={`workbench__pill${size === s ? ' workbench__pill--active' : ''}`}
                  onClick={() => setSize(s)}
                >
                  {s.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="workbench__switches">
            <Switch
              label="Full container width (100%)"
              checked={fullWidth}
              onCheckedChange={setFullWidth}
            />
            <Switch
              label="Disabled"
              checked={disabled}
              onCheckedChange={setDisabled}
            />
          </div>
        </>
      }
      code={jsx}
    />
  );
}



