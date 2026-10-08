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
import { CheckIcon, CopyIcon, ShareIcon } from '../../src/index';

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

const FormatIcon = ({ size = 13 }: { size?: number }) => (
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
    <line x1="21" y1="6" x2="3" y2="6" />
    <line x1="15" y1="12" x2="3" y2="12" />
    <line x1="17" y1="18" x2="3" y2="18" />
  </svg>
);

export function formatCode(code: string): string {
  const lines = code.split('\n');
  let indent = 0;
  const result: string[] = [];
  for (const rawLine of lines) {
    const trimmed = rawLine.trim();
    if (!trimmed) {
      if (result.length > 0 && result[result.length - 1] !== '') {
        result.push('');
      }
      continue;
    }
    if (trimmed.startsWith('}') || trimmed.startsWith(')') || trimmed.startsWith('</') || trimmed.startsWith('];') || trimmed.startsWith('/>')) {
      indent = Math.max(0, indent - 1);
    }
    result.push('  '.repeat(indent) + trimmed);
    const opens = (trimmed.match(/(\{|\[|\()/g) || []).length;
    const closes = (trimmed.match(/(\}|\]|\))/g) || []).length;
    const opensTag = (trimmed.match(/<[A-Za-z0-9_]+(?:\s+[^>]*)?>/g) || []).length;
    const closesTag = (trimmed.match(/<\/[A-Za-z0-9_]+>|\/>/g) || []).length;
    const diff = (opens - closes) + (opensTag - closesTag);
    if (diff > 0) indent += diff;
    else if (diff < 0) indent = Math.max(0, indent + diff);
  }
  return result.join('\n');
}

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

const SplitIcon = ({ size = 13 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect width="18" height="18" x="3" y="3" rx="2" />
    <path d="M12 3v18" />
  </svg>
);

const CodeIcon = ({ size = 13 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
);

const EyeIcon = ({ size = 13 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const DesktopIcon = ({ size = 13 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect width="20" height="14" x="2" y="3" rx="2" />
    <line x1="8" x2="16" y1="21" y2="21" />
    <line x1="12" x2="12" y1="17" y2="21" />
  </svg>
);

const TabletIcon = ({ size = 13 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect width="16" height="20" x="4" y="2" rx="2" />
    <line x1="12" x2="12.01" y1="18" y2="18" strokeWidth="2.5" />
  </svg>
);

const MobileIcon = ({ size = 13 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect width="14" height="20" x="5" y="2" rx="2" />
    <line x1="12" x2="12.01" y1="17" y2="17" strokeWidth="2.5" />
  </svg>
);

const GridIcon = ({ size = 13 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect width="18" height="18" x="3" y="3" rx="2" />
    <path d="M3 9h18M3 15h18M9 3v18M15 3v18" />
  </svg>
);

/* ------------------------------------------------------------------ Live Code Editor */

export interface LiveCodeEditorProps {
  code: string;
  onChange: (newCode: string) => void;
  onReset?: () => void;
  minHeight?: string;
  maxHeight?: string;
  fillHeight?: boolean;
  hideHeader?: boolean;
}

export function LiveCodeEditor({
  code,
  onChange,
  onReset,
  minHeight = '180px',
  maxHeight = '420px',
  fillHeight = false,
  hideHeader = false,
}: LiveCodeEditorProps) {
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);

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
    <div className={`live-editor${fillHeight ? ' live-editor--fill' : ''}`}>
      {!hideHeader && (
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
      )}

      <div
        className="live-editor__container"
        style={fillHeight ? { flex: 1, minHeight: 0, height: '100%' } : { minHeight, maxHeight }}
      >
        <div ref={gutterRef} className="live-editor__gutter" aria-hidden="true">
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
          onScroll={(e) => {
            if (gutterRef.current) {
              gutterRef.current.scrollTop = e.currentTarget.scrollTop;
            }
          }}
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

/* ------------------------------------------------------------------ Live Playground (Split Studio) */

export interface LivePlaygroundProps {
  initialCode: string;
  title?: string;
  badge?: string;
  description?: string;
  code?: string;
  onChange?: (code: string) => void;
  onReset?: () => void;
  customizers?: ReactNode;
}

export function LivePlayground({
  initialCode,
  title = 'Live Code Playground',
  badge = 'Editable',
  description,
  code: controlledCode,
  onChange,
  onReset,
  customizers,
}: LivePlaygroundProps) {
  const [internalCode, setInternalCode] = useState(initialCode);
  const code = controlledCode !== undefined ? controlledCode : internalCode;

  const handleCodeChange = (newCode: string) => {
    if (controlledCode === undefined) {
      setInternalCode(newCode);
    }
    onChange?.(newCode);
  };

  const handleReset = () => {
    if (onReset) {
      onReset();
    } else {
      setInternalCode(initialCode);
      onChange?.(initialCode);
    }
  };

  const [canvasGrid, setCanvasGrid] = useState(true);
  const [mobileTab, setMobileTab] = useState<'preview' | 'code'>('preview');
  const [copied, setCopied] = useState(false);

  // Sync internal code when initialCode changes
  useEffect(() => {
    setInternalCode(initialCode);
  }, [initialCode]);

  const { element, error } = useLiveCompiler(code);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }, [code]);

  const [shared, setShared] = useState(false);

  const handleFormat = useCallback(() => {
    const formatted = formatCode(code);
    handleCodeChange(formatted);
  }, [code, handleCodeChange]);

  const handleShare = useCallback(async () => {
    try {
      const encoded = encodeURIComponent(btoa(unescape(encodeURIComponent(code))));
      const origin = window.location.origin;
      const pathname = window.location.pathname;
      const shareUrl = `${origin}${pathname}#/playground?code=${encoded}`;
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
      }
      window.location.hash = `/playground?code=${encoded}`;
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    } catch (err) {
      console.warn('Share encoding error:', err);
    }
  }, [code]);

  return (
    <div className="playground-studio">
      {/* Studio Header Command Bar */}
      <div className="playground-studio__header">
        {/* Live Customize Controls (replaces clutter, starts from left) */}
        {customizers && (
          <div className="playground-studio__center-tools">
            {customizers}
          </div>
        )}

        {/* Show error pill only when syntax error actually occurs */}
        {error && (
          <div className="playground-studio__status playground-studio__status--error">
            <span className="playground-studio__status-dot playground-studio__status-dot--error" />
            <span className="playground-studio__status-text">Syntax Error</span>
          </div>
        )}

        {/* Right Tools: Format, Reset, Share, Copy */}
        <div className="playground-studio__right-tools">
          <button
            type="button"
            className="playground-studio__action-btn"
            onClick={handleFormat}
            title="Auto-format code indentation"
          >
            <FormatIcon size={13} />
            <span>Format</span>
          </button>

          <button
            type="button"
            className="playground-studio__action-btn"
            onClick={handleReset}
            title="Reset code to original template"
          >
            <ResetIcon size={13} />
            <span>Reset</span>
          </button>

          <button
            type="button"
            className="playground-studio__action-btn"
            onClick={handleShare}
            title="Copy shareable permalink with current code"
          >
            {shared ? <CheckIcon size={13} /> : <ShareIcon size={13} />}
            <span>{shared ? 'Link Copied!' : 'Share'}</span>
          </button>

          <button
            type="button"
            className="playground-studio__action-btn"
            onClick={handleCopy}
            title="Copy component code"
          >
            {copied ? <CheckIcon size={13} /> : <CopyIcon size={13} />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Mobile Tab Switcher (Visible on small screens in split mode) */}
      <div className="playground-studio__mobile-tabs">
        <button
          type="button"
          className={`playground-studio__mobile-tab${
            mobileTab === 'preview' ? ' playground-studio__mobile-tab--active' : ''
          }`}
          onClick={() => setMobileTab('preview')}
        >
          <EyeIcon size={14} />
          <span>Live Preview</span>
        </button>
        <button
          type="button"
          className={`playground-studio__mobile-tab${
            mobileTab === 'code' ? ' playground-studio__mobile-tab--active' : ''
          }`}
          onClick={() => setMobileTab('code')}
        >
          <CodeIcon size={14} />
          <span>TSX Code Editor</span>
        </button>
      </div>

      {/* Studio Split Workspace Body (Clean Permanent 50/50 Desktop Split) */}
      <div
        className="playground-studio__body playground-studio__body--split"
        data-mobile-tab={mobileTab}
      >
        {/* Left Pane: Code Editor */}
        <div className="playground-studio__pane playground-studio__pane--code">
          <div className="playground-studio__pane-bar">
            <div className="playground-studio__file-tab">
              <span className="playground-studio__ts-icon">TSX</span>
              <span>App.tsx</span>
            </div>
            <div className="playground-studio__editor-hint">
              <span>Live Synced Editor</span>
            </div>
          </div>

          <LiveCodeEditor
            code={code}
            onChange={handleCodeChange}
            fillHeight
            hideHeader
          />

          {error && (
            <div className="playground-studio__error-bar">
              <span className="playground-studio__error-title">Syntax Warning:</span>
              <span className="playground-studio__error-msg">{error.message}</span>
            </div>
          )}
        </div>

        {/* Right Pane: Live Preview Canvas */}
        <div className="playground-studio__pane playground-studio__pane--preview">
          <div className="playground-studio__pane-bar">
            <div className="playground-studio__preview-tab">
              <EyeIcon size={13} />
              <span>Real-Time Component Preview</span>
            </div>
            <div className="playground-studio__preview-meta">
              <span>LIVE PREVIEW</span>
            </div>
          </div>

          <div className="playground-studio__canvas">
            <div className="playground-studio__viewport-frame">
              {error ? (
                <div className="live-error">
                  <div className="live-error__title">Transpilation Notice</div>
                  <div className="live-error__message">{error.message}</div>
                </div>
              ) : (
                <LiveErrorBoundary
                  fallback={(runtimeErr) => (
                    <div className="live-error">
                      <div className="live-error__title">Runtime Exception</div>
                      <div className="live-error__message">{runtimeErr.message}</div>
                      <button
                        type="button"
                        className="playground-studio__action-btn"
                        style={{ marginTop: '0.75rem' }}
                        onClick={handleReset}
                      >
                        <ResetIcon size={13} />
                        <span>Reset Code</span>
                      </button>
                    </div>
                  )}
                  resetKey={code}
                >
                  {element}
                </LiveErrorBoundary>
              )}
            </div>
          </div>
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
