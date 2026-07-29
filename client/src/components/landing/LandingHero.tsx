import { motion } from 'framer-motion';
import { buttonVariants } from '@/components/ui/Button';
import { smoothScrollToId } from '@/lib/smoothScroll';
import { DashboardMockup } from './DashboardMockup';
import { PrimaryCta } from './PrimaryCta';
import { fadeUp, scaleIn, sectionEase } from './motion';

const ctaHover = 'transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]';

export function LandingHero() {
  return (
    <section className="overflow-x-clip pt-20 sm:pt-28">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        transition={{ duration: 0.7, ease: sectionEase }}
        className="mx-auto max-w-3xl px-6 text-center sm:px-8"
      >
        <h1 className="text-[2.75rem] font-bold leading-[1.05] tracking-tight text-slate-900 sm:text-6xl lg:text-[5.5rem] dark:text-white">
          <span className="block">Ask.</span>
          <span className="block">They allow.</span>
          <span className="block">
            You <span className="text-brand-600 dark:text-brand-400">see.</span>
          </span>
        </h1>
        <p className="mx-auto mt-8 max-w-xl text-lg text-slate-500 sm:text-xl dark:text-slate-400">
          Create a shareable link. Send it anywhere. See their exact location the moment they say
          yes — never before.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <PrimaryCta />
          <a
            href="#how-it-works"
            onClick={(event) => {
              event.preventDefault();
              smoothScrollToId('how-it-works');
            }}
            className={buttonVariants('outline', 'md', ctaHover)}
          >
            See how it works
          </a>
        </div>
      </motion.div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={scaleIn}
        transition={{ duration: 0.9, delay: 0.25, ease: sectionEase }}
        className="mx-auto mt-16 max-w-7xl px-4 sm:mt-24 sm:px-6"
      >
        <DashboardMockup compact className="mx-auto h-[420px] sm:h-[520px] lg:h-[640px]" />
      </motion.div>
    </section>
  );
}
