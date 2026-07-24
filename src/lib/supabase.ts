import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.trim() || ''
const supabaseAnonKey =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined)?.trim() || ''

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

/**
 * Vite inlines VITE_* vars at build time. On Cloudflare Pages, set
 * VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in the project Environment Variables
 * (Production + Preview), then redeploy.
 *
 * When unset, we still construct a client with placeholders so the app can boot;
 * all data/auth calls guard with `isSupabaseConfigured`.
 */
export const supabase: SupabaseClient = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'public-anon-key-placeholder',
)
