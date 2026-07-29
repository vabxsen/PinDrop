import { motion, useReducedMotion } from 'framer-motion';
import { Link2, MapPin, MousePointerClick, Share2, ShieldQuestion } from 'lucide-react';
import { fadeUp, staggerContainer, viewportOnce } from './motion';

const steps = [
  {
    icon: Link2,
    title: 'Create Link',
    description: 'Give it a title and set an expiry or usage limit.',
  },
  { icon: Share2, title: 'Share Link', description: 'Send it anywhere — chat, email, a QR code.' },
  {
    icon: MousePointerClick,
    title: 'Visitor Opens',
    description: 'No account or app needed on their end.',
  },
  {
    icon: ShieldQuestion,
    title: 'Permission Prompt',
    description: 'Their browser asks — and only they can answer.',
  },
  { icon: MapPin, title: 'Live Location', description: 'If they allow it, you see it instantly.' },
];

export function ConsentTimeline() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="how-it-works" className="mx-auto max-w-6xl px-6 py-28 sm:px-8 sm:py-36">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={fadeUp}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-2xl text-center"
      >
        <h2 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
          How it works.
        </h2>
        <p className="mt-4 text-lg text-slate-500 dark:text-slate-400">
          Five steps, no visitor account required.
        </p>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerContainer(0.15, 0.1)}
        className="relative mt-20"
      >
        <span
          aria-hidden="true"
          className="absolute left-[19px] top-2 bottom-2 hidden w-px bg-slate-200 sm:block lg:left-0 lg:right-0 lg:top-5 lg:h-px lg:w-auto lg:bg-slate-200 dark:bg-slate-800"
        />
        <motion.span
          aria-hidden="true"
          variants={{
            hidden: { scaleY: 0, scaleX: 1 },
            visible: { scaleY: 1, scaleX: 1, transition: { duration: 1.1 } },
          }}
          style={{ transformOrigin: 'top' }}
          className="absolute left-[19px] top-2 bottom-2 hidden w-px bg-brand-500 sm:block lg:hidden"
        />
        <motion.span
          aria-hidden="true"
          variants={{
            hidden: { scaleX: 0 },
            visible: { scaleX: 1, transition: { duration: 1.1 } },
          }}
          style={{ transformOrigin: 'left' }}
          className="absolute left-0 right-0 top-5 hidden h-px bg-brand-500 lg:block"
        />

        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between lg:gap-4">
          {steps.map((step) => (
            <motion.div
              key={step.title}
              variants={fadeUp}
              whileHover={
                reduceMotion
                  ? undefined
                  : { y: -6, scale: 1.2, transition: { type: 'spring', stiffness: 400, damping: 22 } }
              }
              className="group relative flex cursor-default items-start gap-4 lg:flex-col lg:items-center lg:gap-0 lg:text-center"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -inset-4 -z-10 rounded-2xl border border-transparent bg-white/0 opacity-0 backdrop-blur-none transition-all duration-300 ease-out group-hover:border-white group-hover:bg-white group-hover:opacity-100 group-hover:shadow-[0_8px_30px_-12px_rgba(15,23,42,0.15)] group-hover:backdrop-blur-xl dark:group-hover:border-slate-700 dark:group-hover:bg-slate-900 dark:group-hover:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.5)]"
              />
              <span className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-brand-600 transition-colors duration-300 ease-out group-hover:border-brand-400 group-hover:bg-brand-50 dark:border-slate-700 dark:bg-slate-950 dark:text-brand-400 dark:group-hover:border-brand-500 dark:group-hover:bg-brand-500/10">
                <step.icon className="h-4.5 w-4.5" />
              </span>
              <div className="z-10 lg:mt-4 lg:max-w-[10.5rem]">
                <p className="font-medium text-slate-900 dark:text-slate-100">{step.title}</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
