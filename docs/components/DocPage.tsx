import type { ReactNode } from 'react';

export interface DocPageProps {
  eyebrow?: string;
  title: string;
  lede?: ReactNode;
  children: ReactNode;
}

export function DocPage({ eyebrow, title, lede, children }: DocPageProps) {
  return (
    <article className="doc">
      <header className="doc-header">
        {eyebrow && <div className="doc-eyebrow">{eyebrow}</div>}
        <h1 className="doc-title">{title}</h1>
        {lede && <p className="doc-lede">{lede}</p>}
      </header>
      {children}
    </article>
  );
}

export function Section({
  title,
  description,
  children,
  id,
}: {
  title: string;
  description?: ReactNode;
  children: ReactNode;
  id?: string;
}) {
  return (
    <section className="section" id={id}>
      <div className="section__head">
        <h2 className="section__title">{title}</h2>
        {description && <p className="section__desc">{description}</p>}
      </div>
      {children}
    </section>
  );
}
