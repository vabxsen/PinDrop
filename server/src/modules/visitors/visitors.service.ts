import type { VisitorLocationInput, VisitorDeclineInput } from '@pindrop/shared';
import { prisma } from '../../lib/prisma.js';
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

export async function recordGrantedLocation(
  shortId: string,
  input: VisitorLocationInput,
  meta: VisitorRequestMeta,
) {
  const link = await assertLinkAcceptsVisits(shortId);
  const geo = await reverseGeocode(input.lat, input.lng);
  const ua = parseUserAgent(meta.userAgent);
  const ipCountry = lookupIpCountry(meta.ip);

  const [record] = await prisma.$transaction([
    prisma.locationRecord.create({
      data: {
        linkId: link.id,
        permissionStatus: 'GRANTED',
        lat: input.lat,
        lng: input.lng,
        accuracy: input.accuracy ?? null,
        capturedAt: input.capturedAt ? new Date(input.capturedAt) : new Date(),
        country: geo.country,
        state: geo.state,
        city: geo.city,
        postalCode: geo.postalCode,
        displayAddress: geo.displayAddress,
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
      },
    }),
    prisma.link.update({ where: { id: link.id }, data: { useCount: { increment: 1 } } }),
  ]);

  emitToUser(link.userId, 'location:received', {
    linkId: link.id,
    linkTitle: link.title,
    recordId: record.id,
    displayAddress: geo.displayAddress,
    createdAt: record.createdAt.toISOString(),
  });

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

  await prisma.$transaction([
    prisma.locationRecord.create({
      data: {
        linkId: link.id,
        permissionStatus: 'DENIED',
        ipCountry,
        ipAddressHash: hashIp(meta.ip),
        userAgent: meta.userAgent ?? null,
        browser: ua.browser,
        browserVersion: ua.browserVersion,
        os: ua.os,
        osVersion: ua.osVersion,
        deviceType: ua.deviceType,
      },
    }),
    prisma.link.update({ where: { id: link.id }, data: { useCount: { increment: 1 } } }),
  ]);

  emitToUser(link.userId, 'permission:denied', {
    linkId: link.id,
    linkTitle: link.title,
    reason: input.reason,
  });

  return { received: true };
}
