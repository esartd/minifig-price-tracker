export { default } from 'next-auth/middleware';

export const config = {
  /*
   * Match all request paths except:
   * - / (homepage)
   * - /api/auth/* (auth endpoints)
   * - /themes/* (public theme browsing)
   * - /minifigs/* (public minifig detail pages)
   * - /search (public search)
   * - /about (public about page)
   * - /_next/* (Next.js internals)
   * - /favicon.svg
   * - /api/og (OpenGraph image)
   * - /api/categories (public API)
   * - /api/subcategories (public API)
   * - /api/minifigs/* (public API)
   * - /api/inventory/temp-pricing (public pricing)
   * - /api/price-history (public API)
   */
  matcher: [
    '/((?!api/auth|_next/static|_next/image|favicon.svg|api/og|api/categories|api/subcategories|api/minifigs|api/inventory/temp-pricing|api/price-history|themes|minifigs|search|about|$).*)',
  ],
};
