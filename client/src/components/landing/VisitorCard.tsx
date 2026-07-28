import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/cn';
import type { MockVisitor } from './mockData';

export function VisitorCard({ visitor, className }: { visitor: MockVisitor; className?: string }) {
  const granted = visitor.status === 'granted';

  return (
    <div className={cn('flex items-center justify-between gap-3 py-2.5', className)}>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
          {visitor.linkTitle}
        </p>
        <p className="truncate text-xs text-slate-500 dark:text-slate-400">
          {granted ? `${visitor.city}, ${visitor.country}` : 'Permission denied'}
        </p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1">
        <Badge tone={granted ? 'success' : 'danger'} dot>
          {granted ? 'Granted' : 'Denied'}
        </Badge>
        <span className="text-[11px] text-slate-400 dark:text-slate-500">{visitor.timeAgo}</span>
      </div>
    </div>
  );
}
