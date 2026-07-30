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
  expiresHours: z.string().optional(),
  maxUses: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const MAX_EXPIRES_HOURS = 24;

function toExpiresHours(iso: string | null): string {
  if (!iso) return '0';
  const diffMs = new Date(iso).getTime() - Date.now();
  const hours = Math.round(diffMs / (60 * 60 * 1000));
  return String(Math.min(MAX_EXPIRES_HOURS, Math.max(0, hours)));
}

function formatExpiresLabel(hours: string | undefined): string {
  const n = Number(hours);
  if (!n) return 'Never';
  return `${n} ${n === 1 ? 'hour' : 'hours'}`;
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
    defaultValues: { title: '', description: '', expiresHours: '0', maxUses: '' },
  });

  const expiresHours = watch('expiresHours');

  useEffect(() => {
    if (open) {
      reset({
        title: link?.title ?? '',
        description: link?.description ?? '',
        expiresHours: toExpiresHours(link?.expiresAt ?? null),
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
    const hours = Number(data.expiresHours);
    const payload = {
      title: data.title,
      description: data.description?.trim() ? data.description.trim() : null,
      expiresAt: hours > 0 ? new Date(Date.now() + hours * 60 * 60 * 1000).toISOString() : null,
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
        <div className="mt-2 flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="expiresHours"
                className="flex items-center gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                <CalendarClock className="h-4 w-4 text-slate-400" aria-hidden="true" />
                Expires at
              </label>
              <span className="text-sm font-medium text-brand-600 dark:text-brand-400">
                {formatExpiresLabel(expiresHours)}
              </span>
            </div>
            <input
              id="expiresHours"
              type="range"
              min={0}
              max={MAX_EXPIRES_HOURS}
              step={1}
              className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-brand-600 dark:bg-slate-700"
              {...register('expiresHours')}
            />
            <div className="flex justify-between text-xs text-slate-400 dark:text-slate-500">
              <span>Never</span>
              <span>24h</span>
            </div>
          </div>

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
