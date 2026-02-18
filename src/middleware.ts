// src/middleware.ts
// Runs on every request BEFORE the page loads
// Protects /dashboard routes — redirects to /auth/login if not authenticated
// Also handles subdomain routing (will be expanded in Day 8)

import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const supabaseResponse = NextResponse.next({ request })

  // Create supabase client inside middleware
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

  // Get current user session
  const { data: { user } } = await supabase.auth.getUser()

  // If user is not logged in and tries to access /dashboard → redirect to login
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/dashboard')
  if (isProtectedRoute && !user) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  return supabaseResponse
}

// Which routes this middleware runs on
export const config = {
  matcher: ['/dashboard/:path*']
}