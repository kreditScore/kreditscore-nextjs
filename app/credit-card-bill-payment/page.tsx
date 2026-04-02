'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Award,
  Calculator,
  CheckCircle,
  Clock,
  CreditCard,
  FileText,
  Phone,
  Shield,
  TrendingUp,
  Users,
  Wallet,
  Zap,
} from 'lucide-react';
import Header from '@/components/Header';
import CustomCursor from '@/components/CustomCursor';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { captureLead } from '@/lib/leadCapture';
import { useAuth } from '@/components/AuthProvider';
import ApplicantRelationFields from '@/components/ApplicantRelationFields';
import SupabaseAuthInline from '@/components/SupabaseAuthInline';
import { getSupabaseDisplayName, getSupabasePhoneDigits } from '@/lib/supabase/user';
import { isValidIndianMobile } from '@/lib/validation';

const formatINR = (n: number) =>
  n.toLocaleString('en-IN', { maximumFractionDigits: 0 });

const CC_RATE = 45;
const PL_RATE = 10.25;
const CALC_MIN = 10_000;
const CALC_MAX = 500_000;

export default function CreditCardBillPaymentPage() {
  const pathname = usePathname();
  const { user, loading: authLoading } = useAuth();
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [applicantFor, setApplicantFor] = useState<'self' | 'other'>('self');
  const [applicantName, setApplicantName] = useState('');
  const [applicantMobile, setApplicantMobile] = useState('');
  const [relationshipNote, setRelationshipNote] = useState('');
  const [ccBillAmount, setCcBillAmount] = useState(500_000);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    const p = getSupabasePhoneDigits(user);
    if (p && p.length === 10) setMobile(p);
    const dn = getSupabaseDisplayName(user);
    if (dn) setName(dn);
  }, [user]);

  const { ccMonthly, plMonthly, monthlySave, annualSave } = useMemo(() => {
    const cc = (ccBillAmount * CC_RATE) / 100 / 12;
    const pl = (ccBillAmount * PL_RATE) / 100 / 12;
    const m = Math.max(cc - pl, 0);
    return {
      ccMonthly: Math.round(cc),
      plMonthly: Math.round(pl),
      monthlySave: Math.round(m),
      annualSave: Math.round(m * 12),
    };
  }, [ccBillAmount]);

  const handleName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setName(
      v
        .split(' ')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ')
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authLoading || !user) return;
    const borrowerName = applicantFor === 'other' ? applicantName.trim() : name.trim();
    const borrowerMobile = applicantFor === 'other' ? applicantMobile : mobile;
    if (borrowerName.length < 2 || !isValidIndianMobile(borrowerMobile)) return;
    if (applicantFor === 'other' && !applicantName.trim()) return;

    setLoading(true);
    captureLead({
      source: 'loan_modal_form',
      name: borrowerName,
      mobile: borrowerMobile,
      loanType: 'credit_card_bill_payment',
      amount: String(ccBillAmount),
      applicantFor,
      applicantName: applicantFor === 'other' ? borrowerName : undefined,
      applicantMobile: applicantFor === 'other' ? borrowerMobile : undefined,
      relationshipNote: applicantFor === 'other' ? relationshipNote.trim() || undefined : undefined,
    });
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50, rotateX: -15 },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  const floatingAnimation = {
    y: [0, -10, 0],
    transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FinancialProduct',
            name: 'Pay Credit Card Bill — Convert to Personal Loan',
            description:
              'Convert high-interest credit card dues to a lower-rate personal loan. Indicative savings vs typical credit card APR.',
            provider: {
              '@type': 'FinancialService',
              name: 'KreditScore',
              url: 'https://www.kreditscore.in',
            },
            category: 'Debt consolidation',
            offers: {
              '@type': 'Offer',
              url: 'https://www.kreditscore.in/credit-card-bill-payment',
            },
          }),
        }}
      />

      <CustomCursor />
      <Header />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0], opacity: [0.03, 0.08, 0.03] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-20 right-20 w-96 h-96 bg-blue-500 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], rotate: [0, -90, 0], opacity: [0.03, 0.08, 0.03] }}
          transition={{ duration: 25, repeat: Infinity }}
          className="absolute bottom-20 left-20 w-96 h-96 bg-orange-400 rounded-full blur-3xl"
        />
      </div>

      <div className="pt-[100px] md:pt-[120px] pb-[60px] md:pb-[80px] px-3 md:px-4 relative z-10">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid lg:grid-cols-[2fr_0.7fr] gap-6 md:gap-8 mb-8 md:mb-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col justify-center"
            >
              <motion.div
                animate={floatingAnimation}
                className="inline-flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-3 py-1.5 sm:px-4 sm:py-2 md:px-6 rounded-full text-xs sm:text-sm font-semibold mb-4 sm:mb-5 md:mb-6 shadow-lg w-fit"
              >
                <CreditCard className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="whitespace-nowrap">Pay Credit Card Bill</span>
              </motion.div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-2 sm:mb-3 md:mb-4 leading-tight">
                <span className="text-gray-900">Freedom from </span>
                <span className="bg-gradient-to-r from-red-700 via-rose-600 to-orange-500 bg-clip-text text-transparent">
                  Credit Card Debt!
                </span>
              </h1>
              <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-600 mb-4 sm:mb-6 md:mb-8">
                Convert Your Credit Card Bill to Personal Loan
              </p>

              <div className="grid grid-cols-3 gap-1.5 sm:gap-2 md:gap-3 lg:gap-4">
                <div className="bg-white rounded-lg sm:rounded-xl md:rounded-2xl p-1.5 sm:p-2 md:p-3 lg:p-4 shadow-lg border border-red-100">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 text-red-600 mb-0.5 sm:mb-1 md:mb-2" />
                  <p className="text-xs sm:text-sm md:text-base lg:text-lg font-bold text-gray-900 leading-tight">45%</p>
                  <p className="text-[9px] sm:text-[10px] md:text-xs text-gray-600">Credit Card Interest</p>
                </div>
                <div className="bg-white rounded-lg sm:rounded-xl md:rounded-2xl p-1.5 sm:p-2 md:p-3 lg:p-4 shadow-lg border border-emerald-100">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 text-emerald-600 mb-0.5 sm:mb-1 md:mb-2" />
                  <p className="text-xs sm:text-sm md:text-base lg:text-lg font-bold text-gray-900 leading-tight">10.25%*</p>
                  <p className="text-[9px] sm:text-[10px] md:text-xs text-gray-600">Personal Loan Interest</p>
                </div>
                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg sm:rounded-xl md:rounded-2xl p-1.5 sm:p-2 md:p-3 lg:p-4 shadow-lg border border-emerald-400">
                  <Zap className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 text-white mb-0.5 sm:mb-1 md:mb-2" />
                  <p className="text-xs sm:text-sm md:text-base lg:text-lg font-bold text-white leading-tight">35%+</p>
                  <p className="text-[9px] sm:text-[10px] md:text-xs text-white/90">Interest Saved</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-3 sm:p-4 md:p-5 lg:p-6 border border-gray-100 relative overflow-hidden max-h-[600px] overflow-y-auto">
                <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-blue-500/5 to-transparent rounded-full -mr-24 -mt-24" />
                <div className="relative z-10">
                  {!submitted ? (
                    <>
                      <div className="text-center mb-3 sm:mb-4 md:mb-5 lg:mb-6">
                        <motion.div
                          className="relative w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 mx-auto mb-2 sm:mb-3"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                        >
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="w-full h-full bg-blue-500 rounded-full shadow-lg flex items-center justify-center"
                          >
                            <CheckCircle className="w-6 h-6 sm:w-7 sm:h-7 text-white" strokeWidth={2.5} />
                          </motion.div>
                        </motion.div>
                        <motion.h2
                          className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold mb-1 md:mb-2 leading-tight"
                          initial={{ opacity: 0, y: -12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.15 }}
                        >
                          <span className="text-[#FF8C00]">Start Your </span>
                          <span className="text-[#87CEEB]">Loan Journey</span>
                        </motion.h2>
                        <motion.p
                          className="text-[8px] sm:text-[9px] md:text-[10px] text-gray-600 font-medium leading-tight"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.25 }}
                        >
                          Pay credit card bill • Convert to lower-rate personal loan • ✨ Instant • 🔒 Secure • 📱 Digital
                        </motion.p>
                      </div>

                      {authLoading && (
                        <p className="text-center text-sm text-gray-500 py-6">Loading…</p>
                      )}
                      {!authLoading && !user && (
                        <SupabaseAuthInline returnPath={pathname} />
                      )}
                      {!authLoading && user && (
                        <form onSubmit={handleSubmit} className="space-y-3">
                          <ApplicantRelationFields
                            applicantFor={applicantFor}
                            onApplicantForChange={setApplicantFor}
                            applicantName={applicantName}
                            onApplicantNameChange={setApplicantName}
                            applicantMobile={applicantMobile}
                            onApplicantMobileChange={setApplicantMobile}
                            relationshipNote={relationshipNote}
                            onRelationshipNoteChange={setRelationshipNote}
                          />
                          {applicantFor === 'self' && (
                            <>
                              <div>
                                <label className="block text-[10px] sm:text-xs font-semibold text-gray-700 mb-1">Full Name *</label>
                                <input
                                  value={name}
                                  onChange={handleName}
                                  placeholder="Enter your full name"
                                  className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                  required
                                  autoComplete="name"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] sm:text-xs font-semibold text-gray-700 mb-1">Mobile Number *</label>
                                <div className="flex gap-2">
                                  <div className="flex items-center px-2.5 py-2.5 border-2 border-gray-200 rounded-lg bg-gray-50 text-sm font-semibold">
                                    <Phone className="h-4 w-4 mr-1 text-gray-500" />
                                    +91
                                  </div>
                                  <input
                                    type="tel"
                                    value={mobile}
                                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                    placeholder="10-digit mobile"
                                    className="flex-1 px-3 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                                    maxLength={10}
                                    required
                                    autoComplete="tel"
                                  />
                                </div>
                              </div>
                            </>
                          )}
                          <div>
                            <label className="block text-[10px] sm:text-xs font-semibold text-gray-700 mb-1">
                              Total outstanding (₹) *
                            </label>
                            <input
                              type="text"
                              inputMode="numeric"
                              value={ccBillAmount ? formatINR(ccBillAmount) : ''}
                              onChange={(e) => {
                                const raw = e.target.value.replace(/\D/g, '');
                                const n = raw ? Math.min(Number(raw), CALC_MAX) : 0;
                                setCcBillAmount(n);
                              }}
                              className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                              placeholder="e.g. 20,00,000"
                              required
                            />
                            <p className="text-[9px] text-gray-500 mt-1">Max ₹5 Lakh (same range as savings calculator below)</p>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={
                              loading ||
                              (applicantFor === 'self' && (!isValidIndianMobile(mobile) || name.trim().length < 2)) ||
                              (applicantFor === 'other' &&
                                (!applicantName.trim() || !isValidIndianMobile(applicantMobile)))
                            }
                            className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                          >
                            {loading ? (
                              <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <>
                                Apply
                                <ArrowRight className="w-4 h-4" />
                              </>
                            )}
                          </motion.button>
                          <p className="text-[10px] text-gray-500 text-center">
                            By continuing you agree to our{' '}
                            <Link href="/privacy-policy" className="text-blue-600 hover:underline">
                              Privacy
                            </Link>
                          </p>
                        </form>
                      )}
                    </>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-8"
                    >
                      <motion.div
                        animate={{ scale: [1, 1.08, 1] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                        className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center shadow-xl"
                      >
                        <CheckCircle className="w-10 h-10 text-white" strokeWidth={2.5} />
                      </motion.div>
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900">Thank you!</h3>
                      <p className="text-sm text-gray-600 mt-2">We will contact you shortly.</p>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Scrollable cards — same pattern as instant personal loan */}
          <div className="mb-8 md:mb-12">
            <div
              className="overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              <div className="flex gap-4 sm:gap-6 md:gap-8 min-w-max px-1">
                {/* Card 1 — Key features + savings calculator (instant loan style) */}
                <motion.div
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover={{ scale: 1.02, y: -5, transition: { duration: 0.3 } }}
                  className="bg-gradient-to-br from-white to-blue-50/30 rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 shadow-xl hover:shadow-2xl border border-blue-100 relative overflow-hidden snap-center w-[300px] sm:w-[360px] md:w-[400px] lg:w-[420px] flex-shrink-0 transition-all flex flex-col"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-2xl flex items-center justify-center mb-3 sm:mb-4 relative z-10">
                    <Award className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" strokeWidth={2.5} />
                  </div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">Key Features</h3>
                  <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 mb-3 sm:mb-4">
                    Calculate savings when you move card dues to a personal loan
                  </p>

                  <div className="rounded-xl bg-white/80 border border-blue-100/80 p-3 mb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Calculator className="w-5 h-5 text-blue-600 shrink-0" strokeWidth={2} />
                      <p className="text-xs sm:text-sm font-bold text-slate-800">
                        Outstanding <span className="text-emerald-600">₹{formatINR(ccBillAmount)}</span>
                      </p>
                    </div>
                    <input
                      type="range"
                      min={CALC_MIN}
                      max={CALC_MAX}
                      step={5000}
                      value={Math.min(Math.max(ccBillAmount, CALC_MIN), CALC_MAX)}
                      onChange={(e) => setCcBillAmount(Number(e.target.value))}
                      className="cc-savings-slider w-full h-2.5 rounded-full appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-gray-400 mt-1.5 font-medium">
                      <span>₹10,000</span>
                      <span>₹5,00,000</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="rounded-xl bg-rose-50 border border-red-200/80 p-2.5">
                      <CreditCard className="w-5 h-5 text-red-500 mb-1" strokeWidth={1.75} />
                      <p className="text-[10px] text-gray-500">Card ~{CC_RATE}% p.a.</p>
                      <p className="text-sm font-black text-red-600 tabular-nums">₹{formatINR(ccMonthly)}/mo</p>
                    </div>
                    <div className="rounded-xl bg-emerald-50 border border-emerald-200/80 p-2.5">
                      <Wallet className="w-5 h-5 text-emerald-600 mb-1" strokeWidth={1.75} />
                      <p className="text-[10px] text-gray-500">Loan ~{PL_RATE}%*</p>
                      <p className="text-sm font-black text-emerald-600 tabular-nums">₹{formatINR(plMonthly)}/mo</p>
                    </div>
                  </div>

                  <div className="rounded-xl bg-[#15803d] px-3 py-3 text-center text-white mb-3">
                    <Zap className="w-4 h-4 mx-auto mb-1 text-white" strokeWidth={2.5} />
                    <p className="text-[10px] font-medium text-white/95">Monthly savings</p>
                    <p className="text-xl sm:text-2xl font-black tabular-nums">₹{formatINR(monthlySave)}</p>
                    <p className="text-[10px] text-white/85 mt-0.5">Annual ~ ₹{formatINR(annualSave)}</p>
                  </div>

                  <div className="space-y-2 sm:space-y-2.5 mb-4 flex-grow">
                    {[
                      { icon: Shield, text: 'Lower rate vs typical card revolving interest' },
                      { icon: CreditCard, text: 'Single EMI instead of multiple card dues' },
                      { icon: Zap, text: 'Digital journey — minimal paperwork' },
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 sm:gap-2.5">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-100/60 rounded-lg flex items-center justify-center flex-shrink-0">
                          <item.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" />
                        </div>
                        <p className="text-[10px] sm:text-xs md:text-sm text-gray-700">{item.text}</p>
                      </div>
                    ))}
                  </div>

                  <div className="relative h-2 bg-blue-100 rounded-full overflow-hidden mt-auto">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 1.5, delay: 0.5 }}
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                    />
                  </div>
                </motion.div>

                {/* Card 2 — Eligibility (instant loan style) */}
                <motion.div
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.1 }}
                  whileHover={{ scale: 1.02, y: -5, transition: { duration: 0.3 } }}
                  className="bg-gradient-to-br from-white to-green-50/30 rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 shadow-xl hover:shadow-2xl border border-green-100 snap-center w-[300px] sm:w-[360px] md:w-[400px] lg:w-[420px] flex-shrink-0 transition-all flex flex-col"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-2xl flex items-center justify-center mb-3 sm:mb-4 relative z-10">
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" strokeWidth={2.5} />
                  </div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">Eligibility Criteria</h3>
                  <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 mb-4 sm:mb-5">
                    Salaried or self-employed with stable income and healthy credit profile
                  </p>

                  <div className="flex-grow space-y-3 sm:space-y-4 mb-4 sm:mb-5">
                    <div>
                      <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                        <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600" />
                        <h4 className="text-xs sm:text-sm font-bold text-gray-900">Who can apply</h4>
                      </div>
                      <div className="space-y-1.5 sm:space-y-2">
                        {['Salaried or stable income', 'Valid PAN & address proof', 'Credit card statements for review'].map((item, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 sm:gap-2">
                            <CheckCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-green-600 flex-shrink-0" />
                            <span className="text-[10px] sm:text-xs md:text-sm text-gray-700">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                        <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600" />
                        <h4 className="text-xs sm:text-sm font-bold text-gray-900">Typical age</h4>
                      </div>
                      <div className="space-y-1.5 sm:space-y-2">
                        {['21 years and above', 'Below 58 years at application'].map((item, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 sm:gap-2">
                            <CheckCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-green-600 flex-shrink-0" />
                            <span className="text-[10px] sm:text-xs md:text-sm text-gray-700">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="relative h-2 bg-green-100 rounded-full overflow-hidden mt-auto">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 1.5, delay: 0.6 }}
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full"
                    />
                  </div>
                </motion.div>

                {/* Card 3 — Documents (instant loan style) */}
                <motion.div
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.2 }}
                  whileHover={{ scale: 1.02, y: -5, transition: { duration: 0.3 } }}
                  className="bg-gradient-to-br from-white to-orange-50/30 rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 shadow-xl hover:shadow-2xl border border-orange-100 snap-center w-[300px] sm:w-[360px] md:w-[400px] lg:w-[420px] flex-shrink-0 transition-all flex flex-col"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-2xl flex items-center justify-center mb-3 sm:mb-4 relative z-10">
                    <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" strokeWidth={2.5} />
                  </div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">Required Documents</h3>
                  <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 mb-4 sm:mb-5">
                    Identity, address, card & bank proof for faster processing
                  </p>

                  <div className="space-y-3 sm:space-y-3.5 mb-4 sm:mb-5 flex-grow">
                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-gray-900 mb-1.5 sm:mb-2">Identity Proof</h4>
                        <ul className="space-y-1 sm:space-y-1.5">
                          {['Passport', 'Voter ID', 'Driving License', 'PAN Card'].map((doc, idx) => (
                            <li key={idx} className="flex items-start gap-1.5 text-[10px] sm:text-xs md:text-sm text-gray-700">
                              <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-orange-500 rounded-full flex-shrink-0 mt-1.5" />
                              <span className="leading-tight">{doc}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-gray-900 mb-1.5 sm:mb-2">Address Proof</h4>
                        <ul className="space-y-1 sm:space-y-1.5">
                          {['Aadhaar Card', 'Piped Gas Bill', 'Electricity Bill'].map((doc, idx) => (
                            <li key={idx} className="flex items-start gap-1.5 text-[10px] sm:text-xs md:text-sm text-gray-700">
                              <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-orange-500 rounded-full flex-shrink-0 mt-1.5" />
                              <span className="leading-tight">{doc}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-gray-900 mb-1.5 sm:mb-2">Other Documents</h4>
                      <ul className="space-y-1 sm:space-y-1.5">
                        {['Last 3 months credit card statements', 'Bank statements (3 months)', 'Salary slips if salaried'].map((doc, idx) => (
                          <li key={idx} className="flex items-start gap-1.5 text-[10px] sm:text-xs md:text-sm text-gray-700">
                            <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-orange-500 rounded-full flex-shrink-0 mt-1.5" />
                            <span className="leading-tight">{doc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="relative h-2 bg-orange-100 rounded-full overflow-hidden mt-auto">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 1.5, delay: 0.7 }}
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full"
                    />
                  </div>
                </motion.div>
              </div>
            </div>
            <div className="flex justify-center gap-2 mt-6">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-2.5 h-2.5 rounded-full bg-blue-600"
              />
              <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
              <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
            </div>
          </div>

          <p className="text-center text-[10px] sm:text-xs text-gray-500 flex items-center justify-center gap-1 mb-6">
            <Shield className="w-3 h-3" />
            *Rates are indicative. Final offer depends on lender policy and your profile.
          </p>
        </div>
      </div>

      <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-6 md:py-8 text-center relative z-10">
        <div className="max-w-7xl mx-auto px-3 md:px-4">
          <p className="text-xs sm:text-sm">© 2024 KreditScore. All rights reserved.</p>
          <p className="text-[10px] sm:text-xs text-gray-400 mt-1 md:mt-2">Secure • Fast • Trusted</p>
        </div>
      </footer>
    </div>
  );
}
