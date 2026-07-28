import type { DeviceType, PermissionStatus, Theme } from './enums.js';

export interface UserDTO {
  id: string;
  email: string;
  name: string | null;
  theme: Theme;
  hasPassword: boolean;
  createdAt: string;
}

export interface AuthResponseDTO {
  user: UserDTO;
  accessToken: string;
}

export interface LinkDTO {
  id: string;
  shortId: string;
  title: string;
  description: string | null;
  notes: string | null;
  expiresAt: string | null;
  maxUses: number | null;
  useCount: number;
  disabled: boolean;
  createdAt: string;
  updatedAt: string;
  permissionGrantedCount: number;
  permissionDeniedCount: number;
  latestVisitorAt: string | null;
  status: 'ACTIVE' | 'EXPIRED' | 'DISABLED' | 'MAX_USES_REACHED';
}

export interface LinkPublicMetaDTO {
  title: string;
  description: string | null;
  status: 'ACTIVE' | 'EXPIRED' | 'DISABLED' | 'MAX_USES_REACHED';
}

export interface LocationRecordDTO {
  id: string;
  linkId: string;
  linkTitle: string;
  permissionStatus: PermissionStatus;
  lat: number | null;
  lng: number | null;
  accuracy: number | null;
  capturedAt: string | null;
  country: string | null;
  state: string | null;
  city: string | null;
  postalCode: string | null;
  displayAddress: string | null;
  ipCountry: string | null;
  timezone: string | null;
  language: string | null;
  browser: string | null;
  browserVersion: string | null;
  os: string | null;
  osVersion: string | null;
  deviceType: DeviceType;
  screenResolution: string | null;
  viewportSize: string | null;
  createdAt: string;
}

export interface DashboardStatsDTO {
  totalLinks: number;
  locationsReceived: number;
  pendingLinks: number;
  permissionDeniedCount: number;
}

export interface PaginatedDTO<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ApiErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}
