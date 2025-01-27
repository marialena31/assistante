import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // Refresh session if expired - required for Server Components
  await supabase.auth.getSession();

  // Allow access to auth callback
  if (req.nextUrl.pathname.startsWith('/auth/callback')) {
    return res;
  }

  // Protect admin routes
  if (req.nextUrl.pathname.startsWith('/admin')) {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    // Allow access to login page
    if (req.nextUrl.pathname === '/admin/login') {
      if (session) {
        // If user is signed in, redirect to admin dashboard
        return NextResponse.redirect(new URL('/admin', req.url));
      }
      return res;
    }

    // Allow access to reset-password page
    if (req.nextUrl.pathname === '/admin/reset-password') {
      if (!session) {
        // If no session, redirect to login
        return NextResponse.redirect(new URL('/admin/login', req.url));
      }
      return res;
    }

    // Check auth status for other admin pages
    if (!session) {
      // If user is not signed in, redirect to login page
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
  }

  return res;
}

// Ensure the middleware is only called for relevant paths
export const config = {
  matcher: ['/admin/:path*', '/auth/callback'],
};
