import { Logo } from '@/components/Logo';
import { buttonVariants } from '@/components/ui/Button';
import { LiveStatusDot } from '@/components/ui/LiveStatusDot';
import { cn } from '@/lib/cn';

interface LinkVisitorPreviewProps {
  title: string;
  description: string;
  className?: string;
}

export function LinkVisitorPreview({ title, description, className }: LinkVisitorPreviewProps) {
  return (
    <div
      className={cn(
        'relative flex flex-col overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900',
        className,
      )}
    >
      <div className="flex h-12 shrink-0 items-center justify-between border-b border-slate-100 px-4 dark:border-slate-800">
        <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
          What visitors will see
        </span>
        <LiveStatusDot label="Live preview" />
      </div>

      <div className="flex flex-1 flex-col items-center justify-center overflow-y-auto px-8 py-10 text-center">
        <div className="mb-6 text-brand-600 dark:text-brand-400">
          <Logo />
        </div>

        <h1 className="text-xl font-bold text-slate-900 dark:text-white">
          {title.trim() || 'Meet me here'}
        </h1>
        {description.trim() && (
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{description}</p>
        )}

        <div className="mt-6 w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-left text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
          <p className="font-medium text-slate-900 dark:text-slate-100">
            If you continue, we&rsquo;ll ask your browser for:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Your current location (only if you approve the browser&rsquo;s permission prompt)</li>
            <li>Basic device info (browser, timezone) to give context</li>
          </ul>
          <p className="mt-2">Nothing is shared unless you explicitly approve it.</p>
        </div>

        <div className="mt-6 flex w-full flex-col gap-3">
          <a
            href="#"
            aria-hidden="true"
            tabIndex={-1}
            onClick={(e) => e.preventDefault()}
            className={buttonVariants('primary', 'lg', 'w-full')}
          >
            Share my location
          </a>
          <a
            href="#"
            aria-hidden="true"
            tabIndex={-1}
            onClick={(e) => e.preventDefault()}
            className={buttonVariants('outline', 'lg', 'w-full')}
          >
            No thanks
          </a>
        </div>
      </div>
    </div>
  );
}
