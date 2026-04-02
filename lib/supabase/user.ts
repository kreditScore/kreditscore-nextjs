import type { User } from '@supabase/supabase-js';

/** Last 10 digits from Supabase phone (E.164). */
export function getSupabasePhoneDigits(user: User | null): string | undefined {
  const phone = user?.phone;
  if (!phone) return undefined;
  const d = phone.replace(/\D/g, '');
  return d.length >= 10 ? d.slice(-10) : undefined;
}

export function getSupabaseDisplayName(user: User | null): string | undefined {
  const m = user?.user_metadata;
  if (!m || typeof m !== 'object') return undefined;
  const o = m as Record<string, unknown>;
  const full = o.full_name ?? o.name ?? o.display_name;
  return typeof full === 'string' && full.trim() ? full.trim() : undefined;
}
