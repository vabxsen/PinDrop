import { motion, useReducedMotion } from 'framer-motion';
import { fadeUpVariants } from './motion';

export function BuiltByCard() {
  const reduceMotion = useReducedMotion() ?? false;

  return (
    <motion.div
      variants={fadeUpVariants(reduceMotion)}
      whileHover={reduceMotion ? undefined : { y: -3 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="w-full max-w-md rounded-[24px] border border-white/10 bg-white/[0.03] px-8 py-10 text-center shadow-[0_1px_0_0_rgba(255,255,255,0.04)_inset] backdrop-blur-xl transition-shadow duration-300 hover:border-white/15 hover:shadow-[0_20px_60px_-30px_rgba(0,0,0,0.8)]"
    >
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">
        Built &amp; Designed by
      </p>
      <p className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
        Vaibhav Sen
      </p>
      <p className="mt-3 text-sm text-neutral-500">
        Crafted with precision and privacy in mind.
      </p>
    </motion.div>
  );
}
