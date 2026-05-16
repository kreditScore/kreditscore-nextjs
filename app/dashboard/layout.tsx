import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard - KreditScore',
  description: 'Your KreditScore dashboard — track applications, upload documents, and manage your loan journey.',
  robots: { index: false, follow: false },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
