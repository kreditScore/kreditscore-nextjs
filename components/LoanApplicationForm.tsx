'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, ArrowLeft, Check } from 'lucide-react';

interface LoanApplicationFormProps {
  isOpen: boolean;
  onClose: () => void;
  loanType: string;
}

const LoanApplicationForm = ({ isOpen, onClose, loanType }: LoanApplicationFormProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Quick Details
    loanAmount: '',
    city: '',
    mobile: '',
    netSalary: '',
    // Personal Details
    fullName: '',
    otp: '',
    dateOfBirth: '',
    location: '',
    address: '',
    panNumber: '',
    email: '',
    // Employer Details
    companyName: '',
    officialEmail: '',
    officeAddress: '',
    designation: '',
    employmentType: 'Salaried',
    workExperience: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleNext = () => {
    if (currentStep < 2) {
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
    console.log('Form submitted:', formData);
    alert('Application submitted successfully! 🎉');
    onClose();
    setCurrentStep(1);
    setFormData({
      loanAmount: '',
      city: '',
      fullName: '',
      mobile: '',
      otp: '',
      dateOfBirth: '',
      location: '',
      address: '',
      panNumber: '',
      email: '',
      companyName: '',
      netSalary: '',
      workExperience: '',
      officialEmail: '',
      officeAddress: '',
      designation: '',
      employmentType: 'Salaried',
    });
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
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>

              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6 rounded-t-2xl">
                <h2 className="text-2xl font-bold mb-2">{loanType}</h2>
                <p className="text-blue-100">Complete your application in 2 simple steps</p>

                {/* Progress Bar */}
                <div className="mt-4 flex items-center gap-2">
                  <div className={`flex-1 h-2 rounded-full ${currentStep >= 1 ? 'bg-white' : 'bg-blue-400'}`} />
                  <div className={`flex-1 h-2 rounded-full ${currentStep >= 2 ? 'bg-white' : 'bg-blue-400'}`} />
                </div>
                <div className="mt-2 flex justify-between text-xs">
                  <span>Personal Details</span>
                  <span>Employer Details</span>
                </div>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSubmit} className="p-6">
                <AnimatePresence mode="wait">
                  {currentStep === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">Personal Details</h3>

                      {/* Full Name */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter your full name"
                        />
                      </div>

                      {/* Mobile Number */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Mobile Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          name="mobile"
                          value={formData.mobile}
                          onChange={handleInputChange}
                          required
                          maxLength={10}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="+91 Enter mobile number"
                        />
                        <p className="text-xs text-gray-500 mt-1">OTP will be sent to this number</p>
                      </div>

                      {/* OTP (disabled for now) */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          OTP <span className="text-gray-400">(Auto-fetch on mobile)</span>
                        </label>
                        <input
                          type="text"
                          name="otp"
                          value={formData.otp}
                          onChange={handleInputChange}
                          maxLength={6}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter 6-digit OTP"
                        />
                      </div>

                      {/* Date of Birth */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Date of Birth <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          name="dateOfBirth"
                          value={formData.dateOfBirth}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      {/* Location */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Location <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="City, State"
                        />
                      </div>

                      {/* Address */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Complete address"
                        />
                      </div>

                      {/* PAN Number */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          PAN Number <span className="text-gray-400">(Optional)</span>
                        </label>
                        <input
                          type="text"
                          name="panNumber"
                          value={formData.panNumber}
                          onChange={handleInputChange}
                          maxLength={10}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="ABCDE1234F"
                        />
                      </div>

                      {/* Personal Email */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Personal Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="your.email@example.com"
                        />
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">Employer Details</h3>

                      {/* Company Name */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Company Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="companyName"
                          value={formData.companyName}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter company name"
                        />
                      </div>

                      {/* Employment Type */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Employment Type <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="employmentType"
                          value={formData.employmentType}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="Salaried">Salaried</option>
                          <option value="Self-Employed">Self-Employed</option>
                          <option value="Business">Business Owner</option>
                        </select>
                      </div>

                      {/* Designation */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Designation <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="designation"
                          value={formData.designation}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Your job title"
                        />
                      </div>

                      {/* Net Take Home Salary */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Net Take Home Salary <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          name="netSalary"
                          value={formData.netSalary}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="₹ Monthly salary"
                        />
                      </div>

                      {/* Official Email */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Official Email <span className="text-gray-400">(Optional)</span>
                        </label>
                        <input
                          type="email"
                          name="officialEmail"
                          value={formData.officialEmail}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="work.email@company.com"
                        />
                      </div>

                      {/* Office Address */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Office Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="officeAddress"
                          value={formData.officeAddress}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Complete office address"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Navigation Buttons */}
                <div className="flex gap-4 mt-8">
                  {currentStep > 1 && (
                    <button
                      type="button"
                      onClick={handlePrevious}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all"
                    >
                      <ArrowLeft className="w-5 h-5" />
                      Previous
                    </button>
                  )}

                  {currentStep < 2 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg"
                    >
                      Next
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg"
                    >
                      <Check className="w-5 h-5" />
                      Submit Application
                    </button>
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
