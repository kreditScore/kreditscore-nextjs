'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, ArrowLeft, Check, IndianRupee, MapPin, Phone, Briefcase } from 'lucide-react';

interface LoanApplicationFormProps {
  isOpen: boolean;
  onClose: () => void;
  loanType: string;
}

const cities = [
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad',
  'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal', 'Visakhapatnam',
  'Patna', 'Vadodara', 'Ghaziabad', 'Ludhiana', 'Agra', 'Nashik', 'Faridabad', 'Meerut',
  'Rajkot', 'Kalyan-Dombivali', 'Vasai-Virar', 'Varanasi', 'Srinagar', 'Aurangabad',
  'Dhanbad', 'Amritsar', 'Navi Mumbai', 'Allahabad', 'Ranchi', 'Howrah', 'Coimbatore',
  'Jabalpur', 'Gwalior', 'Vijayawada', 'Jodhpur', 'Madurai', 'Raipur', 'Kota', 'Others'
];

const LoanApplicationForm = ({ isOpen, onClose, loanType }: LoanApplicationFormProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Quick Details
    loanAmount: '',
    city: '',
    mobile: '',
    netSalary: '',
    // Step 2: Personal Details
    fullName: '',
    email: '',
    dateOfBirth: '',
    panNumber: '',
    address: '',
    // Step 3: Employment Details
    employmentType: 'Salaried',
    companyName: '',
    designation: '',
    workExperience: '',
    officialEmail: '',
    officeAddress: '',
  });

  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToTerms) {
      alert('Please agree to Terms & Conditions');
      return;
    }
    console.log('Form submitted:', formData);
    alert(`✅ Application submitted successfully!\n\nWe will contact you shortly at ${formData.mobile}`);
    onClose();
    // Reset form
    setCurrentStep(1);
    setFormData({
      loanAmount: '',
      city: '',
      mobile: '',
      netSalary: '',
      fullName: '',
      email: '',
      dateOfBirth: '',
      panNumber: '',
      address: '',
      employmentType: 'Salaried',
      companyName: '',
      designation: '',
      workExperience: '',
      officialEmail: '',
      officeAddress: '',
    });
    setAgreedToTerms(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[95vh] overflow-y-auto relative">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>

              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white p-8 rounded-t-3xl">
                <h2 className="text-3xl font-bold mb-3">{loanType} Application</h2>
                <p className="text-blue-100 mb-1">Apply in 3 simple steps</p>
                <p className="text-sm text-blue-200">Compare & Apply from 20+ Banks & NBFCs</p>

                {/* Progress Dots */}
                <div className="mt-6 flex items-center justify-center gap-3">
                  {[1, 2, 3].map((step) => (
                    <div key={step} className="flex items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                        currentStep >= step
                          ? 'bg-white text-blue-600 shadow-lg'
                          : 'bg-blue-500/30 text-blue-200'
                      }`}>
                        {step}
                      </div>
                      {step < 3 && (
                        <div className={`w-12 h-1 mx-1 rounded transition-all ${
                          currentStep > step ? 'bg-white' : 'bg-blue-500/30'
                        }`} />
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex justify-between text-xs text-blue-100 px-2">
                  <span>Quick Details</span>
                  <span>Personal Info</span>
                  <span>Employment</span>
                </div>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSubmit} className="p-8">
                <AnimatePresence mode="wait">
                  {/* Step 1: Quick Details */}
                  {currentStep === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-5"
                    >
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <IndianRupee className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900">Quick Details</h3>
                          <p className="text-sm text-gray-500">Tell us about your loan requirement</p>
                        </div>
                      </div>

                      {/* Loan Amount */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Loan Amount <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="number"
                            name="loanAmount"
                            value={formData.loanAmount}
                            onChange={handleInputChange}
                            required
                            className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-medium transition-all"
                            placeholder="50,000"
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1.5">Enter amount between ₹10,000 - ₹25,00,000</p>
                      </div>

                      {/* City */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          City <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <select
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            required
                            className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg appearance-none transition-all"
                          >
                            <option value="">Select your city</option>
                            {cities.map((city) => (
                              <option key={city} value={city}>{city}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Mobile Number */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Mobile Number <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="tel"
                            name="mobile"
                            value={formData.mobile}
                            onChange={handleInputChange}
                            required
                            maxLength={10}
                            pattern="[0-9]{10}"
                            className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-medium transition-all"
                            placeholder="9876543210"
                          />
                        </div>
                      </div>

                      {/* Net Monthly Salary */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Net Monthly Salary <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="number"
                            name="netSalary"
                            value={formData.netSalary}
                            onChange={handleInputChange}
                            required
                            className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-medium transition-all"
                            placeholder="50,000"
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1.5">Minimum ₹30,000/month required</p>
                      </div>

                      {/* Eligibility Criteria Box */}
                      <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-5 mt-6">
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <Check className="w-5 h-5 text-blue-600" />
                          Eligibility Criteria
                        </h4>
                        <ul className="space-y-2 text-sm text-gray-700">
                          <li className="flex items-start gap-2">
                            <span className="text-blue-600 mt-0.5">•</span>
                            <span>Credit Score: Minimum 700</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-blue-600 mt-0.5">•</span>
                            <span>Age: 23-58 years</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-blue-600 mt-0.5">•</span>
                            <span>Work Experience: Minimum 1 year</span>
                          </li>
                        </ul>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2: Personal Details */}
                  {currentStep === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-5"
                    >
                      <div className="mb-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-1">Personal Information</h3>
                        <p className="text-sm text-gray-500">Help us know you better</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Full Name */}
                        <div className="md:col-span-2">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Full Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg transition-all"
                            placeholder="As per PAN card"
                          />
                        </div>

                        {/* Email */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Email Address <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="your.email@example.com"
                          />
                        </div>

                        {/* Date of Birth */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Date of Birth <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="date"
                            name="dateOfBirth"
                            value={formData.dateOfBirth}
                            onChange={handleInputChange}
                            required
                            max={new Date(new Date().setFullYear(new Date().getFullYear() - 23)).toISOString().split('T')[0]}
                            className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          />
                        </div>

                        {/* PAN Number */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            PAN Number <span className="text-gray-400">(Optional)</span>
                          </label>
                          <input
                            type="text"
                            name="panNumber"
                            value={formData.panNumber}
                            onChange={handleInputChange}
                            maxLength={10}
                            className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all uppercase"
                            placeholder="ABCDE1234F"
                          />
                        </div>

                        {/* Current Address */}
                        <div className="md:col-span-2">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Current Address <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="Complete residential address"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: Employment Details */}
                  {currentStep === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-5"
                    >
                      <div className="mb-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-1">Employment Details</h3>
                        <p className="text-sm text-gray-500">Your work information</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Employment Type */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Employment Type <span className="text-red-500">*</span>
                          </label>
                          <select
                            name="employmentType"
                            value={formData.employmentType}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none transition-all"
                          >
                            <option value="Salaried">Salaried</option>
                            <option value="Self-Employed">Self-Employed</option>
                            <option value="Business">Business Owner</option>
                            <option value="Professional">Professional</option>
                          </select>
                        </div>

                        {/* Company Name */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Company Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="companyName"
                            value={formData.companyName}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="Your employer name"
                          />
                        </div>

                        {/* Designation */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Designation <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="designation"
                            value={formData.designation}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="Your job title"
                          />
                        </div>

                        {/* Work Experience */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Work Experience <span className="text-red-500">*</span>
                          </label>
                          <select
                            name="workExperience"
                            value={formData.workExperience}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none transition-all"
                          >
                            <option value="">Select experience</option>
                            <option value="<1">Less than 1 year</option>
                            <option value="1-3">1-3 years</option>
                            <option value="3-5">3-5 years</option>
                            <option value="5-10">5-10 years</option>
                            <option value="10+">10+ years</option>
                          </select>
                        </div>

                        {/* Official Email */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Official Email <span className="text-gray-400">(Optional)</span>
                          </label>
                          <input
                            type="email"
                            name="officialEmail"
                            value={formData.officialEmail}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="work@company.com"
                          />
                        </div>

                        {/* Office Address */}
                        <div className="md:col-span-2">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Office Address <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="officeAddress"
                            value={formData.officeAddress}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="Complete office address"
                          />
                        </div>
                      </div>

                      {/* Terms & Conditions */}
                      <div className="mt-6 bg-gray-50 border-2 border-gray-200 rounded-xl p-5">
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={agreedToTerms}
                            onChange={(e) => setAgreedToTerms(e.target.checked)}
                            className="mt-1 w-5 h-5 text-blue-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700 leading-relaxed">
                            I authorize KreditScore and its partners to contact me via <strong>Call/Email/SMS/WhatsApp</strong>.
                            I agree to the <a href="#" className="text-blue-600 hover:underline">Terms & Conditions</a> and{' '}
                            <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>.
                          </span>
                        </label>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Navigation Buttons */}
                <div className="flex gap-4 mt-8 pt-6 border-t-2 border-gray-100">
                  {currentStep > 1 && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={handlePrevious}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all"
                    >
                      <ArrowLeft className="w-5 h-5" />
                      Previous
                    </motion.button>
                  )}

                  {currentStep < 3 ? (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={handleNext}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/30"
                    >
                      Next Step
                      <ArrowRight className="w-5 h-5" />
                    </motion.button>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg shadow-green-500/30"
                    >
                      <Check className="w-5 h-5" />
                      Submit Application
                    </motion.button>
                  )}
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default LoanApplicationForm;
