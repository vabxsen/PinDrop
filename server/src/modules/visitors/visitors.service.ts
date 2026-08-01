import type { Link, Prisma } from '@prisma/client';
import type { VisitorLocationInput, VisitorDeclineInput } from '@pindrop/shared';
import { prisma } from '../../lib/prisma.js';
import { logger } from '../../lib/logger.js';
import { notFound, conflict } from '../../lib/httpError.js';
import { computeLinkStatus } from '../links/links.mapper.js';
import { toLinkPublicMetaDTO } from './visitors.mapper.js';
import { reverseGeocode } from '../../services/geocode.service.js';
import { lookupIpCountry, hashIp } from '../../services/geoip.service.js';
import { parseUserAgent } from '../../services/useragent.service.js';
import { emitToUser } from '../../lib/socket.js';

async function getUsableLink(shortId: string) {
  const link = await prisma.link.findUnique({ where: { shortId } });
  if (!link) throw notFound('This link does not exist');
  return link;
}

export async function getPublicLinkMeta(shortId: string) {
  const link = await getUsableLink(shortId);
  return toLinkPublicMetaDTO(link);
}

interface VisitorRequestMeta {
  ip: string | undefined;
  userAgent: string | undefined;
}

async function assertLinkAcceptsVisits(shortId: string) {
  const link = await getUsableLink(shortId);
  const status = computeLinkStatus(link);
  if (status !== 'ACTIVE') {
    throw conflict(`This link is no longer active (${status.toLowerCase().replace('_', ' ')})`);
  }
  return link;
}

// assertLinkAcceptsVisits only *reads* useCount, so two submissions arriving together can
// both see room under maxUses and both write, pushing the link past its cap. Re-checking the
// limit inside the UPDATE's WHERE makes the database the arbiter instead: exactly one of them
// matches a row, and a claim that matches none means someone else took the last slot.
async function claimUseAndRecord(
  link: Link,
  data: Omit<Prisma.LocationRecordUncheckedCreateInput, 'linkId'>,
) {
  return prisma.$transaction(async (tx) => {
    const claimed = await tx.link.updateMany({
      where: {
        id: link.id,
        disabled: false,
        OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
        ...(link.maxUses !== null ? { useCount: { lt: link.maxUses } } : {}),
      },
      data: { useCount: { increment: 1 } },
    });

    if (claimed.count === 0) {
      throw conflict('This link is no longer active (max uses reached)');
    }

    return tx.locationRecord.create({ data: { ...data, linkId: link.id } });
  });
}

// Reverse geocoding goes through a global 1 req/sec queue (Nominatim's usage policy), so
// awaiting it before the write would stall each visitor behind every other submission in
// flight — an unbounded wait the fetch timeout doesn't cover. Record and notify first, then
// backfill the address and tell the dashboard to refetch once it lands.
function backfillAddress(
  record: { id: string; linkId: string },
  userId: string,
  lat: number,
  lng: number,
) {
  void reverseGeocode(lat, lng)
    .then(async (geo) => {
      if (!geo.displayAddress && !geo.country && !geo.city) return;
      await prisma.locationRecord.update({
        where: { id: record.id },
        data: {
          country: geo.country,
          state: geo.state,
          city: geo.city,
          postalCode: geo.postalCode,
          displayAddress: geo.displayAddress,
        },
      });
      emitToUser(userId, 'location:enriched', { linkId: record.linkId, recordId: record.id });
    })
    .catch((err: unknown) => {
      // The owner may have deleted the record while we were queued; nothing to repair.
      logger.warn({ err, recordId: record.id }, 'Failed to backfill reverse-geocoded address');
    });
}

export async function recordGrantedLocation(
  shortId: string,
  input: VisitorLocationInput,
  meta: VisitorRequestMeta,
) {
  const link = await assertLinkAcceptsVisits(shortId);
  const ua = parseUserAgent(meta.userAgent);
  const ipCountry = lookupIpCountry(meta.ip);

  const record = await claimUseAndRecord(link, {
    permissionStatus: 'GRANTED',
    lat: input.lat,
    lng: input.lng,
    accuracy: input.accuracy ?? null,
    capturedAt: input.capturedAt ? new Date(input.capturedAt) : new Date(),
    ipCountry,
    ipAddressHash: hashIp(meta.ip),
    timezone: input.timezone ?? null,
    language: input.language ?? null,
    userAgent: meta.userAgent ?? null,
    browser: ua.browser,
    browserVersion: ua.browserVersion,
    os: ua.os,
    osVersion: ua.osVersion,
    deviceType: ua.deviceType,
    screenResolution: input.screenResolution ?? null,
    viewportSize: input.viewportSize ?? null,
  });

  emitToUser(link.userId, 'location:received', {
    linkId: link.id,
    linkTitle: link.title,
    recordId: record.id,
    createdAt: record.createdAt.toISOString(),
  });

  backfillAddress(record, link.userId, input.lat, input.lng);

  return { received: true };
}

export async function recordDeclinedVisit(
  shortId: string,
  input: VisitorDeclineInput,
  meta: VisitorRequestMeta,
) {
  const link = await assertLinkAcceptsVisits(shortId);
  const ua = parseUserAgent(meta.userAgent);
  const ipCountry = lookupIpCountry(meta.ip);

  await claimUseAndRecord(link, {
    permissionStatus: 'DENIED',
    ipCountry,
    ipAddressHash: hashIp(meta.ip),
    userAgent: meta.userAgent ?? null,
    browser: ua.browser,
    browserVersion: ua.browserVersion,
    os: ua.os,
    osVersion: ua.osVersion,
    deviceType: ua.deviceType,
  });

  emitToUser(link.userId, 'permission:denied', {
    linkId: link.id,
    linkTitle: link.title,
    reason: input.reason,
  });

  return { received: true };
}
