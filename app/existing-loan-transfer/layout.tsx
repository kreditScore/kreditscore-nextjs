import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Existing Loan Transfer - Transfer Without Income Proof | KreditScore',
  description: 'Transfer any existing loan without income proof. Switch to lower interest rates and reduce EMI. Simple documentation, fast approval. Balance transfer made easy!',
  keywords: [
    'existing loan transfer',
    'loan transfer without income proof',
    'no income proof loan transfer',
    'transfer any loan',
    'easy loan transfer',
    'balance transfer no documents',
    'switch loan provider',
    'loan refinance no income proof',
    'transfer personal loan',
    'transfer home loan',
    'transfer car loan',
    'existing loan switch',
    'loan transfer India',
    'minimal documentation transfer',
    'fast loan transfer',
    'instant loan transfer',
    'online loan transfer',
    'reduce EMI transfer',
    'lower interest transfer',
    'existing loan refinance'
  ],
  openGraph: {
    title: 'Existing Loan Transfer - No Income Proof Required | KreditScore',
    description: 'Transfer any existing loan without income proof! Switch to lower rates and reduce EMI. Minimal documentation required.',
    type: 'website',
    url: 'https://www.kreditscore.in/existing-loan-transfer',
    siteName: 'KreditScore',
    images: [
      {
        url: '/og-image-existing-loan-transfer.jpg',
        width: 1200,
        height: 630,
        alt: 'Existing Loan Transfer - KreditScore',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Existing Loan Transfer - No Income Proof | KreditScore',
    description: 'Transfer any loan without income proof! Lower rates guaranteed!',
    images: ['/og-image-existing-loan-transfer.jpg'],
  },
  alternates: {
    canonical: 'https://www.kreditscore.in/existing-loan-transfer',
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

export default function ExistingLoanTransferLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
