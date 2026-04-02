'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { captureLead } from '@/lib/leadCapture';

interface LoanApplicationFormProps {
  isOpen: boolean;
  onClose: () => void;
  loanType: string;
}

const cities = [
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad',
  'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal', 'Visakhapatnam'
];

const emptyForm = {
  fullName: '',
  mobile: '',
  panNumber: '',
  netSalary: '',
  loanAmount: '',
  city: ''
};

const LoanApplicationForm = ({ isOpen, onClose, loanType }: LoanApplicationFormProps) => {
  const [formData, setFormData] = useState(emptyForm);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!/^\d{10}$/.test(formData.mobile)) {
      alert('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panNumber.toUpperCase())) {
      alert('Please enter a valid PAN number.');
      return;
    }

    if (!agreedToTerms) {
      alert('Please agree to Terms & Conditions');
      return;
    }

    captureLead({
      source: 'loan_modal_form',
      name: formData.fullName,
      mobile: formData.mobile,
      loanType,
      city: formData.city,
      amount: formData.loanAmount,
      pan: formData.panNumber.toUpperCase(),
      salary: formData.netSalary
    });
    alert('Application submitted successfully. Our team will contact you shortly.');
    resetFormAndClose();
  };

  const resetFormAndClose = () => {
    onClose();
    setFormData(emptyForm);
    setAgreedToTerms(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="relative w-full max-w-xl rounded-2xl bg-white shadow-2xl">
              <button
                onClick={onClose}
                className="absolute right-4 top-4 rounded-full p-2 hover:bg-gray-100"
              >
                <X className="h-5 w-5 text-gray-600" />
              </button>

              <div className="rounded-t-2xl bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
                <h2 className="text-2xl font-bold">{loanType} Application</h2>
                <p className="mt-1 text-sm text-blue-100">Quick form - only essential details</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 p-6">
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Name (as per PAN card)"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3"
                  required
                />

                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  placeholder="Mobile Number"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3"
                  pattern="[0-9]{10}"
                  maxLength={10}
                  required
                />

                <input
                  type="text"
                  name="panNumber"
                  value={formData.panNumber}
                  onChange={handleInputChange}
                  placeholder="PAN Number"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 uppercase"
                  maxLength={10}
                  required
                />

                <input
                  type="number"
                  name="netSalary"
                  value={formData.netSalary}
                  onChange={handleInputChange}
                  placeholder="Monthly Salary"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3"
                  required
                />

                <input
                  type="number"
                  name="loanAmount"
                  value={formData.loanAmount}
                  onChange={handleInputChange}
                  placeholder="Loan Amount"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3"
                  required
                />

                <select
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3"
                  required
                >
                  <option value="">Select City</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>

                <label className="flex items-start gap-3 rounded-lg border border-gray-200 p-3">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="mt-1 h-4 w-4"
                  />
                  <span className="text-xs text-gray-700">
                    I authorize KreditScore and partners to contact me via call, SMS, email and WhatsApp.
                  </span>
                </label>

                <button
                  type="submit"
                  className="w-full rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 px-4 py-3 font-semibold text-white"
                >
                  Submit Application
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default LoanApplicationForm;
