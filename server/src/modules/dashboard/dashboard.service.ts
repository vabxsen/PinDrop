import { prisma } from '../../lib/prisma.js';
import { DASHBOARD_DAILY_CHART_DAYS, ACTIVITY_FEED_LIMIT } from '../../config/constants.js';
import { computeLinkStatus } from '../links/links.mapper.js';

export async function getStats(userId: string) {
  const links = await prisma.link.findMany({ where: { userId } });

  const totalLinks = links.length;
  const pendingLinks = links.filter(
    (l) => l.useCount === 0 && computeLinkStatus(l) === 'ACTIVE',
  ).length;

  const [locationsReceived, permissionDeniedCount] = await Promise.all([
    prisma.locationRecord.count({
      where: { link: { userId }, permissionStatus: 'GRANTED' },
    }),
    prisma.locationRecord.count({
      where: { link: { userId }, permissionStatus: 'DENIED' },
    }),
  ]);

  return { totalLinks, locationsReceived, pendingLinks, permissionDeniedCount };
}

export async function getDailyLocationsChart(userId: string) {
  // Bucket keys come from toISOString(), which is UTC, so the window has to be built in UTC
  // too — mixing in local midnight would shift the first and last buckets on any host whose
  // clock isn't already set to UTC.
  const since = new Date();
  since.setUTCDate(since.getUTCDate() - (DASHBOARD_DAILY_CHART_DAYS - 1));
  since.setUTCHours(0, 0, 0, 0);

  const records = await prisma.locationRecord.findMany({
    where: { link: { userId }, permissionStatus: 'GRANTED', createdAt: { gte: since } },
    select: { createdAt: true },
  });

  const counts = new Map<string, number>();
  for (let i = 0; i < DASHBOARD_DAILY_CHART_DAYS; i++) {
    const d = new Date(since);
    d.setUTCDate(d.getUTCDate() + i);
    counts.set(d.toISOString().slice(0, 10), 0);
  }
  for (const record of records) {
    const key = record.createdAt.toISOString().slice(0, 10);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  return Array.from(counts.entries()).map(([date, count]) => ({ date, count }));
}

export async function getTopCountriesChart(userId: string) {
  // Aggregate in the database rather than pulling every granted record into memory. The
  // per-row `country ?? ipCountry` fallback still has to be resolved here, but the number of
  // distinct pairs is bounded by geography instead of growing with traffic.
  const groups = await prisma.locationRecord.groupBy({
    by: ['country', 'ipCountry'],
    where: { link: { userId }, permissionStatus: 'GRANTED' },
    _count: { _all: true },
  });

  const counts = new Map<string, number>();
  for (const group of groups) {
    const key = group.country ?? group.ipCountry ?? 'Unknown';
    counts.set(key, (counts.get(key) ?? 0) + group._count._all);
  }

  return Array.from(counts.entries())
    .map(([country, count]) => ({ country, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);
}

export async function getAcceptanceRateChart(userId: string) {
  const [granted, denied] = await Promise.all([
    prisma.locationRecord.count({ where: { link: { userId }, permissionStatus: 'GRANTED' } }),
    prisma.locationRecord.count({ where: { link: { userId }, permissionStatus: 'DENIED' } }),
  ]);
  const total = granted + denied;
  return {
    granted,
    denied,
    acceptanceRate: total === 0 ? 0 : Math.round((granted / total) * 1000) / 10,
  };
}

export async function getActiveLinksChart(userId: string) {
  const links = await prisma.link.findMany({
    where: { userId },
    orderBy: { useCount: 'desc' },
    take: 8,
    select: { id: true, title: true, useCount: true },
  });
  return links.map((l) => ({ linkId: l.id, title: l.title, visits: l.useCount }));
}

export async function getActivityFeed(userId: string) {
  const records = await prisma.locationRecord.findMany({
    where: { link: { userId } },
    include: { link: { select: { title: true } } },
    orderBy: { createdAt: 'desc' },
    take: ACTIVITY_FEED_LIMIT,
  });

  return records.map((r) => ({
    id: r.id,
    linkId: r.linkId,
    linkTitle: r.link.title,
    permissionStatus: r.permissionStatus,
    displayAddress: r.displayAddress,
    city: r.city,
    country: r.country,
    createdAt: r.createdAt.toISOString(),
  }));
}
