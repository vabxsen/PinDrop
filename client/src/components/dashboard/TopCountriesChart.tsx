import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Globe2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { useIsDark } from '@/lib/theme';
import { chartTokens } from '@/lib/chart-colors';
import type { TopCountryPoint } from '@/lib/api';

export function TopCountriesChart({ data }: { data: TopCountryPoint[] }) {
  const isDark = useIsDark();
  const t = chartTokens(isDark);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Globe2 className="h-4 w-4 text-slate-400 dark:text-slate-500" aria-hidden="true" />
          <CardTitle>Top countries</CardTitle>
        </div>
        <CardDescription>By visitor location</CardDescription>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <EmptyState
            title="No location data yet"
            description="Countries will appear once visitors respond."
          />
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 0, right: 16, left: 0, bottom: 0 }}
            >
              <CartesianGrid horizontal={false} stroke={t.grid} />
              <XAxis
                type="number"
                allowDecimals={false}
                tick={{ fill: t.text, fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="country"
                width={90}
                tick={{ fill: t.text, fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                cursor={{ fill: isDark ? 'rgba(148,163,184,0.08)' : 'rgba(100,116,139,0.06)' }}
                contentStyle={{
                  background: t.surface,
                  border: `1px solid ${t.grid}`,
                  borderRadius: 8,
                  fontSize: 13,
                }}
              />
              <Bar dataKey="count" fill={t.sequential} radius={[0, 4, 4, 0]} barSize={18} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
