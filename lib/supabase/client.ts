import { createClient } from "@supabase/supabase-js";

// Browser client — lazy singleton
let _supabase: ReturnType<typeof createClient> | null = null;
export function getSupabaseClient() {
  if (!_supabase) {
    _supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  return _supabase;
}

// Server client (uses service role — only call in API routes)
export function createServerClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}
