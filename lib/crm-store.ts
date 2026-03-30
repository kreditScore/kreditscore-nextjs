import { CreateLeadInput, Lead, UpdateLeadInput } from '@/types/crm';

const leads: Lead[] = [
  {
    id: 'LD-1001',
    name: 'Rohit Sharma',
    mobile: '9876543210',
    source: 'website',
    campaign: 'homepage-cta',
    status: 'new',
    assignedTo: 'Unassigned',
    notes: 'Interested in personal loan',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'LD-1002',
    name: 'Priya Verma',
    mobile: '9988776655',
    source: 'campaign',
    campaign: 'google-ads-march',
    status: 'follow_up_pending',
    assignedTo: 'Executive A',
    notes: 'Asked for callback at 6 PM',
    nextFollowUpAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const createLeadId = () => `LD-${Math.floor(Math.random() * 900000) + 100000}`;

export const crmStore = {
  getAll() {
    return [...leads].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  },
  create(input: CreateLeadInput) {
    const now = new Date().toISOString();
    const lead: Lead = {
      id: createLeadId(),
      name: input.name.trim(),
      mobile: input.mobile.trim(),
      source: input.source,
      campaign: input.campaign?.trim() || undefined,
      notes: input.notes?.trim() || undefined,
      assignedTo: 'Unassigned',
      status: 'new',
      createdAt: now,
      updatedAt: now
    };
    leads.push(lead);
    return lead;
  },
  update(id: string, updates: UpdateLeadInput) {
    const idx = leads.findIndex((lead) => lead.id === id);
    if (idx === -1) return null;

    const updatedLead: Lead = {
      ...leads[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    leads[idx] = updatedLead;
    return updatedLead;
  }
};
