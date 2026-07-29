import { doubleCsrf } from 'csrf-csrf';
import { CSRF_COOKIE_NAME, CSRF_HEADER_NAME } from '@pindrop/shared';
import { env, isProd } from '../config/env.js';

// Only /api/auth/refresh and /api/auth/logout are cookie-authenticated (everything
// else uses the Bearer access token, which classic CSRF cannot forge).
//
// This app has no server-side session store, so getSessionIdentifier is a fixed
// constant rather than something derived from the (rotating) refresh-token cookie:
// binding it to the refresh token would make the HMAC computed at generation time
// (before the browser has echoed back a freshly-rotated cookie) disagree with the HMAC
// recomputed at validation time on the *next* request, breaking every refresh. Security
// comes from the double-submit itself: a forging page can trigger a cross-site request
// that carries the cookie, but it cannot *read* the victim's cookie value (blocked by
// the browser's same-origin policy) to also set a matching x-csrf-token header, so the
// forged request fails validation regardless of SameSite. Client and API are same-origin
// in production (Firebase Hosting rewrites /api/** to this Cloud Run service), so Lax
// is used everywhere — see setRefreshCookie in auth.controller.ts for the matching
// refresh-token cookie.
//
// The CSRF cookie is intentionally NOT httpOnly: same-origin JS reads its value
// directly and mirrors it into the x-csrf-token header. That's what lets a returning
// "remember me" session restore itself via /auth/refresh on page load using only the
// persisted cookies, with no reliance on in-memory state a browser restart would have
// already discarded.
export const { generateCsrfToken, doubleCsrfProtection } = doubleCsrf({
  getSecret: () => env.CSRF_SECRET,
  getSessionIdentifier: () => 'pindrop',
  cookieName: CSRF_COOKIE_NAME,
  cookieOptions: {
    httpOnly: false,
    sameSite: 'lax',
    secure: isProd,
    path: '/',
    // Cookies with no explicit expiry are wiped when the browser fully closes, which
    // would silently break "remember me" restore even though the (longer-lived)
    // refresh-token cookie survives. Match the longest possible remember-me window.
    maxAge: env.JWT_REFRESH_EXPIRES_IN_REMEMBER_DAYS * 24 * 60 * 60 * 1000,
  },
  getCsrfTokenFromRequest: (req) => req.headers[CSRF_HEADER_NAME] as string | undefined,
});
