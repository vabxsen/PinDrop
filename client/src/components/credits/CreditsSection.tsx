import { motion, useReducedMotion } from 'framer-motion';
import { BuiltByCard } from './BuiltByCard';
import { TechStackGrid } from './TechStackGrid';
import { OpenSourceCard } from './OpenSourceCard';
import { GitHubCard } from './GitHubCard';
import { EASE_OUT_EXPO, fadeUpVariants, staggerContainer } from './motion';

export function CreditsSection() {
  const reduceMotion = useReducedMotion() ?? false;

  return (
    <section
      aria-labelledby="credits-heading"
      className="relative w-full overflow-hidden rounded-[28px] border border-slate-200 bg-white px-6 py-20 sm:px-10 sm:py-28 dark:border-transparent dark:bg-[#020202]"
    >
      <motion.div
        variants={staggerContainer(0.12)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        className="mx-auto flex min-h-[78vh] w-full max-w-3xl flex-col items-center justify-center gap-14 text-center sm:gap-16"
      >
        <motion.h2
          id="credits-heading"
          initial={reduceMotion ? false : { opacity: 0, y: 16, filter: 'blur(8px)' }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
          className="text-xs font-medium uppercase tracking-[0.35em] text-slate-500 dark:text-neutral-500"
        >
          Credits
        </motion.h2>

        <BuiltByCard />
        <TechStackGrid />
        <OpenSourceCard />
        <GitHubCard />

        <motion.div variants={fadeUpVariants(reduceMotion, 10)} className="flex flex-col items-center gap-4 pt-4">
          <p className="text-xs text-slate-500 dark:text-neutral-600">
            <span aria-hidden="true">🇮🇳</span> Made in India
          </p>
          <p className="text-[11px] text-slate-400 dark:text-neutral-700">
            &copy; {new Date().getFullYear()} PinDrop. All rights reserved.
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
