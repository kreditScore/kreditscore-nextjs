import { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Part Payment Calculator - Save on Loan Interest | KreditScore',
  description: 'Calculate how much interest you save by making a part payment on your personal loan. See new EMI, reduced tenure, and total interest saved instantly.',
  keywords: [
    'part payment calculator',
    'loan part payment',
    'prepayment calculator',
    'personal loan prepayment',
    'EMI reduction calculator',
    'loan interest saving',
    'part prepayment benefit',
    'loan tenure reduction',
    'save on loan interest',
    'prepay personal loan',
  ],
  openGraph: {
    title: 'Part Payment Calculator - Save on Loan Interest | KreditScore',
    description: 'Find out exactly how much you save by making a part payment on your loan. Calculate new EMI & reduced tenure.',
    type: 'website',
    url: `${SITE_URL}/part-payment-calculator`,
    siteName: 'KreditScore',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Part Payment Calculator | KreditScore',
    description: 'Calculate loan part payment savings instantly.',
  },
  alternates: {
    canonical: `${SITE_URL}/part-payment-calculator`,
  },
  robots: { index: true, follow: true },
};

export default function PartPaymentCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
