import { motion } from 'framer-motion';
import { BarChart3, Download, Radio, Timer } from 'lucide-react';
import type { ReactNode } from 'react';
import { Badge } from '@/components/ui/Badge';
import { buttonVariants } from '@/components/ui/Button';
import { FeatureRow } from './FeatureRow';
import { LiveStatusDot } from './LiveStatusDot';
import { fadeUp, staggerContainer, viewportOnce } from './motion';
import { mockVisitors } from './mockData';

function VisualFrame({ children }: { children: ReactNode }) {
  return (
    <div className="flex aspect-[4/3] items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 p-8 dark:border-slate-800 dark:bg-slate-900/60">
      {children}
    </div>
  );
}

function RealtimeVisual() {
  return (
    <VisualFrame>
      <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-4 shadow-lg dark:border-slate-700 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Activity</span>
          <LiveStatusDot />
        </div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer(0.18)}
          className="flex flex-col divide-y divide-slate-100 dark:divide-slate-800"
        >
          {mockVisitors.slice(0, 3).map((visitor) => (
            <motion.div
              key={visitor.id}
              variants={fadeUp}
              className="flex items-center justify-between py-2.5"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                  {visitor.city}, {visitor.country}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500">{visitor.timeAgo}</p>
              </div>
              <Badge tone={visitor.status === 'granted' ? 'success' : 'danger'} dot>
                {visitor.status === 'granted' ? 'Granted' : 'Denied'}
              </Badge>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </VisualFrame>
  );
}

function ExpirationVisual() {
  const rows = [
    { label: 'Expires', value: 'In 6 days' },
    { label: 'Max uses', value: '10 / 25' },
    { label: 'Status', value: 'Active' },
  ];
  return (
    <VisualFrame>
      <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-5 shadow-lg dark:border-slate-700 dark:bg-slate-900">
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Link settings</p>
        <div className="mt-4 flex flex-col gap-3">
          {rows.map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2.5 text-sm dark:border-slate-800"
            >
              <span className="text-slate-500 dark:text-slate-400">{row.label}</span>
              <span className="font-medium text-slate-900 dark:text-slate-100">{row.value}</span>
            </div>
          ))}
        </div>
      </div>
    </VisualFrame>
  );
}

function ExportVisual() {
  const columns = ['Time', 'Location', 'Status'];
  const rows = [
    ['09:42', 'San Francisco', 'Granted'],
    ['09:41', 'London', 'Granted'],
    ['09:38', 'Austin', 'Denied'],
  ];
  return (
    <VisualFrame>
      <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-5 shadow-lg dark:border-slate-700 dark:bg-slate-900">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="text-slate-400 dark:text-slate-500">
              {columns.map((col) => (
                <th key={col} className="pb-2 font-medium">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-slate-700 dark:text-slate-300">
            {rows.map((row) => (
              <tr key={row[0]} className="border-t border-slate-100 dark:border-slate-800">
                {row.map((cell, i) => (
                  <td key={i} className="py-2">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <a
          href="#"
          aria-hidden="true"
          tabIndex={-1}
          onClick={(e) => e.preventDefault()}
          className={buttonVariants('outline', 'sm', 'mt-4 w-full')}
        >
          <Download className="h-3.5 w-3.5" />
          Export CSV
        </a>
      </div>
    </VisualFrame>
  );
}

function AnalyticsVisual() {
  const bars = [40, 65, 50, 80, 60, 90, 70];
  return (
    <VisualFrame>
      <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-5 shadow-lg dark:border-slate-700 dark:bg-slate-900">
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Locations received</p>
        <div className="mt-6 flex h-32 items-end gap-2">
          {bars.map((height, i) => (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              whileInView={{ height: `${height}%` }}
              viewport={viewportOnce}
              transition={{ duration: 0.6, delay: i * 0.06 }}
              className="flex-1 rounded-t bg-brand-500/80"
            />
          ))}
        </div>
      </div>
    </VisualFrame>
  );
}

const features = [
  {
    icon: Radio,
    title: 'See it the moment it happens.',
    description:
      'Pins land on your dashboard the instant someone opens your link and responds — no refresh, no delay.',
    visual: RealtimeVisual,
  },
  {
    icon: Timer,
    title: 'Links that expire on your terms.',
    description: 'Set an expiry date, cap the number of uses, or disable a link in one click.',
    visual: ExpirationVisual,
  },
  {
    icon: Download,
    title: 'Your data, portable.',
    description: 'Pull every response into a CSV whenever you need it for records or reports.',
    visual: ExportVisual,
  },
  {
    icon: BarChart3,
    title: 'Know your response patterns.',
    description: 'See acceptance rate, top countries, and daily trends at a glance.',
    visual: AnalyticsVisual,
  },
];

export function FeatureShowcase() {
  return (
    <section id="features">
      {features.map((feature, i) => (
        <FeatureRow
          key={feature.title}
          icon={feature.icon}
          title={feature.title}
          description={feature.description}
          reverse={i % 2 === 1}
        >
          <feature.visual />
        </FeatureRow>
      ))}
    </section>
  );
}
