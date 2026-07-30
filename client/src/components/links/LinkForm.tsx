import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { AlignLeft, CalendarClock, Hash, Link2, Type } from 'lucide-react';
import type { LinkDTO } from '@pindrop/shared';
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

interface LinkFormProps {
  open: boolean;
  onClose: () => void;
  onSaved: (link: LinkDTO) => void;
  link?: LinkDTO | null;
  onLivePreviewChange?: (values: { title: string; description: string }) => void;
}

export function LinkForm({ open, onClose, onSaved, link, onLivePreviewChange }: LinkFormProps) {
  const isEdit = Boolean(link);

  const {
    register,
    handleSubmit,
    reset,
    watch,
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

  useEffect(() => {
    if (!onLivePreviewChange) return;
    const subscription = watch((values) => {
      onLivePreviewChange({ title: values.title ?? '', description: values.description ?? '' });
    });
    return () => subscription.unsubscribe();
  }, [watch, onLivePreviewChange]);

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
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
      <Input
        label="Title"
        placeholder="e.g. Meet me here"
        icon={<Type className="h-4 w-4" aria-hidden="true" />}
        error={errors.title?.message}
        {...register('title')}
      />
      <Input
        label="Description"
        placeholder="Optional message shown to the visitor"
        icon={<AlignLeft className="h-4 w-4" aria-hidden="true" />}
        error={errors.description?.message}
        {...register('description')}
      />
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
          Limits
        </p>
        <div className="mt-2 grid grid-cols-2 gap-4">
          <Input
            label="Expires at"
            type="datetime-local"
            icon={<CalendarClock className="h-4 w-4" aria-hidden="true" />}
            error={errors.expiresAt?.message}
            {...register('expiresAt')}
          />
          <Input
            label="Max uses"
            type="number"
            min={1}
            placeholder="Unlimited"
            icon={<Hash className="h-4 w-4" aria-hidden="true" />}
            error={errors.maxUses?.message}
            {...register('maxUses')}
          />
        </div>
      </div>
      <Button
        type="submit"
        size="lg"
        loading={isSubmitting}
        icon={!isSubmitting ? <Link2 className="h-4 w-4" aria-hidden="true" /> : undefined}
        className="mt-1 w-full"
      >
        {isEdit ? 'Save changes' : 'Create link'}
      </Button>
    </form>
  );
}
