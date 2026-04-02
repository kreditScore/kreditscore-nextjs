import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Teacher Loan - Special Rates for Educators with Zero Processing Fee | KreditScore',
  description: 'Exclusive personal loan for teachers and educators. Zero processing fee, low interest rates, and special benefits. Get instant approval for teacher loans. Apply online now!',
  keywords: [
    'teacher loan',
    'loan for teachers',
    'educator loan',
    'teacher personal loan',
    'zero processing fee loan',
    'professor loan',
    'school teacher loan',
    'college teacher loan',
    'teaching staff loan',
    'education sector loan',
    'teacher finance',
    'special rate teacher loan',
    'low interest teacher loan',
    'zero PF loan',
    'instant teacher loan',
    'online teacher loan',
    'teacher loan India',
    'educator personal loan',
    'academic staff loan',
    'teacher special loan'
  ],
  openGraph: {
    title: 'Teacher Loan - Zero Processing Fee for Educators | KreditScore',
    description: 'Special loan for teachers! Zero processing fee + low interest rates. Designed exclusively for educators and teaching professionals.',
    type: 'website',
    url: 'https://www.kreditscore.in/teacher-loan',
    siteName: 'KreditScore',
    images: [
      {
        url: '/og-image-teacher-loan.jpg',
        width: 1200,
        height: 630,
        alt: 'Teacher Loan - KreditScore',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Teacher Loan - Zero PF for Educators | KreditScore',
    description: 'Exclusive for teachers! Zero processing fee + special rates!',
    images: ['/og-image-teacher-loan.jpg'],
  },
  alternates: {
    canonical: 'https://www.kreditscore.in/teacher-loan',
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

export default function TeacherLoanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
