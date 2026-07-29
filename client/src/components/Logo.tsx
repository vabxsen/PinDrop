import { cn } from '@/lib/cn';

export function Logo({
  className,
  withWordmark = true,
}: {
  className?: string;
  withWordmark?: boolean;
}) {
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <img src="/logo.png" alt="" width={22} height={22} className="h-[22px] w-[22px]" />
      {withWordmark && (
        <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
          PinDrop
        </span>
      )}
    </span>
  );
}
