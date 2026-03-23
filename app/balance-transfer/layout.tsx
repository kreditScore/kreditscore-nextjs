import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Balance Transfer Loan - Reduce Your EMI by 50% | KreditScore',
  description: 'Transfer your existing loans to lower interest rates and reduce EMI by up to 50%. Balance transfer personal loans with minimal documentation. Save money on interest. Apply online now!',
  keywords: [
    'balance transfer loan',
    'loan balance transfer',
    'reduce EMI',
    'lower interest rate loan',
    'transfer personal loan',
    'balance transfer India',
    'EMI reduction loan',
    'loan refinance',
    'reduce monthly EMI',
    'loan transfer offer',
    'balance transfer benefits',
    'switch loan provider',
    'lower EMI payment',
    'loan interest rate reduction',
    'balance transfer personal loan',
    'reduce loan burden',
    'transfer existing loan',
    'better interest rate loan',
    'balance transfer online',
    'instant balance transfer'
  ],
  openGraph: {
    title: 'Balance Transfer Loan - Cut Your EMI by Half | KreditScore',
    description: 'Reduce EMI by 50%! Transfer your high-interest loans to our low-rate balance transfer facility. Documentation required. Apply now!',
    type: 'website',
    url: 'https://kreditscore.com/balance-transfer',
    siteName: 'KreditScore',
    images: [
      {
        url: '/og-image-balance-transfer.jpg',
        width: 1200,
        height: 630,
        alt: 'Balance Transfer Loan - KreditScore',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Balance Transfer Loan - Reduce EMI 50% | KreditScore',
    description: 'Transfer your loan, reduce EMI, save money!',
    images: ['/og-image-balance-transfer.jpg'],
  },
  alternates: {
    canonical: 'https://kreditscore.com/balance-transfer',
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

export default function BalanceTransferLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
