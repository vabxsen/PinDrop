import type { ReactNode } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { PieChart as PieChartIcon } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { useIsDark } from '@/lib/theme';
import { chartTokens } from '@/lib/chart-colors';
import type { AcceptanceRate } from '@/lib/api';

export function AcceptanceRateChart({ data }: { data: AcceptanceRate }) {
  const isDark = useIsDark();
  const t = chartTokens(isDark);
  const total = data.granted + data.denied;

  const chartData = [
    { key: 'granted', label: 'Granted', value: data.granted, color: t.good },
    { key: 'denied', label: 'Denied', value: data.denied, color: t.critical },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <PieChartIcon
            className="h-4 w-4 text-slate-400 dark:text-slate-500"
            aria-hidden="true"
          />
          <CardTitle>Consent rate</CardTitle>
        </div>
        <CardDescription>Granted vs. denied</CardDescription>
      </CardHeader>
      <CardContent>
        {total === 0 ? (
          <EmptyState title="No responses yet" description="Consent outcomes will appear here." />
        ) : (
          <div className="flex flex-col items-center gap-6 sm:flex-row">
            <div className="relative h-44 w-44 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="label"
                    innerRadius={54}
                    outerRadius={78}
                    paddingAngle={3}
                    stroke={t.surface}
                    strokeWidth={2}
                  >
                    {chartData.map((entry) => (
                      <Cell key={entry.key} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [
                      `${value} (${Math.round((Number(value) / total) * 100)}%)`,
                      name,
                    ]}
                    contentStyle={{
                      background: t.surface,
                      border: `1px solid ${t.grid}`,
                      borderRadius: 8,
                      fontSize: 13,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-semibold text-slate-900 dark:text-white">
                  {data.acceptanceRate}%
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">granted</span>
              </div>
            </div>

            <div className="flex flex-1 flex-col gap-3">
              <LegendRow
                icon={
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={t.good}
                    strokeWidth="2.5"
                    className="h-4 w-4"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" />
                  </svg>
                }
                label="Granted"
                value={data.granted}
                total={total}
              />
              <LegendRow
                icon={
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={t.critical}
                    strokeWidth="2.5"
                    className="h-4 w-4"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6 6 18" />
                  </svg>
                }
                label="Denied"
                value={data.denied}
                total={total}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function LegendRow({
  icon,
  label,
  value,
  total,
}: {
  icon: ReactNode;
  label: string;
  value: number;
  total: number;
}) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 dark:border-slate-800">
      <span className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
        {icon}
        {label}
      </span>
      <span className="text-sm text-slate-500 dark:text-slate-400">
        <span className="font-semibold text-slate-900 dark:text-white">{value}</span> ({pct}%)
      </span>
    </div>
  );
}
