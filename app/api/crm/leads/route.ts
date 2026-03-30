import { NextRequest, NextResponse } from 'next/server';
import { LeadSource } from '@/types/crm';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { toLead, toTeamUser } from '@/lib/crm-db';

const isValidMobile = (mobile: string) => /^\d{10}$/.test(mobile);
const allowedSource: LeadSource[] = ['website', 'campaign', 'manual', 'api'];

export async function GET() {
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: 'Supabase is not configured. Set env vars from .env.example' },
      { status: 500 }
    );
  }

  const [leadsResult, usersResult] = await Promise.all([
    supabaseAdmin
      .from('leads')
      .select(
        'lead_code, applicant_name, mobile, source, campaign, status, assigned_to, notes, next_follow_up_at, created_at, updated_at'
      )
      .order('created_at', { ascending: false }),
    supabaseAdmin.from('team_users').select('id, full_name, email, mobile, role, is_active')
  ]);

  if (leadsResult.error) {
    return NextResponse.json({ error: leadsResult.error.message }, { status: 500 });
  }
  if (usersResult.error) {
    return NextResponse.json({ error: usersResult.error.message }, { status: 500 });
  }

  const users = (usersResult.data ?? []).map(toTeamUser);
  const userMap = new Map(users.map((user) => [user.id, user.name]));
  const leads = (leadsResult.data ?? []).map((row) => toLead(row, row.assigned_to ? userMap.get(row.assigned_to) : undefined));

  return NextResponse.json({ data: leads, teamUsers: users });
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
  const mobile = String(body?.mobile ?? '').trim();
  const source = String(body?.source ?? 'manual') as LeadSource;
  const campaign = body?.campaign ? String(body.campaign) : undefined;
  const notes = body?.notes ? String(body.notes) : undefined;

  if (!name) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 });
  }
  if (!isValidMobile(mobile)) {
    return NextResponse.json({ error: 'Mobile must be 10 digits' }, { status: 400 });
  }
  if (!allowedSource.includes(source)) {
    return NextResponse.json({ error: 'Invalid source' }, { status: 400 });
  }

  const leadCode = `LD-${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 90 + 10)}`;
  const createdAt = new Date().toISOString();
  const { data, error } = await supabaseAdmin
    .from('leads')
    .insert({
      lead_code: leadCode,
      applicant_name: name,
      mobile,
      source,
      campaign: campaign ?? null,
      notes: notes ?? null,
      status: 'new',
      created_at: createdAt,
      updated_at: createdAt
    })
    .select(
      'lead_code, applicant_name, mobile, source, campaign, status, assigned_to, notes, next_follow_up_at, created_at, updated_at'
    )
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ data: toLead(data) }, { status: 201 });
}
