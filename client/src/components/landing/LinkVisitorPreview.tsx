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
    <div className={cn('flex flex-col items-center justify-center', className)}>
      <div className="mb-5 flex items-center gap-2">
        <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
          What visitors will see
        </span>
        <LiveStatusDot label="Live" />
      </div>

      <div className="relative rounded-[2.75rem] bg-slate-900 p-3 shadow-2xl ring-1 ring-inset ring-white/10">
        <span
          aria-hidden="true"
          className="absolute -left-[3px] top-24 h-7 w-[3px] rounded-l-sm bg-slate-700"
        />
        <span
          aria-hidden="true"
          className="absolute -left-[3px] top-36 h-11 w-[3px] rounded-l-sm bg-slate-700"
        />
        <span
          aria-hidden="true"
          className="absolute -right-[3px] top-32 h-14 w-[3px] rounded-r-sm bg-slate-700"
        />

        <div className="relative h-[560px] w-[260px] overflow-hidden rounded-[2.1rem] bg-white dark:bg-black">
          <span
            aria-hidden="true"
            className="absolute left-1/2 top-0 z-20 h-6 w-28 -translate-x-1/2 rounded-b-2xl bg-slate-900"
          />

          <div className="flex h-full flex-col items-center justify-center overflow-y-auto px-5 pb-8 pt-10 text-center">
            <div className="mb-5 text-brand-600 dark:text-brand-400">
              <Logo />
            </div>

            <h1 className="text-base font-bold text-slate-900 dark:text-white">
              {title.trim() || 'Meet me here'}
            </h1>
            {description.trim() && (
              <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400">{description}</p>
            )}

            <div className="mt-5 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-left text-[11px] leading-relaxed text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
              <p className="font-medium text-slate-900 dark:text-slate-100">
                If you continue, we&rsquo;ll ask your browser for:
              </p>
              <ul className="mt-1.5 list-disc space-y-1 pl-4">
                <li>Your current location (only if you approve)</li>
                <li>Basic device info (browser, timezone)</li>
              </ul>
              <p className="mt-1.5">Nothing is shared unless you explicitly approve it.</p>
            </div>

            <div className="mt-5 flex w-full flex-col gap-2.5">
              <a
                href="#"
                aria-hidden="true"
                tabIndex={-1}
                onClick={(e) => e.preventDefault()}
                className={buttonVariants('primary', 'md', 'w-full')}
              >
                Share my location
              </a>
              <a
                href="#"
                aria-hidden="true"
                tabIndex={-1}
                onClick={(e) => e.preventDefault()}
                className={buttonVariants('outline', 'md', 'w-full')}
              >
                No thanks
              </a>
            </div>
          </div>

          <span
            aria-hidden="true"
            className="absolute bottom-2 left-1/2 h-1 w-28 -translate-x-1/2 rounded-full bg-slate-300 dark:bg-slate-600"
          />
        </div>
      </div>
    </div>
  );
}
