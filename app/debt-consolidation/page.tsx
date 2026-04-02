'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';
import CustomCursor from '@/components/CustomCursor';
import {
  TrendingUp,
  TrendingDown,
  CreditCard,
  Wallet,
  Smartphone,
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
  ArrowRight,
  ArrowLeft,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { getSupabaseDisplayName, getSupabasePhoneDigits } from '@/lib/supabase/user';

export default function DebtConsolidationPage() {
  const { user } = useAuth();
  // 0: Name+Mobile, 2: Personal … 6: Loan Details (login optional for prefill)
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
    netSalary: '',
    workEmail: '',
    designation: '',
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
    // Loan Details
    personalLoanAmount: '',
    creditCardDebt: '',
    appsLoanAmount: '',
    overdraftAmount: '',
    desiredSingleEMI: ''
  });

  // Autocomplete States
  const [showCitySuggestions, setShowCitySuggestions] = useState({ current: false, permanent: false, office: false });
  const [showStateSuggestions, setShowStateSuggestions] = useState({ current: false, permanent: false, office: false });
  const [showCompanySuggestions, setShowCompanySuggestions] = useState(false);

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

  // Form Handlers
  const handleInputChange = (field: string, value: string) => {
    if (field === 'fullName') {
      // Capitalize first letter of each word
      value = value.replace(/\b\w/g, (char) => char.toUpperCase());
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

  // Calculate total debt
  const totalDebt = (Number(formData.personalLoanAmount) || 0) +
                     (Number(formData.creditCardDebt) || 0) +
                     (Number(formData.appsLoanAmount) || 0) +
                     (Number(formData.overdraftAmount) || 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-fuchsia-50">
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FinancialProduct",
            "name": "Debt Consolidation Loan",
            "description": "Consolidate your Personal Loan, Credit Card, Apps Loan & Overdraft into one single EMI with lower interest rates",
            "provider": {
              "@type": "FinancialService",
              "name": "KreditScore"
            },
            "interestRate": "10.25% p.a. onwards",
            "feesAndCommissionsSpecification": "Processing fee: 2% of loan amount",
            "url": "https://www.kreditscore.in/debt-consolidation"
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
              <span className="bg-gradient-to-r from-pink-600 to-fuchsia-600 bg-clip-text text-transparent">
                Simplify Your Finances!
              </span>
              <br />
              <span className="text-purple-700">One Loan, One EMI</span>
            </motion.h1>
            <motion.p
              className="text-sm sm:text-lg md:text-xl lg:text-2xl text-gray-700 mb-2 sm:mb-3 px-2 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Stop Juggling Multiple EMIs - Consolidate All Debts into One EMI
            </motion.p>
            <motion.p
              className="text-xs sm:text-base md:text-lg text-pink-600 font-semibold px-2 leading-tight"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              Save Up to 50% on Monthly EMI | Interest starting from 9% p.a.*
            </motion.p>
          </motion.div>

          {/* Consolidate These Debts Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-8 sm:mb-12"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-6 sm:mb-8 text-gray-800">
              Consolidate These Debts
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {/* Personal Loans */}
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 shadow-xl"
              >
                <div className="text-white text-center">
                  <div className="mb-3">
                    <CreditCard className="w-10 h-10 mx-auto" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold mb-2">Personal Loans</h3>
                  <div className="text-2xl sm:text-3xl font-bold mb-1">14-18%</div>
                  <p className="text-sm opacity-90">Interest Rate</p>
                </div>
              </motion.div>

              {/* Credit Cards */}
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 shadow-xl"
              >
                <div className="text-white text-center">
                  <div className="mb-3">
                    <Wallet className="w-10 h-10 mx-auto" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold mb-2">Credit Cards</h3>
                  <div className="text-2xl sm:text-3xl font-bold mb-1">Up to 45%</div>
                  <p className="text-sm opacity-90">Interest Rate</p>
                </div>
              </motion.div>

              {/* App Loans */}
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 shadow-xl"
              >
                <div className="text-white text-center">
                  <div className="mb-3">
                    <Smartphone className="w-10 h-10 mx-auto" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold mb-2">App Loans</h3>
                  <div className="text-2xl sm:text-3xl font-bold mb-1">18-24%</div>
                  <p className="text-sm opacity-90">Interest Rate</p>
                </div>
              </motion.div>

              {/* Overdrafts */}
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 shadow-xl"
              >
                <div className="text-white text-center">
                  <div className="mb-3">
                    <TrendingDown className="w-10 h-10 mx-auto" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold mb-2">Overdrafts</h3>
                  <div className="text-2xl sm:text-3xl font-bold mb-1">12-15%</div>
                  <p className="text-sm opacity-90">Interest Rate</p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Main Grid: 2 Columns Layout (Content Only) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12">

            {/* LEFT: Content Section with 3D Cards */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-6 sm:space-y-8 order-1"
            >
              {/* 3D Feature Card */}
              <motion.div
                className="relative group"
                initial={{ opacity: 0, rotateY: -30 }}
                animate={{ opacity: 1, rotateY: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                whileHover={{ rotateY: 5, rotateX: 5 }}
                style={{ perspective: 1000, transformStyle: 'preserve-3d' }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-fuchsia-400 rounded-3xl blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-500"></div>
                <div className="relative bg-gradient-to-br from-pink-500 via-fuchsia-500 to-purple-600 rounded-3xl p-6 sm:p-8 shadow-2xl">
                  <div className="flex items-center justify-center mb-4">
                    <motion.div
                      className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl"
                      animate={{ rotateY: [0, 360] }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    >
                      <TrendingUp className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
                    </motion.div>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-4">
                    Debt Consolidation Loan
                  </h2>
                  <div className="space-y-3">
                    <motion.div
                      className="flex items-center space-x-3 bg-white/15 backdrop-blur-sm rounded-xl p-3"
                      whileHover={{ scale: 1.05, x: 10 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <CheckCircle className="w-6 h-6 text-white flex-shrink-0" />
                      <span className="text-white text-sm sm:text-base font-medium">Combine All Debts into One EMI</span>
                    </motion.div>
                    <motion.div
                      className="flex items-center space-x-3 bg-white/15 backdrop-blur-sm rounded-xl p-3"
                      whileHover={{ scale: 1.05, x: 10 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <CheckCircle className="w-6 h-6 text-white flex-shrink-0" />
                      <span className="text-white text-sm sm:text-base font-medium">Reduce EMI by 50%</span>
                    </motion.div>
                  </div>
                </div>
              </motion.div>

              {/* Debt Types Grid */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-xl">
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">Consolidate These Debts:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <motion.div
                    className="flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl"
                    whileHover={{ scale: 1.05, rotateZ: 2 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Wallet className="w-6 h-6 text-blue-600" />
                    <div>
                      <p className="text-sm font-semibold text-gray-800">Personal Loans</p>
                      <p className="text-xs text-gray-600">14-18% interest</p>
                    </div>
                  </motion.div>
                  <motion.div
                    className="flex items-center space-x-3 p-3 bg-gradient-to-r from-red-50 to-red-100 rounded-xl"
                    whileHover={{ scale: 1.05, rotateZ: 2 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <CreditCard className="w-6 h-6 text-red-600" />
                    <div>
                      <p className="text-sm font-semibold text-gray-800">Credit Cards</p>
                      <p className="text-xs text-gray-600">Up to 45% interest</p>
                    </div>
                  </motion.div>
                  <motion.div
                    className="flex items-center space-x-3 p-3 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl"
                    whileHover={{ scale: 1.05, rotateZ: 2 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Smartphone className="w-6 h-6 text-orange-600" />
                    <div>
                      <p className="text-sm font-semibold text-gray-800">App Loans</p>
                      <p className="text-xs text-gray-600">18-24% interest</p>
                    </div>
                  </motion.div>
                  <motion.div
                    className="flex items-center space-x-3 p-3 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl"
                    whileHover={{ scale: 1.05, rotateZ: 2 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                    <div>
                      <p className="text-sm font-semibold text-gray-800">Overdrafts</p>
                      <p className="text-xs text-gray-600">12-15% interest</p>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Benefits Section */}
              <motion.div
                className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-5 sm:p-6 shadow-lg"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <h3 className="text-lg sm:text-xl font-bold text-purple-800 mb-4">Why Choose Debt Consolidation?</h3>
                <ul className="space-y-3">
                  {[
                    'Reduce monthly EMI burden by up to 50%',
                    'One single EMI instead of multiple payments',
                    'Significantly lower interest rates (9% to 14%)',
                    'Improve credit score with timely payments',
                    'Better cash flow and financial management',
                    'No prepayment penalties or hidden charges',
                    'Quick approval in 24 hours'
                  ].map((benefit, index) => (
                    <motion.li
                      key={index}
                      className="flex items-start space-x-2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.9 + (index * 0.1) }}
                    >
                      <CheckCircle className="w-5 h-5 text-pink-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{benefit}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </motion.div>

            {/* RIGHT: Additional Benefits */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="space-y-6 sm:space-y-8 order-2"
            >
              {/* Quick Benefits Card */}
              <motion.div
                className="bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 rounded-3xl p-6 sm:p-8 shadow-2xl"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">Quick Benefits</h3>
                <ul className="space-y-3">
                  <li className="flex items-start text-white">
                    <CheckCircle2 className="w-5 h-5 mr-2 flex-shrink-0 mt-1" />
                    <span className="text-sm sm:text-base">No Prepayment Charges</span>
                  </li>
                  <li className="flex items-start text-white">
                    <CheckCircle2 className="w-5 h-5 mr-2 flex-shrink-0 mt-1" />
                    <span className="text-sm sm:text-base">Flexible Tenure Options</span>
                  </li>
                  <li className="flex items-start text-white">
                    <CheckCircle2 className="w-5 h-5 mr-2 flex-shrink-0 mt-1" />
                    <span className="text-sm sm:text-base">100% Digital Process</span>
                  </li>
                  <li className="flex items-start text-white">
                    <CheckCircle2 className="w-5 h-5 mr-2 flex-shrink-0 mt-1" />
                    <span className="text-sm sm:text-base">24/7 Customer Support</span>
                  </li>
                </ul>
              </motion.div>

              {/* Stats Card */}
              <motion.div
                className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-pink-200"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">Our Impact</h3>
                <div className="space-y-4">
                  <div className="text-center p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl">
                    <div className="text-2xl sm:text-3xl font-bold text-pink-600">10,000+</div>
                    <div className="text-xs sm:text-sm text-gray-600">Happy Customers</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                    <div className="text-2xl sm:text-3xl font-bold text-purple-600">₹500 Cr+</div>
                    <div className="text-xs sm:text-sm text-gray-600">Loans Disbursed</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-r from-pink-50 to-fuchsia-50 rounded-xl">
                    <div className="text-2xl sm:text-3xl font-bold text-fuchsia-600">4.8/5</div>
                    <div className="text-xs sm:text-sm text-gray-600">Customer Rating</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Application Form Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="max-w-2xl mx-auto"
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 overflow-hidden"
              style={{ perspective: 1000 }}
            >
              {/* One EMI Badge */}
              <div className="flex items-center justify-center mb-4">
                <motion.div
                  className="bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white px-6 py-2 rounded-full shadow-lg"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5" />
                    <span className="font-bold text-sm">Make One EMI</span>
                    <TrendingUp className="w-5 h-5" />
                  </div>
                </motion.div>
              </div>

              <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 text-center">Start Your Journey to</h2>
              <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-pink-600 to-fuchsia-600 bg-clip-text text-transparent mb-6 text-center">Financial Freedom!</h3>

              {/* Progress Bar */}
              {formStep >= 2 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    {['Personal', 'Employer', 'Office', 'Home', 'Loan'].map((step, index) => (
                      <div key={index} className="flex items-center">
                        <motion.div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                            formStep >= index + 2 ? 'bg-pink-600 text-white' : 'bg-gray-200 text-gray-500'
                          }`}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          {formStep > index + 2 ? <CheckCircle2 className="w-4 h-4" /> : index + 1}
                        </motion.div>
                        {index < 4 && (
                          <div className={`h-1 w-4 sm:w-8 ${formStep > index + 2 ? 'bg-pink-600' : 'bg-gray-200'}`}></div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-gray-600">
                    <span className="text-[10px] sm:text-xs">Personal</span>
                    <span className="text-[10px] sm:text-xs">Employer</span>
                    <span className="text-[10px] sm:text-xs">Office</span>
                    <span className="text-[10px] sm:text-xs">Home</span>
                    <span className="text-[10px] sm:text-xs">Loan</span>
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
                    className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-pink-600 to-fuchsia-600 bg-clip-text text-transparent mb-4"
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
                    <span className="font-semibold text-pink-600">Our team will call you soon!</span>
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                    className="bg-gradient-to-r from-pink-50 to-purple-50 p-6 rounded-xl border-2 border-pink-200"
                  >
                    <p className="text-sm text-gray-700 mb-2">
                      <span className="font-semibold">Application ID:</span> DEB{Date.now().toString().slice(-8)}
                    </p>
                    <p className="text-sm text-gray-600">
                      Please keep this reference number for future communication.
                    </p>
                  </motion.div>
                </motion.div>
              ) : (
                <form onSubmit={formStep === 0 ? handleContinueFromStep0 : handleSubmit}>
                  <AnimatePresence mode="wait">
                    {/* Step 0: Name + Mobile */}
                    {formStep === 0 && (
                    <motion.div
                      key="step0"
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      <h3 className="text-lg font-semibold text-pink-700 mb-4">Get Started</h3>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            value={formData.fullName}
                            onChange={(e) => handleInputChange('fullName', e.target.value)}
                            className="w-full pl-11 pr-4 py-3 text-sm border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                            placeholder="Enter your full name"
                            required
                          />
                        </div>
                      </div>

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
                            className="flex-1 px-4 py-3 text-sm border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                            placeholder="10-digit mobile number"
                            pattern="[0-9]{10}"
                            maxLength={10}
                            required
                          />
                        </div>
                      </div>

                      <motion.button
                        type="submit"
                        disabled={!formData.fullName || formData.mobile.length !== 10}
                        className="w-full bg-gradient-to-r from-pink-600 to-fuchsia-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-pink-700 hover:to-fuchsia-700 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300 shadow-lg flex items-center justify-center space-x-2"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span>Continue</span>
                        <ArrowRight className="w-5 h-5" />
                      </motion.button>

                      <p className="text-xs text-gray-500 text-center leading-relaxed">
                        By continuing, you agree to our{' '}
                        <a href="/terms" className="text-pink-600 hover:underline font-semibold">Terms & Conditions</a>
                        {' '}and{' '}
                        <a href="/privacy" className="text-pink-600 hover:underline font-semibold">Privacy Policy</a>
                      </p>
                    </motion.div>
                  )}

                  {/* Step 2: Personal Details */}
                  {formStep === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      <h3 className="text-lg font-semibold text-pink-700 mb-4">Personal Details</h3>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className="w-full pl-11 pr-4 py-3 text-sm border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                            placeholder="your.email@example.com"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">PAN Card *</label>
                        <div className="relative">
                          <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            value={formData.panCard}
                            onChange={(e) => handleInputChange('panCard', e.target.value.toUpperCase())}
                            className="w-full pl-11 pr-4 py-3 text-sm border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all uppercase"
                            placeholder="ABCDE1234F"
                            pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
                            maxLength={10}
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Date of Birth *</label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="date"
                            value={formData.dob}
                            onChange={(e) => handleInputChange('dob', e.target.value)}
                            className="w-full pl-11 pr-4 py-3 text-sm border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Gender *</label>
                          <select
                            value={formData.gender}
                            onChange={(e) => handleInputChange('gender', e.target.value)}
                            className="w-full px-4 py-3 text-sm border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                            required
                          >
                            <option value="">Select</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Marital Status *</label>
                          <select
                            value={formData.maritalStatus}
                            onChange={(e) => handleInputChange('maritalStatus', e.target.value)}
                            className="w-full px-4 py-3 text-sm border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                            required
                          >
                            <option value="">Select</option>
                            <option value="Single">Single</option>
                            <option value="Married">Married</option>
                            <option value="Divorced">Divorced</option>
                            <option value="Widowed">Widowed</option>
                          </select>
                        </div>
                      </div>

                      <motion.button
                        type="button"
                        onClick={handleNextStep}
                        className="w-full bg-gradient-to-r from-pink-600 to-fuchsia-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-pink-700 hover:to-fuchsia-700 transform hover:scale-105 transition-all duration-300 shadow-lg flex items-center justify-center space-x-2"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span>Next: Employer Details</span>
                        <ArrowRight className="w-5 h-5" />
                      </motion.button>
                    </motion.div>
                  )}

                  {/* Step 3: Employer Details */}
                  {formStep === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      <h3 className="text-lg font-semibold text-pink-700 mb-4">Employer Details</h3>

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
                            className="w-full pl-11 pr-4 py-3 text-sm border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                            placeholder="Start typing company name"
                            required
                          />
                        </div>
                        {showCompanySuggestions && formData.companyName && filterCompanies(formData.companyName).length > 0 && (
                          <div className="absolute z-20 w-full mt-1 bg-white border-2 border-gray-300 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                            {filterCompanies(formData.companyName).map((company, index) => (
                              <div
                                key={index}
                                onClick={() => {
                                  handleInputChange('companyName', company);
                                  setShowCompanySuggestions(false);
                                }}
                                className="px-4 py-2 hover:bg-pink-50 cursor-pointer text-sm"
                              >
                                {company}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Company Type *</label>
                        <select
                          value={formData.companyType}
                          onChange={(e) => handleInputChange('companyType', e.target.value)}
                          className="w-full px-4 py-3 text-sm border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                          required
                        >
                          <option value="">Select company type</option>
                          {companyTypes.map((type, index) => (
                            <option key={index} value={type}>{type}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Designation *</label>
                        <div className="relative">
                          <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            value={formData.designation}
                            onChange={(e) => handleInputChange('designation', e.target.value)}
                            className="w-full pl-11 pr-4 py-3 text-sm border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                            placeholder="Your job title"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Monthly Net Salary *</label>
                        <div className="relative">
                          <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="number"
                            value={formData.netSalary}
                            onChange={(e) => handleInputChange('netSalary', e.target.value)}
                            className="w-full pl-11 pr-4 py-3 text-sm border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                            placeholder="Enter monthly net salary"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Work Email (Optional)</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="email"
                            value={formData.workEmail}
                            onChange={(e) => handleInputChange('workEmail', e.target.value)}
                            className="w-full pl-11 pr-4 py-3 text-sm border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                            placeholder="work.email@company.com"
                          />
                        </div>
                      </div>

                      <div className="flex space-x-3">
                        <motion.button
                          type="button"
                          onClick={handlePrevStep}
                          className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-all duration-300 flex items-center justify-center space-x-2"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <ArrowLeft className="w-5 h-5" />
                          <span>Previous</span>
                        </motion.button>
                        <motion.button
                          type="button"
                          onClick={handleNextStep}
                          className="flex-1 bg-gradient-to-r from-pink-600 to-fuchsia-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-pink-700 hover:to-fuchsia-700 transform hover:scale-105 transition-all duration-300 shadow-lg flex items-center justify-center space-x-2"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <span>Next: Office Address</span>
                          <ArrowRight className="w-5 h-5" />
                        </motion.button>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 4: Office Address */}
                  {formStep === 4 && (
                    <motion.div
                      key="step4"
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      <h3 className="text-lg font-semibold text-pink-700 mb-4">Office Address</h3>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Office Address *</label>
                        <div className="relative">
                          <Building2 className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                          <textarea
                            value={formData.officeAddress}
                            onChange={(e) => handleInputChange('officeAddress', e.target.value)}
                            className="w-full pl-11 pr-4 py-3 text-sm border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
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
                            className="w-full pl-11 pr-4 py-3 text-sm border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
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
                          className="w-full px-4 py-3 text-sm border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
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
                                className="px-4 py-2 hover:bg-pink-50 cursor-pointer text-sm"
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
                          className="w-full px-4 py-3 text-sm border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
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
                                className="px-4 py-2 hover:bg-pink-50 cursor-pointer text-sm"
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
                          className="w-full px-4 py-3 text-sm border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                          placeholder="6-digit pincode"
                          pattern="[0-9]{6}"
                          maxLength={6}
                          required
                        />
                      </div>

                      <div className="flex space-x-3">
                        <motion.button
                          type="button"
                          onClick={handlePrevStep}
                          className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-all duration-300 flex items-center justify-center space-x-2"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <ArrowLeft className="w-5 h-5" />
                          <span>Previous</span>
                        </motion.button>
                        <motion.button
                          type="button"
                          onClick={handleNextStep}
                          className="flex-1 bg-gradient-to-r from-pink-600 to-fuchsia-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-pink-700 hover:to-fuchsia-700 transform hover:scale-105 transition-all duration-300 shadow-lg flex items-center justify-center space-x-2"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <span>Next: Home Address</span>
                          <ArrowRight className="w-5 h-5" />
                        </motion.button>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 5: Home Address Details */}
                  {formStep === 5 && (
                    <motion.div
                      key="step5"
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4 max-h-[500px] overflow-y-auto pr-2"
                    >
                      <h3 className="text-lg font-semibold text-pink-700 mb-4">Home Address Details</h3>

                      {/* Residence Type */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Residence Type *</label>
                        <select
                          value={formData.residenceType}
                          onChange={(e) => handleInputChange('residenceType', e.target.value)}
                          className="w-full px-4 py-3 text-sm border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                          required
                        >
                          <option value="">Select residence type</option>
                          <option value="Owned">Owned</option>
                          <option value="Owned by Parents">Owned by Parents</option>
                          <option value="Rented">Rented</option>
                          <option value="Company Provided">Company Provided</option>
                        </select>
                      </div>

                      {/* Current Address */}
                      <div className="bg-pink-50 p-4 rounded-xl">
                        <h4 className="text-sm font-semibold text-pink-700 mb-3">Current Address</h4>

                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Address *</label>
                            <div className="relative">
                              <Home className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                              <textarea
                                value={formData.currentAddress}
                                onChange={(e) => handleInputChange('currentAddress', e.target.value)}
                                className="w-full pl-11 pr-4 py-3 text-sm border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                                placeholder="House/Flat No., Street, Area"
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
                                value={formData.currentLandmark}
                                onChange={(e) => handleInputChange('currentLandmark', e.target.value)}
                                className="w-full pl-11 pr-4 py-3 text-sm border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                                placeholder="Nearby landmark"
                              />
                            </div>
                          </div>

                          <div className="relative">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">City *</label>
                            <input
                              type="text"
                              value={formData.currentCity}
                              onChange={(e) => {
                                handleInputChange('currentCity', e.target.value);
                                setShowCitySuggestions(prev => ({ ...prev, current: true }));
                              }}
                              onFocus={() => setShowCitySuggestions(prev => ({ ...prev, current: true }))}
                              className="w-full px-4 py-3 text-sm border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                              placeholder="Enter city"
                              required
                            />
                            {showCitySuggestions.current && formData.currentCity && filterCities(formData.currentCity).length > 0 && (
                              <div className="absolute z-20 w-full mt-1 bg-white border-2 border-gray-300 rounded-xl shadow-lg max-h-40 overflow-y-auto">
                                {filterCities(formData.currentCity).map((city, index) => (
                                  <div
                                    key={index}
                                    onClick={() => {
                                      handleInputChange('currentCity', city);
                                      setShowCitySuggestions(prev => ({ ...prev, current: false }));
                                    }}
                                    className="px-4 py-2 hover:bg-pink-50 cursor-pointer text-sm"
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
                              value={formData.currentState}
                              onChange={(e) => {
                                handleInputChange('currentState', e.target.value);
                                setShowStateSuggestions(prev => ({ ...prev, current: true }));
                              }}
                              onFocus={() => setShowStateSuggestions(prev => ({ ...prev, current: true }))}
                              className="w-full px-4 py-3 text-sm border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                              placeholder="Enter state"
                              required
                            />
                            {showStateSuggestions.current && formData.currentState && filterStates(formData.currentState).length > 0 && (
                              <div className="absolute z-20 w-full mt-1 bg-white border-2 border-gray-300 rounded-xl shadow-lg max-h-40 overflow-y-auto">
                                {filterStates(formData.currentState).map((state, index) => (
                                  <div
                                    key={index}
                                    onClick={() => {
                                      handleInputChange('currentState', state);
                                      setShowStateSuggestions(prev => ({ ...prev, current: false }));
                                    }}
                                    className="px-4 py-2 hover:bg-pink-50 cursor-pointer text-sm"
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
                              value={formData.currentPincode}
                              onChange={(e) => handleInputChange('currentPincode', e.target.value.replace(/\D/g, '').slice(0, 6))}
                              className="w-full px-4 py-3 text-sm border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                              placeholder="6-digit pincode"
                              pattern="[0-9]{6}"
                              maxLength={6}
                              required
                            />
                          </div>
                        </div>
                      </div>

                      {/* Permanent Address - Only show if Rented or Company Provided */}
                      {(formData.residenceType === 'Rented' || formData.residenceType === 'Company Provided') && (
                        <div className="bg-purple-50 p-4 rounded-xl">
                          <h4 className="text-sm font-semibold text-purple-700 mb-3">Permanent Address</h4>

                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">Address *</label>
                              <div className="relative">
                                <Home className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                <textarea
                                  value={formData.permanentAddress}
                                  onChange={(e) => handleInputChange('permanentAddress', e.target.value)}
                                  className="w-full pl-11 pr-4 py-3 text-sm border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                  placeholder="House/Flat No., Street, Area"
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
                                  value={formData.permanentLandmark}
                                  onChange={(e) => handleInputChange('permanentLandmark', e.target.value)}
                                  className="w-full pl-11 pr-4 py-3 text-sm border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                  placeholder="Nearby landmark"
                                />
                              </div>
                            </div>

                            <div className="relative">
                              <label className="block text-sm font-semibold text-gray-700 mb-2">City *</label>
                              <input
                                type="text"
                                value={formData.permanentCity}
                                onChange={(e) => {
                                  handleInputChange('permanentCity', e.target.value);
                                  setShowCitySuggestions(prev => ({ ...prev, permanent: true }));
                                }}
                                onFocus={() => setShowCitySuggestions(prev => ({ ...prev, permanent: true }))}
                                className="w-full px-4 py-3 text-sm border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                placeholder="Enter city"
                                required
                              />
                              {showCitySuggestions.permanent && formData.permanentCity && filterCities(formData.permanentCity).length > 0 && (
                                <div className="absolute z-20 w-full mt-1 bg-white border-2 border-gray-300 rounded-xl shadow-lg max-h-40 overflow-y-auto">
                                  {filterCities(formData.permanentCity).map((city, index) => (
                                    <div
                                      key={index}
                                      onClick={() => {
                                        handleInputChange('permanentCity', city);
                                        setShowCitySuggestions(prev => ({ ...prev, permanent: false }));
                                      }}
                                      className="px-4 py-2 hover:bg-purple-50 cursor-pointer text-sm"
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
                                value={formData.permanentState}
                                onChange={(e) => {
                                  handleInputChange('permanentState', e.target.value);
                                  setShowStateSuggestions(prev => ({ ...prev, permanent: true }));
                                }}
                                onFocus={() => setShowStateSuggestions(prev => ({ ...prev, permanent: true }))}
                                className="w-full px-4 py-3 text-sm border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                placeholder="Enter state"
                                required
                              />
                              {showStateSuggestions.permanent && formData.permanentState && filterStates(formData.permanentState).length > 0 && (
                                <div className="absolute z-20 w-full mt-1 bg-white border-2 border-gray-300 rounded-xl shadow-lg max-h-40 overflow-y-auto">
                                  {filterStates(formData.permanentState).map((state, index) => (
                                    <div
                                      key={index}
                                      onClick={() => {
                                        handleInputChange('permanentState', state);
                                        setShowStateSuggestions(prev => ({ ...prev, permanent: false }));
                                      }}
                                      className="px-4 py-2 hover:bg-purple-50 cursor-pointer text-sm"
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
                                value={formData.permanentPincode}
                                onChange={(e) => handleInputChange('permanentPincode', e.target.value.replace(/\D/g, '').slice(0, 6))}
                                className="w-full px-4 py-3 text-sm border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                placeholder="6-digit pincode"
                                pattern="[0-9]{6}"
                                maxLength={6}
                                required
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {(formData.residenceType === 'Owned' || formData.residenceType === 'Owned by Parents') && (
                        <div className="bg-green-50 p-3 rounded-xl border-2 border-green-200">
                          <p className="text-sm text-green-700 flex items-center space-x-2">
                            <CheckCircle className="w-5 h-5" />
                            <span>Current address will be used as permanent address</span>
                          </p>
                        </div>
                      )}

                      <div className="flex space-x-3 sticky bottom-0 bg-white pt-4 pb-2">
                        <motion.button
                          type="button"
                          onClick={handlePrevStep}
                          className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-all duration-300 flex items-center justify-center space-x-2"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <ArrowLeft className="w-5 h-5" />
                          <span>Previous</span>
                        </motion.button>
                        <motion.button
                          type="button"
                          onClick={handleNextStep}
                          className="flex-1 bg-gradient-to-r from-pink-600 to-fuchsia-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-pink-700 hover:to-fuchsia-700 transform hover:scale-105 transition-all duration-300 shadow-lg flex items-center justify-center space-x-2"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <span>Next: Loan Details</span>
                          <ArrowRight className="w-5 h-5" />
                        </motion.button>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 6: Loan Details */}
                  {formStep === 6 && (
                    <motion.div
                      key="step6"
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      <h3 className="text-lg font-semibold text-pink-700 mb-4">Existing Loan Details</h3>

                      <p className="text-sm text-gray-600 mb-4">Enter outstanding amounts for all your existing debts</p>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Personal Loan Amount</label>
                        <div className="relative">
                          <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="number"
                            value={formData.personalLoanAmount}
                            onChange={(e) => handleInputChange('personalLoanAmount', e.target.value)}
                            className="w-full pl-11 pr-4 py-3 text-sm border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                            placeholder="0"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Credit Card Outstanding</label>
                        <div className="relative">
                          <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="number"
                            value={formData.creditCardDebt}
                            onChange={(e) => handleInputChange('creditCardDebt', e.target.value)}
                            className="w-full pl-11 pr-4 py-3 text-sm border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                            placeholder="0"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Apps Loan Amount</label>
                        <div className="relative">
                          <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="number"
                            value={formData.appsLoanAmount}
                            onChange={(e) => handleInputChange('appsLoanAmount', e.target.value)}
                            className="w-full pl-11 pr-4 py-3 text-sm border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                            placeholder="0"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Overdraft Amount</label>
                        <div className="relative">
                          <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="number"
                            value={formData.overdraftAmount}
                            onChange={(e) => handleInputChange('overdraftAmount', e.target.value)}
                            className="w-full pl-11 pr-4 py-3 text-sm border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                            placeholder="0"
                          />
                        </div>
                      </div>

                      {totalDebt > 0 && (
                        <div className="bg-gradient-to-r from-pink-100 to-purple-100 p-4 rounded-xl border-2 border-pink-300">
                          <p className="text-sm font-semibold text-gray-700">Total Debt to Consolidate:</p>
                          <p className="text-2xl font-bold text-pink-600">₹{totalDebt.toLocaleString('en-IN')}</p>
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Desired Single EMI Amount *</label>
                        <div className="relative">
                          <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="number"
                            value={formData.desiredSingleEMI}
                            onChange={(e) => handleInputChange('desiredSingleEMI', e.target.value)}
                            className="w-full pl-11 pr-4 py-3 text-sm border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                            placeholder="Enter your preferred EMI amount"
                            required
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">We'll calculate the best tenure based on your preferred EMI</p>
                      </div>

                      <div className="flex space-x-3">
                        <motion.button
                          type="button"
                          onClick={handlePrevStep}
                          className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-all duration-300 flex items-center justify-center space-x-2"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <ArrowLeft className="w-5 h-5" />
                          <span>Previous</span>
                        </motion.button>
                        <motion.button
                          type="submit"
                          className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transform hover:scale-105 transition-all duration-300 shadow-lg flex items-center justify-center space-x-2"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <CheckCircle2 className="w-5 h-5" />
                          <span>Submit Application</span>
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-gray-800 mb-8 sm:mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Why Choose Our <span className="text-pink-600">Debt Consolidation</span> Loan?
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Clock, title: 'Quick Approval', desc: 'Get instant approval with minimal documentation', color: 'pink' },
              { icon: Shield, title: '100% Secure', desc: 'Your data is encrypted and completely secure with us', color: 'purple' },
              { icon: CheckCircle, title: 'No Hidden Charges', desc: 'Transparent pricing with no surprises or hidden fees', color: 'fuchsia' },
              { icon: Users, title: 'Expert Support', desc: 'Dedicated loan advisors to guide you through the process', color: 'pink' },
              { icon: Award, title: 'Flexible Tenure', desc: 'Choose repayment tenure from 12 to 84 months as per your need', color: 'purple' },
              { icon: TrendingUp, title: 'Improve Credit Score', desc: 'Regular EMI payments help improve your credit score over time', color: 'fuchsia' }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className={`bg-gradient-to-br from-${feature.color}-50 to-${feature.color === 'pink' ? 'fuchsia' : feature.color === 'purple' ? 'pink' : 'purple'}-50 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, rotateY: 5 }}
                style={{ perspective: 1000 }}
              >
                <div className={`bg-${feature.color}-600 w-12 h-12 rounded-full flex items-center justify-center mb-4`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-pink-50 to-purple-50 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-gray-800 mb-8 sm:mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Frequently Asked <span className="text-pink-600">Questions</span>
          </motion.h2>
          <div className="space-y-4">
            {[
              {
                q: 'What is debt consolidation?',
                a: 'Debt consolidation is combining multiple debts (Personal Loan, Credit Card, Apps Loan, Overdraft) into one single loan with a lower interest rate and single EMI payment. This simplifies your finances and reduces your overall interest burden.'
              },
              {
                q: 'How much can I save with debt consolidation?',
                a: 'You can save up to 50% on your monthly EMI burden. For example, on ₹5 lakh debt, you can save approximately ₹30,000-40,000 annually by switching from average 24% interest to 12% interest. The exact savings depend on your current interest rates and loan amounts.'
              },
              {
                q: 'What documents are required?',
                a: 'Basic documents include: PAN Card, Aadhaar Card, 3 months salary slips, 6 months bank statements, current loan statements, address proof, and passport-size photographs. All documents can be uploaded online.'
              },
              {
                q: 'Will consolidation affect my credit score?',
                a: 'Initially, there might be a small temporary impact due to the credit inquiry, but over time, regular EMI payments and closing multiple loans will significantly improve your credit score. Consolidation actually helps build better credit history.'
              },
              {
                q: 'What is the maximum amount I can consolidate?',
                a: 'You can consolidate debts up to ₹25 lakhs, subject to your eligibility based on income, credit score, existing liabilities, and repayment capacity. Higher amounts may be available for well-qualified applicants.'
              },
              {
                q: 'How long does the approval process take?',
                a: 'With our fully digital process, you can get instant approval in just 2 minutes after OTP verification. Loan disbursal happens within 24-48 hours after document verification and final approval.'
              }
            ].map((faq, index) => (
              <motion.details
                key={index}
                className="bg-white rounded-xl shadow-md p-4 group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <summary className="text-base font-semibold text-gray-800 cursor-pointer list-none flex justify-between items-center">
                  {faq.q}
                  <ChevronDown className="w-5 h-5 text-pink-600 group-open:rotate-180 transition-transform" />
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
      <footer className="bg-gradient-to-r from-pink-900 to-purple-900 text-white py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm mb-2">© 2024 KreditScore. All rights reserved.</p>
          <p className="text-xs text-pink-200">Your trusted partner for debt consolidation and financial freedom.</p>
        </div>
      </footer>
    </div>
  );
}
