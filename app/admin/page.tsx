'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import CustomCursor from '@/components/CustomCursor';
import { Shield, UserPlus } from 'lucide-react';
import { TeamUser, TeamUserRole } from '@/types/crm';

interface NewUserInput {
  name: string;
  email: string;
  mobile: string;
  password: string;
  role: TeamUserRole;
}

export default function AdminPage() {
  const [users, setUsers] = useState<TeamUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newUser, setNewUser] = useState<NewUserInput>({
    name: '',
    email: '',
    mobile: '',
    password: '',
    role: 'executive'
  });

  const loadUsers = async () => {
    setIsLoading(true);
    const response = await fetch('/api/admin/team-users');
    const result = await response.json();
    if (response.ok) {
      setUsers(result.data ?? []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    void loadUsers();
  }, []);

  const addUser = async () => {
    if (!newUser.name.trim() || !newUser.email.trim() || !newUser.password || newUser.mobile.length !== 10) {
      alert('Name, email, password and valid 10-digit mobile are required.');
      return;
    }

    const response = await fetch('/api/admin/team-users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser)
    });
    const result = await response.json();
    if (!response.ok) {
      alert(result.error ?? 'User creation failed');
      return;
    }

    setNewUser({ name: '', email: '', mobile: '', password: '', role: 'executive' });
    await loadUsers();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <CustomCursor />
      <Header />

      <div className="pt-[100px] pb-10 px-4">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-7 h-7 text-indigo-600" />
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Admin Panel</h1>
            </div>
            <p className="text-gray-600">
              Team login creation and access control (ready to connect with Supabase Auth).
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Create Team Login</h2>
            <div className="grid md:grid-cols-5 gap-3">
              <input
                value={newUser.name}
                onChange={(e) => setNewUser((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Employee name"
                className="border-2 border-gray-200 rounded-lg px-3 py-2"
              />
              <input
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="Email (login ID)"
                className="border-2 border-gray-200 rounded-lg px-3 py-2"
              />
              <input
                value={newUser.mobile}
                onChange={(e) =>
                  setNewUser((prev) => ({ ...prev, mobile: e.target.value.replace(/\D/g, '').slice(0, 10) }))
                }
                placeholder="Mobile number"
                className="border-2 border-gray-200 rounded-lg px-3 py-2"
              />
              <input
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser((prev) => ({ ...prev, password: e.target.value }))}
                placeholder="Temporary password"
                className="border-2 border-gray-200 rounded-lg px-3 py-2"
              />
              <select
                value={newUser.role}
                onChange={(e) => setNewUser((prev) => ({ ...prev, role: e.target.value as TeamUserRole }))}
                className="border-2 border-gray-200 rounded-lg px-3 py-2"
              >
                <option value="admin">Admin</option>
                <option value="executive">Executive</option>
                <option value="team_lead">Team Lead</option>
              </select>
              <button
                onClick={addUser}
                className="bg-indigo-600 text-white rounded-lg px-4 py-2 font-semibold hover:bg-indigo-700 inline-flex items-center justify-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                Create Login
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Team Users</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b">
                    <th className="py-2 pr-3">Name</th>
                    <th className="py-2 pr-3">Email</th>
                    <th className="py-2 pr-3">Mobile</th>
                    <th className="py-2 pr-3">Role</th>
                    <th className="py-2 pr-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td className="py-3 pr-3 text-gray-500" colSpan={5}>
                        Loading users...
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user.id} className="border-b">
                        <td className="py-3 pr-3">{user.name}</td>
                        <td className="py-3 pr-3">{user.email}</td>
                        <td className="py-3 pr-3">{user.mobile}</td>
                        <td className="py-3 pr-3 capitalize">{user.role.replace('_', ' ')}</td>
                        <td className="py-3 pr-3">{user.isActive ? 'Active' : 'Inactive'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
