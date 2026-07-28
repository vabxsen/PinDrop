import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import type { LinkDTO } from '@pindrop/shared';
import { linksApi } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { LinkCard } from '@/components/links/LinkCard';
import { LinkFormDialog } from '@/components/links/LinkFormDialog';
import { ShareLinkDialog } from '@/components/links/ShareLinkDialog';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

export function LinksPage() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ['links'], queryFn: linksApi.list });

  const [formOpen, setFormOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<LinkDTO | null>(null);
  const [shareShortId, setShareShortId] = useState<string | null>(null);
  const [deletingLink, setDeletingLink] = useState<LinkDTO | null>(null);

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ['links'] });
  }

  const toggleDisabled = useMutation({
    mutationFn: (link: LinkDTO) => linksApi.setDisabled(link.id, { disabled: !link.disabled }),
    onSuccess: invalidate,
    onError: () => toast.error('Failed to update link'),
  });

  const duplicate = useMutation({
    mutationFn: (id: string) => linksApi.duplicate(id),
    onSuccess: () => {
      toast.success('Link duplicated');
      invalidate();
    },
    onError: () => toast.error('Failed to duplicate link'),
  });

  const remove = useMutation({
    mutationFn: (id: string) => linksApi.remove(id),
    onSuccess: () => {
      toast.success('Link deleted');
      invalidate();
    },
    onError: () => toast.error('Failed to delete link'),
  });

  const links = data?.items ?? [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Links</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Create and manage your shareable links.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingLink(null);
            setFormOpen(true);
          }}
          icon={
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-4.5 w-4.5"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
            </svg>
          }
        >
          New link
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner className="h-8 w-8" />
        </div>
      ) : links.length === 0 ? (
        <EmptyState
          title="No links yet"
          description="Create your first link to start collecting consent-based location responses."
          action={
            <Button
              onClick={() => {
                setEditingLink(null);
                setFormOpen(true);
              }}
              className="mt-2"
            >
              Create your first link
            </Button>
          }
        />
      ) : (
        <div className="flex flex-col gap-4">
          {links.map((link) => (
            <LinkCard
              key={link.id}
              link={link}
              onShare={() => setShareShortId(link.shortId)}
              onEdit={() => {
                setEditingLink(link);
                setFormOpen(true);
              }}
              onDuplicate={() => duplicate.mutate(link.id)}
              onToggleDisabled={() => toggleDisabled.mutate(link)}
              onDelete={() => setDeletingLink(link)}
            />
          ))}
        </div>
      )}

      <LinkFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        link={editingLink}
        onSaved={invalidate}
      />

      {shareShortId && (
        <ShareLinkDialog
          open={Boolean(shareShortId)}
          onClose={() => setShareShortId(null)}
          shortId={shareShortId}
        />
      )}

      <ConfirmDialog
        open={Boolean(deletingLink)}
        onClose={() => setDeletingLink(null)}
        onConfirm={async () => {
          if (deletingLink) await remove.mutateAsync(deletingLink.id);
        }}
        title="Delete this link?"
        description={`"${deletingLink?.title}" and all of its location records will be permanently deleted. This can't be undone.`}
        confirmLabel="Delete"
        danger
      />
    </div>
  );
}
