import { useId, useMemo, useState, type ReactNode } from 'react';
import { cn } from '../utils/cn';

/**
 * Dependency-free SVG charts.
 *
 * Why not recharts / visx: those are 90–400 kB and ship their own theming.
 * These read colour straight from the token layer, so charts re-theme with
 * everything else and cost almost nothing. They cover the shapes that make up
 * the overwhelming majority of product dashboards.
 *
 * Every chart is declarative SVG with a text alternative — screen readers get
 * the summary via `role="img"` + `aria-label`, and the interactive tooltip is
 * a mouse affordance only, never the sole way to read a value.
 */

export interface SeriesPoint {
  label: string;
  value: number;
}

const PADDING = { top: 24, right: 18, bottom: 34, left: 52 };

function useGradientId(prefix: string) {
  const id = useId().replace(/[:]/g, '');
  return `${prefix}-${id}`;
}

function scaleY(value: number, min: number, max: number, innerH: number, top: number) {
  const span = max - min || 1;
  return top + innerH - ((value - min) / span) * innerH;
}

function niceBounds(values: number[], padRatio = 0.08) {
  if (!values.length) return { min: 0, max: 100 };
  const min = Math.min(...values);
  const max = Math.max(...values);
  const pad = (max - min || Math.abs(max) || 1) * padRatio;
  return { min: min - pad, max: max + pad };
}

/** Computes smooth cubic Bézier spline for points */
function computeSmoothPath(pts: { x: number; y: number }[]): string {
  if (pts.length <= 1) return pts.map((p) => `${p.x},${p.y}`).join(' ');
  let d = `M ${pts[0]!.x.toFixed(1)},${pts[0]!.y.toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i === 0 ? 0 : i - 1]!;
    const p1 = pts[i]!;
    const p2 = pts[i + 1]!;
    const p3 = pts[i + 2] ?? p2;

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    d += ` C ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
  }
  return d;
}

/* ------------------------------------------------------------------ Area */

export interface AreaChartProps {
  data: SeriesPoint[];
  height?: number;
  color?: string;
  /** Formats tooltip and axis values. */
  format?: (value: number) => string;
  showGrid?: boolean;
  /** Smooth Bézier spline interpolation instead of straight lines @default true */
  smooth?: boolean;
  className?: string;
  label?: string;
}

export function AreaChart({
  data,
  height = 260,
  color = 'var(--pui-chart-1)',
  format = (v) => v.toLocaleString(),
  showGrid = true,
  smooth = true,
  className,
  label,
}: AreaChartProps) {
  const [hover, setHover] = useState<number | null>(null);
  const gradientId = useGradientId('area');
  const width = 720;

  if (!data || data.length === 0) {
    return (
      <div className={cn('pui-chart pui-chart--empty', className)} style={{ minHeight: height, display: 'grid', placeItems: 'center' }}>
        <span style={{ fontSize: '0.875rem', color: 'var(--pui-fg-subtle)' }}>No data available</span>
      </div>
    );
  }

  const { min, max } = useMemo(() => niceBounds(data.map((d) => d.value)), [data]);
  const innerW = width - PADDING.left - PADDING.right;
  const innerH = height - PADDING.top - PADDING.bottom;

  const x = (i: number) => PADDING.left + (i / Math.max(1, data.length - 1)) * innerW;
  const y = (v: number) => scaleY(v, min, max, innerH, PADDING.top);

  const pts = data.map((d, i) => ({ x: x(i), y: y(d.value) }));
  const bottomY = PADDING.top + innerH;

  const linePath = smooth
    ? computeSmoothPath(pts)
    : `M ${pts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' L ')}`;

  const areaPath = smooth
    ? `${linePath} L ${pts[pts.length - 1]!.x.toFixed(1)},${bottomY.toFixed(1)} L ${pts[0]!.x.toFixed(1)},${bottomY.toFixed(1)} Z`
    : `M ${PADDING.left},${bottomY} ${pts.map((p) => `L ${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')} L ${PADDING.left + innerW},${bottomY} Z`;

  const ticks = [0, 0.25, 0.5, 0.75, 1].map((r) => ({
    ratio: r,
    value: min + (max - min) * (1 - r),
  }));

  const summary = label ?? `${data.length} data points ranging from ${format(Math.min(...data.map((d) => d.value)))} to ${format(Math.max(...data.map((d) => d.value)))}`;

  return (
    <div className={cn('pui-chart', className)}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={summary}
        onMouseLeave={() => setHover(null)}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.42" />
            <stop offset="65%" stopColor={color} stopOpacity="0.10" />
            <stop offset="100%" stopColor={color} stopOpacity="0.00" />
          </linearGradient>
        </defs>

        {showGrid &&
          ticks.map((tick) => {
            const gy = PADDING.top + innerH * tick.ratio;
            return (
              <g key={tick.ratio}>
                <line
                  className="pui-chart__grid"
                  x1={PADDING.left}
                  x2={width - PADDING.right}
                  y1={gy}
                  y2={gy}
                  strokeDasharray={tick.ratio === 1 ? undefined : '3 4'}
                  opacity={0.65}
                />
                <text className="pui-chart__axis-label" x={PADDING.left - 10} y={gy + 4} textAnchor="end">
                  {format(Math.round(tick.value))}
                </text>
              </g>
            );
          })}

        <path d={areaPath} fill={`url(#${gradientId})`} />
        <path d={linePath} fill="none" stroke={color} strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round" />

        {data.map((d, i) => (
          <g key={d.label}>
            <rect
              x={x(i) - innerW / data.length / 2}
              y={PADDING.top}
              width={innerW / data.length}
              height={innerH}
              fill="transparent"
              onMouseEnter={() => setHover(i)}
            />
            <circle
              cx={x(i)}
              cy={y(d.value)}
              r={hover === i ? 6 : 3.5}
              fill="var(--pui-surface, #fff)"
              stroke={color}
              strokeWidth={hover === i ? 3 : 2}
              style={{ transition: 'all 120ms ease' }}
            />
            {hover === i && (
              <circle
                cx={x(i)}
                cy={y(d.value)}
                r={10}
                fill="none"
                stroke={color}
                strokeWidth={1.5}
                opacity={0.4}
              />
            )}
            <text className="pui-chart__axis-label" x={x(i)} y={height - 10} textAnchor="middle">
              {d.label}
            </text>
          </g>
        ))}

        {hover !== null && (
          <line
            x1={x(hover)}
            x2={x(hover)}
            y1={PADDING.top}
            y2={PADDING.top + innerH}
            stroke={color}
            strokeWidth="1.25"
            strokeDasharray="4 4"
            opacity="0.6"
          />
        )}
      </svg>

      {hover !== null && (
        <div
          className="pui-chart__tip"
          style={{ left: `${(x(hover) / width) * 100}%`, top: `${(y(data[hover]!.value) / height) * 100}%` }}
        >
          <div className="pui-chart__tip-title">{data[hover]!.label}</div>
          <div className="pui-chart__tip-value">{format(data[hover]!.value)}</div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ Bars */

export interface BarChartProps {
  data: SeriesPoint[];
  height?: number;
  color?: string;
  format?: (value: number) => string;
  /** Whether to show subtle background track pillars @default true */
  showTracks?: boolean;
  showGrid?: boolean;
  className?: string;
  label?: string;
}

export function BarChart({
  data,
  height = 260,
  color = 'var(--pui-chart-2)',
  format = (v) => v.toLocaleString(),
  showTracks = true,
  showGrid = true,
  className,
  label,
}: BarChartProps) {
  const [hover, setHover] = useState<number | null>(null);
  const gradientId = useGradientId('bar');
  const width = 720;

  if (!data || data.length === 0) {
    return (
      <div className={cn('pui-chart pui-chart--empty', className)} style={{ minHeight: height, display: 'grid', placeItems: 'center' }}>
        <span style={{ fontSize: '0.875rem', color: 'var(--pui-fg-subtle)' }}>No data available</span>
      </div>
    );
  }

  const { min, max } = useMemo(() => niceBounds([0, ...data.map((d) => d.value)], 0.05), [data]);
  const innerW = width - PADDING.left - PADDING.right;
  const innerH = height - PADDING.top - PADDING.bottom;

  const slot = innerW / data.length;
  const barW = Math.min(slot * 0.58, 44);
  const y0 = scaleY(Math.min(0, min), min, max, innerH, PADDING.top);

  const ticks = [0, 0.25, 0.5, 0.75, 1].map((r) => ({
    ratio: r,
    value: min + (max - min) * (1 - r),
  }));

  return (
    <div className={cn('pui-chart', className)}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={label ?? `Bar chart of ${data.length} categories`}
        onMouseLeave={() => setHover(null)}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="1" />
            <stop offset="100%" stopColor={color} stopOpacity="0.72" />
          </linearGradient>
        </defs>

        {showGrid &&
          ticks.map((tick) => {
            const gy = PADDING.top + innerH * tick.ratio;
            return (
              <g key={tick.ratio}>
                <line
                  className="pui-chart__grid"
                  x1={PADDING.left}
                  x2={width - PADDING.right}
                  y1={gy}
                  y2={gy}
                  strokeDasharray={tick.ratio === 1 ? undefined : '3 4'}
                  opacity={0.65}
                />
                <text className="pui-chart__axis-label" x={PADDING.left - 10} y={gy + 4} textAnchor="end">
                  {format(Math.round(tick.value))}
                </text>
              </g>
            );
          })}

        {data.map((d, i) => {
          const cx = PADDING.left + slot * i + slot / 2;
          const top = scaleY(d.value, min, max, innerH, PADDING.top);
          const h = Math.max(3, Math.abs(y0 - top));
          const isHovered = hover === i;
          const isAnyHovered = hover !== null;

          return (
            <g key={d.label} onMouseEnter={() => setHover(i)}>
              {/* Background Pillar Track */}
              {showTracks && (
                <rect
                  x={cx - barW / 2}
                  y={PADDING.top}
                  width={barW}
                  height={innerH}
                  rx={Math.min(6, barW / 2)}
                  fill="var(--pui-fg-muted)"
                  opacity={0.07}
                />
              )}

              {/* Data Bar */}
              <rect
                x={cx - barW / 2}
                y={Math.min(top, y0)}
                width={barW}
                height={h}
                rx={Math.min(6, barW / 2)}
                fill={`url(#${gradientId})`}
                opacity={!isAnyHovered || isHovered ? 1 : 0.42}
                style={{
                  transition: 'opacity 140ms ease, transform 140ms ease',
                  filter: isHovered ? `drop-shadow(0 4px 10px ${color}55)` : undefined,
                }}
              />

              {/* Top Accent Cap on Hover */}
              {isHovered && (
                <rect
                  x={cx - barW / 2}
                  y={Math.min(top, y0)}
                  width={barW}
                  height={3}
                  rx={1.5}
                  fill="#fff"
                  opacity={0.9}
                />
              )}

              <text
                className="pui-chart__axis-label"
                x={cx}
                y={height - 10}
                textAnchor="middle"
                style={{ fontWeight: isHovered ? 600 : 400 }}
              >
                {d.label}
              </text>

              <rect
                x={PADDING.left + slot * i}
                y={PADDING.top}
                width={slot}
                height={innerH}
                fill="transparent"
              />
            </g>
          );
        })}
      </svg>

      {hover !== null && (
        <div
          className="pui-chart__tip"
          style={{
            left: `${((PADDING.left + slot * hover + slot / 2) / width) * 100}%`,
            top: `${(scaleY(data[hover]!.value, min, max, innerH, PADDING.top) / height) * 100}%`,
          }}
        >
          <div className="pui-chart__tip-title">{data[hover]!.label}</div>
          <div className="pui-chart__tip-value">{format(data[hover]!.value)}</div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ Donut */

export interface DonutSlice {
  label: string;
  value: number;
  color?: string;
}

export interface DonutChartProps {
  data: DonutSlice[];
  size?: number;
  thickness?: number;
  centerLabel?: ReactNode;
  centerValue?: ReactNode;
  format?: (value: number) => string;
  className?: string;
  label?: string;
}

export function DonutChart({
  data,
  size = 220,
  thickness = 26,
  centerLabel,
  centerValue,
  format = (v) => v.toLocaleString(),
  className,
  label,
}: DonutChartProps) {
  const [hover, setHover] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className={cn('pui-donut pui-donut--empty', className)} style={{ width: size, height: size, display: 'grid', placeItems: 'center' }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--pui-fg-subtle)' }}>No data</span>
      </div>
    );
  }

  const total = data.reduce((sum, slice) => sum + slice.value, 0) || 1;
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;

  let offset = 0;
  const segments = data.map((slice, index) => {
    const fraction = slice.value / total;
    const length = fraction * circumference;
    const segment = {
      ...slice,
      index,
      length,
      offset,
      color: slice.color ?? `var(--pui-chart-${(index % 8) + 1})`,
    };
    offset += length;
    return segment;
  });

  return (
    <div className={cn('pui-donut', className)} role="img" aria-label={label ?? `Donut chart: ${data.map((d) => `${d.label} ${Math.round((d.value / total) * 100)}%`).join(', ')}`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--pui-bg-muted, rgba(128,128,128,0.12))" strokeWidth={thickness} />
          {segments.map((segment) => {
            const isHovered = hover === segment.index;
            return (
              <circle
                key={segment.label}
                className="pui-donut__seg"
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={segment.color}
                strokeWidth={isHovered ? thickness + 4 : thickness}
                strokeDasharray={`${Math.max(1, segment.length - 2)} ${circumference - Math.max(1, segment.length - 2)}`}
                strokeDashoffset={-segment.offset}
                strokeLinecap="round"
                onMouseEnter={() => setHover(segment.index)}
                onMouseLeave={() => setHover(null)}
                style={{
                  transition: 'stroke-width 160ms cubic-bezier(0.16, 1, 0.3, 1), opacity 160ms ease',
                  opacity: hover === null || isHovered ? 1 : 0.6,
                }}
              />
            );
          })}
        </g>
      </svg>
      <div className="pui-donut__center">
        <span className="pui-donut__value">
          {hover !== null ? format(data[hover]!.value) : centerValue}
        </span>
        <span className="pui-donut__label">
          {hover !== null ? data[hover]!.label : centerLabel}
        </span>
      </div>
    </div>
  );
}

export function ChartLegend({ items }: { items: DonutSlice[] }) {
  return (
    <div className="pui-chart__legend">
      {items.map((item, index) => (
        <span key={item.label} className="pui-chart__legend-item">
          <span className="pui-chart__swatch" style={{ background: item.color ?? `var(--pui-chart-${(index % 8) + 1})` }} />
          {item.label}
        </span>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ Sparkline */

export interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  /** Fill the area beneath the line. */
  filled?: boolean;
  className?: string;
}

export function Sparkline({
  data,
  width = 120,
  height = 36,
  color = 'var(--pui-primary)',
  filled = true,
  className,
}: SparklineProps) {
  if (!data || data.length === 0) {
    return <span className={cn('pui-sparkline--empty', className)} style={{ display: 'inline-block', width, height }} />;
  }

  const gradientId = useGradientId('spark');
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;

  const points = data.map((value, index) => {
    const px = (index / Math.max(1, data.length - 1)) * width;
    const py = height - ((value - min) / span) * (height - 4) - 2;
    return `${px.toFixed(1)},${py.toFixed(1)}`;
  });

  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      {filled && (
        <>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.28" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>
          <polygon points={`0,${height} ${points.join(' ')} ${width},${height}`} fill={`url(#${gradientId})`} />
        </>
      )}
      <polyline points={points.join(' ')} stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
