'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import Header from '@/components/Header';
import ComingSoonModal from '@/components/ComingSoonModal';
import LoanApplicationForm from '@/components/LoanApplicationFormImproved';
import CustomCursor from '@/components/CustomCursor';
import CompanyCategoryModal from '@/components/CompanyCategoryModal';
import Footer from '@/components/Footer';
import { captureLead } from '@/lib/leadCapture';
import {
  ChevronRight,
  Shield,
  Zap,
  Clock,
  TrendingUp,
  Users,
  Award,
  Lock,
  Phone,
  CheckCircle2,
  ArrowRight,
  Building2,
  CreditCard,
  Wallet,
  BarChart3,
  FileText,
  Calculator,
  Star,
  Smartphone,
  User
} from 'lucide-react';

// Types
interface LoanProduct {
  icon: any;
  title: string;
  features: string[];
  color: string;
}

interface Tool {
  icon: any;
  title: string;
  color: string;
}

interface Step {
  icon: any;
  title: string;
  description: string;
  color: string;
}

interface Reason {
  icon: any;
  title: string;
  description: string;
  gradient: string;
}

export default function KreditScoreLanding() {
  const shouldReduceMotion = useReducedMotion();
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState('');

  // Loan Form state
  const [isLoanFormOpen, setIsLoanFormOpen] = useState(false);
  const [selectedLoanType, setSelectedLoanType] = useState('');

  // Company Category Modal state
  const [isCompanyCategoryOpen, setIsCompanyCategoryOpen] = useState(false);

  // Hero Form state (small 2-step form)
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showMobileScore, setShowMobileScore] = useState(false);
  const [animatedScore, setAnimatedScore] = useState(600);
  const [isHeroAutoSlidePaused, setIsHeroAutoSlidePaused] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    pan: '',
    salary: '',
    loanAmount: '',
    address: ''
  });


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    if (currentStep < 2) setCurrentStep(currentStep + 1);
  };

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{10}$/.test(formData.mobile)) {
      alert('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(formData.pan.toUpperCase())) {
      alert('Please enter a valid PAN number (e.g. ABCDE1234F).');
      return;
    }
    if (!formData.salary || Number(formData.salary) < 15000) {
      alert('Monthly salary should be at least ₹15,000.');
      return;
    }

    captureLead({
      source: 'hero_form',
      name: formData.name,
      mobile: formData.mobile,
      pan: formData.pan,
      salary: formData.salary
    });

    setIsSubmitted(true);
    setTimeout(() => {
      resetHeroForm();
    }, 2500);
  };

  const resetHeroForm = () => {
    setIsSubmitted(false);
    setCurrentStep(1);
    setFormData({
      name: '', mobile: '', pan: '', salary: '', loanAmount: '', address: ''
    });
  };

  const isStepOneValid = formData.name.trim().length >= 3 && /^\d{10}$/.test(formData.mobile);
  const isStepTwoValid =
    /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(formData.pan.toUpperCase()) && Number(formData.salary) >= 15000;
  const scoreProgress = Math.min(Math.max((animatedScore - 600) / (786 - 600), 0), 1);
  const scoreHue = 0 + scoreProgress * 120; // 0=red, 120=green
  const scoreColor = `hsl(${scoreHue}, 85%, 48%)`;

  useEffect(() => {
    if (isHeroAutoSlidePaused) return;
    const autoSwitch = setInterval(() => {
      if (window.innerWidth < 1024) {
        setShowMobileScore((prev) => !prev);
      }
    }, 3200);
    return () => clearInterval(autoSwitch);
  }, [isHeroAutoSlidePaused]);

  useEffect(() => {
    let value = 600;
    setAnimatedScore(600);
    const scoreTimer = setInterval(() => {
      value += 1;
      setAnimatedScore(value);
      if (value >= 786) {
        clearInterval(scoreTimer);
      }
    }, 15);
    return () => clearInterval(scoreTimer);
  }, []);

  const handleFeatureClick = (featureName: string) => {
    setSelectedFeature(featureName);
    setIsModalOpen(true);
  };

  const handleLoanClick = (loanType: string) => {
    // All loan products now have dedicated pages
    if (loanType === 'Personal Loan') {
      window.location.href = '/instant-personal-loan-online';
    } else if (loanType === 'Pre-Approved Loan') {
      window.location.href = '/pre-approved-personal-loan';
    } else if (loanType === 'Pay Credit Card Bill') {
      window.location.href = '/credit-card-bill-payment';
    } else if (loanType === 'Debt Consolidation') {
      window.location.href = '/debt-consolidation';
    } else if (loanType === 'Salaried Over Draft') {
      window.location.href = '/salaried-overdraft';
    } else if (loanType === 'Small Apps Loan') {
      window.location.href = '/small-apps-loan';
    } else if (loanType === 'Balance Transfer') {
      window.location.href = '/balance-transfer';
    } else if (loanType === 'Doctor Loan') {
      window.location.href = '/doctor-loan';
    } else if (loanType === 'CA Loan') {
      window.location.href = '/ca-loan';
    } else if (loanType === 'Teacher Loan') {
      window.location.href = '/teacher-loan';
    } else if (loanType === 'Government Employee Loan') {
      window.location.href = '/government-employee-loan';
    } else if (loanType === 'Existing Loan Transfer') {
      window.location.href = '/existing-loan-transfer';
    } else {
      setSelectedLoanType(loanType);
      setIsLoanFormOpen(true);
    }
  };

  // 10 Loan Products - 2 rows of 5 (matching original HTML content)
  const loanProducts: LoanProduct[] = [
    {
      icon: CreditCard,
      title: "Personal Loan",
      features: ["Eligibility in 2 Min", "Money in 1 Day"],
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Award,
      title: "Pre-Approved Loan",
      features: ["No need Income-Proof", "No Payslip Required"],
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: CreditCard,
      title: "Pay Credit Card Bill",
      features: ["CC Bill convert in PL", "Pay the Low-Interest"],
      color: "from-indigo-500 to-indigo-600"
    },
    {
      icon: TrendingUp,
      title: "Debt Consolidation",
      features: ["Make Single EMI", "PL+CC+Apps Loan+OD"],
      color: "from-pink-500 to-pink-600"
    },
    {
      icon: Wallet,
      title: "Salaried Over Draft",
      features: ["Withdraw when You Need", "Interest on Used Amount"],
      color: "from-green-500 to-green-600"
    },
    {
      icon: Zap,
      title: "Small Apps Loan",
      features: ["Loan Upto 10 Lacs", "Disbursed in 2 hours"],
      color: "from-orange-500 to-orange-600"
    },
    {
      icon: BarChart3,
      title: "Balance Transfer",
      features: ["Reduce the EMI 50%", "Docs will be Required"],
      color: "from-red-500 to-red-600"
    },
    {
      icon: Users,
      title: "Doctor Loan",
      features: ["Special rates for Dr.", "Quick Approval"],
      color: "from-cyan-500 to-cyan-600"
    },
    {
      icon: Calculator,
      title: "CA Loan",
      features: ["Exclusive for CAs", "Highest Loan Amount"],
      color: "from-emerald-500 to-emerald-600"
    },
    {
      icon: Award,
      title: "Government Employee Loan",
      features: ["Exclusive for Govt staff", "Low interest rates"],
      color: "from-violet-500 to-violet-600"
    }
  ];

  // 4 Tools
  const tools: Tool[] = [
    { icon: Building2, title: "Company Category", color: "bg-blue-500" },
    { icon: BarChart3, title: "Credit Score", color: "bg-purple-500" },
    { icon: Calculator, title: "EMI Calculator", color: "bg-green-500" },
    { icon: FileText, title: "Part Calculator", color: "bg-orange-500" }
  ];

  // 3 Steps - How It Works
  const howItWorks: Step[] = [
    {
      icon: FileText,
      title: "Quick & easy online forms",
      description: "Fill up a basic form with your profile details. Fill your online banking details & we will process your application within minutes.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: CheckCircle2,
      title: "Submit minimum documents",
      description: "Upload your KYC documents in a few clicks. Our team will then do the final verification at your doorstep.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Zap,
      title: "Funds sent fast",
      description: "Voila! Within four hours you will receive funds. It's as easy as ordering a pizza.",
      color: "from-green-500 to-emerald-500"
    }
  ];

  // 6 Reasons - Why Choose Us
  const whyChooseUs: Reason[] = [
    {
      icon: Users,
      title: "Experienced Loan Advisors",
      description: "15 years of experienced mortgage professionals handling your case since 2002",
      gradient: "from-blue-500/20 to-cyan-500/20"
    },
    {
      icon: Zap,
      title: "Tech Friendly",
      description: "Our process systems are Tech driven to provide quality support to all our customers",
      gradient: "from-purple-500/20 to-pink-500/20"
    },
    {
      icon: Award,
      title: "One Loan Professional",
      description: "Dedicated one loan professional will be assigned to your financial project",
      gradient: "from-orange-500/20 to-red-500/20"
    },
    {
      icon: Lock,
      title: "Data Security",
      description: "We care about your personal and financial information kept secured in encrypted systems",
      gradient: "from-green-500/20 to-emerald-500/20"
    },
    {
      icon: Phone,
      title: "Convenient Contactability",
      description: "We respect your life priorities, hence we contact you at your convenient time slot",
      gradient: "from-indigo-500/20 to-blue-500/20"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Organization Schema for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FinancialService",
            "name": "KreditScore",
            "alternateName": "Kredit Score",
            "url": "https://www.kreditscore.in",
            "logo": "https://www.kreditscore.in/logo.png",
            "description": "KreditScore provides instant personal loans, pre-approved loans, and financial services with quick approval and low interest rates. Get loans from ₹50,000 to ₹25 lakh with minimal documentation.",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Business Address",
              "addressLocality": "Mumbai",
              "addressRegion": "Maharashtra",
              "postalCode": "400001",
              "addressCountry": "IN"
            },
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+91-9811195111",
              "contactType": "Customer Service",
              "areaServed": "IN",
              "availableLanguage": ["English", "Hindi"]
            },
            "sameAs": [
              "https://www.facebook.com/kreditscore",
              "https://twitter.com/kreditscore",
              "https://www.linkedin.com/company/kreditscore",
              "https://www.instagram.com/kreditscore"
            ],
            "founder": {
              "@type": "Person",
              "name": "Founder Name"
            },
            "foundingDate": "2024",
            "areaServed": {
              "@type": "Country",
              "name": "India"
            },
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "Financial Services",
              "itemListElement": [
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "FinancialProduct",
                    "name": "Instant Personal Loan",
                    "description": "Quick personal loans with instant approval"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "FinancialProduct",
                    "name": "Pre-Approved Personal Loan",
                    "description": "Pre-approved loans without income proof"
                  }
                }
              ]
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.7",
              "reviewCount": "4097",
              "bestRating": "5",
              "worstRating": "1"
            }
          })
        }}
      />

      {/* Custom Cursor */}
      <CustomCursor />

      {/* Header Navigation */}
      <Header />

      {/* Hero Section - Eligibility Check (matching original CSS exactly) */}
          <section className="mt-[80px] py-[10px] px-5 min-h-[180px] bg-white relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid lg:grid-cols-2 gap-[25px] items-center">
            {/* Left - Form Card with Sky Blue Gradient & Swing Animation (matching original CSS) */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{
                opacity: 1,
                x: 0
              }}
              transition={{
                opacity: { duration: 0.8 },
                x: { duration: 0.8 }
              }}
              className={`w-full min-w-0 ${showMobileScore ? 'hidden lg:block' : 'block'}`}
              onClick={() => setIsHeroAutoSlidePaused(true)}
              onFocusCapture={() => setIsHeroAutoSlidePaused(true)}
            >
              {/* Subtitle */}
              <p className="text-center lg:text-left text-[10px] text-[#64748b] mb-1.5 leading-[1.3]">
                100% FREE | No Hidden Charges | Instant Results | Trusted by Millions
              </p>

              {/* Form Card - 2 Step Form */}
              <motion.div
                animate={shouldReduceMotion ? { rotate: 0 } : { rotate: [-0.5, 0.5, -0.5] }}
                transition={shouldReduceMotion ? undefined : {
                  rotate: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                }}
                style={{ transformOrigin: 'top center', willChange: 'transform' }}
                className="w-full max-w-[300px] mx-auto lg:mx-0"
              >
                <div className="bg-gradient-to-br from-[#87CEEB] to-[#5FB8E8] rounded-lg p-2 shadow-[0_4px_12px_rgba(135,206,235,0.3)]">
                  {/* Progress Indicator */}
                  <div className="flex justify-center gap-1 mb-2">
                    {[1, 2].map((step) => (
                      <div
                        key={step}
                        className={`h-1 flex-1 rounded-full transition-all ${
                          step === currentStep ? 'bg-[#FFA500]' : 'bg-white'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Success Message */}
                  {isSubmitted ? (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{
                        duration: 0.5,
                        ease: [0.34, 1.56, 0.64, 1]
                      }}
                      className="flex flex-col items-center justify-center py-8 space-y-4"
                    >
                      {/* Animated Check Icon */}
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: [0, 1.2, 1] }}
                        transition={{
                          duration: 0.6,
                          ease: [0.34, 1.56, 0.64, 1],
                          times: [0, 0.6, 1]
                        }}
                        className="relative"
                      >
                        <CheckCircle2 className="w-20 h-20 text-white drop-shadow-2xl" />
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{
                            scale: [0, 1.8, 1.5],
                            opacity: [0, 0.6, 0]
                          }}
                          transition={{
                            duration: 1,
                            ease: "easeOut",
                            times: [0, 0.5, 1]
                          }}
                          className="absolute inset-0 bg-white rounded-full -z-10 blur-sm"
                        />
                      </motion.div>

                      {/* Success Text */}
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          delay: 0.3,
                          duration: 0.5,
                          ease: "easeOut"
                        }}
                        className="text-center space-y-2"
                      >
                        <motion.h3
                          initial={{ scale: 0.8 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.4, duration: 0.3 }}
                          className="text-white text-xl font-bold"
                        >
                          Thank You!
                        </motion.h3>
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5, duration: 0.4 }}
                          className="text-white/90 text-sm px-4"
                        >
                          Submitted successfully. Our team will call you shortly.
                        </motion.p>
                      </motion.div>
                    </motion.div>
                  ) : (
                    /* Form */
                    <form onSubmit={currentStep === 2 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }}>
                      {/* Step 1: Name & Mobile */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="space-y-0.5"
                      >
                        {currentStep === 1 && (
                        <>
                        <div className="mb-0.5">
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Your Name (As per PAN Card)"
                            autoComplete="name"
                            className="w-full px-2 py-1.5 border-0 rounded text-[12px] focus:outline-none focus:shadow-[0_0_0_2px_rgba(255,255,255,0.5)] transition-shadow"
                            required
                          />
                        </div>
                        <div className="mb-0.5">
                          <input
                            type="tel"
                            name="mobile"
                            value={formData.mobile}
                            onChange={(e) => {
                              const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 10);
                              setFormData({ ...formData, mobile: digitsOnly });
                            }}
                            placeholder="Mobile Number (10 Digit)"
                            inputMode="numeric"
                            autoComplete="tel-national"
                            className="w-full px-2 py-1.5 border-0 rounded text-[12px] focus:outline-none focus:shadow-[0_0_0_2px_rgba(255,255,255,0.5)] transition-shadow"
                            pattern="[0-9]{10}"
                            maxLength={10}
                            required
                          />
                        </div>
                        </>
                        )}
                        {currentStep === 2 && (
                        <>
                        <div className="mb-0.5">
                          <input
                            type="text"
                            name="pan"
                            value={formData.pan}
                            onChange={(e) => {
                              const panValue = e.target.value.toUpperCase();
                              setFormData({ ...formData, pan: panValue });
                            }}
                            placeholder="PAN Card Number (ABCDE1234F)"
                            autoComplete="off"
                            className="w-full px-2 py-1.5 border-0 rounded text-[12px] uppercase focus:outline-none focus:shadow-[0_0_0_2px_rgba(255,255,255,0.5)] transition-shadow"
                            pattern="[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}"
                            maxLength={10}
                            required
                          />
                        </div>
                        <div className="mb-0.5">
                          <input
                            type="number"
                            name="salary"
                            value={formData.salary}
                            onChange={(e) => {
                              const salaryValue = e.target.value.replace(/\D/g, '');
                              setFormData({ ...formData, salary: salaryValue });
                            }}
                            placeholder="Salary"
                            inputMode="numeric"
                            min={15000}
                            className="w-full px-2 py-1.5 border-0 rounded text-[12px] focus:outline-none focus:shadow-[0_0_0_2px_rgba(255,255,255,0.5)] transition-shadow"
                            required
                          />
                        </div>
                        </>
                        )}
                      </motion.div>

                    {/* Navigation Buttons */}
                    <div className="flex gap-1 mt-0.5">
                      {currentStep > 1 && (
                        <button
                          type="button"
                          onClick={handlePrevious}
                          className="flex-1 px-2 py-1.5 bg-white/80 text-[#0A2540] border-0 rounded text-[12px] font-bold hover:-translate-y-0.5 hover:bg-white transition-all shadow-md"
                        >
                          Back
                        </button>
                      )}
                      <button
                        type="submit"
                        disabled={currentStep === 1 ? !isStepOneValid : !isStepTwoValid}
                        className={`${currentStep === 1 ? 'w-full' : 'flex-1'} px-2 py-1.5 border-0 rounded text-[12px] font-bold transition-all duration-300 shadow-md ${
                          (currentStep === 1 ? isStepOneValid : isStepTwoValid)
                            ? 'bg-white text-[#0A2540] hover:-translate-y-0.5 hover:bg-[#f8f9fa] hover:shadow-[0_8px_20px_rgba(255,255,255,0.5)]'
                            : 'bg-white/60 text-[#0A2540]/60 cursor-not-allowed'
                        }`}
                      >
                        {currentStep === 2 ? 'Submit' : 'Next'}
                      </button>
                    </div>
                  </form>
                  )}

                  {/* Trust Indicators */}
                  <div className="flex justify-center gap-2 mt-1">
                    <div className="flex items-center gap-0.5 text-[9px] text-white">
                      <Shield className="w-2.5 h-2.5" />
                      <span>256-bit Encrypted</span>
                    </div>
                    <div className="flex items-center gap-0.5 text-[9px] text-white">
                      <Lock className="w-2.5 h-2.5" />
                      <span>Data Secure</span>
                    </div>
                    <div className="flex items-center gap-0.5 text-[9px] text-white">
                      <Award className="w-2.5 h-2.5" />
                      <span>No Hidden Charges</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right - Score Meter with Float Animation (matching original CSS) */}
            <motion.div
              className={`relative justify-center items-center min-h-[165px] lg:min-h-[200px] mt-1 lg:mt-0 ${showMobileScore ? 'flex' : 'hidden lg:flex'}`}
            >
              <motion.div
                className="relative"
                initial={{ opacity: 0, x: 30 }}
                animate={shouldReduceMotion ? {
                  opacity: 1,
                  x: 0,
                  y: 0
                } : isHeroAutoSlidePaused ? {
                  opacity: 1,
                  x: 0,
                  y: 0
                } : {
                  opacity: 1,
                  x: [0, 14, 0],
                  y: [0, -10, 0]
                }}
                transition={shouldReduceMotion ? {
                  opacity: { duration: 0.4, ease: "easeOut" },
                  x: { duration: 0.4, ease: "easeOut" }
                } : isHeroAutoSlidePaused ? {
                  opacity: { duration: 0.4, ease: "easeOut" },
                  x: { duration: 0.4, ease: "easeOut" }
                } : {
                  opacity: { duration: 0.4, ease: "easeOut" },
                  x: { duration: 2.8, repeat: Infinity, ease: "easeInOut" },
                  y: { duration: 2.8, repeat: Infinity, ease: "easeInOut" }
                }}
              >
                {/* Score Meter Ring with Advanced Animation */}
                <div className="relative w-[128px] h-[128px] sm:w-[150px] sm:h-[150px] lg:w-[160px] lg:h-[160px]">
                  <svg viewBox="0 0 160 160" className="w-full h-full transform -rotate-90">
                    {/* Background Circle */}
                    <circle cx="80" cy="80" r="70" stroke="#e5e7eb" strokeWidth="9" fill="none"/>

                    {/* Animated Score Circle */}
                    <motion.circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke={scoreColor}
                      strokeWidth="9"
                      fill="none"
                      strokeDasharray="440"
                      strokeLinecap="round"
                      initial={{ strokeDashoffset: 440 }}
                      animate={{
                        strokeDashoffset: [
                          440,  // Start from 0
                          220,  // 750 score
                          220   // Hold at 750
                        ]
                      }}
                      transition={{
                        duration: 1.2,
                        times: [0, 0.8, 1],
                        ease: "easeOut"
                      }}
                    />

                    <defs>
                      {/* Dynamic Gradient that changes with score */}
                      <motion.linearGradient
                        id="scoreGradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <motion.stop
                          offset="0%"
                          initial={{ stopColor: '#00D66F' }}
                          animate={{
                            stopColor: [
                              '#00D66F',  // Green (start at 750)
                              '#FFD700',  // Gold transition
                              '#FFA500',  // Light orange
                              '#FF8C00',  // Dark orange (at 900)
                              '#FFA500',  // Light orange
                              '#FFD700',  // Gold transition
                              '#00D66F',  // Green (750+)
                              '#00D66F'   // Final green
                            ]
                          }}
                          transition={{
                            duration: 3,
                            times: [0, 0.2, 0.35, 0.45, 0.55, 0.65, 0.75, 1]
                          }}
                          style={{ stopOpacity: 1 }}
                        />
                        <motion.stop
                          offset="100%"
                          initial={{ stopColor: '#0A2540' }}
                          animate={{
                            stopColor: [
                              '#0A2540',  // Dark blue-green (start at 750)
                              '#FFA500',  // Light orange
                              '#FF8C00',  // Orange
                              '#CC6600',  // Medium orange (at 900)
                              '#FF8C00',  // Orange
                              '#FFA500',  // Light orange
                              '#0A2540',  // Dark blue-green
                              '#0A2540'   // Final
                            ]
                          }}
                          transition={{
                            duration: 3,
                            times: [0, 0.2, 0.35, 0.45, 0.55, 0.65, 0.75, 1]
                          }}
                          style={{ stopOpacity: 1 }}
                        />
                      </motion.linearGradient>
                    </defs>
                  </svg>

                  {/* Score Number Display */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.div
                      className="text-2xl sm:text-3xl font-bold"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1, color: scoreColor }}
                      transition={{
                        opacity: { duration: 0.5, delay: 0.3 },
                        scale: { duration: 0.5, delay: 0.3 },
                        color: { duration: 0.25 }
                      }}
                    >
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        {animatedScore}
                      </motion.span>
                    </motion.div>
                    <motion.div
                      className="text-[10px] sm:text-[11px] mt-0 font-medium"
                      initial={{ opacity: 0 }}
                      animate={{
                        opacity: 1
                      }}
                      transition={{
                        opacity: { duration: 0.4, delay: 0.3 }
                      }}
                      style={{ color: scoreColor }}
                    >
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.3 }}
                      >
                        {animatedScore >= 760 ? 'Excellent' : animatedScore >= 700 ? 'Good' : 'Building'}
                      </motion.span>
                    </motion.div>
                  </div>
                </div>

                {/* Floating Badge 1: Top Right - 10 Lakh+ Happy Users */}
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: [0.45, 0, 0.55, 1],
                    times: [0, 0.5, 1]
                  }}
                  style={{ willChange: 'transform' }}
                  className="absolute -top-[4px] -right-[40px] sm:-top-[6px] sm:-right-[100px] bg-[#FF8C00] text-white px-[8px] sm:px-[12px] py-[4px] sm:py-[6px] rounded-[50px] text-[8px] sm:text-[10px] font-semibold shadow-[0_3px_10px_rgba(0,0,0,0.15)] flex items-center gap-[4px] whitespace-nowrap"
                >
                  <span>⭐</span> 10 Lakh+ Happy Users
                </motion.div>

                {/* Floating Badge 2: Bottom Right - AI Powered */}
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{
                    duration: 4.5,
                    repeat: Infinity,
                    ease: [0.45, 0, 0.55, 1],
                    times: [0, 0.5, 1]
                  }}
                  style={{ willChange: 'transform' }}
                  className="absolute -bottom-[4px] -right-[26px] sm:-bottom-[6px] sm:-right-[60px] bg-[#87CEEB] text-[#2c3e50] px-[8px] sm:px-[12px] py-[4px] sm:py-[6px] rounded-[50px] text-[8px] sm:text-[10px] font-semibold shadow-[0_3px_10px_rgba(0,0,0,0.15)] flex items-center gap-[4px] whitespace-nowrap"
                >
                  <span>🤖</span> AI Powered
                </motion.div>

                {/* Floating Badge 3: Bottom Left - No Impact in CIBIL */}
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: [0.45, 0, 0.55, 1],
                    times: [0, 0.5, 1]
                  }}
                  style={{ willChange: 'transform' }}
                  className="absolute -bottom-[4px] -left-[38px] sm:-bottom-[6px] sm:-left-[145px] bg-white text-[#2c3e50] border-2 border-[#87CEEB] px-[8px] sm:px-[12px] py-[4px] sm:py-[6px] rounded-[50px] text-[8px] sm:text-[10px] font-semibold shadow-[0_3px_10px_rgba(0,0,0,0.15)] flex items-center gap-[4px] whitespace-nowrap"
                >
                  <span>✓</span> No Impact in CIBIL Enquiry
                </motion.div>

                {/* Floating Badge 4: Top Left - +50 Points with Animated Arrow */}
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{
                    duration: 4.2,
                    repeat: Infinity,
                    ease: [0.45, 0, 0.55, 1],
                    times: [0, 0.5, 1]
                  }}
                  style={{ willChange: 'transform' }}
                  className="absolute -top-[4px] -left-[26px] sm:-top-[6px] sm:-left-[60px] bg-[#10b981] text-white px-[8px] sm:px-[12px] py-[4px] sm:py-[6px] rounded-[50px] text-[8px] sm:text-[10px] font-semibold shadow-[0_3px_10px_rgba(0,0,0,0.15)] flex items-center gap-[4px] whitespace-nowrap"
                >
                  <motion.span
                    animate={{ y: [0, -4, 0] }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: [0.45, 0, 0.55, 1],
                      times: [0, 0.5, 1]
                    }}
                  >
                    ↑
                  </motion.span>
                  +50 Points
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* SEO Content Hidden */}
        <div className="hidden">
          <h1>Personal Loans & Credit Score - सबसे तेज़!</h1>
          <p>Get instant loan approval using AI. Check eligibility in 2 minutes, receive funds in 24 hours. Pre-approved loans, doctor/government employee/CA loans available.</p>
        </div>
      </section>

      {/* Loan Products Section - 8 Products */}
      <section id="loans" className="py-8 px-0 md:px-4 bg-white relative overflow-hidden">
        {/* Animated Circles Background */}
        <motion.div
          animate={{ y: [0, -38, 0], x: [0, -8, 0] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[40%] left-[3%] w-24 h-24 border-4 border-[#87CEEB] rounded-full opacity-[0.38] pointer-events-none"
        />
        <motion.div
          animate={{ y: [0, -42, 0] }}
          transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[60%] right-[5%] w-24 h-24 border-4 border-[#FF8C00] rounded-full opacity-[0.42] pointer-events-none"
        />
        <motion.div
          animate={{ y: [0, -33, 0], x: [0, 12, 0] }}
          transition={{ duration: 2.9, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[30%] left-[50%] w-24 h-24 border-4 border-[#87CEEB] rounded-full opacity-[0.36] pointer-events-none"
        />
        <motion.div
          animate={{ y: [0, -36, 0] }}
          transition={{ duration: 3.1, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[40%] left-[25%] w-24 h-24 border-4 border-[#FF8C00] rounded-full opacity-[0.34] pointer-events-none"
        />
        <motion.div
          animate={{ y: [0, -40, 0], x: [0, -15, 0] }}
          transition={{ duration: 2.7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[30%] right-[25%] w-24 h-24 border-4 border-[#87CEEB] rounded-full opacity-[0.40] pointer-events-none"
        />
        <motion.div
          animate={{ y: [0, -44, 0] }}
          transition={{ duration: 3.3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[25%] right-[30%] w-24 h-24 border-4 border-[#FF8C00] rounded-full opacity-[0.37] pointer-events-none"
        />

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Loan type quick buttons — single row on mobile (scroll if needed) */}
          <div className="mb-4 md:mb-8 px-4 md:px-0">
            <div className="flex flex-nowrap md:flex-wrap justify-center gap-1 md:gap-2 overflow-x-auto pb-0 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <button
                type="button"
                className="shrink-0 px-2 py-1.5 md:px-4 md:py-2 bg-[#87CEEB] text-white font-medium rounded-lg hover:bg-[#76bdda] transition-all shadow-md text-[9px] sm:text-[10px] md:text-sm whitespace-nowrap"
              >
                Salaried Loan
              </button>
              <button
                type="button"
                onClick={() => handleFeatureClick('Business Loan for Entrepreneurship')}
                className="shrink-0 px-2 py-1.5 md:px-4 md:py-2 bg-[#FF8C00] text-white font-medium rounded-lg hover:bg-[#e67e00] transition-all shadow-md text-[9px] sm:text-[10px] md:text-sm whitespace-nowrap"
              >
                Business Loan
              </button>
              <button
                type="button"
                onClick={() => handleFeatureClick('Insurance')}
                className="shrink-0 px-2 py-1.5 md:px-4 md:py-2 bg-[#87CEEB] text-white font-medium rounded-lg hover:bg-[#76bdda] transition-all shadow-md text-[9px] sm:text-[10px] md:text-sm whitespace-nowrap"
              >
                Insurance
              </button>
              <button
                type="button"
                onClick={() => handleFeatureClick('Investment')}
                className="shrink-0 px-2 py-1.5 md:px-4 md:py-2 bg-[#FF8C00] text-white font-medium rounded-lg hover:bg-[#e67e00] transition-all shadow-md text-[9px] sm:text-[10px] md:text-sm whitespace-nowrap"
              >
                Investment
              </button>
              <button
                type="button"
                onClick={() => handleFeatureClick('FD (Fixed Deposit)')}
                className="shrink-0 px-2 py-1.5 md:px-4 md:py-2 bg-[#87CEEB] text-white font-medium rounded-lg hover:bg-[#76bdda] transition-all shadow-md text-[9px] sm:text-[10px] md:text-sm whitespace-nowrap"
              >
                Fixed Deposit
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-4 px-4 md:px-0">
            {loanProducts.map((product, index) => (
              <motion.div
                key={product.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  delay: index * 0.02,
                  duration: 0.3,
                  ease: "easeOut"
                }}
                whileHover={{
                  y: -8,
                  transition: { duration: 0.3, ease: "easeOut" }
                }}
                onClick={() => handleLoanClick(product.title)}
                className="bg-white rounded-xl p-3 md:p-3 px-2 border-2 border-gray-200 hover:border-[#667eea] hover:shadow-[0_10px_30px_rgba(102,126,234,0.3)] transition-all duration-300 cursor-pointer group relative"
              >
                {/* Icon with arrow overlay on hover */}
                <div className="relative w-8 h-8 md:w-12 md:h-12 mb-1 md:mb-2">
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${product.color} rounded-xl flex items-center justify-center`}
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    <product.icon className="w-4 h-4 md:w-6 md:h-6 text-white" />
                  </motion.div>
                </div>

                <h3 className="text-[9px] md:text-xs font-bold text-gray-900 mb-1 md:mb-2 leading-tight">{product.title}</h3>

                <div className="space-y-0.5 md:space-y-1">
                  {product.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-0.5 md:gap-1">
                      <CheckCircle2 className="w-2 h-2 md:w-3 md:h-3 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600 text-[7px] md:text-[10px] leading-tight">{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Section - 4 Tools */}
      <section id="tools" className="py-8 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-6"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-2">
              <span className="text-[#2c3e50]">Smart </span>
              <span className="text-[#87CEEB]">Tool</span>
            </h2>
          </motion.div>

          {/* Desktop Grid */}
          <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6">
            {tools.map((tool, index) => {
              const isCompanyCategory = tool.title === 'Company Category';

              return (
                <motion.div
                  key={tool.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10, scale: 1.05 }}
                  onClick={() => isCompanyCategory && setIsCompanyCategoryOpen(true)}
                  className={`bg-white rounded-2xl p-8 text-center hover:shadow-2xl transition-all group relative overflow-hidden ${
                    isCompanyCategory ? 'cursor-pointer' : ''
                  }`}
                >
                  {/* Animated background for Company Category */}
                  {isCompanyCategory && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity"
                      animate={{
                        backgroundPosition: ['0% 0%', '100% 100%'],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        repeatType: 'reverse'
                      }}
                    />
                  )}

                  <div className="relative z-10">
                    {/* Animated icon container */}
                    <motion.div
                      className={`w-20 h-20 ${tool.color} rounded-2xl flex items-center justify-center mx-auto mb-4 ${
                        isCompanyCategory ? 'group-hover:shadow-xl' : ''
                      }`}
                      animate={isCompanyCategory ? {
                        rotate: [0, 5, -5, 5, 0],
                        scale: [1, 1.05, 1, 1.05, 1]
                      } : {}}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 3
                      }}
                    >
                      <motion.div
                        animate={isCompanyCategory ? {
                          y: [0, -3, 0, -3, 0]
                        } : {}}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          repeatDelay: 3
                        }}
                      >
                        <tool.icon className="w-10 h-10 text-white" />
                      </motion.div>
                    </motion.div>

                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {tool.title}
                    </h3>

                    {/* Click indicator for Company Category */}
                    {isCompanyCategory && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="text-xs text-blue-600 mt-2 font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Click to explore →
                      </motion.p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Mobile Horizontal Scroll */}
          <div className="md:hidden flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4">
            {tools.map((tool, index) => {
              const isCompanyCategory = tool.title === 'Company Category';

              return (
                <motion.div
                  key={tool.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => isCompanyCategory && setIsCompanyCategoryOpen(true)}
                  className={`bg-white rounded-2xl p-6 text-center shadow-lg snap-center flex-shrink-0 w-[200px] relative overflow-hidden ${
                    isCompanyCategory ? 'active:scale-95 cursor-pointer' : ''
                  }`}
                >
                  {/* Animated background for mobile */}
                  {isCompanyCategory && (
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-50" />
                  )}

                  <div className="relative z-10">
                    <motion.div
                      className={`w-16 h-16 ${tool.color} rounded-2xl flex items-center justify-center mx-auto mb-3`}
                      animate={isCompanyCategory ? {
                        rotate: [0, 5, -5, 0],
                        scale: [1, 1.05, 1]
                      } : {}}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 3
                      }}
                    >
                      <tool.icon className="w-8 h-8 text-white" />
                    </motion.div>
                    <h3 className="text-sm font-bold text-gray-900">{tool.title}</h3>
                    {isCompanyCategory && (
                      <p className="text-xs text-blue-600 mt-1">Tap to explore</p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section - 5 Points */}
      <section id="about" className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Desktop Grid */}
          <div className="hidden md:grid grid-cols-3 lg:grid-cols-5 gap-4">
            {whyChooseUs.map((reason, index) => (
              <motion.div
                key={reason.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-white rounded-xl p-4 hover:shadow-xl transition-all min-h-[180px]"
              >
                <div className={`w-10 h-10 bg-gradient-to-br ${reason.gradient} rounded-lg flex items-center justify-center mb-3`}>
                  <reason.icon className="w-5 h-5 text-blue-600" />
                </div>

                <h3 className="text-sm font-bold text-gray-900 mb-2 leading-tight">{reason.title}</h3>
                <p className="text-xs text-gray-600 leading-tight">{reason.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Mobile Horizontal Scroll */}
          <div className="md:hidden flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4">
            {whyChooseUs.map((reason, index) => (
              <motion.div
                key={reason.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-4 shadow-lg snap-center flex-shrink-0 w-[220px] min-h-[180px]"
              >
                <div className={`w-10 h-10 bg-gradient-to-br ${reason.gradient} rounded-lg flex items-center justify-center mb-3`}>
                  <reason.icon className="w-5 h-5 text-blue-600" />
                </div>

                <h3 className="text-sm font-bold text-gray-900 mb-2 leading-tight">{reason.title}</h3>
                <p className="text-xs text-gray-600 leading-tight">{reason.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* WhatsApp Button */}
      <a
        href="https://wa.me/919811195111"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 w-16 h-16 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all z-50 animate-bounce-slow"
      >
        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
      </a>

      <Footer />

      {/* Coming Soon Modal */}
      <ComingSoonModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        featureName={selectedFeature}
      />

      {/* Loan Application Form */}
      <LoanApplicationForm
        isOpen={isLoanFormOpen}
        onClose={() => setIsLoanFormOpen(false)}
        loanType={selectedLoanType}
      />

      {/* Company Category Modal */}
      <CompanyCategoryModal
        isOpen={isCompanyCategoryOpen}
        onClose={() => setIsCompanyCategoryOpen(false)}
      />
    </div>
  );
}

