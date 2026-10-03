import { useState, type ReactNode } from 'react';
import { CodeBlock } from './CodeBlock';

export interface ShowcaseProps {
  title?: string;
  description?: ReactNode;
  /** The live, interactive example. Omit for a code-only block. */
  children?: ReactNode;
  /** Source shown in the code panel. Should match `children`. */
  code?: string;
  /** Extra content below the preview — usually a props table. */
  footer?: ReactNode;
  /** Start with the code panel open. */
  defaultOpen?: boolean;
  /** Remove the inner padding for full-bleed examples (tables, dashboards). */
  bleed?: boolean;
  /** Constrain the preview width, e.g. 'sm' | 'md' | 'lg' | 'full'. */
  width?: 'sm' | 'md' | 'lg' | 'full';
}

/**
 * The core docs primitive: a live example next to its source.
 *
 * Examples are real React components rendered on the page — not screenshots and
 * not sandboxed iframes — so they respond to theme, density and interaction
 * exactly like they will in the reader's own app.
 */
export function Showcase({
  title,
  description,
  children,
  code,
  footer,
  defaultOpen = false,
  bleed = false,
  width = 'full',
}: ShowcaseProps) {
  const [showCode, setShowCode] = useState(defaultOpen);

  return (
    <section className="showcase">
      {(title || description) && (
        <header className="showcase__head">
          {title && <h3 className="showcase__title">{title}</h3>}
          {description && <p className="showcase__desc">{description}</p>}
        </header>
      )}

      <div className="showcase__frame">
        <div className={`showcase__stage showcase__stage--${width}${bleed ? ' showcase__stage--bleed' : ''}`}>
          {children}
        </div>

        {code && (
          <>
            <div className="showcase__toolbar">
              <button
                type="button"
                className="showcase__toggle"
                onClick={() => setShowCode((prev) => !prev)}
                aria-expanded={showCode}
                aria-controls="showcase-code"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="m9 18 6-6-6-6" style={{ transform: showCode ? 'rotate(90deg)' : 'none', transformOrigin: 'center', transition: 'transform 150ms' }} />
                </svg>
                {showCode ? 'Hide code' : 'Show code'}
              </button>
            </div>
            {showCode && (
              <div className="showcase__code" id="showcase-code">
                <CodeBlock code={code} />
              </div>
            )}
          </>
        )}
      </div>

      {footer && <div className="showcase__footer">{footer}</div>}
    </section>
  );
}

export interface PropsTableProps {
  rows: {
    name: string;
    type: string;
    default?: string;
    description: string;
    required?: boolean;
  }[];
}

export function PropsTable({ rows }: PropsTableProps) {
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
          {rows.map((row) => (
            <tr key={row.name}>
              <td>
                <code className="props-table__name">{row.name}</code>
                {row.required && <span className="props-table__req">required</span>}
              </td>
              <td>
                <code className="props-table__type">{row.type}</code>
              </td>
              <td>
                {row.default ? <code className="props-table__default">{row.default}</code> : '—'}
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
  title,
  children,
}: {
  tone?: 'info' | 'success' | 'warning' | 'danger';
  title?: string;
  children: ReactNode;
}) {
  return (
    <aside className={`callout callout--${tone}`}>
      {title && <strong className="callout__title">{title}</strong>}
      <div>{children}</div>
    </aside>
  );
}
