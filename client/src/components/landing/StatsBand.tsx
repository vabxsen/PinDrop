import { motion } from 'framer-motion';
import { AnimatedCounter } from './AnimatedCounter';
import { fadeUp, staggerContainer, viewportOnce } from './motion';

const stats = [
  { value: 125000, suffix: '+', label: 'Links created' },
  { value: 54, suffix: '', label: 'Countries' },
  { value: 99.9, decimals: 1, suffix: '%', label: 'Consent success' },
  { value: 2.4, decimals: 1, suffix: 's', label: 'Average response' },
];

export function StatsBand() {
  return (
    <section className="border-t border-slate-100 py-24 dark:border-slate-900">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerContainer(0.1)}
        className="mx-auto grid max-w-6xl grid-cols-2 gap-10 px-6 sm:px-8 lg:grid-cols-4"
      >
        {stats.map((stat) => (
          <motion.div key={stat.label} variants={fadeUp} className="text-center">
            <p className="text-5xl font-bold tracking-tight text-slate-900 sm:text-6xl dark:text-white">
              <AnimatedCounter value={stat.value} decimals={stat.decimals} suffix={stat.suffix} />
            </p>
            <p className="mt-2 text-sm font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
