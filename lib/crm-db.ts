import { Lead, TeamUser } from '@/types/crm';

type LeadRow = {
  lead_code: string;
  applicant_name: string;
  mobile: string;
  source: Lead['source'];
  campaign: string | null;
  status: Lead['status'];
  assigned_to: string | null;
  notes: string | null;
  next_follow_up_at: string | null;
  created_at: string;
  updated_at: string;
};

type TeamUserRow = {
  id: string;
  full_name: string;
  email: string;
  mobile: string;
  role: TeamUser['role'];
  is_active: boolean;
};

export const toLead = (row: LeadRow, assignedToName?: string): Lead => ({
  id: row.lead_code,
  name: row.applicant_name,
  mobile: row.mobile,
  source: row.source,
  campaign: row.campaign ?? undefined,
  status: row.status,
  assignedTo: row.assigned_to ?? undefined,
  assignedToName,
  notes: row.notes ?? undefined,
  nextFollowUpAt: row.next_follow_up_at ?? undefined,
  createdAt: row.created_at,
  updatedAt: row.updated_at
});

export const toTeamUser = (row: TeamUserRow): TeamUser => ({
  id: row.id,
  name: row.full_name,
  email: row.email,
  mobile: row.mobile,
  role: row.role,
  isActive: row.is_active
});
