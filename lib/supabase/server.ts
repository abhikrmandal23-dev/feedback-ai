/**
 * Supabase Server-side Helpers (Next.js / Node environment compatible)
 * Designed for server components, API routes, or server-side actions.
 */

import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

export function createServerClient(cookieStore?: any) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  return createClient<Database>(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder-anon-key',
    {
      auth: {
        persistSession: false,
      },
    }
  );
}
