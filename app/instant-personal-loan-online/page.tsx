'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, ArrowRight, Check, CheckCircle, Shield, Zap, TrendingUp, Clock, Award, FileText, Users, BadgeCheck, Sparkles, CreditCard, Building2, Home, MapPin, Wallet, PartyPopper } from 'lucide-react';
import Header from '@/components/Header';
import CustomCursor from '@/components/CustomCursor';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import SupabaseAuthInline from '@/components/SupabaseAuthInline';
import { getSupabaseDisplayName, getSupabasePhoneDigits } from '@/lib/supabase/user';

export default function ApplyLoanPage() {
  const router = useRouter();
  const pathname = usePathname();
  const isPreApproved = pathname === '/pre-approved-personal-loan';
  const { user, loading: authLoading } = useAuth();
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formStep, setFormStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Show/hide dropdown states
  const [showCompanySuggestions, setShowCompanySuggestions] = useState(false);
  const [showCurrentCitySuggestions, setShowCurrentCitySuggestions] = useState(false);
  const [showCurrentStateSuggestions, setShowCurrentStateSuggestions] = useState(false);
  const [showPermanentCitySuggestions, setShowPermanentCitySuggestions] = useState(false);
  const [showPermanentStateSuggestions, setShowPermanentStateSuggestions] = useState(false);
  const [showOfficeCitySuggestions, setShowOfficeCitySuggestions] = useState(false);
  const [showOfficeStateSuggestions, setShowOfficeStateSuggestions] = useState(false);

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

  const filteredCurrentStates = formData.currentState
    ? states.filter(state => state.toLowerCase().startsWith(formData.currentState.toLowerCase())).slice(0, 4)
    : [];

  const filteredPermanentCities = formData.permanentCity
    ? cities.filter(city => city.toLowerCase().startsWith(formData.permanentCity.toLowerCase())).slice(0, 4)
    : [];

  const filteredPermanentStates = formData.permanentState
    ? states.filter(state => state.toLowerCase().startsWith(formData.permanentState.toLowerCase())).slice(0, 4)
    : [];

  const filteredOfficeCities = formData.officeCity
    ? cities.filter(city => city.toLowerCase().startsWith(formData.officeCity.toLowerCase())).slice(0, 4)
    : [];

  const filteredOfficeStates = formData.officeState
    ? states.filter(state => state.toLowerCase().startsWith(formData.officeState.toLowerCase())).slice(0, 4)
    : [];

  useEffect(() => {
    if (!user) return;
    const p = getSupabasePhoneDigits(user);
    if (p && p.length === 10) setMobile(p);
    const dn = getSupabaseDisplayName(user);
    if (dn) setName(dn);
    setFormStep(1);
  }, [user]);

  // Capitalize name input
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const capitalizedValue = value
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
    setName(capitalizedValue);
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

    // Show/hide dropdowns based on input
    if (name === 'companyName') {
      setShowCompanySuggestions(value.length > 0);
    }
    if (name === 'currentCity') {
      setShowCurrentCitySuggestions(value.length > 0);
    }
    if (name === 'currentState') {
      setShowCurrentStateSuggestions(value.length > 0);
    }
    if (name === 'permanentCity') {
      setShowPermanentCitySuggestions(value.length > 0);
    }
    if (name === 'permanentState') {
      setShowPermanentStateSuggestions(value.length > 0);
    }
    if (name === 'officeCity') {
      setShowOfficeCitySuggestions(value.length > 0);
    }
    if (name === 'officeState') {
      setShowOfficeStateSuggestions(value.length > 0);
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

  const handleCurrentStateSelect = (state: string) => {
    setFormData(prev => ({ ...prev, currentState: state }));
    setShowCurrentStateSuggestions(false);
  };

  const handlePermanentCitySelect = (city: string) => {
    setFormData(prev => ({ ...prev, permanentCity: city }));
    setShowPermanentCitySuggestions(false);
  };

  const handlePermanentStateSelect = (state: string) => {
    setFormData(prev => ({ ...prev, permanentState: state }));
    setShowPermanentStateSuggestions(false);
  };

  const handleOfficeCitySelect = (city: string) => {
    setFormData(prev => ({ ...prev, officeCity: city }));
    setShowOfficeCitySuggestions(false);
  };

  const handleOfficeStateSelect = (state: string) => {
    setFormData(prev => ({ ...prev, officeState: state }));
    setShowOfficeStateSuggestions(false);
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

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate age
    if (!validateAge(formData.dob)) {
      alert('Age must be between 18 and 100 years. Please check your date of birth.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsSubmitted(true);
      setIsLoading(false);
    }, 1500);
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
      {/* Structured Data for SEO - Financial Product */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FinancialProduct",
            "name": "Instant Personal Loan Online",
            "description": "Get instant personal loan online from ₹50,000 to ₹25 lakh with minimal documentation. Quick approval in 24-72 hours with low interest rates starting from 9% p.a.",
            "provider": {
              "@type": "FinancialService",
              "name": "KreditScore",
              "url": "https://kreditscore.com",
              "logo": "https://www.kreditscore.in/logo.png",
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
              "minValue": "9.0",
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
              "url": "https://www.kreditscore.in/instant-personal-loan-online",
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
                "item": "https://kreditscore.com"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Loans",
                "item": "https://www.kreditscore.in/#loans"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": "Instant Personal Loan Online",
                "item": "https://www.kreditscore.in/instant-personal-loan-online"
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
                className="inline-flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-3 py-1.5 sm:px-4 sm:py-2 md:px-6 rounded-full text-xs sm:text-sm font-semibold mb-4 sm:mb-5 md:mb-6 shadow-lg w-fit"
              >
                <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="whitespace-nowrap">{isPreApproved ? 'Pre-Approved Personal Loan' : 'Fresh Personal Loan'}</span>
              </motion.div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-2 sm:mb-3 md:mb-4 bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 bg-clip-text text-transparent leading-tight">
                {isPreApproved ? 'No Payslip Required' : 'Get Your Dream Loan'}
              </h1>
              <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-600 mb-4 sm:mb-6 md:mb-8 whitespace-nowrap">
                {isPreApproved ? (
                  'Get instant loan approval without income documents. Your credit score is your proof!'
                ) : (
                  <>
                    ROI starts from <span className="font-bold text-orange-600">9%* per year</span>
                    <span className="text-[10px] sm:text-xs md:text-sm"> (0.75% per month)</span>
                  </>
                )}
              </p>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-1.5 sm:gap-2 md:gap-3 lg:gap-4">
                <div className="bg-white rounded-lg sm:rounded-xl md:rounded-2xl p-1.5 sm:p-2 md:p-3 lg:p-4 shadow-lg border border-gray-100">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 text-blue-600 mb-0.5 sm:mb-1 md:mb-2" />
                  <p className="text-xs sm:text-sm md:text-base lg:text-lg font-bold text-gray-900 leading-tight">{isPreApproved ? '50k to 15 lakh' : '₹1L-₹5Cr'}</p>
                  <p className="text-[9px] sm:text-[10px] md:text-xs text-gray-600">{isPreApproved ? 'Loan Amount' : 'Amount'}</p>
                </div>
                <div className="bg-white rounded-lg sm:rounded-xl md:rounded-2xl p-1.5 sm:p-2 md:p-3 lg:p-4 shadow-lg border border-gray-100">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 text-green-600 mb-0.5 sm:mb-1 md:mb-2" />
                  <p className="text-xs sm:text-sm md:text-base lg:text-lg font-bold text-gray-900 leading-tight">{isPreApproved ? '1-5 Years' : '1-8 Years'}</p>
                  <p className="text-[9px] sm:text-[10px] md:text-xs text-gray-600">Tenure</p>
                </div>
                <div className="bg-white rounded-lg sm:rounded-xl md:rounded-2xl p-1.5 sm:p-2 md:p-3 lg:p-4 shadow-lg border border-gray-100">
                  <Zap className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 text-orange-600 mb-0.5 sm:mb-1 md:mb-2" />
                  <p className="text-xs sm:text-sm md:text-base lg:text-lg font-bold text-gray-900 leading-tight">{isPreApproved ? 'Within Minute' : '24-72 Hrs'}</p>
                  <p className="text-[9px] sm:text-[10px] md:text-xs text-gray-600">{isPreApproved ? 'Approval' : 'Approval'}</p>
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
                          className="relative w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 mx-auto mb-2 sm:mb-3 md:mb-4"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.5 }}
                        >
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            className="relative w-full h-full bg-blue-500 rounded-full shadow-lg flex items-center justify-center"
                          >
                            <CheckCircle className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-9 lg:h-9 text-white" strokeWidth={2.5} />
                          </motion.div>
                        </motion.div>

                        <motion.h2
                          className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold mb-1 md:mb-2 leading-tight"
                          initial={{ opacity: 0, y: -20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          <span className="text-[#FF8C00]">Start Your </span>
                          <span className="text-[#87CEEB]">Loan Journey</span>
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

                      {authLoading && (
                        <p className="text-center text-sm text-gray-500 py-6">Loading…</p>
                      )}
                      {!authLoading && !user && (
                        <SupabaseAuthInline returnPath={pathname} />
                      )}
                      {!authLoading && user && (
                      <AnimatePresence mode="wait">
                          <motion.div
                            key="application-form"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                          >
                            {/* Step Indicator */}
                            <div className="flex items-center justify-center gap-2 mb-4">
                              <div className={`w-2 h-2 rounded-full ${formStep === 1 ? 'bg-blue-600' : 'bg-gray-300'}`} />
                              <div className={`w-2 h-2 rounded-full ${formStep === 2 ? 'bg-blue-600' : 'bg-gray-300'}`} />
                              <div className={`w-2 h-2 rounded-full ${formStep === 3 ? 'bg-blue-600' : 'bg-gray-300'}`} />
                            </div>

                            <form onSubmit={handleFormSubmit} className="space-y-3">
                              {formStep === 1 && (
                                <motion.div
                                  initial={{ opacity: 0, x: 20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  className="space-y-2.5"
                                >
                                  <h3 className="text-sm font-bold text-blue-600 mb-3">Personal Details</h3>

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
                                    <label className="block text-[10px] font-semibold text-gray-700 mb-1">Date of Birth (DD/MM/YYYY) *</label>
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

                                  <div className="relative">
                                    <label className="block text-[10px] font-semibold text-gray-700 mb-1">Company Name *</label>
                                    <input
                                      type="text"
                                      name="companyName"
                                      value={formData.companyName}
                                      onChange={handleInputChange}
                                      onFocus={() => formData.companyName.length > 0 && setShowCompanySuggestions(true)}
                                      placeholder="Type company name"
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

                                  <div>
                                    <label className="block text-[10px] font-semibold text-gray-700 mb-1">Net Take Home Salary *</label>
                                    <input
                                      type="text"
                                      name="netSalary"
                                      value={formData.netSalary}
                                      onChange={handleInputChange}
                                      placeholder="₹ Monthly salary"
                                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                      required
                                      autoComplete="off"
                                    />
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() => setFormStep(2)}
                                    className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-blue-700 transition-colors"
                                  >
                                    Next Step
                                  </button>
                                </motion.div>
                              )}

                              {formStep === 2 && (
                                <motion.div
                                  initial={{ opacity: 0, x: 20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  className="space-y-2.5"
                                >
                                  <h3 className="text-sm font-bold text-blue-600 mb-3">Current Address</h3>

                                  <div>
                                    <label className="block text-[10px] font-semibold text-gray-700 mb-1">Where You Living Currently *</label>
                                    <input
                                      type="text"
                                      name="currentAddress"
                                      value={formData.currentAddress}
                                      onChange={handleInputChange}
                                      placeholder="Complete address"
                                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                      required
                                      autoComplete="street-address"
                                    />
                                  </div>

                                  <div className="grid grid-cols-2 gap-2">
                                    <div className="relative">
                                      <label className="block text-[10px] font-semibold text-gray-700 mb-1">City *</label>
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

                                    <div className="relative">
                                      <label className="block text-[10px] font-semibold text-gray-700 mb-1">State *</label>
                                      <input
                                        type="text"
                                        name="currentState"
                                        value={formData.currentState}
                                        onChange={handleInputChange}
                                        onFocus={() => formData.currentState.length > 0 && setShowCurrentStateSuggestions(true)}
                                        placeholder="Type state"
                                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                        required
                                        autoComplete="off"
                                      />
                                      {showCurrentStateSuggestions && filteredCurrentStates.length > 0 && (
                                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                          {filteredCurrentStates.map((state, index) => (
                                            <div
                                              key={index}
                                              onClick={() => handleCurrentStateSelect(state)}
                                              className="px-3 py-2 text-sm text-gray-800 hover:bg-gradient-to-r hover:from-[#FF8C00]/10 hover:to-[#87CEEB]/10 cursor-pointer transition-colors"
                                            >
                                              {state}
                                            </div>
                                          ))}
                                        </div>
                                      )}
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
                                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
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
                                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                        maxLength={6}
                                        required
                                        autoComplete="postal-code"
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
                                    <div className="relative">
                                      <label className="block text-[10px] font-semibold text-gray-700 mb-1">City *</label>
                                      <input
                                        type="text"
                                        name="permanentCity"
                                        value={formData.permanentCity}
                                        onChange={handleInputChange}
                                        onFocus={() => formData.permanentCity.length > 0 && setShowPermanentCitySuggestions(true)}
                                        placeholder="Type city"
                                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                                        required
                                        autoComplete="off"
                                      />
                                      {showPermanentCitySuggestions && filteredPermanentCities.length > 0 && (
                                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                          {filteredPermanentCities.map((city, index) => (
                                            <div
                                              key={index}
                                              onClick={() => handlePermanentCitySelect(city)}
                                              className="px-3 py-2 text-sm text-gray-800 hover:bg-gradient-to-r hover:from-[#FF8C00]/10 hover:to-[#87CEEB]/10 cursor-pointer transition-colors"
                                            >
                                              {city}
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </div>

                                    <div className="relative">
                                      <label className="block text-[10px] font-semibold text-gray-700 mb-1">State *</label>
                                      <input
                                        type="text"
                                        name="permanentState"
                                        value={formData.permanentState}
                                        onChange={handleInputChange}
                                        onFocus={() => formData.permanentState.length > 0 && setShowPermanentStateSuggestions(true)}
                                        placeholder="Type state"
                                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                                        required
                                        autoComplete="off"
                                      />
                                      {showPermanentStateSuggestions && filteredPermanentStates.length > 0 && (
                                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                          {filteredPermanentStates.map((state, index) => (
                                            <div
                                              key={index}
                                              onClick={() => handlePermanentStateSelect(state)}
                                              className="px-3 py-2 text-sm text-gray-800 hover:bg-gradient-to-r hover:from-[#FF8C00]/10 hover:to-[#87CEEB]/10 cursor-pointer transition-colors"
                                            >
                                              {state}
                                            </div>
                                          ))}
                                        </div>
                                      )}
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
                                      className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-blue-700 transition-colors"
                                    >
                                      Next Step
                                    </button>
                                  </div>
                                </motion.div>
                              )}

                              {formStep === 3 && (
                                <motion.div
                                  initial={{ opacity: 0, x: 20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  className="space-y-2.5"
                                >
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
                                    <div className="relative">
                                      <label className="block text-[10px] font-semibold text-gray-700 mb-1">City *</label>
                                      <input
                                        type="text"
                                        name="officeCity"
                                        value={formData.officeCity}
                                        onChange={handleInputChange}
                                        onFocus={() => formData.officeCity.length > 0 && setShowOfficeCitySuggestions(true)}
                                        placeholder="Type city"
                                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                                        required
                                        autoComplete="off"
                                      />
                                      {showOfficeCitySuggestions && filteredOfficeCities.length > 0 && (
                                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                          {filteredOfficeCities.map((city, index) => (
                                            <div
                                              key={index}
                                              onClick={() => handleOfficeCitySelect(city)}
                                              className="px-3 py-2 text-sm text-gray-800 hover:bg-gradient-to-r hover:from-[#FF8C00]/10 hover:to-[#87CEEB]/10 cursor-pointer transition-colors"
                                            >
                                              {city}
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </div>

                                    <div className="relative">
                                      <label className="block text-[10px] font-semibold text-gray-700 mb-1">State *</label>
                                      <input
                                        type="text"
                                        name="officeState"
                                        value={formData.officeState}
                                        onChange={handleInputChange}
                                        onFocus={() => formData.officeState.length > 0 && setShowOfficeStateSuggestions(true)}
                                        placeholder="Type state"
                                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                                        required
                                        autoComplete="off"
                                      />
                                      {showOfficeStateSuggestions && filteredOfficeStates.length > 0 && (
                                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                          {filteredOfficeStates.map((state, index) => (
                                            <div
                                              key={index}
                                              onClick={() => handleOfficeStateSelect(state)}
                                              className="px-3 py-2 text-sm text-gray-800 hover:bg-gradient-to-r hover:from-[#FF8C00]/10 hover:to-[#87CEEB]/10 cursor-pointer transition-colors"
                                            >
                                              {state}
                                            </div>
                                          ))}
                                        </div>
                                      )}
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
                                      className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 text-white py-2.5 rounded-lg font-semibold text-sm hover:from-green-700 hover:to-blue-700 transition-all disabled:opacity-50"
                                    >
                                      {isLoading ? (
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
                                      ) : (
                                        'Submit'
                                      )}
                                    </button>
                                  </div>
                                </motion.div>
                              )}
                            </form>
                          </motion.div>
                      </AnimatePresence>
                      )}
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

          {/* Scrollable Cards Section with Dots */}
          <div className="mb-8 md:mb-12">
            <div className="overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              <div className="flex gap-4 sm:gap-6 md:gap-8 min-w-max px-1">

                {/* Card 1 - Key Features */}
                <motion.div
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover={{
                    scale: 1.02,
                    y: -5,
                    transition: { duration: 0.3 }
                  }}
                  className="bg-gradient-to-br from-white to-blue-50/30 rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 shadow-xl hover:shadow-2xl border border-blue-100 relative overflow-hidden snap-center w-[300px] sm:w-[360px] md:w-[400px] lg:w-[420px] flex-shrink-0 transition-all flex flex-col"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-2xl flex items-center justify-center mb-3 sm:mb-4 relative z-10">
                    <Award className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" strokeWidth={2.5} />
                  </div>

                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">{isPreApproved ? 'Why Pre-Approved Loan?' : 'Key Features'}</h3>
                  <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 mb-4 sm:mb-5">
                    {isPreApproved
                      ? 'Instant loan approval without income documents'
                      : 'Unsecured loans with flexible usage and quick processing'}
                  </p>

                  <div className="space-y-2 sm:space-y-2.5 mb-4 sm:mb-5 flex-grow">
                    {(
                      isPreApproved
                        ? [
                            { icon: Zap, text: 'Instant loan approval without income documents' },
                            { icon: FileText, text: 'No Income Documents' },
                            { icon: Clock, text: 'Lightning Fast' },
                            { icon: CheckCircle, text: 'Approval based on credit report only.' }
                          ]
                        : [
                            { icon: Shield, text: 'No collateral required' },
                            { icon: CreditCard, text: 'Easy part payment option' },
                            { icon: Check, text: 'Zero Forecloser charge*' },
                            { icon: FileText, text: 'Minimal Documentation' },
                            { icon: Zap, text: '100% Digital Process' }
                          ]
                    ).map((item, idx) => (
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

                {/* Card 2 - Eligibility */}
                <motion.div
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.1 }}
                  whileHover={{
                    scale: 1.02,
                    y: -5,
                    transition: { duration: 0.3 }
                  }}
                  className="bg-gradient-to-br from-white to-green-50/30 rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 shadow-xl hover:shadow-2xl border border-green-100 relative overflow-hidden snap-center w-[300px] sm:w-[360px] md:w-[400px] lg:w-[420px] flex-shrink-0 transition-all flex flex-col"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-2xl flex items-center justify-center mb-3 sm:mb-4 relative z-10">
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" strokeWidth={2.5} />
                  </div>

                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">Eligibility Criteria</h3>
                  <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 mb-4 sm:mb-5">Salaried individuals with 700+ credit score and stable income</p>

                  <div className="flex-grow space-y-3 sm:space-y-4 mb-4 sm:mb-5">
                    <div>
                      <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                        <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600" />
                        <h4 className="text-xs sm:text-sm font-bold text-gray-900">Who can apply</h4>
                      </div>
                      <div className="space-y-1.5 sm:space-y-2">
                        {['Salaried Individual', 'Credit score above 700', '₹15,000/month minimum income'].map((item, idx) => (
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
                        <h4 className="text-xs sm:text-sm font-bold text-gray-900">Age Criteria</h4>
                      </div>
                      <div className="space-y-1.5 sm:space-y-2">
                        {['Above 18 years', 'Below 58 years'].map((item, idx) => (
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

                {/* Card 3 - Documents */}
                <motion.div
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.2 }}
                  whileHover={{
                    scale: 1.02,
                    y: -5,
                    transition: { duration: 0.3 }
                  }}
                  className="bg-gradient-to-br from-white to-orange-50/30 rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 shadow-xl hover:shadow-2xl border border-orange-100 relative overflow-hidden snap-center w-[300px] sm:w-[360px] md:w-[400px] lg:w-[420px] flex-shrink-0 transition-all flex flex-col"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-2xl flex items-center justify-center mb-3 sm:mb-4 relative z-10">
                    <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" strokeWidth={2.5} />
                  </div>

                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">Required Documents</h3>
                  <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 mb-4 sm:mb-5">
                    {isPreApproved
                      ? 'Basic identity proof, address proof'
                      : 'Basic identity proof, address proof, and income documents'}
                  </p>

                  <div className="space-y-3 sm:space-y-3.5 mb-4 sm:mb-5 flex-grow">
                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        {isPreApproved && <h4 className="text-xs sm:text-sm font-bold text-gray-900 mb-1.5 sm:mb-2">Employeement Detail</h4>}
                        <h4 className="text-xs sm:text-sm font-bold text-gray-900 mb-1.5 sm:mb-2">Identity Proof</h4>
                        <ul className="space-y-1 sm:space-y-1.5">
                          {['Passport', 'Voter ID', 'Driving License', 'PAN Card'].map((doc, idx) => (
                            <li key={idx} className="flex items-start gap-1.5 text-[10px] sm:text-xs md:text-sm text-gray-700">
                              <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-orange-500 rounded-full flex-shrink-0 mt-1.5 sm:mt-1.5" />
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
                              <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-orange-500 rounded-full flex-shrink-0 mt-1.5 sm:mt-1.5" />
                              <span className="leading-tight">{doc}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-gray-900 mb-1.5 sm:mb-2">Other Documents</h4>
                      <ul className="space-y-1 sm:space-y-1.5">
                        {(isPreApproved
                          ? ['Employeement Datail', 'Bank Statement (3 months)']
                          : ['Salary Slips (3 months)', 'Bank Statement (3 months)']
                        ).map((doc, idx) => (
                          <li key={idx} className="flex items-start gap-1.5 text-[10px] sm:text-xs md:text-sm text-gray-700">
                            <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-orange-500 rounded-full flex-shrink-0 mt-1.5 sm:mt-1.5" />
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

            {/* Dots Indicator */}
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
        </div>
      </div>

      {/* FAQ Schema (Hidden but keeps SEO benefits) */}
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
