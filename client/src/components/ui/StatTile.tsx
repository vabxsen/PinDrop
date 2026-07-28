import type { ReactNode } from 'react';
import { Card } from '@/components/ui/Card';

interface StatTileProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
}

export function StatTile({ label, value, icon }: StatTileProps) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
        {icon && (
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300">
            {icon}
          </div>
        )}
      </div>
      <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">{value}</p>
    </Card>
  );
}
