'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import CustomCursor from '@/components/CustomCursor';
import {
  Calculator,
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
  TrendingUp
} from 'lucide-react';

export default function CaLoanPage() {
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
    caRegistration: '',
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
  const [loanAmount, setLoanAmount] = useState(500000);
  const [interestRate, setInterestRate] = useState(12);
  const [tenure, setTenure] = useState(36);

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
    console.log('Form submitted:', formData);
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FinancialProduct",
            "name": "CA Loan",
            "description": "Special personal loan for Chartered Accountants with highest loan amounts and exclusive rates",
            "provider": {
              "@type": "FinancialService",
              "name": "KreditScore"
            },
            "interestRate": "Starting from 9.25% p.a.",
            "url": "https://kreditscore.com/ca-loan"
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
              <span className="bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent">
                For Financial Experts!{' '}
              </span>
              <span className="text-gray-700">CA Loan</span>
            </h1>
            <p className="text-[12px] sm:text-lg md:text-xl lg:text-2xl text-gray-700 mb-2 sm:mb-3 px-2 leading-tight">
              Exclusive for Chartered Accountants
            </p>
            <p className="text-[10px] sm:text-base md:text-lg text-emerald-600 font-semibold px-2 leading-tight">
              @ Premium Rates from 9.75% p.a.*
            </p>
          </motion.div>

          {/* Main Grid: 3 Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">

            {/* LEFT: Feature Box + Benefits */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="order-2 lg:order-1 space-y-4 sm:space-y-6"
            >
              {/* 3D Feature Box */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl sm:rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
                <div className="relative bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl transform group-hover:scale-105 transition-all duration-500">
                  <div className="flex items-center justify-center mb-3 sm:mb-4">
                    <div className="bg-white/20 backdrop-blur-sm p-3 sm:p-4 rounded-2xl">
                      <Calculator className="w-10 h-10 sm:w-16 sm:h-16 text-white" />
                    </div>
                  </div>
                  <h3 className="text-lg sm:text-2xl lg:text-3xl font-bold text-white text-center mb-3 sm:mb-4">
                    CA Loan
                  </h3>
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex items-center space-x-2 sm:space-x-3 bg-white/10 backdrop-blur-sm rounded-xl p-2 sm:p-3">
                      <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white flex-shrink-0" />
                      <span className="text-white text-xs sm:text-sm lg:text-base font-medium">Exclusive for CAs</span>
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-3 bg-white/10 backdrop-blur-sm rounded-xl p-2 sm:p-3">
                      <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white flex-shrink-0" />
                      <span className="text-white text-xs sm:text-sm lg:text-base font-medium">Highest Loan Amount</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Features List */}
              <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl">
                <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-800 mb-3 sm:mb-4">Why CA Loan?</h3>
                <div className="space-y-2 sm:space-y-3">
                  
                  <div className="flex items-center space-x-3 p-2 sm:p-3 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg">
                    <Award className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
                    <div>
                      <p className="text-xs sm:text-sm font-semibold text-gray-800">Exclusive for CAs</p>
                      <p className="text-xs text-gray-600">Special rates for members</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-2 sm:p-3 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg">
                    <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
                    <div>
                      <p className="text-xs sm:text-sm font-semibold text-gray-800">Highest Loan Amount</p>
                      <p className="text-xs text-gray-600">Up to ₹50 lakh</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-2 sm:p-3 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg">
                    <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
                    <div>
                      <p className="text-xs sm:text-sm font-semibold text-gray-800">Priority Processing</p>
                      <p className="text-xs text-gray-600">Fast approval for CAs</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-2 sm:p-3 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg">
                    <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
                    <div>
                      <p className="text-xs sm:text-sm font-semibold text-gray-800">Flexible Terms</p>
                      <p className="text-xs text-gray-600">Customized repayment</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Key Benefits */}
              <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg">
                <h3 className="text-base sm:text-lg lg:text-xl font-bold text-emerald-800 mb-3 sm:mb-4">Key Benefits:</h3>
                <ul className="space-y-2 sm:space-y-3">
                  
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-gray-700">Exclusive rates for Chartered Accountants</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-gray-700">Highest loan amounts in the category</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-gray-700">Priority application processing</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-gray-700">Minimal documentation for CA members</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-gray-700">Flexible repayment structures</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-gray-700">Special benefits for practicing CAs</span>
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
                  <Calculator className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-600" />
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">EMI Calculator</h2>
                </div>

                <div className="mb-4 sm:mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs sm:text-sm font-semibold text-gray-700">Loan Amount</label>
                    <span className="text-sm sm:text-lg font-bold text-emerald-600">₹{loanAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <input
                    type="range"
                    min="100000"
                    max="5000000"
                    step="50000"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className="w-full h-2 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>₹1L</span>
                    <span>₹50L</span>
                  </div>
                </div>

                <div className="mb-4 sm:mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs sm:text-sm font-semibold text-gray-700">Interest Rate</label>
                    <span className="text-sm sm:text-lg font-bold text-emerald-600">{interestRate}% p.a.</span>
                  </div>
                  <input
                    type="range"
                    min="9"
                    max="18"
                    step="0.25"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-full h-2 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>9%</span>
                    <span>18%</span>
                  </div>
                </div>

                <div className="mb-4 sm:mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs sm:text-sm font-semibold text-gray-700">Tenure (Months)</label>
                    <span className="text-sm sm:text-lg font-bold text-emerald-600">{tenure} months</span>
                  </div>
                  <input
                    type="range"
                    min="12"
                    max="84"
                    step="6"
                    value={tenure}
                    onChange={(e) => setTenure(Number(e.target.value))}
                    className="w-full h-2 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>12 months</span>
                    <span>84 months</span>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-3 sm:p-4 space-y-3 sm:space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-emerald-200">
                    <span className="text-xs sm:text-sm text-gray-600">Monthly EMI</span>
                    <span className="text-sm sm:text-lg font-bold text-emerald-600">₹{Math.round(emi).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-emerald-200">
                    <span className="text-xs sm:text-sm text-gray-600">Total Interest</span>
                    <span className="text-sm sm:text-lg font-bold text-red-600">₹{Math.round(totalInterest).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 bg-gradient-to-r from-green-50 to-teal-50 rounded-lg p-2 sm:p-3">
                    <span className="text-xs sm:text-sm font-bold text-emerald-800">Total Payable</span>
                    <span className="text-base sm:text-xl font-bold text-emerald-700">₹{Math.round(totalPayable).toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="mt-4 sm:mt-6 text-center">
                  <p className="text-xs text-gray-500 mb-3 sm:mb-4">*Interest rates and EMI are indicative</p>
                  <button
                    onClick={() => {
                      const element = document.getElementById('application-form');
                      element?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full font-semibold hover:opacity-90 transform hover:scale-105 transition-all duration-300 shadow-lg text-sm sm:text-base"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            </motion.div>

            {/* RIGHT: Application Form - Using same structure as existing pages */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="order-1 lg:order-3"
              id="application-form"
            >
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-8 sticky top-24">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">Quick Application</h2>

                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <div className="flex items-center space-x-2">
                    <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold ${formStep >= 1 ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-500'}`}>1</div>
                    <div className={`h-1 w-8 sm:w-12 ${formStep >= 2 ? 'bg-emerald-600' : 'bg-gray-200'}`}></div>
                    <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold ${formStep >= 2 ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-500'}`}>2</div>
                    <div className={`h-1 w-8 sm:w-12 ${formStep >= 3 ? 'bg-emerald-600' : 'bg-gray-200'}`}></div>
                    <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold ${formStep >= 3 ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-500'}`}>3</div>
                  </div>
                </div>

                <form onSubmit={handleSubmit}>
                  {formStep === 1 && (
                    <div className="space-y-3 sm:space-y-4">
                      <h3 className="text-sm sm:text-base font-semibold text-emerald-700 mb-2 sm:mb-3">Personal & Employment Details</h3>

                      <div>
                        <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">Full Name *</label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="text"
                            value={formData.fullName}
                            onChange={(e) => handleInputChange('fullName', e.target.value)}
                            className="w-full pl-10 pr-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            placeholder="Enter your full name"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">Email Address *</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className="w-full pl-10 pr-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            placeholder="your.email@example.com"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">Mobile Number *</label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="tel"
                            value={formData.mobile}
                            onChange={(e) => handleInputChange('mobile', e.target.value)}
                            className="w-full pl-10 pr-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            placeholder="10-digit mobile number"
                            pattern="[0-9]{10}"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">PAN Card *</label>
                        <div className="relative">
                          <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="text"
                            value={formData.panCard}
                            onChange={(e) => handleInputChange('panCard', e.target.value.toUpperCase())}
                            className="w-full pl-10 pr-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent uppercase"
                            placeholder="ABCDE1234F"
                            pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
                            maxLength={10}
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">CA Membership Number *</label>
                        <div className="relative">
                          <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="text"
                            value={formData.caRegistration}
                            onChange={(e) => handleInputChange('caRegistration', e.target.value)}
                            className="w-full pl-10 pr-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            placeholder="Enter your ICAI membership no."
                            required
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleNextStep}
                        className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-4 py-2 sm:py-3 rounded-full font-semibold hover:opacity-90 transform hover:scale-105 transition-all duration-300 shadow-lg text-sm sm:text-base"
                      >
                        Next: Address Details →
                      </button>
                    </div>
                  )}

                  {formStep === 2 && (
                    <div className="space-y-3 sm:space-y-4">
                      <h3 className="text-sm sm:text-base font-semibold text-emerald-700 mb-2 sm:mb-3">Address Details</h3>
                      <p className="text-xs text-gray-600">Please provide your current and permanent address</p>

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
                          className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-4 py-2 sm:py-3 rounded-full font-semibold hover:opacity-90 transform hover:scale-105 transition-all duration-300 shadow-lg text-sm sm:text-base"
                        >
                          Next: Office Address →
                        </button>
                      </div>
                    </div>
                  )}

                  {formStep === 3 && (
                    <div className="space-y-3 sm:space-y-4">
                      <h3 className="text-sm sm:text-base font-semibold text-emerald-700 mb-2 sm:mb-3">Office Address</h3>
                      <p className="text-xs text-gray-600">Final step - provide your office address</p>

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
                          className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-4 py-2 sm:py-3 rounded-full font-semibold hover:opacity-90 transform hover:scale-105 transition-all duration-300 shadow-lg text-sm sm:text-base"
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
            Why Choose Our <span className="text-emerald-600">CA Loan</span>?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="bg-emerald-600 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-2">Quick Approval</h3>
              <p className="text-xs sm:text-sm text-gray-600">Fast processing with minimal documentation required.</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-teal-50 p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="bg-emerald-600 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-2">100% Secure</h3>
              <p className="text-xs sm:text-sm text-gray-600">Your data is encrypted and completely secure.</p>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="bg-emerald-600 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-2">No Hidden Charges</h3>
              <p className="text-xs sm:text-sm text-gray-600">Transparent pricing with complete clarity.</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="bg-emerald-600 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-2">Expert Support</h3>
              <p className="text-xs sm:text-sm text-gray-600">Dedicated loan advisors to guide you through.</p>
            </div>

            <div className="bg-gradient-to-br from-teal-50 to-green-50 p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="bg-emerald-600 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                <Award className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-2">Flexible Tenure</h3>
              <p className="text-xs sm:text-sm text-gray-600">Choose repayment tenure as per your needs.</p>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="bg-emerald-600 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-2">Competitive Rates</h3>
              <p className="text-xs sm:text-sm text-gray-600">Best interest rates in the market.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-8 sm:py-12 lg:py-16 bg-gradient-to-br from-emerald-50 to-green-50 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center text-gray-800 mb-6 sm:mb-8">
            Frequently Asked <span className="text-emerald-600">Questions</span>
          </h2>
          <div className="space-y-3 sm:space-y-4">
            <details className="bg-white rounded-lg shadow-md p-3 sm:p-4 group">
              <summary className="text-sm sm:text-base font-semibold text-gray-800 cursor-pointer list-none flex justify-between items-center">
                What documents are required?
                <ChevronDown className="w-5 h-5 text-emerald-600 group-open:rotate-180 transition-transform" />
              </summary>
              <p className="text-xs sm:text-sm text-gray-600 mt-2 sm:mt-3">
                Basic documents include PAN Card, Aadhaar Card, proof of income, and address proof. Additional documents may be required based on your profile.
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-md p-3 sm:p-4 group">
              <summary className="text-sm sm:text-base font-semibold text-gray-800 cursor-pointer list-none flex justify-between items-center">
                How long does approval take?
                <ChevronDown className="w-5 h-5 text-emerald-600 group-open:rotate-180 transition-transform" />
              </summary>
              <p className="text-xs sm:text-sm text-gray-600 mt-2 sm:mt-3">
                Approval typically takes 24-48 hours once all documents are submitted and verified. Eligible customers may receive instant approval.
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-md p-3 sm:p-4 group">
              <summary className="text-sm sm:text-base font-semibold text-gray-800 cursor-pointer list-none flex justify-between items-center">
                What is the interest rate?
                <ChevronDown className="w-5 h-5 text-emerald-600 group-open:rotate-180 transition-transform" />
              </summary>
              <p className="text-xs sm:text-sm text-gray-600 mt-2 sm:mt-3">
                Interest rates start from 9.25% p.a. and vary based on your credit profile, loan amount, and tenure.
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-md p-3 sm:p-4 group">
              <summary className="text-sm sm:text-base font-semibold text-gray-800 cursor-pointer list-none flex justify-between items-center">
                Is there a prepayment penalty?
                <ChevronDown className="w-5 h-5 text-emerald-600 group-open:rotate-180 transition-transform" />
              </summary>
              <p className="text-xs sm:text-sm text-gray-600 mt-2 sm:mt-3">
                No, you can prepay your loan anytime without any additional charges or penalties.
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-md p-3 sm:p-4 group">
              <summary className="text-sm sm:text-base font-semibold text-gray-800 cursor-pointer list-none flex justify-between items-center">
                What is the maximum loan amount?
                <ChevronDown className="w-5 h-5 text-emerald-600 group-open:rotate-180 transition-transform" />
              </summary>
              <p className="text-xs sm:text-sm text-gray-600 mt-2 sm:mt-3">
                You can get a loan up to ₹50 lakhs, subject to your eligibility based on income, credit score, and other factors.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-emerald-900 to-emerald-900 text-white py-6 sm:py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-xs sm:text-sm mb-2">© 2024 KreditScore. All rights reserved.</p>
          <p className="text-xs text-emerald-200">Your trusted partner for ca loan solutions.</p>
        </div>
      </footer>
    </div>
  );
}
