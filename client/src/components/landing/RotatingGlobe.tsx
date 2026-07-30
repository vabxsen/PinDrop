import { useMemo } from 'react';
import type { CSSProperties } from 'react';
import { useReducedMotion } from 'framer-motion';
import { WORLD_LAND_POLYGONS } from './worldPolygons';
import { cn } from '@/lib/cn';

const TILE_WIDTH = 1200;
const TILE_HEIGHT = 504; // TILE_WIDTH * (viewBox height 42 / viewBox width 100)
const MASK_Y_OFFSET = -60;

function useLandMaskUrl(): string {
  return useMemo(() => {
    const polygons = WORLD_LAND_POLYGONS.map(
      (poly) => `<polygon points="${poly.map(([x, y]) => `${x},${y}`).join(' ')}"/>`,
    ).join('');
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 42" fill="white">${polygons}</svg>`;
    return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
  }, []);
}

export function RotatingGlobe({ className }: { className?: string }) {
  const reduceMotion = useReducedMotion();
  const maskUrl = useLandMaskUrl();

  const maskStyle = {
    maskImage: maskUrl,
    WebkitMaskImage: maskUrl,
    maskRepeat: 'repeat-x',
    WebkitMaskRepeat: 'repeat-x',
    maskSize: `${TILE_WIDTH}px ${TILE_HEIGHT}px`,
    WebkitMaskSize: `${TILE_WIDTH}px ${TILE_HEIGHT}px`,
    maskPosition: `0px ${MASK_Y_OFFSET}px`,
    WebkitMaskPosition: `0px ${MASK_Y_OFFSET}px`,
  } as CSSProperties;

  return (
    <div aria-hidden="true" className={cn('relative h-[32rem] w-[32rem]', className)}>
      <div className="absolute inset-0 m-auto h-[26rem] w-[26rem] rounded-full bg-gradient-to-br from-brand-400/25 via-brand-500/10 to-transparent blur-3xl dark:from-brand-500/20 dark:via-brand-600/10" />

      <div className="absolute inset-0 m-auto h-[22rem] w-[22rem] overflow-hidden rounded-full">
        <div className="absolute inset-0 bg-brand-50 dark:bg-slate-900" />
        <div
          className={cn(
            'absolute inset-0 bg-brand-700 dark:bg-white',
            !reduceMotion && 'animate-spin-globe',
          )}
          style={maskStyle}
        />
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_32%_28%,rgba(255,255,255,0.85),rgba(129,114,255,0.25)_42%,transparent_72%)] dark:bg-[radial-gradient(circle_at_32%_28%,rgba(255,255,255,0.12),rgba(100,73,255,0.16)_42%,transparent_72%)]" />
        <div className="absolute inset-0 rounded-full mix-blend-multiply dark:mix-blend-normal bg-[radial-gradient(circle_at_74%_78%,rgba(8,5,25,0.55)_0%,rgba(8,5,25,0.3)_38%,transparent_66%)]" />
      </div>

      <div className="absolute inset-0 m-auto h-[22rem] w-[22rem] rounded-full ring-1 ring-inset ring-white/50 dark:ring-white/10" />
    </div>
  );
}
