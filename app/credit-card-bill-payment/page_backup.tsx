'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CreditCard,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  ArrowRight,
  Phone,
  CheckCircle,
  Shield,
  Zap,
  Calculator,
  X,
  IndianRupee,
  Calendar,
  Percent,
  PartyPopper,
  Wallet
} from 'lucide-react';
import Header from '@/components/Header';
import CustomCursor from '@/components/CustomCursor';
import Link from 'next/link';

export default function CreditCardBillPaymentPage() {
  const [mobile, setMobile] = useState('');
  const [name, setName] = useState('');
  const [outstandingAmount, setOutstandingAmount] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formStep, setFormStep] = useState(1);

  // Form data state
  const [formData, setFormData] = useState({
    panCard: '',
    dob: '',
    companyName: '',
    netSalary: '',
    currentAddress: '',
    currentCity: '',
    currentState: '',
    currentPincode: '',
  });

  // Calculator states
  const [ccBillAmount, setCcBillAmount] = useState(50000);
  const [minimumPayment, setMinimumPayment] = useState(2500);
  const [showCalculator, setShowCalculator] = useState(false);

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Auto OTP
  useEffect(() => {
    if (otpSent) {
      setTimeout(() => {
        const autoOtp = '1234';
        setOtp(autoOtp);
        setTimeout(() => {
          if (autoOtp === '1234') {
            setIsLoading(true);
            setTimeout(() => {
              setOtpVerified(true);
              setIsLoading(false);
            }, 800);
          }
        }, 500);
      }, 2000);
    }
  }, [otpSent]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const capitalizedValue = value
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
    setName(capitalizedValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2);
    }
    if (value.length >= 5) {
      value = value.slice(0, 5) + '/' + value.slice(5, 9);
    }
    setFormData(prev => ({ ...prev, dob: value }));
  };

  const validateAge = (dob: string): boolean => {
    if (dob.length !== 10) return false;
    const [day, month, year] = dob.split('/').map(Number);
    const birthDate = new Date(year, month - 1, day);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age >= 18 && age <= 100;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const handleSendOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && mobile.length === 10 && outstandingAmount.trim()) {
      setIsLoading(true);
      setTimeout(() => {
        setOtpSent(true);
        setIsLoading(false);
        setCountdown(30);
      }, 1500);
    }
  };

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp === '1234') {
      setIsLoading(true);
      setTimeout(() => {
        setOtpVerified(true);
        setIsLoading(false);
        setIsSubmitted(true);
      }, 1000);
    }
  };

  // Calculations
  // Credit Card: 45% flat (charges on full amount every month)
  const ccInterest = 3.75; // 45% p.a. flat = 3.75% per month
  // Personal Loan: 10.25% reducing (effective monthly rate much lower)
  const plInterest = 0.854; // 10.25% p.a. reducing ≈ 0.854% per month
  const ccMonthlyInterest = ccBillAmount * (ccInterest / 100);
  const plMonthlyInterest = ccBillAmount * (plInterest / 100);
  const savingsPerMonth = ccMonthlyInterest - plMonthlyInterest;
  const savingsPerYear = savingsPerMonth * 12;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 relative overflow-hidden">
      {/* Structured Data for SEO - Financial Product Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FinancialProduct",
            "name": "Credit Card Bill Payment with Personal Loan",
            "description": "Convert high-interest credit card bills (45% p.a.) to low-interest personal loans (10.25% p.a.). Save up to 35% on interest payments.",
            "url": "https://kreditscore.com/credit-card-bill-payment",
            "provider": {
              "@type": "FinancialService",
              "name": "KreditScore",
              "url": "https://kreditscore.com"
            },
            "feesAndCommissionsSpecification": "No hidden charges, transparent processing",
            "interestRate": {
              "@type": "QuantitativeValue",
              "value": "10.25",
              "unitText": "P.A."
            },
            "annualPercentageRate": "10.25",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "INR",
              "description": "Convert credit card debt to personal loan at 10.25% interest"
            }
          })
        }}
      />

      {/* BreadcrumbList Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://kreditscore.com"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Loans",
                "item": "https://kreditscore.com/#loans"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": "Pay Credit Card Bill",
                "item": "https://kreditscore.com/credit-card-bill-payment"
              }
            ]
          })
        }}
      />

      <CustomCursor />
      <Header />

      {/* Animated Background - Floating Credit Cards */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -100, 0],
              x: [0, 50, 0],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 1.5
            }}
            className="absolute"
            style={{
              left: `${20 + i * 15}%`,
              top: `${10 + i * 10}%`,
            }}
          >
            <CreditCard className="w-24 h-24 text-red-400" />
          </motion.div>
        ))}
      </div>

      <div className="pt-[80px] sm:pt-[100px] pb-4 sm:pb-8 px-2 sm:px-4 relative z-10">
        <div className="max-w-7xl mx-auto">

          {/* Hero Section with Fear + Relief */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6 sm:mb-12"
          >
            {/* Danger Badge */}
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
              className="inline-flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-red-600 to-orange-600 text-white px-3 py-1.5 sm:px-6 sm:py-3 rounded-full mb-4 sm:mb-6 shadow-lg"
            >
              <AlertTriangle className="w-4 h-4 sm:w-6 sm:h-6" />
              <span className="font-bold text-xs sm:text-lg">CREDIT CARD TRAP!</span>
            </motion.div>

            <h1 className="text-[15px] leading-tight sm:text-3xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 px-2">
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Get Freedom from{' '}
              </span>
              <span className="text-red-600">
                Credit Card Debt!
              </span>
            </h1>

            <p className="text-[11px] leading-tight sm:text-lg md:text-xl text-gray-700 mb-2 px-2">
              Convert Your Credit Card Bill to Personal Loan
            </p>
            <p className="text-[12px] leading-tight sm:text-2xl md:text-3xl font-bold text-green-600 mb-4 sm:mb-6 px-2">
              in 2 Minutes @ Starting from 10.25% p.a.*
            </p>

            {/* Shocking Stats */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 max-w-3xl mx-auto px-2">
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white rounded-lg sm:rounded-xl p-2 sm:p-4 shadow-lg border sm:border-2 border-red-200"
              >
                <TrendingUp className="w-5 h-5 sm:w-8 sm:h-8 text-red-600 mx-auto mb-1 sm:mb-2" />
                <p className="text-lg sm:text-3xl font-bold text-red-600">45%</p>
                <p className="text-[9px] sm:text-sm text-gray-600">Credit Card Interest</p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white rounded-lg sm:rounded-xl p-2 sm:p-4 shadow-lg border sm:border-2 border-green-200"
              >
                <TrendingDown className="w-5 h-5 sm:w-8 sm:h-8 text-green-600 mx-auto mb-1 sm:mb-2" />
                <p className="text-lg sm:text-3xl font-bold text-green-600">10.25%*</p>
                <p className="text-[9px] sm:text-sm text-gray-600">Personal Loan Interest</p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg sm:rounded-xl p-2 sm:p-4 shadow-lg"
              >
                <Zap className="w-5 h-5 sm:w-8 sm:h-8 text-white mx-auto mb-1 sm:mb-2" />
                <p className="text-lg sm:text-3xl font-bold text-white">35%+</p>
                <p className="text-[9px] sm:text-sm text-white">Interest Saved!</p>
              </motion.div>
            </div>
          </motion.div>

          {/* 3D Credit Card Animation */}
          <div className="grid lg:grid-cols-3 gap-3 sm:gap-6 mb-8 sm:mb-12">
            {/* Left - Red Credit Card Danger Box + Why Choose Us Features (Vertical) */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="order-2 space-y-2 sm:space-y-4 lg:order-1"
            >
              {/* Red Credit Card Danger Box */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-2 sm:mb-4"
              >
                <div className="perspective-1000">
                  <motion.div
                    animate={{
                      rotateY: [0, 15, -15, 0],
                    }}
                    transition={{
                      duration: 6,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="relative preserve-3d"
                  >
                    {/* Credit Card - Front */}
                    <div className="bg-gradient-to-br from-red-600 via-orange-600 to-red-700 rounded-lg sm:rounded-xl p-2 sm:p-3 shadow-2xl h-20 sm:h-28 relative overflow-hidden">
                      {/* Card Pattern */}
                      <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.8),transparent_50%)]" />
                      </div>

                      <div className="relative z-10">
                        <div className="flex justify-between items-start mb-1.5 sm:mb-3">
                          <div className="w-4 h-3 sm:w-6 sm:h-4 bg-yellow-400 rounded-sm" />
                          <CreditCard className="w-4 h-4 sm:w-6 sm:h-6 text-white opacity-50" />
                        </div>

                        <div className="mb-1 sm:mb-2">
                          <p className="text-white text-[10px] sm:text-sm font-mono tracking-wider">
                            •••• •••• •••• 1234
                          </p>
                        </div>

                        <div className="flex justify-between items-end">
                          <div>
                            <p className="text-white text-[6px] sm:text-[8px] opacity-70">Card Holder</p>
                            <p className="text-white text-[8px] sm:text-xs font-semibold">YOUR NAME</p>
                          </div>
                          <div className="text-right">
                            <p className="text-white text-[6px] sm:text-[8px] opacity-70">Interest Rate</p>
                            <p className="text-white text-[10px] sm:text-sm font-bold">45% p.a.</p>
                          </div>
                        </div>
                      </div>

                      {/* Danger Pulse */}
                      <motion.div
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [0.5, 0, 0.5],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                        }}
                        className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"
                      />
                    </div>

                    {/* Warning Labels */}
                    <div className="mt-1 sm:mt-2 space-y-1 sm:space-y-1.5">
                      <div className="flex items-center gap-1 sm:gap-1.5 bg-red-100 border-l sm:border-l-2 border-red-600 p-1 sm:p-2 rounded">
                        <AlertTriangle className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-red-600 flex-shrink-0" />
                        <p className="text-[8px] sm:text-[10px] text-red-800 font-semibold">
                          Paying only minimum? You'll be in debt for 20+ years!
                        </p>
                      </div>
                      <div className="flex items-center gap-1 sm:gap-1.5 bg-orange-100 border-l sm:border-l-2 border-orange-600 p-1 sm:p-2 rounded">
                        <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-orange-600 flex-shrink-0" />
                        <p className="text-[8px] sm:text-[10px] text-orange-800 font-semibold">
                          ₹50,000 debt can become ₹3,00,000+ with minimum payments!
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              {/* Why Choose Us Features */}
              {[
                {
                  icon: Shield,
                  title: "100% Safe & Secure",
                  desc: "100% RBI Approved lenders with guaranteed privacy",
                  color: "blue"
                },
                {
                  icon: Zap,
                  title: "Instant Approval",
                  desc: "Get approved in 24-48 hours with minimal docs",
                  color: "orange"
                },
                {
                  icon: CheckCircle,
                  title: "Zero Hidden Charges",
                  desc: "Transparent pricing with no surprise fees",
                  color: "green"
                }
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (index + 1) * 0.1 }}
                    whileHover={{ scale: 1.05, x: 10 }}
                    className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-6 shadow-lg border-l-2 sm:border-l-4 border-blue-500 hover:shadow-2xl transition-all duration-300"
                  >
                    <div className="flex items-start gap-2 sm:gap-4">
                      <div className={`w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br ${
                        item.color === 'blue' ? 'from-blue-500 to-blue-600' :
                        item.color === 'orange' ? 'from-orange-500 to-orange-600' :
                        'from-green-500 to-green-600'
                      } flex items-center justify-center flex-shrink-0`}>
                        <Icon className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-sm sm:text-lg font-bold text-gray-900 mb-1 sm:mb-2">{item.title}</h3>
                        <p className="text-[10px] sm:text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Calculator - Third in mobile, Second on laptop */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              style={{ perspective: '1000px' }}
              className="order-3 lg:order-2"
            >
              <div className="bg-white rounded-lg sm:rounded-xl shadow-xl p-3 sm:p-6">
                <div className="text-center mb-3 sm:mb-6">
                  <Calculator className="w-5 h-5 sm:w-8 sm:h-8 text-blue-600 mx-auto mb-1.5 sm:mb-3" />
                  <h3 className="text-sm sm:text-lg font-bold mb-1 sm:mb-2">
                    Calculate Your <span className="text-green-600">SAVINGS!</span>
                  </h3>
                  <p className="text-[10px] sm:text-sm text-gray-600">See how much you can save monthly</p>
                </div>

                <div className="space-y-3 sm:space-y-6">
                  {/* Amount Display */}
                  <div className="text-center">
                    <p className="text-[10px] sm:text-sm text-gray-600 mb-1 sm:mb-2">Credit Card Outstanding</p>
                    <div className="text-2xl sm:text-4xl font-bold text-gray-900 mb-0.5 sm:mb-1">
                      ₹{ccBillAmount.toLocaleString('en-IN')}
                    </div>
                  </div>

                  {/* Slider */}
                  <div className="px-2">
                    <input
                      type="range"
                      min="10000"
                      max="500000"
                      step="5000"
                      value={ccBillAmount}
                      onChange={(e) => setCcBillAmount(Number(e.target.value))}
                      className="w-full h-2 bg-gradient-to-r from-red-200 via-orange-200 to-green-200 rounded-lg appearance-none cursor-pointer slider"
                      style={{
                        background: `linear-gradient(to right, #fee2e2 0%, #fed7aa ${((ccBillAmount - 10000) / (500000 - 10000)) * 100}%, #dcfce7 100%)`
                      }}
                    />
                    <div className="flex justify-between text-[9px] sm:text-xs text-gray-500 mt-1 sm:mt-2">
                      <span>₹10,000</span>
                      <span>₹5,00,000</span>
                    </div>
                  </div>

                  {/* Comparison Cards */}
                  <div className="grid grid-cols-2 gap-2 sm:gap-4">
                    {/* Credit Card */}
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="bg-red-50 p-2 sm:p-4 rounded-lg sm:rounded-xl border sm:border-2 border-red-200"
                    >
                      <CreditCard className="w-4 h-4 sm:w-6 sm:h-6 text-red-600 mb-1 sm:mb-2" />
                      <p className="text-[9px] sm:text-xs text-gray-600 mb-0.5 sm:mb-1">Credit Card</p>
                      <p className="text-sm sm:text-lg font-bold text-red-600">45% p.a.</p>
                      <div className="mt-1.5 sm:mt-3 pt-1.5 sm:pt-3 border-t border-red-200">
                        <p className="text-[8px] sm:text-xs text-gray-600">Monthly Interest</p>
                        <p className="text-sm sm:text-xl font-bold text-red-600">₹{ccMonthlyInterest.toFixed(0)}</p>
                      </div>
                    </motion.div>

                    {/* Personal Loan */}
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="bg-green-50 p-2 sm:p-4 rounded-lg sm:rounded-xl border sm:border-2 border-green-200"
                    >
                      <Wallet className="w-4 h-4 sm:w-6 sm:h-6 text-green-600 mb-1 sm:mb-2" />
                      <p className="text-[9px] sm:text-xs text-gray-600 mb-0.5 sm:mb-1">Personal Loan</p>
                      <p className="text-sm sm:text-lg font-bold text-green-600">10.25% p.a.*</p>
                      <div className="mt-1.5 sm:mt-3 pt-1.5 sm:pt-3 border-t border-green-200">
                        <p className="text-[8px] sm:text-xs text-gray-600">Monthly Interest</p>
                        <p className="text-sm sm:text-xl font-bold text-green-600">₹{plMonthlyInterest.toFixed(0)}</p>
                      </div>
                    </motion.div>
                  </div>

                  {/* Savings Box */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg sm:rounded-xl p-3 sm:p-6 text-center"
                  >
                    <Zap className="w-5 h-5 sm:w-8 sm:h-8 mx-auto mb-1 sm:mb-2" />
                    <p className="text-[10px] sm:text-sm font-semibold mb-0.5 sm:mb-1">Your Monthly Savings</p>
                    <p className="text-2xl sm:text-4xl font-bold mb-1 sm:mb-2">₹{savingsPerMonth.toFixed(0)}</p>
                    <div className="pt-2 sm:pt-3 border-t border-white/30">
                      <p className="text-[10px] sm:text-sm opacity-90">Annual Savings</p>
                      <p className="text-lg sm:text-2xl font-bold">₹{savingsPerYear.toFixed(0)}</p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Green Application Form - First in mobile, Third on laptop */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              style={{ perspective: '1000px' }}
              className="order-1 lg:order-3"
            >
              <motion.div
                className="relative"
                style={{ transformStyle: 'preserve-3d' }}
                whileHover={{ rotateY: 5, rotateX: -5 }}
                transition={{ duration: 0.3 }}
              >
                {/* Credit Card Background with 3D Effect */}
                <div className="relative bg-gradient-to-br from-green-600 via-emerald-600 to-green-700 rounded-xl sm:rounded-2xl shadow-2xl p-2 sm:p-4 overflow-hidden border sm:border-2 border-white transform-gpu max-w-sm mx-auto">
                  {/* Card Shine Effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"
                    animate={{
                      x: ['-100%', '100%'],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />

                  {/* Card Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-1 right-1 sm:top-2 sm:right-2 w-8 h-8 sm:w-12 sm:h-12 border sm:border-2 border-white rounded-full" />
                    <div className="absolute bottom-1 left-1 sm:bottom-2 sm:left-2 w-10 h-10 sm:w-16 sm:h-16 border sm:border-2 border-white rounded-full" />
                  </div>

                  {/* Chip Animation */}
                  <motion.div
                    className="absolute top-2 left-3 sm:top-3 sm:left-4 w-6 h-5 sm:w-8 sm:h-7 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-md"
                    animate={{
                      boxShadow: ['0 0 15px rgba(234,179,8,0.5)', '0 0 30px rgba(234,179,8,0.8)', '0 0 15px rgba(234,179,8,0.5)']
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <div className="grid grid-cols-3 gap-0.5 p-0.5 sm:p-1 h-full">
                      {[...Array(9)].map((_, i) => (
                        <div key={i} className="bg-yellow-700 rounded-sm" />
                      ))}
                    </div>
                  </motion.div>

                  {/* Contactless Payment Icon */}
                  <motion.div
                    className="absolute top-2 right-3 sm:top-3 sm:right-4"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <div className="flex gap-0.5">
                      <div className="w-1 h-2 sm:w-1.5 sm:h-3 bg-white rounded-full opacity-80" />
                      <div className="w-1 h-2 sm:w-1.5 sm:h-3 bg-white rounded-full opacity-60" />
                      <div className="w-1 h-2 sm:w-1.5 sm:h-3 bg-white rounded-full opacity-40" />
                    </div>
                  </motion.div>

                  <div className="relative z-10 bg-white rounded-lg sm:rounded-xl shadow-xl p-2 sm:p-4 mt-6 sm:mt-10">
                {!isSubmitted ? (
                  <>
                    <div className="text-center mb-2 sm:mb-4">
                      <motion.div
                        className="w-7 h-7 sm:w-10 sm:h-10 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-1 sm:mb-2"
                        whileHover={{ scale: 1.1, rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </motion.div>
                      <h2 className="text-sm sm:text-lg font-bold mb-0.5 sm:mb-1">
                        <span className="text-green-600">Get Relief Now!</span>
                      </h2>
                      <p className="text-[10px] sm:text-xs text-gray-600">
                        Convert to Personal Loan in 2 Minutes
                      </p>
                    </div>

                    <AnimatePresence mode="wait">
                      {!otpSent ? (
                        <motion.form
                          key="mobile-form"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          onSubmit={handleSendOTP}
                          className="space-y-2 sm:space-y-3"
                        >
                          <div>
                            <label className="block text-[10px] sm:text-xs font-semibold text-gray-700 mb-0.5 sm:mb-1">
                              Full Name *
                            </label>
                            <input
                              type="text"
                              value={name}
                              onChange={handleNameChange}
                              placeholder="Enter your full name"
                              className="w-full px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm border sm:border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] sm:text-xs font-semibold text-gray-700 mb-0.5 sm:mb-1">
                              How much Total Outstanding Credit Card? *
                            </label>
                            <div className="relative">
                              <div className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs sm:text-sm font-semibold">
                                ₹
                              </div>
                              <input
                                type="text"
                                value={outstandingAmount}
                                onChange={(e) => {
                                  const value = e.target.value.replace(/\D/g, '');
                                  setOutstandingAmount(value);
                                }}
                                placeholder="Enter outstanding amount"
                                className="w-full pl-5 sm:pl-6 pr-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm border sm:border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                required
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[10px] sm:text-xs font-semibold text-gray-700 mb-0.5 sm:mb-1">
                              Mobile Number *
                            </label>
                            <div className="flex gap-1 sm:gap-2">
                              <div className="flex items-center px-1.5 py-1.5 sm:px-2 sm:py-2 text-[10px] sm:text-sm border sm:border-2 border-gray-200 rounded-lg bg-gray-50 font-semibold text-gray-700">
                                <Phone className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1 text-gray-500" />
                                +91
                              </div>
                              <input
                                type="tel"
                                value={mobile}
                                onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                placeholder="10-digit mobile"
                                className="flex-1 px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm border sm:border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                maxLength={10}
                                required
                              />
                            </div>
                          </div>

                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={!name.trim() || !outstandingAmount.trim() || mobile.length !== 10 || isLoading}
                            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-2 sm:py-2.5 rounded-lg font-bold text-[11px] sm:text-sm flex items-center justify-center gap-1 sm:gap-2 hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 shadow-lg"
                          >
                            {isLoading ? (
                              <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <>
                                Get Freedom from Credit Card Debt
                                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                              </>
                            )}
                          </motion.button>
                        </motion.form>
                      ) : !otpVerified ? (
                        <motion.form
                          key="otp-form"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          onSubmit={handleVerifyOTP}
                          className="space-y-4"
                        >
                          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-3">
                            <p className="text-sm text-green-800 text-center font-semibold">
                              OTP sent to +91 {mobile}
                            </p>
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Enter OTP
                            </label>
                            <input
                              type="text"
                              value={otp}
                              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                              placeholder="0 0 0 0"
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 text-center text-3xl tracking-widest font-bold"
                              maxLength={4}
                              required
                            />
                          </div>

                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={otp.length !== 4 || isLoading}
                            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-2.5 sm:py-3 rounded-lg font-bold text-sm sm:text-base hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 shadow-lg flex items-center justify-center gap-2"
                          >
                            {isLoading ? (
                              <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <>
                                Verify & Continue
                                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                              </>
                            )}
                          </motion.button>
                        </motion.form>
                      ) : (
                        /* Multi-step Form After OTP Verification */
                        <motion.div
                          key="application-form"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                        >
                          {/* Step Indicator */}
                          <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4">
                            <div className={`w-2 h-2 rounded-full ${formStep === 1 ? 'bg-green-600' : 'bg-gray-300'}`} />
                            <div className={`w-2 h-2 rounded-full ${formStep === 2 ? 'bg-green-600' : 'bg-gray-300'}`} />
                          </div>

                          <form onSubmit={handleFormSubmit} className="space-y-2 sm:space-y-3">
                            {formStep === 1 && (
                              <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-2 sm:space-y-2.5"
                              >
                                <h3 className="text-xs sm:text-sm font-bold text-green-600 mb-2 sm:mb-3">Personal Details</h3>

                                <div>
                                  <label className="block text-[10px] sm:text-xs font-semibold text-gray-700 mb-0.5 sm:mb-1">PAN Card *</label>
                                  <input
                                    type="text"
                                    name="panCard"
                                    value={formData.panCard}
                                    onChange={handleInputChange}
                                    placeholder="ABCDE1234F"
                                    className="w-full px-2 py-1.5 sm:px-3 sm:py-2 border sm:border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-xs sm:text-sm uppercase"
                                    maxLength={10}
                                    required
                                    autoComplete="off"
                                  />
                                </div>

                                <div>
                                  <label className="block text-[10px] sm:text-xs font-semibold text-gray-700 mb-0.5 sm:mb-1">Date of Birth (DD/MM/YYYY) *</label>
                                  <input
                                    type="text"
                                    name="dob"
                                    value={formData.dob}
                                    onChange={handleDateChange}
                                    placeholder="DD/MM/YYYY"
                                    className="w-full px-2 py-1.5 sm:px-3 sm:py-2 border sm:border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-xs sm:text-sm"
                                    maxLength={10}
                                    required
                                    autoComplete="off"
                                  />
                                  {formData.dob && !validateAge(formData.dob) && formData.dob.length === 10 && (
                                    <p className="text-[9px] sm:text-[10px] text-red-600 mt-0.5 sm:mt-1">Age must be between 18 and 100 years</p>
                                  )}
                                </div>

                                <div>
                                  <label className="block text-[10px] sm:text-xs font-semibold text-gray-700 mb-0.5 sm:mb-1">Company Name *</label>
                                  <input
                                    type="text"
                                    name="companyName"
                                    value={formData.companyName}
                                    onChange={handleInputChange}
                                    placeholder="Type company name"
                                    className="w-full px-2 py-1.5 sm:px-3 sm:py-2 border sm:border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-xs sm:text-sm"
                                    required
                                    autoComplete="off"
                                  />
                                </div>

                                <div>
                                  <label className="block text-[10px] sm:text-xs font-semibold text-gray-700 mb-0.5 sm:mb-1">Net Take Home Salary *</label>
                                  <input
                                    type="text"
                                    name="netSalary"
                                    value={formData.netSalary}
                                    onChange={handleInputChange}
                                    placeholder="₹ Monthly salary"
                                    className="w-full px-2 py-1.5 sm:px-3 sm:py-2 border sm:border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-xs sm:text-sm"
                                    required
                                    autoComplete="off"
                                  />
                                </div>

                                <button
                                  type="button"
                                  onClick={() => setFormStep(2)}
                                  className="w-full bg-green-600 text-white py-2 sm:py-2.5 rounded-lg font-semibold text-xs sm:text-sm hover:bg-green-700 transition-colors"
                                >
                                  Next Step
                                </button>
                              </motion.div>
                            )}

                            {formStep === 2 && (
                              <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-2 sm:space-y-2.5"
                              >
                                <h3 className="text-xs sm:text-sm font-bold text-green-600 mb-2 sm:mb-3">Current Address</h3>

                                <div>
                                  <label className="block text-[10px] sm:text-xs font-semibold text-gray-700 mb-0.5 sm:mb-1">Current Address *</label>
                                  <input
                                    type="text"
                                    name="currentAddress"
                                    value={formData.currentAddress}
                                    onChange={handleInputChange}
                                    placeholder="Flat/House No., Building Name"
                                    className="w-full px-2 py-1.5 sm:px-3 sm:py-2 border sm:border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-xs sm:text-sm"
                                    required
                                    autoComplete="off"
                                  />
                                </div>

                                <div>
                                  <label className="block text-[10px] sm:text-xs font-semibold text-gray-700 mb-0.5 sm:mb-1">City *</label>
                                  <input
                                    type="text"
                                    name="currentCity"
                                    value={formData.currentCity}
                                    onChange={handleInputChange}
                                    placeholder="Enter city"
                                    className="w-full px-2 py-1.5 sm:px-3 sm:py-2 border sm:border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-xs sm:text-sm"
                                    required
                                    autoComplete="off"
                                  />
                                </div>

                                <div>
                                  <label className="block text-[10px] sm:text-xs font-semibold text-gray-700 mb-0.5 sm:mb-1">State *</label>
                                  <input
                                    type="text"
                                    name="currentState"
                                    value={formData.currentState}
                                    onChange={handleInputChange}
                                    placeholder="Enter state"
                                    className="w-full px-2 py-1.5 sm:px-3 sm:py-2 border sm:border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-xs sm:text-sm"
                                    required
                                    autoComplete="off"
                                  />
                                </div>

                                <div>
                                  <label className="block text-[10px] sm:text-xs font-semibold text-gray-700 mb-0.5 sm:mb-1">Pincode *</label>
                                  <input
                                    type="text"
                                    name="currentPincode"
                                    value={formData.currentPincode}
                                    onChange={(e) => {
                                      const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                                      setFormData(prev => ({ ...prev, currentPincode: value }));
                                    }}
                                    placeholder="6-digit pincode"
                                    className="w-full px-2 py-1.5 sm:px-3 sm:py-2 border sm:border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-xs sm:text-sm"
                                    maxLength={6}
                                    required
                                    autoComplete="off"
                                  />
                                </div>

                                <div className="flex gap-2">
                                  <button
                                    type="button"
                                    onClick={() => setFormStep(1)}
                                    className="w-1/3 bg-gray-200 text-gray-700 py-2 sm:py-2.5 rounded-lg font-semibold text-xs sm:text-sm hover:bg-gray-300 transition-colors"
                                  >
                                    Back
                                  </button>
                                  <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    className="w-2/3 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-2 sm:py-2.5 rounded-lg font-bold text-xs sm:text-sm hover:from-green-700 hover:to-emerald-700 shadow-lg flex items-center justify-center gap-1 sm:gap-2"
                                  >
                                    Submit Application
                                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                                  </motion.button>
                                </div>
                              </motion.div>
                            )}
                          </form>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-2xl"
                    >
                      <PartyPopper className="w-12 h-12 text-white" />
                    </motion.div>

                    <h3 className="text-2xl font-bold mb-3 text-green-600">
                      Welcome to Freedom!
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Our team will contact you within 2 hours to help you get rid of high Credit Card interest!
                    </p>

                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-sm font-semibold text-green-800">Application ID</p>
                      <p className="text-xl font-bold text-gray-800">CCBP{Math.floor(Math.random() * 1000000)}</p>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Card Brand Logo */}
              <div className="absolute bottom-3 right-4 sm:bottom-6 sm:right-8 text-white font-bold text-sm sm:text-xl tracking-wider">
                KreditScore
              </div>
            </div>
              </motion.div>
            </motion.div>
          </div>

        </div>
      </div>

      {/* FAQPage Schema for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "Can I pay my credit card bill with a personal loan?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes! You can convert your high-interest credit card bill (45% p.a.) into a low-interest personal loan (10.25% p.a.) and save up to 35% on interest payments. This is called credit card debt consolidation."
                }
              },
              {
                "@type": "Question",
                "name": "Why is paying only the minimum payment on credit cards bad?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Paying only the minimum payment (usually 5% of outstanding) means you'll be paying 45% interest on the remaining 95% of your bill. This debt trap can take 20+ years to clear and cost you lakhs in interest charges."
                }
              },
              {
                "@type": "Question",
                "name": "How much can I save by converting credit card debt to personal loan?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "On a ₹50,000 credit card bill, you can save approximately ₹1,450 per month or ₹17,400 per year by converting to a personal loan at 10.25% interest instead of paying 45% credit card interest."
                }
              },
              {
                "@type": "Question",
                "name": "What is the interest rate difference between credit card and personal loan?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Credit cards typically charge 45% p.a. interest on outstanding balances, while personal loans are available at 10.25-14.4% p.a. This is a massive 35% difference in interest rates."
                }
              },
              {
                "@type": "Question",
                "name": "Is it safe to convert credit card bill to personal loan?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, it's completely safe and financially smart. By converting to a personal loan, you get a fixed EMI, lower interest rate, and a clear debt-free timeline. No hidden charges, 100% transparent process."
                }
              },
              {
                "@type": "Question",
                "name": "How fast can I get a personal loan to pay credit card bill?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "With KreditScore, you can get instant approval in minutes. Complete the online application, verify your OTP, and receive funds directly in your bank account within 24 hours."
                }
              }
            ]
          })
        }}
      />

      <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-4 sm:py-6 text-center relative z-10">
        <div className="max-w-7xl mx-auto px-3 sm:px-4">
          <p className="text-xs sm:text-sm">© 2024 KreditScore. All rights reserved.</p>
          <p className="text-[10px] sm:text-xs text-gray-400 mt-1 sm:mt-2">Stop losing money to high Credit Card interest today!</p>
        </div>
      </footer>
    </div>
  );
}
