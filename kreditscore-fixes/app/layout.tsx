import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Toaster } from "sonner";
import { SITE_URL } from "@/lib/site";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";

const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "KreditScore - Personal Loan, Credit Score, Pre-Approved Loans | Instant Approval India",
  description: "Get instant personal loans, check credit score free, pre-approved loans, doctor loans, teacher loans, CA loans. Convert credit card bill to personal loan. Best rates in India.",
  keywords: "personal loan, credit score, CIBIL score, pre approved loan, fresh personal loan, doctor loan, teacher loan, CA loan, pay credit card bill, small app loan, debt consolidation, balance transfer",
  openGraph: {
    title: "KreditScore - Instant Personal Loans & Credit Score India",
    description: "Get instant personal loans up to ₹25 lakh. Check credit score free. Pre-approved loans, doctor loans, teacher loans, CA loans. Best rates from 20+ banks.",
    type: "website",
    url: SITE_URL,
    siteName: "KreditScore",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "KreditScore - Instant Personal Loans India",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "KreditScore - Instant Personal Loans & Credit Score India",
    description: "Get instant personal loans up to ₹25 lakh. Check credit score free. Best rates from 20+ banks in India.",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: SITE_URL,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-IN">
      <body className={poppins.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
