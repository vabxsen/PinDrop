import { motion } from 'framer-motion';
import { PrimaryCta } from './PrimaryCta';
import { fadeUp, viewportOnce } from './motion';

export function FinalCta() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-32 text-center sm:px-8 sm:py-44">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={fadeUp}
        transition={{ duration: 0.7 }}
      >
        <h2 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
          Create your first PinDrop.
        </h2>
        <div className="mt-10">
          <PrimaryCta />
        </div>
      </motion.div>
    </section>
  );
}
