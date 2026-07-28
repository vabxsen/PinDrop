export type DeclineReason = 'user_denied' | 'timeout' | 'unsupported' | 'error';

export interface GeolocationSuccess {
  lat: number;
  lng: number;
  accuracy: number | null;
  capturedAt: string;
  timezone: string | null;
  language: string | null;
  screenResolution: string | null;
  viewportSize: string | null;
}

export function isGeolocationSupported(): boolean {
  return 'geolocation' in navigator;
}

export function requestLocation(): Promise<GeolocationSuccess> {
  return new Promise((resolve, reject) => {
    if (!isGeolocationSupported()) {
      reject(new Error('unsupported' satisfies DeclineReason));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy ?? null,
          capturedAt: new Date(position.timestamp).toISOString(),
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone ?? null,
          language: navigator.language ?? null,
          screenResolution: `${window.screen.width}x${window.screen.height}`,
          viewportSize: `${window.innerWidth}x${window.innerHeight}`,
        });
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED)
          reject(new Error('user_denied' satisfies DeclineReason));
        else if (error.code === error.TIMEOUT) reject(new Error('timeout' satisfies DeclineReason));
        else reject(new Error('error' satisfies DeclineReason));
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
    );
  });
}
