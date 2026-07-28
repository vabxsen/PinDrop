// Name of the JS-readable double-submit CSRF cookie. The client reads this cookie
// directly and mirrors its value into the CSRF_HEADER_NAME header on requests to the
// two cookie-authenticated endpoints (auth/refresh, auth/logout).
export const CSRF_COOKIE_NAME = 'pindrop_csrf_token';
export const CSRF_HEADER_NAME = 'x-csrf-token';
