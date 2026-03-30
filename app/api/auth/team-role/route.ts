import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function GET(request: NextRequest) {
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: 'Supabase is not configured. Set env vars from .env.example' },
      { status: 500 }
    );
  }

  const email = request.nextUrl.searchParams.get('email')?.toLowerCase().trim();
  if (!email) {
    return NextResponse.json({ error: 'email is required' }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from('team_users')
    .select('id, role, is_active')
    .eq('email', email)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!data || !data.is_active) {
    return NextResponse.json({ error: 'Team user not found or inactive' }, { status: 404 });
  }

  return NextResponse.json({ data });
}
