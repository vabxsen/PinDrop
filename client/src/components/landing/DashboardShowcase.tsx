import { motion } from 'framer-motion';
import { fadeUp, scaleIn, viewportOnce } from './motion';
import { DashboardMockup } from './DashboardMockup';

export function DashboardShowcase() {
  return (
    <section className="overflow-x-clip bg-slate-950 py-28 sm:py-36">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={fadeUp}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-2xl px-6 text-center sm:px-8"
      >
        <h2 className="text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
          <span className="block">Everything.</span>
          <span className="block">At a glance.</span>
        </h2>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={scaleIn}
        transition={{ duration: 0.8, delay: 0.15 }}
        className="mx-auto mt-16 max-w-6xl px-4 sm:px-6"
      >
        <DashboardMockup
          showExport
          showToast
          className="mx-auto h-[560px] sm:h-[640px] lg:h-[560px]"
        />
      </motion.div>
    </section>
  );
}
