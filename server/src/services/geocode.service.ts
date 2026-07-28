import PQueue from 'p-queue';
import { prisma } from '../lib/prisma.js';
import { env } from '../config/env.js';
import { logger } from '../lib/logger.js';

export interface GeocodeResult {
  country: string | null;
  state: string | null;
  city: string | null;
  postalCode: string | null;
  displayAddress: string | null;
}

interface NominatimAddress {
  country?: string;
  state?: string;
  city?: string;
  town?: string;
  village?: string;
  postcode?: string;
}

interface NominatimResponse {
  display_name?: string;
  address?: NominatimAddress;
}

// Nominatim's usage policy caps free reverse-geocoding calls at 1 request/second,
// globally, regardless of how many visitor submissions arrive concurrently.
const queue = new PQueue({
  concurrency: 1,
  interval: env.NOMINATIM_MIN_INTERVAL_MS,
  intervalCap: 1,
});

const EMPTY_RESULT: GeocodeResult = {
  country: null,
  state: null,
  city: null,
  postalCode: null,
  displayAddress: null,
};

function round(n: number): number {
  return Math.round(n * 10_000) / 10_000; // ~11m precision, stable cache key
}

function mapAddress(payload: NominatimResponse): GeocodeResult {
  const address = payload.address ?? {};
  return {
    country: address.country ?? null,
    state: address.state ?? null,
    city: address.city ?? address.town ?? address.village ?? null,
    postalCode: address.postcode ?? null,
    displayAddress: payload.display_name ?? null,
  };
}

async function fetchFromNominatim(lat: number, lng: number): Promise<NominatimResponse> {
  const url = new URL('/reverse', env.NOMINATIM_BASE_URL);
  url.searchParams.set('format', 'jsonv2');
  url.searchParams.set('lat', String(lat));
  url.searchParams.set('lon', String(lng));
  url.searchParams.set('zoom', '18');
  url.searchParams.set('addressdetails', '1');

  const response = await fetch(url, {
    headers: { 'User-Agent': env.NOMINATIM_USER_AGENT },
    signal: AbortSignal.timeout(8000),
  });

  if (!response.ok) {
    throw new Error(`Nominatim responded with ${response.status}`);
  }

  return (await response.json()) as NominatimResponse;
}

export async function reverseGeocode(lat: number, lng: number): Promise<GeocodeResult> {
  const latRounded = round(lat);
  const lngRounded = round(lng);

  const cached = await prisma.nominatimCache.findUnique({
    where: { latRounded_lngRounded: { latRounded, lngRounded } },
  });

  const cacheTtlMs = env.NOMINATIM_CACHE_TTL_DAYS * 24 * 60 * 60 * 1000;
  if (cached && Date.now() - cached.fetchedAt.getTime() < cacheTtlMs) {
    return mapAddress(cached.responseJson as NominatimResponse);
  }

  try {
    const payload = await queue.add(() => fetchFromNominatim(lat, lng));
    if (!payload) return EMPTY_RESULT;

    await prisma.nominatimCache.upsert({
      where: { latRounded_lngRounded: { latRounded, lngRounded } },
      update: { responseJson: payload as object, fetchedAt: new Date() },
      create: { latRounded, lngRounded, responseJson: payload as object },
    });

    return mapAddress(payload);
  } catch (err) {
    // Never let a third-party outage block the visitor-facing thank-you page; the
    // location itself (lat/lng/accuracy) is already captured regardless.
    logger.warn({ err, lat, lng }, 'Nominatim reverse geocode failed');
    return EMPTY_RESULT;
  }
}
