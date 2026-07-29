import { useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Clock, Link2, MapPin, XCircle } from 'lucide-react';
import { dashboardApi } from '@/lib/api';
import { useSocketEvent } from '@/lib/socket-context';
import { useAuth } from '@/lib/auth-context';
import { StatTile } from '@/components/ui/StatTile';
import { LiveStatusDot } from '@/components/ui/LiveStatusDot';
import { DailyLocationsChart } from '@/components/dashboard/DailyLocationsChart';
import { TopCountriesChart } from '@/components/dashboard/TopCountriesChart';
import { AcceptanceRateChart } from '@/components/dashboard/AcceptanceRateChart';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { Spinner } from '@/components/ui/Spinner';

interface LocationReceivedPayload {
  linkId: string;
  linkTitle: string;
}
interface PermissionDeniedPayload {
  linkId: string;
  linkTitle: string;
}

export function DashboardPage() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const invalidateAll = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['dashboard'] });
  }, [queryClient]);

  useSocketEvent<LocationReceivedPayload>('location:received', (payload) => {
    toast.success(`New location from "${payload.linkTitle}"`);
    invalidateAll();
  });

  useSocketEvent<PermissionDeniedPayload>('permission:denied', (payload) => {
    toast(`Permission denied on "${payload.linkTitle}"`, { icon: '⚠️' });
    invalidateAll();
  });

  const stats = useQuery({ queryKey: ['dashboard', 'stats'], queryFn: dashboardApi.stats });
  const daily = useQuery({
    queryKey: ['dashboard', 'daily'],
    queryFn: dashboardApi.dailyLocations,
  });
  const countries = useQuery({
    queryKey: ['dashboard', 'countries'],
    queryFn: dashboardApi.topCountries,
  });
  const acceptance = useQuery({
    queryKey: ['dashboard', 'acceptance'],
    queryFn: dashboardApi.acceptanceRate,
  });
  const activity = useQuery({
    queryKey: ['dashboard', 'activity'],
    queryFn: dashboardApi.activity,
  });

  const isLoading =
    stats.isLoading ||
    daily.isLoading ||
    countries.isLoading ||
    acceptance.isLoading ||
    activity.isLoading;

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  const firstName = user?.name?.trim().split(' ')[0];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {firstName ? `Welcome back, ${firstName}` : 'Dashboard'}
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            A live overview of your links and their responses.
          </p>
        </div>
        <LiveStatusDot />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile
          label="Total links"
          value={stats.data?.totalLinks ?? 0}
          tone="brand"
          icon={<Link2 className="h-4.5 w-4.5" aria-hidden="true" />}
        />
        <StatTile
          label="Locations received"
          value={stats.data?.locationsReceived ?? 0}
          tone="success"
          icon={<MapPin className="h-4.5 w-4.5" aria-hidden="true" />}
        />
        <StatTile
          label="Active links"
          value={stats.data?.pendingLinks ?? 0}
          tone="warning"
          icon={<Clock className="h-4.5 w-4.5" aria-hidden="true" />}
        />
        <StatTile
          label="Permission denied"
          value={stats.data?.permissionDeniedCount ?? 0}
          tone="danger"
          icon={<XCircle className="h-4.5 w-4.5" aria-hidden="true" />}
        />
      </div>

      <DailyLocationsChart data={daily.data?.items ?? []} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <TopCountriesChart data={countries.data?.items ?? []} />
        {acceptance.data && <AcceptanceRateChart data={acceptance.data} />}
      </div>

      <ActivityFeed items={activity.data?.items ?? []} />
    </div>
  );
}
