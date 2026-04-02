import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Instant Personal Loan Online - Get ₹50K to ₹25 Lakh in Minutes | KreditScore',
  description: 'Apply for instant personal loan online with quick approval. Get fresh personal loans from ₹50,000 to ₹25 lakh with minimal documentation. Low interest rates from 10.5% p.a. 100% digital process.',
  keywords: [
    'instant personal loan online',
    'fresh personal loan',
    'personal loan apply online',
    'quick personal loan',
    'online loan approval',
    'digital personal loan',
    'instant loan India',
    'personal loan without documents',
    'fast personal loan',
    'low interest personal loan',
    'personal loan online apply',
    'instant cash loan',
    'personal loan approval in minutes',
    'online personal loan application',
    'urgent personal loan'
  ],
  openGraph: {
    title: 'Instant Personal Loan Online - Quick Approval in Minutes | KreditScore',
    description: 'Get instant personal loan online from ₹50K to ₹25 lakh with minimal documentation. Apply now for quick approval and low interest rates!',
    type: 'website',
    url: 'https://www.kreditscore.in/instant-personal-loan-online',
    siteName: 'KreditScore',
    images: [
      {
        url: '/og-image-instant-loan.jpg',
        width: 1200,
        height: 630,
        alt: 'Instant Personal Loan Online - KreditScore',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Instant Personal Loan Online - Quick Approval | KreditScore',
    description: 'Get instant personal loan online from ₹50K to ₹25 lakh with minimal documentation. Apply now!',
    images: ['/og-image-instant-loan.jpg'],
  },
  alternates: {
    canonical: 'https://www.kreditscore.in/instant-personal-loan-online',
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

export default function InstantPersonalLoanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
