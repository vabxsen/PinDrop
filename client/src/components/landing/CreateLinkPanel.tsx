import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import type { LinkDTO } from '@pindrop/shared';
import { LinkForm } from '@/components/links/LinkForm';
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
          key="create-link-panel"
          role="dialog"
          aria-modal="true"
          aria-labelledby="create-link-panel-title"
          initial={reduceMotion ? { opacity: 0 } : { x: '100%', filter: 'blur(0px)' }}
          animate={
            reduceMotion
              ? { opacity: 1 }
              : { x: ['100%', '6%', '0%'], filter: ['blur(0px)', 'blur(10px)', 'blur(0px)'] }
          }
          exit={
            reduceMotion
              ? { opacity: 0 }
              : { x: ['0%', '6%', '100%'], filter: ['blur(0px)', 'blur(10px)', 'blur(0px)'] }
          }
          transition={{ duration: 0.6, ease: sectionEase }}
          className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col overflow-y-auto border-l border-slate-200 bg-white p-6 shadow-2xl sm:p-8 dark:border-slate-800 dark:bg-slate-900"
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-slate-400 transition-colors duration-150 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
          <h2
            id="create-link-panel-title"
            className="text-lg font-semibold text-slate-900 dark:text-white"
          >
            Create a new link
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Anyone with this link can be asked to share their location.
          </p>
          <div className="mt-6">
            <LinkForm open={open} onClose={onClose} onSaved={onSaved} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
