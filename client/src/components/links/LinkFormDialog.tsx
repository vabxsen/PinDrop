import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import type { LinkDTO } from '@pindrop/shared';
import { Dialog } from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { linksApi } from '@/lib/api';

const formSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(120),
  description: z.string().trim().max(500).optional(),
  expiresAt: z.string().optional(),
  maxUses: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

function toDatetimeLocal(iso: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

interface LinkFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSaved: (link: LinkDTO) => void;
  link?: LinkDTO | null;
}

export function LinkFormDialog({ open, onClose, onSaved, link }: LinkFormDialogProps) {
  const isEdit = Boolean(link);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: '', description: '', expiresAt: '', maxUses: '' },
  });

  useEffect(() => {
    if (open) {
      reset({
        title: link?.title ?? '',
        description: link?.description ?? '',
        expiresAt: toDatetimeLocal(link?.expiresAt ?? null),
        maxUses: link?.maxUses ? String(link.maxUses) : '',
      });
    }
  }, [open, link, reset]);

  async function onSubmit(data: FormValues) {
    const payload = {
      title: data.title,
      description: data.description?.trim() ? data.description.trim() : null,
      expiresAt: data.expiresAt ? new Date(data.expiresAt).toISOString() : null,
      maxUses: data.maxUses ? Number(data.maxUses) : null,
    };

    try {
      const result =
        isEdit && link ? await linksApi.update(link.id, payload) : await linksApi.create(payload);
      toast.success(isEdit ? 'Link updated' : 'Link created');
      onSaved(result.link);
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save link');
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit link' : 'Create a new link'}
      description="Anyone with this link can be asked to share their location."
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        <Input
          label="Title"
          placeholder="e.g. Meet me here"
          error={errors.title?.message}
          {...register('title')}
        />
        <Input
          label="Description"
          placeholder="Optional message shown to the visitor"
          error={errors.description?.message}
          {...register('description')}
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Expires at"
            type="datetime-local"
            error={errors.expiresAt?.message}
            {...register('expiresAt')}
          />
          <Input
            label="Max uses"
            type="number"
            min={1}
            placeholder="Unlimited"
            error={errors.maxUses?.message}
            {...register('maxUses')}
          />
        </div>
        <Button type="submit" size="lg" loading={isSubmitting} className="mt-2 w-full">
          {isEdit ? 'Save changes' : 'Create link'}
        </Button>
      </form>
    </Dialog>
  );
}
