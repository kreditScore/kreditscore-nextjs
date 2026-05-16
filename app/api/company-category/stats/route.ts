import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const { count, error: countErr } = await supabase
    .from('companies')
    .select('*', { count: 'exact', head: true });

  const { data: banks, error: banksErr } = await supabase
    .rpc('get_company_bank_stats');

  if (countErr || banksErr) {
    console.error('[company-stats API]', countErr?.message || banksErr?.message);
    return NextResponse.json({ total: 0, banks: [] });
  }

  return NextResponse.json({
    total: count ?? 0,
    banks: banks ?? [],
  });
}
