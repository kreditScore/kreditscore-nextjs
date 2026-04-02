'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';
import CustomCursor from '@/components/CustomCursor';
import {
  Wallet,
  CreditCard,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  Clock,
  Shield,
  Users,
  Award,
  FileText,
  Building2,
  ChevronDown,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  IndianRupee,
  Calendar,
  Home,
  Zap,
  RefreshCw,
  DollarSign,
  ArrowRight,
  Repeat,
  ArrowLeft,
  CheckCircle2,
  Send,
  Smartphone
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import SupabaseAuthInline from '@/components/SupabaseAuthInline';
import { getSupabaseDisplayName, getSupabasePhoneDigits } from '@/lib/supabase/user';

export default function SalariedOverdraftPage() {
  const pathname = usePathname();
  const { user, loading: authLoading } = useAuth();
  // Form Steps: 0 = Name+Mobile, 2 = Personal … 6 = OD (Supabase login gate)
  const [formStep, setFormStep] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    // Initial
    fullName: '',
    mobile: '',
    // Personal Details
    email: '',
    panCard: '',
    dob: '',
    gender: '',
    maritalStatus: '',
    // Employer Details
    companyName: '',
    companyType: '',
    designation: '',
    netSalary: '',
    workEmail: '',
    // Office Address
    officeAddress: '',
    officeLandmark: '',
    officeCity: '',
    officeState: '',
    officePincode: '',
    // Home Address
    residenceType: '', // Owned, Owned by Parents, Rented, Company Provided
    currentAddress: '',
    currentLandmark: '',
    currentCity: '',
    currentState: '',
    currentPincode: '',
    permanentAddress: '',
    permanentLandmark: '',
    permanentCity: '',
    permanentState: '',
    permanentPincode: '',
    // OD Details
    desiredODLimit: '',
    purposeOfOD: ''
  });

  // Autocomplete States
  const [showCitySuggestions, setShowCitySuggestions] = useState({ current: false, permanent: false, office: false });
  const [showStateSuggestions, setShowStateSuggestions] = useState({ current: false, permanent: false, office: false });
  const [showCompanySuggestions, setShowCompanySuggestions] = useState(false);
  const [showCompanyTypeSuggestions, setShowCompanyTypeSuggestions] = useState(false);

  // Sample data for autocomplete
  const indianCities = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Surat', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal', 'Visakhapatnam', 'Pimpri-Chinchwad', 'Patna', 'Vadodara'];
  const indianStates = ['Maharashtra', 'Delhi', 'Karnataka', 'Telangana', 'Tamil Nadu', 'West Bengal', 'Gujarat', 'Rajasthan', 'Uttar Pradesh', 'Madhya Pradesh', 'Andhra Pradesh', 'Kerala', 'Punjab', 'Haryana', 'Bihar'];
  const indianCompanies = ['TCS', 'Infosys', 'Wipro', 'HCL Technologies', 'Tech Mahindra', 'Reliance Industries', 'HDFC Bank', 'ICICI Bank', 'SBI', 'Tata Motors', 'Mahindra & Mahindra', 'Adani Group', 'Larsen & Toubro', 'Asian Paints', 'Bajaj Auto'];
  const companyTypes = ['Private Limited', 'Public Limited', 'Government', 'MNC', 'Startup', 'Partnership', 'Proprietorship'];

  useEffect(() => {
    if (!user) return;
    const p = getSupabasePhoneDigits(user);
    if (p && p.length === 10) {
      setFormData((prev) => ({ ...prev, mobile: p }));
    }
    const dn = getSupabaseDisplayName(user);
    if (dn) {
      setFormData((prev) => ({ ...prev, fullName: dn }));
    }
  }, [user]);

  // Auto-fill permanent address if residence is owned
  useEffect(() => {
    if (formData.residenceType === 'Owned' || formData.residenceType === 'Owned by Parents') {
      setFormData(prev => ({
        ...prev,
        permanentAddress: prev.currentAddress,
        permanentLandmark: prev.currentLandmark,
        permanentCity: prev.currentCity,
        permanentState: prev.currentState,
        permanentPincode: prev.currentPincode
      }));
    }
  }, [formData.residenceType, formData.currentAddress, formData.currentLandmark, formData.currentCity, formData.currentState, formData.currentPincode]);

  // Form Handlers
  const handleInputChange = (field: string, value: string) => {
    if (field === 'fullName') {
      value = value.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
    }
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleContinueFromStep0 = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.fullName && formData.mobile.length === 10) {
      setFormStep(2);
    }
  };

  const handleNextStep = () => {
    if (formStep < 6) setFormStep(formStep + 1);
  };

  const handlePrevStep = () => {
    if (formStep > 2) setFormStep(formStep - 1);
    else if (formStep === 2) setFormStep(0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formStep !== 6) return;
    setIsSubmitted(true);
  };

  // Filter functions for autocomplete
  const filterCities = (input: string) => {
    return input ? indianCities.filter(city => city.toLowerCase().includes(input.toLowerCase())) : indianCities;
  };

  const filterStates = (input: string) => {
    return input ? indianStates.filter(state => state.toLowerCase().includes(input.toLowerCase())) : indianStates;
  };

  const filterCompanies = (input: string) => {
    return input ? indianCompanies.filter(company => company.toLowerCase().includes(input.toLowerCase())) : indianCompanies;
  };

  const filterCompanyTypes = (input: string) => {
    return input ? companyTypes.filter(type => type.toLowerCase().includes(input.toLowerCase())) : companyTypes;
  };

  // Calculate max OD limit
  const maxODLimit = formData.netSalary ? Number(formData.netSalary) * 3 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FinancialProduct",
            "name": "Salaried Overdraft Facility",
            "description": "Flexible overdraft facility for salaried employees. Withdraw when you need, pay interest only on used amount.",
            "provider": {
              "@type": "FinancialService",
              "name": "KreditScore"
            },
            "interestRate": "12% p.a. onwards",
            "feesAndCommissionsSpecification": "No annual fees. Interest charged only on utilized amount.",
            "url": "https://www.kreditscore.in/salaried-overdraft"
          })
        }}
      />

      <CustomCursor />
      <Header />

      {/* Hero Section */}
      <section className="pt-24 sm:pt-28 lg:pt-32 pb-8 sm:pb-12 lg:pb-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 sm:mb-12"
          >
            <motion.h1
              className="text-2xl leading-tight sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 px-2"
              initial={{ opacity: 0, rotateX: -15 }}
              animate={{ opacity: 1, rotateX: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{ perspective: 1000 }}
            >
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Access Credit Anytime,
              </span>
              <br />
              <span className="text-teal-700">Pay Only for What You Use!</span>
            </motion.h1>
            <p className="text-xs sm:text-base md:text-lg text-green-600 font-semibold px-2 leading-tight">
              Instant OD Facility | Up to 30x Your Salary | Interest from 12% p.a.*
            </p>
          </motion.div>

          {/* Main Grid: 3 Columns Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 lg:gap-3 mb-4 lg:items-start">

            {/* COLUMN 1: How It Works & Key Features */}
            <div className="lg:order-1 space-y-2 flex flex-col">
              {/* How It Works */}
              <motion.div
                className="bg-white rounded-2xl p-3 sm:p-4 shadow-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">How It Works:</h3>
                <div className="space-y-2">
                  <motion.div
                    className="flex items-start space-x-3"
                    whileHover={{ x: 5 }}
                  >
                    <div className="bg-green-100 rounded-full p-2 mt-0.5">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">Get Approved OD Limit</p>
                      <p className="text-xs text-gray-600 mt-0.5">Up to 30x your monthly salary</p>
                    </div>
                  </motion.div>
                  <motion.div
                    className="flex items-start space-x-3"
                    whileHover={{ x: 5 }}
                  >
                    <div className="bg-green-100 rounded-full p-2 mt-0.5">
                      <RefreshCw className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">Withdraw Anytime</p>
                      <p className="text-xs text-gray-600 mt-0.5">Use money whenever you need</p>
                    </div>
                  </motion.div>
                  <motion.div
                    className="flex items-start space-x-3"
                    whileHover={{ x: 5 }}
                  >
                    <div className="bg-green-100 rounded-full p-2 mt-0.5">
                      <DollarSign className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">Pay Interest on Usage</p>
                      <p className="text-xs text-gray-600 mt-0.5">Only on the amount used</p>
                    </div>
                  </motion.div>
                  <motion.div
                    className="flex items-start space-x-3"
                    whileHover={{ x: 5 }}
                  >
                    <div className="bg-green-100 rounded-full p-2 mt-0.5">
                      <Zap className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">Repay & Reuse</p>
                      <p className="text-xs text-gray-600 mt-0.5">Revolving credit facility</p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              {/* Key Features */}
              <motion.div
                className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl p-3 sm:p-4 shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <h3 className="text-lg sm:text-xl font-bold text-green-800 mb-2">Key Features:</h3>
                <ul className="space-y-2">
                  {[
                    'Instant access to funds 24/7',
                    'No EMI burden - flexible repayment',
                    'Lower interest than credit cards',
                    'Revolving credit - use, repay, reuse',
                    'No prepayment or foreclosure charges',
                    'Digital account management'
                  ].map((benefit, index) => (
                    <motion.li
                      key={index}
                      className="flex items-start space-x-2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                    >
                      <CheckCircle2 className="w-4 h-4 text-green-700 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-green-900">{benefit}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              {/* Success Stories */}
              <motion.div
                className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl p-3 sm:p-4 shadow-lg mt-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <h3 className="text-lg sm:text-xl font-bold text-blue-800 mb-2">Success Stories:</h3>
                <div className="space-y-3">
                  <motion.div
                    className="bg-white/60 backdrop-blur-sm rounded-xl p-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.6 }}
                  >
                    <div className="flex items-start space-x-2">
                      <Award className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-blue-900">Rajesh Kumar</p>
                        <p className="text-xs text-gray-700 mt-0.5">"Got ₹2L overdraft in 24 hours. Perfect for managing cash flow!"</p>
                      </div>
                    </div>
                  </motion.div>
                  <motion.div
                    className="bg-white/60 backdrop-blur-sm rounded-xl p-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.7 }}
                  >
                    <div className="flex items-start space-x-2">
                      <Award className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-blue-900">Priya Sharma</p>
                        <p className="text-xs text-gray-700 mt-0.5">"Low interest & flexible repayment. Best financial decision!"</p>
                      </div>
                    </div>
                  </motion.div>
                  <motion.div
                    className="bg-white/60 backdrop-blur-sm rounded-xl p-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.8 }}
                  >
                    <div className="flex items-start space-x-2">
                      <Award className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-blue-900">Amit Patel</p>
                        <p className="text-xs text-gray-700 mt-0.5">"Quick approval, no hassle. Highly recommended for salaried professionals!"</p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>

            {/* COLUMN 2: 0% EMI Banner + Green Salaried Overdraft Box */}
            <div className="space-y-2 lg:order-2 flex flex-col">
              {/* 0% EMI Banner */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                    rotate: [-2, 2, -2],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="relative"
                >
                  <div className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 rounded-2xl p-1 shadow-2xl">
                    <div className="bg-white rounded-2xl px-4 py-3 sm:px-6 sm:py-4 flex items-center gap-3 sm:gap-4">
                      {/* Tag Icon */}
                      <motion.div
                        animate={{
                          rotate: [0, 10, -10, 0],
                          scale: [1, 1.1, 1],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        <svg
                          className="w-12 h-12 sm:w-16 sm:h-16"
                          viewBox="0 0 100 100"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M30 20C30 14.4772 34.4772 10 40 10H80C85.5228 10 90 14.4772 90 20V60C90 65.5228 85.5228 70 80 70H40C34.4772 70 30 65.5228 30 60V20Z"
                            fill="url(#gradient1)"
                            stroke="#0EA5E9"
                            strokeWidth="3"
                          />
                          <circle cx="55" cy="35" r="8" fill="white" />
                          <path
                            d="M20 30L35 30C37.7614 30 40 32.2386 40 35L40 45C40 47.7614 37.7614 50 35 50L20 50C17.2386 50 15 47.7614 15 45L15 35C15 32.2386 17.2386 30 20 30Z"
                            fill="url(#gradient2)"
                          />
                          <defs>
                            <linearGradient id="gradient1" x1="30" y1="10" x2="90" y2="70">
                              <stop offset="0%" stopColor="#06B6D4" />
                              <stop offset="50%" stopColor="#3B82F6" />
                              <stop offset="100%" stopColor="#8B5CF6" />
                            </linearGradient>
                            <linearGradient id="gradient2" x1="15" y1="30" x2="40" y2="50">
                              <stop offset="0%" stopColor="#06B6D4" />
                              <stop offset="100%" stopColor="#3B82F6" />
                            </linearGradient>
                          </defs>
                        </svg>
                      </motion.div>

                      {/* Text Content */}
                      <div className="text-left">
                        <motion.div
                          animate={{
                            scale: [1, 1.05, 1],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                          className="text-3xl sm:text-5xl font-black bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-1"
                        >
                          0% EMI
                        </motion.div>
                        <div className="text-lg sm:text-2xl font-bold text-gray-700">
                          Only Pay <span className="text-blue-600">Interest</span>
                        </div>
                        <div className="text-xs sm:text-sm text-gray-500 mt-1">
                          No Processing Fee • Instant Approval
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Floating Sparkles */}
                  <motion.div
                    animate={{
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full"
                    style={{ filter: 'blur(2px)' }}
                  />
                  <motion.div
                    animate={{
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: 0.5,
                      ease: "easeInOut"
                    }}
                    className="absolute -bottom-2 -left-2 w-4 h-4 bg-cyan-400 rounded-full"
                    style={{ filter: 'blur(2px)' }}
                  />
                  <motion.div
                    animate={{
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: 1,
                      ease: "easeInOut"
                    }}
                    className="absolute top-1/2 -right-3 w-3 h-3 bg-purple-400 rounded-full"
                    style={{ filter: 'blur(2px)' }}
                  />
                </motion.div>
              </motion.div>

              {/* Green Salaried Overdraft Box */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-2"
              >
              {/* Green 3D Box */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
                <motion.div
                  className="relative bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-4 sm:p-5 shadow-2xl"
                  initial={{ rotateY: -10, rotateX: 5 }}
                  animate={{ rotateY: 0, rotateX: 0 }}
                  transition={{ duration: 1, delay: 0.3 }}
                  whileHover={{ scale: 1.02, rotateY: 5, rotateX: -2 }}
                  style={{ perspective: 1000 }}
                >
                  <div className="flex items-center justify-center mb-4">
                    <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
                      <Wallet className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
                    </div>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white text-center mb-4">
                    Salaried Overdraft
                  </h3>
                  <div className="space-y-3">
                    <motion.div
                      className="flex items-center space-x-3 bg-white/15 backdrop-blur-sm rounded-xl p-3"
                      whileHover={{ scale: 1.05, x: 10 }}
                    >
                      <CheckCircle className="w-6 h-6 text-white flex-shrink-0" />
                      <span className="text-white text-sm sm:text-base font-medium">Withdraw When You Need</span>
                    </motion.div>
                    <motion.div
                      className="flex items-center space-x-3 bg-white/15 backdrop-blur-sm rounded-xl p-3"
                      whileHover={{ scale: 1.05, x: 10 }}
                    >
                      <CheckCircle className="w-6 h-6 text-white flex-shrink-0" />
                      <span className="text-white text-sm sm:text-base font-medium">Pay Interest on Used Amount Only</span>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
              </motion.div>

              {/* Success Stories Statistics Card */}
              <motion.div
                className="bg-white rounded-2xl p-3 sm:p-4 shadow-lg border-2 border-green-200 mt-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3">Success Stories</h3>
                <div className="space-y-2">
                  <div className="text-center p-2 sm:p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                    <div className="text-xl sm:text-2xl font-bold text-green-600">15,000+</div>
                    <div className="text-xs text-gray-600">Active Users</div>
                  </div>
                  <div className="text-center p-2 sm:p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl">
                    <div className="text-xl sm:text-2xl font-bold text-emerald-600">₹750 Cr+</div>
                    <div className="text-xs text-gray-600">Credit Approved</div>
                  </div>
                  <div className="text-center p-2 sm:p-3 bg-gradient-to-r from-teal-50 to-green-50 rounded-xl">
                    <div className="text-xl sm:text-2xl font-bold text-teal-600">4.9/5</div>
                    <div className="text-xs text-gray-600">User Rating</div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* COLUMN 3: Application Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="lg:order-3 space-y-2"
              id="application-form"
            >
              <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-5 sticky top-24 max-w-sm mx-auto">
                {/* Withdraw Anytime Badge */}
                <div className="flex items-center justify-center mb-4">
                  <motion.div
                    className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2 rounded-full shadow-lg"
                    animate={{ rotateY: [0, 360] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  >
                    <div className="flex items-center space-x-2">
                      <Repeat className="w-5 h-5" />
                      <span className="font-bold text-sm">Withdraw Anytime</span>
                      <Repeat className="w-5 h-5" />
                    </div>
                  </motion.div>
                </div>

                <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 text-center">Start Your Journey to</h2>
                <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-6 text-center">Financial Flexibility!</h3>

                {/* Progress Indicator */}
                {formStep >= 2 && (
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      {['Personal', 'Employer', 'Office', 'Home', 'OD'].map((step, index) => (
                        <div key={index} className="flex items-center">
                          <motion.div
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                              formStep >= index + 2 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500'
                            }`}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                          >
                            {formStep > index + 2 ? <CheckCircle2 className="w-4 h-4" /> : index + 1}
                          </motion.div>
                          {index < 4 && (
                            <div className={`h-1 w-4 sm:w-8 ${formStep > index + 2 ? 'bg-green-600' : 'bg-gray-200'}`}></div>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between text-xs text-gray-600">
                      <span className="text-[10px] sm:text-xs">Personal</span>
                      <span className="text-[10px] sm:text-xs">Employer</span>
                      <span className="text-[10px] sm:text-xs">Office</span>
                      <span className="text-[10px] sm:text-xs">Home</span>
                      <span className="text-[10px] sm:text-xs">OD</span>
                    </div>
                  </div>
                )}

                {/* Thank You Message */}
                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-center py-8"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="mb-6"
                    >
                      <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 className="w-12 h-12 text-white" />
                      </div>
                    </motion.div>

                    <motion.h2
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                      className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4"
                    >
                      Thank You for Applying!
                    </motion.h2>

                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.6 }}
                      className="text-gray-700 text-base sm:text-lg mb-6"
                    >
                      Your application has been received successfully.
                      <br />
                      <span className="font-semibold text-green-600">Our team will call you soon!</span>
                    </motion.p>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.8 }}
                      className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border-2 border-green-200"
                    >
                      <p className="text-sm text-gray-700 mb-2">
                        <span className="font-semibold">Application ID:</span> SOD{Date.now().toString().slice(-8)}
                      </p>
                      <p className="text-sm text-gray-600">
                        Please keep this reference number for future communication.
                      </p>
                    </motion.div>
                  </motion.div>
                ) : authLoading ? (
                  <p className="text-center py-8 text-gray-600">Loading…</p>
                ) : !user ? (
                  <SupabaseAuthInline returnPath={pathname} />
                ) : (
                  <AnimatePresence mode="wait">
                    <motion.form
                      key={formStep}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      onSubmit={formStep === 0 ? handleContinueFromStep0 : handleSubmit}
                    >
                    {/* Step 0: Name + Mobile */}
                    {formStep === 0 && (
                      <div className="space-y-4">
                        <h3 className="text-base font-semibold text-green-700 mb-3">Get Started</h3>

                        {/* Full Name */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                              type="text"
                              value={formData.fullName}
                              onChange={(e) => handleInputChange('fullName', e.target.value)}
                              className="w-full pl-11 pr-4 py-3 text-sm border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                              placeholder="Enter your full name"
                              required
                            />
                          </div>
                        </div>

                        {/* Mobile Number */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Mobile Number *</label>
                          <div className="flex gap-2">
                            <div className="flex items-center px-3 py-3 text-sm border-2 border-gray-300 rounded-xl bg-gray-50 font-semibold text-gray-700 min-w-[80px]">
                              <Phone className="w-4 h-4 mr-1.5 text-gray-500" />
                              +91
                            </div>
                            <input
                              type="tel"
                              value={formData.mobile}
                              onChange={(e) => handleInputChange('mobile', e.target.value.replace(/\D/g, '').slice(0, 10))}
                              className="flex-1 px-4 py-3 text-sm border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                              placeholder="10-digit mobile number"
                              pattern="[0-9]{10}"
                              maxLength={10}
                              required
                            />
                          </div>
                        </div>

                        <p className="text-xs text-gray-500 text-center leading-relaxed">
                          By continuing, you agree to our{' '}
                          <a href="/terms" className="text-green-600 hover:underline font-semibold">Terms & Conditions</a>
                          {' '}and{' '}
                          <a href="/privacy" className="text-green-600 hover:underline font-semibold">Privacy Policy</a>
                        </p>

                        <motion.button
                          type="submit"
                          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-full font-semibold hover:from-green-700 hover:to-emerald-700 shadow-lg text-sm flex items-center justify-center space-x-2"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <span>Continue</span>
                          <ArrowRight className="w-5 h-5" />
                        </motion.button>
                      </div>
                    )}

                    {/* Step 2: Personal Details */}
                    {formStep === 2 && (
                      <div className="space-y-4">
                        <h3 className="text-base font-semibold text-green-700 mb-3">Personal Details</h3>

                        {/* Email */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                              type="email"
                              value={formData.email}
                              onChange={(e) => handleInputChange('email', e.target.value)}
                              className="w-full pl-11 pr-4 py-3 text-sm border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                              placeholder="your.email@example.com"
                              required
                            />
                          </div>
                        </div>

                        {/* PAN Card */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">PAN Card *</label>
                          <div className="relative">
                            <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                              type="text"
                              value={formData.panCard}
                              onChange={(e) => handleInputChange('panCard', e.target.value.toUpperCase())}
                              className="w-full pl-11 pr-4 py-3 text-sm border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent uppercase transition-all"
                              placeholder="ABCDE1234F"
                              pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
                              maxLength={10}
                              required
                            />
                          </div>
                        </div>

                        {/* Date of Birth */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Date of Birth *</label>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                              type="date"
                              value={formData.dob}
                              onChange={(e) => handleInputChange('dob', e.target.value)}
                              className="w-full pl-11 pr-4 py-3 text-sm border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                              required
                            />
                          </div>
                        </div>

                        {/* Gender */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Gender *</label>
                          <select
                            value={formData.gender}
                            onChange={(e) => handleInputChange('gender', e.target.value)}
                            className="w-full px-4 py-3 text-sm border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                            required
                          >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>

                        {/* Marital Status */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Marital Status *</label>
                          <select
                            value={formData.maritalStatus}
                            onChange={(e) => handleInputChange('maritalStatus', e.target.value)}
                            className="w-full px-4 py-3 text-sm border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                            required
                          >
                            <option value="">Select Status</option>
                            <option value="Single">Single</option>
                            <option value="Married">Married</option>
                            <option value="Divorced">Divorced</option>
                            <option value="Widowed">Widowed</option>
                          </select>
                        </div>

                        <div className="flex space-x-3">
                          <button
                            type="button"
                            onClick={handlePrevStep}
                            className="flex-1 bg-gray-200 text-gray-700 px-4 py-3 rounded-full font-semibold hover:bg-gray-300 transition-all text-sm"
                          >
                            ← Previous
                          </button>
                          <button
                            type="button"
                            onClick={handleNextStep}
                            className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-3 rounded-full font-semibold hover:from-green-700 hover:to-emerald-700 shadow-lg text-sm"
                          >
                            Next: Employer →
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Step 3: Employer Details */}
                    {formStep === 3 && (
                      <div className="space-y-4">
                        <h3 className="text-base font-semibold text-green-700 mb-3">Employer Details</h3>

                        {/* Company Name with Autocomplete */}
                        <div className="relative">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Company Name *</label>
                          <div className="relative">
                            <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                            <input
                              type="text"
                              value={formData.companyName}
                              onChange={(e) => {
                                handleInputChange('companyName', e.target.value);
                                setShowCompanySuggestions(true);
                              }}
                              onFocus={() => setShowCompanySuggestions(true)}
                              className="w-full pl-11 pr-4 py-3 text-sm border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                              placeholder="Start typing company name"
                              required
                            />
                          </div>
                          {showCompanySuggestions && formData.companyName && filterCompanies(formData.companyName).length > 0 && (
                            <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                              {filterCompanies(formData.companyName).map((company, index) => (
                                <div
                                  key={index}
                                  onClick={() => {
                                    handleInputChange('companyName', company);
                                    setShowCompanySuggestions(false);
                                  }}
                                  className="px-3 py-2 hover:bg-green-50 cursor-pointer text-sm"
                                >
                                  {company}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Company Type with Autocomplete */}
                        <div className="relative">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Company Type *</label>
                          <div className="relative">
                            <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                            <input
                              type="text"
                              value={formData.companyType}
                              onChange={(e) => {
                                handleInputChange('companyType', e.target.value);
                                setShowCompanyTypeSuggestions(true);
                              }}
                              onFocus={() => setShowCompanyTypeSuggestions(true)}
                              className="w-full pl-11 pr-4 py-3 text-sm border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                              placeholder="Select company type"
                              required
                            />
                          </div>
                          {showCompanyTypeSuggestions && filterCompanyTypes(formData.companyType).length > 0 && (
                            <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                              {filterCompanyTypes(formData.companyType).map((type, index) => (
                                <div
                                  key={index}
                                  onClick={() => {
                                    handleInputChange('companyType', type);
                                    setShowCompanyTypeSuggestions(false);
                                  }}
                                  className="px-3 py-2 hover:bg-green-50 cursor-pointer text-sm"
                                >
                                  {type}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Designation */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Designation *</label>
                          <div className="relative">
                            <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                              type="text"
                              value={formData.designation}
                              onChange={(e) => handleInputChange('designation', e.target.value)}
                              className="w-full pl-11 pr-4 py-3 text-sm border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                              placeholder="Your job title"
                              required
                            />
                          </div>
                        </div>

                        {/* Net Salary */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Monthly Net Salary *</label>
                          <div className="relative">
                            <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                              type="number"
                              value={formData.netSalary}
                              onChange={(e) => handleInputChange('netSalary', e.target.value)}
                              className="w-full pl-11 pr-4 py-3 text-sm border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                              placeholder="Enter monthly net salary"
                              required
                            />
                          </div>
                          {formData.netSalary && (
                            <p className="text-xs text-green-600 mt-1">
                              Maximum OD Limit: ₹{maxODLimit.toLocaleString('en-IN')} (3x salary)
                            </p>
                          )}
                        </div>

                        {/* Work Email */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Work Email (Optional)</label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                              type="email"
                              value={formData.workEmail}
                              onChange={(e) => handleInputChange('workEmail', e.target.value)}
                              className="w-full pl-11 pr-4 py-3 text-sm border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                              placeholder="work.email@company.com"
                            />
                          </div>
                        </div>

                        <div className="flex space-x-3">
                          <button
                            type="button"
                            onClick={handlePrevStep}
                            className="flex-1 bg-gray-200 text-gray-700 px-4 py-3 rounded-full font-semibold hover:bg-gray-300 transition-all text-sm"
                          >
                            ← Previous
                          </button>
                          <button
                            type="button"
                            onClick={handleNextStep}
                            className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-3 rounded-full font-semibold hover:from-green-700 hover:to-emerald-700 shadow-lg text-sm"
                          >
                            Next: Office Address →
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Step 4: Office Address */}
                    {formStep === 4 && (
                      <div className="space-y-4">
                        <h3 className="text-base font-semibold text-green-700 mb-3">Office Address</h3>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Office Address *</label>
                          <div className="relative">
                            <Building2 className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                            <textarea
                              value={formData.officeAddress}
                              onChange={(e) => handleInputChange('officeAddress', e.target.value)}
                              className="w-full pl-11 pr-4 py-3 text-sm border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                              placeholder="Building/Floor, Street, Area"
                              rows={2}
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Landmark</label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                              type="text"
                              value={formData.officeLandmark}
                              onChange={(e) => handleInputChange('officeLandmark', e.target.value)}
                              className="w-full pl-11 pr-4 py-3 text-sm border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                              placeholder="Nearby landmark"
                            />
                          </div>
                        </div>

                        <div className="relative">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">City *</label>
                          <input
                            type="text"
                            value={formData.officeCity}
                            onChange={(e) => {
                              handleInputChange('officeCity', e.target.value);
                              setShowCitySuggestions(prev => ({ ...prev, office: true }));
                            }}
                            onFocus={() => setShowCitySuggestions(prev => ({ ...prev, office: true }))}
                            className="w-full px-4 py-3 text-sm border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                            placeholder="Enter city"
                            required
                          />
                          {showCitySuggestions.office && formData.officeCity && filterCities(formData.officeCity).length > 0 && (
                            <div className="absolute z-20 w-full mt-1 bg-white border-2 border-gray-300 rounded-xl shadow-lg max-h-40 overflow-y-auto">
                              {filterCities(formData.officeCity).map((city, index) => (
                                <div
                                  key={index}
                                  onClick={() => {
                                    handleInputChange('officeCity', city);
                                    setShowCitySuggestions(prev => ({ ...prev, office: false }));
                                  }}
                                  className="px-4 py-2 hover:bg-green-50 cursor-pointer text-sm"
                                >
                                  {city}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="relative">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">State *</label>
                          <input
                            type="text"
                            value={formData.officeState}
                            onChange={(e) => {
                              handleInputChange('officeState', e.target.value);
                              setShowStateSuggestions(prev => ({ ...prev, office: true }));
                            }}
                            onFocus={() => setShowStateSuggestions(prev => ({ ...prev, office: true }))}
                            className="w-full px-4 py-3 text-sm border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                            placeholder="Enter state"
                            required
                          />
                          {showStateSuggestions.office && formData.officeState && filterStates(formData.officeState).length > 0 && (
                            <div className="absolute z-20 w-full mt-1 bg-white border-2 border-gray-300 rounded-xl shadow-lg max-h-40 overflow-y-auto">
                              {filterStates(formData.officeState).map((state, index) => (
                                <div
                                  key={index}
                                  onClick={() => {
                                    handleInputChange('officeState', state);
                                    setShowStateSuggestions(prev => ({ ...prev, office: false }));
                                  }}
                                  className="px-4 py-2 hover:bg-green-50 cursor-pointer text-sm"
                                >
                                  {state}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Pincode *</label>
                          <input
                            type="text"
                            value={formData.officePincode}
                            onChange={(e) => handleInputChange('officePincode', e.target.value.replace(/\D/g, '').slice(0, 6))}
                            className="w-full px-4 py-3 text-sm border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                            placeholder="6-digit pincode"
                            pattern="[0-9]{6}"
                            maxLength={6}
                            required
                          />
                        </div>

                        <div className="flex space-x-3">
                          <button
                            type="button"
                            onClick={handlePrevStep}
                            className="flex-1 bg-gray-200 text-gray-700 px-4 py-3 rounded-full font-semibold hover:bg-gray-300 transition-all text-sm"
                          >
                            ← Previous
                          </button>
                          <button
                            type="button"
                            onClick={handleNextStep}
                            className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-3 rounded-full font-semibold hover:from-green-700 hover:to-emerald-700 shadow-lg text-sm"
                          >
                            Next: Home Address →
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Step 5: Home Address Details */}
                    {formStep === 5 && (
                      <div className="space-y-4">
                        <h3 className="text-base font-semibold text-green-700 mb-3">Home Address Details</h3>

                        {/* Residence Type */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Residence Type *</label>
                          <select
                            value={formData.residenceType}
                            onChange={(e) => handleInputChange('residenceType', e.target.value)}
                            className="w-full px-4 py-3 text-sm border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                            required
                          >
                            <option value="">Select Residence Type</option>
                            <option value="Owned">Owned</option>
                            <option value="Owned by Parents">Owned by Parents</option>
                            <option value="Rented">Rented</option>
                            <option value="Company Provided">Company Provided</option>
                          </select>
                        </div>

                        {/* Current Address */}
                        <div className="bg-green-50 p-4 rounded-xl">
                          <h4 className="text-sm font-semibold text-green-700 mb-3">Current Address</h4>

                          <div className="space-y-3">
                            {/* Address */}
                            <div>
                              <label className="block text-xs font-semibold text-gray-700 mb-1">Address *</label>
                              <div className="relative">
                                <Home className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                <textarea
                                  value={formData.currentAddress}
                                  onChange={(e) => handleInputChange('currentAddress', e.target.value)}
                                  className="w-full pl-10 pr-3 py-2 text-sm border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                  placeholder="House/Flat No., Street, Area"
                                  rows={2}
                                  required
                                />
                              </div>
                            </div>

                            {/* Landmark */}
                            <div>
                              <label className="block text-xs font-semibold text-gray-700 mb-1">Landmark</label>
                              <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                  type="text"
                                  value={formData.currentLandmark}
                                  onChange={(e) => handleInputChange('currentLandmark', e.target.value)}
                                  className="w-full pl-10 pr-3 py-2 text-sm border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                  placeholder="Nearby landmark"
                                />
                              </div>
                            </div>

                            {/* City */}
                            <div className="relative">
                              <label className="block text-xs font-semibold text-gray-700 mb-1">City *</label>
                              <input
                                type="text"
                                value={formData.currentCity}
                                onChange={(e) => {
                                  handleInputChange('currentCity', e.target.value);
                                  setShowCitySuggestions(prev => ({ ...prev, current: true }));
                                }}
                                onFocus={() => setShowCitySuggestions(prev => ({ ...prev, current: true }))}
                                className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                placeholder="Enter city"
                                required
                              />
                              {showCitySuggestions.current && formData.currentCity && filterCities(formData.currentCity).length > 0 && (
                                <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                                  {filterCities(formData.currentCity).map((city, index) => (
                                    <div
                                      key={index}
                                      onClick={() => {
                                        handleInputChange('currentCity', city);
                                        setShowCitySuggestions(prev => ({ ...prev, current: false }));
                                      }}
                                      className="px-3 py-2 hover:bg-green-50 cursor-pointer text-sm"
                                    >
                                      {city}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* State */}
                            <div className="relative">
                              <label className="block text-xs font-semibold text-gray-700 mb-1">State *</label>
                              <input
                                type="text"
                                value={formData.currentState}
                                onChange={(e) => {
                                  handleInputChange('currentState', e.target.value);
                                  setShowStateSuggestions(prev => ({ ...prev, current: true }));
                                }}
                                onFocus={() => setShowStateSuggestions(prev => ({ ...prev, current: true }))}
                                className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                placeholder="Enter state"
                                required
                              />
                              {showStateSuggestions.current && formData.currentState && filterStates(formData.currentState).length > 0 && (
                                <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                                  {filterStates(formData.currentState).map((state, index) => (
                                    <div
                                      key={index}
                                      onClick={() => {
                                        handleInputChange('currentState', state);
                                        setShowStateSuggestions(prev => ({ ...prev, current: false }));
                                      }}
                                      className="px-3 py-2 hover:bg-green-50 cursor-pointer text-sm"
                                    >
                                      {state}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Pincode */}
                            <div>
                              <label className="block text-xs font-semibold text-gray-700 mb-1">Pincode *</label>
                              <input
                                type="text"
                                value={formData.currentPincode}
                                onChange={(e) => handleInputChange('currentPincode', e.target.value.replace(/\D/g, '').slice(0, 6))}
                                className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                placeholder="6-digit pincode"
                                pattern="[0-9]{6}"
                                maxLength={6}
                                required
                              />
                            </div>
                          </div>
                        </div>

                        {/* Permanent Address - Conditional */}
                        {(formData.residenceType === 'Rented' || formData.residenceType === 'Company Provided') && (
                          <div className="bg-purple-50 p-4 rounded-xl">
                            <h4 className="text-sm font-semibold text-purple-700 mb-3">Permanent Address</h4>

                            <div className="space-y-3">
                              {/* Address */}
                              <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Address *</label>
                                <div className="relative">
                                  <Home className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                  <textarea
                                    value={formData.permanentAddress}
                                    onChange={(e) => handleInputChange('permanentAddress', e.target.value)}
                                    className="w-full pl-10 pr-3 py-2 text-sm border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                    placeholder="House/Flat No., Street, Area"
                                    rows={2}
                                    required
                                  />
                                </div>
                              </div>

                              {/* Landmark */}
                              <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Landmark</label>
                                <div className="relative">
                                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                  <input
                                    type="text"
                                    value={formData.permanentLandmark}
                                    onChange={(e) => handleInputChange('permanentLandmark', e.target.value)}
                                    className="w-full pl-10 pr-3 py-2 text-sm border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                    placeholder="Nearby landmark"
                                  />
                                </div>
                              </div>

                              {/* City */}
                              <div className="relative">
                                <label className="block text-xs font-semibold text-gray-700 mb-1">City *</label>
                                <input
                                  type="text"
                                  value={formData.permanentCity}
                                  onChange={(e) => {
                                    handleInputChange('permanentCity', e.target.value);
                                    setShowCitySuggestions(prev => ({ ...prev, permanent: true }));
                                  }}
                                  onFocus={() => setShowCitySuggestions(prev => ({ ...prev, permanent: true }))}
                                  className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                  placeholder="Enter city"
                                  required
                                />
                                {showCitySuggestions.permanent && formData.permanentCity && filterCities(formData.permanentCity).length > 0 && (
                                  <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                                    {filterCities(formData.permanentCity).map((city, index) => (
                                      <div
                                        key={index}
                                        onClick={() => {
                                          handleInputChange('permanentCity', city);
                                          setShowCitySuggestions(prev => ({ ...prev, permanent: false }));
                                        }}
                                        className="px-3 py-2 hover:bg-purple-50 cursor-pointer text-sm"
                                      >
                                        {city}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>

                              {/* State */}
                              <div className="relative">
                                <label className="block text-xs font-semibold text-gray-700 mb-1">State *</label>
                                <input
                                  type="text"
                                  value={formData.permanentState}
                                  onChange={(e) => {
                                    handleInputChange('permanentState', e.target.value);
                                    setShowStateSuggestions(prev => ({ ...prev, permanent: true }));
                                  }}
                                  onFocus={() => setShowStateSuggestions(prev => ({ ...prev, permanent: true }))}
                                  className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                  placeholder="Enter state"
                                  required
                                />
                                {showStateSuggestions.permanent && formData.permanentState && filterStates(formData.permanentState).length > 0 && (
                                  <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                                    {filterStates(formData.permanentState).map((state, index) => (
                                      <div
                                        key={index}
                                        onClick={() => {
                                          handleInputChange('permanentState', state);
                                          setShowStateSuggestions(prev => ({ ...prev, permanent: false }));
                                        }}
                                        className="px-3 py-2 hover:bg-purple-50 cursor-pointer text-sm"
                                      >
                                        {state}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>

                              {/* Pincode */}
                              <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Pincode *</label>
                                <input
                                  type="text"
                                  value={formData.permanentPincode}
                                  onChange={(e) => handleInputChange('permanentPincode', e.target.value.replace(/\D/g, '').slice(0, 6))}
                                  className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                  placeholder="6-digit pincode"
                                  pattern="[0-9]{6}"
                                  maxLength={6}
                                  required
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Auto-fill message */}
                        {(formData.residenceType === 'Owned' || formData.residenceType === 'Owned by Parents') && (
                          <div className="bg-green-50 p-3 rounded-xl border-2 border-green-200">
                            <p className="text-sm text-green-700 flex items-center space-x-2">
                              <CheckCircle className="w-5 h-5" />
                              <span>Current address will be used as permanent address</span>
                            </p>
                          </div>
                        )}

                        <div className="flex space-x-3">
                          <button
                            type="button"
                            onClick={handlePrevStep}
                            className="flex-1 bg-gray-200 text-gray-700 px-4 py-3 rounded-full font-semibold hover:bg-gray-300 transition-all text-sm"
                          >
                            ← Previous
                          </button>
                          <button
                            type="button"
                            onClick={handleNextStep}
                            className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-3 rounded-full font-semibold hover:from-green-700 hover:to-emerald-700 shadow-lg text-sm"
                          >
                            Next: OD Details →
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Step 6: Overdraft Details */}
                    {formStep === 6 && (
                      <div className="space-y-4">
                        <h3 className="text-base font-semibold text-green-700 mb-3">Overdraft Details</h3>

                        {/* Desired OD Limit */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Desired OD Limit *</label>
                          <div className="relative">
                            <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                              type="number"
                              value={formData.desiredODLimit}
                              onChange={(e) => handleInputChange('desiredODLimit', e.target.value)}
                              className="w-full pl-11 pr-4 py-3 text-sm border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                              placeholder="Enter desired OD limit"
                              required
                            />
                          </div>
                          {maxODLimit > 0 && (
                            <p className="text-xs text-gray-500 mt-1">
                              Maximum eligible: ₹{maxODLimit.toLocaleString('en-IN')}
                            </p>
                          )}
                        </div>

                        {/* Purpose of OD */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Purpose of Overdraft *</label>
                          <select
                            value={formData.purposeOfOD}
                            onChange={(e) => handleInputChange('purposeOfOD', e.target.value)}
                            className="w-full px-4 py-3 text-sm border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                            required
                          >
                            <option value="">Select Purpose</option>
                            <option value="Emergency Medical Expenses">Emergency Medical Expenses</option>
                            <option value="Home Renovation">Home Renovation</option>
                            <option value="Wedding Expenses">Wedding Expenses</option>
                            <option value="Education Fees">Education Fees</option>
                            <option value="Travel">Travel</option>
                            <option value="Debt Payment">Debt Payment</option>
                            <option value="Business Expenses">Business Expenses</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>

                        {/* OD Summary */}
                        {formData.desiredODLimit && (
                          <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-4 rounded-xl border-2 border-green-300">
                            <h4 className="text-sm font-semibold text-gray-700 mb-2">Your OD Summary</h4>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">OD Limit:</span>
                                <span className="font-bold text-green-700">₹{Number(formData.desiredODLimit).toLocaleString('en-IN')}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Interest Rate:</span>
                                <span className="font-bold text-green-700">12% p.a.*</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Repayment:</span>
                                <span className="font-bold text-green-700">Flexible</span>
                              </div>
                            </div>
                          </div>
                        )}

                        <p className="text-xs text-gray-500 text-center">
                          By submitting, you agree to our{' '}
                          <a href="/terms" className="text-green-600 hover:underline">Terms & Conditions</a>
                        </p>

                        <div className="flex space-x-3">
                          <button
                            type="button"
                            onClick={handlePrevStep}
                            className="flex-1 bg-gray-200 text-gray-700 px-4 py-3 rounded-full font-semibold hover:bg-gray-300 transition-all text-sm"
                          >
                            ← Previous
                          </button>
                          <button
                            type="submit"
                            className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-3 rounded-full font-semibold hover:from-green-700 hover:to-emerald-700 shadow-lg text-sm flex items-center justify-center space-x-2"
                          >
                            <span>Submit Application</span>
                            <CheckCircle className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </motion.form>
                </AnimatePresence>
                )}
              </div>

            </motion.div>
          </div>
          {/* End of 3-column grid */}

          {/* Additional Benefits Section - Full Width Below */}
          <div className="mb-8 sm:mb-12">
            {/* RIGHT: Additional Benefits */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 bg-white px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-gray-800 mb-8">
            Why Choose <span className="text-green-600">Salaried Overdraft</span>?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Clock, title: 'Instant Access', desc: '24/7 access to your approved OD limit whenever you need it', color: 'green' },
              { icon: Shield, title: '100% Secure', desc: 'Your data is encrypted and completely secure with us', color: 'emerald' },
              { icon: CheckCircle, title: 'Pay Only on Usage', desc: 'Interest charged only on the amount you actually use', color: 'teal' },
              { icon: Users, title: 'Expert Support', desc: 'Dedicated advisors to help you manage your OD facility', color: 'green' },
              { icon: Award, title: 'Flexible Repayment', desc: 'No fixed EMIs - repay as per your convenience', color: 'emerald' },
              { icon: TrendingUp, title: 'Higher Limits', desc: 'Get up to 3x your monthly salary as overdraft limit', color: 'teal' }
            ].map((feature, index) => {
              const colorMap: any = {
                green: { bg: 'from-green-50 to-emerald-50', icon: 'bg-green-600', hover: 'hover:shadow-green-200' },
                emerald: { bg: 'from-emerald-50 to-teal-50', icon: 'bg-emerald-600', hover: 'hover:shadow-emerald-200' },
                teal: { bg: 'from-teal-50 to-green-50', icon: 'bg-teal-600', hover: 'hover:shadow-teal-200' }
              };

              const colors = colorMap[feature.color];

              return (
                <motion.div
                  key={index}
                  className={`bg-gradient-to-br ${colors.bg} p-6 rounded-2xl shadow-lg ${colors.hover} transition-all duration-300`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, rotateY: 5 }}
                  style={{ perspective: 1000 }}
                >
                  <div className={`${colors.icon} w-12 h-12 rounded-full flex items-center justify-center mb-4`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-12 sm:py-16 bg-gradient-to-br from-green-50 to-emerald-50 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-gray-800 mb-8">
            Frequently Asked <span className="text-green-600">Questions</span>
          </h2>
          <div className="space-y-4">
            {[
              {
                q: 'What is a salaried overdraft facility?',
                a: 'A salaried overdraft facility is a revolving credit line provided to salaried individuals where you can withdraw money as needed up to your approved limit and pay interest only on the amount used.'
              },
              {
                q: 'How much OD limit can I get?',
                a: 'You can get an overdraft limit up to 3 times your monthly net salary, subject to your credit profile and eligibility criteria.'
              },
              {
                q: 'How is interest calculated?',
                a: 'Interest is calculated daily on the amount you actually use. For example, if you use ₹50,000 for 30 days at 12% p.a., you\'ll only pay interest on ₹50,000 for those 30 days.'
              },
              {
                q: 'Is there any prepayment penalty?',
                a: 'No, there are no prepayment or foreclosure charges. You can repay the utilized amount anytime without any penalty.'
              },
              {
                q: 'What documents are required?',
                a: 'Basic documents include PAN Card, Aadhaar Card, 3 months salary slips, 6 months bank statements, and proof of current address.'
              }
            ].map((faq, index) => (
              <motion.details
                key={index}
                className="bg-white rounded-xl shadow-md p-4 group"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <summary className="text-base font-semibold text-gray-800 cursor-pointer list-none flex justify-between items-center">
                  {faq.q}
                  <ChevronDown className="w-5 h-5 text-green-600 group-open:rotate-180 transition-transform" />
                </summary>
                <p className="text-sm text-gray-600 mt-3">
                  {faq.a}
                </p>
              </motion.details>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-green-900 to-emerald-900 text-white py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm mb-2">© 2024 KreditScore. All rights reserved.</p>
          <p className="text-xs text-green-200">Flexible credit at your fingertips - Your trusted overdraft partner.</p>
        </div>
      </footer>
    </div>
  );
}
