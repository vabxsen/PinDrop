import type { LocationRecordDTO } from '@pindrop/shared';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';

interface LocationsTableProps {
  items: LocationRecordDTO[];
  onDelete: (id: string) => void;
}

export function LocationsTable({ items, onDelete }: LocationsTableProps) {
  if (items.length === 0) {
    return (
      <EmptyState title="No responses yet" description="Visitor responses will show up here." />
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-900 dark:text-slate-400">
          <tr>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Location</th>
            <th className="px-4 py-3 font-medium">Device</th>
            <th className="px-4 py-3 font-medium">Time</th>
            <th className="px-4 py-3 font-medium" aria-label="Actions" />
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {items.map((item) => (
            <tr key={item.id} className="text-slate-700 dark:text-slate-300">
              <td className="px-4 py-3">
                <Badge tone={item.permissionStatus === 'GRANTED' ? 'success' : 'danger'} dot>
                  {item.permissionStatus === 'GRANTED' ? 'Granted' : 'Denied'}
                </Badge>
              </td>
              <td className="px-4 py-3">
                {item.permissionStatus === 'GRANTED' ? (
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="font-medium text-slate-900 dark:text-slate-100">
                        {item.displayAddress ??
                          [item.city, item.country].filter(Boolean).join(', ') ??
                          '—'}
                      </p>
                      {item.lat !== null && item.lng !== null && (
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${item.lat},${item.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="Open in Google Maps"
                          className="shrink-0 rounded p-0.5 text-slate-400 transition-colors duration-150 hover:bg-slate-100 hover:text-brand-600 dark:hover:bg-slate-800 dark:hover:text-brand-400"
                        >
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="h-3.5 w-3.5"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
                            />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 3h6v6M10 14 21 3" />
                          </svg>
                        </a>
                      )}
                    </div>
                    {item.lat !== null && item.lng !== null && (
                      <p className="text-xs text-slate-400">
                        {item.lat.toFixed(4)}, {item.lng.toFixed(4)}
                        {item.accuracy ? ` · ±${Math.round(item.accuracy)}m` : ''}
                      </p>
                    )}
                  </div>
                ) : (
                  <span className="text-slate-400">—</span>
                )}
              </td>
              <td className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400">
                {[item.browser, item.os, item.deviceType].filter(Boolean).join(' · ') || '—'}
              </td>
              <td className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400">
                {new Date(item.createdAt).toLocaleString()}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-1">
                  <button
                    type="button"
                    onClick={() => onDelete(item.id)}
                    aria-label="Delete record"
                    className="cursor-pointer rounded-lg p-1.5 text-slate-400 transition-colors duration-150 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="h-4 w-4"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6h16Z"
                      />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
