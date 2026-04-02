import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.kreditscore.in"),
  title: "KreditScore - Personal Loan, Credit Score, Pre-Approved Loans | Instant Approval India",
  description: "Get instant personal loans, check credit score free, pre-approved loans, doctor loans, teacher loans, CA loans. Convert credit card bill to personal loan. Best rates in India.",
  keywords: "personal loan, credit score, CIBIL score, pre approved loan, fresh personal loan, doctor loan, teacher loan, CA loan, pay credit card bill, small app loan, debt consolidation, balance transfer",
  alternates: {
    canonical: "https://www.kreditscore.in",
  },
  openGraph: {
    type: "website",
    url: "https://www.kreditscore.in",
    title: "KreditScore - Instant Personal Loan Solutions",
    description: "Apply online for personal loans with fast approvals and transparent rates.",
    siteName: "KreditScore",
  },
  twitter: {
    card: "summary_large_image",
    title: "KreditScore - Instant Personal Loan Solutions",
    description: "Quick apply flow, secure data handling, and fast approvals.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
