import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";

export default function BlogFooter() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white mt-20">
      <div className="max-w-5xl mx-auto px-5 py-12 md:py-14">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <div className="text-[24px] font-semibold mb-3">
              <span className="text-white">Kredit</span>
              <span className="text-[#87CEEB]">Score</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-md">
              Clear, useful articles on loans, credit scores, and personal finance.
              Download the app or reach support when you need help.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="text-[#87CEEB] font-semibold text-sm uppercase tracking-wide">
              Quick links
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/instant-personal-loan-online"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Personal loan apply
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-300 hover:text-white transition-colors">
                  All articles
                </Link>
              </li>
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
            </ul>
            <ul className="space-y-2 text-sm text-gray-400 pt-2 border-t border-white/10">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#87CEEB] shrink-0" />
                support@kreditscore.in
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#87CEEB] shrink-0" />
                +91 98111 95111
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#87CEEB] shrink-0" />
                New Delhi, India
              </li>
            </ul>
          </div>
        </div>
        <p className="text-center text-gray-500 text-xs mt-10 pt-8 border-t border-white/10">
          © {new Date().getFullYear()} KreditScore. Information is for education only; final terms depend on the lender.
        </p>
      </div>
    </footer>
  );
}
