import { NextRequest, NextResponse } from 'next/server';
import { LeadStatus } from '@/types/crm';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { toLead } from '@/lib/crm-db';

const allowedStatus: LeadStatus[] = [
  'new',
  'contacted',
  'form_sent',
  'form_submitted',
  'follow_up_pending',
  'qualified',
  'closed'
];

export async function PATCH(
  request: NextRequest,
  context: { params: { id: string } }
) {
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: 'Supabase is not configured. Set env vars from .env.example' },
      { status: 500 }
    );
  }

  const body = await request.json();
  const updates: {
    status?: LeadStatus;
    assignedTo?: string;
    notes?: string;
    nextFollowUpAt?: string;
  } = {};

  if (body?.status) {
    const status = String(body.status) as LeadStatus;
    if (!allowedStatus.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }
    updates.status = status;
  }
  if (body?.assignedTo !== undefined) {
    updates.assignedTo = String(body.assignedTo);
  }
  if (body?.notes !== undefined) {
    updates.notes = String(body.notes);
  }
  if (body?.nextFollowUpAt !== undefined) {
    updates.nextFollowUpAt = String(body.nextFollowUpAt);
  }

  const payload: {
    status?: LeadStatus;
    assigned_to?: string | null;
    notes?: string | null;
    next_follow_up_at?: string | null;
    updated_at: string;
  } = { updated_at: new Date().toISOString() };

  if (updates.status !== undefined) payload.status = updates.status;
  if (updates.assignedTo !== undefined) payload.assigned_to = updates.assignedTo || null;
  if (updates.notes !== undefined) payload.notes = updates.notes || null;
  if (updates.nextFollowUpAt !== undefined) payload.next_follow_up_at = updates.nextFollowUpAt || null;

  const { data, error } = await supabaseAdmin
    .from('leads')
    .update(payload)
    .eq('lead_code', context.params.id)
    .select(
      'lead_code, applicant_name, mobile, source, campaign, status, assigned_to, notes, next_follow_up_at, created_at, updated_at'
    )
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ data: toLead(data) });
}
