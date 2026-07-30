import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { fadeUp, scaleIn, viewportOnce } from './motion';

interface FeatureRowProps {
  icon: LucideIcon;
  title: string;
  description: string;
  reverse?: boolean;
  children: ReactNode;
}

export function FeatureRow({ icon: Icon, title, description, reverse, children }: FeatureRowProps) {
  return (
    <div className="flex min-h-[60vh] items-center border-t border-slate-100 py-20 dark:border-slate-900">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-14 px-6 sm:px-8 lg:grid-cols-2 lg:gap-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={scaleIn}
          transition={{ duration: 0.7 }}
          className={cn(reverse && 'lg:order-2')}
        >
          {children}
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeUp}
          transition={{ duration: 0.6 }}
          className={cn(reverse && 'lg:order-1')}
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400">
            <Icon className="h-4.5 w-4.5" />
          </span>
          <h3 className="mt-5 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
            {title}
          </h3>
          <p className="mt-4 max-w-md text-lg text-slate-500 dark:text-slate-400">{description}</p>
        </motion.div>
      </div>
    </div>
  );
}
