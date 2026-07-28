import { useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { dashboardApi } from '@/lib/api';
import { useSocketEvent } from '@/lib/socket-context';
import { StatTile } from '@/components/ui/StatTile';
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

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          A live overview of your links and their responses.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile
          label="Total links"
          value={stats.data?.totalLinks ?? 0}
          icon={
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-4.5 w-4.5"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12h6M10 17H7a4 4 0 1 1 0-8h1M14 7h3a4 4 0 1 1 0 8h-1"
              />
            </svg>
          }
        />
        <StatTile
          label="Locations received"
          value={stats.data?.locationsReceived ?? 0}
          icon={
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-4.5 w-4.5"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 21c-4.97-4.24-8-7.9-8-11.5A8 8 0 0 1 20 9.5c0 3.6-3.03 7.26-8 11.5Z"
              />
              <circle cx="12" cy="9.5" r="2.5" />
            </svg>
          }
        />
        <StatTile
          label="Active links"
          value={stats.data?.pendingLinks ?? 0}
          icon={
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-4.5 w-4.5"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="9" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 3" />
            </svg>
          }
        />
        <StatTile
          label="Permission denied"
          value={stats.data?.permissionDeniedCount ?? 0}
          icon={
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-4.5 w-4.5"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="9" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l6 6M15 9l-6 6" />
            </svg>
          }
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
