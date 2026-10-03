import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../utils/cn';

/* ------------------------------------------------------------------ Breadcrumbs */

export interface BreadcrumbItem {
  label: ReactNode;
  href?: string;
  onClick?: () => void;
}

export interface BreadcrumbsProps extends HTMLAttributes<HTMLElement> {
  items: readonly BreadcrumbItem[];
  separator?: ReactNode;
}

export function Breadcrumbs({ items, separator = '/', className, ...props }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn('pui-breadcrumbs', className)} {...props}>
      <ol style={{ display: 'flex', alignItems: 'center', gap: 'var(--pui-space-1_5, 0.375rem)', flexWrap: 'wrap' }}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--pui-space-1_5, 0.375rem)' }}>
              {isLast ? (
                <span aria-current="page">{item.label}</span>
              ) : item.href ? (
                <a href={item.href}>{item.label}</a>
              ) : (
                <button type="button" onClick={item.onClick} style={{ color: 'inherit' }}>
                  {item.label}
                </button>
              )}
              {!isLast && (
                <span className="pui-breadcrumbs__sep" aria-hidden="true">
                  {separator}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/* ------------------------------------------------------------------ PageHeader */

export interface PageHeaderProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  title: ReactNode;
  description?: ReactNode;
  /** Small uppercase label above the title. */
  eyebrow?: ReactNode;
  actions?: ReactNode;
  breadcrumbs?: ReactNode;
}

/**
 * Standard page masthead. Uses `<header>` + a single `<h1>` so each page keeps
 * one top-level heading for document outline and screen-reader navigation.
 */
export function PageHeader({
  title,
  description,
  eyebrow,
  actions,
  breadcrumbs,
  className,
  children,
  ...props
}: PageHeaderProps) {
  return (
    <header className={cn('pui-page-header', className)} {...props}>
      <div className="pui-page-header__main">
        {breadcrumbs}
        {eyebrow && <div className="pui-page-header__eyebrow">{eyebrow}</div>}
        <h1 className="pui-page-header__title">{title}</h1>
        {description && <p className="pui-page-header__desc">{description}</p>}
        {children}
      </div>
      {actions && <div className="pui-page-header__actions">{actions}</div>}
    </header>
  );
}

/* ------------------------------------------------------------------ SidebarNav */

export interface NavItem {
  id: string;
  label: ReactNode;
  icon?: ReactNode;
  href?: string;
  onClick?: () => void;
  badge?: ReactNode;
  disabled?: boolean;
}

export interface NavGroup {
  label?: ReactNode;
  items: readonly NavItem[];
}

export interface SidebarNavProps extends HTMLAttributes<HTMLElement> {
  groups: readonly NavGroup[];
  /** id of the item that represents the current page. */
  activeId?: string;
  'aria-label'?: string;
}

export const SidebarNav = forwardRef<HTMLElement, SidebarNavProps>(function SidebarNav(
  { groups, activeId, className, ...props },
  ref
) {
  return (
    <nav
      ref={ref}
      aria-label={props['aria-label'] ?? 'Main navigation'}
      className={cn('pui-nav', className)}
      {...props}
    >
      {groups.map((group, groupIndex) => (
        <div key={groupIndex} className="pui-nav__group">
          {group.label && <div className="pui-nav__group-label">{group.label}</div>}
          {group.items.map((item) => {
            const isActive = item.id === activeId;
            const content = (
              <>
                {item.icon && <span className="pui-nav__item__icon">{item.icon}</span>}
                <span className="pui-nav__item__text">{item.label}</span>
                {item.badge}
              </>
            );

            const shared = {
              className: 'pui-nav__item',
              'aria-current': isActive ? ('page' as const) : undefined,
              'aria-disabled': item.disabled || undefined,
            };

            if (item.disabled) {
              return (
                <span key={item.id} {...shared} aria-disabled="true" style={{ opacity: 0.45, cursor: 'not-allowed' }}>
                  {content}
                </span>
              );
            }

            if (item.href) {
              return (
                <a key={item.id} href={item.href} {...shared}>
                  {content}
                </a>
              );
            }

            return (
              <button key={item.id} type="button" onClick={item.onClick} {...shared}>
                {content}
              </button>
            );
          })}
        </div>
      ))}
    </nav>
  );
});
