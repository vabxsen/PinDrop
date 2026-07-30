import { useMemo } from 'react';
import { useReducedMotion } from 'framer-motion';
import { WORLD_LATLNG } from './worldDots';
import { cn } from '@/lib/cn';

const RADIUS = 300;
const SHADING_SIZE = '40rem';
const GLOW_SIZE = '54rem';

interface GlobeDot {
  x: number;
  y: number;
  z: number;
  size: number;
  opacity: number;
}

function useGlobeDots(): GlobeDot[] {
  return useMemo(
    () =>
      WORLD_LATLNG.map(([lat, lng]) => {
        const phi = (lat * Math.PI) / 180;
        const theta = (lng * Math.PI) / 180;
        const x = RADIUS * Math.cos(phi) * Math.sin(theta);
        const y = -RADIUS * Math.sin(phi);
        const z = RADIUS * Math.cos(phi) * Math.cos(theta);
        const depth = (z + RADIUS) / (2 * RADIUS);
        return { x, y, z, size: 2.5 + depth * 3, opacity: 0.35 + depth * 0.65 };
      }),
    [],
  );
}

interface Star {
  top: string;
  left: string;
  size: number;
  opacity: number;
}

// Deterministic pseudo-random in [0, 1), seeded by index -- keeps the star
// field stable across re-renders without relying on an impure Math.random().
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

function useStars(count: number): Star[] {
  return useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const a = seededRandom(i * 4 + 1);
        const b = seededRandom(i * 4 + 2);
        const c = seededRandom(i * 4 + 3);
        const d = seededRandom(i * 4 + 4);
        return {
          top: `${a * 100}%`,
          left: `${b * 100}%`,
          size: c < 0.85 ? 1 : 1.5 + d,
          opacity: 0.2 + d * 0.6,
        };
      }),
    [count],
  );
}

export function RotatingGlobe({ className }: { className?: string }) {
  const reduceMotion = useReducedMotion();
  const dots = useGlobeDots();
  const stars = useStars(110);

  return (
    <div aria-hidden="true" className={cn('relative h-full w-full overflow-hidden', className)}>
      {stars.map((star, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-slate-400/70 dark:bg-white"
          style={{
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
            opacity: star.opacity,
          }}
        />
      ))}

      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ perspective: '1600px' }}
      >
        {/* outer atmosphere glow, brand purple blended with the app's cyan accent */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
          style={{
            width: GLOW_SIZE,
            height: GLOW_SIZE,
            background:
              'radial-gradient(circle at 34% 30%, rgba(34,211,238,0.16), rgba(129,114,255,0.16) 45%, transparent 72%)',
          }}
        />

        {/* lit hemisphere shading */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: SHADING_SIZE,
            height: SHADING_SIZE,
            background:
              'radial-gradient(circle at 32% 28%, rgba(255,255,255,0.98) 0%, rgba(198,190,255,0.75) 22%, rgba(129,114,255,0.5) 42%, rgba(83,48,240,0.32) 62%, rgba(45,24,138,0.28) 78%, rgba(15,10,46,0.22) 92%)',
          }}
        />

        {/* night-side terminator shadow */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full mix-blend-multiply dark:mix-blend-normal"
          style={{
            width: SHADING_SIZE,
            height: SHADING_SIZE,
            background:
              'radial-gradient(circle at 74% 78%, rgba(8,5,25,0.85) 0%, rgba(8,5,25,0.55) 35%, transparent 65%)',
          }}
        />

        <div
          className={cn('absolute left-1/2 top-1/2', !reduceMotion && 'animate-spin-globe')}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {dots.map((dot, i) => (
            <span
              key={i}
              className="absolute rounded-full bg-brand-700 dark:bg-white"
              style={{
                width: dot.size,
                height: dot.size,
                opacity: dot.opacity,
                transform: `translate3d(${dot.x}px, ${dot.y}px, ${dot.z}px) translate(-50%, -50%)`,
              }}
            />
          ))}
        </div>

        {/* fresnel-style atmosphere rim */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: SHADING_SIZE,
            height: SHADING_SIZE,
            boxShadow:
              'inset 0 0 0 1px rgba(255,255,255,0.35), inset -18px -18px 60px rgba(34,211,238,0.35), inset 14px 14px 50px rgba(255,255,255,0.4)',
          }}
        />
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: `calc(${SHADING_SIZE} + 6px)`,
            height: `calc(${SHADING_SIZE} + 6px)`,
            boxShadow: '0 0 40px 6px rgba(34,211,238,0.25)',
          }}
        />
      </div>
    </div>
  );
}
