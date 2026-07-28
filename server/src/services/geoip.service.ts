import geoip from 'geoip-lite';
import { createHash } from 'node:crypto';

export function lookupIpCountry(ip: string | undefined): string | null {
  if (!ip) return null;
  // Strip an IPv4-mapped IPv6 prefix (::ffff:1.2.3.4) so geoip-lite's IPv4 DB matches.
  const normalized = ip.replace(/^::ffff:/, '');
  const result = geoip.lookup(normalized);
  return result?.country ?? null;
}

export function hashIp(ip: string | undefined): string | null {
  if (!ip) return null;
  return createHash('sha256').update(ip).digest('hex');
}
