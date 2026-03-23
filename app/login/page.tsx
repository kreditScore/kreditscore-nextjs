'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Phone, Lock, ArrowRight, Chrome } from 'lucide-react';
import Header from '@/components/Header';
import CustomCursor from '@/components/CustomCursor';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Countdown timer for resend OTP
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Auto-fetch OTP simulation (for testing with default 1234)
  useEffect(() => {
    if (otpSent && 'OTPCredential' in window) {
      // WebOTP API for auto-fill OTP from SMS
      const ac = new AbortController();

      // For testing, auto-fill with 1234 after 2 seconds
      setTimeout(() => {
        setOtp('1234');
      }, 2000);

      // Real OTP auto-fetch (will work when SMS with OTP arrives)
      // navigator.credentials.get({
      //   otp: { transport: ['sms'] },
      //   signal: ac.signal
      // }).then((otp: any) => {
      //   setOtp(otp.code);
      // }).catch(err => {
      //   console.log(err);
      // });

      return () => ac.abort();
    }
  }, [otpSent]);

  const handleSendOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobile.length === 10) {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        setOtpSent(true);
        setIsLoading(false);
        setCountdown(30);
      }, 1500);
    }
  };

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp === '1234') {
      setIsLoading(true);
      setTimeout(() => {
        // Redirect to dashboard after successful login
        router.push('/dashboard');
      }, 1000);
    } else {
      alert('Invalid OTP. Please use 1234 for testing.');
    }
  };

  const handleGoogleSignIn = () => {
    // Google Sign-In logic here
    alert('Google Sign-In will be integrated');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Custom Cursor */}
      <CustomCursor />

      {/* Header */}
      <Header />

      {/* Login Content */}
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="flex items-center justify-center min-h-screen pt-[100px] pb-[50px] px-4"
      >
        <div className="w-full max-w-md">
          {/* Login Card */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="bg-white rounded-3xl shadow-2xl p-8 md:p-10"
          >
            {/* Illustration */}
            <div className="flex justify-center mb-6">
              <div className="relative w-32 h-32">
                {/* Simple illustration - person with phone */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                    <Phone className="w-12 h-12 text-blue-600" />
                  </div>
                </div>
                {/* Lock icon */}
                <div className="absolute top-0 right-0 w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center border-4 border-white">
                  <Lock className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </div>

            {/* Heading */}
            <h1 className="text-center mb-2">
              <span className="text-2xl font-bold text-gray-800">Log In to </span>
              <span className="text-2xl font-bold">
                <span className="text-[#FF8C00]">Kredit</span>
                <span className="text-[#87CEEB]">Score</span>
              </span>
            </h1>
            <p className="text-center text-sm text-gray-600 mb-8">
              We can save searches, track your apps & save plenty of time!
            </p>

            {/* Mobile Number Form */}
            {!otpSent ? (
              <form onSubmit={handleSendOTP} className="space-y-6">
                {/* Mobile Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter your mobile number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="Enter your mobile number"
                      className="block w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      maxLength={10}
                      required
                      autoComplete="tel"
                    />
                  </div>
                </div>

                {/* Login Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={mobile.length !== 10 || isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      Login with OTP
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </motion.button>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">or</span>
                  </div>
                </div>

                {/* Google Sign In */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="w-full bg-white border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-gray-50 transition-all"
                >
                  <Chrome className="w-5 h-5 text-red-500" />
                  Sign in with Google
                </motion.button>
              </form>
            ) : (
              /* OTP Verification Form */
              <form onSubmit={handleVerifyOTP} className="space-y-6">
                {/* OTP sent message */}
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
                  <p className="text-sm text-green-800 text-center">
                    OTP sent to <span className="font-semibold">+91 {mobile}</span>
                  </p>
                </div>

                {/* OTP Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter OTP
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      placeholder="Enter 4-digit OTP"
                      className="block w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-center text-2xl tracking-widest font-semibold"
                      maxLength={4}
                      required
                      autoComplete="one-time-code"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    {countdown > 0 ? (
                      `Resend OTP in ${countdown}s`
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setCountdown(30);
                          // Resend OTP logic
                        }}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Resend OTP
                      </button>
                    )}
                  </p>
                </div>

                {/* Verify Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={otp.length !== 4 || isLoading}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:from-green-700 hover:to-green-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      Verify & Continue
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </motion.button>

                {/* Change Number */}
                <button
                  type="button"
                  onClick={() => {
                    setOtpSent(false);
                    setOtp('');
                    setMobile('');
                  }}
                  className="w-full text-sm text-gray-600 hover:text-gray-800 font-medium"
                >
                  Change mobile number
                </button>
              </form>
            )}

            {/* Footer Note */}
            <p className="text-xs text-gray-500 text-center mt-6">
              By continuing, you agree to our{' '}
              <Link href="#" className="text-blue-600 hover:underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="#" className="text-blue-600 hover:underline">
                Privacy Policy
              </Link>
            </p>
          </motion.div>

          {/* Back to Home */}
          <div className="text-center mt-6">
            <Link
              href="/"
              className="text-sm text-gray-600 hover:text-gray-800 font-medium inline-flex items-center gap-2"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-6 text-center">
        <p className="text-sm">© 2024 KreditScore. All rights reserved.</p>
      </footer>
    </div>
  );
}
