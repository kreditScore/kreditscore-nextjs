'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import CustomCursor from '@/components/CustomCursor';
import {
  Zap,
  Smartphone,
  CheckCircle,
  Clock,
  Shield,
  Users,
  Award,
  Calculator,
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
  Home
} from 'lucide-react';

export default function SmallAppsLoanPage() {
  // Form States
  const [formStep, setFormStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    panCard: '',
    dob: '',
    gender: '',
    maritalStatus: '',
    companyName: '',
    companyType: '',
    netSalary: '',
    workEmail: '',
    loanAmount: '',
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
    officeAddress: '',
    officeLandmark: '',
    officeCity: '',
    officeState: '',
    officePincode: ''
  });

  // Calculator State
  const [loanAmount, setLoanAmount] = useState(300000);
  const [interestRate, setInterestRate] = useState(14);
  const [tenure, setTenure] = useState(24);

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

  // EMI Calculator
  const calculateEMI = (principal: number, rate: number, time: number) => {
    const r = rate / 12 / 100;
    const n = time;
    const emi = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    return isNaN(emi) ? 0 : emi;
  };

  const emi = calculateEMI(loanAmount, interestRate, tenure);
  const totalPayable = emi * tenure;
  const totalInterest = totalPayable - loanAmount;

  // Form Handlers
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNextStep = () => {
    if (formStep < 3) setFormStep(formStep + 1);
  };

  const handlePrevStep = () => {
    if (formStep > 1) setFormStep(formStep - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Application submitted successfully! Our team will contact you within 24 hours.');
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FinancialProduct",
            "name": "Small Apps Loan",
            "description": "Get instant personal loan through mobile app. Quick disbursal in 2 hours with loan up to ₹10 lakh.",
            "provider": {
              "@type": "FinancialService",
              "name": "KreditScore"
            },
            "interestRate": "14% p.a. onwards",
            "feesAndCommissionsSpecification": "Processing fee: 2% of loan amount",
            "url": "https://www.kreditscore.in/small-apps-loan"
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
            <h1 className="text-[16px] leading-tight sm:text-3xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 px-2">
              <span className="bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                Lightning Fast Loans!{' '}
              </span>
              <span className="text-orange-700">Small Apps Loan</span>
            </h1>
            <p className="text-[12px] sm:text-lg md:text-xl lg:text-2xl text-gray-700 mb-2 sm:mb-3 px-2 leading-tight">
              Get Up to ₹10 Lacs in Just 2 Hours
            </p>
            <p className="text-[10px] sm:text-base md:text-lg text-orange-600 font-semibold px-2 leading-tight">
              100% Mobile Based @ Starting from 14% p.a.*
            </p>
          </motion.div>

          {/* Main Grid: 3 Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">

            {/* LEFT: Orange Feature Box + Benefits */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="order-2 lg:order-1 space-y-4 sm:space-y-6"
            >
              {/* Orange 3D Box */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-amber-400 rounded-2xl sm:rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
                <div className="relative bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl transform group-hover:scale-105 transition-all duration-500">
                  <div className="flex items-center justify-center mb-3 sm:mb-4">
                    <div className="bg-white/20 backdrop-blur-sm p-3 sm:p-4 rounded-2xl">
                      <Zap className="w-10 h-10 sm:w-16 sm:h-16 text-white" />
                    </div>
                  </div>
                  <h3 className="text-lg sm:text-2xl lg:text-3xl font-bold text-white text-center mb-3 sm:mb-4">
                    Small Apps Loan
                  </h3>
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex items-center space-x-2 sm:space-x-3 bg-white/10 backdrop-blur-sm rounded-xl p-2 sm:p-3">
                      <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white flex-shrink-0" />
                      <span className="text-white text-xs sm:text-sm lg:text-base font-medium">Loan Upto 10 Lacs</span>
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-3 bg-white/10 backdrop-blur-sm rounded-xl p-2 sm:p-3">
                      <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white flex-shrink-0" />
                      <span className="text-white text-xs sm:text-sm lg:text-base font-medium">Disbursed in 2 hours</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* App Features */}
              <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl">
                <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-800 mb-3 sm:mb-4">Why Choose App Loan?</h3>
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center space-x-3 p-2 sm:p-3 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg">
                    <Smartphone className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
                    <div>
                      <p className="text-xs sm:text-sm font-semibold text-gray-800">100% Mobile Process</p>
                      <p className="text-xs text-gray-600">Complete application on app</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-2 sm:p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg">
                    <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
                    <div>
                      <p className="text-xs sm:text-sm font-semibold text-gray-800">2 Hours Disbursal</p>
                      <p className="text-xs text-gray-600">Money in your account fast</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-2 sm:p-3 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg">
                    <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
                    <div>
                      <p className="text-xs sm:text-sm font-semibold text-gray-800">Minimal Documents</p>
                      <p className="text-xs text-gray-600">Just PAN, Aadhaar, Bank statement</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-2 sm:p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg">
                    <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
                    <div>
                      <p className="text-xs sm:text-sm font-semibold text-gray-800">Instant Approval</p>
                      <p className="text-xs text-gray-600">Get decision in minutes</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Key Benefits */}
              <div className="bg-gradient-to-br from-orange-100 to-amber-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg">
                <h3 className="text-base sm:text-lg lg:text-xl font-bold text-orange-800 mb-3 sm:mb-4">Key Benefits:</h3>
                <ul className="space-y-2 sm:space-y-3">
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-gray-700">No physical branch visit required</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-gray-700">Paperless digital application</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-gray-700">Super fast disbursal in 2 hours</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-gray-700">Flexible repayment options</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-gray-700">Competitive interest rates</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-gray-700">24/7 customer support via app</span>
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* CENTER: Calculator */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="order-3 lg:order-2"
            >
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-8 sticky top-24">
                <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
                  <Calculator className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600" />
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">EMI Calculator</h2>
                </div>

                {/* Loan Amount */}
                <div className="mb-4 sm:mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs sm:text-sm font-semibold text-gray-700">Loan Amount</label>
                    <span className="text-sm sm:text-lg font-bold text-orange-600">₹{loanAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <input
                    type="range"
                    min="50000"
                    max="1000000"
                    step="10000"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className="w-full h-2 bg-gradient-to-r from-orange-200 to-amber-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>₹50K</span>
                    <span>₹10L</span>
                  </div>
                </div>

                {/* Interest Rate */}
                <div className="mb-4 sm:mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs sm:text-sm font-semibold text-gray-700">Interest Rate</label>
                    <span className="text-sm sm:text-lg font-bold text-orange-600">{interestRate}% p.a.</span>
                  </div>
                  <input
                    type="range"
                    min="14"
                    max="24"
                    step="0.5"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-full h-2 bg-gradient-to-r from-orange-200 to-amber-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>14%</span>
                    <span>24%</span>
                  </div>
                </div>

                {/* Tenure */}
                <div className="mb-4 sm:mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs sm:text-sm font-semibold text-gray-700">Tenure (Months)</label>
                    <span className="text-sm sm:text-lg font-bold text-orange-600">{tenure} months</span>
                  </div>
                  <input
                    type="range"
                    min="6"
                    max="60"
                    step="6"
                    value={tenure}
                    onChange={(e) => setTenure(Number(e.target.value))}
                    className="w-full h-2 bg-gradient-to-r from-orange-200 to-amber-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>6 months</span>
                    <span>60 months</span>
                  </div>
                </div>

                {/* Results */}
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-3 sm:p-4 space-y-3 sm:space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-orange-200">
                    <span className="text-xs sm:text-sm text-gray-600">Monthly EMI</span>
                    <span className="text-sm sm:text-lg font-bold text-orange-600">₹{Math.round(emi).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-orange-200">
                    <span className="text-xs sm:text-sm text-gray-600">Total Interest</span>
                    <span className="text-sm sm:text-lg font-bold text-red-600">₹{Math.round(totalInterest).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 bg-gradient-to-r from-orange-100 to-amber-100 rounded-lg p-2 sm:p-3">
                    <span className="text-xs sm:text-sm font-bold text-orange-800">Total Payable</span>
                    <span className="text-base sm:text-xl font-bold text-orange-700">₹{Math.round(totalPayable).toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="mt-4 sm:mt-6 text-center">
                  <p className="text-xs text-gray-500 mb-3 sm:mb-4">*Interest rates and EMI are indicative</p>
                  <button
                    onClick={() => {
                      const element = document.getElementById('application-form');
                      element?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full bg-gradient-to-r from-orange-600 to-amber-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full font-semibold hover:from-orange-700 hover:to-amber-700 transform hover:scale-105 transition-all duration-300 shadow-lg text-sm sm:text-base"
                  >
                    Apply Now - Get in 2 Hours
                  </button>
                </div>
              </div>
            </motion.div>

            {/* RIGHT: Application Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="order-1 lg:order-3"
              id="application-form"
            >
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-8 sticky top-24">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">Quick Application</h2>

                {/* Progress Indicator */}
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <div className="flex items-center space-x-2">
                    <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold ${formStep >= 1 ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-500'}`}>1</div>
                    <div className={`h-1 w-8 sm:w-12 ${formStep >= 2 ? 'bg-orange-600' : 'bg-gray-200'}`}></div>
                    <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold ${formStep >= 2 ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-500'}`}>2</div>
                    <div className={`h-1 w-8 sm:w-12 ${formStep >= 3 ? 'bg-orange-600' : 'bg-gray-200'}`}></div>
                    <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold ${formStep >= 3 ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-500'}`}>3</div>
                  </div>
                </div>

                <form onSubmit={handleSubmit}>
                  {/* Step 1: Personal & Employment Details */}
                  {formStep === 1 && (
                    <div className="space-y-3 sm:space-y-4">
                      <h3 className="text-sm sm:text-base font-semibold text-orange-700 mb-2 sm:mb-3">Personal & Employment Details</h3>

                      {/* Full Name */}
                      <div>
                        <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">Full Name *</label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="text"
                            value={formData.fullName}
                            onChange={(e) => handleInputChange('fullName', e.target.value)}
                            className="w-full pl-10 pr-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            placeholder="Enter your full name"
                            required
                          />
                        </div>
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">Email Address *</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className="w-full pl-10 pr-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            placeholder="your.email@example.com"
                            required
                          />
                        </div>
                      </div>

                      {/* Mobile */}
                      <div>
                        <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">Mobile Number *</label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="tel"
                            value={formData.mobile}
                            onChange={(e) => handleInputChange('mobile', e.target.value)}
                            className="w-full pl-10 pr-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            placeholder="10-digit mobile number"
                            pattern="[0-9]{10}"
                            required
                          />
                        </div>
                      </div>

                      {/* PAN Card */}
                      <div>
                        <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">PAN Card *</label>
                        <div className="relative">
                          <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="text"
                            value={formData.panCard}
                            onChange={(e) => handleInputChange('panCard', e.target.value.toUpperCase())}
                            className="w-full pl-10 pr-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent uppercase"
                            placeholder="ABCDE1234F"
                            pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
                            maxLength={10}
                            required
                          />
                        </div>
                      </div>

                      {/* Date of Birth */}
                      <div>
                        <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">Date of Birth *</label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="date"
                            value={formData.dob}
                            onChange={(e) => handleInputChange('dob', e.target.value)}
                            className="w-full pl-10 pr-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            required
                          />
                        </div>
                      </div>

                      {/* Gender */}
                      <div>
                        <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">Gender *</label>
                        <select
                          value={formData.gender}
                          onChange={(e) => handleInputChange('gender', e.target.value)}
                          className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                        <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">Marital Status *</label>
                        <select
                          value={formData.maritalStatus}
                          onChange={(e) => handleInputChange('maritalStatus', e.target.value)}
                          className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          required
                        >
                          <option value="">Select Status</option>
                          <option value="Single">Single</option>
                          <option value="Married">Married</option>
                          <option value="Divorced">Divorced</option>
                          <option value="Widowed">Widowed</option>
                        </select>
                      </div>

                      {/* Company Name with Autocomplete */}
                      <div className="relative">
                        <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">Company Name *</label>
                        <div className="relative">
                          <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
                          <input
                            type="text"
                            value={formData.companyName}
                            onChange={(e) => {
                              handleInputChange('companyName', e.target.value);
                              setShowCompanySuggestions(true);
                            }}
                            onFocus={() => setShowCompanySuggestions(true)}
                            className="w-full pl-10 pr-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                                className="px-3 py-2 hover:bg-orange-50 cursor-pointer text-xs sm:text-sm"
                              >
                                {company}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Company Type with Autocomplete */}
                      <div className="relative">
                        <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">Company Type *</label>
                        <div className="relative">
                          <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
                          <input
                            type="text"
                            value={formData.companyType}
                            onChange={(e) => {
                              handleInputChange('companyType', e.target.value);
                              setShowCompanyTypeSuggestions(true);
                            }}
                            onFocus={() => setShowCompanyTypeSuggestions(true)}
                            className="w-full pl-10 pr-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                                className="px-3 py-2 hover:bg-orange-50 cursor-pointer text-xs sm:text-sm"
                              >
                                {type}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Net Salary */}
                      <div>
                        <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">Monthly Net Salary *</label>
                        <div className="relative">
                          <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="number"
                            value={formData.netSalary}
                            onChange={(e) => handleInputChange('netSalary', e.target.value)}
                            className="w-full pl-10 pr-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            placeholder="Enter monthly net salary"
                            required
                          />
                        </div>
                      </div>

                      {/* Work Email */}
                      <div>
                        <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">Work Email (Optional)</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="email"
                            value={formData.workEmail}
                            onChange={(e) => handleInputChange('workEmail', e.target.value)}
                            className="w-full pl-10 pr-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            placeholder="work.email@company.com"
                          />
                        </div>
                      </div>

                      {/* Loan Amount Required */}
                      <div>
                        <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">Required Loan Amount *</label>
                        <div className="relative">
                          <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="number"
                            value={formData.loanAmount}
                            onChange={(e) => handleInputChange('loanAmount', e.target.value)}
                            className="w-full pl-10 pr-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            placeholder="Enter required amount"
                            required
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleNextStep}
                        className="w-full bg-gradient-to-r from-orange-600 to-amber-600 text-white px-4 py-2 sm:py-3 rounded-full font-semibold hover:from-orange-700 hover:to-amber-700 transform hover:scale-105 transition-all duration-300 shadow-lg text-sm sm:text-base"
                      >
                        Next: Address Details →
                      </button>
                    </div>
                  )}

                  {/* Step 2: Current & Permanent Address */}
                  {formStep === 2 && (
                    <div className="space-y-3 sm:space-y-4">
                      <h3 className="text-sm sm:text-base font-semibold text-orange-700 mb-2 sm:mb-3">Current & Permanent Address</h3>

                      {/* Current Address Section */}
                      <div className="bg-orange-50 p-3 rounded-lg">
                        <h4 className="text-xs sm:text-sm font-semibold text-orange-700 mb-2 sm:mb-3">Current Address</h4>

                        {/* Current Address */}
                        <div className="mb-3">
                          <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">Address *</label>
                          <div className="relative">
                            <Home className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                            <textarea
                              value={formData.currentAddress}
                              onChange={(e) => handleInputChange('currentAddress', e.target.value)}
                              className="w-full pl-10 pr-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                              placeholder="House/Flat No., Street, Area"
                              rows={2}
                              required
                            />
                          </div>
                        </div>

                        {/* Current Landmark */}
                        <div className="mb-3">
                          <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">Landmark</label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                              type="text"
                              value={formData.currentLandmark}
                              onChange={(e) => handleInputChange('currentLandmark', e.target.value)}
                              className="w-full pl-10 pr-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                              placeholder="Nearby landmark"
                            />
                          </div>
                        </div>

                        {/* Current City */}
                        <div className="mb-3 relative">
                          <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">City *</label>
                          <input
                            type="text"
                            value={formData.currentCity}
                            onChange={(e) => {
                              handleInputChange('currentCity', e.target.value);
                              setShowCitySuggestions(prev => ({ ...prev, current: true }));
                            }}
                            onFocus={() => setShowCitySuggestions(prev => ({ ...prev, current: true }))}
                            className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                                  className="px-3 py-2 hover:bg-orange-50 cursor-pointer text-xs sm:text-sm"
                                >
                                  {city}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Current State */}
                        <div className="mb-3 relative">
                          <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">State *</label>
                          <input
                            type="text"
                            value={formData.currentState}
                            onChange={(e) => {
                              handleInputChange('currentState', e.target.value);
                              setShowStateSuggestions(prev => ({ ...prev, current: true }));
                            }}
                            onFocus={() => setShowStateSuggestions(prev => ({ ...prev, current: true }))}
                            className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                                  className="px-3 py-2 hover:bg-orange-50 cursor-pointer text-xs sm:text-sm"
                                >
                                  {state}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Current Pincode */}
                        <div>
                          <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">Pincode *</label>
                          <input
                            type="text"
                            value={formData.currentPincode}
                            onChange={(e) => handleInputChange('currentPincode', e.target.value)}
                            className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            placeholder="6-digit pincode"
                            pattern="[0-9]{6}"
                            maxLength={6}
                            required
                          />
                        </div>
                      </div>

                      {/* Permanent Address Section */}
                      <div className="bg-amber-50 p-3 rounded-lg">
                        <h4 className="text-xs sm:text-sm font-semibold text-amber-700 mb-2 sm:mb-3">Permanent Address</h4>

                        {/* Permanent Address */}
                        <div className="mb-3">
                          <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">Address *</label>
                          <div className="relative">
                            <Home className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                            <textarea
                              value={formData.permanentAddress}
                              onChange={(e) => handleInputChange('permanentAddress', e.target.value)}
                              className="w-full pl-10 pr-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                              placeholder="House/Flat No., Street, Area"
                              rows={2}
                              required
                            />
                          </div>
                        </div>

                        {/* Permanent Landmark */}
                        <div className="mb-3">
                          <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">Landmark</label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                              type="text"
                              value={formData.permanentLandmark}
                              onChange={(e) => handleInputChange('permanentLandmark', e.target.value)}
                              className="w-full pl-10 pr-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                              placeholder="Nearby landmark"
                            />
                          </div>
                        </div>

                        {/* Permanent City */}
                        <div className="mb-3 relative">
                          <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">City *</label>
                          <input
                            type="text"
                            value={formData.permanentCity}
                            onChange={(e) => {
                              handleInputChange('permanentCity', e.target.value);
                              setShowCitySuggestions(prev => ({ ...prev, permanent: true }));
                            }}
                            onFocus={() => setShowCitySuggestions(prev => ({ ...prev, permanent: true }))}
                            className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
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
                                  className="px-3 py-2 hover:bg-amber-50 cursor-pointer text-xs sm:text-sm"
                                >
                                  {city}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Permanent State */}
                        <div className="mb-3 relative">
                          <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">State *</label>
                          <input
                            type="text"
                            value={formData.permanentState}
                            onChange={(e) => {
                              handleInputChange('permanentState', e.target.value);
                              setShowStateSuggestions(prev => ({ ...prev, permanent: true }));
                            }}
                            onFocus={() => setShowStateSuggestions(prev => ({ ...prev, permanent: true }))}
                            className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
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
                                  className="px-3 py-2 hover:bg-amber-50 cursor-pointer text-xs sm:text-sm"
                                >
                                  {state}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Permanent Pincode */}
                        <div>
                          <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">Pincode *</label>
                          <input
                            type="text"
                            value={formData.permanentPincode}
                            onChange={(e) => handleInputChange('permanentPincode', e.target.value)}
                            className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                            placeholder="6-digit pincode"
                            pattern="[0-9]{6}"
                            maxLength={6}
                            required
                          />
                        </div>
                      </div>

                      <div className="flex space-x-3">
                        <button
                          type="button"
                          onClick={handlePrevStep}
                          className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 sm:py-3 rounded-full font-semibold hover:bg-gray-300 transition-all duration-300 text-sm sm:text-base"
                        >
                          ← Previous
                        </button>
                        <button
                          type="button"
                          onClick={handleNextStep}
                          className="flex-1 bg-gradient-to-r from-orange-600 to-amber-600 text-white px-4 py-2 sm:py-3 rounded-full font-semibold hover:from-orange-700 hover:to-amber-700 transform hover:scale-105 transition-all duration-300 shadow-lg text-sm sm:text-base"
                        >
                          Next: Office Address →
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Office Address */}
                  {formStep === 3 && (
                    <div className="space-y-3 sm:space-y-4">
                      <h3 className="text-sm sm:text-base font-semibold text-orange-700 mb-2 sm:mb-3">Office Address</h3>

                      <div className="bg-orange-50 p-3 rounded-lg">
                        {/* Office Address */}
                        <div className="mb-3">
                          <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">Office Address *</label>
                          <div className="relative">
                            <Building2 className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                            <textarea
                              value={formData.officeAddress}
                              onChange={(e) => handleInputChange('officeAddress', e.target.value)}
                              className="w-full pl-10 pr-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                              placeholder="Building, Street, Area"
                              rows={2}
                              required
                            />
                          </div>
                        </div>

                        {/* Office Landmark */}
                        <div className="mb-3">
                          <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">Landmark</label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                              type="text"
                              value={formData.officeLandmark}
                              onChange={(e) => handleInputChange('officeLandmark', e.target.value)}
                              className="w-full pl-10 pr-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                              placeholder="Nearby landmark"
                            />
                          </div>
                        </div>

                        {/* Office City */}
                        <div className="mb-3 relative">
                          <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">City *</label>
                          <input
                            type="text"
                            value={formData.officeCity}
                            onChange={(e) => {
                              handleInputChange('officeCity', e.target.value);
                              setShowCitySuggestions(prev => ({ ...prev, office: true }));
                            }}
                            onFocus={() => setShowCitySuggestions(prev => ({ ...prev, office: true }))}
                            className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            placeholder="Enter city"
                            required
                          />
                          {showCitySuggestions.office && formData.officeCity && filterCities(formData.officeCity).length > 0 && (
                            <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                              {filterCities(formData.officeCity).map((city, index) => (
                                <div
                                  key={index}
                                  onClick={() => {
                                    handleInputChange('officeCity', city);
                                    setShowCitySuggestions(prev => ({ ...prev, office: false }));
                                  }}
                                  className="px-3 py-2 hover:bg-orange-50 cursor-pointer text-xs sm:text-sm"
                                >
                                  {city}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Office State */}
                        <div className="mb-3 relative">
                          <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">State *</label>
                          <input
                            type="text"
                            value={formData.officeState}
                            onChange={(e) => {
                              handleInputChange('officeState', e.target.value);
                              setShowStateSuggestions(prev => ({ ...prev, office: true }));
                            }}
                            onFocus={() => setShowStateSuggestions(prev => ({ ...prev, office: true }))}
                            className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            placeholder="Enter state"
                            required
                          />
                          {showStateSuggestions.office && formData.officeState && filterStates(formData.officeState).length > 0 && (
                            <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                              {filterStates(formData.officeState).map((state, index) => (
                                <div
                                  key={index}
                                  onClick={() => {
                                    handleInputChange('officeState', state);
                                    setShowStateSuggestions(prev => ({ ...prev, office: false }));
                                  }}
                                  className="px-3 py-2 hover:bg-orange-50 cursor-pointer text-xs sm:text-sm"
                                >
                                  {state}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Office Pincode */}
                        <div>
                          <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">Pincode *</label>
                          <input
                            type="text"
                            value={formData.officePincode}
                            onChange={(e) => handleInputChange('officePincode', e.target.value)}
                            className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            placeholder="6-digit pincode"
                            pattern="[0-9]{6}"
                            maxLength={6}
                            required
                          />
                        </div>
                      </div>

                      <div className="flex space-x-3">
                        <button
                          type="button"
                          onClick={handlePrevStep}
                          className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 sm:py-3 rounded-full font-semibold hover:bg-gray-300 transition-all duration-300 text-sm sm:text-base"
                        >
                          ← Previous
                        </button>
                        <button
                          type="submit"
                          className="flex-1 bg-gradient-to-r from-orange-600 to-amber-600 text-white px-4 py-2 sm:py-3 rounded-full font-semibold hover:from-orange-700 hover:to-amber-700 transform hover:scale-105 transition-all duration-300 shadow-lg text-sm sm:text-base"
                        >
                          Submit Application ✓
                        </button>
                      </div>
                    </div>
                  )}
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-8 sm:py-12 lg:py-16 bg-white px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center text-gray-800 mb-6 sm:mb-8">
            Why Choose Our <span className="text-orange-600">Small Apps Loan</span>?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="bg-orange-600 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-2">Quick Disbursal</h3>
              <p className="text-xs sm:text-sm text-gray-600">Get money in your account within 2 hours of approval.</p>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="bg-amber-600 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-2">100% Secure</h3>
              <p className="text-xs sm:text-sm text-gray-600">Bank-grade security with encrypted data protection.</p>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="bg-orange-600 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-2">No Hidden Charges</h3>
              <p className="text-xs sm:text-sm text-gray-600">Transparent pricing with complete clarity.</p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="bg-amber-600 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-2">24/7 Support</h3>
              <p className="text-xs sm:text-sm text-gray-600">Round-the-clock support through mobile app.</p>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="bg-orange-600 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                <Award className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-2">Flexible Tenure</h3>
              <p className="text-xs sm:text-sm text-gray-600">Choose repayment period from 6 to 60 months.</p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="bg-amber-600 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                <Smartphone className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-2">Mobile First</h3>
              <p className="text-xs sm:text-sm text-gray-600">Complete process on your mobile device.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-8 sm:py-12 lg:py-16 bg-gradient-to-br from-orange-50 to-amber-50 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center text-gray-800 mb-6 sm:mb-8">
            Frequently Asked <span className="text-orange-600">Questions</span>
          </h2>
          <div className="space-y-3 sm:space-y-4">
            <details className="bg-white rounded-lg shadow-md p-3 sm:p-4 group">
              <summary className="text-sm sm:text-base font-semibold text-gray-800 cursor-pointer list-none flex justify-between items-center">
                How fast can I get the loan?
                <ChevronDown className="w-5 h-5 text-orange-600 group-open:rotate-180 transition-transform" />
              </summary>
              <p className="text-xs sm:text-sm text-gray-600 mt-2 sm:mt-3">
                Once approved, the loan amount is typically disbursed within 2 hours directly to your bank account. The entire application process is 100% digital.
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-md p-3 sm:p-4 group">
              <summary className="text-sm sm:text-base font-semibold text-gray-800 cursor-pointer list-none flex justify-between items-center">
                What is the maximum loan amount?
                <ChevronDown className="w-5 h-5 text-orange-600 group-open:rotate-180 transition-transform" />
              </summary>
              <p className="text-xs sm:text-sm text-gray-600 mt-2 sm:mt-3">
                You can get a loan up to ₹10 lakhs, subject to your eligibility based on income, credit score, and other factors.
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-md p-3 sm:p-4 group">
              <summary className="text-sm sm:text-base font-semibold text-gray-800 cursor-pointer list-none flex justify-between items-center">
                What documents are required?
                <ChevronDown className="w-5 h-5 text-orange-600 group-open:rotate-180 transition-transform" />
              </summary>
              <p className="text-xs sm:text-sm text-gray-600 mt-2 sm:mt-3">
                Basic documents include PAN Card, Aadhaar Card, 3 months bank statements, and proof of income. Everything can be uploaded through the mobile app.
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-md p-3 sm:p-4 group">
              <summary className="text-sm sm:text-base font-semibold text-gray-800 cursor-pointer list-none flex justify-between items-center">
                Is there a prepayment penalty?
                <ChevronDown className="w-5 h-5 text-orange-600 group-open:rotate-180 transition-transform" />
              </summary>
              <p className="text-xs sm:text-sm text-gray-600 mt-2 sm:mt-3">
                No, you can prepay your loan anytime without any additional charges or penalties. This gives you complete flexibility.
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-md p-3 sm:p-4 group">
              <summary className="text-sm sm:text-base font-semibold text-gray-800 cursor-pointer list-none flex justify-between items-center">
                What is the interest rate?
                <ChevronDown className="w-5 h-5 text-orange-600 group-open:rotate-180 transition-transform" />
              </summary>
              <p className="text-xs sm:text-sm text-gray-600 mt-2 sm:mt-3">
                Interest rates start from 14% p.a. and vary based on your credit profile, loan amount, and tenure. The exact rate will be shown before you accept the loan.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-orange-900 to-amber-900 text-white py-6 sm:py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-xs sm:text-sm mb-2">© 2024 KreditScore. All rights reserved.</p>
          <p className="text-xs text-orange-200">Fast, simple, and secure mobile lending at your fingertips.</p>
        </div>
      </footer>
    </div>
  );
}
