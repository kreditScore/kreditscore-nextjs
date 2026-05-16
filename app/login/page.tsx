import { Suspense } from 'react';
import WebsiteLoginPage from '@/components/auth/WebsiteLoginPage';

function LoginFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-orange-50/30">
      <p className="text-slate-600 text-sm">Loading…</p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <WebsiteLoginPage />
    </Suspense>
  );
}
