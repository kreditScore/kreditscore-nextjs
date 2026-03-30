export type LeadStatus =
  | 'new'
  | 'contacted'
  | 'form_sent'
  | 'form_submitted'
  | 'follow_up_pending'
  | 'qualified'
  | 'closed';

export type LeadSource = 'website' | 'campaign' | 'manual' | 'api';

export interface Lead {
  id: string;
  name: string;
  mobile: string;
  source: LeadSource;
  campaign?: string;
  status: LeadStatus;
  assignedTo?: string;
  assignedToName?: string;
  notes?: string;
  nextFollowUpAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLeadInput {
  name: string;
  mobile: string;
  source: LeadSource;
  campaign?: string;
  notes?: string;
}

export interface UpdateLeadInput {
  status?: LeadStatus;
  assignedTo?: string;
  notes?: string;
  nextFollowUpAt?: string;
}

export type TeamUserRole = 'super_admin' | 'admin' | 'team_lead' | 'executive';

export interface TeamUser {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: TeamUserRole;
  isActive: boolean;
}
