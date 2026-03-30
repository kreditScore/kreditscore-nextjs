'use client';

import { FormEvent, useState } from 'react';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabaseClient } from '@/lib/supabase/client';

export default function CRMLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (!supabaseClient) {
      alert('Supabase not configured. Please set env values first.');
      return;
    }

    setIsLoading(true);
    const loginResult = await supabaseClient.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password
    });
    if (loginResult.error) {
      setIsLoading(false);
      alert(loginResult.error.message);
      return;
    }

    const roleResponse = await fetch(`/api/auth/team-role?email=${encodeURIComponent(email.trim().toLowerCase())}`);
    const rolePayload = await roleResponse.json();
    setIsLoading(false);

    if (!roleResponse.ok) {
      alert(rolePayload.error ?? 'Role check failed.');
      return;
    }

    const role = String(rolePayload?.data?.role ?? '');
    if (role === 'admin' || role === 'super_admin') {
      router.push('/admin');
      return;
    }
    router.push('/crm');
  };

  return (
    <div className="min-h-screen bg-[#f6f8fc]">
      <div className="grid min-h-screen lg:grid-cols-2">
        <div className="relative hidden overflow-hidden bg-white lg:block">
          <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-gradient-to-br from-[#e8f7ff] to-[#effaf0]" />
          <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-gradient-to-br from-[#fff4e8] to-[#eaf8ff]" />

          <div className="relative z-10 flex h-full flex-col justify-between p-14">
            <div>
              <div className="mb-12 text-5xl font-extrabold tracking-tight">
                <span className="text-[#FF8C00]">Kredit</span>
                <span className="text-[#47b7ff]">Score</span>
              </div>

              <h1 className="max-w-xl text-4xl font-bold leading-tight text-gray-900">
                Smart CRM for faster lead conversion.
              </h1>
              <p className="mt-4 max-w-lg text-lg text-gray-600">
                One place for lead tracking, assignment, customer form sharing, and follow-up management.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <FeatureCard title="Lead Inbox" text="Website and campaign leads in one queue." />
              <FeatureCard title="Live Updates" text="Customer form updates visible instantly." />
              <FeatureCard title="Follow-up Reminders" text="Never miss pending customer callbacks." />
              <FeatureCard title="Team Access" text="Role-based login for admin and executives." />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-[#47b7ff]">CRM Access</p>
            <h2 className="mb-2 text-3xl font-bold text-gray-900">Welcome to KreditScore CRM</h2>
            <p className="mb-8 text-sm text-gray-600">Sign in with your team account credentials.</p>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Email Address</label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="team@kreditscore.in"
                    className="w-full rounded-lg border border-gray-200 py-3 pl-10 pr-3 outline-none transition focus:border-[#47b7ff] focus:ring-2 focus:ring-[#d8f1ff]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Password</label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full rounded-lg border border-gray-200 py-3 pl-10 pr-10 outline-none transition focus:border-[#47b7ff] focus:ring-2 focus:ring-[#d8f1ff]"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-lg bg-gradient-to-r from-[#47b7ff] to-[#2f94f5] py-3 font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? 'Signing in...' : 'Log In'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-xl border border-[#e8eef7] bg-white/90 p-4">
      <h3 className="font-semibold text-gray-800">{title}</h3>
      <p className="mt-1 text-gray-600">{text}</p>
    </div>
  );
}
