'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Lock, ArrowRight, Chrome, Mail } from 'lucide-react';
import Header from '@/components/Header';
import CustomCursor from '@/components/CustomCursor';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  GoogleAuthProvider,
  RecaptchaVerifier,
  signInWithEmailAndPassword,
  signInWithPhoneNumber,
  signInWithPopup,
  createUserWithEmailAndPassword,
  type ConfirmationResult,
} from 'firebase/auth';
import { getFirebaseAuth } from '@/lib/firebase';
import { isValidIndianMobile, normalizeIndianMobile } from '@/lib/validation';

type Tab = 'phone' | 'email';

export default function WebsiteLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl') || '/dashboard';

  const [tab, setTab] = useState<Tab>('phone');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const confirmationRef = useRef<ConfirmationResult | null>(null);
  const recaptchaRef = useRef<RecaptchaVerifier | null>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailMode, setEmailMode] = useState<'signin' | 'signup'>('signin');

  useEffect(() => {
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [countdown]);

  useEffect(() => {
    return () => {
      try {
        recaptchaRef.current?.clear();
      } catch {
        /* ignore */
      }
      recaptchaRef.current = null;
    };
  }, []);

  const ensureRecaptcha = () => {
    const auth = getFirebaseAuth();
    if (!recaptchaRef.current) {
      recaptchaRef.current = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
      });
    }
    return recaptchaRef.current;
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const digits = normalizeIndianMobile(mobile);
    if (!isValidIndianMobile(digits)) {
      setError('Enter a valid 10-digit Indian mobile number.');
      return;
    }
    setIsLoading(true);
    try {
      const auth = getFirebaseAuth();
      const appVerifier = ensureRecaptcha();
      const phoneE164 = `+91${digits}`;
      const confirmation = await signInWithPhoneNumber(auth, phoneE164, appVerifier);
      confirmationRef.current = confirmation;
      setOtpSent(true);
      setCountdown(30);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to send OTP';
      setError(msg);
      try {
        recaptchaRef.current?.clear();
      } catch {
        /* ignore */
      }
      recaptchaRef.current = null;
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!confirmationRef.current || otp.length < 4) return;
    setIsLoading(true);
    try {
      await confirmationRef.current.confirm(otp);
      router.push(returnUrl);
    } catch {
      setError('Invalid OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError(null);
    setIsLoading(true);
    try {
      const auth = getFirebaseAuth();
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push(returnUrl);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Google sign-in failed';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim() || password.length < 6) {
      setError('Email and password (min 6 chars) required.');
      return;
    }
    setIsLoading(true);
    try {
      const auth = getFirebaseAuth();
      if (emailMode === 'signup') {
        await createUserWithEmailAndPassword(auth, email.trim(), password);
      } else {
        await signInWithEmailAndPassword(auth, email.trim(), password);
      }
      router.push(returnUrl);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Email sign-in failed';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <CustomCursor />
      <Header />
      <div id="recaptcha-container" />

      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="flex items-center justify-center min-h-screen pt-[100px] pb-[50px] px-4"
      >
        <div className="w-full max-w-md">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="bg-white rounded-3xl shadow-2xl p-8 md:p-10"
          >
            <div className="flex justify-center mb-6">
              <div className="relative w-32 h-32">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                    <Phone className="w-12 h-12 text-blue-600" />
                  </div>
                </div>
                <div className="absolute top-0 right-0 w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center border-4 border-white">
                  <Lock className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </div>

            <h1 className="text-center mb-2">
              <span className="text-2xl font-bold text-gray-800">Log In to </span>
              <span className="text-2xl font-bold">
                <span className="text-[#FF8C00]">Kredit</span>
                <span className="text-[#87CEEB]">Score</span>
              </span>
            </h1>
            <p className="text-center text-sm text-gray-600 mb-8">
              One login — apply on any page without OTP again. Use phone OTP, Google, or email.
            </p>

            <div className="flex rounded-xl bg-gray-100 p-1 mb-6">
              <button
                type="button"
                onClick={() => {
                  setTab('phone');
                  setError(null);
                }}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  tab === 'phone' ? 'bg-white shadow text-blue-700' : 'text-gray-600'
                }`}
              >
                Phone OTP
              </button>
              <button
                type="button"
                onClick={() => {
                  setTab('email');
                  setError(null);
                }}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  tab === 'email' ? 'bg-white shadow text-blue-700' : 'text-gray-600'
                }`}
              >
                Email
              </button>
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2 mb-4">{error}</p>
            )}

            {tab === 'phone' && !otpSent && (
              <form onSubmit={handleSendOTP} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Enter your mobile number</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="10-digit mobile"
                      className="block w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      maxLength={10}
                      required
                    />
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={!isValidIndianMobile(normalizeIndianMobile(mobile)) || isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      Send OTP <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </motion.button>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">or</span>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={handleGoogle}
                  disabled={isLoading}
                  className="w-full bg-white border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-gray-50 transition-all"
                >
                  <Chrome className="w-5 h-5 text-red-500" /> Sign in with Google
                </motion.button>
              </form>
            )}

            {tab === 'phone' && otpSent && (
              <form onSubmit={handleVerifyOTP} className="space-y-6">
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
                  <p className="text-sm text-green-800 text-center">
                    OTP sent to <span className="font-semibold">+91 {normalizeIndianMobile(mobile)}</span>
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Enter OTP</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="6-digit OTP"
                      className="block w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-center text-2xl tracking-widest font-semibold"
                      maxLength={6}
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    {countdown > 0 ? (
                      `Resend OTP in ${countdown}s`
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setOtpSent(false);
                          setOtp('');
                          confirmationRef.current = null;
                        }}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Resend / Change number
                      </button>
                    )}
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={otp.length < 4 || isLoading}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:from-green-700 hover:to-green-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      Verify & Continue <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </motion.button>
              </form>
            )}

            {tab === 'email' && (
              <form onSubmit={handleEmailSubmit} className="space-y-3">
                <div className="flex gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() => setEmailMode('signin')}
                    className={`flex-1 py-2 rounded-lg text-xs font-semibold ${emailMode === 'signin' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
                  >
                    Sign in
                  </button>
                  <button
                    type="button"
                    onClick={() => setEmailMode('signup')}
                    className={`flex-1 py-2 rounded-lg text-xs font-semibold ${emailMode === 'signup' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
                  >
                    Create account
                  </button>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-3 py-3 border-2 border-gray-200 rounded-xl"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password (min 6)</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-3 border-2 border-gray-200 rounded-xl"
                    required
                    minLength={6}
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl font-semibold"
                >
                  {isLoading ? 'Please wait…' : emailMode === 'signup' ? 'Create account' : 'Sign in'}
                </motion.button>
                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">or</span>
                  </div>
                </div>
                <motion.button
                  type="button"
                  onClick={handleGoogle}
                  disabled={isLoading}
                  className="w-full bg-white border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
                >
                  <Chrome className="w-5 h-5 text-red-500" /> Google
                </motion.button>
              </form>
            )}

            <p className="text-xs text-gray-500 text-center mt-6">
              By continuing, you agree to our{' '}
              <Link href="/privacy-policy" className="text-blue-600 hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
          </motion.div>
        </div>
      </motion.div>
      <footer className="bg-gray-900 text-white py-6 text-center">
        <p className="text-sm">© 2024 KreditScore. All rights reserved.</p>
      </footer>
    </div>
  );
}
