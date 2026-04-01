import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isAuthPage = req.nextUrl.pathname.startsWith('/auth');
  const isPublicPage = req.nextUrl.pathname === '/' ||
                       req.nextUrl.pathname.startsWith('/search') ||
                       req.nextUrl.pathname.startsWith('/minifig') ||
                       req.nextUrl.pathname.startsWith('/about');
  const isProtectedPage = req.nextUrl.pathname.startsWith('/inventory') ||
                          req.nextUrl.pathname.startsWith('/account');

  // Allow public access to home, search, minifig detail, and about pages
  if (isPublicPage) {
    return NextResponse.next();
  }

  // Protected pages require login
  if (isProtectedPage && !isLoggedIn) {
    const signInUrl = new URL('/auth/signin', req.nextUrl.origin);
    return NextResponse.redirect(signInUrl);
  }

  // If not logged in and not on auth page or public page, redirect to sign-in
  if (!isLoggedIn && !isAuthPage && !isPublicPage) {
    const signInUrl = new URL('/auth/signin', req.nextUrl.origin);
    return NextResponse.redirect(signInUrl);
  }

  // If logged in and on auth page, redirect to search
  if (isLoggedIn && isAuthPage) {
    const searchUrl = new URL('/search', req.nextUrl.origin);
    return NextResponse.redirect(searchUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!api/auth|api/minifigs|_next/static|_next/image|favicon.ico|uploads).*)'],
};
