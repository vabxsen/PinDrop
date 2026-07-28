import type { Prisma } from '@prisma/client';
import type { ListLocationsQuery } from '@pindrop/shared';
import { prisma } from '../../lib/prisma.js';
import { forbidden, notFound } from '../../lib/httpError.js';
import { toLocationRecordDTO } from './locations.mapper.js';

function buildWhere(userId: string, query: Pick<ListLocationsQuery, 'linkId' | 'search'>) {
  const where: Prisma.LocationRecordWhereInput = {
    link: { userId, ...(query.linkId ? { id: query.linkId } : {}) },
  };

  if (query.search) {
    const s = query.search;
    where.OR = [
      { displayAddress: { contains: s, mode: 'insensitive' } },
      { city: { contains: s, mode: 'insensitive' } },
      { state: { contains: s, mode: 'insensitive' } },
      { country: { contains: s, mode: 'insensitive' } },
      { browser: { contains: s, mode: 'insensitive' } },
      { os: { contains: s, mode: 'insensitive' } },
      { link: { title: { contains: s, mode: 'insensitive' } } },
    ];
  }

  return where;
}

export async function listLocations(userId: string, query: ListLocationsQuery) {
  const where = buildWhere(userId, query);

  const [records, total] = await Promise.all([
    prisma.locationRecord.findMany({
      where,
      include: { link: { select: { title: true } } },
      orderBy: { createdAt: 'desc' },
      skip: (query.page - 1) * query.pageSize,
      take: query.pageSize,
    }),
    prisma.locationRecord.count({ where }),
  ]);

  return {
    items: records.map(toLocationRecordDTO),
    total,
    page: query.page,
    pageSize: query.pageSize,
  };
}

export async function* iterateLocationsForExport(
  userId: string,
  query: Pick<ListLocationsQuery, 'linkId' | 'search'>,
) {
  const where = buildWhere(userId, query);
  const pageSize = 500;
  let cursor: string | undefined;

  for (;;) {
    const records = await prisma.locationRecord.findMany({
      where,
      include: { link: { select: { title: true } } },
      orderBy: { id: 'asc' },
      take: pageSize,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
    });

    if (records.length === 0) return;

    for (const record of records) {
      yield toLocationRecordDTO(record);
    }

    cursor = records[records.length - 1]?.id;
    if (records.length < pageSize) return;
  }
}

export async function deleteLocation(userId: string, id: string) {
  const record = await prisma.locationRecord.findUnique({
    where: { id },
    include: { link: { select: { userId: true } } },
  });
  if (!record) throw notFound('Location record not found');
  if (record.link.userId !== userId) throw forbidden('You do not have access to this record');

  await prisma.locationRecord.delete({ where: { id } });
}
