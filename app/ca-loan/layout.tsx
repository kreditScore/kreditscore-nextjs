import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CA Loan - Exclusive Personal Loan for Chartered Accountants | KreditScore',
  description: 'Special personal loan for Chartered Accountants with highest loan amounts and exclusive interest rates. Get up to ₹50 lakh with minimal documentation. Apply online now!',
  keywords: [
    'CA loan',
    'chartered accountant loan',
    'loan for CA',
    'CA personal loan',
    'chartered accountant personal loan',
    'professional loan for CA',
    'CA finance',
    'loan for accountants',
    'CA special loan',
    'high loan amount CA',
    'exclusive CA loan',
    'CA loan India',
    'accountant loan',
    'CA professional loan',
    'chartered accountant finance',
    'low interest CA loan',
    'instant CA loan',
    'online CA loan',
    'CA loan benefits',
    'highest loan for CA'
  ],
  openGraph: {
    title: 'CA Loan - Highest Loan Amount for Chartered Accountants | KreditScore',
    description: 'Exclusive for CAs! Get the highest loan amount with special interest rates. Quick approval for Chartered Accountants.',
    type: 'website',
    url: 'https://www.kreditscore.in/ca-loan',
    siteName: 'KreditScore',
    images: [
      {
        url: '/og-image-ca-loan.jpg',
        width: 1200,
        height: 630,
        alt: 'CA Loan - KreditScore',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CA Loan - Exclusive for Chartered Accountants | KreditScore',
    description: 'Highest loan amount with special rates for CAs!',
    images: ['/og-image-ca-loan.jpg'],
  },
  alternates: {
    canonical: 'https://www.kreditscore.in/ca-loan',
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

export default function CALoanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
