'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';
import CustomCursor from '@/components/CustomCursor';
import {
  User,
  FileText,
  Upload,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Briefcase,
  DollarSign,
  CheckCircle2,
  X,
  ArrowRight,
  CreditCard
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [applicationMethod, setApplicationMethod] = useState<'auto' | 'manual' | null>(null);
  const [showThankYou, setShowThankYou] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [skipDocuments, setSkipDocuments] = useState(false);

  // Applicant Detail Sheet - Form data
  const [formData, setFormData] = useState({
    // Personal Details
    applicantName: '',
    applicantDOB: '',
    mobileNo: '',
    panCardNo: '',
    fatherName: '',
    motherName: '',
    spouseName: '',
    spouseDOB: '',
    education: '',
    personalEmail: '',

    // Residence Details
    residenceType: '', // Owned/Rented
    residenceAddress: '',
    residenceLandmark: '',
    residenceCity: '',
    residencePincode: '',
    yearsAtResidence: '',

    // Permanent Address
    permanentAddress: '',
    permanentLandmark: '',
    permanentCity: '',
    permanentPincode: '',
    permanentMobileRequired: '',

    // Company Details (If Salaried)
    companyName: '',
    officeAddress: '',
    officeLandmark: '',
    officeCity: '',
    officePincode: '',
    officialLandlineNo: '',
    officialEmail: '',
    yearsAtCurrentJob: '',
    department: '',
    designation: '',
    totalWorkExp: '',

    // Loan Details
    loanType: '', // Personal/Home/Car/Business/Education
    loanAmount: '',
    tenure: '',
    monthlyIncome: '',
    employmentType: '' // Salaried/Self-employed/Business
  });

  const [documents, setDocuments] = useState({
    pan: null as File | null,
    aadhar: null as File | null,
    income: null as File | null,
    photo: null as File | null
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, docType: string) => {
    if (e.target.files && e.target.files[0]) {
      setDocuments({ ...documents, [docType]: e.target.files[0] });
    }
  };

  const handleAutoFill = () => {
    // Simulate checking database for existing customer by mobile/PAN
    const existingCustomer = {
      applicantName: 'Rahul Kumar',
      mobileNo: '9876543210',
      personalEmail: 'rahul@example.com',
      panCardNo: 'ABCDE1234F',
      applicantDOB: '1990-05-15',
      residenceAddress: 'Flat 302, Sunshine Apartments',
      residenceLandmark: 'Near Metro Station',
      residenceCity: 'Mumbai',
      residencePincode: '400001'
    };

    setFormData({ ...formData, ...existingCustomer });
    setApplicationMethod('auto');
    setCurrentStep(1); // Start from step 1 with pre-filled data
  };

  const handleManualEntry = () => {
    setApplicationMethod('manual');
  };

  const handleSubmitApplication = () => {
    setShowThankYou(true);
    setTimeout(() => {
      setShowProfileModal(false);
      setShowThankYou(false);
      setApplicationMethod(null);
      setCurrentStep(1);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <CustomCursor />
      <Header />

      <div className="pt-[100px] pb-[50px] px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Welcome to Your Dashboard
            </h1>
            <p className="text-gray-600 mb-8">
              Login successful! Manage your profile and applications here.
            </p>

            <div className="grid md:grid-cols-4 gap-6">
              {/* Profile Card */}
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                onClick={() => setShowProfileModal(true)}
                className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl cursor-pointer transition-all hover:shadow-lg"
              >
                <User className="w-8 h-8 text-blue-600 mb-3" />
                <h3 className="font-semibold text-gray-800 mb-2">Profile</h3>
                <p className="text-sm text-gray-600">Manage your profile</p>
              </motion.div>

              {/* Loans Card with Animation */}
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl cursor-pointer transition-all hover:shadow-lg relative overflow-hidden"
              >
                {/* Animated background */}
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="absolute top-0 right-0 w-20 h-20 bg-green-200 rounded-full opacity-30 -mr-10 -mt-10"
                />
                <motion.div
                  animate={{
                    y: [0, -10, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <CreditCard className="w-8 h-8 text-green-600 mb-3" />
                </motion.div>
                <h3 className="font-semibold text-gray-800 mb-2">Loans</h3>
                <p className="text-sm text-gray-600">View your loans</p>
              </motion.div>

              {/* Documents Card */}
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl cursor-pointer transition-all hover:shadow-lg"
              >
                <FileText className="w-8 h-8 text-purple-600 mb-3" />
                <h3 className="font-semibold text-gray-800 mb-2">Documents</h3>
                <p className="text-sm text-gray-600">Upload documents</p>
              </motion.div>

              {/* Employee CRM Card */}
              <Link href="/crm">
                <motion.div
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl cursor-pointer transition-all hover:shadow-lg h-full"
                >
                  <Briefcase className="w-8 h-8 text-orange-600 mb-3" />
                  <h3 className="font-semibold text-gray-800 mb-2">Employee CRM</h3>
                  <p className="text-sm text-gray-600">Manage leads and follow-ups</p>
                </motion.div>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Profile Application Modal */}
      <AnimatePresence>
        {showProfileModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => !showThankYou && setShowProfileModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              {showThankYou ? (
                /* Thank You Screen */
                <div className="p-8 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.5 }}
                  >
                    <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-4" />
                  </motion.div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Thank You for Applying!
                  </h2>
                  <p className="text-gray-600">
                    Our team will call you soon to discuss your loan application.
                  </p>
                </div>
              ) : !applicationMethod ? (
                /* Method Selection */
                <div className="p-8">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Apply for Loan</h2>
                    <button
                      onClick={() => setShowProfileModal(false)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    {/* Auto Fill Option */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleAutoFill}
                      className="w-full p-6 border-2 border-blue-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800 mb-1">
                            Continue with Your Profile
                          </h3>
                          <p className="text-sm text-gray-600">
                            Auto-fill details if you're an existing customer
                          </p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-400" />
                      </div>
                    </motion.button>

                    {/* Manual Entry Option */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleManualEntry}
                      className="w-full p-6 border-2 border-gray-200 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all text-left"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                          <FileText className="w-6 h-6 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800 mb-1">
                            Continue Manually
                          </h3>
                          <p className="text-sm text-gray-600">
                            Fill the application form manually
                          </p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-400" />
                      </div>
                    </motion.button>
                  </div>
                </div>
              ) : (
                /* Application Form */
                <div className="p-8">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                      Applicant Detail Sheet
                    </h2>
                    <button
                      onClick={() => setApplicationMethod(null)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  {/* Progress Steps */}
                  <div className="flex justify-center gap-2 mb-8">
                    {[1, 2, 3, 4].map((step) => (
                      <div
                        key={step}
                        className={`h-2 w-20 rounded-full transition-all ${
                          step <= currentStep ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Step 1: Personal & Family Details */}
                  {currentStep === 1 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-4"
                    >
                      <h3 className="font-semibold text-lg mb-4 text-blue-600">Step 1: Personal & Family Details</h3>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Applicant Name *
                          </label>
                          <input
                            type="text"
                            name="applicantName"
                            value={formData.applicantName}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                            placeholder="Enter applicant's full name"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Date of Birth *
                          </label>
                          <input
                            type="date"
                            name="applicantDOB"
                            value={formData.applicantDOB}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Mobile Number *
                          </label>
                          <input
                            type="tel"
                            name="mobileNo"
                            value={formData.mobileNo}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                            placeholder="10-digit mobile number"
                            maxLength={10}
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            PAN Card Number *
                          </label>
                          <input
                            type="text"
                            name="panCardNo"
                            value={formData.panCardNo}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none uppercase"
                            placeholder="ABCDE1234F"
                            maxLength={10}
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Father's Name
                          </label>
                          <input
                            type="text"
                            name="fatherName"
                            value={formData.fatherName}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                            placeholder="Father's full name"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Mother's Name
                          </label>
                          <input
                            type="text"
                            name="motherName"
                            value={formData.motherName}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                            placeholder="Mother's full name"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Spouse Name
                          </label>
                          <input
                            type="text"
                            name="spouseName"
                            value={formData.spouseName}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                            placeholder="Spouse's full name (if married)"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Spouse Date of Birth
                          </label>
                          <input
                            type="date"
                            name="spouseDOB"
                            value={formData.spouseDOB}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Education
                          </label>
                          <select
                            name="education"
                            value={formData.education}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                          >
                            <option value="">Select education</option>
                            <option value="10th">10th Pass</option>
                            <option value="12th">12th Pass</option>
                            <option value="graduate">Graduate</option>
                            <option value="postgraduate">Post Graduate</option>
                            <option value="professional">Professional Degree</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Personal Email
                          </label>
                          <input
                            type="email"
                            name="personalEmail"
                            value={formData.personalEmail}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                            placeholder="your@email.com"
                          />
                        </div>
                      </div>

                      <button
                        onClick={() => setCurrentStep(2)}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors mt-6"
                      >
                        Next Step
                      </button>
                    </motion.div>
                  )}

                  {/* Step 2: Residence & Permanent Address */}
                  {currentStep === 2 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-6"
                    >
                      <h3 className="font-semibold text-lg mb-4 text-blue-600">Step 2: Residence & Permanent Address</h3>

                      {/* Residence Details */}
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-800 mb-3">Current Residence Details</h4>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Residence Type *
                            </label>
                            <select
                              name="residenceType"
                              value={formData.residenceType}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                              required
                            >
                              <option value="">Select type</option>
                              <option value="owned">Owned</option>
                              <option value="rented">Rented</option>
                              <option value="parental">Parental</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Years at Residence *
                            </label>
                            <input
                              type="number"
                              name="yearsAtResidence"
                              value={formData.yearsAtResidence}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                              placeholder="Years"
                              required
                            />
                          </div>

                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Residence Address *
                            </label>
                            <input
                              type="text"
                              name="residenceAddress"
                              value={formData.residenceAddress}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                              placeholder="Complete address"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Landmark *
                            </label>
                            <input
                              type="text"
                              name="residenceLandmark"
                              value={formData.residenceLandmark}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                              placeholder="Nearby landmark"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              City *
                            </label>
                            <input
                              type="text"
                              name="residenceCity"
                              value={formData.residenceCity}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                              placeholder="City"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              PIN Code *
                            </label>
                            <input
                              type="text"
                              name="residencePincode"
                              value={formData.residencePincode}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                              placeholder="6-digit PIN"
                              maxLength={6}
                              required
                            />
                          </div>
                        </div>
                      </div>

                      {/* Permanent Address */}
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-800 mb-3">Permanent Address</h4>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Permanent Address *
                            </label>
                            <input
                              type="text"
                              name="permanentAddress"
                              value={formData.permanentAddress}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                              placeholder="Complete permanent address"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Landmark *
                            </label>
                            <input
                              type="text"
                              name="permanentLandmark"
                              value={formData.permanentLandmark}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                              placeholder="Nearby landmark"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              City *
                            </label>
                            <input
                              type="text"
                              name="permanentCity"
                              value={formData.permanentCity}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                              placeholder="City"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              PIN Code *
                            </label>
                            <input
                              type="text"
                              name="permanentPincode"
                              value={formData.permanentPincode}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                              placeholder="6-digit PIN"
                              maxLength={6}
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Permanent Mobile (if different)
                            </label>
                            <input
                              type="tel"
                              name="permanentMobileRequired"
                              value={formData.permanentMobileRequired}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                              placeholder="10-digit mobile"
                              maxLength={10}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3 mt-6">
                        <button
                          onClick={() => setCurrentStep(1)}
                          className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                        >
                          Back
                        </button>
                        <button
                          onClick={() => setCurrentStep(3)}
                          className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                        >
                          Next Step
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: Document Upload */}
                  {currentStep === 3 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-4"
                    >
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-lg">Upload Documents</h3>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={skipDocuments}
                            onChange={(e) => setSkipDocuments(e.target.checked)}
                            className="w-4 h-4"
                          />
                          <span className="text-sm text-gray-600">Skip for now</span>
                        </label>
                      </div>

                      {!skipDocuments && (
                        <div className="space-y-4">
                          {['PAN Card', 'Aadhar Card', 'Income Proof', 'Photo'].map((doc, idx) => (
                            <div key={idx} className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-500 transition-colors">
                              <label className="flex items-center gap-3 cursor-pointer">
                                <Upload className="w-5 h-5 text-gray-400" />
                                <div className="flex-1">
                                  <p className="font-medium text-gray-700">{doc}</p>
                                  <p className="text-sm text-gray-500">Click to upload (PDF, JPG, PNG)</p>
                                </div>
                                <input
                                  type="file"
                                  accept=".pdf,.jpg,.jpeg,.png"
                                  onChange={(e) => handleFileChange(e, doc.toLowerCase().replace(' ', ''))}
                                  className="hidden"
                                />
                              </label>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex gap-3 mt-6">
                        <button
                          onClick={() => setCurrentStep(2)}
                          className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                        >
                          Back
                        </button>
                        <button
                          onClick={handleSubmitApplication}
                          className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                        >
                          Submit Application
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="bg-gray-900 text-white py-6 text-center">
        <p className="text-sm">© 2024 KreditScore. All rights reserved.</p>
      </footer>
    </div>
  );
}
