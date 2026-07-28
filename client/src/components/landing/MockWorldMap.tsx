import { motion, useReducedMotion } from 'framer-motion';
import { WORLD_DOTS } from './worldDots';
import type { MockVisitor } from './mockData';
import { viewportOnce } from './motion';

function project(lat: number, lng: number): [number, number] {
  const x = ((lng + 180) / 360) * 100;
  const y = ((90 - lat) / 180) * 50;
  return [x, y];
}

interface MockWorldMapProps {
  visitors: MockVisitor[];
  showPopup?: boolean;
  className?: string;
}

export function MockWorldMap({ visitors, showPopup = true, className }: MockWorldMapProps) {
  const reduceMotion = useReducedMotion();
  const primary = visitors[0];

  return (
    <div className={className}>
      <div className="relative h-full w-full overflow-hidden rounded-xl bg-slate-50 dark:bg-slate-950/60">
        <motion.svg
          viewBox="0 0 100 50"
          className="h-full w-full text-slate-300 dark:text-slate-700"
          preserveAspectRatio="xMidYMid meet"
          animate={reduceMotion ? undefined : { scale: [1, 1.04, 1] }}
          transition={reduceMotion ? undefined : { duration: 24, repeat: Infinity, ease: 'linear' }}
        >
          {WORLD_DOTS.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={0.45} fill="currentColor" />
          ))}
        </motion.svg>

        <svg viewBox="0 0 100 50" className="pointer-events-none absolute inset-0 h-full w-full">
          {visitors.map((visitor, i) => {
            const [x, y] = project(visitor.lat, visitor.lng);
            if (visitor.status !== 'granted') return null;
            return (
              <g key={visitor.id}>
                {!reduceMotion && (
                  <motion.circle
                    cx={x}
                    cy={y}
                    r={1.4}
                    fill="#5330f0"
                    initial={{ opacity: 0.5, scale: 1 }}
                    animate={{ opacity: [0.5, 0], scale: [1, 2.6] }}
                    transition={{
                      duration: 2.2,
                      repeat: Infinity,
                      ease: 'easeOut',
                      delay: i * 0.3,
                    }}
                    style={{ transformOrigin: `${x}px ${y}px` }}
                  />
                )}
                <motion.circle
                  cx={x}
                  cy={y}
                  r={1.2}
                  fill="#5330f0"
                  stroke="#ffffff"
                  strokeWidth={0.5}
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={viewportOnce}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.15 }}
                />
              </g>
            );
          })}
        </svg>

        {showPopup && primary && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.4, delay: 0.6 }}
            className="absolute rounded-lg border border-slate-200 bg-white/95 px-3 py-2 shadow-lg backdrop-blur dark:border-slate-700 dark:bg-slate-900/95"
            style={{
              left: `${project(primary.lat, primary.lng)[0]}%`,
              top: `${project(primary.lat, primary.lng)[1]}%`,
              transform: 'translate(-50%, -140%)',
            }}
          >
            <p className="whitespace-nowrap text-xs font-semibold text-slate-900 dark:text-slate-100">
              {primary.city}, {primary.country}
            </p>
            <p className="whitespace-nowrap text-[11px] text-slate-500 dark:text-slate-400">
              {primary.lat.toFixed(4)}°, {primary.lng.toFixed(4)}°
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
