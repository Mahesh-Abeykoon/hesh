import { useState, type ReactNode } from 'react';
import {
  Badge,
  Button,
  Input,
  Switch,
  type ButtonVariant,
  type ButtonSize,
  type BadgeTone,
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
