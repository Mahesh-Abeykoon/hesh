import { useCallback, useMemo, useState } from 'react';
import { tokenize, TOKEN_COLORS, type Token } from '../lib/highlight';

export interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  /** Show the copy-to-clipboard button. */
  copyable?: boolean;
  /** Cap the height and let long snippets scroll. */
  maxHeight?: number;
  /** Show line numbers gutter. Default true. */
  showLineNumbers?: boolean;
  /** Allow collapsing long snippets. */
  collapsible?: boolean;
  /** Lines to highlight (1-indexed). */
  highlightLines?: number[];
  /** Embedded within a showcase frame (removes outer border/shadow) */
  embedded?: boolean;
  className?: string;
}

/**
 * Splits token stream into lines while preserving token types.
 */
function splitTokensIntoLines(tokens: Token[]): Token[][] {
  const lines: Token[][] = [[]];
  for (const token of tokens) {
    if (!token.value.includes('\n')) {
      const current = lines[lines.length - 1];
      if (current) current.push(token);
    } else {
      const parts = token.value.split('\n');
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (part && part.length > 0) {
          const current = lines[lines.length - 1];
          if (current) current.push({ kind: token.kind, value: part });
        }
        if (i < parts.length - 1) {
          lines.push([]);
        }
      }
    }
  }
  return lines;
}

export function CodeBlock({
  code,
  language = 'tsx',
  filename,
  copyable = true,
  maxHeight,
  showLineNumbers = true,
  collapsible = false,
  highlightLines = [],
  embedded = false,
  className = '',
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const trimmed = useMemo(() => code.trim(), [code]);

  // Tokenize & split into lines
  const lines = useMemo(() => {
    const rawTokens = tokenize(trimmed);
    return splitTokensIntoLines(rawTokens);
  }, [trimmed]);

  const copyCode = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(trimmed);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard unavailable
    }
  }, [trimmed]);

  const isLong = collapsible && lines.length > 24 && !expanded;

  return (
    <div
      className={`code-block ${embedded ? 'code-block--embedded' : ''} ${className}`}
      data-language={language}
    >
      <div className="code-block__bar">
        <div className="code-block__meta">
          {filename && <span className="code-block__filename">{filename}</span>}
          <span className="code-block__lang">{language}</span>
          <span className="code-block__stats">{lines.length} lines</span>
        </div>

        <div className="code-block__actions">
          {copyable && (
            <button
              type="button"
              className={`code-block__copy ${copied ? 'code-block__copy--copied' : ''}`}
              onClick={copyCode}
              aria-label="Copy code snippet"
            >
              {copied ? (
                <>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
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

      <div
        className={`code-block__content-wrap ${isLong ? 'code-block__content-wrap--collapsed' : ''}`}
        style={maxHeight ? { maxHeight, overflow: 'auto' } : undefined}
      >
        <pre className="code-block__pre">
          <code className="code-block__table">
            {lines.map((lineTokens, lineIdx) => {
              const lineNum = lineIdx + 1;
              const isHighlighted = highlightLines.includes(lineNum);
              return (
                <div
                  key={lineIdx}
                  className={`code-block__line ${isHighlighted ? 'code-block__line--highlight' : ''}`}
                >
                  {showLineNumbers && (
                    <span className="code-block__line-num" aria-hidden="true">
                      {lineNum}
                    </span>
                  )}
                  <span className="code-block__line-content">
                    {lineTokens.length === 0 ? (
                      '\u00A0'
                    ) : (
                      lineTokens.map((token, tIdx) => (
                        <span key={tIdx} style={{ color: TOKEN_COLORS[token.kind] }}>
                          {token.value}
                        </span>
                      ))
                    )}
                  </span>
                </div>
              );
            })}
          </code>
        </pre>

        {isLong && (
          <div className="code-block__expand-overlay">
            <button
              type="button"
              className="code-block__expand-btn"
              onClick={() => setExpanded(true)}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m6 9 6 6 6-6" />
              </svg>
              <span>Expand code ({lines.length} lines)</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
