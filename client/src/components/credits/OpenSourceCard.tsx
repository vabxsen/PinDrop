import { PackageOpen } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { fadeUpVariants } from './motion';

export function OpenSourceCard() {
  const reduceMotion = useReducedMotion() ?? false;

  return (
    <motion.div
      variants={fadeUpVariants(reduceMotion)}
      className="w-full max-w-2xl rounded-[24px] border border-slate-200 bg-slate-50 px-8 py-9 text-center dark:border-white/10 dark:bg-white/[0.03] dark:backdrop-blur-xl"
    >
      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 dark:border-white/10 dark:text-neutral-300">
        <PackageOpen className="h-4 w-4" strokeWidth={1.6} aria-hidden="true" />
      </div>
      <p className="mt-4 text-base font-medium text-slate-900 dark:text-white">Open Source</p>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate-500 dark:text-neutral-500">
        PinDrop is built on the incredible work of the open-source community. Special thanks to
        the developers and maintainers whose tools make projects like this possible.
      </p>
    </motion.div>
  );
}
