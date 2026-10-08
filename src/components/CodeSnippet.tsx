import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../utils/cn';
import { CopyButton } from './CopyButton';

export interface CodeSnippetProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Raw code string. */
  code: string;
  /** Language identifier (e.g. 'tsx', 'bash', 'css'). */
  language?: string;
  /** Optional title shown in the header bar. */
  title?: ReactNode;
  /** Whether to show line numbers. @default false */
  showLineNumbers?: boolean;
  /** Whether to show the copy button in header. @default true */
  copyable?: boolean;
}

/**
 * CodeSnippet displays preformatted code blocks with language indicator, optional line numbers,
 * and built-in clipboard copying.
 */
export const CodeSnippet = forwardRef<HTMLDivElement, CodeSnippetProps>(function CodeSnippet(
  {
    code,
    language = 'bash',
    title,
    showLineNumbers = false,
    copyable = true,
    className,
    ...props
  },
  ref
) {
  const lines = code.trim().split('\n');

  return (
    <div ref={ref} className={cn('pui-code-snippet', className)} {...props}>
      <div className="pui-code-snippet__header">
        <div className="pui-code-snippet__meta">
          {title && <span className="pui-code-snippet__title">{title}</span>}
          {language && <span className="pui-code-snippet__lang">{language}</span>}
        </div>
        {copyable && <CopyButton value={code} size="sm" variant="ghost" label="Copy" />}
      </div>

      <pre className="pui-code-snippet__pre">
        <code>
          {showLineNumbers ? (
            <span className="pui-code-snippet__lines">
              {lines.map((line, i) => (
                <span key={i} className="pui-code-snippet__line">
                  <span className="pui-code-snippet__line-num">{i + 1}</span>
                  <span className="pui-code-snippet__line-text">{line}</span>
                </span>
              ))}
            </span>
          ) : (
            code
          )}
        </code>
      </pre>
    </div>
  );
});

CodeSnippet.displayName = 'CodeSnippet';
