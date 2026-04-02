'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

function AuthCallbackInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const returnUrl = searchParams.get('returnUrl') || '/dashboard';
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      router.replace('/login');
      return;
    }
    supabase.auth.getSession().then(({ data: { session } }) => {
      router.replace(session ? returnUrl : '/login');
    });
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-600">
      Completing sign in…
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-600">Loading…</div>
      }
    >
      <AuthCallbackInner />
    </Suspense>
  );
}
