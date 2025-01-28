import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { SECURE_ROUTES } from './config/secureRoutes'

export async function middleware(request: NextRequest) {
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
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  const { pathname } = request.nextUrl

  // Check if the route is an admin route
  if (pathname.startsWith('/secure-dashboard-mlp2024')) {
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    // If there's no user or there's an error, redirect to login
    if (!user || userError) {
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = SECURE_ROUTES.SIGNIN
      return NextResponse.redirect(redirectUrl)
    }

    // Check if user has the correct email domain
    if (!user.email?.endsWith('@marialena-pietri.fr')) {
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = SECURE_ROUTES.SIGNIN
      return NextResponse.redirect(redirectUrl)
    }
  }

  // If the route is a login route and user is already logged in, redirect to admin
  if (pathname === SECURE_ROUTES.SIGNIN) {
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (user && !userError && user.email?.endsWith('@marialena-pietri.fr')) {
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = SECURE_ROUTES.ADMIN
      return NextResponse.redirect(redirectUrl)
    }
  }

  return response
}

export const config = {
  matcher: [
    '/secure-dashboard-mlp2024/:path*',
    '/auth-mlp2024/:path*'
  ],
}
