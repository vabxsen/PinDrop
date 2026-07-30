import { motion } from 'framer-motion';
import { Eye, EyeOff, MapPin, ShieldCheck } from 'lucide-react';
import { fadeUp, scaleIn, staggerContainer, viewportOnce } from './motion';

const bullets = [
  {
    icon: ShieldCheck,
    title: 'Explicit opt-in',
    description:
      "Nothing is captured until the visitor explicitly grants their browser's location permission.",
  },
  {
    icon: Eye,
    title: 'Full transparency',
    description:
      "Visitors see your link's title and message before they're ever asked for anything.",
  },
  {
    icon: EyeOff,
    title: 'Nothing lingers',
    description:
      'No background tracking, no silent pings — location is sent once, on request, and never again.',
  },
];

function PermissionPromptVisual() {
  return (
    <div className="flex aspect-[4/3] items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 p-8 dark:border-slate-800 dark:bg-slate-900/60">
      <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-5 shadow-xl dark:border-slate-700 dark:bg-slate-900">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400">
            <MapPin className="h-4.5 w-4.5" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
              pindrop.app wants to know your location
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Your exact location is only shared if you allow it.
            </p>
          </div>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <span className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-500 dark:text-slate-400">
            Block
          </span>
          <span className="rounded-lg bg-brand-600 px-3 py-1.5 text-sm font-medium text-white">
            Allow
          </span>
        </div>
      </div>
    </div>
  );
}

export function ConsentEditorial() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-28 sm:px-8 sm:py-36">
      <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={scaleIn}
          transition={{ duration: 0.7 }}
        >
          <PermissionPromptVisual />
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer(0.1)}
        >
          <motion.h2
            variants={fadeUp}
            className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-white"
          >
            Built around consent.
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="mt-5 max-w-md text-lg text-slate-500 dark:text-slate-400"
          >
            PinDrop was designed around one rule: no location is ever captured until the person on
            the other end explicitly says yes.
          </motion.p>

          <ul className="mt-10 flex flex-col gap-6">
            {bullets.map((bullet) => (
              <motion.li key={bullet.title} variants={fadeUp} className="flex gap-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400">
                  <bullet.icon className="h-4.5 w-4.5" />
                </span>
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-100">{bullet.title}</p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {bullet.description}
                  </p>
                </div>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
