import type { HTMLAttributes } from 'react';
import { cn } from '../utils/cn';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type AvatarStatus = 'online' | 'away' | 'busy' | 'offline';

export interface AvatarProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  name: string;
  src?: string;
  size?: AvatarSize;
  square?: boolean;
  status?: AvatarStatus;
}

/** Deterministic hue from the name, so the same person is always the same colour. */
function hashHue(value: string) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % 360;
}

export function initialsOf(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase();
}

export function Avatar({
  name,
  src,
  size = 'md',
  square = false,
  status,
  className,
  style,
  ...props
}: AvatarProps) {
  const hue = hashHue(name);

  return (
    <span
      className={cn('pui-avatar', `pui-avatar--${size}`, square && 'pui-avatar--square', className)}
      role="img"
      aria-label={name}
      style={{
        background: src
          ? undefined
          : `linear-gradient(140deg, hsl(${hue} 72% 92%), hsl(${(hue + 24) % 360} 78% 84%))`,
        color: src ? undefined : `hsl(${hue} 62% 28%)`,
        ...style,
      }}
      {...props}
    >
      {src ? (
        <img src={src} alt="" loading="lazy" decoding="async" />
      ) : (
        <span aria-hidden="true">{initialsOf(name)}</span>
      )}
      {status && (
        <span
          className={cn('pui-avatar__status', `pui-avatar__status--${status}`)}
          title={status}
        />
      )}
    </span>
  );
}

export interface AvatarGroupProps extends HTMLAttributes<HTMLDivElement> {
  people: readonly { name: string; src?: string }[];
  max?: number;
  size?: AvatarSize;
}

export function AvatarGroup({ people, max = 4, size = 'md', className, ...props }: AvatarGroupProps) {
  const shown = people.slice(0, max);
  const overflow = people.length - shown.length;

  return (
    <div className={cn('pui-avatar-group', className)} {...props}>
      {shown.map((person, index) => (
        <Avatar key={`${person.name}-${index}`} name={person.name} src={person.src} size={size} />
      ))}
      {overflow > 0 && (
        <span className="pui-avatar-group__more" aria-label={`${overflow} more`}>
          +{overflow}
        </span>
      )}
    </div>
  );
}
