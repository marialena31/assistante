import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { SECURE_ROUTES } from './config/secureRoutes'

const ALLOWED_EMAIL_DOMAIN = '@marialena-pietri.fr'

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

  try {
    const { data: { user } } = await supabase.auth.getUser()

    // If user is trying to access auth pages while logged in
    if (pathname.startsWith('/auth-mlp2024') && user) {
      if (user.email?.endsWith(ALLOWED_EMAIL_DOMAIN)) {
        return NextResponse.redirect(new URL(SECURE_ROUTES.ADMIN, request.url))
      }
      return response
    }

    // If accessing admin pages while not logged in or not admin
    if (pathname.startsWith('/secure-dashboard-mlp2024')) {
      if (!user) {
        return NextResponse.redirect(new URL(SECURE_ROUTES.SIGNIN, request.url))
      }
      if (!user.email?.endsWith(ALLOWED_EMAIL_DOMAIN)) {
        await supabase.auth.signOut()
        return NextResponse.redirect(new URL(SECURE_ROUTES.SIGNIN, request.url))
      }
    }

    return response
  } catch (error) {
    console.error('Auth error:', error)
    // Only redirect to signin if trying to access protected routes
    if (pathname.startsWith('/secure-dashboard-mlp2024')) {
      return NextResponse.redirect(new URL(SECURE_ROUTES.SIGNIN, request.url))
    }
    return response
  }
}

export const config = {
  matcher: [
    '/secure-dashboard-mlp2024/:path*',
    '/auth-mlp2024/:path*'
  ],
}
