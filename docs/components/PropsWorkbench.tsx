import { useState, type ReactNode } from 'react';
import {
  Badge,
  Button,
  Input,
  Switch,
  TagInput,
  Slider,
  type ButtonVariant,
  type ButtonSize,
  type BadgeTone,
  type SliderMark,
} from '../../src/index';
import { ArrowRightIcon, PlusIcon, SparklesIcon, TrashIcon } from '../../src/index';
import { CodeBlock } from './CodeBlock';

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
  return (
    <div className="workbench">
      <div className="workbench__header">
        <div className="workbench__title">
          <span>{title}</span>
          <Badge tone="primary" pill>
            {badge}
          </Badge>
        </div>
      </div>

      <div className="workbench__body">
        <div className="workbench__preview">{preview}</div>
        <div className="workbench__controls">{controls}</div>
      </div>

      <div className="workbench__code-footer">
        <CodeBlock code={code} language="tsx" />
      </div>
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

