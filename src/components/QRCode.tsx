import React, { forwardRef, useMemo, useState, type HTMLAttributes } from 'react';
import { cn } from '../utils/cn';

export type QRCodeErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

export interface QRCodeProps extends HTMLAttributes<HTMLDivElement> {
  /** The value (URL, text, token, or 2FA string) to encode in the QR code. */
  value: string;
  /** Dimension size in pixels (width and height). Defaults to 160. */
  size?: number;
  /** Foreground module color. Defaults to 'currentColor'. */
  fgColor?: string;
  /** Background fill color. Defaults to transparent or white. */
  bgColor?: string;
  /** Whether to render a card container border with padding. */
  bordered?: boolean;
  /** Optional URL of an icon or logo to display centered in the QR code. */
  logoUrl?: string;
  /** Size of the center logo in pixels. Defaults to size * 0.22. */
  logoSize?: number;
  /** Accessible title for screen readers. */
  title?: string;
}

/* ------------------------------------------------------------------ QR Engine */

const EXP = new Uint8Array(512);
const LOG = new Uint8Array(256);
for (let i = 0, x = 1; i < 255; i++) {
  EXP[i] = x;
  EXP[i + 255] = x;
  LOG[x] = i;
  x = (x << 1) ^ (x >= 128 ? 0x11d : 0);
}

function gfMul(x: number, y: number): number {
  return x === 0 || y === 0 ? 0 : EXP[LOG[x]! + LOG[y]!]!;
}

function rsGenPoly(n: number): number[] {
  let poly = [1];
  for (let i = 0; i < n; i++) {
    const next = new Array(poly.length + 1).fill(0);
    for (let j = 0; j < poly.length; j++) {
      next[j] ^= gfMul(poly[j]!, EXP[i]!);
      next[j + 1] ^= poly[j]!;
    }
    poly = next;
  }
  return poly;
}

function rsEncode(data: Uint8Array, nEc: number): Uint8Array {
  const gen = rsGenPoly(nEc);
  const res = new Uint8Array(data.length + nEc);
  res.set(data);
  for (let i = 0; i < data.length; i++) {
    const coef = res[i]!;
    if (coef !== 0) {
      for (let j = 0; j < gen.length; j++) {
        const idx = i + j;
        res[idx] = (res[idx] ?? 0) ^ gfMul(gen[j]!, coef);
      }
    }
  }
  return res.subarray(data.length);
}

function generateQrMatrix(text: string): (number | null)[][] {
  const bytes = new TextEncoder().encode(text || ' ');
  let ver = 1;
  if (bytes.length > 14) ver = 2;
  if (bytes.length > 26) ver = 3;
  if (bytes.length > 42) ver = 4;
  if (bytes.length > 62) ver = 5;

  const size = 17 + 4 * ver;
  const matrix: (number | null)[][] = Array.from({ length: size }, () => new Array(size).fill(null));
  const isFunction: boolean[][] = Array.from({ length: size }, () => new Array(size).fill(false));

  function setModule(r: number, c: number, val: number) {
    matrix[r]![c] = val;
    isFunction[r]![c] = true;
  }

  function addFinder(top: number, left: number) {
    for (let r = -1; r <= 7; r++) {
      for (let c = -1; c <= 7; c++) {
        const nr = top + r;
        const nc = left + c;
        if (nr >= 0 && nr < size && nc >= 0 && nc < size) {
          if (r === -1 || r === 7 || c === -1 || c === 7) {
            setModule(nr, nc, 0);
          } else if (r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4)) {
            setModule(nr, nc, 1);
          } else {
            setModule(nr, nc, 0);
          }
        }
      }
    }
  }

  addFinder(0, 0);
  addFinder(0, size - 7);
  addFinder(size - 7, 0);

  // Timing patterns
  for (let i = 8; i < size - 8; i++) {
    if (!isFunction[6]![i]) setModule(6, i, i % 2 === 0 ? 1 : 0);
    if (!isFunction[i]![6]) setModule(i, 6, i % 2 === 0 ? 1 : 0);
  }

  // Dark module
  setModule(4 * ver + 9, 8, 1);

  // Alignment patterns
  const alignPos: number[] | undefined = ({
    2: [6, 18],
    3: [6, 22],
    4: [6, 26],
    5: [6, 30],
  } as Record<number, number[]>)[ver];

  if (alignPos) {
    for (const r of alignPos) {
      for (const c of alignPos) {
        if (!isFunction[r]![c]) {
          for (let dr = -2; dr <= 2; dr++) {
            for (let dc = -2; dc <= 2; dc++) {
              const val = Math.max(Math.abs(dr), Math.abs(dc)) === 1 ? 0 : 1;
              setModule(r + dr, c + dc, val);
            }
          }
        }
      }
    }
  }

  // Reserve format area
  for (let i = 0; i < 9; i++) {
    if (!isFunction[8]![i]) isFunction[8]![i] = true;
    if (!isFunction[i]![8]) isFunction[i]![8] = true;
  }
  for (let i = size - 8; i < size; i++) {
    if (!isFunction[8]![i]) isFunction[8]![i] = true;
    if (!isFunction[i]![8]) isFunction[i]![8] = true;
  }

  const bits: number[] = [];
  function pushBits(val: number, len: number) {
    for (let i = len - 1; i >= 0; i--) {
      bits.push((val >> i) & 1);
    }
  }

  pushBits(4, 4);
  pushBits(bytes.length, 8);
  for (const b of bytes) pushBits(b, 8);
  pushBits(0, 4);

  while (bits.length % 8 !== 0) bits.push(0);

  const dataBytes: number[] = [];
  for (let i = 0; i < bits.length; i += 8) {
    let byte = 0;
    for (let j = 0; j < 8; j++) byte = (byte << 1) | bits[i + j]!;
    dataBytes.push(byte);
  }

  const cap = ({ 1: 16, 2: 28, 3: 44, 4: 64, 5: 86 } as Record<number, number>)[ver] || 16;
  const padPatterns = [0xec, 0x11];
  let pIdx = 0;
  while (dataBytes.length < cap) {
    dataBytes.push(padPatterns[pIdx % 2]!);
    pIdx++;
  }

  const ecLen = ({ 1: 10, 2: 16, 3: 26, 4: 36, 5: 48 } as Record<number, number>)[ver] || 10;
  const ecBytes = rsEncode(new Uint8Array(dataBytes), ecLen);

  const allBytes = [...dataBytes, ...ecBytes];
  const allBits: number[] = [];
  for (const b of allBytes) {
    for (let i = 7; i >= 0; i--) allBits.push((b >> i) & 1);
  }

  let bitIdx = 0;
  let dir = -1;
  let r = size - 1;
  let c = size - 1;

  while (c > 0) {
    if (c === 6) c--;
    for (let step = 0; step < size; step++) {
      const curR = r;
      for (const col of [c, c - 1]) {
        if (!isFunction[curR]![col]) {
          const bit = bitIdx < allBits.length ? allBits[bitIdx++]! : 0;
          const mask = (curR + col) % 2 === 0 ? 1 : 0;
          matrix[curR]![col] = bit ^ mask;
        }
      }
      r += dir;
      if (r < 0 || r >= size) {
        dir = -dir;
        r += dir;
        break;
      }
    }
    c -= 2;
  }

  const formatBits = [1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0];
  const posTopLeft: [number, number][] = [
    [8, 0], [8, 1], [8, 2], [8, 3], [8, 4], [8, 5], [8, 7], [8, 8],
    [7, 8], [5, 8], [4, 8], [3, 8], [2, 8], [1, 8], [0, 8],
  ];
  for (let i = 0; i < 15; i++) {
    const [fr, fc] = posTopLeft[i]!;
    matrix[fr]![fc] = formatBits[i]!;
  }

  const posSplit: [number, number][] = [
    [size - 1, 8], [size - 2, 8], [size - 3, 8], [size - 4, 8], [size - 5, 8], [size - 6, 8], [size - 7, 8],
    [8, size - 8], [8, size - 7], [8, size - 6], [8, size - 5], [8, size - 4], [8, size - 3], [8, size - 2], [8, size - 1],
  ];
  for (let i = 0; i < 15; i++) {
    const [fr, fc] = posSplit[i]!;
    matrix[fr]![fc] = formatBits[i]!;
  }

  return matrix;
}

export const QRCode = forwardRef<HTMLDivElement, QRCodeProps>(function QRCode(
  {
    value,
    size = 160,
    fgColor = 'currentColor',
    bgColor = 'transparent',
    bordered = true,
    logoUrl,
    logoSize,
    title = 'Scan QR code',
    className,
    style,
    ...rest
  },
  ref
) {
  const matrix = useMemo(() => generateQrMatrix(value), [value]);
  const matrixSize = matrix.length;
  const computedLogoSize = logoSize ?? Math.round(size * 0.22);

  // Build SVG path
  const pathD = useMemo(() => {
    let d = '';
    for (let r = 0; r < matrixSize; r++) {
      for (let c = 0; c < matrixSize; c++) {
        if (matrix[r]?.[c] === 1) {
          d += `M${c},${r}h1v1h-1z `;
        }
      }
    }
    return d;
  }, [matrix, matrixSize]);

  return (
    <div
      ref={ref}
      className={cn(
        'pui-qr-code',
        bordered && 'pui-qr-code--bordered',
        className
      )}
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: bordered ? '0.75rem' : 0,
        borderRadius: bordered ? 'var(--pui-radius-lg, 10px)' : undefined,
        background: bordered ? 'var(--pui-surface, #ffffff)' : undefined,
        border: bordered ? '1px solid var(--pui-border, rgba(0,0,0,0.1))' : undefined,
        boxShadow: bordered ? 'var(--pui-shadow-sm, 0 1px 2px rgba(0,0,0,0.05))' : undefined,
        position: 'relative',
        ...style,
      }}
      role="img"
      aria-label={title}
      {...rest}
    >
      <svg
        viewBox={`0 0 ${matrixSize} ${matrixSize}`}
        width={size}
        height={size}
        shapeRendering="crispEdges"
        style={{ display: 'block' }}
      >
        {bgColor !== 'transparent' && (
          <rect width={matrixSize} height={matrixSize} fill={bgColor} />
        )}
        <path d={pathD} fill={fgColor} />
      </svg>

      {logoUrl && (
        <div
          style={{
            position: 'absolute',
            width: computedLogoSize,
            height: computedLogoSize,
            background: 'var(--pui-surface, #ffffff)',
            borderRadius: 'var(--pui-radius-md, 6px)',
            boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            padding: 3,
          }}
        >
          <img
            src={logoUrl}
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>
      )}
    </div>
  );
});
