import {
  Children,
  cloneElement,
  createContext,
  isValidElement,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';

export interface DocNavigationItem {
  id: string;
  title: string;
}

export interface DocNavigationContextValue {
  currentPageId: string;
  prevPage?: DocNavigationItem;
  nextPage?: DocNavigationItem;
  navigate: (id: string) => void;
}

export const DocNavigationContext = createContext<DocNavigationContextValue | null>(null);

export interface DocPageProps {
  eyebrow?: string;
  title: string;
  lede?: ReactNode;
  children: ReactNode;
  toc?: { id: string; label: string }[];
  importStatement?: string;
}

function QuickStylesheetBadge() {
  const [copied, setCopied] = useState(false);
  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText("import 'hesh-ui/styles.css';");
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* ignore */
    }
  };

  return (
    <div
      className={`doc-stylesheet-tip ${copied ? 'doc-stylesheet-tip--copied' : ''}`}
      onClick={handleCopy}
      role="button"
      tabIndex={0}
      title="Click to copy stylesheet import"
      aria-label="Click to copy stylesheet import statement"
    >
      <span className="doc-stylesheet-tip__icon" aria-hidden="true">💡</span>
      <span className="doc-stylesheet-tip__text">Global CSS required at app root:</span>
      <code className="doc-stylesheet-tip__code">import 'hesh-ui/styles.css';</code>
      <span className="doc-stylesheet-tip__badge">{copied ? 'Copied!' : 'Copy CSS'}</span>
    </div>
  );
}

function QuickImportBar({ statement, slug }: { statement: string; slug?: string }) {
  const [mode, setMode] = useState<'cli' | 'npm'>('cli');
  const [copied, setCopied] = useState(false);

  const cliCommand = `npx hesh-ui add ${slug || 'button'}`;
  const textToCopy = mode === 'cli' ? cliCommand : statement;

  // Match: import { ... } from 'hesh-ui'; or import ... from 'hesh-ui';
  const match = statement.match(/^(import\s+)(\{[^}]+\}|\w+)(\s+from\s+)((?:'[^']+'|"[^"]+"))(;?)$/);
  const symbols = match?.[2] ?? '';
  const pkg = match?.[4] ?? '';
  const semi = match?.[5] ?? '';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* ignore */
    }
  };

  return (
    <div
      className={`doc-quick-import ${copied ? 'doc-quick-import--copied' : ''}`}
      onClick={handleCopy}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCopy();
        }
      }}
      title={copied ? 'Copied to clipboard!' : `Click to copy ${mode.toUpperCase()} snippet`}
      aria-label={`Click to copy ${mode.toUpperCase()} snippet`}
    >
      <div className="doc-quick-import__tabs" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className={`doc-quick-import__tab ${mode === 'cli' ? 'is-active' : ''}`}
          onClick={() => setMode('cli')}
        >
          CLI
        </button>
        <button
          type="button"
          className={`doc-quick-import__tab ${mode === 'npm' ? 'is-active' : ''}`}
          onClick={() => setMode('npm')}
        >
          npm
        </button>
      </div>

      <div className="doc-quick-import__code">
        {mode === 'cli' ? (
          <>
            <span className="doc-syntax__prompt">$ </span>
            <span className="doc-syntax__keyword">npx </span>
            <span className="doc-syntax__symbol">hesh-ui add </span>
            <span className="doc-syntax__string">{slug || 'button'}</span>
          </>
        ) : match && symbols && pkg ? (
          <>
            <span className="doc-syntax__keyword">import</span>
            <span className="doc-syntax__space"> </span>
            {symbols.startsWith('{') ? (
              <>
                <span className="doc-syntax__punct">&#123;&nbsp;</span>
                <span className="doc-syntax__symbol">{symbols.slice(1, -1).trim()}</span>
                <span className="doc-syntax__punct">&nbsp;&#125;</span>
              </>
            ) : (
              <span className="doc-syntax__symbol">{symbols}</span>
            )}
            <span className="doc-syntax__keyword"> from </span>
            <span className="doc-syntax__string">{pkg}</span>
            {semi && <span className="doc-syntax__punct">{semi}</span>}
          </>
        ) : (
          <code>{statement}</code>
        )}
      </div>

      {copied && (
        <span className="doc-quick-import__copied-tip" aria-live="polite">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
          Copied!
        </span>
      )}
    </div>
  );
}

export function DocPage({
  eyebrow,
  title,
  lede,
  children,
  toc: explicitToc,
  importStatement,
}: DocPageProps) {
  const [sections, setSections] = useState<{ id: string; label: string }[]>(explicitToc || []);
  const [activeSection, setActiveSection] = useState<string>('');
  const articleRef = useRef<HTMLElement>(null);
  const nav = useContext(DocNavigationContext);

  useEffect(() => {
    if (explicitToc && explicitToc.length > 0) {
      setSections(explicitToc);
      if (explicitToc[0]) setActiveSection(explicitToc[0].id);
      return;
    }

    if (!articleRef.current) return;
    const els = Array.from(articleRef.current.querySelectorAll<HTMLElement>('[data-doc-section]'));
    const list = els.map((el) => ({
      id: el.id,
      label: el.getAttribute('data-doc-section') || el.querySelector('h2')?.textContent || el.id,
    }));

    setSections(list);
    if (list[0]) setActiveSection(list[0].id);

    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting);
        if (visible) {
          setActiveSection(visible.target.id);
        }
      },
      { rootMargin: '-70px 0px -55% 0px', threshold: 0 }
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [explicitToc, title]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(id);
    }
  };

  const defaultImport =
    importStatement ||
    (eyebrow && !['Foundations', 'Examples', 'Start here'].includes(eyebrow)
      ? `import { ${title
          .split(' · ')
          .map((s) => s.trim().split(' ')[0])
          .filter(Boolean)
          .join(', ')} } from 'hesh-ui';`
      : undefined);

  return (
    <div className="doc-layout">
      <article className="doc" ref={articleRef}>
        <header className="doc-header">
          {eyebrow && <div className="doc-eyebrow">{eyebrow}</div>}
          <h1 className="doc-title">{title}</h1>
          {lede && <p className="doc-lede">{lede}</p>}

          {defaultImport && (
            <div className="doc-import-group">
              <QuickImportBar
                statement={defaultImport}
                slug={(nav?.currentPageId || title).toLowerCase().replace(/\s+/g, '-')}
              />
              {eyebrow && !['Foundations', 'Examples', 'Start here'].includes(eyebrow) && (
                <QuickStylesheetBadge />
              )}
            </div>
          )}
        </header>

        {children}

        {nav && (nav.prevPage || nav.nextPage) && (
          <nav aria-label="Component pagination" className="doc-pagination">
            {nav.prevPage ? (
              <button
                type="button"
                onClick={() => nav.navigate(nav.prevPage!.id)}
                className="doc-pagination__btn doc-pagination__btn--prev"
              >
                <span className="doc-pagination__label">← Previous</span>
                <span className="doc-pagination__title">{nav.prevPage.title}</span>
              </button>
            ) : (
              <div />
            )}
            {nav.nextPage && (
              <button
                type="button"
                onClick={() => nav.navigate(nav.nextPage!.id)}
                className="doc-pagination__btn doc-pagination__btn--next"
              >
                <span className="doc-pagination__label">Next →</span>
                <span className="doc-pagination__title">{nav.nextPage.title}</span>
              </button>
            )}
          </nav>
        )}
      </article>

      {sections.length > 0 && (
        <aside className="doc-toc-wrap">
          <nav aria-label="On this page" className="doc-toc">
            <div className="doc-toc__head">
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="21" y1="10" x2="3" y2="10" />
                <line x1="21" y1="6" x2="3" y2="6" />
                <line x1="21" y1="14" x2="3" y2="14" />
                <line x1="21" y1="18" x2="3" y2="18" />
              </svg>
              <span>On this page</span>
            </div>
            <div className="doc-toc__list">
              {sections.map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  className={`doc-toc__link${activeSection === id ? ' doc-toc__link--active' : ''}`}
                  onClick={() => scrollTo(id)}
                >
                  {label}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="doc-toc__top-btn"
              onClick={() => {
                const mainEl = document.getElementById('main');
                if (mainEl && typeof mainEl.scrollTo === 'function') {
                  mainEl.scrollTo({ top: 0, behavior: 'smooth' });
                } else if (mainEl) {
                  mainEl.scrollTop = 0;
                }
                if (typeof window.scrollTo === 'function') {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
            >
              ↑ Back to top
            </button>
          </nav>
        </aside>
      )}
    </div>
  );
}

export function Section({
  title,
  description,
  children,
  id,
  code,
}: {
  title: string;
  description?: ReactNode;
  children: ReactNode;
  id?: string;
  code?: string;
}) {
  const generatedId = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  const sectionId = id || generatedId;

  // Defensive fallback: If code was provided to Section and child is a React element missing its code prop, forward it
  const resolvedChildren = code
    ? Children.map(children, (child) => {
        if (isValidElement(child) && !(child.props as any)?.code) {
          return cloneElement(child as any, { code });
        }
        return child;
      })
    : children;

  return (
    <section className="section" id={sectionId} data-doc-section={title}>
      <div className="section__head">
        <h2 className="section__title">{title}</h2>
        {description && <p className="section__desc">{description}</p>}
      </div>
      {resolvedChildren}
    </section>
  );
}
