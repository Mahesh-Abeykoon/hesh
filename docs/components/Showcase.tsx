import { useState, useCallback, useMemo, useRef, type ReactNode } from 'react';
import { CodeBlock } from './CodeBlock';

export type ShowcaseMode = 'preview' | 'code' | 'split';
export type ShowcaseCanvas = 'dots' | 'grid' | 'solid';

export interface ShowcaseFile {
  name: string;
  code: string;
  language?: string;
}

export interface ResponsivePreset {
  id: string;
  label: string;
  shortLabel: string;
  width: number | '100%';
  icon: 'desktop' | 'laptop' | 'tablet' | 'mobile-lg' | 'mobile';
}

export const RESPONSIVE_PRESETS: ResponsivePreset[] = [
  { id: 'desktop', label: 'Desktop (100%)', shortLabel: '100%', width: '100%', icon: 'desktop' },
  { id: 'laptop', label: 'Laptop (1024px)', shortLabel: '1024px', width: 1024, icon: 'laptop' },
  { id: 'tablet', label: 'Tablet (768px)', shortLabel: '768px', width: 768, icon: 'tablet' },
  { id: 'mobile-lg', label: 'Large Mobile (480px)', shortLabel: '480px', width: 480, icon: 'mobile-lg' },
  { id: 'mobile', label: 'Mobile (375px)', shortLabel: '375px', width: 375, icon: 'mobile' },
];

export interface ShowcaseProps {
  title?: string;
  description?: ReactNode;
  /** The live, interactive example. Omit for a code-only block. */
  children?: ReactNode;
  /** Source shown in the code panel. Should match `children`. */
  code?: string;
  /** Optional language override for single code snippet (default: 'tsx') */
  language?: string;
  /** Multi-file code examples (e.g. Component.tsx, styles.css) */
  files?: ShowcaseFile[];
  /** Extra content below the preview — usually a props table. */
  footer?: ReactNode;
  /** Start with the code panel open (maps to 'split' mode). */
  defaultOpen?: boolean;
  /** Explicit initial view mode: 'preview' | 'code' | 'split'. */
  defaultMode?: ShowcaseMode;
  /** Remove the inner padding for full-bleed examples (tables, dashboards). */
  bleed?: boolean;
  /** Constrain the preview width, e.g. 'sm' | 'md' | 'lg' | 'full'. */
  width?: 'sm' | 'md' | 'lg' | 'full';
  /** Default canvas background pattern: 'dots' | 'grid' | 'solid'. */
  defaultCanvas?: ShowcaseCanvas;
  /** Optional callback invoked when the user clicks the reset button (if supported) */
  onReset?: () => void;
}

/**
 * Clean, ultra-premium component showcase with:
 * - Tri-mode view: Preview / Code / Split
 * - Interactive custom responsive viewport simulator: 100%, 1024px, 768px, 480px, 375px + fluid slider + drag handle
 * - Canvas texture switcher: Dotted matrix, Blueprint mesh, Clean solid
 * - Direct TypeScript-first code presentation (clean TSX without regex transforms)
 * - Multi-file tab support
 */
export function Showcase({
  title,
  description,
  children,
  code,
  language = 'tsx',
  files,
  footer,
  defaultOpen = false,
  defaultMode,
  bleed = false,
  width = 'full',
  defaultCanvas = 'solid',
  onReset,
}: ShowcaseProps) {
  // Determine initial mode
  const initialMode: ShowcaseMode = useMemo(() => {
    if (defaultMode) return defaultMode;
    if (defaultOpen) return 'split';
    return 'preview';
  }, [defaultMode, defaultOpen]);

  const hasCode = Boolean(code || (files && files.length > 0));
  const [mode, setMode] = useState<ShowcaseMode>(hasCode ? initialMode : 'preview');
  const [canvas] = useState<ShowcaseCanvas>(defaultCanvas);
  const [remountKey, setRemountKey] = useState(0);
  const [activeFileIdx, setActiveFileIdx] = useState(0);
  const [copiedToolbar, setCopiedToolbar] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  // Responsive simulator state: '100%' or pixel number
  const [viewportWidth, setViewportWidth] = useState<number | '100%'>('100%');
  const [showSlider, setShowSlider] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const viewportRef = useRef<HTMLDivElement>(null);

  // Active raw snippet
  const activeSnippet = useMemo(() => {
    if (files && files.length > 0) {
      const current = files[activeFileIdx] ?? files[0];
      if (current) {
        return { code: current.code, language: current.language || 'tsx', name: current.name };
      }
    }
    return { code: code || '', language, name: undefined };
  }, [files, activeFileIdx, code, language]);

  const handleCopy = useCallback(async () => {
    if (!activeSnippet.code) return;
    try {
      await navigator.clipboard.writeText(activeSnippet.code.trim());
      setCopiedToolbar(true);
      window.setTimeout(() => setCopiedToolbar(false), 1800);
    } catch {
      // Clipboard unavailable
    }
  }, [activeSnippet.code]);

  // Optional reset handler (only active if parent provided onReset)
  const handleReset = useCallback(() => {
    if (!onReset) return;
    setIsResetting(true);
    setRemountKey((k) => k + 1);

    try {
      onReset();
    } catch {
      // Safe fallback
    }

    // Reset uncontrolled inputs / forms inside viewport
    if (viewportRef.current) {
      const forms = viewportRef.current.querySelectorAll('form');
      forms.forEach((f) => f.reset());
      const inputs = viewportRef.current.querySelectorAll<HTMLInputElement>('input[type="text"], input[type="search"]');
      inputs.forEach((input) => {
        if (!input.readOnly) input.value = '';
      });
    }

    window.setTimeout(() => setIsResetting(false), 280);
  }, [onReset]);

  // Drag-to-resize handle on right border of device frame
  const handleDragStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    const startX = e.clientX;
    const startWidth = viewportRef.current ? viewportRef.current.offsetWidth : 768;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = (moveEvent.clientX - startX) * 2;
      const nextWidth = Math.min(Math.max(320, Math.round(startWidth + deltaX)), 1240);
      setViewportWidth(nextWidth);
    };

    const onMouseUp = () => {
      setIsDragging(false);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  }, []);

  // Format width readout label
  const widthLabel = useMemo(() => {
    if (viewportWidth === '100%') return '100% (Desktop)';
    if (viewportWidth === 1024) return '1024px (Laptop)';
    if (viewportWidth === 768) return '768px (Tablet)';
    if (viewportWidth === 480) return '480px (Large Mobile)';
    if (viewportWidth === 375) return '375px (Mobile)';
    return `${viewportWidth}px (Custom)`;
  }, [viewportWidth]);

  return (
    <section className="showcase">
      {(title || description) && (
        <header className="showcase__head">
          {title && <h3 className="showcase__title">{title}</h3>}
          {description && <p className="showcase__desc">{description}</p>}
        </header>
      )}

      <div className="showcase__frame">
        {/* Top Control Bar */}
        <div className="showcase__toolbar">
          {/* Mode Switcher */}
          {hasCode ? (
            <div className="showcase__segmented" role="tablist" aria-label="Showcase view modes">
              <button
                type="button"
                role="tab"
                aria-selected={mode === 'preview'}
                className={`showcase__seg-btn ${mode === 'preview' ? 'showcase__seg-btn--active' : ''}`}
                onClick={() => setMode('preview')}
                title="Interactive component preview"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                <span>Preview</span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={mode === 'code'}
                className={`showcase__seg-btn ${mode === 'code' ? 'showcase__seg-btn--active' : ''}`}
                onClick={() => setMode('code')}
                title="Syntax-highlighted source code"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="16 18 22 12 16 6" />
                  <polyline points="8 6 2 12 8 18" />
                </svg>
                <span>Code</span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={mode === 'split'}
                className={`showcase__seg-btn ${mode === 'split' ? 'showcase__seg-btn--active' : ''}`}
                onClick={() => setMode('split')}
                title="Simultaneous preview and code"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect width="18" height="18" x="3" y="3" rx="2" />
                  <path d="M3 12h18" />
                </svg>
                <span>Split</span>
              </button>
            </div>
          ) : (
            <div className="showcase__badge-preview">Live Component</div>
          )}

          {/* Multi-file subtabs if multiple files exist */}
          {files && files.length > 1 && (mode === 'code' || mode === 'split') && (
            <div className="showcase__file-tabs">
              {files.map((file, idx) => (
                <button
                  key={file.name}
                  type="button"
                  className={`showcase__file-tab ${idx === activeFileIdx ? 'showcase__file-tab--active' : ''}`}
                  onClick={() => setActiveFileIdx(idx)}
                >
                  {file.name}
                </button>
              ))}
            </div>
          )}

          {/* Right Stage Controls */}
          <div className="showcase__controls">
            {/* Viewport Presets & Slider Toggle (Active in preview/split) */}
            {(mode === 'preview' || mode === 'split') && (
              <div className="showcase__viewport-selector" title="Responsive viewport presets">
                {RESPONSIVE_PRESETS.map((preset) => {
                  const isActive = viewportWidth === preset.width;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      className={`showcase__icon-btn ${isActive ? 'showcase__icon-btn--active' : ''}`}
                      onClick={() => setViewportWidth(preset.width)}
                      title={preset.label}
                      aria-label={preset.label}
                    >
                      {preset.icon === 'desktop' && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                          <rect width="20" height="14" x="2" y="3" rx="2" />
                          <line x1="8" x2="16" y1="21" y2="21" />
                          <line x1="12" x2="12" y1="17" y2="21" />
                        </svg>
                      )}
                      {preset.icon === 'laptop' && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                          <rect width="18" height="12" x="3" y="4" rx="2" />
                          <path d="M2 20h20" />
                        </svg>
                      )}
                      {preset.icon === 'tablet' && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                          <rect width="16" height="20" x="4" y="2" rx="2" />
                          <line x1="12" x2="12.01" y1="18" y2="18" />
                        </svg>
                      )}
                      {preset.icon === 'mobile-lg' && (
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                          <rect width="14" height="20" x="5" y="2" rx="2" />
                          <line x1="9" x2="15" y1="18" y2="18" />
                        </svg>
                      )}
                      {preset.icon === 'mobile' && (
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                          <rect width="12" height="20" x="6" y="2" rx="2" />
                          <circle cx="12" cy="18" r="0.5" fill="currentColor" />
                        </svg>
                      )}
                    </button>
                  );
                })}

                <button
                  type="button"
                  className={`showcase__icon-btn ${showSlider ? 'showcase__icon-btn--active' : ''}`}
                  onClick={() => setShowSlider((prev) => !prev)}
                  title="Toggle fluid custom width slider"
                  aria-label="Toggle width slider"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="4" x2="20" y1="12" y2="12" />
                    <line x1="4" x2="4" y1="8" y2="16" />
                    <line x1="20" x2="20" y1="8" y2="16" />
                    <circle cx="12" cy="12" r="3" fill="currentColor" />
                  </svg>
                </button>
              </div>
            )}

            {/* Optional Reset Button: only shown if an onReset prop is explicitly provided */}
            {onReset && (mode === 'preview' || mode === 'split') && (
              <button
                type="button"
                className={`showcase__icon-btn ${isResetting ? 'showcase__icon-btn--spin' : ''}`}
                onClick={handleReset}
                title="Reset preview state"
                aria-label="Reset component state"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
                  <path d="M21 3v5h-5" />
                  <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
                  <path d="M3 21v-5h5" />
                </svg>
              </button>
            )}

            {/* Quick Copy Snippet */}
            {hasCode && (
              <button
                type="button"
                className={`showcase__copy-btn ${copiedToolbar ? 'showcase__copy-btn--copied' : ''}`}
                onClick={handleCopy}
                title="Copy code to clipboard"
              >
                {copiedToolbar ? (
                  <>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="9" y="9" width="13" height="13" rx="2" />
                      <path d="M5 15V5a2 2 0 0 1 2-2h8" />
                    </svg>
                    <span>Copy</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Custom Width Slider Bar (when enabled) */}
        {showSlider && (mode === 'preview' || mode === 'split') && (
          <div className="showcase__slider-bar">
            <span className="showcase__slider-label">Width: <strong>{widthLabel}</strong></span>
            <input
              type="range"
              min={320}
              max={1200}
              step={10}
              value={viewportWidth === '100%' ? 1200 : viewportWidth}
              onChange={(e) => setViewportWidth(Number(e.target.value))}
              className="showcase__slider-input"
            />
            <button
              type="button"
              className="showcase__slider-reset"
              onClick={() => setViewportWidth('100%')}
            >
              Reset 100%
            </button>
          </div>
        )}

        {/* Stage Canvas Area (Visible in 'preview' or 'split' mode) */}
        {(mode === 'preview' || mode === 'split') && (
          <div className="showcase__canvas">
            <div
              ref={viewportRef}
              className={`showcase__viewport-wrapper ${viewportWidth !== '100%' ? 'showcase__viewport-wrapper--constrained' : ''} ${isDragging ? 'showcase__viewport-wrapper--dragging' : ''}`}
              style={{
                maxWidth: viewportWidth === '100%' ? undefined : `min(100%, ${viewportWidth}px)`,
              }}
            >
              {viewportWidth !== '100%' && (
                <div className="showcase__device-header">
                  <span className="showcase__device-badge">
                    {widthLabel}
                  </span>
                  <button
                    type="button"
                    className="showcase__device-close"
                    onClick={() => setViewportWidth('100%')}
                    title="Return to full width"
                  >
                    ×
                  </button>
                </div>
              )}

              <div
                key={remountKey}
                className={`showcase__stage showcase__stage--${viewportWidth === '100%' ? width : 'full'}${bleed ? ' showcase__stage--bleed' : ''} ${isResetting ? 'showcase__stage--reloading' : ''}`}
              >
                {children}
              </div>

              {/* Draggable resize handle on right border */}
              {viewportWidth !== '100%' && (
                <div
                  className="showcase__resize-handle"
                  onMouseDown={handleDragStart}
                  title="Drag horizontally to resize width"
                >
                  <div className="showcase__resize-bar" />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Code Area (Visible in 'code' or 'split' mode) */}
        {(mode === 'code' || mode === 'split') && hasCode && (
          <div className={`showcase__code-area ${mode === 'split' ? 'showcase__code-area--split' : ''}`}>
            <CodeBlock
              code={activeSnippet.code}
              language={activeSnippet.language}
              filename={activeSnippet.name}
              embedded
            />
          </div>
        )}
      </div>

      {footer && <div className="showcase__footer">{footer}</div>}
    </section>
  );
}

export interface PropsTableItem {
  name: string;
  type: string;
  default?: string;
  description: string;
  required?: boolean;
}

export interface PropsTableProps {
  rows?: PropsTableItem[];
  items?: PropsTableItem[];
}

export function PropsTable({ rows, items }: PropsTableProps) {
  const data = rows ?? items ?? [];

  return (
    <div className="props-table-wrap">
      <table className="props-table">
        <thead>
          <tr>
            <th>Prop</th>
            <th>Type</th>
            <th>Default</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.name}>
              <td>
                <div className="props-table__prop-cell">
                  <code className="props-table__name">{row.name}</code>
                  {row.required && <span className="props-table__req">required</span>}
                </div>
              </td>
              <td>
                <code className="props-table__type">{row.type}</code>
              </td>
              <td>
                {row.default ? <code className="props-table__default">{row.default}</code> : <span className="props-table__empty">—</span>}
              </td>
              <td>{row.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Small "do / don't" callout used throughout the guides. */
export function Callout({
  tone = 'info',
  type,
  title,
  children,
}: {
  tone?: 'info' | 'success' | 'warning' | 'danger' | 'tip';
  type?: 'info' | 'success' | 'warning' | 'danger' | 'tip';
  title?: string;
  children: ReactNode;
}) {
  const rawTone = type ?? tone;
  const effectiveTone = rawTone === 'tip' ? 'info' : rawTone;
  return (
    <aside className={`callout callout--${effectiveTone}`}>
      <div className="callout__indicator" />
      <div className="callout__content">
        {title && <strong className="callout__title">{title}</strong>}
        <div>{children}</div>
      </div>
    </aside>
  );
}
