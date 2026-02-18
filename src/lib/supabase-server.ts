// src/lib/supabase-server.ts
// Server-side Supabase client — used in Server Components, API routes, and middleware
// Uses cookies to maintain the user's session securely on the server
// NEVER use this on the client side — use src/lib/supabase.ts instead

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createSupabaseServerClient() {
  // Get the cookie store from Next.js headers
  const cookieStore = await cookies()
  
  return createServerClient(
    // These env variables are set in .env.local
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // Read all cookies from the request
        getAll() { return cookieStore.getAll() },
        
        // Write cookies to the response (used when session is refreshed)
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )
}