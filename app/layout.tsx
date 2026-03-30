import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hi">
      <body className={poppins.className}>{children}</body>
    </html>
  );
}
