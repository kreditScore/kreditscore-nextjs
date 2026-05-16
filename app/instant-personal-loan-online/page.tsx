'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Check, CheckCircle, Shield, Zap, TrendingUp, Clock, Award, FileText, Users, BadgeCheck, Sparkles, CreditCard, Building2, Home, MapPin, Wallet } from 'lucide-react';
import Header from '@/components/Header';
import CustomCursor from '@/components/CustomCursor';
import LoanApplicationForm from '@/components/LoanApplicationFormImproved';
import Link from 'next/link';

const cardVariants = {
  hidden: { opacity: 0, y: 50, rotateX: -15 },
  visible: { opacity: 1, y: 0, rotateX: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const floatingAnimation = {
  y: [0, -10, 0],
  transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
};

export default function ApplyLoanPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Structured Data — Financial Product */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FinancialProduct',
            name: 'Instant Personal Loan Online',
            description: 'Get instant personal loan online from ₹50,000 to ₹25 lakh with minimal documentation. Quick approval in 24-72 hours with low interest rates starting from 9% p.a.',
            provider: {
              '@type': 'FinancialService',
              name: 'KreditScore',
              url: 'https://kreditscore.com',
            },
            interestRate: { '@type': 'QuantitativeValue', minValue: '9.0', maxValue: '24.0', unitText: 'Percent per annum' },
            amount: { '@type': 'MonetaryAmount', currency: 'INR', minValue: '50000', maxValue: '2500000' },
            aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.7', ratingCount: '2847', bestRating: '5' },
          }),
        }}
      />

      {/* BreadcrumbList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://kreditscore.com' },
              { '@type': 'ListItem', position: 2, name: 'Instant Personal Loan Online', item: 'https://kreditscore.com/instant-personal-loan-online' },
            ],
          }),
        }}
      />

      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              { '@type': 'Question', name: 'How quickly can I get an instant personal loan online?', acceptedAnswer: { '@type': 'Answer', text: 'You can get approval within 24-72 hours. Once approved, the loan amount is disbursed directly to your bank account within 1-2 working days.' } },
              { '@type': 'Question', name: 'What is the minimum credit score required for a personal loan?', acceptedAnswer: { '@type': 'Answer', text: 'A minimum credit score of 700 is required for instant personal loan approval.' } },
              { '@type': 'Question', name: 'What documents are needed for an instant personal loan?', acceptedAnswer: { '@type': 'Answer', text: 'You need PAN card, Aadhaar card, 3 months salary slips, 3 months bank statements, and proof of current address.' } },
              { '@type': 'Question', name: 'What is the interest rate for instant personal loans?', acceptedAnswer: { '@type': 'Answer', text: 'Interest rates start from 9% per annum and vary based on your credit score, income, and loan amount.' } },
              { '@type': 'Question', name: 'Can I prepay my personal loan without charges?', acceptedAnswer: { '@type': 'Answer', text: 'Yes, you can make part payments or full prepayment with zero foreclosure charges on most of our personal loan products.' } },
            ],
          }),
        }}
      />

      <CustomCursor />
      <Header />

      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0], opacity: [0.03, 0.08, 0.03] }} transition={{ duration: 20, repeat: Infinity }} className="absolute top-20 right-20 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
        <motion.div animate={{ scale: [1, 1.3, 1], rotate: [0, -90, 0], opacity: [0.03, 0.08, 0.03] }} transition={{ duration: 25, repeat: Infinity }} className="absolute bottom-20 left-20 w-96 h-96 bg-orange-400 rounded-full blur-3xl" />
      </div>

      <div className="pt-[100px] md:pt-[120px] pb-[60px] md:pb-[80px] px-3 md:px-4 relative z-10">
        <div className="max-w-[1400px] mx-auto">

          {/* Hero Section */}
          <div className="grid lg:grid-cols-2 gap-8 mb-12 items-center">
            {/* Left — Hero Content */}
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="flex flex-col justify-center">
              <motion.div animate={floatingAnimation} className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6 shadow-lg w-fit">
                <Zap className="w-4 h-4" />
                <span>Fresh Personal Loan</span>
              </motion.div>

              <h1 className="text-3xl md:text-5xl xl:text-6xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 bg-clip-text text-transparent leading-tight">
                Get Your Dream Loan
              </h1>
              <p className="text-base lg:text-lg text-gray-600 mb-8">
                ROI starts from <span className="font-bold text-orange-600">9%* per year</span>{' '}
                <span className="text-sm">(0.75% per month)</span>
              </p>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-3 mb-8">
                {[
                  { icon: TrendingUp, label: '₹1L-₹5Cr', sub: 'Amount', color: 'text-blue-600' },
                  { icon: Clock, label: '1-8 Years', sub: 'Tenure', color: 'text-green-600' },
                  { icon: Zap, label: '24-72 Hrs', sub: 'Approval', color: 'text-orange-600' },
                ].map(({ icon: Icon, label, sub, color }) => (
                  <div key={sub} className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
                    <Icon className={`w-7 h-7 ${color} mb-2`} />
                    <p className="text-lg font-bold text-gray-900 leading-tight">{label}</p>
                    <p className="text-xs text-gray-600">{sub}</p>
                  </div>
                ))}
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap gap-3 mb-8">
                {['🏦 20+ Banks', '✅ RBI Compliant', '🔒 100% Secure', '⚡ Instant Process'].map(b => (
                  <span key={b} className="bg-white border border-gray-200 text-gray-700 text-xs font-medium px-3 py-1.5 rounded-full shadow-sm">{b}</span>
                ))}
              </div>

              {/* CTA */}
              <motion.button
                id="apply-loan-btn"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setIsFormOpen(true)}
                className="inline-flex items-center justify-center gap-3 bg-gradient-to-br from-orange-500 via-orange-600 to-red-500 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-orange-300 transition-all w-fit"
              >
                Apply Now — Free
                <ArrowRight className="w-5 h-5" />
              </motion.button>
              <p className="text-xs text-gray-500 mt-3">No hidden charges. Approval in minutes.</p>
            </motion.div>

            {/* Right — Hero Card */}
            <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
              <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-blue-500/5 to-transparent rounded-full -mr-24 -mt-24" />
                <div className="relative z-10 text-center">
                  <div className="w-20 h-20 mx-auto mb-5 bg-gradient-to-br from-orange-100 to-blue-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-10 h-10 text-orange-500" strokeWidth={2} />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">
                    <span className="text-[#FF8C00]">Start Your </span>
                    <span className="text-[#87CEEB]">Loan Journey</span>
                  </h2>
                  <p className="text-gray-500 text-sm mb-6">✨ Instant • 🔒 Secure • 📱 Digital Process</p>

                  <div className="space-y-3 mb-6 text-left">
                    {[
                      'Loan amount ₹50K to ₹25 Lakh',
                      'Interest from 9% p.a.',
                      'Approval in 24-72 hours',
                      'Zero foreclosure charges',
                      'Compare 20+ banks instantly',
                    ].map(item => (
                      <div key={item} className="flex items-center gap-3 text-sm text-gray-700">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                        {item}
                      </div>
                    ))}
                  </div>

                  <motion.button
                    id="apply-loan-hero-btn"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsFormOpen(true)}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 shadow-lg"
                  >
                    Apply in 3 Simple Steps
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                  <p className="text-[11px] text-gray-400 mt-3">
                    By continuing you agree to our{' '}
                    <Link href="#" className="text-orange-500 hover:underline">Terms</Link> &{' '}
                    <Link href="#" className="text-orange-500 hover:underline">Privacy Policy</Link>
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Why Choose Us */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-2">Why Choose KreditScore?</h2>
            <p className="text-center text-gray-500 text-sm mb-8">India's most trusted personal loan marketplace</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Users, label: '5L+ Happy Customers', color: 'bg-blue-100 text-blue-600' },
                { icon: Award, label: '₹500 Cr+ Loans Disbursed', color: 'bg-green-100 text-green-600' },
                { icon: Shield, label: 'RBI Compliant & Secure', color: 'bg-purple-100 text-purple-600' },
                { icon: BadgeCheck, label: '20+ Bank Partners', color: 'bg-orange-100 text-orange-600' },
              ].map(({ icon: Icon, label, color }) => (
                <div key={label} className="bg-white rounded-2xl p-5 shadow-md border border-gray-100 text-center hover:shadow-lg transition-shadow">
                  <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center mx-auto mb-3`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-semibold text-gray-800">{label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Eligibility + Documents + How It Works */}
          <div className="overflow-x-auto pb-4">
            <div className="flex gap-6 snap-x snap-mandatory" style={{ minWidth: 'max-content' }}>

              {/* Eligibility Card */}
              <motion.div variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} whileHover={{ scale: 1.02, y: -5 }} className="bg-gradient-to-br from-white to-blue-50/30 rounded-3xl p-6 shadow-xl border border-blue-100 relative overflow-hidden snap-center w-[340px] md:w-[400px] flex-shrink-0">
                <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-blue-600" strokeWidth={2.5} />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Eligibility Criteria</h3>
                <p className="text-sm text-gray-600 mb-5">Quick check to know if you qualify</p>
                <div className="space-y-3">
                  {[
                    { icon: Users, label: 'Age: 23-58 years' },
                    { icon: Wallet, label: 'Min. Salary: ₹30,000/month' },
                    { icon: CreditCard, label: 'Min. CIBIL Score: 700' },
                    { icon: Building2, label: 'Employment: Min. 1 year' },
                    { icon: MapPin, label: 'Residing in serviceable city' },
                  ].map(({ icon: Icon, label }) => (
                    <div key={label} className="flex items-center gap-3 text-sm text-gray-700">
                      <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4 text-blue-500" />
                      </div>
                      {label}
                    </div>
                  ))}
                </div>
                <motion.button id="check-eligibility-btn" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setIsFormOpen(true)} className="mt-6 w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-lg">
                  Check Eligibility <ArrowRight className="w-4 h-4" />
                </motion.button>
              </motion.div>

              {/* How It Works */}
              <motion.div variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: 0.1 }} whileHover={{ scale: 1.02, y: -5 }} className="bg-gradient-to-br from-white to-green-50/30 rounded-3xl p-6 shadow-xl border border-green-100 snap-center w-[340px] md:w-[400px] flex-shrink-0">
                <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mb-4">
                  <Home className="w-6 h-6 text-green-600" strokeWidth={2.5} />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">How It Works</h3>
                <p className="text-sm text-gray-600 mb-5">3 simple steps to your loan</p>
                <div className="space-y-4">
                  {[
                    { step: '1', title: 'Fill Application', desc: 'Enter basic details — name, income, loan amount needed.' },
                    { step: '2', title: 'Get Offers', desc: 'Compare offers from 20+ banks and NBFCs instantly.' },
                    { step: '3', title: 'Receive Funds', desc: 'Loan disbursed to your bank account in 24-72 hours.' },
                  ].map(({ step, title, desc }) => (
                    <div key={step} className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 font-bold text-sm flex items-center justify-center flex-shrink-0">{step}</div>
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">{title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <motion.button id="start-application-btn" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setIsFormOpen(true)} className="mt-6 w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-lg">
                  Start Application <ArrowRight className="w-4 h-4" />
                </motion.button>
              </motion.div>

              {/* Documents Required */}
              <motion.div variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: 0.2 }} whileHover={{ scale: 1.02, y: -5 }} className="bg-gradient-to-br from-white to-orange-50/30 rounded-3xl p-6 shadow-xl border border-orange-100 snap-center w-[340px] md:w-[400px] flex-shrink-0">
                <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-orange-600" strokeWidth={2.5} />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Required Documents</h3>
                <p className="text-sm text-gray-600 mb-5">Basic identity proof, address proof, and income documents</p>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 mb-2">Identity Proof</h4>
                    <ul className="space-y-1.5">
                      {['Passport', 'Voter ID', 'Driving License', 'PAN Card'].map(d => (
                        <li key={d} className="flex items-start gap-1.5 text-xs text-gray-700">
                          <div className="w-1.5 h-1.5 bg-orange-500 rounded-full flex-shrink-0 mt-1.5" />
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 mb-2">Address Proof</h4>
                    <ul className="space-y-1.5">
                      {['Aadhaar Card', 'Gas Bill', 'Electricity Bill'].map(d => (
                        <li key={d} className="flex items-start gap-1.5 text-xs text-gray-700">
                          <div className="w-1.5 h-1.5 bg-orange-500 rounded-full flex-shrink-0 mt-1.5" />
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 mb-2">Income Documents</h4>
                  <ul className="space-y-1.5">
                    {['Salary Slips (3 months)', 'Bank Statement (3 months)'].map(d => (
                      <li key={d} className="flex items-start gap-1.5 text-xs text-gray-700">
                        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full flex-shrink-0 mt-1.5" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
                <motion.button id="apply-docs-btn" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setIsFormOpen(true)} className="mt-6 w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-lg">
                  Apply Now <ArrowRight className="w-4 h-4" />
                </motion.button>
              </motion.div>
            </div>
          </div>

          {/* FAQ Section */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mt-12">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-2">Frequently Asked Questions</h2>
            <p className="text-center text-gray-500 text-sm mb-8">Everything you need to know</p>
            <div className="max-w-3xl mx-auto space-y-4">
              {[
                { q: 'How quickly can I get an instant personal loan online?', a: 'You can get approval within 24-72 hours. Once approved, the loan amount is disbursed directly to your bank account within 1-2 working days.' },
                { q: 'What is the minimum credit score required?', a: 'A minimum CIBIL score of 700 is required. Higher scores qualify you for lower interest rates.' },
                { q: 'What is the interest rate for instant personal loans?', a: 'Interest rates start from 9% per annum (0.75% per month) and go up to 24% p.a. depending on your credit profile.' },
                { q: 'Can I prepay my personal loan without charges?', a: 'Yes! Zero foreclosure charges on most of our personal loan products. You can make part payments or full prepayment anytime.' },
                { q: 'What is the maximum loan amount I can get?', a: 'You can get a personal loan from ₹50,000 to ₹25 lakh, depending on your monthly income, credit score, and repayment capacity.' },
              ].map(({ q, a }) => (
                <div key={q} className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
                  <p className="font-semibold text-gray-900 mb-2 text-sm md:text-base">{q}</p>
                  <p className="text-gray-600 text-sm">{a}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Final CTA Banner */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-12 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 text-center text-white">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">Ready to Apply?</h2>
            <p className="text-blue-100 mb-6 text-sm md:text-base">Join 5 lakh+ satisfied customers. Get your loan in 3 simple steps.</p>
            <motion.button id="final-apply-btn" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => setIsFormOpen(true)} className="bg-white text-blue-700 font-bold px-8 py-3.5 rounded-xl text-base inline-flex items-center gap-2 shadow-lg hover:shadow-xl transition-all">
              Apply Now — It's Free <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </div>
      </div>

      <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-6 text-center relative z-10">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-sm">© 2025 KreditScore. All rights reserved.</p>
          <p className="text-xs text-gray-400 mt-1">Secure • Fast • Trusted</p>
        </div>
      </footer>

      {/* Loan Application Modal */}
      <LoanApplicationForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} loanType="Instant Personal Loan" />
    </div>
  );
}
