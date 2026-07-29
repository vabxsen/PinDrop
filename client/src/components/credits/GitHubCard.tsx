import { ArrowUpRight } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { EASE_SMOOTH, fadeUpVariants } from './motion';
import { GitHubLogo } from './logos';

const REPO_URL = 'https://github.com/vabxsen/PinDrop';

export function GitHubCard() {
  const reduceMotion = useReducedMotion() ?? false;

  return (
    <motion.a
      href={REPO_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Open the PinDrop repository on GitHub (opens in a new tab)"
      variants={fadeUpVariants(reduceMotion)}
      whileHover={reduceMotion ? undefined : { y: -3 }}
      whileTap={reduceMotion ? undefined : { scale: 0.98 }}
      transition={{ duration: 0.3, ease: EASE_SMOOTH }}
      className="group flex w-full max-w-md cursor-pointer items-center gap-4 rounded-[24px] border border-white/10 bg-white/[0.03] px-7 py-6 text-left backdrop-blur-xl transition-[border-color,box-shadow] duration-300 hover:border-white/25 hover:shadow-[0_20px_60px_-30px_rgba(0,0,0,0.85)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/40"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 text-white transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:rotate-[8deg]">
        <GitHubLogo className="h-5 w-5" />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium text-white">PinDrop</span>
        <span className="mt-0.5 block text-xs text-neutral-500">
          Explore the source code, contribute, or report issues.
        </span>
      </span>

      <span className="flex h-8 w-8 shrink-0 items-center justify-center text-neutral-500 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:translate-x-1 group-hover:text-white">
        <ArrowUpRight className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
      </span>
    </motion.a>
  );
}
