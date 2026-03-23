import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pre-Approved Personal Loan - Instant Approval Without Income Proof | KreditScore',
  description: 'Get pre-approved personal loans up to ₹25 lakh without income documents. Instant approval in minutes with low interest rates starting from 10.5% p.a. No salary slips required.',
  keywords: [
    'pre-approved personal loan',
    'instant personal loan',
    'personal loan without income proof',
    'no document personal loan',
    'quick personal loan approval',
    'online personal loan',
    'low interest personal loan',
    'pre-approved loan India',
    'personal loan no salary slip',
    'instant loan approval'
  ],
  openGraph: {
    title: 'Pre-Approved Personal Loan - Instant Approval | KreditScore',
    description: 'Get instant pre-approved personal loans up to ₹25 lakh without income documents. Apply now with just your credit score!',
    type: 'website',
    url: 'https://kreditscore.com/pre-approved-personal-loan',
    siteName: 'KreditScore',
    images: [
      {
        url: '/og-image-pre-approved-loan.jpg',
        width: 1200,
        height: 630,
        alt: 'Pre-Approved Personal Loan - KreditScore',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pre-Approved Personal Loan - Instant Approval | KreditScore',
    description: 'Get instant pre-approved personal loans up to ₹25 lakh without income documents.',
    images: ['/og-image-pre-approved-loan.jpg'],
  },
  alternates: {
    canonical: 'https://kreditscore.com/pre-approved-personal-loan',
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

export default function PreApprovedLoanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
