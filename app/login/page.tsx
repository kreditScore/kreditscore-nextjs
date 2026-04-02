import { Suspense } from 'react';
import WebsiteLoginPage from '@/modules/website/pages/WebsiteLoginPage';

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 text-gray-600">
          Loading…
        </div>
      }
    >
      <WebsiteLoginPage />
    </Suspense>
  );
}
