import { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Login - KreditScore',
  description: 'Log in to your KreditScore account to track your loan applications and manage your profile.',
  alternates: {
    canonical: `${SITE_URL}/login`,
  },
  robots: { index: false, follow: false },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
