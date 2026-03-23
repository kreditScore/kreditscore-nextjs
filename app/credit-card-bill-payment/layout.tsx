import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pay Credit Card Bill with Personal Loan - Convert High Interest to Low Interest | KreditScore',
  description: 'Convert your high-interest credit card bill (42% p.a.) into a low-interest personal loan (12% p.a.). Save up to 30% on interest. Pay minimum dues smartly. 100% digital process with instant approval.',
  keywords: [
    'pay credit card bill',
    'credit card bill payment',
    'convert credit card to personal loan',
    'credit card debt consolidation',
    'minimum payment trap',
    'high interest credit card',
    'low interest personal loan',
    'credit card bill EMI',
    'reduce credit card interest',
    'credit card relief',
    'pay credit card outstanding',
    'credit card to personal loan conversion',
    'save on credit card interest',
    'credit card debt solution',
    'instant credit card bill payment'
  ],
  openGraph: {
    title: 'Pay Credit Card Bill with Low Interest Personal Loan | KreditScore',
    description: 'Stop paying 42% interest on credit cards! Convert to personal loan at 12% interest and save ₹30,000+ annually. Instant approval.',
    type: 'website',
    url: 'https://kreditscore.com/credit-card-bill-payment',
    siteName: 'KreditScore',
    images: [
      {
        url: '/og-image-credit-card-bill.jpg',
        width: 1200,
        height: 630,
        alt: 'Pay Credit Card Bill with Personal Loan - KreditScore',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pay Credit Card Bill with Low Interest Personal Loan | KreditScore',
    description: 'Convert 42% credit card interest to 12% personal loan. Save ₹30,000+ annually!',
    images: ['/og-image-credit-card-bill.jpg'],
  },
  alternates: {
    canonical: 'https://kreditscore.com/credit-card-bill-payment',
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

export default function CreditCardBillPaymentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
