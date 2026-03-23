import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Doctor Loan - Special Interest Rates for Medical Professionals | KreditScore',
  description: 'Exclusive personal loans for doctors and medical practitioners. Special interest rates, higher loan amounts, and quick approval. Get up to ₹50 lakh loan for medical professionals.',
  keywords: [
    'doctor loan',
    'loan for doctors',
    'medical professional loan',
    'doctor personal loan',
    'physician loan',
    'healthcare professional loan',
    'special rate doctor loan',
    'medical practitioner loan',
    'surgeon loan',
    'dentist loan',
    'doctor loan India',
    'medical loan',
    'loan for medical professionals',
    'doctor finance',
    'healthcare loan',
    'medical staff loan',
    'doctor special loan',
    'low interest doctor loan',
    'instant doctor loan',
    'online doctor loan'
  ],
  openGraph: {
    title: 'Doctor Loan - Exclusive Rates for Medical Professionals | KreditScore',
    description: 'Special interest rates for doctors! Higher loan amounts, quick approval. Designed exclusively for medical professionals.',
    type: 'website',
    url: 'https://kreditscore.com/doctor-loan',
    siteName: 'KreditScore',
    images: [
      {
        url: '/og-image-doctor-loan.jpg',
        width: 1200,
        height: 630,
        alt: 'Doctor Loan - KreditScore',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Doctor Loan - Special Rates for Doctors | KreditScore',
    description: 'Exclusive loan for medical professionals with special rates!',
    images: ['/og-image-doctor-loan.jpg'],
  },
  alternates: {
    canonical: 'https://kreditscore.com/doctor-loan',
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

export default function DoctorLoanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
