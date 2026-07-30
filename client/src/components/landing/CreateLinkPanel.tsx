import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Link2, X } from 'lucide-react';
import type { LinkDTO } from '@pindrop/shared';
import { LinkForm } from '@/components/links/LinkForm';
import { RotatingGlobe } from './RotatingGlobe';
import { sectionEase } from './motion';

interface CreateLinkPanelProps {
  open: boolean;
  onClose: () => void;
  onSaved: (link: LinkDTO) => void;
}

export function CreateLinkPanel({ open, onClose, onSaved }: CreateLinkPanelProps) {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          key="create-link-globe"
          aria-hidden="true"
          className="pointer-events-none fixed inset-y-0 left-0 z-40 hidden items-center justify-center overflow-hidden lg:right-[28rem] lg:flex"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, delay: reduceMotion ? 0 : 0.2 }}
        >
          <RotatingGlobe />
        </motion.div>
      )}
      {open && (
        <motion.div
          key="create-link-panel"
          role="dialog"
          aria-modal="true"
          aria-labelledby="create-link-panel-title"
          initial={reduceMotion ? { opacity: 0 } : { x: '100%' }}
          animate={reduceMotion ? { opacity: 1 } : { x: '0%' }}
          exit={reduceMotion ? { opacity: 0 } : { x: '100%' }}
          transition={{ duration: 0.6, ease: sectionEase }}
          className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col overflow-y-auto border-l border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-0 top-1/2 -z-10 h-72 w-72 -translate-y-1/2 translate-x-1/3 rounded-full bg-brand-400/20 blur-3xl dark:bg-brand-500/10"
          />
          <div className="relative px-6 pb-6 pt-8 sm:px-8">
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-slate-400 transition-colors duration-150 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
            >
              <X className="h-4.5 w-4.5" aria-hidden="true" />
            </button>
            <span className="relative flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-brand-600 shadow-sm dark:border-slate-700 dark:bg-slate-950 dark:text-brand-400">
              <Link2 className="h-5 w-5" aria-hidden="true" />
            </span>
            <h2
              id="create-link-panel-title"
              className="relative mt-4 text-xl font-bold tracking-tight text-slate-900 dark:text-white"
            >
              Create a new link
            </h2>
            <p className="relative mt-1.5 text-sm text-slate-500 dark:text-slate-400">
              Anyone with this link can be asked to share their location.
            </p>
          </div>

          <div className="border-t border-slate-100 px-6 py-6 sm:px-8 dark:border-slate-800/80">
            <LinkForm open={open} onClose={onClose} onSaved={onSaved} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
