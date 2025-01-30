import { createServerClient, type CookieOptions } from '@supabase/ssr';
import type { Database } from '../../types/database';
import { type NextRequest, NextResponse } from 'next/server'
import { SECURE_ROUTES } from '../../config/secureRoutes';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient<Database, 'api'>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
      db: {
        schema: 'api'
      }
    }
  )

  // Always use getUser() in middleware as per Supabase docs
  const { data: { user }, error } = await supabase.auth.getUser()

  // Handle auth redirects
  const path = request.nextUrl.pathname
  
  // If accessing secure routes without auth
  if (path.startsWith('/secure-dashboard-mlp2024')) {
    if (!user?.email?.endsWith('@marialena-pietri.fr')) {
      const redirectUrl = new URL('/auth-mlp2024/signin', request.url)
      redirectUrl.searchParams.set('returnUrl', path)
      return NextResponse.redirect(redirectUrl)
    }
  }

  // If accessing auth pages while already authenticated
  if (path.startsWith('/auth-mlp2024') && !path.includes('/callback')) {
    if (user?.email?.endsWith('@marialena-pietri.fr')) {
      return NextResponse.redirect(new URL(SECURE_ROUTES.ADMIN, request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    '/auth-mlp2024/:path*',
    '/secure-dashboard-mlp2024/:path*',
  ],
}
