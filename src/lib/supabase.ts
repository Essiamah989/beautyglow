// src/lib/supabase.ts
// Client-side Supabase client — use this in Client Components ('use client')
// Do NOT use this in Server Components — use supabase-server.ts instead

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)