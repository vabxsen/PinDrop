import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { TrendingUp } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { useIsDark } from '@/lib/theme';
import { chartTokens } from '@/lib/chart-colors';
import type { DailyLocationsPoint } from '@/lib/api';

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export function DailyLocationsChart({ data }: { data: DailyLocationsPoint[] }) {
  const isDark = useIsDark();
  const t = chartTokens(isDark);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-slate-400 dark:text-slate-500" aria-hidden="true" />
          <CardTitle>Locations received</CardTitle>
        </div>
        <CardDescription>Last 30 days</CardDescription>
      </CardHeader>
      <CardContent className="pl-0">
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="dailyFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={t.sequential} stopOpacity={0.18} />
                <stop offset="100%" stopColor={t.sequential} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke={t.grid} strokeDasharray="0" />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              tick={{ fill: t.text, fontSize: 12 }}
              axisLine={{ stroke: t.axis }}
              tickLine={false}
              minTickGap={24}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fill: t.text, fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={32}
            />
            <Tooltip
              formatter={(value) => [String(value), 'Locations']}
              labelFormatter={(label) => formatDate(String(label))}
              contentStyle={{
                background: t.surface,
                border: `1px solid ${t.grid}`,
                borderRadius: 8,
                fontSize: 13,
              }}
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke={t.sequential}
              strokeWidth={2}
              fill="url(#dailyFill)"
              activeDot={{ r: 4, stroke: t.surface, strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
