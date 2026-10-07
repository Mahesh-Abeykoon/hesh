import { useEffect, useState, type ReactNode } from 'react';
import {
  Alert,
  AreaChart,
  Avatar,
  BarChart,
  Carousel,
  DonutChart,
  Badge,
  Button,
  Card,
  CardHeader,
  Checkbox,
  Combobox,
  Confetti,
  DataTable,
  Dialog,
  Drawer,
  fireConfetti,
  Gauge,
  HoverCard,
  Input,
  NumberInput,
  OtpInput,
  PasswordInput,
  Progress,
  QRCode,
  SegmentedControl,
  Select,
  Slider,
  Switch,
  Tabs,
  TagInput,
  Textarea,
  Tooltip,
  type AlertTone,
  type AlertVariant,
  type AvatarSize,
  type AvatarStatus,
  type ButtonVariant,
  type ButtonSize,
  type BadgeTone,
  type Column,
  type SliderMark,
  type SegmentedControlOption,
  type TabsSize,
  type TabsVariant,
  type TooltipTone,
} from '../../src/index';
import {
  ArrowRightIcon,
  CheckIcon,
  ChevronDownIcon,
  CopyIcon,
  DownloadIcon,
  ExternalLinkIcon,
  InfoIcon,
  PlusIcon,
  SearchIcon,
  StarIcon,
  TrashIcon,
  UsersIcon,
  ZapIcon,
} from '../../src/index';
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

  const leftIcon = icon === 'left' || icon === 'both' ? <ZapIcon size={size === 'xs' ? 12 : 14} /> : undefined;
  const rightIcon = icon === 'right' || icon === 'both' ? <ArrowRightIcon size={size === 'xs' ? 12 : 14} /> : undefined;

  // Generate clean JSX string
  const propList: string[] = [];
  if (variant !== 'primary') propList.push(`variant="${variant}"`);
  if (size !== 'md') propList.push(`size="${size}"`);
  if (loading) propList.push('loading');
  if (disabled) propList.push('disabled');
  if (icon === 'left' || icon === 'both') propList.push('leftIcon={<ZapIcon />}');
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

/* ------------------------------------------------------------------ Alert Workbench */

export function AlertWorkbench() {
  const [tone, setTone] = useState<AlertTone>('info');
  const [variant, setVariant] = useState<AlertVariant>('subtle');
  const [title, setTitle] = useState('Deployment Completed');
  const [message, setMessage] = useState('All 24 edge nodes were updated with zero downtime.');
  const [hasIcon, setHasIcon] = useState(true);
  const [dismissible, setDismissible] = useState(true);
  const [hasAction, setHasAction] = useState(false);

  const tones: AlertTone[] = ['info', 'success', 'warning', 'danger', 'neutral'];
  const variants: AlertVariant[] = ['subtle', 'solid', 'accent', 'outline', 'glass'];

  const propList: string[] = [];
  if (tone !== 'info') propList.push(`tone="${tone}"`);
  if (variant !== 'subtle') propList.push(`variant="${variant}"`);
  if (title) propList.push(`title="${title}"`);
  if (!hasIcon) propList.push('icon={false}');
  if (dismissible) propList.push('onDismiss={() => {}}');
  if (hasAction) propList.push('action={<Button size="xs" variant="primary">View logs</Button>}');

  const jsx = propList.length > 0
    ? `<Alert ${propList.join(' ')}>\n  ${message}\n</Alert>`
    : `<Alert>\n  ${message}\n</Alert>`;

  return (
    <PropsWorkbench
      title="Alert Workbench"
      preview={
        <div style={{ width: '100%', maxWidth: '28rem' }}>
          <Alert
            tone={tone}
            variant={variant}
            title={title || undefined}
            icon={hasIcon ? undefined : false}
            onDismiss={dismissible ? () => {} : undefined}
            action={hasAction ? <Button size="xs" variant="primary">View logs</Button> : undefined}
          >
            {message}
          </Alert>
        </div>
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
                  {t.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="workbench__control-group">
            <span className="workbench__control-label">Variant Finish</span>
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
            <span className="workbench__control-label">Title</span>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Alert title" />
          </div>

          <div className="workbench__control-group">
            <span className="workbench__control-label">Message</span>
            <Input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Alert body message" />
          </div>

          <div className="workbench__switches">
            <Switch label="Show tone icon" checked={hasIcon} onCheckedChange={setHasIcon} />
            <Switch label="Dismissible (close button)" checked={dismissible} onCheckedChange={setDismissible} />
            <Switch label="Action button" checked={hasAction} onCheckedChange={setHasAction} />
          </div>
        </>
      }
      code={jsx}
    />
  );
}

/* ------------------------------------------------------------------ Avatar Workbench */

export function AvatarWorkbench() {
  const [name, setName] = useState('Elena Rostova');
  const [size, setSize] = useState<AvatarSize>('md');
  const [status, setStatus] = useState<AvatarStatus | 'none'>('online');
  const [square, setSquare] = useState(false);
  const [useImage, setUseImage] = useState(false);

  const sizes: AvatarSize[] = ['xs', 'sm', 'md', 'lg', 'xl'];
  const statuses: (AvatarStatus | 'none')[] = ['none', 'online', 'away', 'busy', 'offline'];

  const imgUrl = useImage ? 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160&h=160&fit=crop&crop=faces' : undefined;

  const propList: string[] = [`name="${name}"`];
  if (size !== 'md') propList.push(`size="${size}"`);
  if (square) propList.push('square');
  if (status !== 'none') propList.push(`status="${status}"`);
  if (useImage) propList.push(`src="${imgUrl}"`);

  const jsx = `<Avatar ${propList.join(' ')} />`;

  return (
    <PropsWorkbench
      title="Avatar Workbench"
      preview={
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.875rem' }}>
          <Avatar
            name={name}
            size={size}
            square={square}
            status={status === 'none' ? undefined : status}
            src={imgUrl}
          />
          <div style={{ fontSize: '0.8125rem', color: 'var(--pui-fg-muted)' }}>
            Generated Initials: <strong>{name.trim() ? name.trim().split(/\s+/).slice(0, 2).map((s) => s[0]).join('').toUpperCase() : '?'}</strong>
          </div>
        </div>
      }
      controls={
        <>
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
            <span className="workbench__control-label">Presence Status</span>
            <div className="workbench__pills">
              {statuses.map((st) => (
                <button
                  key={st}
                  type="button"
                  className={`workbench__pill${status === st ? ' workbench__pill--active' : ''}`}
                  onClick={() => setStatus(st)}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div className="workbench__control-group">
            <span className="workbench__control-label">Person Name</span>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" />
          </div>

          <div className="workbench__switches">
            <Switch label="Square avatar shape" checked={square} onCheckedChange={setSquare} />
            <Switch label="Use photo image avatar" checked={useImage} onCheckedChange={setUseImage} />
          </div>
        </>
      }
      code={jsx}
    />
  );
}

/* ------------------------------------------------------------------ Card Workbench */

export function CardWorkbench() {
  const [elevation, setElevation] = useState<'flat' | 'default' | 'elevated'>('default');
  const [padded, setPadded] = useState(true);
  const [interactive, setInteractive] = useState(false);
  const [title, setTitle] = useState('Cluster Metrics');
  const [description, setDescription] = useState('Real-time edge compute throughput');

  const elevations = ['flat', 'default', 'elevated'] as const;

  const propList: string[] = [];
  if (elevation !== 'default') propList.push(`elevation="${elevation}"`);
  if (padded) propList.push('padded');
  if (interactive) propList.push('interactive');

  const jsx = `<Card ${propList.join(' ')}>\n  <CardHeader\n    title="${title}"\n    description="${description}"\n  />\n  <p style={{ margin: '0.75rem 0 0', fontSize: '0.875rem' }}>\n    Active throughput: 14.8 GB/s across 12 zones.\n  </p>\n</Card>`;

  return (
    <PropsWorkbench
      title="Card Workbench"
      preview={
        <div style={{ width: '100%', maxWidth: '24rem' }}>
          <Card elevation={elevation} padded={padded} interactive={interactive}>
            <CardHeader title={title} description={description} />
            <p style={{ margin: '0.75rem 0 0', fontSize: '0.875rem', color: 'var(--pui-fg-muted)' }}>
              Active throughput: 14.8 GB/s across 12 zones.
            </p>
          </Card>
        </div>
      }
      controls={
        <>
          <div className="workbench__control-group">
            <span className="workbench__control-label">Elevation</span>
            <div className="workbench__pills">
              {elevations.map((el) => (
                <button
                  key={el}
                  type="button"
                  className={`workbench__pill${elevation === el ? ' workbench__pill--active' : ''}`}
                  onClick={() => setElevation(el)}
                >
                  {el.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="workbench__control-group">
            <span className="workbench__control-label">Header Title</span>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div className="workbench__control-group">
            <span className="workbench__control-label">Header Description</span>
            <Input value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>

          <div className="workbench__switches">
            <Switch label="Padded surface (card padding)" checked={padded} onCheckedChange={setPadded} />
            <Switch label="Interactive hover effect" checked={interactive} onCheckedChange={setInteractive} />
          </div>
        </>
      }
      code={jsx}
    />
  );
}

/* ------------------------------------------------------------------ Progress Workbench */

export function ProgressWorkbench() {
  const [val, setVal] = useState(68);
  const [size, setSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [tone, setTone] = useState<'primary' | 'success' | 'warning' | 'danger'>('primary');
  const [showValue, setShowValue] = useState(true);
  const [indeterminate, setIndeterminate] = useState(false);

  const sizes = ['sm', 'md', 'lg'] as const;
  const tones = ['primary', 'success', 'warning', 'danger'] as const;

  const propList: string[] = ['label="Deployment Sync"'];
  if (!indeterminate) propList.push(`value={${val}}`);
  if (size !== 'md') propList.push(`size="${size}"`);
  if (tone !== 'primary') propList.push(`tone="${tone}"`);
  if (showValue && !indeterminate) propList.push('showValue');
  if (indeterminate) propList.push('indeterminate');

  const jsx = `<Progress\n  ${propList.join('\n  ')}\n/>`;

  return (
    <PropsWorkbench
      title="Progress Workbench"
      preview={
        <div style={{ width: '100%', maxWidth: '24rem' }}>
          <Progress
            label="Deployment Sync"
            value={indeterminate ? undefined : val}
            size={size}
            tone={tone}
            showValue={showValue && !indeterminate}
            indeterminate={indeterminate}
          />
        </div>
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
                  {t.toUpperCase()}
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
            <span className="workbench__control-label">Progress Percentage ({val}%)</span>
            <Slider value={val} onValueChange={setVal} min={0} max={100} disabled={indeterminate} />
          </div>

          <div className="workbench__switches">
            <Switch label="Show percentage label" checked={showValue} onCheckedChange={setShowValue} disabled={indeterminate} />
            <Switch label="Indeterminate pulsing mode" checked={indeterminate} onCheckedChange={setIndeterminate} />
          </div>
        </>
      }
      code={jsx}
    />
  );
}

/* ------------------------------------------------------------------ Combobox Workbench */

export function ComboboxWorkbench() {
  const [size, setSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [multiple, setMultiple] = useState(false);
  const [singleVal, setSingleVal] = useState('us');
  const [multiVals, setMultiVals] = useState<string[]>(['us', 'gb']);
  const [clearable, setClearable] = useState(true);
  const [searchable, setSearchable] = useState(true);
  const [grouped, setGrouped] = useState(false);
  const [customRender, setCustomRender] = useState(false);

  const ALL_OPTIONS = [
    { value: 'us', label: 'United States', group: 'Americas', description: 'North America · +1' },
    { value: 'ca', label: 'Canada', group: 'Americas', description: 'North America · +1' },
    { value: 'gb', label: 'United Kingdom', group: 'Europe', description: 'Western Europe · +44' },
    { value: 'de', label: 'Germany', group: 'Europe', description: 'Central Europe · +49' },
    { value: 'jp', label: 'Japan', group: 'Asia-Pacific', description: 'East Asia · +81' },
    { value: 'sg', label: 'Singapore', group: 'Asia-Pacific', description: 'Southeast Asia · +65' },
    { value: 'au', label: 'Australia', group: 'Asia-Pacific', description: 'Oceania · +61' },
  ];

  const effectiveOptions = grouped
    ? ALL_OPTIONS
    : ALL_OPTIONS.map(({ group, ...rest }) => rest);

  const propList: string[] = [];
  if (size !== 'md') propList.push(`size="${size}"`);
  if (multiple) propList.push('multiple');
  if (clearable) propList.push('clearable');
  if (!searchable) propList.push('searchable={false}');
  if (multiple) {
    propList.push(`values={${JSON.stringify(multiVals)}}`);
    propList.push('onValuesChange={setValues}');
  } else {
    propList.push(`value="${singleVal}"`);
    propList.push('onValueChange={setValue}');
  }
  if (customRender) {
    propList.push(`renderOption={(opt) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
      <Avatar name={opt.label} size="xs" />
      <div>
        <div style={{ fontWeight: 600 }}>{opt.label}</div>
        <div style={{ fontSize: '0.75rem', color: 'var(--pui-fg-muted)' }}>{opt.description}</div>
      </div>
    </div>
  )}`);
  }

  const jsx = `<Combobox
  label="Select Country"
  placeholder="Search countries…"
  options={countries}
  ${propList.join('\n  ')}
/>`;

  return (
    <PropsWorkbench
      title="Combobox Workbench"
      preview={
        <div style={{ width: '100%', maxWidth: '24rem' }}>
          <Combobox
            label="Select Country"
            placeholder="Search countries…"
            size={size}
            multiple={multiple}
            options={effectiveOptions}
            value={singleVal}
            onValueChange={setSingleVal}
            values={multiVals}
            onValuesChange={setMultiVals}
            clearable={clearable}
            searchable={searchable}
            renderOption={
              customRender
                ? (opt) => (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', width: '100%' }}>
                      <Avatar name={opt.label} size="xs" />
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{opt.label}</span>
                        {opt.description && (
                          <span style={{ fontSize: '0.75rem', color: 'var(--pui-fg-muted)' }}>
                            {opt.description}
                          </span>
                        )}
                      </div>
                    </div>
                  )
                : undefined
            }
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
            <Switch label="Multi-select chips mode" checked={multiple} onCheckedChange={setMultiple} />
            <Switch label="Clearable with inline cross" checked={clearable} onCheckedChange={setClearable} />
            <Switch label="Search filterable" checked={searchable} onCheckedChange={setSearchable} />
            <Switch label="Categorized regions" checked={grouped} onCheckedChange={setGrouped} />
            <Switch label="Custom avatar renderer" checked={customRender} onCheckedChange={setCustomRender} />
          </div>
        </>
      }
      code={jsx}
    />
  );
}

/* ------------------------------------------------------------------ HoverCard Workbench */

export function HoverCardWorkbench() {
  const [placement, setPlacement] = useState<'top' | 'bottom' | 'left' | 'right'>('top');
  const [align, setAlign] = useState<'start' | 'center' | 'end'>('center');
  const [arrow, setArrow] = useState(true);
  const [width, setWidth] = useState(300);
  const [preset, setPreset] = useState<'profile' | 'repo' | 'product'>('profile');

  const placements: ('top' | 'bottom' | 'left' | 'right')[] = ['top', 'bottom', 'left', 'right'];
  const aligns: ('start' | 'center' | 'end')[] = ['start', 'center', 'end'];

  const content = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {preset === 'profile' && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Avatar name="Sarah Connor" size="md" status="online" />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>Sarah Connor</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--pui-fg-muted)' }}>@sconnor · Staff Architect</div>
            </div>
          </div>
          <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--pui-fg-muted)', lineHeight: 1.5 }}>
            Distributed systems, high-performance UI components, and accessible design tokens.
          </p>
          <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', paddingTop: '0.25rem', borderTop: '1px solid var(--pui-border)' }}>
            <div><strong>1.4k</strong> Following</div>
            <div><strong>28.9k</strong> Followers</div>
          </div>
        </>
      )}

      {preset === 'repo' && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>hesh / ui-library</span>
            <Badge tone="success" pill>v2.4.0</Badge>
          </div>
          <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--pui-fg-muted)' }}>
            Zero-dependency accessible component library built with vanilla CSS.
          </p>
          <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: 'var(--pui-fg-subtle)' }}>
            <span>★ 14,200</span>
            <span>⑂ 1,850</span>
            <span>TypeScript</span>
          </div>
        </>
      )}

      {preset === 'product' && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>Enterprise Pro Tier</span>
            <span style={{ fontWeight: 700, color: 'var(--pui-primary)' }}>$49/mo</span>
          </div>
          <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--pui-fg-muted)' }}>
            Unlimited active team seats, SOC2 compliance logs, and priority SLA runtime support.
          </p>
          <Button size="sm" variant="primary" fullWidth>Upgrade Now</Button>
        </>
      )}
    </div>
  );

  const propList: string[] = [];
  if (placement !== 'bottom') propList.push(`placement="${placement}"`);
  if (align !== 'start') propList.push(`align="${align}"`);
  if (arrow) propList.push('arrow');
  if (width !== 320) propList.push(`width={${width}}`);

  const jsx = `<HoverCard
  ${propList.join('\n  ')}
  content={/* rich preview card */}
>
  <Button variant="outline" size="sm">
    Hover to Preview
  </Button>
</HoverCard>`;

  return (
    <PropsWorkbench
      title="HoverCard Workbench"
      preview={
        <div style={{ padding: '2rem 1rem', display: 'flex', justifyContent: 'center' }}>
          <HoverCard
            placement={placement}
            align={align}
            arrow={arrow}
            width={width}
            content={content}
          >
            <Button variant="outline" size="sm" leftIcon={<UsersIcon size={14} />}>
              Hover or Tap Preview
            </Button>
          </HoverCard>
        </div>
      }
      controls={
        <>
          <div className="workbench__control-group">
            <span className="workbench__control-label">Card Preset</span>
            <div className="workbench__pills">
              {(['profile', 'repo', 'product'] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  className={`workbench__pill${preset === p ? ' workbench__pill--active' : ''}`}
                  onClick={() => setPreset(p)}
                >
                  {p.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="workbench__control-group">
            <span className="workbench__control-label">Placement</span>
            <div className="workbench__pills">
              {placements.map((p) => (
                <button
                  key={p}
                  type="button"
                  className={`workbench__pill${placement === p ? ' workbench__pill--active' : ''}`}
                  onClick={() => setPlacement(p)}
                >
                  {p.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="workbench__control-group">
            <span className="workbench__control-label">Alignment</span>
            <div className="workbench__pills">
              {aligns.map((a) => (
                <button
                  key={a}
                  type="button"
                  className={`workbench__pill${align === a ? ' workbench__pill--active' : ''}`}
                  onClick={() => setAlign(a)}
                >
                  {a.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="workbench__control-group">
            <span className="workbench__control-label">Width ({width}px)</span>
            <Slider value={width} onValueChange={setWidth} min={240} max={360} step={10} />
          </div>

          <div className="workbench__switches">
            <Switch label="Anchor pointer arrow" checked={arrow} onCheckedChange={setArrow} />
          </div>
        </>
      }
      code={jsx}
    />
  );
}

/* ------------------------------------------------------------------ Tooltip Workbench */

export function TooltipWorkbench() {
  const [tone, setTone] = useState<TooltipTone>('dark');
  const [placement, setPlacement] = useState<'top' | 'bottom' | 'left' | 'right'>('top');
  const [arrow, setArrow] = useState(true);
  const [shortcut, setShortcut] = useState<'⌘K' | '⇧⌘P' | 'Esc' | 'none'>('⌘K');
  const [text, setText] = useState('Quick search and command palette');

  const tones: TooltipTone[] = ['dark', 'light', 'primary', 'invert'];
  const placements: ('top' | 'bottom' | 'left' | 'right')[] = ['top', 'bottom', 'left', 'right'];

  const propList: string[] = [];
  if (tone !== 'dark') propList.push(`tone="${tone}"`);
  if (placement !== 'top') propList.push(`placement="${placement}"`);
  if (!arrow) propList.push('arrow={false}');
  if (shortcut !== 'none') propList.push(`shortcut="${shortcut}"`);

  const jsx = `<Tooltip
  content="${text}"
  ${propList.join('\n  ')}
>
  <Button variant="secondary" size="sm">
    Command Palette
  </Button>
</Tooltip>`;

  return (
    <PropsWorkbench
      title="Tooltip Workbench"
      preview={
        <div style={{ padding: '2.5rem 1rem', display: 'flex', justifyContent: 'center' }}>
          <Tooltip
            content={text}
            tone={tone}
            placement={placement}
            arrow={arrow}
            shortcut={shortcut !== 'none' ? shortcut : undefined}
          >
            <Button variant="secondary" size="sm" leftIcon={<ZapIcon size={14} />}>
              Hover or Focus Me
            </Button>
          </Tooltip>
        </div>
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
                  {t.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="workbench__control-group">
            <span className="workbench__control-label">Placement</span>
            <div className="workbench__pills">
              {placements.map((p) => (
                <button
                  key={p}
                  type="button"
                  className={`workbench__pill${placement === p ? ' workbench__pill--active' : ''}`}
                  onClick={() => setPlacement(p)}
                >
                  {p.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="workbench__control-group">
            <span className="workbench__control-label">Keyboard Shortcut</span>
            <div className="workbench__pills">
              {(['⌘K', '⇧⌘P', 'Esc', 'none'] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  className={`workbench__pill${shortcut === s ? ' workbench__pill--active' : ''}`}
                  onClick={() => setShortcut(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="workbench__control-group">
            <span className="workbench__control-label">Tooltip Content</span>
            <Input value={text} onChange={(e) => setText(e.target.value)} />
          </div>

          <div className="workbench__switches">
            <Switch label="Pointer arrow" checked={arrow} onCheckedChange={setArrow} />
          </div>
        </>
      }
      code={jsx}
    />
  );
}

/* ------------------------------------------------------------------ Tabs Workbench */

export function TabsWorkbench() {
  const [variant, setVariant] = useState<TabsVariant>('line');
  const [size, setSize] = useState<TabsSize>('md');
  const [orientation, setOrientation] = useState<'horizontal' | 'vertical'>('horizontal');
  const [fullWidth, setFullWidth] = useState(false);
  const [showBadges, setShowBadges] = useState(true);
  const [showIcons, setShowIcons] = useState(true);

  const items = [
    {
      value: 'overview',
      label: 'Overview',
      icon: showIcons ? <ZapIcon size={14} /> : undefined,
      count: showBadges ? 4 : undefined,
      content: <div style={{ padding: '0.75rem 0', color: 'var(--pui-fg-muted)' }}>Real-time telemetry and service pulse.</div>,
    },
    {
      value: 'analytics',
      label: 'Analytics',
      icon: showIcons ? <StarIcon size={14} /> : undefined,
      count: showBadges ? 12 : undefined,
      content: <div style={{ padding: '0.75rem 0', color: 'var(--pui-fg-muted)' }}>Funnel conversion graphs and cohort metrics.</div>,
    },
    {
      value: 'settings',
      label: 'Settings',
      icon: showIcons ? <UsersIcon size={14} /> : undefined,
      content: <div style={{ padding: '0.75rem 0', color: 'var(--pui-fg-muted)' }}>Team member access and API credentials.</div>,
    },
  ];

  const propList: string[] = [];
  if (variant !== 'line') propList.push(`variant="${variant}"`);
  if (size !== 'md') propList.push(`size="${size}"`);
  if (orientation !== 'horizontal') propList.push(`orientation="${orientation}"`);
  if (fullWidth) propList.push('fullWidth');

  const jsx = `<Tabs
  items={tabItems}
  ${propList.join('\n  ')}
/>`;

  return (
    <PropsWorkbench
      title="Tabs Workbench"
      preview={
        <div style={{ width: '100%', maxWidth: orientation === 'vertical' ? '30rem' : '26rem' }}>
          <Tabs
            items={items}
            variant={variant}
            size={size}
            orientation={orientation}
            fullWidth={fullWidth}
          />
        </div>
      }
      controls={
        <>
          <div className="workbench__control-group">
            <span className="workbench__control-label">Variant</span>
            <div className="workbench__pills">
              {(['line', 'pills', 'boxed'] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  className={`workbench__pill${variant === v ? ' workbench__pill--active' : ''}`}
                  onClick={() => setVariant(v)}
                >
                  {v.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

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
            <span className="workbench__control-label">Orientation</span>
            <div className="workbench__pills">
              {(['horizontal', 'vertical'] as const).map((o) => (
                <button
                  key={o}
                  type="button"
                  className={`workbench__pill${orientation === o ? ' workbench__pill--active' : ''}`}
                  onClick={() => setOrientation(o)}
                >
                  {o.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="workbench__switches">
            <Switch label="Full width distribution" checked={fullWidth} onCheckedChange={setFullWidth} />
            <Switch label="Show count badge pills" checked={showBadges} onCheckedChange={setShowBadges} />
            <Switch label="Show leading icons" checked={showIcons} onCheckedChange={setShowIcons} />
          </div>
        </>
      }
      code={jsx}
    />
  );
}

/* ------------------------------------------------------------------ QRCode Workbench */

export function QRCodeWorkbench() {
  const [val, setVal] = useState('https://github.com/hesh/ui-library');
  const [size, setSize] = useState(160);
  const [bordered, setBordered] = useState(true);
  const [colorMode, setColorMode] = useState<'default' | 'brand' | 'emerald' | 'violet'>('default');

  const fgColor =
    colorMode === 'brand'
      ? '#2563eb'
      : colorMode === 'emerald'
        ? '#059669'
        : colorMode === 'violet'
          ? '#7c3aed'
          : '#0f172a';

  const propList: string[] = [`value="${val}"`];
  if (size !== 160) propList.push(`size={${size}}`);
  if (!bordered) propList.push('bordered={false}');
  if (colorMode !== 'default') propList.push(`fgColor="${fgColor}"`);

  const jsx = `<QRCode
  ${propList.join('\n  ')}
/>`;

  return (
    <PropsWorkbench
      title="QRCode Workbench"
      badge="Live Generator"
      preview={
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '1rem' }}>
          <QRCode
            value={val || 'https://hesh.dev'}
            size={size}
            bordered={bordered}
            fgColor={fgColor}
          />
          <span className="mono-note" style={{ maxWidth: '20rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {val || 'https://hesh.dev'}
          </span>
        </div>
      }
      controls={
        <>
          <div className="workbench__control-group">
            <span className="workbench__control-label">Target URL / Text</span>
            <Input value={val} onChange={(e) => setVal(e.target.value)} placeholder="https://..." />
          </div>

          <div className="workbench__control-group">
            <span className="workbench__control-label">Size ({size}px)</span>
            <Slider value={size} onValueChange={setSize} min={120} max={240} step={10} />
          </div>

          <div className="workbench__control-group">
            <span className="workbench__control-label">Color Theme</span>
            <div className="workbench__pills">
              {(['default', 'brand', 'emerald', 'violet'] as const).map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`workbench__pill${colorMode === c ? ' workbench__pill--active' : ''}`}
                  onClick={() => setColorMode(c)}
                >
                  {c.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="workbench__switches">
            <Switch label="Border card container" checked={bordered} onCheckedChange={setBordered} />
          </div>
        </>
      }
      code={jsx}
    />
  );
}

/* ------------------------------------------------------------------ Gauge Workbench */

export function GaugeWorkbench() {
  const [val, setVal] = useState(68);
  const [type, setType] = useState<'circle' | 'semicircle' | 'arc'>('circle');
  const [tone, setTone] = useState<'primary' | 'success' | 'warning' | 'danger' | 'gradient'>('primary');
  const [size, setSize] = useState(150);
  const [strokeWidth, setStrokeWidth] = useState(12);
  const [showValue, setShowValue] = useState(true);

  const propList: string[] = [`value={${val}}`];
  if (type !== 'circle') propList.push(`type="${type}"`);
  if (tone !== 'primary') propList.push(`tone="${tone}"`);
  if (size !== 140) propList.push(`size={${size}}`);
  if (strokeWidth !== 12) propList.push(`strokeWidth={${strokeWidth}}`);
  if (!showValue) propList.push('showValue={false}');

  const jsx = `<Gauge
  ${propList.join('\n  ')}
  label="CPU Utilization"
/>`;

  return (
    <PropsWorkbench
      title="Gauge Workbench"
      badge="Radial Telemetry"
      preview={
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', padding: '1rem' }}>
          <Gauge
            value={val}
            type={type}
            tone={tone}
            size={size}
            strokeWidth={strokeWidth}
            showValue={showValue}
            label="System Load"
          />
        </div>
      }
      controls={
        <>
          <div className="workbench__control-group">
            <span className="workbench__control-label">Live Value ({val}%)</span>
            <Slider value={val} onValueChange={setVal} min={0} max={100} />
          </div>

          <div className="workbench__control-group">
            <span className="workbench__control-label">Gauge Type</span>
            <div className="workbench__pills">
              {(['circle', 'semicircle', 'arc'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  className={`workbench__pill${type === t ? ' workbench__pill--active' : ''}`}
                  onClick={() => setType(t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="workbench__control-group">
            <span className="workbench__control-label">Tone</span>
            <div className="workbench__pills">
              {(['primary', 'success', 'warning', 'danger', 'gradient'] as const).map((t) => (
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
            <span className="workbench__control-label">Diameter ({size}px)</span>
            <Slider value={size} onValueChange={setSize} min={120} max={220} step={10} />
          </div>

          <div className="workbench__control-group">
            <span className="workbench__control-label">Stroke Width ({strokeWidth}px)</span>
            <Slider value={strokeWidth} onValueChange={setStrokeWidth} min={6} max={22} step={2} />
          </div>

          <div className="workbench__switches">
            <Switch label="Show center percentage text" checked={showValue} onCheckedChange={setShowValue} />
          </div>
        </>
      }
      code={jsx}
    />
  );
}

/* ------------------------------------------------------------------ Confetti Workbench */

export function ConfettiWorkbench() {
  const [particleCount, setParticleCount] = useState(60);
  const [spread, setSpread] = useState(70);
  const [velocity, setVelocity] = useState(35);
  const [palette, setPalette] = useState<'classic' | 'neon' | 'sunset' | 'gold'>('classic');

  const paletteColors: Record<string, string[]> = {
    classic: ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
    neon: ['#06b6d4', '#ec4899', '#84cc16', '#a855f7'],
    sunset: ['#f97316', '#f43f5e', '#fbbf24', '#e11d48'],
    gold: ['#f59e0b', '#fbbf24', '#d97706', '#fef3c7'],
  };

  const handleBurst = () => {
    fireConfetti({
      particleCount,
      spread,
      startVelocity: velocity,
      colors: paletteColors[palette],
    });
  };

  const jsx = `import { fireConfetti } from 'hesh';

fireConfetti({
  particleCount: ${particleCount},
  spread: ${spread},
  startVelocity: ${velocity},
  colors: ${JSON.stringify(paletteColors[palette])},
});`;

  return (
    <PropsWorkbench
      title="Confetti Workbench"
      badge="Physics Particle FX"
      preview={
        <div style={{ padding: '3rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <Button
            size="lg"
            variant="primary"
            onClick={handleBurst}
            leftIcon={<ZapIcon size={16} />}
          >
            Launch Confetti Burst 🎉
          </Button>
          <span className="mono-note">Click repeatedly to celebrate!</span>
        </div>
      }
      controls={
        <>
          <div className="workbench__control-group">
            <span className="workbench__control-label">Color Palette</span>
            <div className="workbench__pills">
              {(['classic', 'neon', 'sunset', 'gold'] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  className={`workbench__pill${palette === p ? ' workbench__pill--active' : ''}`}
                  onClick={() => setPalette(p)}
                >
                  {p.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="workbench__control-group">
            <span className="workbench__control-label">Particle Count ({particleCount})</span>
            <Slider value={particleCount} onValueChange={setParticleCount} min={20} max={120} step={5} />
          </div>

          <div className="workbench__control-group">
            <span className="workbench__control-label">Spread Angle ({spread}°)</span>
            <Slider value={spread} onValueChange={setSpread} min={30} max={160} step={5} />
          </div>

          <div className="workbench__control-group">
            <span className="workbench__control-label">Launch Velocity ({velocity})</span>
            <Slider value={velocity} onValueChange={setVelocity} min={20} max={55} step={1} />
          </div>
        </>
      }
      code={jsx}
    />
  );
}

/* ------------------------------------------------------------------ Drawer Workbench */

export function DrawerWorkbench() {
  const [side, setSide] = useState<'bottom' | 'right' | 'left' | 'top'>('bottom');
  const [handle, setHandle] = useState(true);
  const [open, setOpen] = useState(false);

  const sides: ('bottom' | 'right' | 'left' | 'top')[] = ['bottom', 'right', 'left', 'top'];

  const propList: string[] = ['open={isOpen}', 'onClose={() => setIsOpen(false)}'];
  if (side !== 'bottom') propList.push(`side="${side}"`);
  if (!handle) propList.push('handle={false}');

  const jsx = `<Drawer
  title="Action Center"
  description="Manage notifications and device settings"
  ${propList.join('\n  ')}
  footer={<Button variant="secondary" fullWidth onClick={() => setIsOpen(false)}>Done</Button>}
>
  <div style={{ padding: '1rem 0' }}>Drawer sheet content</div>
</Drawer>`;

  return (
    <PropsWorkbench
      title="Drawer Workbench"
      badge="Slide Overlay"
      preview={
        <div style={{ padding: '2.5rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
          <Button variant="primary" size="md" onClick={() => setOpen(true)}>
            Open ${side.toUpperCase()} Drawer Sheet
          </Button>
          <span className="mono-note">Dismiss with swipe, backdrop click, or Done</span>

          <Drawer
            open={open}
            onClose={() => setOpen(false)}
            side={side}
            handle={handle}
            title="Action Center"
            description="Manage your system preferences and integrations."
            footer={
              <Button variant="secondary" fullWidth onClick={() => setOpen(false)}>
                Done
              </Button>
            }
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '0.5rem 0' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))', gap: '0.75rem', textAlign: 'center' }}>
                {[
                  { name: 'Copy Link', icon: '🔗' },
                  { name: 'Email', icon: '✉️' },
                  { name: 'Slack', icon: '💬' },
                  { name: 'Export PDF', icon: '📄' },
                ].map((action, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setOpen(false)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.75rem 0.5rem',
                      background: 'var(--pui-surface-subtle)',
                      border: '1px solid var(--pui-border)',
                      borderRadius: 'var(--pui-radius-lg)',
                      cursor: 'pointer',
                      color: 'var(--pui-fg)',
                    }}
                  >
                    <span style={{ fontSize: '1.25rem' }}>{action.icon}</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 550 }}>{action.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </Drawer>
        </div>
      }
      controls={
        <>
          <div className="workbench__control-group">
            <span className="workbench__control-label">Side Edge</span>
            <div className="workbench__pills">
              {sides.map((s) => (
                <button
                  key={s}
                  type="button"
                  className={`workbench__pill${side === s ? ' workbench__pill--active' : ''}`}
                  onClick={() => setSide(s)}
                >
                  {s.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="workbench__switches">
            <Switch label="Show drag handle indicator" checked={handle} onCheckedChange={setHandle} />
          </div>
        </>
      }
      code={jsx}
    />
  );
}

/* ------------------------------------------------------------------ Dialog Workbench */

export function DialogWorkbench() {
  const [size, setSize] = useState<'sm' | 'md' | 'lg' | 'xl'>('md');
  const [dismissOnBackdrop, setDismissOnBackdrop] = useState(true);
  const [hideCloseButton, setHideCloseButton] = useState(false);
  const [open, setOpen] = useState(false);

  const sizes: ('sm' | 'md' | 'lg' | 'xl')[] = ['sm', 'md', 'lg', 'xl'];

  const propList: string[] = ['open={isOpen}', 'onClose={() => setIsOpen(false)}'];
  if (size !== 'md') propList.push(`size="${size}"`);
  if (!dismissOnBackdrop) propList.push('dismissOnBackdrop={false}');
  if (hideCloseButton) propList.push('hideCloseButton');

  const jsx = `<Dialog
  title="Publish Library"
  description="Confirm release to public registry and announce."
  ${propList.join('\n  ')}
  footer={
    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
      <Button variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
      <Button variant="primary" onClick={() => setIsOpen(false)}>Publish v2.4.0</Button>
    </div>
  }
>
  <p>Ready to deploy package updates across all CDN nodes.</p>
</Dialog>`;

  return (
    <PropsWorkbench
      title="Dialog Workbench"
      badge="Accessible Modal"
      preview={
        <div style={{ padding: '2.5rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
          <Button variant="primary" size="md" onClick={() => setOpen(true)}>
            Open ${size.toUpperCase()} Modal Dialog
          </Button>
          <span className="mono-note">Focus-trapped, closes on Esc or backdrop</span>

          <Dialog
            open={open}
            onClose={() => setOpen(false)}
            size={size}
            dismissOnBackdrop={dismissOnBackdrop}
            hideCloseButton={hideCloseButton}
            title="Publish Library v2.4.0"
            description="Confirm publishing this release to npm and notify subscribers."
            footer={
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', width: '100%' }}>
                <Button variant="ghost" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={() => setOpen(false)}>
                  Publish Release
                </Button>
              </div>
            }
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem', color: 'var(--pui-fg-muted)' }}>
              <p style={{ margin: 0 }}>
                This will trigger the production build pipeline, run bundle size analysis, and tag release <strong>v2.4.0</strong> on GitHub.
              </p>
            </div>
          </Dialog>
        </div>
      }
      controls={
        <>
          <div className="workbench__control-group">
            <span className="workbench__control-label">Size Scale</span>
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

          <div className="workbench__switches">
            <Switch label="Dismiss on backdrop click" checked={dismissOnBackdrop} onCheckedChange={setDismissOnBackdrop} />
            <Switch label="Hide top cross close button" checked={hideCloseButton} onCheckedChange={setHideCloseButton} />
          </div>
        </>
      }
      code={jsx}
    />
  );
}

/* ------------------------------------------------------------------ DataTable Workbench */

export function DataTableWorkbench() {
  const [density, setDensity] = useState<'compact' | 'comfortable' | 'spacious'>('comfortable');
  const [striped, setStriped] = useState(false);
  const [bordered, setBordered] = useState(false);
  const [selectable, setSelectable] = useState(true);
  const [loading, setLoading] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState<string[]>(['1', '3']);

  interface UserRow {
    id: string;
    name: string;
    email: string;
    role: string;
    status: 'active' | 'invited' | 'offline';
  }

  const columns: Column<UserRow>[] = [
    {
      id: 'name',
      header: 'User',
      accessor: (r) => r.name,
      cell: (r) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Avatar name={r.name} size="xs" />
          <span style={{ fontWeight: 600 }}>{r.name}</span>
        </div>
      ),
    },
    {
      id: 'role',
      header: 'Role',
      accessor: (r) => r.role,
    },
    {
      id: 'status',
      header: 'Status',
      accessor: (r) => r.status,
      cell: (r) => (
        <Badge tone={r.status === 'active' ? 'success' : r.status === 'invited' ? 'warning' : 'neutral'} pill>
          {r.status}
        </Badge>
      ),
    },
  ];

  const data: UserRow[] = [
    { id: '1', name: 'Ada Lovelace', email: 'ada@hesh.dev', role: 'Staff Architect', status: 'active' },
    { id: '2', name: 'Grace Hopper', email: 'grace@hesh.dev', role: 'Director', status: 'active' },
    { id: '3', name: 'Alan Turing', email: 'alan@hesh.dev', role: 'Security Lead', status: 'offline' },
    { id: '4', name: 'Margaret Hamilton', email: 'margaret@hesh.dev', role: 'VP Engineering', status: 'invited' },
  ];

  const propList: string[] = ['columns={columns}', 'data={data}', 'rowKey={(r) => r.id}'];
  if (density !== 'comfortable') propList.push(`density="${density}"`);
  if (striped) propList.push('striped');
  if (bordered) propList.push('bordered');
  if (selectable) {
    propList.push('selectable');
    propList.push(`selectedKeys={${JSON.stringify(selectedKeys)}}`);
    propList.push('onSelectionChange={setSelectedKeys}');
  }
  if (loading) propList.push('loading');

  const jsx = `<DataTable
  ${propList.join('\n  ')}
/>`;

  return (
    <PropsWorkbench
      title="DataTable Workbench"
      badge="Data Grid"
      preview={
        <div style={{ width: '100%' }}>
          <DataTable
            columns={columns}
            data={data}
            rowKey={(r) => r.id}
            density={density}
            striped={striped}
            bordered={bordered}
            selectable={selectable}
            selectedKeys={selectedKeys}
            onSelectionChange={setSelectedKeys}
            loading={loading}
          />
        </div>
      }
      controls={
        <>
          <div className="workbench__control-group">
            <span className="workbench__control-label">Density</span>
            <div className="workbench__pills">
              {(['compact', 'comfortable', 'spacious'] as const).map((d) => (
                <button
                  key={d}
                  type="button"
                  className={`workbench__pill${density === d ? ' workbench__pill--active' : ''}`}
                  onClick={() => setDensity(d)}
                >
                  {d.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="workbench__switches">
            <Switch label="Selectable checkbox column" checked={selectable} onCheckedChange={setSelectable} />
            <Switch label="Zebra striped alternating rows" checked={striped} onCheckedChange={setStriped} />
            <Switch label="Bordered cell borders" checked={bordered} onCheckedChange={setBordered} />
            <Switch label="Loading skeleton overlay" checked={loading} onCheckedChange={setLoading} />
          </div>
        </>
      }
      code={jsx}
    />
  );
}


/* ------------------------------------------------------------------ Carousel Workbench */

export function CarouselWorkbench() {
  const [itemsPerView, setItemsPerView] = useState<number>(1);
  const [indicatorVariant, setIndicatorVariant] = useState<'bars' | 'dots' | 'numbers'>('bars');
  const [arrowVariant, setArrowVariant] = useState<'floating' | 'solid' | 'outline'>('floating');
  const [autoPlay, setAutoPlay] = useState(false);
  const [interval, setInterval] = useState(4000);
  const [loop, setLoop] = useState(true);

  const effectiveLoop = loop && itemsPerView === 1;

  const propList: string[] = [];
  if (itemsPerView > 1) {
    propList.push(`itemsPerView={${itemsPerView}}`);
    propList.push('gap={16}');
  }
  if (indicatorVariant !== 'bars') propList.push(`indicatorVariant="${indicatorVariant}"`);
  if (arrowVariant !== 'floating') propList.push(`arrowVariant="${arrowVariant}"`);
  if (autoPlay) propList.push('autoPlay');
  if (interval !== 4000) propList.push(`interval={${interval}}`);
  if (!effectiveLoop) propList.push('loop={false}');

  const jsx = `<Carousel
  ${propList.length ? propList.join('\n  ') + '\n' : ''}>
  <div style={{ height: 220, padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'linear-gradient(135deg, rgba(37,99,235,0.1), var(--pui-surface))', borderRadius: 'inherit' }}>
    <Badge tone="primary" dot>AI Cluster</Badge>
    <h3 style={{ margin: '0.5rem 0 0.25rem', fontSize: '1.125rem' }}>Agents Orchestrator</h3>
    <p style={{ margin: 0, color: 'var(--pui-fg-muted)', fontSize: '0.8125rem' }}>Autonomous reasoning graph across 300+ nodes.</p>
  </div>

  <div style={{ height: 220, padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'linear-gradient(135deg, rgba(5,150,105,0.1), var(--pui-surface))', borderRadius: 'inherit' }}>
    <Badge tone="success" dot>KV Cache</Badge>
    <h3 style={{ margin: '0.5rem 0 0.25rem', fontSize: '1.125rem' }}>Distributed Memory</h3>
    <p style={{ margin: 0, color: 'var(--pui-fg-muted)', fontSize: '0.8125rem' }}>Global mesh routing with instant dynamic failover.</p>
  </div>

  <div style={{ height: 220, padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'linear-gradient(135deg, rgba(124,58,237,0.1), var(--pui-surface))', borderRadius: 'inherit' }}>
    <Badge tone="info" dot>HSM Vault</Badge>
    <h3 style={{ margin: '0.5rem 0 0.25rem', fontSize: '1.125rem' }}>Cryptographic Keys</h3>
    <p style={{ margin: 0, color: 'var(--pui-fg-muted)', fontSize: '0.8125rem' }}>SOC-2 Type II with zero-knowledge key rotation.</p>
  </div>

  <div style={{ height: 220, padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'linear-gradient(135deg, rgba(245,158,11,0.1), var(--pui-surface))', borderRadius: 'inherit' }}>
    <Badge tone="warning" dot>Anycast</Badge>
    <h3 style={{ margin: '0.5rem 0 0.25rem', fontSize: '1.125rem' }}>Edge Routing Mesh</h3>
    <p style={{ margin: 0, color: 'var(--pui-fg-muted)', fontSize: '0.8125rem' }}>Predictive latency bypass across 320 global PoPs.</p>
  </div>

  <div style={{ height: 220, padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'linear-gradient(135deg, rgba(236,72,153,0.1), var(--pui-surface))', borderRadius: 'inherit' }}>
    <Badge tone="neutral" dot>Vector</Badge>
    <h3 style={{ margin: '0.5rem 0 0.25rem', fontSize: '1.125rem' }}>Semantic Search</h3>
    <p style={{ margin: 0, color: 'var(--pui-fg-muted)', fontSize: '0.8125rem' }}>128M embeddings with HNSW sub-5ms lookup.</p>
  </div>
</Carousel>`;

  return (
    <PropsWorkbench
      title="Carousel Workbench"
      badge="Motion & Slides"
      preview={
        <div style={{ width: '100%', maxWidth: itemsPerView > 1 ? '48rem' : '38rem', margin: '0 auto', transition: 'max-width 300ms ease' }}>
          <Carousel
            itemsPerView={itemsPerView}
            gap={16}
            indicatorVariant={indicatorVariant}
            arrowVariant={arrowVariant}
            autoPlay={autoPlay}
            interval={interval}
            loop={effectiveLoop}
          >
            <div
              style={{
                height: 230,
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: itemsPerView === 1 ? 'center' : 'flex-start',
                textAlign: itemsPerView === 1 ? 'center' : 'left',
                background: 'linear-gradient(135deg, rgba(37,99,235,0.12), var(--pui-surface))',
                border: '1px solid var(--pui-border)',
                borderRadius: 'inherit',
              }}
            >
              <Badge tone="primary" dot>AI Cluster</Badge>
              <h3 style={{ margin: '0.5rem 0 0.25rem', fontSize: '1.125rem', fontWeight: 700 }}>
                Agents Orchestrator
              </h3>
              <p style={{ margin: '0 0 1rem', color: 'var(--pui-fg-muted)', fontSize: '0.8125rem', maxWidth: '24rem' }}>
                Deploy autonomous reasoning models across 300+ edge nodes with zero cold-starts.
              </p>
              <Button size="xs" variant="primary">Deploy Model</Button>
            </div>

            <div
              style={{
                height: 230,
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: itemsPerView === 1 ? 'center' : 'flex-start',
                textAlign: itemsPerView === 1 ? 'center' : 'left',
                background: 'linear-gradient(135deg, rgba(5,150,105,0.12), var(--pui-surface))',
                border: '1px solid var(--pui-border)',
                borderRadius: 'inherit',
              }}
            >
              <Badge tone="success" dot>KV Cache</Badge>
              <h3 style={{ margin: '0.5rem 0 0.25rem', fontSize: '1.125rem', fontWeight: 700 }}>
                Sub-ms Radar
              </h3>
              <p style={{ margin: '0 0 1rem', color: 'var(--pui-fg-muted)', fontSize: '0.8125rem', maxWidth: '24rem' }}>
                Global mesh routing with automated failover and p99 latency under 12ms.
              </p>
              <Button size="xs" variant="primary">View Nodes</Button>
            </div>

            <div
              style={{
                height: 230,
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: itemsPerView === 1 ? 'center' : 'flex-start',
                textAlign: itemsPerView === 1 ? 'center' : 'left',
                background: 'linear-gradient(135deg, rgba(124,58,237,0.12), var(--pui-surface))',
                border: '1px solid var(--pui-border)',
                borderRadius: 'inherit',
              }}
            >
              <Badge tone="info" dot>HSM Vault</Badge>
              <h3 style={{ margin: '0.5rem 0 0.25rem', fontSize: '1.125rem', fontWeight: 700 }}>
                Enclave Keys
              </h3>
              <p style={{ margin: '0 0 1rem', color: 'var(--pui-fg-muted)', fontSize: '0.8125rem', maxWidth: '24rem' }}>
                SOC-2 Type II with automated cryptographic key rotation and isolation.
              </p>
              <Button size="xs" variant="primary">Security Specs</Button>
            </div>

            <div
              style={{
                height: 230,
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: itemsPerView === 1 ? 'center' : 'flex-start',
                textAlign: itemsPerView === 1 ? 'center' : 'left',
                background: 'linear-gradient(135deg, rgba(245,158,11,0.12), var(--pui-surface))',
                border: '1px solid var(--pui-border)',
                borderRadius: 'inherit',
              }}
            >
              <Badge tone="warning" dot>Anycast</Badge>
              <h3 style={{ margin: '0.5rem 0 0.25rem', fontSize: '1.125rem', fontWeight: 700 }}>
                Edge Routing
              </h3>
              <p style={{ margin: '0 0 1rem', color: 'var(--pui-fg-muted)', fontSize: '0.8125rem', maxWidth: '24rem' }}>
                Predictive latency bypass across 320 global transit node points.
              </p>
              <Button size="xs" variant="primary">Mesh Status</Button>
            </div>

            <div
              style={{
                height: 230,
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: itemsPerView === 1 ? 'center' : 'flex-start',
                textAlign: itemsPerView === 1 ? 'center' : 'left',
                background: 'linear-gradient(135deg, rgba(236,72,153,0.12), var(--pui-surface))',
                border: '1px solid var(--pui-border)',
                borderRadius: 'inherit',
              }}
            >
              <Badge tone="neutral" dot>Vector</Badge>
              <h3 style={{ margin: '0.5rem 0 0.25rem', fontSize: '1.125rem', fontWeight: 700 }}>
                Semantic Search
              </h3>
              <p style={{ margin: '0 0 1rem', color: 'var(--pui-fg-muted)', fontSize: '0.8125rem', maxWidth: '24rem' }}>
                128M embeddings with HNSW sub-5ms approximate nearest search.
              </p>
              <Button size="xs" variant="primary">Query Store</Button>
            </div>
          </Carousel>
        </div>
      }
      controls={
        <>
          <div className="workbench__control-group">
            <span className="workbench__control-label">Items Visible at Once</span>
            <div className="workbench__pills">
              {[1, 2, 3].map((n) => (
                <button
                  key={n}
                  type="button"
                  className={`workbench__pill${itemsPerView === n ? ' workbench__pill--active' : ''}`}
                  onClick={() => {
                    setItemsPerView(n);
                    if (n > 1) setLoop(false);
                  }}
                >
                  {n === 1 ? '1 Slide (Hero)' : `${n} Items`}
                </button>
              ))}
            </div>
          </div>

          <div className="workbench__control-group">
            <span className="workbench__control-label">Indicator Pagination</span>
            <div className="workbench__pills">
              {(['bars', 'dots', 'numbers'] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  className={`workbench__pill${indicatorVariant === v ? ' workbench__pill--active' : ''}`}
                  onClick={() => setIndicatorVariant(v)}
                >
                  {v === 'bars' ? 'Modern Bars' : v === 'dots' ? 'Refined Dots' : 'Numeric (01/03)'}
                </button>
              ))}
            </div>
          </div>

          <div className="workbench__control-group">
            <span className="workbench__control-label">Arrow Style</span>
            <div className="workbench__pills">
              {(['floating', 'solid', 'outline'] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  className={`workbench__pill${arrowVariant === v ? ' workbench__pill--active' : ''}`}
                  onClick={() => setArrowVariant(v)}
                >
                  {v === 'floating' ? 'Frosted Glass' : v === 'solid' ? 'Solid Surface' : 'Outline'}
                </button>
              ))}
            </div>
          </div>

          <div className="workbench__control-group">
            <span className="workbench__control-label">Autoplay Interval ({interval / 1000}s)</span>
            <div className="workbench__pills">
              {[2000, 4000, 6000].map((t) => (
                <button
                  key={t}
                  type="button"
                  className={`workbench__pill${interval === t ? ' workbench__pill--active' : ''}`}
                  onClick={() => setInterval(t)}
                >
                  {t / 1000}s
                </button>
              ))}
            </div>
          </div>

          <div className="workbench__switches">
            <Switch label="Autoplay timer transition" checked={autoPlay} onCheckedChange={setAutoPlay} />
            <Switch
              label="Loop infinitely at ends"
              checked={itemsPerView > 1 ? loop : loop}
              onCheckedChange={setLoop}
            />
          </div>
        </>
      }
      code={jsx}
    />
  );
}

/* ------------------------------------------------------------------ Charts Workbench */

export function ChartsWorkbench() {
  const [chartType, setChartType] = useState<'area' | 'bar' | 'donut'>('area');
  const [height, setHeight] = useState(260);
  const [colorMode, setColorMode] = useState<'brand' | 'emerald' | 'violet' | 'rose' | 'amber'>('brand');
  const [showGrid, setShowGrid] = useState(true);
  const [smooth, setSmooth] = useState(true);
  const [showTracks, setShowTracks] = useState(true);

  const colors: Record<string, string> = {
    brand: '#2563eb',
    emerald: '#059669',
    violet: '#7c3aed',
    rose: '#f43f5e',
    amber: '#d97706',
  };
  const activeColor = colors[colorMode]!;

  const sampleData = [
    { label: 'Jan', value: 32 },
    { label: 'Feb', value: 45 },
    { label: 'Mar', value: 41 },
    { label: 'Apr', value: 58 },
    { label: 'May', value: 64 },
    { label: 'Jun', value: 60 },
    { label: 'Jul', value: 78 },
    { label: 'Aug', value: 92 },
    { label: 'Sep', value: 88 },
    { label: 'Oct', value: 104 },
    { label: 'Nov', value: 118 },
    { label: 'Dec', value: 135 },
  ];

  const donutData = [
    { label: 'Direct', value: 4210, color: '#2563eb' },
    { label: 'Organic', value: 3180, color: '#059669' },
    { label: 'Referral', value: 1640, color: '#7c3aed' },
    { label: 'Social', value: 980, color: '#f43f5e' },
  ];

  let jsx = '';
  if (chartType === 'area') {
    jsx = `<AreaChart
  data={data}
  height={${height}}
  color="${activeColor}"
  format={(v) => '$' + v + 'k'}
  showGrid={${showGrid}}
  smooth={${smooth}}
/>`;
  } else if (chartType === 'bar') {
    jsx = `<BarChart
  data={data}
  height={${height}}
  color="${activeColor}"
  format={(v) => v + ' requests'}
  showGrid={${showGrid}}
  showTracks={${showTracks}}
/>`;
  } else {
    jsx = `<DonutChart
  data={trafficData}
  size={${Math.min(height, 240)}}
  thickness={26}
  centerValue="10.0k"
  centerLabel="Total Visits"
/>`;
  }

  return (
    <PropsWorkbench
      title="Charts Workbench"
      badge="SVG Telemetry"
      preview={
        <div style={{ width: '100%', padding: '0.5rem' }}>
          {chartType === 'area' && (
            <AreaChart
              data={sampleData}
              height={height}
              color={activeColor}
              format={(v) => `$${v}k`}
              showGrid={showGrid}
              smooth={smooth}
            />
          )}
          {chartType === 'bar' && (
            <BarChart
              data={sampleData}
              height={height}
              color={activeColor}
              format={(v) => `${v} reqs`}
              showGrid={showGrid}
              showTracks={showTracks}
            />
          )}
          {chartType === 'donut' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <DonutChart
                data={donutData}
                size={Math.min(height, 240)}
                thickness={26}
                centerValue="10.0k"
                centerLabel="Total Visits"
              />
            </div>
          )}
        </div>
      }
      controls={
        <>
          <div className="workbench__control-group">
            <span className="workbench__control-label">Chart Type</span>
            <div className="workbench__pills">
              {(['area', 'bar', 'donut'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  className={`workbench__pill${chartType === t ? ' workbench__pill--active' : ''}`}
                  onClick={() => setChartType(t)}
                >
                  {t.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="workbench__control-group">
            <span className="workbench__control-label">Color Theme</span>
            <div className="workbench__pills">
              {(['brand', 'emerald', 'violet', 'rose', 'amber'] as const).map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`workbench__pill${colorMode === c ? ' workbench__pill--active' : ''}`}
                  onClick={() => setColorMode(c)}
                >
                  {c.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="workbench__control-group">
            <span className="workbench__control-label">Height / Dimension ({height}px)</span>
            <Slider value={height} onValueChange={setHeight} min={180} max={320} step={10} />
          </div>

          <div className="workbench__switches">
            <Switch label="Show horizontal gridlines" checked={showGrid} onCheckedChange={setShowGrid} />
            {chartType === 'area' && (
              <Switch label="Smooth cubic Bézier spline" checked={smooth} onCheckedChange={setSmooth} />
            )}
            {chartType === 'bar' && (
              <Switch label="Subtle background pillar tracks" checked={showTracks} onCheckedChange={setShowTracks} />
            )}
          </div>
        </>
      }
      code={jsx}
    />
  );
}
