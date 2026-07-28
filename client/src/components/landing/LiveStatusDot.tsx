import { motion, useReducedMotion } from 'framer-motion';

export function LiveStatusDot({ label = 'Live' }: { label?: string }) {
  const reduceMotion = useReducedMotion();

  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="relative flex h-2 w-2">
        {!reduceMotion && (
          <motion.span
            className="absolute inset-0 rounded-full bg-emerald-500"
            animate={{ scale: [1, 2.2], opacity: [0.6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
          />
        )}
        <span className="relative h-2 w-2 rounded-full bg-emerald-500" />
      </span>
      <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">{label}</span>
    </span>
  );
}
