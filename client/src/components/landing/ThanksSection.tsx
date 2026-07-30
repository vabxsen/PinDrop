import { motion } from 'framer-motion';
import { fadeUp, viewportOnce } from './motion';

export function ThanksSection() {
  return (
    <section className="mx-auto max-w-3xl px-6 pb-16 pt-0 sm:px-8 sm:pb-20 sm:pt-0">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={fadeUp}
        transition={{ duration: 0.7 }}
        className="flex flex-col items-center justify-center gap-6 sm:flex-row sm:gap-8"
      >
        <img
          src="/thanks-visiting.png"
          alt="A cheerful cartoon character giving a thumbs up"
          width={160}
          height={160}
          className="h-40 w-40 shrink-0 object-contain"
        />
        <div>
          <h2 className="text-center text-4xl font-bold tracking-tight text-slate-900 sm:text-left sm:text-5xl dark:text-white">
            Thanks for visiting.
          </h2>
          <p className="mt-2 text-center text-sm font-bold text-slate-900 sm:text-left dark:text-white">
            Hope you liked the service
          </p>
        </div>
      </motion.div>
    </section>
  );
}
