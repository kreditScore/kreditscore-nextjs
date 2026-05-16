import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q       = searchParams.get('q')?.trim()    || '';
  const bank    = searchParams.get('bank')?.trim()  || '';
  const cat     = searchParams.get('cat')?.trim()   || '';
  const page    = Math.max(1, Number(searchParams.get('page') || '1'));
  const perPage = 50;
  const offset  = (page - 1) * perPage;

  let query = supabase
    .from('companies')
    .select('company, bank, category, segment', { count: 'exact' });

  // Search filters
  if (q)    query = query.ilike('company', `%${q}%`);
  if (bank) query = query.ilike('bank', bank);
  if (cat)  query = query.ilike('category', `%${cat}%`);

  const { data, count, error } = await query
    .order('company', { ascending: true })
    .range(offset, offset + perPage - 1);

  if (error) {
    console.error('[company-category API]', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    total:    count ?? 0,
    page,
    per_page: perPage,
    results:  data ?? [],
  });
}
