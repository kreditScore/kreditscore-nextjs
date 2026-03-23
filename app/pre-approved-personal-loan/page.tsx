'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle,
  Shield,
  Clock,
  Zap,
  Phone,
  ArrowRight,
  Lock,
  User,
  Sparkles,
  Gift,
  TrendingUp,
  Award
} from 'lucide-react';
import Header from '@/components/Header';
import CustomCursor from '@/components/CustomCursor';
import Link from 'next/link';

export default function PreApprovedLoanPage() {
  const [mobile, setMobile] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [formStep, setFormStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Form data state
  const [formData, setFormData] = useState({
    panCard: '',
    dob: '',
    companyName: '',
    netSalary: '',
    currentAddress: '',
    currentCity: '',
    currentState: '',
    currentLandmark: '',
    currentPincode: '',
    permanentAddress: '',
    permanentCity: '',
    permanentState: '',
    permanentLandmark: '',
    permanentPincode: '',
    officeAddress: '',
    officeCity: '',
    officeState: '',
    officeLandmark: '',
    officePincode: '',
  });

  // Company names list
  const companies = [
    'TCS (Tata Consultancy Services)',
    'Infosys',
    'Wipro',
    'HCL Technologies',
    'Tech Mahindra',
    'Accenture',
    'Cognizant',
    'Capgemini',
    'IBM India',
    'Microsoft India',
    'Google India',
    'Amazon India',
    'Flipkart',
    'Paytm',
    'HDFC Bank',
    'ICICI Bank',
    'State Bank of India',
    'Axis Bank',
    'Kotak Mahindra Bank',
    'Reliance Industries',
    'Tata Motors',
    'Mahindra & Mahindra',
    'Bharti Airtel',
    'Other'
  ];

  // Indian cities list
  const cities = [
    'Mumbai',
    'Delhi',
    'Bangalore',
    'Hyderabad',
    'Ahmedabad',
    'Chennai',
    'Kolkata',
    'Pune',
    'Jaipur',
    'Surat',
    'Lucknow',
    'Kanpur',
    'Nagpur',
    'Indore',
    'Thane',
    'Bhopal',
    'Visakhapatnam',
    'Pimpri-Chinchwad',
    'Patna',
    'Vadodara',
    'Ghaziabad',
    'Ludhiana',
    'Agra',
    'Nashik',
    'Faridabad',
    'Meerut',
    'Rajkot',
    'Kalyan-Dombivali',
    'Vasai-Virar',
    'Varanasi',
    'Srinagar',
    'Aurangabad',
    'Dhanbad',
    'Amritsar',
    'Navi Mumbai',
    'Allahabad',
    'Ranchi',
    'Howrah',
    'Coimbatore',
    'Jabalpur',
    'Gwalior',
    'Vijayawada',
    'Jodhpur',
    'Madurai',
    'Raipur',
    'Kota',
    'Other'
  ];

  // Indian states list
  const states = [
    'Andhra Pradesh',
    'Arunachal Pradesh',
    'Assam',
    'Bihar',
    'Chhattisgarh',
    'Goa',
    'Gujarat',
    'Haryana',
    'Himachal Pradesh',
    'Jharkhand',
    'Karnataka',
    'Kerala',
    'Madhya Pradesh',
    'Maharashtra',
    'Manipur',
    'Meghalaya',
    'Mizoram',
    'Nagaland',
    'Odisha',
    'Punjab',
    'Rajasthan',
    'Sikkim',
    'Tamil Nadu',
    'Telangana',
    'Tripura',
    'Uttar Pradesh',
    'Uttarakhand',
    'West Bengal',
    'Delhi',
    'Jammu and Kashmir',
    'Ladakh'
  ];

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Auto-fetch and auto-submit OTP
  useEffect(() => {
    if (otpSent && 'OTPCredential' in window) {
      const ac = new AbortController();
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
      return () => ac.abort();
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

  const handleSendOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && mobile.length === 10) {
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
      }, 1000);
    } else {
      alert('Invalid OTP. Please use 1234 for testing.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Handle PIN code - only numbers, max 6 digits
    if (name.includes('Pincode')) {
      const numericValue = value.replace(/\D/g, '').slice(0, 6);
      setFormData(prev => ({
        ...prev,
        [name]: numericValue
      }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsSubmitted(true);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FinancialProduct",
            "name": "Pre-Approved Personal Loan",
            "description": "Get instant pre-approved personal loans up to ₹25 lakh without income documents. No salary slips required, instant approval in minutes.",
            "provider": {
              "@type": "FinancialService",
              "name": "KreditScore",
              "url": "https://kreditscore.com",
              "logo": "https://kreditscore.com/logo.png"
            },
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "INR",
              "availability": "https://schema.org/InStock",
              "validFrom": new Date().toISOString()
            },
            "interestRate": {
              "@type": "QuantitativeValue",
              "value": "10.5",
              "minValue": "10.5",
              "unitText": "percent per year"
            },
            "amount": {
              "@type": "MonetaryAmount",
              "currency": "INR",
              "minValue": "50000",
              "maxValue": "2500000"
            },
            "feesAndCommissionsSpecification": "No processing fees, no hidden charges",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "reviewCount": "1250"
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
                "name": "Pre-Approved Personal Loan",
                "item": "https://kreditscore.com/pre-approved-personal-loan"
              }
            ]
          })
        }}
      />

      <CustomCursor />
      <Header />

      {/* Hero Section */}
      <div className="pt-[100px] pb-8 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 px-6 py-2 rounded-full mb-4">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <span className="text-purple-800 font-semibold text-sm">Starting From 10.5% p.a.</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600">
                Pre-Approved Loan
              </span>
            </h1>

            <div className="space-y-2 mb-6">
              <p className="text-2xl md:text-3xl font-bold text-gray-800">
                No Income Proof Required
              </p>
              <p className="text-xl md:text-2xl font-semibold text-gray-600">
                No Payslip Needed
              </p>
            </div>

            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Get instant loan approval without income documents. Your credit score is your proof!
            </p>
          </motion.div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-[64%_36%] gap-8 items-start max-w-7xl mx-auto">
            {/* Left Side - Feature Cards + Why Pre-Approved Loan */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-4"
            >
              {/* Top 4 Cards in Grid - Moved to Top */}
              <div className="grid grid-cols-4 gap-3">
                <div className="bg-white rounded-xl p-4 shadow-lg border border-purple-100 text-center hover:shadow-xl transition-shadow">
                  <Gift className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-sm font-bold text-gray-800">No Income Proof</p>
                  <p className="text-xs text-gray-600 mt-1">Zero Documents</p>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-lg border border-pink-100 text-center hover:shadow-xl transition-shadow">
                  <Clock className="w-8 h-8 text-pink-600 mx-auto mb-2" />
                  <p className="text-sm font-bold text-gray-800">Instant Approval</p>
                  <p className="text-xs text-gray-600 mt-1">Within Minutes</p>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-lg border border-orange-100 text-center hover:shadow-xl transition-shadow">
                  <TrendingUp className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                  <p className="text-sm font-bold text-gray-800">Up to ₹25 Lakh</p>
                  <p className="text-xs text-gray-600 mt-1">Pre-Approved</p>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-lg border border-green-100 text-center hover:shadow-xl transition-shadow">
                  <Award className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-sm font-bold text-gray-800">Low Interest</p>
                  <p className="text-xs text-gray-600 mt-1">From 10.5% p.a.</p>
                </div>
              </div>

              {/* Why Pre-Approved Loan Card */}
              <div className="bg-white rounded-3xl shadow-xl p-8 border border-purple-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-purple-600" />
                  Why Pre-Approved Loan?
                </h3>

                <div className="space-y-5">
                  <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-md">
                      <CheckCircle className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1 text-base">No Income Documents</h4>
                      <p className="text-sm text-gray-600">No salary slips, no bank statements needed. Your eligibility is pre-verified!</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-pink-50 to-orange-50 rounded-xl">
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-md">
                      <Zap className="w-6 h-6 text-pink-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1 text-base">Lightning Fast</h4>
                      <p className="text-sm text-gray-600">Get approval in minutes, not days. Instant disbursal to your account.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl">
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-md">
                      <Shield className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1 text-base">100% Secure</h4>
                      <p className="text-sm text-gray-600">Bank-grade security with complete data encryption.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-md">
                      <Gift className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1 text-base">Special Benefits</h4>
                      <p className="text-sm text-gray-600">We do not check loan, credit card, home loan EMI bounces in your salary bank statement - only credit report based approval!</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Key Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white rounded-xl p-5 shadow-lg border-2 border-purple-200 text-center">
                  <p className="text-4xl font-bold text-purple-600">₹50K+</p>
                  <p className="text-xs text-gray-600 mt-2 font-semibold">Min Amount</p>
                </div>
                <div className="bg-white rounded-xl p-5 shadow-lg border-2 border-pink-200 text-center">
                  <p className="text-4xl font-bold text-pink-600">7 Yrs</p>
                  <p className="text-xs text-gray-600 mt-2 font-semibold">Max Tenure</p>
                </div>
                <div className="bg-white rounded-xl p-5 shadow-lg border-2 border-orange-200 text-center">
                  <p className="text-4xl font-bold text-orange-600">24 Hrs</p>
                  <p className="text-xs text-gray-600 mt-2 font-semibold">Disbursal</p>
                </div>
              </div>
            </motion.div>

            {/* Right Side - Application Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="bg-gradient-to-br from-white to-purple-50/30 rounded-2xl shadow-2xl p-6 border border-purple-200 relative overflow-hidden">
                {/* Decorative gradient overlay */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-200/20 to-transparent rounded-full -mr-16 -mt-16" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-pink-200/20 to-transparent rounded-full -ml-16 -mb-16" />

                <div className="relative z-10">
                  {!isSubmitted ? (
                    <>
                      {/* Logo */}
                      <div className="text-center mb-6">
                        <motion.div
                          className="relative w-16 h-16 mx-auto mb-4"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.5 }}
                        >
                          <div className="relative w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 rounded-full shadow-lg flex items-center justify-center">
                            <Gift className="w-8 h-8 text-white" strokeWidth={2.5} />
                          </div>
                        </motion.div>

                        <h2 className="text-2xl font-bold mb-2">
                          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                            Get Pre-Approved
                          </span>
                        </h2>
                        <p className="text-sm text-gray-600">
                          Check your offer in 2 minutes
                        </p>
                      </div>

                      {/* Form Steps */}
                      {!otpVerified ? (
                        !otpSent ? (
                          // Mobile & Name Form
                          <form onSubmit={handleSendOTP} className="space-y-4">
                            <div>
                              <label className="block text-xs font-semibold text-gray-700 mb-2">
                                Full Name *
                              </label>
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                  <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                  type="text"
                                  value={name}
                                  onChange={handleNameChange}
                                  placeholder="Enter your full name"
                                  className="block w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                                  required
                                  autoComplete="name"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-xs font-semibold text-gray-700 mb-2">
                                Mobile Number *
                              </label>
                              <div className="relative flex">
                                <div className="flex items-center px-3 bg-gray-100 border-2 border-r-0 border-gray-200 rounded-l-xl">
                                  <span className="text-gray-600 font-semibold text-sm">+91</span>
                                </div>
                                <div className="relative flex-1">
                                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Phone className="h-5 w-5 text-gray-400" />
                                  </div>
                                  <input
                                    type="tel"
                                    value={mobile}
                                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                    placeholder="Enter 10-digit mobile"
                                    className="block w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-r-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                                    maxLength={10}
                                    required
                                    autoComplete="tel"
                                  />
                                </div>
                              </div>
                            </div>

                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              type="submit"
                              disabled={!name.trim() || mobile.length !== 10 || isLoading}
                              className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:from-purple-700 hover:via-pink-700 hover:to-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                            >
                              {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <>
                                  Get OTP
                                  <ArrowRight className="w-5 h-5" />
                                </>
                              )}
                            </motion.button>

                            <p className="text-xs text-gray-500 text-center">
                              By continuing, you agree to our{' '}
                              <Link href="#" className="text-purple-600 hover:underline">
                                Terms
                              </Link>
                            </p>
                          </form>
                        ) : (
                          // OTP Verification Form
                          <form onSubmit={handleVerifyOTP} className="space-y-4">
                            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-3 mb-4">
                              <p className="text-xs text-green-800 text-center font-medium">
                                OTP sent to <span className="font-bold">+91 {mobile}</span>
                              </p>
                            </div>

                            <div>
                              <label className="block text-xs font-semibold text-gray-700 mb-2">
                                Enter OTP
                              </label>
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                  <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                  type="text"
                                  value={otp}
                                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                  placeholder="Enter 4-digit OTP"
                                  className="block w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-center text-2xl tracking-widest font-semibold"
                                  maxLength={4}
                                  required
                                  autoComplete="one-time-code"
                                />
                              </div>
                              <p className="text-xs text-gray-500 mt-2 text-center">
                                {countdown > 0 ? (
                                  `Resend OTP in ${countdown}s`
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => setCountdown(30)}
                                    className="text-purple-600 hover:text-purple-700 font-medium"
                                  >
                                    Resend OTP
                                  </button>
                                )}
                              </p>
                            </div>

                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              type="submit"
                              disabled={otp.length !== 4 || isLoading}
                              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                            >
                              {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <>
                                  Verify & Continue
                                  <ArrowRight className="w-5 h-5" />
                                </>
                              )}
                            </motion.button>

                            <button
                              type="button"
                              onClick={() => {
                                setOtpSent(false);
                                setOtp('');
                                setMobile('');
                              }}
                              className="w-full text-xs text-gray-600 hover:text-gray-800 font-semibold"
                            >
                              Change mobile number
                            </button>
                          </form>
                        )
                      ) : (
                        // Application Form After OTP - 3 Steps
                        <form onSubmit={handleFormSubmit} className="space-y-3">
                          {/* Step Indicator */}
                          <div className="flex items-center justify-center gap-2 mb-4">
                            <div className={`w-2 h-2 rounded-full ${formStep === 1 ? 'bg-purple-600' : 'bg-gray-300'}`} />
                            <div className={`w-2 h-2 rounded-full ${formStep === 2 ? 'bg-purple-600' : 'bg-gray-300'}`} />
                            <div className={`w-2 h-2 rounded-full ${formStep === 3 ? 'bg-purple-600' : 'bg-gray-300'}`} />
                          </div>

                          {formStep === 1 && (
                            <div className="space-y-2.5">
                              <h3 className="text-sm font-bold text-purple-600 mb-3">Personal Details</h3>

                              <div>
                                <label className="block text-[10px] font-semibold text-gray-700 mb-1">PAN Card *</label>
                                <input
                                  type="text"
                                  name="panCard"
                                  value={formData.panCard}
                                  onChange={handleInputChange}
                                  placeholder="ABCDE1234F"
                                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm uppercase"
                                  maxLength={10}
                                  required
                                  autoComplete="off"
                                />
                              </div>

                              <div>
                                <label className="block text-[10px] font-semibold text-gray-700 mb-1">Date of Birth (DD/MM/YYYY) *</label>
                                <input
                                  type="text"
                                  name="dob"
                                  value={formData.dob}
                                  onChange={handleDateChange}
                                  placeholder="DD/MM/YYYY"
                                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                                  maxLength={10}
                                  required
                                  autoComplete="off"
                                />
                              </div>

                              <div>
                                <label className="block text-[10px] font-semibold text-gray-700 mb-1">Company Name *</label>
                                <input
                                  type="text"
                                  name="companyName"
                                  value={formData.companyName}
                                  onChange={handleInputChange}
                                  placeholder="Type company name"
                                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                                  required
                                  autoComplete="off"
                                  list="company-suggestions"
                                />
                                <datalist id="company-suggestions">
                                  {companies.map((company) => (
                                    <option key={company} value={company} />
                                  ))}
                                </datalist>
                              </div>

                              <div>
                                <label className="block text-[10px] font-semibold text-gray-700 mb-1">Net Take Home Salary *</label>
                                <input
                                  type="text"
                                  name="netSalary"
                                  value={formData.netSalary}
                                  onChange={handleInputChange}
                                  placeholder="₹ Monthly salary"
                                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                                  required
                                  autoComplete="off"
                                />
                              </div>

                              <button
                                type="button"
                                onClick={() => setFormStep(2)}
                                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2.5 rounded-lg font-semibold text-sm hover:from-purple-700 hover:to-pink-700 transition-colors mt-2"
                              >
                                Next Step
                              </button>
                            </div>
                          )}

                          {formStep === 2 && (
                            <div className="space-y-2.5">
                              <h3 className="text-sm font-bold text-pink-600 mb-3">Current Address</h3>

                              <div>
                                <label className="block text-[10px] font-semibold text-gray-700 mb-1">Where You Living Currently *</label>
                                <input
                                  type="text"
                                  name="currentAddress"
                                  value={formData.currentAddress}
                                  onChange={handleInputChange}
                                  placeholder="Complete address"
                                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-sm"
                                  required
                                  autoComplete="street-address"
                                />
                              </div>

                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="block text-[10px] font-semibold text-gray-700 mb-1">City *</label>
                                  <input
                                    type="text"
                                    name="currentCity"
                                    value={formData.currentCity}
                                    onChange={handleInputChange}
                                    placeholder="Type city"
                                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-sm"
                                    required
                                    autoComplete="off"
                                    list="city-suggestions"
                                  />
                                  <datalist id="city-suggestions">
                                    {cities.map((city) => (
                                      <option key={city} value={city} />
                                    ))}
                                  </datalist>
                                </div>

                                <div>
                                  <label className="block text-[10px] font-semibold text-gray-700 mb-1">State *</label>
                                  <input
                                    type="text"
                                    name="currentState"
                                    value={formData.currentState}
                                    onChange={handleInputChange}
                                    placeholder="Type state"
                                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-sm"
                                    required
                                    autoComplete="off"
                                    list="state-suggestions"
                                  />
                                  <datalist id="state-suggestions">
                                    {states.map((state) => (
                                      <option key={state} value={state} />
                                    ))}
                                  </datalist>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="block text-[10px] font-semibold text-gray-700 mb-1">Landmark *</label>
                                  <input
                                    type="text"
                                    name="currentLandmark"
                                    value={formData.currentLandmark}
                                    onChange={handleInputChange}
                                    placeholder="Nearby landmark"
                                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-sm"
                                    required
                                    autoComplete="off"
                                  />
                                </div>

                                <div>
                                  <label className="block text-[10px] font-semibold text-gray-700 mb-1">PIN Code *</label>
                                  <input
                                    type="text"
                                    name="currentPincode"
                                    value={formData.currentPincode}
                                    onChange={handleInputChange}
                                    placeholder="6-digit PIN"
                                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-sm"
                                    maxLength={6}
                                    required
                                    autoComplete="off"
                                  />
                                </div>
                              </div>

                              <h3 className="text-sm font-bold text-green-600 mt-4 mb-2">Permanent Address</h3>

                              <div>
                                <label className="block text-[10px] font-semibold text-gray-700 mb-1">Permanent Address *</label>
                                <input
                                  type="text"
                                  name="permanentAddress"
                                  value={formData.permanentAddress}
                                  onChange={handleInputChange}
                                  placeholder="If current is rented"
                                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                                  required
                                  autoComplete="off"
                                />
                              </div>

                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="block text-[10px] font-semibold text-gray-700 mb-1">City *</label>
                                  <input
                                    type="text"
                                    name="permanentCity"
                                    value={formData.permanentCity}
                                    onChange={handleInputChange}
                                    placeholder="Type city"
                                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                                    required
                                    autoComplete="off"
                                    list="perm-city-suggestions"
                                  />
                                  <datalist id="perm-city-suggestions">
                                    {cities.map((city) => (
                                      <option key={city} value={city} />
                                    ))}
                                  </datalist>
                                </div>

                                <div>
                                  <label className="block text-[10px] font-semibold text-gray-700 mb-1">State *</label>
                                  <input
                                    type="text"
                                    name="permanentState"
                                    value={formData.permanentState}
                                    onChange={handleInputChange}
                                    placeholder="Type state"
                                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                                    required
                                    autoComplete="off"
                                    list="perm-state-suggestions"
                                  />
                                  <datalist id="perm-state-suggestions">
                                    {states.map((state) => (
                                      <option key={state} value={state} />
                                    ))}
                                  </datalist>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="block text-[10px] font-semibold text-gray-700 mb-1">Landmark *</label>
                                  <input
                                    type="text"
                                    name="permanentLandmark"
                                    value={formData.permanentLandmark}
                                    onChange={handleInputChange}
                                    placeholder="Nearby landmark"
                                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                                    required
                                    autoComplete="off"
                                  />
                                </div>

                                <div>
                                  <label className="block text-[10px] font-semibold text-gray-700 mb-1">PIN Code *</label>
                                  <input
                                    type="text"
                                    name="permanentPincode"
                                    value={formData.permanentPincode}
                                    onChange={handleInputChange}
                                    placeholder="6-digit PIN"
                                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                                    maxLength={6}
                                    required
                                    autoComplete="off"
                                  />
                                </div>
                              </div>

                              <div className="flex gap-2 mt-4">
                                <button
                                  type="button"
                                  onClick={() => setFormStep(1)}
                                  className="flex-1 bg-gray-200 text-gray-700 py-2.5 rounded-lg font-semibold text-sm hover:bg-gray-300 transition-colors"
                                >
                                  Back
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setFormStep(3)}
                                  className="flex-1 bg-gradient-to-r from-pink-600 to-green-600 text-white py-2.5 rounded-lg font-semibold text-sm hover:from-pink-700 hover:to-green-700 transition-colors"
                                >
                                  Next Step
                                </button>
                              </div>
                            </div>
                          )}

                          {formStep === 3 && (
                            <div className="space-y-2.5">
                              <h3 className="text-sm font-bold text-orange-600 mb-3">Office Address</h3>

                              <div>
                                <label className="block text-[10px] font-semibold text-gray-700 mb-1">Office Address *</label>
                                <input
                                  type="text"
                                  name="officeAddress"
                                  value={formData.officeAddress}
                                  onChange={handleInputChange}
                                  placeholder="Complete office address"
                                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                                  required
                                  autoComplete="off"
                                />
                              </div>

                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="block text-[10px] font-semibold text-gray-700 mb-1">City *</label>
                                  <input
                                    type="text"
                                    name="officeCity"
                                    value={formData.officeCity}
                                    onChange={handleInputChange}
                                    placeholder="Type city"
                                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                                    required
                                    autoComplete="off"
                                    list="office-city-suggestions"
                                  />
                                  <datalist id="office-city-suggestions">
                                    {cities.map((city) => (
                                      <option key={city} value={city} />
                                    ))}
                                  </datalist>
                                </div>

                                <div>
                                  <label className="block text-[10px] font-semibold text-gray-700 mb-1">State *</label>
                                  <input
                                    type="text"
                                    name="officeState"
                                    value={formData.officeState}
                                    onChange={handleInputChange}
                                    placeholder="Type state"
                                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                                    required
                                    autoComplete="off"
                                    list="office-state-suggestions"
                                  />
                                  <datalist id="office-state-suggestions">
                                    {states.map((state) => (
                                      <option key={state} value={state} />
                                    ))}
                                  </datalist>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="block text-[10px] font-semibold text-gray-700 mb-1">Landmark *</label>
                                  <input
                                    type="text"
                                    name="officeLandmark"
                                    value={formData.officeLandmark}
                                    onChange={handleInputChange}
                                    placeholder="Nearby landmark"
                                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                                    required
                                    autoComplete="off"
                                  />
                                </div>

                                <div>
                                  <label className="block text-[10px] font-semibold text-gray-700 mb-1">PIN Code *</label>
                                  <input
                                    type="text"
                                    name="officePincode"
                                    value={formData.officePincode}
                                    onChange={handleInputChange}
                                    placeholder="6-digit PIN"
                                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                                    maxLength={6}
                                    required
                                    autoComplete="off"
                                  />
                                </div>
                              </div>

                              <div className="flex gap-2 mt-4">
                                <button
                                  type="button"
                                  onClick={() => setFormStep(2)}
                                  className="flex-1 bg-gray-200 text-gray-700 py-2.5 rounded-lg font-semibold text-sm hover:bg-gray-300 transition-colors"
                                >
                                  Back
                                </button>
                                <button
                                  type="submit"
                                  disabled={isLoading}
                                  className="flex-1 bg-gradient-to-r from-green-600 to-purple-600 text-white py-2.5 rounded-lg font-semibold text-sm hover:from-green-700 hover:to-purple-700 transition-all disabled:opacity-50"
                                >
                                  {isLoading ? (
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
                                  ) : (
                                    'Submit'
                                  )}
                                </button>
                              </div>
                            </div>
                          )}
                        </form>
                      )}
                    </>
                  ) : (
                    // Success Message
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-center py-8"
                    >
                      <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-12 h-12 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-3">
                        Application Submitted!
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Your pre-approved loan application has been received. Our team will verify and approve within 24 hours.
                      </p>
                      <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4 mb-6">
                        <p className="text-sm text-purple-800 font-semibold">
                          Application ID: PA{Math.random().toString(36).substr(2, 9).toUpperCase()}
                        </p>
                      </div>
                      <Link
                        href="/"
                        className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
                      >
                        Back to Home
                      </Link>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-6 text-center mt-12">
        <p className="text-sm">© 2024 KreditScore. All rights reserved.</p>
      </footer>
    </div>
  );
}
