import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { buttonVariants } from '@/components/ui/Button';
import { fadeUp, viewportOnce } from './motion';

const ctaHover = 'transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]';

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
          <NavLink to="/signup" className={buttonVariants('primary', 'md', ctaHover)}>
            Get started free
          </NavLink>
        </div>
      </motion.div>
    </section>
  );
}
