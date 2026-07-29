import type { Variants } from 'framer-motion';

// A restrained "expensive" ease-out — fast start, long soft settle. Used for
// every scroll-reveal in this section instead of the default framer easing,
// which reads as slightly bouncy/cheap at these durations.
export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

// For hover/tap micro-interactions: symmetrical, no overshoot.
export const EASE_SMOOTH = [0.4, 0, 0.2, 1] as const;

export function fadeUpVariants(reduceMotion: boolean, distance = 20): Variants {
  return {
    hidden: { opacity: 0, y: reduceMotion ? 0 : distance },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reduceMotion ? 0.01 : 0.7, ease: EASE_OUT_EXPO },
    },
  };
}

export function staggerContainer(staggerChildren = 0.09, delayChildren = 0): Variants {
  return {
    hidden: {},
    visible: { transition: { staggerChildren, delayChildren } },
  };
}
