import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Debt Consolidation Loan - Combine All Debts into Single EMI | KreditScore',
  description: 'Consolidate your Personal Loan, Credit Card, Apps Loan & Overdraft into one single EMI. Reduce monthly burden by 50%. Lower interest rates starting at 10.25% p.a. Instant approval in 2 minutes.',
  keywords: [
    'debt consolidation loan',
    'consolidate multiple loans',
    'single EMI loan',
    'combine credit card and personal loan',
    'debt consolidation India',
    'merge all loans',
    'reduce EMI burden',
    'consolidate app loans',
    'overdraft consolidation',
    'lower interest rate loan',
    'debt management solution',
    'multiple debt consolidation',
    'loan against existing loans',
    'refinance multiple loans',
    'debt restructuring loan',
    'PL CC Apps Loan consolidation',
    'simplify debt payments',
    'debt consolidation calculator',
    'instant debt consolidation',
    'online debt consolidation loan'
  ],
  openGraph: {
    title: 'Debt Consolidation Loan - Single EMI for All Your Debts | KreditScore',
    description: 'Stop juggling multiple EMIs! Consolidate Personal Loan + Credit Card + Apps Loan + Overdraft into ONE single EMI. Reduce monthly burden by 50%. Interest from 10.25% p.a.',
    type: 'website',
    url: 'https://kreditscore.com/debt-consolidation',
    siteName: 'KreditScore',
    images: [
      {
        url: '/og-image-debt-consolidation.jpg',
        width: 1200,
        height: 630,
        alt: 'Debt Consolidation Loan - KreditScore',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Debt Consolidation Loan - Single EMI for All Debts | KreditScore',
    description: 'Consolidate PL+CC+Apps Loan+OD into one EMI. Reduce monthly burden by 50%!',
    images: ['/og-image-debt-consolidation.jpg'],
  },
  alternates: {
    canonical: 'https://kreditscore.com/debt-consolidation',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function DebtConsolidationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
