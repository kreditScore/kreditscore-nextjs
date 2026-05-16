import { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Company Category - Check Your Loan Eligibility by Employer | KreditScore',
  description: 'Check which loan category your company falls under and how it affects your personal loan eligibility, interest rate, and maximum loan amount.',
  keywords: [
    'company category loan',
    'employer category loan eligibility',
    'company list personal loan',
    'cat A cat B company loan',
    'company tier loan rate',
    'employer loan eligibility',
    'company category check',
    'corporate loan category',
    'loan eligibility by company',
    'company loan classification',
  ],
  openGraph: {
    title: 'Company Category Check - Loan Eligibility by Employer | KreditScore',
    description: 'Find your company category and understand how it impacts your personal loan eligibility and interest rates.',
    type: 'website',
    url: `${SITE_URL}/company-category`,
    siteName: 'KreditScore',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Company Category Check | KreditScore',
    description: 'Check your employer category for better loan offers.',
  },
  alternates: {
    canonical: `${SITE_URL}/company-category`,
  },
  robots: { index: true, follow: true },
};

export default function CompanyCategoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
