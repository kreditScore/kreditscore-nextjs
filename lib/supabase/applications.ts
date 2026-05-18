/**
 * lib/supabase/applications.ts
 * ----------------------------
 * Loan application operations in Supabase PostgreSQL.
 */
import { supabaseAdmin } from './server';

export interface NewLoanApplication {
  firebaseUid:    string;
  phoneE164?:     string | null;
  source:         string;            // page slug
  displayName?:   string | null;
  loanAmount?:    number | null;
  city?:          string | null;
  employmentType?: string | null;
  companyName?:   string | null;
  netSalary?:     number | null;
  payload:        Record<string, unknown>;  // full form data
}

export interface DbLoanApplication {
  id:              string;
  firebase_uid:    string;
  phone_e164:      string | null;
  source:          string;
  display_name:    string | null;
  loan_amount:     number | null;
  city:            string | null;
  employment_type: string | null;
  company_name:    string | null;
  net_salary:      number | null;
  payload:         Record<string, unknown>;
  status:          string;
  created_at:      string;
  updated_at:      string;
}

/**
 * Insert a new loan application
 */
export async function insertLoanApplication(row: NewLoanApplication): Promise<string> {
  const { data, error } = await supabaseAdmin
    .from('loan_applications')
    .insert({
      firebase_uid:    row.firebaseUid,
      phone_e164:      row.phoneE164      ?? null,
      source:          row.source,
      display_name:    row.displayName    ?? null,
      loan_amount:     row.loanAmount     ?? null,
      city:            row.city           ?? null,
      employment_type: row.employmentType ?? null,
      company_name:    row.companyName    ?? null,
      net_salary:      row.netSalary      ?? null,
      payload:         row.payload,
      status:          'pending',
    })
    .select('id')
    .single();

  if (error) throw new Error(`insertLoanApplication failed: ${error.message}`);
  return data.id;
}

/**
 * Get the latest application for a user
 */
export async function getLatestApplication(firebaseUid: string): Promise<DbLoanApplication | null> {
  const { data, error } = await supabaseAdmin
    .from('loan_applications')
    .select('*')
    .eq('firebase_uid', firebaseUid)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw new Error(`getLatestApplication failed: ${error.message}`);
  return data as DbLoanApplication | null;
}

/**
 * Get all applications for a user
 */
export async function getUserApplications(firebaseUid: string): Promise<DbLoanApplication[]> {
  const { data, error } = await supabaseAdmin
    .from('loan_applications')
    .select('*')
    .eq('firebase_uid', firebaseUid)
    .order('created_at', { ascending: false });

  if (error) throw new Error(`getUserApplications failed: ${error.message}`);
  return (data ?? []) as DbLoanApplication[];
}

/**
 * Update application status (admin use)
 */
export async function updateApplicationStatus(
  id: string,
  status: 'pending' | 'processing' | 'approved' | 'rejected'
): Promise<void> {
  const { error } = await supabaseAdmin
    .from('loan_applications')
    .update({ status })
    .eq('id', id);

  if (error) throw new Error(`updateApplicationStatus failed: ${error.message}`);
}
