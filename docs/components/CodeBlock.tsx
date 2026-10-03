import { useCallback, useMemo, useState } from 'react';
import { tokenize, TOKEN_COLORS } from '../lib/highlight';

export interface CodeBlockProps {
  code: string;
  language?: string;
  /** Show the copy-to-clipboard button. */
  copyable?: boolean;
  /** Cap the height and let long snippets scroll. */
  maxHeight?: number;
}

export function CodeBlock({ code, language = 'tsx', copyable = true, maxHeight }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const tokens = useMemo(() => tokenize(code.trim()), [code]);

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code.trim());
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard is unavailable over plain http; fail quietly.
    }
  }, [code]);

  return (
    <div className="code-block">
      <div className="code-block__bar">
        <span className="code-block__lang">{language}</span>
        {copyable && (
          <button type="button" className="code-block__copy" onClick={copy} aria-label="Copy code">
            {copied ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="12" height="12" rx="2" />
                <path d="M5 15V5a2 2 0 0 1 2-2h8" />
              </svg>
            )}
            {copied ? 'Copied' : 'Copy'}
          </button>
        )}
      </div>
      <pre className="code-block__pre" style={maxHeight ? { maxHeight, overflow: 'auto' } : undefined}>
        <code>
          {tokens.map((token, index) => (
            <span key={index} style={{ color: TOKEN_COLORS[token.kind] }}>
              {token.value}
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}
