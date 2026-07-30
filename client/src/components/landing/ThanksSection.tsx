import { motion } from 'framer-motion';
import { fadeUp, viewportOnce } from './motion';

export function ThanksSection() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-16 text-center sm:px-8 sm:py-20">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={fadeUp}
        transition={{ duration: 0.7 }}
      >
        <img
          src="/thanks-visiting.png"
          alt="A cheerful cartoon character giving a thumbs up"
          width={160}
          height={160}
          className="mx-auto h-40 w-40 object-contain"
        />
        <h2 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
          Thanks for visiting.
        </h2>
      </motion.div>
    </section>
  );
}
