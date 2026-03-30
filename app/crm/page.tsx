'use client';

import { useEffect, useMemo, useState } from 'react';
import Header from '@/components/Header';
import CustomCursor from '@/components/CustomCursor';
import { Lead, LeadSource, LeadStatus, TeamUser } from '@/types/crm';
import { Briefcase, PlusCircle, RefreshCcw, Send } from 'lucide-react';

const statusOptions: LeadStatus[] = [
  'new',
  'contacted',
  'form_sent',
  'form_submitted',
  'follow_up_pending',
  'qualified',
  'closed'
];

const sourceOptions: LeadSource[] = ['website', 'campaign', 'manual', 'api'];

export default function CRMPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [teamUsers, setTeamUsers] = useState<TeamUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [newLead, setNewLead] = useState({
    name: '',
    mobile: '',
    source: 'manual' as LeadSource,
    campaign: '',
    notes: ''
  });

  const loadLeads = async () => {
    setLoading(true);
    const response = await fetch('/api/crm/leads');
    const result = await response.json();
    setLeads(result.data ?? []);
    setTeamUsers(result.teamUsers ?? []);
    setLoading(false);
  };

  useEffect(() => {
    void loadLeads();
  }, []);

  const stats = useMemo(() => {
    const total = leads.length;
    const pendingFollowUp = leads.filter((lead) => lead.status === 'follow_up_pending').length;
    const newLeads = leads.filter((lead) => lead.status === 'new').length;
    const qualified = leads.filter((lead) => lead.status === 'qualified').length;
    return { total, pendingFollowUp, newLeads, qualified };
  }, [leads]);

  const createLead = async () => {
    if (!newLead.name.trim() || newLead.mobile.length !== 10) {
      alert('Name and valid 10-digit mobile are required.');
      return;
    }

    const response = await fetch('/api/crm/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newLead)
    });
    if (!response.ok) {
      alert('Lead create failed');
      return;
    }

    setNewLead({ name: '', mobile: '', source: 'manual', campaign: '', notes: '' });
    await loadLeads();
  };

  const updateLead = async (id: string, updates: Partial<Lead>) => {
    setSavingId(id);
    const response = await fetch(`/api/crm/leads/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (!response.ok) {
      alert('Update failed');
    } else {
      await loadLeads();
    }
    setSavingId(null);
  };

  const buildCustomerFormLink = (lead: Lead) => {
    const url = `${window.location.origin}/dashboard?leadId=${encodeURIComponent(lead.id)}`;
    navigator.clipboard.writeText(url).catch(() => undefined);
    alert(`Customer form link copied:\n${url}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <CustomCursor />
      <Header />

      <div className="pt-[100px] pb-10 px-4">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Briefcase className="w-7 h-7 text-blue-600" />
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Employee CRM</h1>
            </div>
            <p className="text-gray-600">
              Lead management, assignment, follow-up, and customer form-link sharing.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            <StatCard title="Total Leads" value={stats.total} />
            <StatCard title="New Leads" value={stats.newLeads} />
            <StatCard title="Pending Follow-up" value={stats.pendingFollowUp} />
            <StatCard title="Qualified" value={stats.qualified} />
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New Lead</h2>
            <div className="grid md:grid-cols-5 gap-3">
              <input
                value={newLead.name}
                onChange={(e) => setNewLead((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Applicant name"
                className="border-2 border-gray-200 rounded-lg px-3 py-2"
              />
              <input
                value={newLead.mobile}
                onChange={(e) =>
                  setNewLead((prev) => ({ ...prev, mobile: e.target.value.replace(/\D/g, '').slice(0, 10) }))
                }
                placeholder="Mobile number"
                className="border-2 border-gray-200 rounded-lg px-3 py-2"
              />
              <select
                value={newLead.source}
                onChange={(e) => setNewLead((prev) => ({ ...prev, source: e.target.value as LeadSource }))}
                className="border-2 border-gray-200 rounded-lg px-3 py-2"
              >
                {sourceOptions.map((source) => (
                  <option key={source} value={source}>
                    {source}
                  </option>
                ))}
              </select>
              <input
                value={newLead.campaign}
                onChange={(e) => setNewLead((prev) => ({ ...prev, campaign: e.target.value }))}
                placeholder="Campaign (optional)"
                className="border-2 border-gray-200 rounded-lg px-3 py-2"
              />
              <button
                onClick={createLead}
                className="bg-blue-600 text-white rounded-lg px-4 py-2 font-semibold hover:bg-blue-700 flex items-center justify-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                Create Lead
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Lead Queue</h2>
              <button
                onClick={() => void loadLeads()}
                className="text-sm px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 inline-flex items-center gap-2"
              >
                <RefreshCcw className="w-4 h-4" />
                Refresh
              </button>
            </div>

            {loading ? (
              <p className="text-gray-500">Loading leads...</p>
            ) : leads.length === 0 ? (
              <p className="text-gray-500">No leads yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left border-b">
                      <th className="py-2 pr-3">Lead</th>
                      <th className="py-2 pr-3">Source</th>
                      <th className="py-2 pr-3">Status</th>
                      <th className="py-2 pr-3">Assigned To</th>
                      <th className="py-2 pr-3">Follow-up</th>
                      <th className="py-2 pr-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map((lead) => (
                      <tr key={lead.id} className="border-b align-top">
                        <td className="py-3 pr-3">
                          <p className="font-semibold text-gray-800">{lead.name}</p>
                          <p className="text-gray-500">{lead.mobile}</p>
                          <p className="text-gray-400 text-xs">{lead.id}</p>
                        </td>
                        <td className="py-3 pr-3">{lead.source}</td>
                        <td className="py-3 pr-3">
                          <select
                            value={lead.status}
                            onChange={(e) => void updateLead(lead.id, { status: e.target.value as LeadStatus })}
                            className="border rounded px-2 py-1"
                          >
                            {statusOptions.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="py-3 pr-3">
                          <select
                            value={lead.assignedTo ?? ''}
                            onChange={(e) => void updateLead(lead.id, { assignedTo: e.target.value || undefined })}
                            className="border rounded px-2 py-1 w-48"
                          >
                            <option value="">Unassigned</option>
                            {teamUsers
                              .filter((user) => user.role === 'executive' || user.role === 'team_lead')
                              .map((user) => (
                                <option key={user.id} value={user.id}>
                                  {user.name}
                                </option>
                              ))}
                          </select>
                          {lead.assignedToName && (
                            <p className="text-xs text-gray-500 mt-1">Current: {lead.assignedToName}</p>
                          )}
                        </td>
                        <td className="py-3 pr-3">
                          <input
                            type="datetime-local"
                            value={lead.nextFollowUpAt ? lead.nextFollowUpAt.slice(0, 16) : ''}
                            onChange={(e) =>
                              setLeads((prev) =>
                                prev.map((item) =>
                                  item.id === lead.id ? { ...item, nextFollowUpAt: e.target.value } : item
                                )
                              )
                            }
                            onBlur={(e) =>
                              void updateLead(lead.id, { nextFollowUpAt: e.target.value || undefined })
                            }
                            className="border rounded px-2 py-1"
                          />
                        </td>
                        <td className="py-3 pr-3 space-y-2">
                          <button
                            onClick={() => buildCustomerFormLink(lead)}
                            className="text-xs bg-green-600 text-white px-2 py-1 rounded inline-flex items-center gap-1 hover:bg-green-700"
                          >
                            <Send className="w-3 h-3" />
                            Copy Form Link
                          </button>
                          {savingId === lead.id && <p className="text-xs text-gray-500">Saving...</p>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  );
}
