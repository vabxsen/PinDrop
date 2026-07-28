import { motion, useReducedMotion } from 'framer-motion';
import { Clock, Crosshair, Download, Globe, Monitor } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { buttonVariants } from '@/components/ui/Button';
import { cn } from '@/lib/cn';
import { LiveStatusDot } from './LiveStatusDot';
import { VisitorCard } from './VisitorCard';
import { MockWorldMap } from './MockWorldMap';
import { mockLinkTitle, mockVisitors, primaryVisitor } from './mockData';

interface DashboardMockupProps {
  compact?: boolean;
  showExport?: boolean;
  showToast?: boolean;
  className?: string;
}

export function DashboardMockup({
  compact = false,
  showExport = false,
  showToast = false,
  className,
}: DashboardMockupProps) {
  const reduceMotion = useReducedMotion();
  const visitors = compact ? mockVisitors.slice(0, 2) : mockVisitors;

  return (
    <div
      className={cn(
        'relative flex flex-col overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900',
        className,
      )}
    >
      <div className="flex h-12 shrink-0 items-center justify-between border-b border-slate-100 px-4 dark:border-slate-800">
        <div className="flex min-w-0 items-center gap-2 text-brand-600 dark:text-brand-400">
          <Logo withWordmark={false} className="h-4 w-4 shrink-0" />
          <span className="truncate text-sm font-medium text-slate-700 dark:text-slate-300">
            {mockLinkTitle}
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <LiveStatusDot />
          <span
            className="h-6 w-6 rounded-full bg-slate-200 dark:bg-slate-700"
            aria-hidden="true"
          />
        </div>
      </div>

      <div
        className={cn(
          'grid min-h-0 flex-1 grid-cols-1 grid-rows-[minmax(0,1fr)_auto]',
          !compact && 'lg:grid-cols-[1fr_280px] lg:grid-rows-1',
        )}
      >
        <div className="min-h-0 p-3">
          <MockWorldMap visitors={visitors} className="h-full w-full" />
        </div>

        <div className="flex flex-col divide-y divide-slate-100 overflow-y-auto border-t border-slate-100 px-4 dark:divide-slate-800 dark:border-slate-800 lg:border-l lg:border-t-0">
          {visitors.map((visitor) => (
            <VisitorCard key={visitor.id} visitor={visitor} />
          ))}

          {!compact && (
            <div className="flex flex-col gap-2 py-3">
              <DeviceRow icon={Monitor} label={primaryVisitor.device} />
              <DeviceRow icon={Globe} label={primaryVisitor.browser} />
              <DeviceRow icon={Crosshair} label={`±${primaryVisitor.accuracyMeters}m accuracy`} />
              <DeviceRow icon={Clock} label={primaryVisitor.timezone} />
            </div>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center justify-between border-t border-slate-100 px-4 py-2.5 dark:border-slate-800">
        <p className="font-mono text-[11px] text-slate-400 dark:text-slate-500">
          {primaryVisitor.lat.toFixed(4)}° N, {Math.abs(primaryVisitor.lng).toFixed(4)}° W · updated{' '}
          {primaryVisitor.timeAgo}
        </p>
        {showExport && (
          <a
            href="#"
            aria-hidden="true"
            tabIndex={-1}
            onClick={(e) => e.preventDefault()}
            className={buttonVariants('outline', 'sm')}
          >
            <Download className="h-3.5 w-3.5" />
            Export CSV
          </a>
        )}
      </div>

      {showToast && !reduceMotion && (
        <motion.div
          className="absolute right-4 top-16 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-lg dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: [0, 1, 1, 0], y: [8, 0, 0, -8] }}
          transition={{ duration: 3.2, repeat: Infinity, repeatDelay: 4, ease: 'easeInOut' }}
        >
          New location from &ldquo;{mockLinkTitle}&rdquo;
        </motion.div>
      )}
    </div>
  );
}

function DeviceRow({ icon: Icon, label }: { icon: typeof Monitor; label: string }) {
  return (
    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
      <Icon className="h-3.5 w-3.5 shrink-0" />
      <span className="truncate">{label}</span>
    </div>
  );
}
