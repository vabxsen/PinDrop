import type { ReactNode } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import type { LinkDTO } from '@pindrop/shared';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

const statusTone: Record<LinkDTO['status'], 'success' | 'neutral' | 'warning' | 'danger'> = {
  ACTIVE: 'success',
  EXPIRED: 'neutral',
  DISABLED: 'neutral',
  MAX_USES_REACHED: 'warning',
};

const statusLabel: Record<LinkDTO['status'], string> = {
  ACTIVE: 'Active',
  EXPIRED: 'Expired',
  DISABLED: 'Disabled',
  MAX_USES_REACHED: 'Max uses reached',
};

interface LinkCardProps {
  link: LinkDTO;
  onShare: () => void;
  onEdit: () => void;
  onDuplicate: () => void;
  onToggleDisabled: () => void;
  onDelete: () => void;
}

function IconButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-slate-500 transition-colors duration-150 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
    >
      {children}
    </button>
  );
}

export function LinkCard({
  link,
  onShare,
  onEdit,
  onDuplicate,
  onToggleDisabled,
  onDelete,
}: LinkCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <RouterLink
              to={`/app/links/${link.id}`}
              className="truncate text-base font-semibold text-slate-900 hover:text-brand-600 dark:text-white dark:hover:text-brand-400"
            >
              {link.title}
            </RouterLink>
            <Badge tone={statusTone[link.status]} dot>
              {statusLabel[link.status]}
            </Badge>
          </div>
          {link.description && (
            <p className="mt-1 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">
              {link.description}
            </p>
          )}
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
            <span>
              {link.useCount}
              {link.maxUses ? ` / ${link.maxUses}` : ''} uses
            </span>
            <span className="text-emerald-600 dark:text-emerald-400">
              {link.permissionGrantedCount} granted
            </span>
            <span className="text-red-500 dark:text-red-400">
              {link.permissionDeniedCount} denied
            </span>
            {link.expiresAt && <span>Expires {new Date(link.expiresAt).toLocaleDateString()}</span>}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <IconButton label="Share link" onClick={onShare}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-4.5 w-4.5"
              aria-hidden="true"
            >
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <path strokeLinecap="round" d="m8.6 10.5 6.8-3.8M8.6 13.5l6.8 3.8" />
            </svg>
          </IconButton>
          <IconButton label="Edit link" onClick={onEdit}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-4.5 w-4.5"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5Z"
              />
            </svg>
          </IconButton>
          <IconButton label="Duplicate link" onClick={onDuplicate}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-4.5 w-4.5"
              aria-hidden="true"
            >
              <rect x="9" y="9" width="12" height="12" rx="2" />
              <path
                strokeLinecap="round"
                d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
              />
            </svg>
          </IconButton>
          <IconButton
            label={link.disabled ? 'Enable link' : 'Disable link'}
            onClick={onToggleDisabled}
          >
            {link.disabled ? (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-4.5 w-4.5"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
                <path strokeLinecap="round" strokeLinejoin="round" d="m13 6 6 6-6 6" />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-4.5 w-4.5"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="9" />
                <path strokeLinecap="round" d="M8 8l8 8" />
              </svg>
            )}
          </IconButton>
          <IconButton label="Delete link" onClick={onDelete}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-4.5 w-4.5"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6h16Z"
              />
            </svg>
          </IconButton>
        </div>
      </div>
    </Card>
  );
}
