import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'
import { SECURE_ROUTES } from '../../config/secureRoutes';

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
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
    }
  )

  // Refresh session if expired - required for Server Components
  const { data: { user } } = await supabase.auth.getUser()

  // If accessing auth pages while logged in, redirect to admin
  if (request.nextUrl.pathname.startsWith('/auth-mlp2024')) {
    if (user?.email?.endsWith('@marialena-pietri.fr')) {
      return NextResponse.redirect(new URL(SECURE_ROUTES.ADMIN, request.url))
    }
    return response
  }

  // If accessing admin pages while not logged in or not admin, redirect to login
  if (request.nextUrl.pathname.startsWith('/secure-dashboard-mlp2024')) {
    if (!user) {
      return NextResponse.redirect(new URL(SECURE_ROUTES.LOGIN, request.url))
    }
    if (!user.email?.endsWith('@marialena-pietri.fr')) {
      await supabase.auth.signOut()
      return NextResponse.redirect(new URL(SECURE_ROUTES.LOGIN, request.url))
    }
  }

  return response
}

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    '/auth-mlp2024/:path*',
    '/secure-dashboard-mlp2024/:path*'
  ],
}
