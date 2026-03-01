import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || ''

  const isMainDomain =
    hostname === 'beautyglow.tn' ||
    hostname === 'www.beautyglow.tn' ||
    hostname === 'beautyglow-nine.vercel.app' ||
    hostname.startsWith('localhost')

  if (!isMainDomain) {
    const subdomain = hostname.split('.')[0]
    if (subdomain && subdomain !== 'www') {
      return NextResponse.rewrite(
        new URL(`/sites/${subdomain}${request.nextUrl.pathname}`, request.url)
      )
    }
  }

  const supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const isProtectedRoute = request.nextUrl.pathname.startsWith('/dashboard')
  if (isProtectedRoute && !user) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
}
