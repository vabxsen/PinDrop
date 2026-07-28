import { useId, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/cn';
import { fadeUp, sectionEase, viewportOnce } from './motion';

const faqs = [
  {
    question: 'Do I need the recipient to have an app or account?',
    answer:
      'No. Anyone with the link can open it in their browser — no PinDrop account, no app install, nothing to sign up for.',
  },
  {
    question: "What happens if they don't grant permission?",
    answer:
      'Nothing is captured. We record that the link was opened and permission was denied, but no location data is ever sent.',
  },
  {
    question: 'Can I set my links to expire?',
    answer:
      'Yes. Set an expiry date, cap the number of uses, or disable a link manually at any time.',
  },
  {
    question: 'Is my data exportable?',
    answer:
      'Every response can be exported to CSV whenever you need it, directly from your dashboard.',
  },
  {
    question: 'How accurate is the location?',
    answer:
      "Accuracy depends on the visitor's device and browser — typically within a few meters on mobile, wider on desktop.",
  },
  {
    question: 'Is PinDrop free to use?',
    answer: 'Yes, PinDrop is free to start with no credit card required.',
  },
];

function FaqItem({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const panelId = useId();

  return (
    <div className="border-b border-slate-100 dark:border-slate-900">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="flex w-full cursor-pointer items-center justify-between gap-4 py-6 text-left"
      >
        <span className="font-medium text-slate-900 dark:text-slate-100">{question}</span>
        <ChevronDown
          className={cn(
            'h-5 w-5 shrink-0 text-slate-400 transition-transform duration-300',
            isOpen && 'rotate-180',
          )}
        />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={panelId}
            role="region"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: sectionEase }}
            className="overflow-hidden"
          >
            <p className="max-w-xl pb-6 text-slate-500 dark:text-slate-400">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="mx-auto max-w-3xl px-6 py-28 sm:px-8 sm:py-36">
      <motion.h2
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={fadeUp}
        transition={{ duration: 0.6 }}
        className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-white"
      >
        Questions, answered.
      </motion.h2>

      <div className="mt-12">
        {faqs.map((faq, i) => (
          <FaqItem
            key={faq.question}
            question={faq.question}
            answer={faq.answer}
            isOpen={openIndex === i}
            onToggle={() => setOpenIndex(openIndex === i ? null : i)}
          />
        ))}
      </div>
    </section>
  );
}
