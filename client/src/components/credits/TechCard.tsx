import type { ComponentType } from 'react';

interface TechCardProps {
  name: string;
  description: string;
  Logo: ComponentType<{ className?: string }>;
}

export function TechCard({ name, description, Logo }: TechCardProps) {
  return (
    <div className="group flex flex-col items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-5 text-center transition-colors duration-150 hover:border-brand-300 dark:border-slate-800 dark:bg-slate-800/40 dark:hover:border-brand-500/50">
      <div className="flex h-9 w-9 items-center justify-center text-slate-500 transition-colors duration-150 group-hover:text-brand-600 dark:text-slate-400 dark:group-hover:text-brand-400">
        <Logo className="h-5 w-5" />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-900 dark:text-white">{name}</p>
        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{description}</p>
      </div>
    </div>
  );
}
