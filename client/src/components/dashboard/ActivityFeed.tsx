import { Link } from 'react-router-dom';
import { Activity, Check, X } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { cn } from '@/lib/cn';
import type { ActivityItem } from '@/lib/api';

function timeAgo(iso: string) {
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function ActivityFeed({ items }: { items: ActivityItem[] }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-slate-400 dark:text-slate-500" aria-hidden="true" />
          <CardTitle>Recent activity</CardTitle>
        </div>
        <CardDescription>Latest visitor responses</CardDescription>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <EmptyState
            title="No activity yet"
            description="Visits to your links will show up here in real time."
          />
        ) : (
          <ul className="flex flex-col divide-y divide-slate-100 dark:divide-slate-800">
            {items.map((item) => {
              const granted = item.permissionStatus === 'GRANTED';
              return (
                <li key={item.id} className="flex items-center gap-3 py-3">
                  <span
                    className={cn(
                      'flex h-9 w-9 shrink-0 items-center justify-center rounded-full',
                      granted
                        ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300'
                        : 'bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-300',
                    )}
                    aria-hidden="true"
                  >
                    {granted ? (
                      <Check className="h-4 w-4" strokeWidth={2.5} />
                    ) : (
                      <X className="h-4 w-4" strokeWidth={2.5} />
                    )}
                  </span>

                  <div className="min-w-0 flex-1">
                    <Link
                      to={`/app/links/${item.linkId}`}
                      className="truncate text-sm font-medium text-slate-900 hover:text-brand-600 dark:text-slate-100 dark:hover:text-brand-400"
                    >
                      {item.linkTitle}
                    </Link>
                    <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                      {granted
                        ? (item.displayAddress ??
                          ([item.city, item.country].filter(Boolean).join(', ') ||
                            'Location received'))
                        : 'Permission denied'}
                    </p>
                  </div>

                  <span className="shrink-0 text-xs text-slate-400 dark:text-slate-500">
                    {timeAgo(item.createdAt)}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
