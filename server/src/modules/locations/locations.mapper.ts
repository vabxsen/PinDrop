import type { LocationRecord, Link } from '@prisma/client';
import type { LocationRecordDTO } from '@pindrop/shared';

type LocationWithLink = LocationRecord & { link: Pick<Link, 'title'> };

export function toLocationRecordDTO(record: LocationWithLink): LocationRecordDTO {
  return {
    id: record.id,
    linkId: record.linkId,
    linkTitle: record.link.title,
    permissionStatus: record.permissionStatus,
    lat: record.lat,
    lng: record.lng,
    accuracy: record.accuracy,
    capturedAt: record.capturedAt ? record.capturedAt.toISOString() : null,
    country: record.country,
    state: record.state,
    city: record.city,
    postalCode: record.postalCode,
    displayAddress: record.displayAddress,
    ipCountry: record.ipCountry,
    timezone: record.timezone,
    language: record.language,
    browser: record.browser,
    browserVersion: record.browserVersion,
    os: record.os,
    osVersion: record.osVersion,
    deviceType: record.deviceType,
    screenResolution: record.screenResolution,
    viewportSize: record.viewportSize,
    createdAt: record.createdAt.toISOString(),
  };
}
