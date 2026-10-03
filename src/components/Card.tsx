import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../utils/cn';

export interface CardProps extends HTMLAttributes<HTMLElement> {
  /** Adds hover lift + pointer cursor. Automatically enabled when onClick is provided. */
  interactive?: boolean;
  padded?: boolean;
  elevation?: 'flat' | 'default' | 'elevated';
  /** Underlying HTML element to render. Defaults to 'div'. */
  as?: 'div' | 'button' | 'article' | 'section';
}

export const Card = forwardRef<HTMLElement, CardProps>(function Card(
  {
    as: Tag = 'div',
    interactive = false,
    padded = false,
    elevation = 'default',
    className,
    children,
    ...props
  },
  ref
) {
  const isInteractive = interactive || Boolean(props.onClick);

  return (
    <Tag
      ref={ref as any}
      type={Tag === 'button' ? 'button' : undefined}
      className={cn(
        'pui-card',
        padded && 'pui-card--pad',
        elevation === 'flat' && 'pui-card--flat',
        elevation === 'elevated' && 'pui-card--elevated',
        isInteractive && 'pui-card--interactive',
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  );
});

export interface CardHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
}

/**
 * `action` sits outside the heading so a button in the corner is not read as
 * part of the card's title by screen readers.
 */
export function CardHeader({ title, description, action, className, children, ...props }: CardHeaderProps) {
  return (
    <div className={cn('pui-card__header', className)} {...props}>
      <div className="pui-card__heading">
        {title && <div className="pui-card__title">{title}</div>}
        {description && <div className="pui-card__desc">{description}</div>}
        {children}
      </div>
      {action}
    </div>
  );
}

export function CardBody({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('pui-card__body', className)} {...props} />;
}

export function CardFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('pui-card__footer', className)} {...props} />;
}
