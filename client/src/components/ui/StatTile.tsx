import type { ReactNode } from 'react';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/cn';

type Tone = 'brand' | 'success' | 'warning' | 'danger';

const toneClasses: Record<Tone, string> = {
  brand: 'bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300',
  success: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300',
  warning: 'bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300',
  danger: 'bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-300',
};

interface StatTileProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  tone?: Tone;
}

export function StatTile({ label, value, icon, tone = 'brand' }: StatTileProps) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
        {icon && (
          <div
            className={cn(
              'flex h-9 w-9 items-center justify-center rounded-full',
              toneClasses[tone],
            )}
          >
            {icon}
          </div>
        )}
      </div>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
        {value}
      </p>
    </Card>
  );
}
