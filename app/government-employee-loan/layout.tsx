import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Government Employee Loan - Lowest Interest Rates | KreditScore',
  description: 'Exclusive personal loan for government employees with lowest interest rates and higher loan amounts. Special benefits for central and state govt employees. Apply online now!',
  keywords: [
    'government employee loan',
    'govt employee personal loan',
    'loan for govt employees',
    'central government employee loan',
    'state government employee loan',
    'PSU employee loan',
    'govt staff loan',
    'lowest interest govt loan',
    'higher loan amount govt',
    'government sector loan',
    'govt employee finance',
    'public sector loan',
    'govt servant loan',
    'government job loan',
    'govt employee special loan',
    'instant govt employee loan',
    'online govt employee loan',
    'govt employee loan India',
    'government professional loan',
    'civil servant loan'
  ],
  openGraph: {
    title: 'Government Employee Loan - Lowest Rates & Higher Amounts | KreditScore',
    description: 'Exclusive for govt employees! Lowest interest rates + higher loan amounts. Special benefits for government sector professionals.',
    type: 'website',
    url: 'https://kreditscore.com/government-employee-loan',
    siteName: 'KreditScore',
    images: [
      {
        url: '/og-image-government-employee-loan.jpg',
        width: 1200,
        height: 630,
        alt: 'Government Employee Loan - KreditScore',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Govt Employee Loan - Lowest Rates | KreditScore',
    description: 'Exclusive for government employees! Lowest rates + higher amounts!',
    images: ['/og-image-government-employee-loan.jpg'],
  },
  alternates: {
    canonical: 'https://kreditscore.com/government-employee-loan',
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

export default function GovernmentEmployeeLoanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
