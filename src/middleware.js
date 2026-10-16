import { NextResponse } from 'next/server';
import { encryptRoute, decryptRoute } from './lib/routeCipher';

// Public pages to be encrypted in the browser address bar
const ENCRYPTED_TARGETS = [
  '/portfolio',
  '/services',
  '/about',
  '/contact',
  '/faq',
  '/packages',
  '/order',
  '/docs',
];

export function middleware(request) {
  const { pathname, search } = request.nextUrl;

  // 1. Skip system routes, Next internals, api, admin, assets
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/auth') ||
    pathname.startsWith('/login') ||
    pathname.includes('.') // static files like favicon.ico, images, svg
  ) {
    return NextResponse.next();
  }

  // 2. Handling incoming encrypted URL: /e/:token
  if (pathname.startsWith('/e/')) {
    const token = pathname.slice(3); // remove '/e/'
    const originalPath = decryptRoute(token);

    if (originalPath) {
      // Rewrite the URL internally to the real page while preserving the encrypted address in the browser
      const destination = new URL(originalPath + search, request.url);
      return NextResponse.rewrite(destination);
    }
  }

  // 3. Handling plain public URLs (e.g. user visits /portfolio or /services directly)
  const isTarget = ENCRYPTED_TARGETS.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + '/')
  );

  if (isTarget) {
    const token = encryptRoute(pathname);
    const encryptedUrl = new URL(`/e/${token}${search}`, request.url);
    // 308 permanent redirect so browser URL immediately transforms to encrypted token
    return NextResponse.redirect(encryptedUrl, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - icon.svg
     */
    '/((?!_next/static|_next/image|favicon.ico|icon.svg).*)',
  ],
};
