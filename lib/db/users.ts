import { getPool } from "@/lib/db/pool";

export interface UpsertUserPayload {
  firebaseUid: string;
  phoneE164?: string | null;
  email?: string | null;
  displayName?: string | null;
  photoUrl?: string | null;
  provider: "phone" | "google" | "email";
}

export interface DbUser {
  id: string;
  firebase_uid: string;
  phone_e164: string | null;
  email: string | null;
  display_name: string | null;
  photo_url: string | null;
  provider: string;
  role: string;
  created_at: string;
  updated_at: string;
  last_login_at: string;
}

/**
 * Upsert a user into Supabase after Firebase authentication.
 * - Creates the user on first login
 * - Updates phone/email/name/photo on subsequent logins
 */
export async function upsertUser(payload: UpsertUserPayload): Promise<DbUser> {
  const pool = getPool();
  const result = await pool.query<DbUser>(
    `INSERT INTO users (firebase_uid, phone_e164, email, display_name, photo_url, provider, last_login_at)
     VALUES ($1, $2, $3, $4, $5, $6, NOW())
     ON CONFLICT (firebase_uid) DO UPDATE SET
       phone_e164    = COALESCE(EXCLUDED.phone_e164, users.phone_e164),
       email         = COALESCE(EXCLUDED.email, users.email),
       display_name  = COALESCE(EXCLUDED.display_name, users.display_name),
       photo_url     = COALESCE(EXCLUDED.photo_url, users.photo_url),
       provider      = EXCLUDED.provider,
       last_login_at = NOW()
     RETURNING *`,
    [
      payload.firebaseUid,
      payload.phoneE164 ?? null,
      payload.email ?? null,
      payload.displayName ?? null,
      payload.photoUrl ?? null,
      payload.provider,
    ]
  );
  return result.rows[0];
}

/**
 * Get user by firebase_uid
 */
export async function getUserByFirebaseUid(firebaseUid: string): Promise<DbUser | null> {
  const pool = getPool();
  const result = await pool.query<DbUser>(
    `SELECT * FROM users WHERE firebase_uid = $1 LIMIT 1`,
    [firebaseUid]
  );
  return result.rows[0] ?? null;
}
