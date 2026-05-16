import { getPool } from "@/lib/db/pool";

export type NewLoanApplication = {
  firebaseUid: string;
  phoneE164: string;
  source: string;
  displayName: string | null;
  payload: Record<string, unknown>;
};

export async function insertLoanApplication(row: NewLoanApplication) {
  const pool = getPool();
  const result = await pool.query<{ id: string }>(
    `INSERT INTO loan_applications (firebase_uid, phone_e164, source, display_name, payload)
     VALUES ($1, $2, $3, $4, $5::jsonb)
     RETURNING id::text AS id`,
    [
      row.firebaseUid,
      row.phoneE164,
      row.source,
      row.displayName,
      JSON.stringify(row.payload),
    ]
  );
  return result.rows[0]?.id;
}

export async function getLatestApplication(firebaseUid: string) {
  const pool = getPool();
  const result = await pool.query<{ 
    display_name: string | null;
    payload: Record<string, unknown>;
  }>(
    `SELECT display_name, payload 
     FROM loan_applications 
     WHERE firebase_uid = $1 
     ORDER BY created_at DESC 
     LIMIT 1`,
    [firebaseUid]
  );
  return result.rows[0] || null;
}
