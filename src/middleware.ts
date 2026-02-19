// src/middleware.ts
// 1. Handles subdomain routing — rewrites requests to /sites/[businessId]
// 2. Protects /dashboard routes — redirects to /auth/login if not authenticated

import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || ''
  
  // Extract subdomain — works for both localhost and beautyglow.tn
  // e.g. "salonbelle.localhost:3000" → "salonbelle"
  // e.g. "salonbelle.beautyglow.tn" → "salonbelle"
  const mainDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'localhost:3000'
  const subdomain = hostname.replace(`.${mainDomain}`, '')

    // Temporary debug
  console.log('Hostname:', hostname)
  console.log('MainDomain:', mainDomain)
  console.log('Extracted subdomain:', subdomain)

  // If there's a subdomain and it's not www — serve the salon's public website
  const isSubdomain = subdomain && subdomain !== mainDomain && subdomain !== 'www'

  if (isSubdomain) {
    // Rewrite to /sites/[subdomain] — we'll look up the business there
    return NextResponse.rewrite(
      new URL(`/sites/${subdomain}${request.nextUrl.pathname}`, request.url)
    )
  }

  // For main domain — handle auth protection
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

  // Protect /dashboard
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/dashboard')
  if (isProtectedRoute && !user) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
}