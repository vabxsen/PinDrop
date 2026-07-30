import { useCallback, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { linksApi, locationsApi } from '@/lib/api';
import { useSocketEvent } from '@/lib/socket-context';
import { Badge } from '@/components/ui/Badge';
import { Button, buttonVariants } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { LinkFormDialog } from '@/components/links/LinkFormDialog';
import { ShareLinkDialog } from '@/components/links/ShareLinkDialog';
import { LocationsMap } from '@/components/links/LocationsMap';
import { LocationsTable } from '@/components/links/LocationsTable';
import type { MapPoint } from '@/components/links/LocationsMap';
import { GoogleMapsIcon } from '@/components/icons/GoogleMapsIcon';

const statusTone = {
  ACTIVE: 'success',
  EXPIRED: 'neutral',
  DISABLED: 'neutral',
  MAX_USES_REACHED: 'warning',
} as const;

export function LinkDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formOpen, setFormOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const linkQuery = useQuery({
    queryKey: ['links', id],
    queryFn: () => linksApi.get(id!),
    enabled: Boolean(id),
  });

  const locationsQuery = useQuery({
    queryKey: ['locations', id],
    queryFn: () => locationsApi.list({ linkId: id, pageSize: 100 }),
    enabled: Boolean(id),
  });

  const invalidate = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['links', id] });
    queryClient.invalidateQueries({ queryKey: ['locations', id] });
  }, [queryClient, id]);

  useSocketEvent<{ linkId: string; linkTitle: string }>('location:received', (payload) => {
    if (payload.linkId === id) {
      toast.success('New location received');
      invalidate();
    }
  });
  useSocketEvent<{ linkId: string }>('permission:denied', (payload) => {
    if (payload.linkId === id) invalidate();
  });

  const toggleDisabled = useMutation({
    mutationFn: () => linksApi.setDisabled(id!, { disabled: !linkQuery.data?.link.disabled }),
    onSuccess: invalidate,
    onError: () => toast.error('Failed to update link'),
  });

  const duplicate = useMutation({
    mutationFn: () => linksApi.duplicate(id!),
    onSuccess: (result) => {
      toast.success('Link duplicated');
      navigate(`/app/links/${result.link.id}`);
    },
    onError: () => toast.error('Failed to duplicate link'),
  });

  const remove = useMutation({
    mutationFn: () => linksApi.remove(id!),
    onSuccess: () => {
      toast.success('Link deleted');
      navigate('/app/links', { replace: true });
    },
    onError: () => toast.error('Failed to delete link'),
  });

  const deleteRecord = useMutation({
    mutationFn: (recordId: string) => locationsApi.remove(recordId),
    onSuccess: invalidate,
    onError: () => toast.error('Failed to delete record'),
  });

  async function handleExport() {
    try {
      await locationsApi.exportCsv({ linkId: id });
    } catch {
      toast.error('Failed to export CSV');
    }
  }

  if (linkQuery.isLoading || !linkQuery.data) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  const link = linkQuery.data.link;
  const points: MapPoint[] = (locationsQuery.data?.items ?? [])
    .filter((item) => item.permissionStatus === 'GRANTED' && item.lat !== null && item.lng !== null)
    .map((item) => ({
      id: item.id,
      lat: item.lat!,
      lng: item.lng!,
      label:
        item.displayAddress ??
        [item.city, item.country].filter(Boolean).join(', ') ??
        'Unknown location',
      subLabel: new Date(item.createdAt).toLocaleString(),
    }));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link
          to="/app/links"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-4 w-4"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m15 18-6-6 6-6" />
          </svg>
          Back to links
        </Link>

        <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{link.title}</h1>
              <Badge tone={statusTone[link.status]} dot>
                {link.status.replace(/_/g, ' ').toLowerCase()}
              </Badge>
            </div>
            {link.description && (
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{link.description}</p>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {points[0] && (
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${points[0].lat},${points[0].lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants('outline', 'sm')}
              >
                <GoogleMapsIcon className="h-4 w-4" />
                View on Google Maps
              </a>
            )}
            <Button variant="outline" size="sm" onClick={() => setShareOpen(true)}>
              Share
            </Button>
            <Button variant="outline" size="sm" onClick={() => setFormOpen(true)}>
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => duplicate.mutate()}
              loading={duplicate.isPending}
            >
              Duplicate
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toggleDisabled.mutate()}
              loading={toggleDisabled.isPending}
            >
              {link.disabled ? 'Enable' : 'Disable'}
            </Button>
            <Button variant="danger" size="sm" onClick={() => setDeleteOpen(true)}>
              Delete
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card className="p-4">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Uses</p>
          <p className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">
            {link.useCount}
            {link.maxUses ? ` / ${link.maxUses}` : ''}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Granted</p>
          <p className="mt-1 text-xl font-semibold text-emerald-600 dark:text-emerald-400">
            {link.permissionGrantedCount}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Denied</p>
          <p className="mt-1 text-xl font-semibold text-red-500 dark:text-red-400">
            {link.permissionDeniedCount}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Last response</p>
          <p className="mt-1 text-sm font-medium text-slate-900 dark:text-white">
            {link.latestVisitorAt ? new Date(link.latestVisitorAt).toLocaleString() : 'None yet'}
          </p>
        </Card>
      </div>

      <LocationsMap points={points} />

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Responses</h2>
        <Button variant="outline" size="sm" onClick={handleExport}>
          Export CSV
        </Button>
      </div>
      <LocationsTable
        items={locationsQuery.data?.items ?? []}
        onDelete={(recordId) => deleteRecord.mutate(recordId)}
      />

      <LinkFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        link={link}
        onSaved={invalidate}
      />
      <ShareLinkDialog
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        shortId={link.shortId}
      />
      <ConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={() => remove.mutateAsync()}
        title="Delete this link?"
        description="This link and all of its location records will be permanently deleted. This can't be undone."
        confirmLabel="Delete"
        danger
      />
    </div>
  );
}
