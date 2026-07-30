import { useMemo } from 'react';
import { useReducedMotion } from 'framer-motion';
import { WORLD_LATLNG } from './worldDots';
import { cn } from '@/lib/cn';

const RADIUS = 168;
const NEIGHBORS_PER_POINT = 2;
const MAX_SEGMENT_LENGTH = 42;

interface Vec3 {
  x: number;
  y: number;
  z: number;
}

function toSphere([lat, lng]: [number, number]): Vec3 {
  const phi = (lat * Math.PI) / 180;
  const theta = (lng * Math.PI) / 180;
  return {
    x: RADIUS * Math.cos(phi) * Math.sin(theta),
    y: -RADIUS * Math.sin(phi),
    z: RADIUS * Math.cos(phi) * Math.cos(theta),
  };
}

function distance(a: Vec3, b: Vec3): number {
  return Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
}

interface GlobeSegment {
  length: number;
  opacity: number;
  transform: string;
}

// Builds a CSS matrix3d that stretches a horizontal div (its own width used
// as line length) so it spans exactly from p1 to p2 in 3D space, rotating
// along with the sphere via the shared preserve-3d ancestor.
function segmentTransform(p1: Vec3, p2: Vec3): string {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const dz = p2.z - p1.z;
  const length = Math.hypot(dx, dy, dz) || 0.001;
  const ux = dx / length;
  const uy = dy / length;
  const uz = dz / length;

  const upHint = Math.abs(uy) > 0.95 ? { x: 1, y: 0, z: 0 } : { x: 0, y: 1, z: 0 };
  let vx = upHint.y * uz - upHint.z * uy;
  let vy = upHint.z * ux - upHint.x * uz;
  let vz = upHint.x * uy - upHint.y * ux;
  const vLen = Math.hypot(vx, vy, vz) || 0.001;
  vx /= vLen;
  vy /= vLen;
  vz /= vLen;

  const wx = uy * vz - uz * vy;
  const wy = uz * vx - ux * vz;
  const wz = ux * vy - uy * vx;

  const mx = (p1.x + p2.x) / 2;
  const my = (p1.y + p2.y) / 2;
  const mz = (p1.z + p2.z) / 2;

  const m = [ux, uy, uz, 0, vx, vy, vz, 0, wx, wy, wz, 0, mx, my, mz, 1];
  return `matrix3d(${m.join(',')})`;
}

function useGlobeSegments(): GlobeSegment[] {
  return useMemo(() => {
    const points = WORLD_LATLNG.map(toSphere);
    const seen = new Set<string>();
    const segments: GlobeSegment[] = [];

    points.forEach((p, i) => {
      const nearest = points
        .map((q, j) => ({ j, d: i === j ? Infinity : distance(p, q) }))
        .sort((a, b) => a.d - b.d)
        .slice(0, NEIGHBORS_PER_POINT);

      nearest.forEach(({ j, d }) => {
        if (d > MAX_SEGMENT_LENGTH) return;
        const key = i < j ? `${i}:${j}` : `${j}:${i}`;
        if (seen.has(key)) return;
        seen.add(key);

        const q = points[j];
        if (!q) return;
        const depth = ((p.z + q.z) / 2 + RADIUS) / (2 * RADIUS);
        segments.push({
          length: d,
          opacity: 0.35 + depth * 0.65,
          transform: segmentTransform(p, q),
        });
      });
    });

    return segments;
  }, []);
}

export function RotatingGlobe({ className }: { className?: string }) {
  const reduceMotion = useReducedMotion();
  const segments = useGlobeSegments();

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
        {segments.map((segment, i) => (
          <span
            key={i}
            className="absolute left-0 top-0 rounded-full bg-brand-700 dark:bg-white"
            style={{
              width: segment.length,
              height: 1.75,
              opacity: segment.opacity,
              transform: segment.transform,
            }}
          />
        ))}
      </div>

      <div className="absolute inset-0 m-auto h-[22rem] w-[22rem] rounded-full ring-1 ring-inset ring-white/50 dark:ring-white/10" />
    </div>
  );
}
