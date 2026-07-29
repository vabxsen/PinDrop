import { PackageOpen } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { fadeUpVariants } from './motion';

export function OpenSourceCard() {
  const reduceMotion = useReducedMotion() ?? false;

  return (
    <motion.div
      variants={fadeUpVariants(reduceMotion)}
      className="w-full max-w-2xl rounded-[24px] border border-white/10 bg-white/[0.03] px-8 py-9 text-center backdrop-blur-xl"
    >
      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-neutral-300">
        <PackageOpen className="h-4 w-4" strokeWidth={1.6} aria-hidden="true" />
      </div>
      <p className="mt-4 text-base font-medium text-white">Open Source</p>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-neutral-500">
        PinDrop is built on the incredible work of the open-source community. Special thanks to
        the developers and maintainers whose tools make projects like this possible.
      </p>
    </motion.div>
  );
}
