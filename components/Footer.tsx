'use client';

import { Mail, MapPin, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white py-8 md:py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="text-[28px] font-bold mb-4">
              <span className="text-white">Kredit</span>
              <span className="inline-flex">
                <span className="inline-block animate-bounce-s text-[#87CEEB]">S</span>
                <span className="inline-block animate-bounce-c text-[#87CEEB]">c</span>
                <span className="inline-block animate-bounce-o text-[#87CEEB]">o</span>
                <span className="inline-block animate-bounce-r text-[#87CEEB]">r</span>
                <span className="inline-block animate-bounce-e text-[#87CEEB]">e</span>
              </span>
            </div>

            <div>
              <h4 className="text-[16px] text-[#87CEEB] mb-4">Download Our App</h4>
              <div className="flex flex-wrap gap-2">
                <a href="https://play.google.com/store" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2.5 bg-[#2a2a2a] px-5 py-2.5 rounded-[10px] text-white text-[14px] font-semibold hover:bg-[#87CEEB] hover:text-black hover:-translate-y-1 transition-all duration-300">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                  </svg>
                  <span>Google Play</span>
                </a>
                <a href="https://www.apple.com/app-store/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2.5 bg-[#2a2a2a] px-5 py-2.5 rounded-[10px] text-white text-[14px] font-semibold hover:bg-[#87CEEB] hover:text-black hover:-translate-y-1 transition-all duration-300">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.1 17.41,12.63C17.44,15.65 20.06,16.66 20.09,16.67C20.06,16.74 19.67,18.11 18.71,19.5M13,3.5C13.73,2.67 14.94,2.04 15.94,2C16.07,3.17 15.6,4.35 14.9,5.19C14.21,6.04 13.07,6.7 11.95,6.61C11.8,5.46 12.36,4.26 13,3.5Z" />
                  </svg>
                  <span>App Store</span>
                </a>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-[16px] font-semibold mb-4 text-[#87CEEB]">Resources</h4>
            <ul className="space-y-3">
              <li><a href="/instant-personal-loan-online" className="text-[#cccccc] hover:text-white transition-colors text-[14px]">Blog & Articles</a></li>
              <li><a href="/pre-approved-personal-loan" className="text-[#cccccc] hover:text-white transition-colors text-[14px]">FAQs</a></li>
              <li><a href="/debt-consolidation" className="text-[#cccccc] hover:text-white transition-colors text-[14px]">Financial Tips</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[16px] font-semibold mb-4 text-[#87CEEB]">Legal</h4>
            <ul className="space-y-3">
              <li><a href="/privacy-policy" className="text-[#cccccc] hover:text-white transition-colors text-[14px]">Privacy Policy</a></li>
              <li><a href="/cookie-policy" className="text-[#cccccc] hover:text-white transition-colors text-[14px]">Cookie Policy</a></li>
              <li><a href="/disclaimer" className="text-[#cccccc] hover:text-white transition-colors text-[14px]">Disclaimer</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[16px] font-semibold mb-4 text-[#87CEEB]">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-[#cccccc] text-[14px]">
                <Mail className="w-5 h-5 text-[#87CEEB] flex-shrink-0" />
                <span>support@kreditscore.in</span>
              </li>
              <li className="flex items-center gap-3 text-[#cccccc] text-[14px]">
                <Phone className="w-5 h-5 text-[#87CEEB] flex-shrink-0" />
                <span>+91 98111 95111</span>
              </li>
              <li className="flex items-center gap-3 text-[#cccccc] text-[14px]">
                <MapPin className="w-5 h-5 text-[#87CEEB] flex-shrink-0" />
                <span>New Delhi, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="md:hidden grid grid-cols-3 gap-3 mb-6">
          <div>
            <h4 className="text-[10px] font-semibold mb-2 text-[#87CEEB]">Resources</h4>
            <ul className="space-y-1">
              <li><a href="/instant-personal-loan-online" className="text-[#cccccc] hover:text-white transition-colors text-[8px] block">Blog & Articles</a></li>
              <li><a href="/pre-approved-personal-loan" className="text-[#cccccc] hover:text-white transition-colors text-[8px] block">FAQs</a></li>
              <li><a href="/debt-consolidation" className="text-[#cccccc] hover:text-white transition-colors text-[8px] block">Financial Tips</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-semibold mb-2 text-[#87CEEB]">Legal</h4>
            <ul className="space-y-1">
              <li><a href="/privacy-policy" className="text-[#cccccc] hover:text-white transition-colors text-[8px] block">Privacy Policy</a></li>
              <li><a href="/cookie-policy" className="text-[#cccccc] hover:text-white transition-colors text-[8px] block">Cookie Policy</a></li>
              <li><a href="/disclaimer" className="text-[#cccccc] hover:text-white transition-colors text-[8px] block">Disclaimer</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-semibold mb-2 text-[#87CEEB]">Contact Us</h4>
            <ul className="space-y-1">
              <li className="flex items-center gap-1 text-[#cccccc] text-[8px]">
                <Phone className="w-2.5 h-2.5 text-[#87CEEB] flex-shrink-0" />
                <span>+91 98111 95111</span>
              </li>
              <li className="flex items-start gap-1 text-[#cccccc] text-[8px]">
                <MapPin className="w-2.5 h-2.5 text-[#87CEEB] flex-shrink-0 mt-0.5" />
                <span>New Delhi, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-4 md:pt-8 text-center">
          <p className="text-[10px] md:text-[14px] text-gray-400">© 2025 KreditScore. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
