import { UAParser } from 'ua-parser-js';
import type { DeviceType } from '@pindrop/shared';

export interface ParsedUserAgent {
  browser: string | null;
  browserVersion: string | null;
  os: string | null;
  osVersion: string | null;
  deviceType: DeviceType;
}

export function parseUserAgent(userAgent: string | undefined): ParsedUserAgent {
  if (!userAgent) {
    return {
      browser: null,
      browserVersion: null,
      os: null,
      osVersion: null,
      deviceType: 'UNKNOWN',
    };
  }

  const result = new UAParser(userAgent).getResult();

  let deviceType: DeviceType = 'DESKTOP';
  if (result.device.type === 'mobile') deviceType = 'MOBILE';
  else if (result.device.type === 'tablet') deviceType = 'TABLET';
  else if (result.device.type && result.device.type !== 'smarttv') deviceType = 'UNKNOWN';

  return {
    browser: result.browser.name ?? null,
    browserVersion: result.browser.version ?? null,
    os: result.os.name ?? null,
    osVersion: result.os.version ?? null,
    deviceType,
  };
}
