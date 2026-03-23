'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Building2, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';

interface Bank {
  name: string;
  logo: string;
  category: string;
  minSalary: string;
  multiplier: string;
  color: string;
}

interface CompanyCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CompanyCategoryModal({ isOpen, onClose }: CompanyCategoryModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Sample companies for autocomplete
  const sampleCompanies = [
    'Tata Consultancy Services (TCS)',
    'Infosys Limited',
    'Wipro Limited',
    'HCL Technologies',
    'Tech Mahindra',
    'Accenture India',
    'Cognizant Technology Solutions',
    'Capgemini India',
    'IBM India',
    'Oracle India',
    'Tata Motors',
    'Tata Steel',
    'Reliance Industries',
    'HDFC Bank',
    'ICICI Bank'
  ];

  // Sample bank categories (will come from API later)
  const bankCategories: Bank[] = [
    {
      name: 'HDFC Bank',
      logo: '🏦',
      category: 'Category A',
      minSalary: '₹25,000',
      multiplier: '30x',
      color: 'from-blue-500 to-blue-600'
    },
    {
      name: 'ICICI Bank',
      logo: '🏦',
      category: 'Category A',
      minSalary: '₹30,000',
      multiplier: '32x',
      color: 'from-orange-500 to-orange-600'
    },
    {
      name: 'Kotak Mahindra',
      logo: '🏦',
      category: 'Category B',
      minSalary: '₹25,000',
      multiplier: '25x',
      color: 'from-red-500 to-red-600'
    },
    {
      name: 'Axis Bank',
      logo: '🏦',
      category: 'Category B',
      minSalary: '₹28,000',
      multiplier: '28x',
      color: 'from-purple-500 to-purple-600'
    },
    {
      name: 'SBI',
      logo: '🏦',
      category: 'Category C',
      minSalary: '₹20,000',
      multiplier: '20x',
      color: 'from-blue-700 to-blue-800'
    }
  ];

  const filteredCompanies = sampleCompanies.filter(company =>
    company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = (company: string) => {
    setIsSearching(true);
    setSelectedCompany(company);
    setSearchQuery(company);

    // Simulate API call
    setTimeout(() => {
      setIsSearching(false);
    }, 500);
  };

  const getCategoryColor = (category: string) => {
    if (category.includes('A')) return 'bg-green-100 text-green-700 border-green-300';
    if (category.includes('B')) return 'bg-yellow-100 text-yellow-700 border-yellow-300';
    return 'bg-orange-100 text-orange-700 border-orange-300';
  };

  const getCategoryIcon = (category: string) => {
    if (category.includes('A')) return <CheckCircle className="w-4 h-4" />;
    if (category.includes('B')) return <TrendingUp className="w-4 h-4" />;
    return <AlertCircle className="w-4 h-4" />;
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white relative">
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </motion.button>

                <div className="flex items-center gap-3 mb-2">
                  <motion.div
                    animate={{
                      rotate: [0, 10, -10, 10, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 3
                    }}
                    className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center"
                  >
                    <Building2 className="w-7 h-7 text-white" />
                  </motion.div>
                  <div>
                    <h2 className="text-2xl font-bold">Company Bank Categories</h2>
                    <p className="text-blue-100 text-sm">Check your company's eligibility across banks</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                {/* Search Box */}
                <div className="mb-6">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search your company name..."
                      className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-gray-800 font-medium"
                    />
                  </div>

                  {/* Autocomplete Suggestions */}
                  {searchQuery && !selectedCompany && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto"
                    >
                      {filteredCompanies.length > 0 ? (
                        filteredCompanies.map((company, index) => (
                          <motion.button
                            key={company}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => handleSearch(company)}
                            className="w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors flex items-center gap-3 border-b last:border-b-0"
                          >
                            <Building2 className="w-4 h-4 text-blue-600" />
                            <span className="text-gray-800 font-medium">{company}</span>
                          </motion.button>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-gray-500 text-center">
                          No companies found
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>

                {/* Results */}
                {isSearching && (
                  <div className="text-center py-12">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"
                    />
                    <p className="text-gray-600">Searching bank categories...</p>
                  </div>
                )}

                {selectedCompany && !isSearching && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {/* Selected Company */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 mb-6 border border-blue-200">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                          <Building2 className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Selected Company</p>
                          <h3 className="text-lg font-bold text-gray-900">{selectedCompany}</h3>
                        </div>
                      </div>
                    </div>

                    {/* Bank Categories Grid */}
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">
                        Bank Categories & Eligibility
                      </h3>

                      {bankCategories.map((bank, index) => (
                        <motion.div
                          key={bank.name}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.02, x: 5 }}
                          className="bg-white border-2 border-gray-200 rounded-xl p-5 hover:border-blue-400 hover:shadow-lg transition-all"
                        >
                          <div className="flex items-center justify-between flex-wrap gap-4">
                            {/* Bank Info */}
                            <div className="flex items-center gap-4">
                              <div className={`w-14 h-14 bg-gradient-to-br ${bank.color} rounded-xl flex items-center justify-center text-2xl shadow-md`}>
                                {bank.logo}
                              </div>
                              <div>
                                <h4 className="text-lg font-bold text-gray-900">{bank.name}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getCategoryColor(bank.category)} flex items-center gap-1`}>
                                    {getCategoryIcon(bank.category)}
                                    {bank.category}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Eligibility Details */}
                            <div className="flex gap-6 text-sm">
                              <div>
                                <p className="text-gray-500 font-medium">Min. Salary</p>
                                <p className="text-gray-900 font-bold">{bank.minSalary}</p>
                              </div>
                              <div>
                                <p className="text-gray-500 font-medium">Multiplier</p>
                                <p className="text-blue-600 font-bold">{bank.multiplier}</p>
                              </div>
                            </div>

                            {/* Apply Button */}
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                            >
                              Apply Now
                            </motion.button>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Info Note */}
                    <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <p className="text-sm text-blue-800">
                        <strong>Note:</strong> Categories are updated monthly based on bank criteria.
                        Final eligibility depends on your credit score, existing loans, and bank's internal policies.
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Initial State */}
                {!searchQuery && !selectedCompany && (
                  <div className="text-center py-12">
                    <motion.div
                      animate={{
                        y: [0, -10, 0],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl"
                    >
                      <Building2 className="w-12 h-12 text-white" />
                    </motion.div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Search Your Company
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Enter your company name to see bank categories and loan eligibility
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {['TCS', 'Infosys', 'Wipro', 'HCL', 'Tech Mahindra'].map((company, index) => (
                        <motion.button
                          key={company}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleSearch(company)}
                          className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium hover:bg-blue-200 transition-colors"
                        >
                          {company}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
