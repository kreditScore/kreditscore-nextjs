import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { TeamUserRole } from '@/types/crm';
import { toTeamUser } from '@/lib/crm-db';

const allowedRoles: TeamUserRole[] = ['super_admin', 'admin', 'team_lead', 'executive'];

export async function GET() {
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: 'Supabase is not configured. Set env vars from .env.example' },
      { status: 500 }
    );
  }

  const { data, error } = await supabaseAdmin
    .from('team_users')
    .select('id, full_name, email, mobile, role, is_active')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ data: (data ?? []).map(toTeamUser) });
}

export async function POST(request: NextRequest) {
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: 'Supabase is not configured. Set env vars from .env.example' },
      { status: 500 }
    );
  }

  const body = await request.json();
  const name = String(body?.name ?? '').trim();
  const email = String(body?.email ?? '').trim().toLowerCase();
  const mobile = String(body?.mobile ?? '').trim();
  const password = String(body?.password ?? '');
  const role = String(body?.role ?? 'executive') as TeamUserRole;

  if (!name || !email || !password || !/^\d{10}$/.test(mobile)) {
    return NextResponse.json({ error: 'Name, email, password and valid mobile are required' }, { status: 400 });
  }
  if (!allowedRoles.includes(role)) {
    return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
  }

  const authResult = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { role, full_name: name }
  });
  if (authResult.error || !authResult.data.user) {
    return NextResponse.json({ error: authResult.error?.message ?? 'Auth user create failed' }, { status: 500 });
  }

  const { data, error } = await supabaseAdmin
    .from('team_users')
    .insert({
      auth_user_id: authResult.data.user.id,
      full_name: name,
      email,
      mobile,
      role,
      is_active: true
    })
    .select('id, full_name, email, mobile, role, is_active')
    .single();

  if (error) {
    await supabaseAdmin.auth.admin.deleteUser(authResult.data.user.id);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data: toTeamUser(data) }, { status: 201 });
}
