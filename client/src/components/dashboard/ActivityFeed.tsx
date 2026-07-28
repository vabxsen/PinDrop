import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Badge } from '@/components/ui/Badge';
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
        <CardTitle>Recent activity</CardTitle>
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
            {items.map((item) => (
              <li key={item.id} className="flex items-center justify-between gap-4 py-3">
                <div className="min-w-0">
                  <Link
                    to={`/app/links/${item.linkId}`}
                    className="truncate text-sm font-medium text-slate-900 hover:text-brand-600 dark:text-slate-100 dark:hover:text-brand-400"
                  >
                    {item.linkTitle}
                  </Link>
                  <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                    {item.permissionStatus === 'GRANTED'
                      ? (item.displayAddress ??
                        ([item.city, item.country].filter(Boolean).join(', ') ||
                          'Location received'))
                      : 'Permission denied'}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <Badge tone={item.permissionStatus === 'GRANTED' ? 'success' : 'danger'} dot>
                    {item.permissionStatus === 'GRANTED' ? 'Granted' : 'Denied'}
                  </Badge>
                  <span className="text-xs text-slate-400 dark:text-slate-500">
                    {timeAgo(item.createdAt)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
