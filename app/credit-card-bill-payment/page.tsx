'use client';

import { useState, useEffect, useId } from 'react';
import { toast } from 'sonner';
import { useFirebasePhoneAuth } from '@/hooks/useFirebasePhoneAuth';
import { submitLoanApplication } from '@/lib/submitApplication';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, ArrowRight, Check, CheckCircle, Shield, Zap, TrendingUp, TrendingDown, AlertTriangle, Award, FileText, Users, BadgeCheck, Sparkles, CreditCard, Calculator, Building2, Home, MapPin, Wallet, PartyPopper, Star } from 'lucide-react';
import Header from '@/components/Header';
import CustomCursor from '@/components/CustomCursor';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SITE_URL } from '@/lib/site';

export default function CreditCardBillPaymentPage() {
  const router = useRouter();
  const recaptchaSuffix = useId().replace(/[^a-zA-Z0-9]/g, '');
  const recaptchaContainerId = `fb-rc-${recaptchaSuffix}`;
  const { sendOtp, verifyOtp } = useFirebasePhoneAuth(recaptchaContainerId);

  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [idToken, setIdToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [formStep, setFormStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Show/hide dropdown states
  const [showCompanySuggestions, setShowCompanySuggestions] = useState(false);
  const [showCurrentCitySuggestions, setShowCurrentCitySuggestions] = useState(false);

  // Calculator States
  const [calcAmount, setCalcAmount] = useState(500000);
  const [calcPlRate, setCalcPlRate] = useState(10.25);
  const [calcTenure, setCalcTenure] = useState(3);

  // Math
  const ccRate = 45;
  const ccMonthlyInterest = Math.round(calcAmount * (ccRate / 100) / 12);
  const plMonthlyInterest = Math.round(calcAmount * (calcPlRate / 100) / 12);
  const monthlySavings = ccMonthlyInterest - plMonthlyInterest;
  const annualSavings = monthlySavings * 12;

  // Form data state
  const [formData, setFormData] = useState({
    panCard: '',
    dob: '',
    emailId: '',
    netSalary: '',
    requiredLoanAmount: '',
    currentCity: '',
    companyName: '',
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
    'Zomato',
    'Swiggy',
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

  // Filtered dropdown lists
  const filteredCompanies = formData.companyName
    ? companies.filter(company => company.toLowerCase().includes(formData.companyName.toLowerCase())).slice(0, 4)
    : [];

  const filteredCurrentCities = formData.currentCity
    ? cities.filter(city => city.toLowerCase().startsWith(formData.currentCity.toLowerCase())).slice(0, 4)
    : [];

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // WebOTP API for Auto-fetching SMS
  useEffect(() => {
    if (otpSent && !otpVerified && 'OTPCredential' in window) {
      const ac = new AbortController();
      navigator.credentials.get({
        // @ts-ignore - OTP is valid in some browsers
        otp: { transport: ['sms'] },
        signal: ac.signal
      }).then((otp: any) => {
        if (otp && otp.code) {
          setOtp(otp.code);
        }
      }).catch(err => {
        console.log("WebOTP Error:", err);
      });
      return () => ac.abort();
    }
  }, [otpSent, otpVerified]);

  // Capitalize name input
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const capitalizedValue = value
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
    setName(capitalizedValue);
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || mobile.length !== 10) return;
    setIsLoading(true);
    const ok = await sendOtp(`+91${mobile}`);
    if (ok) {
      setOtpSent(true);
      setCountdown(60);
    }
    setIsLoading(false);
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) return;
    setIsLoading(true);
    const token = await verifyOtp(otp);
    
    if (token) {
      setIdToken(token);
      try {
        const res = await fetch("/api/applications/latest", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.found && data.payload?.formData) {
          if (data.displayName) setName(data.displayName);
          setFormData(prev => ({
            ...prev,
            ...data.payload.formData
          }));
        }
      } catch (err) {
        console.error("Auto-fetch error", err);
      }
      setOtpVerified(true);
    }
    setIsLoading(false);
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    const ok = await sendOtp(`+91${mobile}`);
    if (ok) setCountdown(60);
    setIsLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Show/hide dropdowns based on input
    if (name === 'companyName') {
      setShowCompanySuggestions(value.length > 0);
    }
    if (name === 'currentCity') {
      setShowCurrentCitySuggestions(value.length > 0);
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Selection handlers
  const handleCompanySelect = (company: string) => {
    setFormData(prev => ({ ...prev, companyName: company }));
    setShowCompanySuggestions(false);
  };

  const handleCurrentCitySelect = (city: string) => {
    setFormData(prev => ({ ...prev, currentCity: city }));
    setShowCurrentCitySuggestions(false);
  };

  // Date validation function - DD/MM/YYYY format with age 18-100
  const validateAge = (dateString: string) => {
    if (!dateString) return true; // Allow empty for initial render

    const parts = dateString.split('/');
    if (parts.length !== 3) return false;

    const day = parseInt(parts[0]);
    const month = parseInt(parts[1]) - 1; // Month is 0-indexed
    const year = parseInt(parts[2]);

    const birthDate = new Date(year, month, day);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age >= 18 && age <= 100;
  };

  // Handle date input with DD/MM/YYYY format
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove non-digits

    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2);
    }
    if (value.length >= 5) {
      value = value.slice(0, 5) + '/' + value.slice(5, 9);
    }

    setFormData(prev => ({ ...prev, dob: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateAge(formData.dob)) {
      toast.error(
        'Age must be between 18 and 100 years. Please check your date of birth.'
      );
      return;
    }

    if (!idToken) {
      toast.error('Please verify your mobile number again.');
      return;
    }

    setIsLoading(true);
    try {
      await submitLoanApplication(idToken, {
        source: 'credit-card-bill-payment',
        displayName: name,
        payload: { mobile: `+91${mobile}`, formData },
      });
      toast.success('Application submitted successfully');
      setIsSubmitted(true);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Submission failed');
    } finally {
      setIsLoading(false);
    }
  };

  // 3D Card Animation Variants
  const cardVariants = {
    hidden: { opacity: 0, y: 50, rotateX: -15 },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const floatingAnimation = {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      <div id={recaptchaContainerId} className="hidden" aria-hidden="true" />
      {/* Structured Data for SEO - Financial Product */}
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
              "url": SITE_URL,
              "logo": `${SITE_URL}/logo.png`,
              "sameAs": [
                "https://www.facebook.com/kreditscore",
                "https://twitter.com/kreditscore",
                "https://www.linkedin.com/company/kreditscore"
              ]
            },
            "category": "Personal Loan",
            "feesAndCommissionsSpecification": "Processing fees may apply. Zero foreclosure charges applicable.",
            "interestRate": {
              "@type": "QuantitativeValue",
              "minValue": "10.5",
              "maxValue": "24.0",
              "unitText": "Percent per annum"
            },
            "amount": {
              "@type": "MonetaryAmount",
              "currency": "INR",
              "minValue": "50000",
              "maxValue": "2500000"
            },
            "loanTerm": {
              "@type": "QuantitativeValue",
              "minValue": "12",
              "maxValue": "96",
              "unitText": "Months"
            },
            "offers": {
              "@type": "Offer",
              "url": `${SITE_URL}/pre-approved-personal-loan`,
              "priceCurrency": "INR",
              "availability": "https://schema.org/InStock",
              "validFrom": "2024-01-01"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.7",
              "ratingCount": "2847",
              "bestRating": "5"
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
                "item": SITE_URL
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Loans",
                "item": `${SITE_URL}/#loans`
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": "Pre-Approved Personal Loan",
                "item": `${SITE_URL}/pre-approved-personal-loan`
              }
            ]
          })
        }}
      />

      <CustomCursor />
      <Header />

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.03, 0.08, 0.03]
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-20 right-20 w-96 h-96 bg-blue-500 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
            opacity: [0.03, 0.08, 0.03]
          }}
          transition={{ duration: 25, repeat: Infinity }}
          className="absolute bottom-20 left-20 w-96 h-96 bg-orange-400 rounded-full blur-3xl"
        />
      </div>

      <div className="pt-[100px] md:pt-[120px] pb-[60px] md:pb-[80px] px-3 md:px-4 relative z-10">
        <div className="max-w-[1400px] mx-auto">

          {/* Hero Section with Login Form */}
          <div className="grid lg:grid-cols-[2fr_0.7fr] gap-6 md:gap-8 mb-8 md:mb-12">
            {/* Left - Hero Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col justify-center"
            >
              <motion.div
                animate={floatingAnimation}
                className="inline-flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-[#d82c23] to-[#e43a15] text-white px-4 py-2 sm:px-6 sm:py-2.5 md:px-8 md:py-3 rounded-full text-xs sm:text-base md:text-lg font-extrabold mb-6 sm:mb-8 md:mb-10 shadow-lg w-fit -mt-4 sm:-mt-6"
              >
                <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                <span className="whitespace-nowrap tracking-wider">Pay your Credit Card Outstanding</span>
              </motion.div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-5xl font-extrabold mb-1 sm:mb-2 leading-tight">
                <span className="text-[#159a49]">Get Freedom from</span> <span className="text-[#d82c23]">Credit Card Debt!</span>
              </h1>
              <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-700 mb-4 sm:mb-6 md:mb-8 font-medium">
                Convert Your Credit Card Bill to <span className="font-extrabold text-[#159a49]">Personal Loan in 24 hours</span>
              </p>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3 md:gap-4 mt-6 max-w-full">
                <div className="bg-white rounded-lg sm:rounded-xl md:rounded-2xl p-2 sm:p-3 md:p-4 shadow-lg border border-gray-100 flex flex-col justify-center">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 text-red-600 mb-0.5 sm:mb-1 md:mb-2" />
                  <p className="text-xs sm:text-sm md:text-base lg:text-lg font-bold text-gray-900 leading-tight">45%</p>
                  <p className="text-[9px] sm:text-[10px] md:text-xs text-gray-600">Credit Card Interest</p>
                </div>
                <div className="bg-white rounded-lg sm:rounded-xl md:rounded-2xl p-2 sm:p-3 md:p-4 shadow-lg border border-gray-100 flex flex-col justify-center">
                  <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 text-[#159a49] mb-0.5 sm:mb-1 md:mb-2" />
                  <p className="text-xs sm:text-sm md:text-base lg:text-lg font-bold text-gray-900 leading-tight">10.25%*</p>
                  <p className="text-[9px] sm:text-[10px] md:text-xs text-gray-600">Personal Loan Interest</p>
                </div>
                <div className="bg-white rounded-lg sm:rounded-xl md:rounded-2xl p-2 sm:p-3 md:p-4 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border-[1.5px] border-green-200 flex flex-col justify-center transform hover:-translate-y-1 transition-transform">
                  <Zap className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 text-[#159a49] mb-0.5 sm:mb-1 md:mb-2" />
                  <p className="text-xs sm:text-sm md:text-base lg:text-lg font-black text-[#159a49] leading-tight">35%+</p>
                  <p className="text-[9px] sm:text-[10px] md:text-xs text-gray-600">Interest Saved!</p>
                </div>
              </div>
            </motion.div>

            {/* Right - Login/Application Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-3 sm:p-4 md:p-5 lg:p-6 border border-gray-100 relative overflow-hidden max-h-[600px] overflow-y-auto">
                {/* Decorative gradient */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-blue-500/5 to-transparent rounded-full -mr-24 -mt-24" />

                <div className="relative z-10">
                  {!isSubmitted ? (
                    <>
                      <div className="text-center mb-3 sm:mb-4 md:mb-5 lg:mb-6">
                        {/* Simple Clean Logo */}
                        <motion.div
                          className="relative w-14 h-10 sm:w-16 sm:h-12 md:w-20 md:h-14 lg:w-24 lg:h-16 mx-auto mb-2 sm:mb-3 md:mb-4"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.5 }}
                        >
                          <motion.div
                            whileHover={{ scale: 1.1, rotate: 0 }}
                            className="relative w-full h-full bg-gradient-to-br from-[#d82c23] to-red-400 rounded-lg sm:rounded-xl shadow-lg flex items-center justify-center transform -rotate-6"
                          >
                            <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-white" strokeWidth={2.5} />
                          </motion.div>
                        </motion.div>

                        <motion.h2
                          className="text-base sm:text-lg md:text-xl lg:text-2xl font-black mb-1 md:mb-2 leading-tight whitespace-nowrap"
                          initial={{ opacity: 0, y: -20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          <span className="text-[#d82c23] tracking-tight">Get Relief </span>
                          <span className="text-[#159a49] tracking-tight">Now!</span>
                        </motion.h2>
                        <motion.p
                          className="text-[8px] sm:text-[9px] md:text-[10px] text-gray-600 font-medium leading-tight whitespace-nowrap"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                        >
                          ✨ Instant • 🔒 Secure • 📱 Digital Process
                        </motion.p>
                      </div>

                      <AnimatePresence mode="wait">
                        {!otpSent ? (
                          /* Mobile Number Form */
                          <motion.form
                            key="mobile-form"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            onSubmit={handleSendOTP}
                            className="space-y-2.5 sm:space-y-3 md:space-y-4"
                          >
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.1 }}
                            >
                              <label className="block text-[10px] sm:text-xs font-semibold text-gray-700 mb-1.5 sm:mb-2">
                                Full Name *
                              </label>
                              <input
                                type="text"
                                value={name}
                                onChange={handleNameChange}
                                placeholder="Enter your full name"
                                className="block w-full px-2.5 py-2 sm:px-3 sm:py-2.5 md:px-4 md:py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-sm sm:text-base font-medium hover:border-gray-300"
                                required
                                autoComplete="name"
                                name="name"
                                id="name"
                              />
                            </motion.div>

                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.2 }}
                            >
                              <label className="block text-[10px] sm:text-xs font-semibold text-gray-700 mb-1.5 sm:mb-2">
                                Mobile Number *
                              </label>
                              <div className="relative flex gap-1.5 sm:gap-2">
                                <div className="flex items-center px-2 py-2 sm:px-2.5 sm:py-2.5 md:px-3 md:py-3 border-2 border-gray-200 rounded-lg bg-gray-50 font-semibold text-gray-700 text-xs sm:text-sm">
                                  <Phone className="h-3 w-3 sm:h-4 sm:w-4 mr-0.5 sm:mr-1 text-gray-500" />
                                  +91
                                </div>
                                <input
                                  type="tel"
                                  value={mobile}
                                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                  placeholder="10-digit mobile"
                                  className="block flex-1 px-2.5 py-2 sm:px-3 sm:py-2.5 md:px-4 md:py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-sm sm:text-base font-medium hover:border-gray-300"
                                  maxLength={10}
                                  required
                                  autoComplete="tel"
                                  name="mobile"
                                  id="mobile"
                                />
                              </div>
                            </motion.div>

                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              type="submit"
                              disabled={!name.trim() || mobile.length !== 10 || isLoading}
                              className="w-full bg-gradient-to-br from-orange-500 via-orange-600 to-red-500 text-white py-2.5 sm:py-3 md:py-4 rounded-lg sm:rounded-xl font-bold text-sm sm:text-base md:text-lg flex items-center justify-center gap-1.5 sm:gap-2 hover:from-orange-600 hover:to-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                            >
                              {isLoading ? (
                                <div className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <>
                                  Get OTP
                                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                                </>
                              )}
                            </motion.button>

                            <p className="text-[10px] text-gray-500 text-center leading-snug">
                              By continuing, you agree to our{' '}
                              <Link href="#" className="text-orange-600 hover:underline font-medium">
                                Terms
                              </Link>
                              {' '}and{' '}
                              <Link href="#" className="text-orange-600 hover:underline font-medium">
                                Privacy
                              </Link>
                            </p>
                          </motion.form>
                        ) : !otpVerified ? (
                          /* OTP Verification Form */
                          <motion.form
                            key="otp-form"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            onSubmit={handleVerifyOTP}
                            className="space-y-2.5 sm:space-y-3 md:space-y-4"
                          >
                            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-2 sm:p-2.5 md:p-3">
                              <p className="text-[10px] sm:text-xs text-green-800 text-center font-medium">
                                OTP sent to <span className="font-bold">+91 {mobile}</span>
                              </p>
                            </div>

                            <div>
                              <label className="block text-[10px] sm:text-xs font-semibold text-gray-700 mb-1.5 sm:mb-2">
                                Enter OTP
                              </label>
                              <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                placeholder="0 0 0 0 0 0"
                                className="block w-full px-2 py-2 sm:px-2.5 sm:py-2.5 md:px-3 md:py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-center text-xl sm:text-2xl md:text-3xl tracking-[0.3em] sm:tracking-[0.4em] md:tracking-[0.5em] font-bold"
                                maxLength={6}
                                required
                                autoComplete="one-time-code"
                                name="otp"
                                id="otp"
                              />
                              <p className="text-[10px] text-gray-500 mt-2 text-center">
                                {countdown > 0 ? (
                                  <span>Resend in <span className="font-semibold text-blue-600">{countdown}s</span></span>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={handleResendOtp}
                                    disabled={isLoading}
                                    className="text-blue-600 hover:text-blue-700 font-semibold hover:underline disabled:opacity-50"
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
                              disabled={otp.length !== 6 || isLoading}
                              className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-2.5 sm:py-3 rounded-lg font-semibold text-sm sm:text-base flex items-center justify-center gap-1.5 sm:gap-2 hover:from-green-700 hover:to-green-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
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

                            <button
                              type="button"
                              onClick={() => {
                                setOtpSent(false);
                                setOtpVerified(false);
                                setIdToken(null);
                                setOtp('');
                                setMobile('');
                              }}
                              className="w-full text-[10px] sm:text-xs text-gray-600 hover:text-gray-800 font-semibold hover:underline"
                            >
                              Change mobile number
                            </button>
                          </motion.form>
                        ) : (
                          /* Multi-step Application Form After OTP Verification */
                          <motion.div
                            key="application-form"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                          >
                            <form onSubmit={handleFormSubmit} className="space-y-4 pt-2">
                              <h3 className="text-sm font-bold text-blue-600 mb-3">Quick Application</h3>

                              {/* Row 1: PAN & DOB */}
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-[10px] font-semibold text-gray-700 mb-1">PAN Card *</label>
                                  <input
                                    type="text"
                                    name="panCard"
                                    value={formData.panCard}
                                    onChange={handleInputChange}
                                    placeholder="ABCDE1234F"
                                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm uppercase"
                                    maxLength={10}
                                    required
                                    autoComplete="off"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[10px] font-semibold text-gray-700 mb-1">Date of Birth *</label>
                                  <input
                                    type="text"
                                    name="dob"
                                    value={formData.dob}
                                    onChange={handleDateChange}
                                    placeholder="DD/MM/YYYY"
                                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                    maxLength={10}
                                    required
                                    autoComplete="off"
                                  />
                                  {formData.dob && !validateAge(formData.dob) && formData.dob.length === 10 && (
                                    <p className="text-[9px] text-red-600 mt-1">Age must be between 18 and 100 years</p>
                                  )}
                                </div>
                              </div>

                              {/* Row 2: Email | Salary */}
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-[10px] font-semibold text-gray-700 mb-1">Email ID (Optional)</label>
                                  <input
                                    type="email"
                                    name="emailId"
                                    value={formData.emailId}
                                    onChange={handleInputChange}
                                    placeholder="your@email.com"
                                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                    autoComplete="email"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[10px] font-semibold text-gray-700 mb-1">Monthly Salary *</label>
                                  <input
                                    type="number"
                                    name="netSalary"
                                    value={formData.netSalary}
                                    onChange={handleInputChange}
                                    placeholder="₹"
                                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                    required
                                    autoComplete="off"
                                  />
                                </div>
                              </div>

                              {/* Row 3: Loan Amount | Current City */}
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-[10px] font-semibold text-gray-700 mb-1">Required Loan *</label>
                                  <input
                                    type="number"
                                    name="requiredLoanAmount"
                                    value={formData.requiredLoanAmount}
                                    onChange={handleInputChange}
                                    placeholder="₹"
                                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                    required
                                    autoComplete="off"
                                  />
                                </div>
                                <div className="relative">
                                  <label className="block text-[10px] font-semibold text-gray-700 mb-1">Current City *</label>
                                  <input
                                    type="text"
                                    name="currentCity"
                                    value={formData.currentCity}
                                    onChange={handleInputChange}
                                    onFocus={() => formData.currentCity.length > 0 && setShowCurrentCitySuggestions(true)}
                                    placeholder="Type city"
                                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                    required
                                    autoComplete="off"
                                  />
                                  {showCurrentCitySuggestions && filteredCurrentCities.length > 0 && (
                                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                      {filteredCurrentCities.map((city, index) => (
                                        <div
                                          key={index}
                                          onClick={() => handleCurrentCitySelect(city)}
                                          className="px-3 py-2 text-sm text-gray-800 hover:bg-gradient-to-r hover:from-[#FF8C00]/10 hover:to-[#87CEEB]/10 cursor-pointer transition-colors"
                                        >
                                          {city}
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Row 4: Company Name */}
                              <div className="relative">
                                <label className="block text-[10px] font-semibold text-gray-700 mb-1">Company Name *</label>
                                <input
                                  type="text"
                                  name="companyName"
                                  value={formData.companyName}
                                  onChange={handleInputChange}
                                  onFocus={() => formData.companyName.length > 0 && setShowCompanySuggestions(true)}
                                  placeholder="Where you are working"
                                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                  required
                                  autoComplete="off"
                                />
                                {showCompanySuggestions && filteredCompanies.length > 0 && (
                                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                    {filteredCompanies.map((company, index) => (
                                      <div
                                        key={index}
                                        onClick={() => handleCompanySelect(company)}
                                        className="px-3 py-2 text-sm text-gray-800 hover:bg-gradient-to-r hover:from-[#FF8C00]/10 hover:to-[#87CEEB]/10 cursor-pointer transition-colors"
                                      >
                                        {company}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>

                              <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 mt-4 rounded-xl font-bold text-sm hover:from-green-700 hover:to-blue-700 transition-all disabled:opacity-50 shadow-lg"
                              >
                                {isLoading ? (
                                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
                                ) : (
                                  'Submit Application'
                                )}
                              </button>
                            </form>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    /* Thank You Success Animation */
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8, rotateY: -180 }}
                      animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                      transition={{ duration: 0.8, type: "spring" }}
                      className="text-center py-8"
                    >
                      <motion.div
                        animate={{
                          scale: [1, 1.2, 1],
                          rotate: [0, 360, 0]
                        }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                        className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center shadow-2xl"
                      >
                        <PartyPopper className="w-12 h-12 text-white" />
                      </motion.div>

                      <motion.h3
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-2xl font-bold mb-3 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent"
                      >
                        Thank You!
                      </motion.h3>

                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-sm text-gray-600 mb-6"
                      >
                        Your loan application has been submitted successfully!
                        <br />
                        We'll contact you within 24-48 hours.
                      </motion.p>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="space-y-3"
                      >
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg"
                        >
                          <p className="text-xs font-semibold text-blue-600">Application ID</p>
                          <p className="text-lg font-bold text-gray-800">KS{Math.floor(Math.random() * 1000000)}</p>
                        </motion.div>

                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => router.push('/')}
                          className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-3 rounded-lg font-semibold text-sm hover:from-orange-600 hover:to-pink-600 transition-all shadow-lg"
                        >
                          Back to Home
                        </motion.button>
                      </motion.div>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Calculator Section (Grid Layout Matching Screenshot) */}
          <div className="mb-8 md:mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 xl:gap-8 max-w-[1400px] mx-auto px-2 lg:px-4">

                {/* Box 1: Inputs */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl sm:rounded-3xl p-5 lg:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col items-center justify-center text-center w-full h-full"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-50/50 text-blue-500 rounded-xl flex items-center justify-center mb-4">
                    <Calculator className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-1">
                    Calculate Your <span className="text-[#159a49]">SAVINGS!</span>
                  </h2>
                  <p className="text-[10px] sm:text-xs text-gray-500 mb-5 lg:mb-6 font-medium">
                    See how much you can save monthly
                  </p>
                  
                  <div className="w-full space-y-5 lg:space-y-6">
                    {/* Slider 1: Amount */}
                    <div className="w-full">
                      <div className="flex justify-between items-end mb-3">
                        <p className="text-xs font-bold text-gray-600">Credit Card Outstanding</p>
                        <p className="text-base sm:text-lg font-black text-[#1e293b]">₹{new Intl.NumberFormat('en-IN').format(calcAmount)}</p>
                      </div>
                      <input 
                        type="range" 
                        min="10000" 
                        max="2000000" 
                        step="10000" 
                        value={calcAmount} 
                        onChange={(e)=>setCalcAmount(Number(e.target.value))}
                        className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        style={{ background: 'linear-gradient(to right, #fed7aa, #bbf7d0)' }}
                      />
                      <div className="flex justify-between text-[9px] sm:text-[10px] font-bold text-gray-400 mt-2.5">
                        <span>₹10,000</span>
                        <span>₹20,00,000</span>
                      </div>
                    </div>

                    {/* Slider 2: ROI */}
                    <div className="w-full">
                      <div className="flex justify-between items-end mb-3">
                        <p className="text-xs font-bold text-gray-600">Personal Loan ROI</p>
                        <p className="text-base sm:text-lg font-black text-[#159a49]">{calcPlRate}% p.a.</p>
                      </div>
                      <input 
                        type="range" 
                        min="9" 
                        max="21" 
                        step="0.25" 
                        value={calcPlRate} 
                        onChange={(e)=>setCalcPlRate(Number(e.target.value))}
                        className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        style={{ background: 'linear-gradient(to right, #fed7aa, #bbf7d0)' }}
                      />
                      <div className="flex justify-between text-[9px] sm:text-[10px] font-bold text-gray-400 mt-2.5">
                        <span>9%</span>
                        <span>21%</span>
                      </div>
                    </div>


                  </div>
                </motion.div>

                {/* Box 2: Results Match Screenshot exactly */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white rounded-2xl sm:rounded-3xl p-5 lg:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col justify-center w-full h-full text-sm"
                >
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    {/* Left Box Red */}
                    <div className="bg-[#fffafa] rounded-2xl p-4 sm:p-5 border-[1.5px] border-red-100">
                      <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-red-500 mb-3" />
                      <p className="text-[10px] sm:text-xs font-bold text-gray-400 mb-1">Credit Card</p>
                      <p className="text-base sm:text-lg font-black text-red-500 mb-4">{ccRate}% p.a.</p>
                      <div className="h-[1.5px] w-full bg-red-100/50 mb-3" />
                      <p className="text-[9px] sm:text-[10px] font-bold text-gray-400 mb-1">Monthly Interest</p>
                      <p className="text-xl sm:text-2xl font-extrabold text-red-500 tracking-tight">₹{new Intl.NumberFormat('en-IN').format(ccMonthlyInterest)}</p>
                    </div>
                    {/* Right Box Green */}
                    <div className="bg-[#f2fdf5] rounded-2xl p-4 sm:p-5 border-[1.5px] border-green-200">
                      <Wallet className="w-5 h-5 sm:w-6 sm:h-6 text-[#159a49] mb-3" />
                      <p className="text-[10px] sm:text-xs font-bold text-gray-400 mb-1">Personal Loan</p>
                      <p className="text-base sm:text-lg font-black text-[#159a49] mb-4">{calcPlRate}% p.a.*</p>
                      <div className="h-[1.5px] w-full bg-green-200 mb-3" />
                      <p className="text-[9px] sm:text-[10px] font-bold text-gray-400 mb-1">Monthly Interest</p>
                      <p className="text-xl sm:text-2xl font-extrabold text-[#159a49] tracking-tight">₹{new Intl.NumberFormat('en-IN').format(plMonthlyInterest)}</p>
                    </div>
                  </div>

                  <div className="bg-[#108c43] rounded-2xl p-4 lg:p-5 text-center text-white mb-4 shadow-inner">
                    <p className="text-[10px] sm:text-xs font-bold text-green-100 mb-1 tracking-tight">Your Monthly Savings</p>
                    <p className="text-3xl sm:text-4xl font-extrabold drop-shadow-sm tracking-tight mb-4">₹{new Intl.NumberFormat('en-IN').format(monthlySavings)}</p>
                    <div className="h-[1px] w-full bg-green-400/40 mb-3" />
                    <p className="text-[9px] sm:text-[10px] font-bold text-green-100 mb-0.5">Annual Savings</p>
                    <p className="text-base sm:text-lg font-extrabold">₹{new Intl.NumberFormat('en-IN').format(annualSavings)}</p>
                  </div>

                  <button 
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      window.scrollTo({top: 0, behavior: 'smooth'});
                    }}
                    className="w-full bg-[#d82c23] hover:bg-[#b92119] text-white py-3 lg:py-4 rounded-xl font-extrabold text-base sm:text-lg transition-colors shadow-lg"
                  >
                    Escape the Credit Card Trap Now !
                  </button>
                </motion.div>

                {/* Box 3: Customer Reviews */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white rounded-2xl sm:rounded-3xl p-5 lg:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col justify-center w-full h-full text-sm"
                >
                  <h3 className="text-lg sm:text-xl font-extrabold text-[#2942b6] mb-4 text-center">Customer Reviews</h3>
                  
                  <div className="space-y-4">
                    {[
                      { name: 'Rajesh Kumar', quote: 'I was badly stuck paying minimum dues on 3 credit cards. My outstanding was piling up due to interest. Applied here, team helped settle my entire bill in 24 hours!' },
                      { name: 'Priya Sharma', quote: 'Credit card interest was ruining my financial peace. Shifted my entire ₹4L balance to a personal loan here at 10.25%. Pure lifesaver.' },
                      { name: 'Amit Patel', quote: 'Highly recommended! If you have massive CC bills, do not pay 45% interest. Converted my debt to an easy monthly EMI here instantly.' }
                    ].map((story, idx) => (
                      <div 
                        key={idx}
                        className="bg-white p-3 lg:p-4 rounded-2xl border border-gray-100 flex flex-col justify-center"
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-[10px]">
                              {story.name.charAt(0)}
                            </div>
                            <span className="font-extrabold text-gray-800 text-[11px] sm:text-xs">{story.name}</span>
                          </div>
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                        </div>
                        <p className="text-[10px] sm:text-[11px] text-gray-500 leading-relaxed italic mt-1 pb-1">"{story.quote}"</p>
                      </div>
                    ))}
                  </div>
                </motion.div>

            </div>
          </div>
        </div>
      </div>

      {/* FAQ Schema      {/* FAQ Schema (Hidden but keeps SEO benefits) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "How quickly can I get an instant personal loan online?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "You can get approval within 24-72 hours. Once approved, the loan amount is disbursed directly to your bank account within 1-2 working days."
                }
              },
              {
                "@type": "Question",
                "name": "What is the minimum credit score required for a personal loan?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "A minimum credit score of 700 is required for instant personal loan approval. Higher credit scores may qualify for lower interest rates."
                }
              },
              {
                "@type": "Question",
                "name": "What documents are needed for an instant personal loan?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "You need PAN card, Aadhaar card, 3 months salary slips, 3 months bank statements, and proof of current address. The process is 100% digital with minimal documentation."
                }
              },
              {
                "@type": "Question",
                "name": "What is the interest rate for instant personal loans?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Interest rates start from 9% per annum (0.75% per month) and vary based on your credit score, income, and loan amount. Rates may go up to 24% p.a."
                }
              },
              {
                "@type": "Question",
                "name": "Can I prepay my personal loan without charges?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, you can make part payments or full prepayment with zero foreclosure charges on most of our personal loan products."
                }
              },
              {
                "@type": "Question",
                "name": "What is the maximum loan amount I can get?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "You can get a personal loan from ₹50,000 to ₹25 lakh, depending on your monthly income, credit score, and repayment capacity."
                }
              }
            ]
          })
        }}
      />

      <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-6 md:py-8 text-center relative z-10">
        <div className="max-w-7xl mx-auto px-3 md:px-4">
          <p className="text-xs sm:text-sm">© 2024 KreditScore. All rights reserved.</p>
          <p className="text-[10px] sm:text-xs text-gray-400 mt-1 md:mt-2">Secure • Fast • Trusted</p>
        </div>
      </footer>
    </div>
  );
}
