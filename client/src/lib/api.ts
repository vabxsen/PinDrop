import { CSRF_COOKIE_NAME } from '@pindrop/shared';
import type {
  ApiErrorResponse,
  ChangePasswordInput,
  CreateLinkInput,
  DashboardStatsDTO,
  ForgotPasswordInput,
  GoogleLoginInput,
  LinkDTO,
  LinkPublicMetaDTO,
  LocationRecordDTO,
  LoginInput,
  PaginatedDTO,
  RegisterInput,
  ResetPasswordInput,
  SetLinkDisabledInput,
  Theme,
  UpdateLinkInput,
  UpdateProfileInput,
  UserDTO,
  VisitorDeclineInput,
  VisitorLocationInput,
} from '@pindrop/shared';

// Empty string in production: Firebase Hosting rewrites /api/** to the API on
// whichever domain served the page (web.app, firebaseapp.com, or a future custom
// domain), so a relative path keeps requests same-origin everywhere instead of
// pinning them to one hard-coded host.
const API_BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? '';

export interface AuthSession {
  user: UserDTO;
  accessToken: string;
  csrfToken: string;
}

let accessToken: string | null = null;
let csrfToken: string | null = null;

export function setAuthTokens(tokens: { accessToken: string; csrfToken: string } | null) {
  accessToken = tokens?.accessToken ?? null;
  csrfToken = tokens?.csrfToken ?? null;
}

export function getAccessToken() {
  return accessToken;
}

function readCsrfCookie(): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${CSRF_COOKIE_NAME}=([^;]*)`));
  return match?.[1] ? decodeURIComponent(match[1]) : null;
}

export class ApiError extends Error {
  status: number;
  fieldErrors?: Record<string, string[]>;

  constructor(status: number, message: string, fieldErrors?: Record<string, string[]>) {
    super(message);
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

interface RequestOptions {
  method?: string;
  body?: unknown;
  auth?: boolean;
  csrf?: boolean;
  signal?: AbortSignal;
}

async function rawRequest<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = {};
  if (opts.body !== undefined) headers['Content-Type'] = 'application/json';
  if (opts.auth && accessToken) headers.Authorization = `Bearer ${accessToken}`;
  if (opts.csrf) {
    const token = csrfToken ?? readCsrfCookie();
    if (token) headers['x-csrf-token'] = token;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method: opts.method ?? 'GET',
    headers,
    credentials: 'include',
    body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
    signal: opts.signal,
  });

  if (res.status === 204) return undefined as T;

  const contentType = res.headers.get('content-type') ?? '';
  const data = contentType.includes('application/json') ? await res.json() : await res.text();

  if (!res.ok) {
    const err = data as ApiErrorResponse;
    throw new ApiError(res.status, err?.message ?? 'Something went wrong', err?.errors);
  }

  return data as T;
}

let refreshPromise: Promise<AuthSession | null> | null = null;

async function refreshSession(): Promise<AuthSession | null> {
  if (!refreshPromise) {
    refreshPromise = rawRequest<AuthSession>('/api/auth/refresh', { method: 'POST', csrf: true })
      .then((session) => {
        setAuthTokens(session);
        return session;
      })
      .catch(() => {
        setAuthTokens(null);
        return null;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

async function apiRequest<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  const withAuth = opts.auth ?? true;
  try {
    return await rawRequest<T>(path, { ...opts, auth: withAuth });
  } catch (err) {
    if (withAuth && err instanceof ApiError && err.status === 401) {
      const refreshed = await refreshSession();
      if (refreshed) {
        return rawRequest<T>(path, { ...opts, auth: true });
      }
    }
    throw err;
  }
}

function toQuery(params: Record<string, string | number | undefined>): string {
  const entries = Object.entries(params).filter(([, v]) => v !== undefined && v !== '');
  if (entries.length === 0) return '';
  const search = new URLSearchParams(entries.map(([k, v]) => [k, String(v)]));
  return `?${search.toString()}`;
}

export const authApi = {
  register: (input: RegisterInput) =>
    rawRequest<AuthSession>('/api/auth/register', { method: 'POST', body: input }),
  login: (input: LoginInput) =>
    rawRequest<AuthSession>('/api/auth/login', { method: 'POST', body: input }),
  googleLogin: (input: GoogleLoginInput) =>
    rawRequest<AuthSession>('/api/auth/google', { method: 'POST', body: input }),
  refresh: refreshSession,
  logout: () => rawRequest<void>('/api/auth/logout', { method: 'POST', csrf: true }),
  me: () => apiRequest<{ user: UserDTO }>('/api/auth/me'),
  forgotPassword: (input: ForgotPasswordInput) =>
    rawRequest<{ message: string }>('/api/auth/forgot-password', { method: 'POST', body: input }),
  resetPassword: (input: ResetPasswordInput) =>
    rawRequest<{ message: string }>('/api/auth/reset-password', { method: 'POST', body: input }),
};

export const linksApi = {
  list: () => apiRequest<{ items: LinkDTO[] }>('/api/links'),
  get: (id: string) => apiRequest<{ link: LinkDTO }>(`/api/links/${id}`),
  create: (input: CreateLinkInput) =>
    apiRequest<{ link: LinkDTO }>('/api/links', { method: 'POST', body: input }),
  update: (id: string, input: UpdateLinkInput) =>
    apiRequest<{ link: LinkDTO }>(`/api/links/${id}`, { method: 'PATCH', body: input }),
  setDisabled: (id: string, input: SetLinkDisabledInput) =>
    apiRequest<{ link: LinkDTO }>(`/api/links/${id}/disable`, { method: 'PATCH', body: input }),
  duplicate: (id: string) =>
    apiRequest<{ link: LinkDTO }>(`/api/links/${id}/duplicate`, { method: 'POST' }),
  remove: (id: string) => apiRequest<void>(`/api/links/${id}`, { method: 'DELETE' }),
};

export const locationsApi = {
  list: (query: { linkId?: string; search?: string; page?: number; pageSize?: number }) =>
    apiRequest<PaginatedDTO<LocationRecordDTO>>(`/api/locations${toQuery(query)}`),
  remove: (id: string) => apiRequest<void>(`/api/locations/${id}`, { method: 'DELETE' }),
  exportCsv: async (query: { linkId?: string; search?: string }) => {
    const headers: Record<string, string> = {};
    if (accessToken) headers.Authorization = `Bearer ${accessToken}`;
    const res = await fetch(`${API_BASE}/api/locations/export.csv${toQuery(query)}`, {
      headers,
      credentials: 'include',
    });
    if (!res.ok) throw new ApiError(res.status, 'Failed to export CSV');
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pindrop-locations.csv';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  },
};

export interface DailyLocationsPoint {
  date: string;
  count: number;
}
export interface TopCountryPoint {
  country: string;
  count: number;
}
export interface ActiveLinkPoint {
  linkId: string;
  title: string;
  visits: number;
}
export interface AcceptanceRate {
  granted: number;
  denied: number;
  acceptanceRate: number;
}
export interface ActivityItem {
  id: string;
  linkId: string;
  linkTitle: string;
  permissionStatus: 'GRANTED' | 'DENIED';
  displayAddress: string | null;
  city: string | null;
  country: string | null;
  createdAt: string;
}

export const dashboardApi = {
  stats: () => apiRequest<DashboardStatsDTO>('/api/dashboard/stats'),
  dailyLocations: () =>
    apiRequest<{ items: DailyLocationsPoint[] }>('/api/dashboard/charts/daily-locations'),
  topCountries: () =>
    apiRequest<{ items: TopCountryPoint[] }>('/api/dashboard/charts/top-countries'),
  acceptanceRate: () => apiRequest<AcceptanceRate>('/api/dashboard/charts/acceptance-rate'),
  activeLinks: () => apiRequest<{ items: ActiveLinkPoint[] }>('/api/dashboard/charts/active-links'),
  activity: () => apiRequest<{ items: ActivityItem[] }>('/api/dashboard/activity'),
};

export const settingsApi = {
  updateProfile: (input: UpdateProfileInput) =>
    apiRequest<{ user: UserDTO }>('/api/settings/profile', { method: 'PATCH', body: input }),
  changePassword: (input: ChangePasswordInput) =>
    apiRequest<{ message: string }>('/api/settings/password', { method: 'PATCH', body: input }),
  updateTheme: (theme: Theme) =>
    apiRequest<{ user: UserDTO }>('/api/settings/theme', { method: 'PATCH', body: { theme } }),
  deleteAccount: (password: string) =>
    apiRequest<void>('/api/settings/account', { method: 'DELETE', body: { password } }),
};

export const visitorApi = {
  getMeta: (shortId: string) => rawRequest<LinkPublicMetaDTO>(`/api/l/${shortId}`),
  submitLocation: (shortId: string, input: VisitorLocationInput) =>
    rawRequest<{ received: boolean }>(`/api/l/${shortId}/location`, {
      method: 'POST',
      body: input,
    }),
  decline: (shortId: string, input: VisitorDeclineInput) =>
    rawRequest<{ received: boolean }>(`/api/l/${shortId}/decline`, { method: 'POST', body: input }),
};
