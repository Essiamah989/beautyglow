// src/lib/supabase.ts
// Client-side Supabase client — properly sets auth cookies for middleware
// Use this in all 'use client' components

import { createBrowserClient } from "@supabase/ssr";

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);
