export interface MockVisitor {
  id: string;
  linkTitle: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  accuracyMeters: number;
  device: string;
  browser: string;
  os: string;
  timezone: string;
  status: 'granted' | 'denied';
  timeAgo: string;
}

export const mockLinkTitle = 'Weekend hike';

export const mockVisitors: MockVisitor[] = [
  {
    id: 'v1',
    linkTitle: mockLinkTitle,
    city: 'San Francisco',
    country: 'United States',
    lat: 37.7749,
    lng: -122.4194,
    accuracyMeters: 12,
    device: 'iPhone 15 Pro',
    browser: 'Safari 17.4',
    os: 'iOS 17.4',
    timezone: 'America/Los_Angeles',
    status: 'granted',
    timeAgo: '4s ago',
  },
  {
    id: 'v2',
    linkTitle: mockLinkTitle,
    city: 'London',
    country: 'United Kingdom',
    lat: 51.5072,
    lng: -0.1276,
    accuracyMeters: 18,
    device: 'MacBook Pro',
    browser: 'Chrome 129',
    os: 'macOS 15.1',
    timezone: 'Europe/London',
    status: 'granted',
    timeAgo: '41s ago',
  },
  {
    id: 'v3',
    linkTitle: mockLinkTitle,
    city: 'Austin',
    country: 'United States',
    lat: 30.2672,
    lng: -97.7431,
    accuracyMeters: 0,
    device: 'Pixel 8',
    browser: 'Chrome 129',
    os: 'Android 15',
    timezone: 'America/Chicago',
    status: 'denied',
    timeAgo: '2m ago',
  },
  {
    id: 'v4',
    linkTitle: mockLinkTitle,
    city: 'Tokyo',
    country: 'Japan',
    lat: 35.6762,
    lng: 139.6503,
    accuracyMeters: 9,
    device: 'Desktop',
    browser: 'Firefox 131',
    os: 'Windows 11',
    timezone: 'Asia/Tokyo',
    status: 'granted',
    timeAgo: '6m ago',
  },
];

export const primaryVisitor = mockVisitors[0]!;
