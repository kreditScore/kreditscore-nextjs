'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';
import ComingSoonModal from '@/components/ComingSoonModal';
import LoanApplicationForm from '@/components/LoanApplicationFormImproved';
import CustomCursor from '@/components/CustomCursor';
import CompanyCategoryModal from '@/components/CompanyCategoryModal';
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
  Mail,
  MapPin,
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
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState('');

  // Loan Form state
  const [isLoanFormOpen, setIsLoanFormOpen] = useState(false);
  const [selectedLoanType, setSelectedLoanType] = useState('');

  // Company Category Modal state
  const [isCompanyCategoryOpen, setIsCompanyCategoryOpen] = useState(false);

  // Hero Form state (small 4-step form)
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    loanAmount: '',
    address: '',
    pan: '',
    dob: '',
    companyName: '',
    salary: ''
  });
  const [cityInput, setCityInput] = useState('');
  const [companyInput, setCompanyInput] = useState('');
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);
  const [showCompanySuggestions, setShowCompanySuggestions] = useState(false);

  // Sample data for autocomplete
  const indianCities = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Surat'];
  const indianCompanies = ['TCS', 'Infosys', 'Wipro', 'HCL', 'Tech Mahindra', 'Reliance', 'HDFC Bank', 'ICICI Bank', 'Tata Motors', 'Mahindra'];

  const filteredCities = cityInput
    ? indianCities.filter(city => city.toLowerCase().includes(cityInput.toLowerCase()))
    : [];

  const filteredCompanies = companyInput
    ? indianCompanies.filter(company => company.toLowerCase().includes(companyInput.toLowerCase()))
    : [];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCityInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCityInput(e.target.value);
    setShowCitySuggestions(true);
  };

  const handleCitySelect = (city: string) => {
    setCityInput(city);
    setFormData({ ...formData, address: city });
    setShowCitySuggestions(false);
  };

  const handleCompanyInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCompanyInput(e.target.value);
    setShowCompanySuggestions(true);
  };

  const handleCompanySelect = (company: string) => {
    setCompanyInput(company);
    setFormData({ ...formData, companyName: company });
    setShowCompanySuggestions(false);
  };

  const handleNext = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setCurrentStep(1);
      setFormData({
        name: '', mobile: '', loanAmount: '', address: '',
        pan: '', dob: '', companyName: '', salary: ''
      });
      setCityInput('');
      setCompanyInput('');
    }, 3000);
  };

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
      title: "Teacher Loan",
      features: ["Zero PF", "Low interest rates"],
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
            "url": "https://kreditscore.com",
            "logo": "https://kreditscore.com/logo.png",
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
              "telephone": "+91-XXXXXXXXXX",
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
              className="w-full"
            >
              {/* Subtitle */}
              <p className="text-center lg:text-left text-[10px] text-[#64748b] mb-1.5 leading-[1.3]">
                100% FREE | No Hidden Charges | Instant Results | Trusted by Millions
              </p>

              {/* Form Card - 4 Step Form */}
              <motion.div
                animate={{
                  rotate: [-0.5, 0.5, -0.5]
                }}
                transition={{
                  rotate: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                }}
                style={{ transformOrigin: 'top center', willChange: 'transform' }}
                className="w-full max-w-[300px] mx-auto lg:mx-0"
              >
                <div className="bg-gradient-to-br from-[#87CEEB] to-[#5FB8E8] rounded-lg p-2 shadow-[0_4px_12px_rgba(135,206,235,0.3)]">
                  {/* Progress Indicator */}
                  <div className="flex justify-center gap-1 mb-2">
                    {[1, 2, 3, 4].map((step) => (
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
                          Your application has been submitted successfully. We'll get back to you soon!
                        </motion.p>
                      </motion.div>
                    </motion.div>
                  ) : (
                    /* Form */
                    <form onSubmit={currentStep === 4 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }}>
                      {/* Step 1: Name & Mobile */}
                      {currentStep === 1 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="space-y-0.5"
                      >
                        <div className="mb-0.5">
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Enter Your Name"
                            className="w-full px-2 py-1.5 border-0 rounded text-[12px] focus:outline-none focus:shadow-[0_0_0_2px_rgba(255,255,255,0.5)] transition-shadow"
                            required
                          />
                        </div>
                        <div className="mb-0.5">
                          <input
                            type="tel"
                            name="mobile"
                            value={formData.mobile}
                            onChange={handleInputChange}
                            placeholder="Enter Mobile Number"
                            className="w-full px-2 py-1.5 border-0 rounded text-[12px] focus:outline-none focus:shadow-[0_0_0_2px_rgba(255,255,255,0.5)] transition-shadow"
                            pattern="[0-9]{10}"
                            required
                          />
                        </div>
                      </motion.div>
                    )}

                    {/* Step 2: Loan Amount & Address */}
                    {currentStep === 2 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="space-y-0.5"
                      >
                        <div className="mb-0.5">
                          <input
                            type="number"
                            name="loanAmount"
                            value={formData.loanAmount}
                            onChange={handleInputChange}
                            placeholder="Loan Amount"
                            className="w-full px-2 py-1.5 border-0 rounded text-[12px] focus:outline-none focus:shadow-[0_0_0_2px_rgba(255,255,255,0.5)] transition-shadow"
                            required
                          />
                        </div>
                        <div className="mb-0.5 relative city-autocomplete">
                          <input
                            type="text"
                            value={cityInput}
                            onChange={handleCityInputChange}
                            placeholder="Enter Your City"
                            className="w-full px-2 py-1.5 border-0 rounded text-[12px] focus:outline-none focus:shadow-[0_0_0_2px_rgba(255,255,255,0.5)] transition-shadow"
                            required
                            onFocus={() => cityInput.length > 0 && setShowCitySuggestions(true)}
                          />

                          {/* City Dropdown */}
                          {showCitySuggestions && filteredCities.length > 0 && (
                            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                              {filteredCities.map((city, index) => (
                                <div
                                  key={index}
                                  onClick={() => handleCitySelect(city)}
                                  className="px-3 py-2 text-[12px] text-gray-800 hover:bg-gradient-to-r hover:from-[#FF8C00]/10 hover:to-[#87CEEB]/10 cursor-pointer transition-colors"
                                >
                                  {city}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}

                    {/* Step 3: PAN & DOB */}
                    {currentStep === 3 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="space-y-0.5"
                      >
                        <div className="mb-0.5">
                          <input
                            type="text"
                            name="pan"
                            value={formData.pan}
                            onChange={handleInputChange}
                            placeholder="PAN Number"
                            className="w-full px-2 py-1.5 border-0 rounded text-[12px] uppercase focus:outline-none focus:shadow-[0_0_0_2px_rgba(255,255,255,0.5)] transition-shadow"
                            maxLength={10}
                            required
                          />
                        </div>
                        <div className="mb-0.5">
                          <input
                            type="date"
                            name="dob"
                            value={formData.dob}
                            onChange={handleInputChange}
                            placeholder="Date of Birth (DD-MM-YYYY)"
                            min={`${new Date().getFullYear() - 100}-01-01`}
                            max={`${new Date().getFullYear() - 18}-12-31`}
                            className="w-full px-2 py-1.5 border-0 rounded text-[12px] focus:outline-none focus:shadow-[0_0_0_2px_rgba(255,255,255,0.5)] transition-shadow"
                            required
                          />
                        </div>
                      </motion.div>
                    )}

                    {/* Step 4: Company Name & Salary */}
                    {currentStep === 4 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="space-y-0.5"
                      >
                        <div className="mb-0.5 relative company-autocomplete">
                          <input
                            type="text"
                            value={companyInput}
                            onChange={handleCompanyInputChange}
                            placeholder="Company Name"
                            className="w-full px-2 py-1.5 border-0 rounded text-[12px] focus:outline-none focus:shadow-[0_0_0_2px_rgba(255,255,255,0.5)] transition-shadow"
                            required
                            onFocus={() => companyInput.length > 0 && setShowCompanySuggestions(true)}
                          />
                          {showCompanySuggestions && filteredCompanies.length > 0 && (
                            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                              {filteredCompanies.map((company, index) => (
                                <div
                                  key={index}
                                  onClick={() => handleCompanySelect(company)}
                                  className="px-3 py-2 text-[12px] text-gray-800 hover:bg-gradient-to-r hover:from-[#FF8C00]/10 hover:to-[#87CEEB]/10 cursor-pointer transition-colors"
                                >
                                  {company}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="mb-0.5">
                          <input
                            type="number"
                            name="salary"
                            value={formData.salary}
                            onChange={handleInputChange}
                            placeholder="Monthly Salary"
                            className="w-full px-2 py-1.5 border-0 rounded text-[12px] focus:outline-none focus:shadow-[0_0_0_2px_rgba(255,255,255,0.5)] transition-shadow"
                            required
                          />
                        </div>
                      </motion.div>
                    )}

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
                        className={`${currentStep === 1 ? 'w-full' : 'flex-1'} px-2 py-1.5 bg-white text-[#0A2540] border-0 rounded text-[12px] font-bold hover:-translate-y-0.5 hover:bg-[#f8f9fa] hover:shadow-[0_8px_20px_rgba(255,255,255,0.5)] transition-all duration-300 shadow-md`}
                      >
                        {currentStep === 4 ? 'Submit' : 'Next'}
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
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right - Score Meter with Float Animation (matching original CSS) */}
            <motion.div
              className="relative hidden lg:flex justify-center items-center min-h-[200px]"
            >
              <motion.div
                className="relative"
                initial={{ opacity: 0, x: 30 }}
                animate={{
                  opacity: 1,
                  x: 0,
                  y: [0, -15, 0]
                }}
                transition={{
                  opacity: { duration: 0.4, ease: "easeOut" },
                  x: { duration: 0.4, ease: "easeOut" },
                  y: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                }}
              >
                {/* Score Meter Ring with Advanced Animation */}
                <div className="relative w-[160px] h-[160px]">
                  <svg width="160" height="160" className="transform -rotate-90">
                    {/* Background Circle */}
                    <circle cx="80" cy="80" r="70" stroke="#e5e7eb" strokeWidth="9" fill="none"/>

                    {/* Animated Score Circle */}
                    <motion.circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="url(#scoreGradient)"
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
                      className="text-3xl font-bold"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                        color: [
                          '#00D66F',  // Green (start at 750)
                          '#FFA500',  // Light orange
                          '#FF8C00',  // Orange
                          '#FFA500',  // Light orange
                          '#00D66F'   // Green (final)
                        ]
                      }}
                      transition={{
                        opacity: { duration: 0.5, delay: 0.3 },
                        scale: { duration: 0.5, delay: 0.3 },
                        color: { duration: 3, times: [0, 0.2, 0.45, 0.65, 1] }
                      }}
                    >
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        750
                      </motion.span>
                    </motion.div>
                    <motion.div
                      className="text-[11px] mt-0 font-medium"
                      initial={{ opacity: 0 }}
                      animate={{
                        opacity: 1
                      }}
                      transition={{
                        opacity: { duration: 0.4, delay: 0.3 }
                      }}
                      style={{ color: '#00D66F' }}
                    >
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.3 }}
                      >
                        Excellent
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
                  className="absolute -top-[6px] -right-[100px] bg-[#FF8C00] text-white px-[12px] py-[6px] rounded-[50px] text-[10px] font-semibold shadow-[0_3px_10px_rgba(0,0,0,0.15)] flex items-center gap-[4px] whitespace-nowrap"
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
                  className="absolute -bottom-[6px] -right-[60px] bg-[#87CEEB] text-[#2c3e50] px-[12px] py-[6px] rounded-[50px] text-[10px] font-semibold shadow-[0_3px_10px_rgba(0,0,0,0.15)] flex items-center gap-[4px] whitespace-nowrap"
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
                  className="absolute -bottom-[6px] -left-[145px] bg-white text-[#2c3e50] border-2 border-[#87CEEB] px-[12px] py-[6px] rounded-[50px] text-[10px] font-semibold shadow-[0_3px_10px_rgba(0,0,0,0.15)] flex items-center gap-[4px] whitespace-nowrap"
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
                  className="absolute -top-[6px] -left-[60px] bg-[#10b981] text-white px-[12px] py-[6px] rounded-[50px] text-[10px] font-semibold shadow-[0_3px_10px_rgba(0,0,0,0.15)] flex items-center gap-[4px] whitespace-nowrap"
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
          <p>Get instant loan approval using AI. Check eligibility in 2 minutes, receive funds in 24 hours. Pre-approved loans, doctor/teacher/CA loans available.</p>
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
          {/* Vertical Loan Type Buttons - 2 rows on mobile */}
          <div className="mb-8 md:mb-12 px-4 md:px-0">
            {/* First Row - Mobile: 2 buttons, Desktop: all inline */}
            <div className="flex flex-wrap justify-center gap-1 md:gap-2 mb-1 md:mb-0">
              <button className="px-2 py-1.5 md:px-4 md:py-2 bg-[#87CEEB] text-white font-medium rounded-lg hover:bg-[#76bdda] transition-all shadow-md text-[10px] md:text-sm whitespace-nowrap">
                Salaried Loan
              </button>
              <button
                onClick={() => handleFeatureClick('Business Loan for Entrepreneurship')}
                className="px-2 py-1.5 md:px-4 md:py-2 bg-[#FF8C00] text-white font-medium rounded-lg hover:bg-[#e67e00] transition-all shadow-md text-[10px] md:text-sm whitespace-nowrap"
              >
                Business Loan
              </button>
              <button
                onClick={() => handleFeatureClick('Insurance')}
                className="px-2 py-1.5 md:px-4 md:py-2 bg-[#87CEEB] text-white font-medium rounded-lg hover:bg-[#76bdda] transition-all shadow-md text-[10px] md:text-sm whitespace-nowrap md:inline-block hidden md:inline"
              >
                Insurance
              </button>
              <button
                onClick={() => handleFeatureClick('Investment')}
                className="px-2 py-1.5 md:px-4 md:py-2 bg-[#FF8C00] text-white font-medium rounded-lg hover:bg-[#e67e00] transition-all shadow-md text-[10px] md:text-sm whitespace-nowrap hidden md:inline-block"
              >
                Investment
              </button>
              <button
                onClick={() => handleFeatureClick('FD (Fixed Deposit)')}
                className="px-2 py-1.5 md:px-4 md:py-2 bg-[#87CEEB] text-white font-medium rounded-lg hover:bg-[#76bdda] transition-all shadow-md text-[10px] md:text-sm whitespace-nowrap hidden md:inline-block"
              >
                FD
              </button>
            </div>

            {/* Second Row - Mobile only: remaining 3 buttons */}
            <div className="flex flex-wrap justify-center gap-1 md:hidden">
              <button
                onClick={() => handleFeatureClick('Insurance')}
                className="px-2 py-1.5 bg-[#87CEEB] text-white font-medium rounded-lg hover:bg-[#76bdda] transition-all shadow-md text-[10px] whitespace-nowrap"
              >
                Insurance
              </button>
              <button
                onClick={() => handleFeatureClick('Investment')}
                className="px-2 py-1.5 bg-[#FF8C00] text-white font-medium rounded-lg hover:bg-[#e67e00] transition-all shadow-md text-[10px] whitespace-nowrap"
              >
                Investment
              </button>
              <button
                onClick={() => handleFeatureClick('FD (Fixed Deposit)')}
                className="px-2 py-1.5 bg-[#87CEEB] text-white font-medium rounded-lg hover:bg-[#76bdda] transition-all shadow-md text-[10px] whitespace-nowrap"
              >
                FD
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

      {/* WhatsApp Button */}
      <a
        href="https://wa.me/919811195111"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-300"
      >
        <Phone className="w-7 h-7 text-white" />
      </a>

      {/* Footer - Always Visible */}
      <footer className="bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white py-8 md:py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Desktop View - 4 Columns */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* Company Info Column */}
            <div>
              {/* Logo with bouncing Score letters */}
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

              {/* App Links */}
              <div>
                <h4 className="text-[16px] text-[#87CEEB] mb-4">Download Our App</h4>
                <div className="flex flex-wrap gap-2">
                  <a href="#" className="inline-flex items-center gap-2.5 bg-[#2a2a2a] px-5 py-2.5 rounded-[10px] text-white text-[14px] font-semibold hover:bg-[#87CEEB] hover:text-black hover:-translate-y-1 transition-all duration-300">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                    </svg>
                    <span>Google Play</span>
                  </a>
                  <a href="#" className="inline-flex items-center gap-2.5 bg-[#2a2a2a] px-5 py-2.5 rounded-[10px] text-white text-[14px] font-semibold hover:bg-[#87CEEB] hover:text-black hover:-translate-y-1 transition-all duration-300">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.1 17.41,12.63C17.44,15.65 20.06,16.66 20.09,16.67C20.06,16.74 19.67,18.11 18.71,19.5M13,3.5C13.73,2.67 14.94,2.04 15.94,2C16.07,3.17 15.6,4.35 14.9,5.19C14.21,6.04 13.07,6.7 11.95,6.61C11.8,5.46 12.36,4.26 13,3.5Z" />
                    </svg>
                    <span>App Store</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-[16px] font-semibold mb-4 text-[#87CEEB]">Resources</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-[#cccccc] hover:text-white transition-colors text-[14px]">Blog & Articles</a></li>
                <li><a href="#" className="text-[#cccccc] hover:text-white transition-colors text-[14px]">FAQs</a></li>
                <li><a href="#" className="text-[#cccccc] hover:text-white transition-colors text-[14px]">Financial Tips</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-[16px] font-semibold mb-4 text-[#87CEEB]">Legal</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-[#cccccc] hover:text-white transition-colors text-[14px]">Privacy Policy</a></li>
                <li><a href="#" className="text-[#cccccc] hover:text-white transition-colors text-[14px]">Cookie Policy</a></li>
                <li><a href="#" className="text-[#cccccc] hover:text-white transition-colors text-[14px]">Disclaimer</a></li>
              </ul>
            </div>

            {/* Contact Info */}
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
                <li className="flex items-center gap-3 text-[#cccccc] text-[#cccccc] text-[14px]">
                  <MapPin className="w-5 h-5 text-[#87CEEB] flex-shrink-0" />
                  <span>New Delhi, India</span>
                </li>
              </ul>

              {/* Social Media */}
              <div className="flex gap-4 mt-6">
                <a href="#" className="text-[#cccccc] hover:text-[#87CEEB] transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="text-[#cccccc] hover:text-[#87CEEB] transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a href="#" className="text-[#cccccc] hover:text-[#87CEEB] transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Mobile View - 3 Columns in One Row */}
          <div className="md:hidden grid grid-cols-3 gap-3 mb-6">
            {/* Resources */}
            <div>
              <h4 className="text-[10px] font-semibold mb-2 text-[#87CEEB]">Resources</h4>
              <ul className="space-y-1">
                <li><a href="#" className="text-[#cccccc] hover:text-white transition-colors text-[8px] block">Blog & Articles</a></li>
                <li><a href="#" className="text-[#cccccc] hover:text-white transition-colors text-[8px] block">FAQs</a></li>
                <li><a href="#" className="text-[#cccccc] hover:text-white transition-colors text-[8px] block">Financial Tips</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-[10px] font-semibold mb-2 text-[#87CEEB]">Legal</h4>
              <ul className="space-y-1">
                <li><a href="#" className="text-[#cccccc] hover:text-white transition-colors text-[8px] block">Privacy Policy</a></li>
                <li><a href="#" className="text-[#cccccc] hover:text-white transition-colors text-[8px] block">Cookie Policy</a></li>
                <li><a href="#" className="text-[#cccccc] hover:text-white transition-colors text-[8px] block">Disclaimer</a></li>
              </ul>
            </div>

            {/* Contact Us (without email) */}
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

              {/* Social Media Icons */}
              <div className="flex gap-2 mt-2">
                <a href="#" className="text-[#cccccc] hover:text-[#87CEEB] transition-colors">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="text-[#cccccc] hover:text-[#87CEEB] transition-colors">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a href="#" className="text-[#cccccc] hover:text-[#87CEEB] transition-colors">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-700 pt-4 md:pt-8 text-center">
            <p className="text-[10px] md:text-[14px] text-gray-400">© 2025 KreditScore. All Rights Reserved.</p>
          </div>
        </div>
      </footer>

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
