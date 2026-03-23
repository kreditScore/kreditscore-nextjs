'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ChevronDown,
  Menu,
  X,
  CreditCard,
  CheckCircle,
  Wallet,
  Smartphone,
  RefreshCw,
  FileText,
  Stethoscope,
  Calculator,
  GraduationCap,
  Building2,
  Home,
  Coins,
  User,
  Check,
  Info,
  Phone,
  Briefcase,
  Newspaper,
  Handshake,
  FileCheck,
  Shield,
  Book,
  HelpCircle,
  BookOpen,
  Lightbulb,
  Video,
  UserCircle,
  UserSquare,
  Download
} from 'lucide-react';

interface DropdownItem {
  href: string;
  icon: any;
  title: string;
  subtitle?: string;
}

interface NavItem {
  label: string;
  emoji: string;
  items: DropdownItem[];
}

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // All letters bounce continuously with staggered timing
  useEffect(() => {
    // No state needed - CSS animations handle this
  }, []);

  // Navigation structure
  const navigation: NavItem[] = [
    {
      label: 'Loans',
      emoji: '💰',
      items: [
        { href: '/instant-personal-loan-online', icon: CreditCard, title: 'Fresh Personal Loan' },
        { href: '/pre-approved-personal-loan', icon: CheckCircle, title: 'Pre-Approved Loan' },
        { href: '/credit-card-bill-payment', icon: CreditCard, title: 'Pay Credit Card Bill' },
        { href: '#debt-consolidation', icon: RefreshCw, title: 'Debt Consolidation' },
        { href: '#salaried-overdraft', icon: Wallet, title: 'Salaried Over Draft' },
        { href: '#small-apps', icon: Smartphone, title: 'Small Apps Loan' },
        { href: '#balance-transfer', icon: RefreshCw, title: 'Balance Transfer' },
        { href: '#existing-transfer', icon: FileText, title: 'Existing Loan Transfer', subtitle: 'Without Income Proof' },
        { href: '#doctor-loan', icon: Stethoscope, title: 'Doctor Loan' },
        { href: '#ca-loan', icon: Calculator, title: 'CA Loan' },
        { href: '#teacher-loan', icon: GraduationCap, title: 'Teacher Loan' },
        { href: '#govt-loan', icon: Building2, title: 'Government Employee Loan' },
      ]
    },
    {
      label: 'Tools',
      emoji: '🔧',
      items: [
        { href: '#home-emi', icon: Home, title: 'Home Loan EMI Calculator' },
        { href: '#part-payment', icon: Coins, title: 'Part Payment Calculator' },
        { href: '#personal-emi', icon: User, title: 'Personal Loan EMI Calculator' },
        { href: '#eligibility', icon: Check, title: 'Loan Eligibility Calculator' },
      ]
    },
    {
      label: 'Company',
      emoji: '🏢',
      items: [
        { href: '#about', icon: Info, title: 'About Us' },
        { href: '#contact', icon: Phone, title: 'Contact Us' },
        { href: '#careers', icon: Briefcase, title: 'Careers' },
        { href: '#press', icon: Newspaper, title: 'Press & Media' },
        { href: '#partner', icon: Handshake, title: 'Partner with Us' },
        { href: '#terms', icon: FileCheck, title: 'Terms & Conditions' },
        { href: '#privacy', icon: Shield, title: 'Privacy Policy' },
      ]
    },
    {
      label: 'Resources',
      emoji: '📚',
      items: [
        { href: '#cibil-guide', icon: Book, title: 'CIBIL Report Guide' },
        { href: '#score-faqs', icon: HelpCircle, title: 'Credit Score FAQs' },
        { href: '#blog', icon: BookOpen, title: 'Blog & Articles' },
        { href: '#tips', icon: Lightbulb, title: 'Financial Tips' },
        { href: '#videos', icon: Video, title: 'Video Tutorials' },
      ]
    }
  ];

  const loginItems: DropdownItem[] = [
    { href: '#customer-login', icon: UserCircle, title: 'Customer Login', subtitle: 'Access your account' },
    { href: '#employee-login', icon: UserSquare, title: 'Employee Login', subtitle: 'Staff portal' },
    { href: '#partner-login', icon: Handshake, title: 'Partner Login', subtitle: 'Partner dashboard' },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleDropdownToggle = (label: string) => {
    setActiveDropdown(activeDropdown === label ? null : label);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#ffffff] shadow-[0_2px_10px_rgba(0,0,0,0.08)]">
      <div className="max-w-[1400px] mx-auto px-5">
        <div className="flex items-center justify-between h-[70px]">
          {/* Logo */}
          <Link
            href="/"
            onClick={() => window.location.href = '/'}
            className="flex items-center text-[26px] font-normal group hover:scale-105 transition-all duration-300"
          >
            {/* Kredit - Orange color */}
            <span className="text-[#FF8C00] font-normal">Kredit</span>
            {/* Score - Sky Blue with continuous bouncing letters */}
            <span className="inline-flex text-[#87CEEB]">
              <span className="inline-block animate-bounce-s">S</span>
              <span className="inline-block animate-bounce-c">c</span>
              <span className="inline-block animate-bounce-o">o</span>
              <span className="inline-block animate-bounce-r">r</span>
              <span className="inline-block animate-bounce-e">e</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-[25px]">
            {navigation.map((navItem) => (
              <div key={navItem.label} className="relative group">
                <button className="flex items-center gap-1.5 px-3 py-2 text-[#2c3e50] text-[14px] font-medium hover:text-[#FF8C00] hover:bg-[rgba(255,140,0,0.05)] rounded-lg transition-all duration-300">
                  <span>{navItem.emoji} {navItem.label}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {/* Dropdown Menu */}
                <div className="absolute left-0 mt-2.5 min-w-[250px] bg-white rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 -translate-y-2.5 z-[1001]">
                  <div className="py-2.5">
                    {navItem.items.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="flex items-center gap-3 px-5 py-2.5 hover:bg-gradient-to-r hover:from-[rgba(255,140,0,0.05)] hover:to-[rgba(135,206,235,0.05)] hover:pl-[25px] transition-all duration-200 group/item"
                        >
                          <Icon className="w-5 h-5 text-[#87CEEB] group-hover/item:text-[#FF8C00] flex-shrink-0 transition-colors duration-200" />
                          <div>
                            <div className="text-[14px] font-normal text-[#2c3e50] group-hover/item:text-[#FF8C00] transition-colors duration-200">{item.title}</div>
                            {item.subtitle && (
                              <div className="text-xs text-gray-500 mt-0.5">{item.subtitle}</div>
                            )}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}

            {/* Login Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-1.5 px-3 py-2 text-[#FF8C00] text-[14px] font-medium hover:bg-[rgba(255,140,0,0.05)] rounded-lg transition-all duration-300">
                <User className="w-4 h-4 text-[#87CEEB]" />
                <span>Login</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              <div className="absolute right-0 mt-2 w-20 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2">
                <div className="py-0.5">
                  {loginItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex flex-col items-center px-1.5 py-1.5 hover:bg-gradient-to-r hover:from-[rgba(255,140,0,0.05)] hover:to-[rgba(135,206,235,0.05)] transition-colors duration-200 group/item"
                      >
                        <Icon className="w-3.5 h-3.5 text-[#87CEEB] group-hover/item:text-[#FF8C00] flex-shrink-0 transition-colors duration-200" />
                        <div className="text-[9px] font-semibold text-gray-900 group-hover/item:text-[#FF8C00] transition-colors duration-200 text-center mt-0.5 leading-tight">{item.title.replace(' Login', '')}</div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </nav>

          {/* Mobile Hamburger */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden p-2 text-gray-700 hover:text-[#FF8C00] transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="lg:hidden bg-white border-t border-gray-200"
        >
          <div className="max-h-[calc(100vh-5rem)] overflow-y-auto px-4 py-4 space-y-2">
            {navigation.map((navItem) => (
              <div key={navItem.label} className="border-b border-gray-100 pb-2">
                <button
                  onClick={() => handleDropdownToggle(navItem.label)}
                  className="flex items-center justify-between w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <span className="font-medium">{navItem.emoji} {navItem.label}</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      activeDropdown === navItem.label ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {activeDropdown === navItem.label && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-2 space-y-1"
                  >
                    {navItem.items.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="flex items-start px-4 py-2 hover:bg-gray-50 rounded-lg transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Icon className="w-5 h-5 text-[#87CEEB] mt-0.5 flex-shrink-0" />
                          <div className="ml-3">
                            <div className="text-sm text-gray-900">{item.title}</div>
                            {item.subtitle && (
                              <div className="text-xs text-gray-500 mt-0.5">{item.subtitle}</div>
                            )}
                          </div>
                        </Link>
                      );
                    })}
                  </motion.div>
                )}
              </div>
            ))}

            {/* Mobile Login */}
            <div className="border-b border-gray-100 pb-2">
              <button
                onClick={() => handleDropdownToggle('Login')}
                className="flex items-center justify-between w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <span className="font-medium">👤 Login</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    activeDropdown === 'Login' ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {activeDropdown === 'Login' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-2 space-y-1"
                >
                  {loginItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-start px-4 py-2 hover:bg-gray-50 rounded-lg transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Icon className="w-6 h-6 text-[#87CEEB] mt-0.5 flex-shrink-0" />
                        <div className="ml-3">
                          <div className="text-sm font-semibold text-gray-900">{item.title}</div>
                          {item.subtitle && (
                            <div className="text-xs text-gray-500 mt-0.5">{item.subtitle}</div>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </motion.div>
              )}
            </div>

            {/* Mobile Download App Button */}
            <Link
              href="#check-score"
              className="flex items-center justify-center space-x-2 w-full px-6 py-3 bg-[#FF8C00] text-white rounded-full font-semibold hover:bg-[#e67e00] transition-all duration-300"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Download className="w-5 h-5" />
              <span>Download App</span>
            </Link>
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default Header;
