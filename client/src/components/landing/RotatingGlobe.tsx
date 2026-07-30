import { useMemo } from 'react';
import { useReducedMotion } from 'framer-motion';
import { WORLD_LATLNG } from './worldDots';
import { cn } from '@/lib/cn';

const RADIUS = 168;

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
        return { x, y, z, size: 7 + depth * 5, opacity: 0.55 + depth * 0.45 };
      }),
    [],
  );
}

export function RotatingGlobe({ className }: { className?: string }) {
  const reduceMotion = useReducedMotion();
  const dots = useGlobeDots();

  return (
    <div
      aria-hidden="true"
      className={cn('relative h-[32rem] w-[32rem]', className)}
      style={{ perspective: '1400px' }}
    >
      <div className="absolute inset-0 m-auto h-[26rem] w-[26rem] rounded-full bg-gradient-to-br from-brand-400/25 via-brand-500/10 to-transparent blur-3xl dark:from-brand-500/20 dark:via-brand-600/10" />

      <div className="absolute inset-0 m-auto h-[22rem] w-[22rem] rounded-full bg-[radial-gradient(circle_at_32%_28%,rgba(255,255,255,0.95),rgba(129,114,255,0.3)_42%,rgba(83,48,240,0.12)_72%,transparent_76%)] dark:bg-[radial-gradient(circle_at_32%_28%,rgba(255,255,255,0.16),rgba(100,73,255,0.22)_42%,rgba(83,48,240,0.12)_72%,transparent_76%)]" />

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

      <div className="absolute inset-0 m-auto h-[22rem] w-[22rem] rounded-full ring-1 ring-inset ring-white/50 dark:ring-white/10" />
    </div>
  );
}
