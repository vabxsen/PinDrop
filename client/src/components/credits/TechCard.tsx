import type { ComponentType } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { EASE_SMOOTH, fadeUpVariants } from './motion';

interface TechCardProps {
  name: string;
  description: string;
  Logo: ComponentType<{ className?: string }>;
  /** Slow ambient icon motion: 'float' or 'rotate'. Skipped entirely under reduced motion. */
  motionStyle: 'float' | 'rotate';
  /** Staggers the ambient motion so cards don't all move in lockstep. */
  motionDelay: number;
}

export function TechCard({ name, description, Logo, motionStyle, motionDelay }: TechCardProps) {
  const reduceMotion = useReducedMotion() ?? false;

  const ambientAnimate = reduceMotion
    ? undefined
    : motionStyle === 'float'
      ? { y: [0, -3, 0] }
      : { rotate: [0, 1.6, 0, -1.6, 0] };

  return (
    <motion.div
      variants={fadeUpVariants(reduceMotion, 16)}
      whileHover={reduceMotion ? undefined : { y: -4, scale: 1.03 }}
      transition={{ duration: 0.28, ease: EASE_SMOOTH }}
      className="group flex flex-col items-center gap-3 rounded-[20px] border border-slate-200 bg-slate-50 px-5 py-7 text-center transition-[border-color,box-shadow] duration-300 hover:border-slate-300 hover:shadow-[0_16px_40px_-24px_rgba(0,0,0,0.25)] dark:border-white/10 dark:bg-white/[0.025] dark:backdrop-blur-xl dark:hover:border-white/20 dark:hover:shadow-[0_16px_40px_-24px_rgba(0,0,0,0.9)]"
    >
      <motion.div
        animate={ambientAnimate}
        transition={
          ambientAnimate
            ? { duration: 5 + motionDelay, repeat: Infinity, ease: 'easeInOut', delay: motionDelay }
            : undefined
        }
        className="flex h-10 w-10 items-center justify-center text-slate-500 transition-colors duration-300 group-hover:text-slate-900 dark:text-neutral-300 dark:group-hover:text-white"
      >
        <Logo className="h-6 w-6" />
      </motion.div>
      <div>
        <p className="text-sm font-medium text-slate-900 dark:text-white">{name}</p>
        <p className="mt-0.5 text-xs text-slate-500 dark:text-neutral-500">{description}</p>
      </div>
    </motion.div>
  );
}
