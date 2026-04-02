import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Small Apps Loan - Get Upto ₹10 Lacs in 2 Hours | KreditScore',
  description: 'Get instant small personal loan through mobile app. Quick disbursal in 2 hours. Loan amount up to ₹10 lakh with minimal documentation. 100% online process. Apply now and get money in your account fast.',
  keywords: [
    'small apps loan',
    'app based loan',
    'instant loan app',
    'quick loan 2 hours',
    'mobile app loan',
    'digital loan',
    'online personal loan app',
    'fast disbursal loan',
    'small personal loan',
    'quick cash loan',
    'instant money loan app',
    'loan in 2 hours',
    'app loan India',
    'digital lending',
    'fintech loan',
    'micro loan app',
    'emergency loan app',
    'same day loan',
    'instant approval loan app',
    'paperless loan'
  ],
  openGraph: {
    title: 'Small Apps Loan - Get ₹10 Lacs in Just 2 Hours | KreditScore',
    description: 'Apply through our mobile app and get instant loan approval. Disbursal in 2 hours. Paperless, hassle-free process!',
    type: 'website',
    url: 'https://www.kreditscore.in/small-apps-loan',
    siteName: 'KreditScore',
    images: [
      {
        url: '/og-image-small-apps-loan.jpg',
        width: 1200,
        height: 630,
        alt: 'Small Apps Loan - KreditScore',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Small Apps Loan - ₹10 Lacs in 2 Hours | KreditScore',
    description: 'App-based instant loan. Quick disbursal. Apply now!',
    images: ['/og-image-small-apps-loan.jpg'],
  },
  alternates: {
    canonical: 'https://www.kreditscore.in/small-apps-loan',
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

export default function SmallAppsLoanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
