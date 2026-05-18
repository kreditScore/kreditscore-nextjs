/**
 * lib/supabase/users.ts
 * ---------------------
 * User operations in Supabase PostgreSQL.
 * Called after Firebase OTP/Google login to sync user data.
 */
import { supabaseAdmin } from './server';

export interface UpsertUserPayload {
  firebaseUid: string;
  phoneE164?:  string | null;
  email?:      string | null;
  displayName?: string | null;
  photoUrl?:   string | null;
  provider:    'phone' | 'google' | 'email';
}

export interface DbUser {
  id:            string;
  firebase_uid:  string;
  phone_e164:    string | null;
  email:         string | null;
  display_name:  string | null;
  photo_url:     string | null;
  provider:      string;
  role:          string;
  created_at:    string;
  updated_at:    string;
  last_login_at: string;
}

/**
 * Upsert user after Firebase authentication.
 * Creates on first login, updates on subsequent logins.
 */
export async function upsertUser(payload: UpsertUserPayload): Promise<DbUser> {
  const { data, error } = await supabaseAdmin
    .rpc('upsert_firebase_user', {
      p_firebase_uid: payload.firebaseUid,
      p_phone:        payload.phoneE164    ?? null,
      p_email:        payload.email        ?? null,
      p_display_name: payload.displayName  ?? null,
      p_photo_url:    payload.photoUrl     ?? null,
      p_provider:     payload.provider,
    });

  if (error) throw new Error(`upsertUser failed: ${error.message}`);
  return data as DbUser;
}

/**
 * Get user by Firebase UID
 */
export async function getUserByFirebaseUid(firebaseUid: string): Promise<DbUser | null> {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('firebase_uid', firebaseUid)
    .maybeSingle();

  if (error) throw new Error(`getUserByFirebaseUid failed: ${error.message}`);
  return data as DbUser | null;
}
