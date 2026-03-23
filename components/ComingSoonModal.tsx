'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Smartphone, Download } from 'lucide-react';

interface ComingSoonModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureName: string;
}

const ComingSoonModal = ({ isOpen, onClose, featureName }: ComingSoonModalProps) => {
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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>

              {/* Content */}
              <div className="text-center">
                {/* Icon */}
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="mb-6"
                >
                  <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full">
                    <Smartphone className="w-12 h-12 text-white" />
                  </div>
                </motion.div>

                {/* Title */}
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  {featureName}
                </h2>

                {/* Message */}
                <p className="text-lg text-gray-600 mb-6">
                  This feature is available in our Mobile App
                </p>

                {/* Download Button */}
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="https://play.google.com/store"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg"
                >
                  <Download className="w-5 h-5" />
                  Download Mobile App
                </motion.a>

                {/* Additional Info */}
                <div className="mt-8 space-y-3">
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                    <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                    Available on Android & iOS
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                    <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                    Free Download
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ComingSoonModal;
