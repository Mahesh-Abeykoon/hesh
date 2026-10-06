import React, {
  Component,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ErrorInfo,
  type ReactNode,
} from 'react';
import { transform } from 'sucrase';
import * as Hesh from '../../src/index';
import { Badge, Button, IconButton, Switch, Tooltip } from '../../src/index';
import { CheckIcon, CopyIcon } from '../../src/index';

const ResetIcon = ({ size = 13 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
  </svg>
);

/* ------------------------------------------------------------------ Code Preparation */

export function prepareCode(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return 'return null;';

  // 1. Explicit render call
  if (trimmed.includes('render(')) {
    return `let __rendered = null;\nconst render = (el) => { __rendered = el; };\n${trimmed}\nreturn __rendered;`;
  }

  // 2. Export default component
  if (trimmed.includes('export default')) {
    const cleaned = trimmed.replace(/export\s+default\s+/, '');
    const match = cleaned.match(/^(?:function\s+([A-Za-z0-9_]+)|const\s+([A-Za-z0-9_]+))/);
    const compName = match ? match[1] || match[2] : null;
    if (compName) {
      return `${cleaned}\nreturn React.createElement(${compName});`;
    }
  }

  // 3. Standalone declared component
  if (/^(function\s+[A-Z]\w*|const\s+[A-Z]\w*\s*=\s*(\([^)]*\)|[a-zA-Z_]\w*)\s*=>)/.test(trimmed)) {
    const match = trimmed.match(/^(?:function\s+([A-Z]\w*)|const\s+([A-Z]\w*))/);
    const compName = match ? match[1] || match[2] : null;
    if (compName) {
      return `${trimmed}\nreturn React.createElement(${compName});`;
    }
  }

  // 4. Pure JSX element
  if (trimmed.startsWith('<') && trimmed.endsWith('>')) {
    return `return (${trimmed});`;
  }

  // 5. Mixed hooks/statements ending with JSX
  if (!trimmed.includes('return ') && !trimmed.includes('return(')) {
    const lines = trimmed.split('\n');
    let lastLineIdx = -1;
    for (let i = lines.length - 1; i >= 0; i--) {
      if (lines[i]!.trim().length > 0) {
        lastLineIdx = i;
        break;
      }
    }
    if (lastLineIdx >= 0) {
      const lastLine = lines[lastLineIdx]!.trim();
      if (lastLine.startsWith('<') || lastLine.endsWith('>') || lastLine.endsWith(');')) {
        lines[lastLineIdx] = `return (${lines[lastLineIdx]});`;
        return `function __DynamicLivePreview__() {\n${lines.join('\n')}\n}\nreturn React.createElement(__DynamicLivePreview__);`;
      }
    }
  }

  // 6. Generic component wrapper
  return `function __DynamicLivePreview__() {\n${trimmed}\n}\nreturn React.createElement(__DynamicLivePreview__);`;
}

/* ------------------------------------------------------------------ Scope */

const SCOPE: Record<string, unknown> = {
  React,
  useState: React.useState,
  useEffect: React.useEffect,
  useRef: React.useRef,
  useMemo: React.useMemo,
  useCallback: React.useCallback,
  useId: React.useId,
  useReducer: React.useReducer,
  ...Hesh,
};

const SCOPE_KEYS = Object.keys(SCOPE);
const SCOPE_VALUES = Object.values(SCOPE);

/* ------------------------------------------------------------------ Error Boundary */

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback: (error: Error) => ReactNode;
  resetKey: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class LiveErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.debug('[LivePlayground Error]', error, errorInfo);
  }

  override componentDidUpdate(prevProps: ErrorBoundaryProps) {
    if (prevProps.resetKey !== this.props.resetKey && this.state.hasError) {
      this.setState({ hasError: false, error: null });
    }
  }

  override render() {
    if (this.state.hasError && this.state.error) {
      return this.props.fallback(this.state.error);
    }
    return this.props.children;
  }
}

/* ------------------------------------------------------------------ Live Compiler Hook */

export function useLiveCompiler(code: string) {
  return useMemo(() => {
    try {
      const prepared = prepareCode(code);
      const transpiled = transform(prepared, {
        transforms: ['jsx', 'typescript'],
        jsxRuntime: 'classic',
        production: true,
      }).code;

      // Execute in sandbox closure
      const runner = new Function(...SCOPE_KEYS, transpiled);
      const evaluated = runner(...SCOPE_VALUES);

      let element: ReactNode = null;
      if (React.isValidElement(evaluated)) {
        element = evaluated;
      } else if (typeof evaluated === 'function') {
        element = React.createElement(evaluated as React.ComponentType);
      } else if (typeof evaluated === 'string' || typeof evaluated === 'number') {
        element = <span>{evaluated}</span>;
      }

      return { element, error: null as Error | null };
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error(String(err));
      return { element: null, error };
    }
  }, [code]);
}

/* ------------------------------------------------------------------ Live Code Editor */

export interface LiveCodeEditorProps {
  code: string;
  onChange: (newCode: string) => void;
  onReset?: () => void;
  minHeight?: string;
  maxHeight?: string;
}

export function LiveCodeEditor({
  code,
  onChange,
  onReset,
  minHeight = '180px',
  maxHeight = '420px',
}: LiveCodeEditorProps) {
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const lines = useMemo(() => code.split('\n'), [code]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }, [code]);

  // Tab key handling (2 spaces indentation)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;

      if (e.shiftKey) {
        // Dedent
        const before = code.substring(0, start);
        const after = code.substring(end);
        if (before.endsWith('  ')) {
          const updated = before.slice(0, -2) + after;
          onChange(updated);
          setTimeout(() => {
            target.selectionStart = target.selectionEnd = Math.max(0, start - 2);
          }, 0);
        }
      } else {
        // Indent
        const updated = code.substring(0, start) + '  ' + code.substring(end);
        onChange(updated);
        setTimeout(() => {
          target.selectionStart = target.selectionEnd = start + 2;
        }, 0);
      }
    }
  };

  return (
    <div className="live-editor">
      <div className="live-editor__header">
        <div className="live-editor__badge">
          <span className="live-editor__dot" />
          <span>Live TSX Editor</span>
        </div>
        <div className="live-editor__actions">
          {onReset && (
            <button
              type="button"
              className="live-editor__btn"
              onClick={onReset}
              title="Reset code to original"
            >
              <ResetIcon size={13} />
              <span>Reset</span>
            </button>
          )}
          <button
            type="button"
            className="live-editor__btn"
            onClick={handleCopy}
            title="Copy code"
          >
            {copied ? <CheckIcon size={13} /> : <CopyIcon size={13} />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>
      </div>

      <div className="live-editor__container" style={{ minHeight, maxHeight }}>
        <div className="live-editor__gutter" aria-hidden="true">
          {lines.map((_, i) => (
            <span key={i} className="live-editor__line-no">
              {i + 1}
            </span>
          ))}
        </div>
        <textarea
          ref={textareaRef}
          className="live-editor__textarea"
          value={code}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          aria-label="Live interactive component code editor"
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ Live Playground */

export interface LivePlaygroundProps {
  initialCode: string;
  title?: string;
  badge?: string;
  description?: string;
}

export function LivePlayground({
  initialCode,
  title = 'Live Code Playground',
  badge = 'Editable',
  description,
}: LivePlaygroundProps) {
  const [code, setCode] = useState(initialCode);
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const { element, error } = useLiveCompiler(code);

  const viewportWidth = {
    desktop: '100%',
    tablet: '640px',
    mobile: '360px',
  }[viewport];

  return (
    <div className="workbench">
      <div className="workbench__header">
        <div className="workbench__title">
          <span>{title}</span>
          <Badge tone="primary" pill>
            {badge}
          </Badge>
        </div>
        <div className="live-editor__viewports">
          {(['desktop', 'tablet', 'mobile'] as const).map((v) => (
            <button
              key={v}
              type="button"
              className={`live-editor__viewport-opt${viewport === v ? ' live-editor__viewport-opt--active' : ''}`}
              onClick={() => setViewport(v)}
              title={`Preview in ${v} viewport`}
            >
              {v === 'desktop' ? '100%' : v === 'tablet' ? 'Tablet' : 'Mobile'}
            </button>
          ))}
        </div>
      </div>

      {description && (
        <div style={{ padding: '0.75rem 1.25rem', fontSize: '0.8125rem', color: 'var(--pui-fg-muted)' }}>
          {description}
        </div>
      )}

      <div className="workbench__body" style={{ flexDirection: 'column' }}>
        <div
          className="workbench__preview"
          style={{
            width: '100%',
            maxWidth: viewportWidth,
            margin: '0 auto',
            transition: 'max-width 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            minHeight: '160px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {error ? (
            <div className="live-error">
              <div className="live-error__title">Compilation Notice</div>
              <div className="live-error__message">{error.message}</div>
            </div>
          ) : (
            <LiveErrorBoundary
              fallback={(runtimeErr) => (
                <div className="live-error">
                  <div className="live-error__title">Runtime Exception</div>
                  <div className="live-error__message">{runtimeErr.message}</div>
                </div>
              )}
              resetKey={code}
            >
              {element}
            </LiveErrorBoundary>
          )}
        </div>

        <div style={{ width: '100%' }}>
          <LiveCodeEditor
            code={code}
            onChange={setCode}
            onReset={() => setCode(initialCode)}
          />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ Dual Mode Workbench */

export interface DualModeWorkbenchProps {
  title: string;
  badge?: string;
  generatedCode: string;
  preview: ReactNode;
  controls: ReactNode;
}

export function DualModeWorkbench({
  title,
  badge = 'Interactive',
  generatedCode,
  preview,
  controls,
}: DualModeWorkbenchProps) {
  const [mode, setMode] = useState<'controls' | 'live'>('controls');
  const [customCode, setCustomCode] = useState(generatedCode);

  // Keep customCode updated when in controls mode
  useEffect(() => {
    if (mode === 'controls') {
      setCustomCode(generatedCode);
    }
  }, [generatedCode, mode]);

  const { element: liveElement, error: liveError } = useLiveCompiler(customCode);

  return (
    <div className="workbench">
      <div className="workbench__header">
        <div className="workbench__title">
          <span>{title}</span>
          <Badge tone="primary" pill>
            {badge}
          </Badge>
        </div>

        {/* Mode Switcher */}
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
              <div className="live-error__title">Syntax / Transform Error</div>
              <div className="live-error__message">{liveError.message}</div>
            </div>
          ) : (
            <LiveErrorBoundary
              fallback={(runtimeErr) => (
                <div className="live-error">
                  <div className="live-error__title">Runtime Error</div>
                  <div className="live-error__message">{runtimeErr.message}</div>
                </div>
              )}
              resetKey={customCode}
            >
              {liveElement}
            </LiveErrorBoundary>
          )}
        </div>

        {mode === 'controls' && (
          <div className="workbench__controls">{controls}</div>
        )}
      </div>

      <div className="workbench__code-footer">
        {mode === 'controls' ? (
          <LiveCodeEditor
            code={generatedCode}
            onChange={() => {}}
            minHeight="100px"
          />
        ) : (
          <LiveCodeEditor
            code={customCode}
            onChange={setCustomCode}
            onReset={() => setCustomCode(generatedCode)}
            minHeight="160px"
          />
        )}
      </div>
    </div>
  );
}
