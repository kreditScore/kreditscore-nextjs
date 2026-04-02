import { createClient } from '@supabase/supabase-js';

/**
 * Verifies Supabase JWT (access_token) using the service role.
 * Set SUPABASE_SERVICE_ROLE_KEY in Vercel (server only, never NEXT_PUBLIC_*).
 */
export async function verifySupabaseAccessToken(
  accessToken: string
): Promise<{ uid: string } | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey || !accessToken?.trim()) {
    return null;
  }
  try {
    const supabase = createClient(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data, error } = await supabase.auth.getUser(accessToken);
    if (error || !data.user) return null;
    return { uid: data.user.id };
  } catch {
    return null;
  }
}
