import React, { useEffect, useRef, useCallback, type CanvasHTMLAttributes } from 'react';
import { Portal } from './Portal';

export interface ConfettiOrigin {
  /** Normalized x coordinate from 0 (left) to 1 (right). Defaults to 0.5 (center). */
  x?: number;
  /** Normalized y coordinate from 0 (top) to 1 (bottom). Defaults to 0.6. */
  y?: number;
}

export interface ConfettiOptions {
  /** Total number of confetti particles to emit. Defaults to 75. */
  particleCount?: number;
  /** Cone angle spread in degrees. Defaults to 65. */
  spread?: number;
  /** Launch speed velocity. Defaults to 35. */
  startVelocity?: number;
  /** Particle air drag decay rate. Defaults to 0.92. */
  decay?: number;
  /** Downward gravity acceleration multiplier. Defaults to 1. */
  gravity?: number;
  /** Launch angle in degrees (90 = straight up). Defaults to 90. */
  angle?: number;
  /** Palette of hex/hsl colors. Defaults to curated rainbow palette. */
  colors?: string[];
  /** Launch origin coordinate. */
  origin?: ConfettiOrigin;
  /** Callback fired after all particles have settled and faded out. */
  onComplete?: () => void;
}

export interface ConfettiProps extends CanvasHTMLAttributes<HTMLCanvasElement>, ConfettiOptions {
  /** When true or changes to true, fires a confetti celebration blast. */
  active?: boolean;
}

const DEFAULT_COLORS = [
  '#6366f1', // Indigo
  '#ec4899', // Pink
  '#3b82f6', // Blue
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#8b5cf6', // Violet
  '#06b6d4', // Cyan
];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  rotation: number;
  vRot: number;
  opacity: number;
  shape: 'rect' | 'circle' | 'strip';
}

/**
 * Imperative confetti fire function that appends a temporary canvas to the document body.
 */
export function fireConfetti(options: ConfettiOptions = {}) {
  if (typeof window === 'undefined') return;

  const {
    particleCount = 80,
    spread = 70,
    startVelocity = 40,
    decay = 0.92,
    gravity = 1,
    angle = 90,
    colors = DEFAULT_COLORS,
    origin = { x: 0.5, y: 0.6 },
    onComplete,
  } = options;

  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.inset = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '99999';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    document.body.removeChild(canvas);
    return;
  }

  const dpr = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  ctx.scale(dpr, dpr);

  const startX = (origin.x ?? 0.5) * window.innerWidth;
  const startY = (origin.y ?? 0.6) * window.innerHeight;

  const particles: Particle[] = [];
  const radAngle = (angle * Math.PI) / 180;
  const radSpread = (spread * Math.PI) / 180;

  for (let i = 0; i < particleCount; i++) {
    const pAngle = radAngle + (Math.random() - 0.5) * radSpread;
    const velocity = startVelocity * (0.6 + Math.random() * 0.8);
    const shapes: ('rect' | 'circle' | 'strip')[] = ['rect', 'circle', 'strip'];

    particles.push({
      x: startX,
      y: startY,
      vx: Math.cos(pAngle) * velocity,
      vy: -Math.sin(pAngle) * velocity,
      color: colors[Math.floor(Math.random() * colors.length)] ?? '#6366f1',
      size: Math.random() * 6 + 5,
      rotation: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 12,
      opacity: 1,
      shape: shapes[Math.floor(Math.random() * shapes.length)] ?? 'rect',
    });
  }

  let animId: number;

  function render() {
    if (!ctx) return;
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    let activeCount = 0;

    for (const p of particles) {
      if (p.opacity <= 0.01) continue;
      activeCount++;

      p.x += p.vx;
      p.y += p.vy;
      p.vx *= decay;
      p.vy = p.vy * decay + gravity * 0.45;
      p.rotation += p.vRot;
      p.opacity -= 0.009;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.globalAlpha = Math.max(0, p.opacity);
      ctx.fillStyle = p.color;

      if (p.shape === 'circle') {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.shape === 'strip') {
        ctx.fillRect(-p.size / 4, -p.size, p.size / 2, p.size * 2);
      } else {
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      }

      ctx.restore();
    }

    if (activeCount > 0) {
      animId = requestAnimationFrame(render);
    } else {
      cancelAnimationFrame(animId);
      if (document.body.contains(canvas)) {
        document.body.removeChild(canvas);
      }
      onComplete?.();
    }
  }

  animId = requestAnimationFrame(render);
}

/**
 * Declarative Confetti component. Fires when `active` transitions to true.
 */
export function Confetti({
  active = false,
  particleCount = 80,
  spread = 70,
  startVelocity = 40,
  decay = 0.92,
  gravity = 1,
  angle = 90,
  colors = DEFAULT_COLORS,
  origin = { x: 0.5, y: 0.6 },
  onComplete,
  style,
  ...rest
}: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number | null>(null);

  const blast = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.scale(dpr, dpr);

    const startX = (origin.x ?? 0.5) * window.innerWidth;
    const startY = (origin.y ?? 0.6) * window.innerHeight;

    const particles: Particle[] = [];
    const radAngle = (angle * Math.PI) / 180;
    const radSpread = (spread * Math.PI) / 180;

    for (let i = 0; i < particleCount; i++) {
      const pAngle = radAngle + (Math.random() - 0.5) * radSpread;
      const velocity = startVelocity * (0.6 + Math.random() * 0.8);
      const shapes: ('rect' | 'circle' | 'strip')[] = ['rect', 'circle', 'strip'];

      particles.push({
        x: startX,
        y: startY,
        vx: Math.cos(pAngle) * velocity,
        vy: -Math.sin(pAngle) * velocity,
        color: colors[Math.floor(Math.random() * colors.length)] ?? '#6366f1',
        size: Math.random() * 6 + 5,
        rotation: Math.random() * 360,
        vRot: (Math.random() - 0.5) * 12,
        opacity: 1,
        shape: shapes[Math.floor(Math.random() * shapes.length)] ?? 'rect',
      });
    }

    function render() {
      if (!ctx) return;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      let activeCount = 0;
      for (const p of particles) {
        if (p.opacity <= 0.01) continue;
        activeCount++;

        p.x += p.vx;
        p.y += p.vy;
        p.vx *= decay;
        p.vy = p.vy * decay + gravity * 0.45;
        p.rotation += p.vRot;
        p.opacity -= 0.009;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.fillStyle = p.color;

        if (p.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.shape === 'strip') {
          ctx.fillRect(-p.size / 4, -p.size, p.size / 2, p.size * 2);
        } else {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        }

        ctx.restore();
      }

      if (activeCount > 0) {
        animRef.current = requestAnimationFrame(render);
      } else {
        if (animRef.current) cancelAnimationFrame(animRef.current);
        onComplete?.();
      }
    }

    animRef.current = requestAnimationFrame(render);
  }, [particleCount, spread, startVelocity, decay, gravity, angle, colors, origin, onComplete]);

  useEffect(() => {
    if (active) {
      blast();
    }
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [active, blast]);

  return (
    <Portal>
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          inset: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          zIndex: 99999,
          ...style,
        }}
        {...rest}
      />
    </Portal>
  );
}
