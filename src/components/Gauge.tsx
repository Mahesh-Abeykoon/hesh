import React, { forwardRef, type ReactNode, type HTMLAttributes } from 'react';
import { cn } from '../utils/cn';

export interface GaugeProps extends HTMLAttributes<HTMLDivElement> {
  value: number;
  min?: number;
  max?: number;
  type?: 'circle' | 'semicircle' | 'arc';
  size?: number;
  strokeWidth?: number;
  tone?: 'primary' | 'success' | 'warning' | 'danger' | 'gradient';
  showValue?: boolean;
  valueFormatter?: (val: number) => ReactNode;
  label?: ReactNode;
  sublabel?: ReactNode;
  roundedCaps?: boolean;
}

export const Gauge = forwardRef<HTMLDivElement, GaugeProps>(function Gauge(
  {
    value,
    min = 0,
    max = 100,
    type = 'circle',
    size = 140,
    strokeWidth = 12,
    tone = 'primary',
    showValue = true,
    valueFormatter,
    label,
    sublabel,
    roundedCaps = true,
    className,
    ...props
  },
  ref
) {
  const clampedValue = Math.min(Math.max(value, min), max);
  const percentage = (clampedValue - min) / (max - min || 1);

  const radius = (size - strokeWidth) / 2;
  const center = size / 2;

  let totalAngle = 360;
  let startAngle = -90;
  let height = size;

  if (type === 'semicircle') {
    totalAngle = 180;
    startAngle = 180;
    height = size / 2 + strokeWidth;
  } else if (type === 'arc') {
    totalAngle = 240;
    startAngle = 150;
    height = size * 0.88;
  }

  const circumference = 2 * Math.PI * radius;
  const arcLength = (totalAngle / 360) * circumference;
  const dashoffset = arcLength * (1 - percentage);

  // Convert polar coordinates to Cartesian for SVG arc path
  const polarToCartesian = (cx: number, cy: number, r: number, angleInDegrees: number) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: cx + r * Math.cos(angleInRadians),
      y: cy + r * Math.sin(angleInRadians),
    };
  };

  const describeArc = (x: number, y: number, r: number, startA: number, endA: number) => {
    const start = polarToCartesian(x, y, r, endA);
    const end = polarToCartesian(x, y, r, startA);
    const largeArcFlag = endA - startA <= 180 ? '0' : '1';
    return ['M', start.x, start.y, 'A', r, r, 0, largeArcFlag, 0, end.x, end.y].join(' ');
  };

  const isFullCircle = type === 'circle';
  const trackPath = isFullCircle
    ? undefined
    : describeArc(center, center, radius, startAngle, startAngle + totalAngle);

  const formattedValue = valueFormatter
    ? valueFormatter(clampedValue)
    : `${Math.round(clampedValue)}${max === 100 && min === 0 ? '%' : ''}`;

  return (
    <div
      ref={ref}
      role="meter"
      aria-valuenow={clampedValue}
      aria-valuemin={min}
      aria-valuemax={max}
      className={cn('hesh-gauge', `hesh-gauge--${type}`, `hesh-gauge--${tone}`, className)}
      style={{ width: size, height }}
      {...props}
    >
      <svg
        width={size}
        height={height}
        viewBox={`0 0 ${size} ${height}`}
        className="hesh-gauge__svg"
      >
        <defs>
          <linearGradient id={`hesh-gauge-grad-${tone}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--hesh-primary, #6366f1)" />
            <stop offset="100%" stopColor="var(--hesh-accent, #ec4899)" />
          </linearGradient>
        </defs>

        {isFullCircle ? (
          <>
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke="var(--hesh-surface-subtle, rgba(255,255,255,0.08))"
              strokeWidth={strokeWidth}
            />
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke={tone === 'gradient' ? `url(#hesh-gauge-grad-${tone})` : 'currentColor'}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - percentage)}
              strokeLinecap={roundedCaps ? 'round' : 'butt'}
              transform={`rotate(-90 ${center} ${center})`}
              className="hesh-gauge__arc"
            />
          </>
        ) : (
          <>
            <path
              d={trackPath}
              fill="none"
              stroke="var(--hesh-surface-subtle, rgba(255,255,255,0.08))"
              strokeWidth={strokeWidth}
              strokeLinecap={roundedCaps ? 'round' : 'butt'}
            />
            <path
              d={trackPath}
              fill="none"
              stroke={tone === 'gradient' ? `url(#hesh-gauge-grad-${tone})` : 'currentColor'}
              strokeWidth={strokeWidth}
              strokeDasharray={arcLength}
              strokeDashoffset={dashoffset}
              strokeLinecap={roundedCaps ? 'round' : 'butt'}
              className="hesh-gauge__arc"
            />
          </>
        )}
      </svg>

      <div className="hesh-gauge__center">
        {showValue && <div className="hesh-gauge__value">{formattedValue}</div>}
        {label && <div className="hesh-gauge__label">{label}</div>}
        {sublabel && <div className="hesh-gauge__sublabel">{sublabel}</div>}
      </div>
    </div>
  );
});
