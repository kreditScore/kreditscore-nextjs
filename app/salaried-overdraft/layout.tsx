import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Salaried Overdraft Facility - Withdraw When You Need | KreditScore',
  description: 'Get salaried overdraft facility with instant access to credit. Withdraw money as per your need and pay interest only on the used amount. Flexible overdraft limit up to 3x your salary. Apply online in 2 minutes.',
  keywords: [
    'salaried overdraft',
    'overdraft facility for salaried',
    'salary overdraft',
    'instant overdraft',
    'overdraft loan',
    'credit line for salaried',
    'flexible credit facility',
    'withdraw when needed',
    'pay on usage overdraft',
    'salary based overdraft',
    'OD facility',
    'overdraft account',
    'salaried employee overdraft',
    'instant credit facility',
    'overdraft India',
    'online overdraft facility',
    'low interest overdraft',
    'revolving credit facility',
    'emergency credit line',
    'quick overdraft approval'
  ],
  openGraph: {
    title: 'Salaried Overdraft - Withdraw Anytime, Pay Interest Only on Used Amount | KreditScore',
    description: 'Access instant credit with salaried overdraft facility. Get up to 3x your monthly salary as credit limit. Pay interest only on amount used. Apply now!',
    type: 'website',
    url: 'https://kreditscore.com/salaried-overdraft',
    siteName: 'KreditScore',
    images: [
      {
        url: '/og-image-salaried-overdraft.jpg',
        width: 1200,
        height: 630,
        alt: 'Salaried Overdraft Facility - KreditScore',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Salaried Overdraft - Withdraw When You Need | KreditScore',
    description: 'Get overdraft up to 3x salary. Pay interest only on used amount. Instant approval!',
    images: ['/og-image-salaried-overdraft.jpg'],
  },
  alternates: {
    canonical: 'https://kreditscore.com/salaried-overdraft',
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

export default function SalariedOverdraftLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
