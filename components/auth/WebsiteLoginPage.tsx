'use client';

import { useState, useEffect, useId, useRef } from 'react';
import { toast } from 'sonner';
import { useFirebasePhoneAuth, useFirebaseGoogleAuth } from '@/hooks/useFirebasePhoneAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Shield, ArrowRight, ChevronLeft, RefreshCw } from 'lucide-react';
import Header from '@/components/Header';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

// Google SVG icon (official colors)
function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M43.611 20.083H42V20H24v8h11.303C33.654 32.657 29.332 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" fill="#FFC107"/>
      <path d="M6.306 14.691l6.571 4.819C14.655 15.108 19.001 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" fill="#FF3D00"/>
      <path d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.31 0-9.823-3.417-11.42-8.205l-6.412 4.941C9.736 39.758 16.318 44 24 44z" fill="#4CAF50"/>
      <path d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 01-4.087 5.571l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" fill="#1976D2"/>
    </svg>
  );
}

// Individual OTP digit input component
function OtpInput({
  value,
  onChange,
  onKeyDown,
  inputRef,
  index,
}: {
  value: string;
  onChange: (val: string, idx: number) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => void;
  inputRef: (el: HTMLInputElement | null) => void;
  index: number;
}) {
  return (
    <input
      ref={inputRef}
      type="text"
      inputMode="numeric"
      maxLength={1}
      value={value}
      onChange={(e) => onChange(e.target.value.replace(/\D/g, ''), index)}
      onKeyDown={(e) => onKeyDown(e, index)}
      className="w-12 h-14 text-center text-xl font-bold border-2 rounded-xl transition-all outline-none
        border-gray-200 focus:border-[#FF8C00] focus:ring-2 focus:ring-[#FF8C00]/20
        bg-white text-[#2c3e50] shadow-sm"
      aria-label={`OTP digit ${index + 1}`}
      id={`otp-digit-${index}`}
    />
  );
}

export default function WebsiteLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/dashboard';

  const recaptchaSuffix = useId().replace(/[^a-zA-Z0-9]/g, '');
  const recaptchaContainerId = `fb-rc-${recaptchaSuffix}`;

  const { sendOtp, verifyOtp } = useFirebasePhoneAuth(recaptchaContainerId);
  const { signInWithGoogle } = useFirebaseGoogleAuth();

  const [mobile, setMobile] = useState('');
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Auto-focus first OTP input when OTP sent
  useEffect(() => {
    if (otpSent) {
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }
  }, [otpSent]);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mobile.length !== 10) return;
    setIsLoading(true);
    const ok = await sendOtp(`+91${mobile}`);
    if (ok) {
      setOtpSent(true);
      setCountdown(60);
      setDigits(['', '', '', '', '', '']);
    }
    setIsLoading(false);
  };

  const handleOtpDigitChange = (val: string, idx: number) => {
    const next = [...digits];
    next[idx] = val;
    setDigits(next);
    // Auto-advance
    if (val && idx < 5) {
      inputRefs.current[idx + 1]?.focus();
    }
    // Auto-submit if all filled
    if (val && idx === 5 && next.every((d) => d.length === 1)) {
      handleVerifyWithDigits(next);
    }
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === 'Backspace' && !digits[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  };

  const handleVerifyWithDigits = async (d: string[]) => {
    const code = d.join('');
    if (code.length !== 6) return;
    setIsLoading(true);
    const token = await verifyOtp(code);
    setIsLoading(false);
    if (token) {
      toast.success('Login successful! Redirecting...');
      router.push(redirectTo);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleVerifyWithDigits(digits);
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    const ok = await sendOtp(`+91${mobile}`);
    if (ok) {
      setCountdown(60);
      setDigits(['', '', '', '', '', '']);
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }
    setIsLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    const token = await signInWithGoogle();
    setIsGoogleLoading(false);
    if (token) {
      router.push(redirectTo);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8F0] via-[#F0F8FF] to-[#FFF0F8]">
      {/* Invisible reCAPTCHA: must NOT use display:none — it breaks the verifier */}
      <div id={recaptchaContainerId} className="sr-only" aria-hidden="true" />

      <Header />

      {/* Background decorative blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#FF8C00]/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#87CEEB]/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-50/50 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative flex items-center justify-center min-h-screen pt-[90px] pb-[50px] px-4"
      >
        <div className="w-full max-w-[420px]">
          {/* Card */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.1)] border border-white/60 overflow-hidden"
          >
            {/* Top gradient strip */}
            <div className="h-1.5 bg-gradient-to-r from-[#FF8C00] via-[#FFB347] to-[#87CEEB]" />

            <div className="p-8 md:p-10">
              {/* Logo */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#FF8C00]/20 to-[#87CEEB]/20 rounded-2xl flex items-center justify-center shadow-inner">
                    <Phone className="w-9 h-9 text-[#FF8C00]" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center shadow-md">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>

              <h1 className="text-center mb-1">
                <span className="text-[22px] font-bold text-gray-800">Login to </span>
                <span className="text-[22px] font-bold">
                  <span className="text-[#FF8C00]">Kredit</span>
                  <span className="text-[#87CEEB]">Score</span>
                </span>
              </h1>
              <p className="text-center text-sm text-gray-500 mb-7">
                Sign in to track your loans & credit score
              </p>

              <AnimatePresence mode="wait">
                {!otpSent ? (
                  /* ─── Step 1: Enter Mobile ─── */
                  <motion.div
                    key="phone-step"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <form onSubmit={handleSendOTP} className="space-y-4">
                      <div>
                        <label htmlFor="mobile-input" className="block text-sm font-medium text-gray-700 mb-2">
                          Mobile Number
                        </label>
                        <div className="flex items-stretch rounded-xl border-2 border-gray-200 focus-within:border-[#FF8C00] focus-within:ring-2 focus-within:ring-[#FF8C00]/20 transition-all overflow-hidden bg-white">
                          <div className="flex items-center px-4 bg-gray-50 border-r border-gray-200">
                            <span className="text-lg">🇮🇳</span>
                            <span className="ml-2 text-sm font-semibold text-gray-600">+91</span>
                          </div>
                          <input
                            id="mobile-input"
                            type="tel"
                            value={mobile}
                            onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                            placeholder="Enter 10-digit number"
                            className="flex-1 px-4 py-3.5 text-[15px] outline-none bg-white text-gray-800 placeholder-gray-400"
                            maxLength={10}
                            required
                            autoComplete="tel-national"
                          />
                        </div>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={mobile.length !== 10 || isLoading}
                        id="send-otp-btn"
                        className="w-full bg-gradient-to-r from-[#FF8C00] to-[#FFB347] text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg shadow-orange-200 hover:shadow-orange-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                      >
                        {isLoading
                          ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          : <><span>Send OTP</span><ArrowRight className="w-4 h-4" /></>
                        }
                      </motion.button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-5">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200" />
                      </div>
                      <div className="relative flex justify-center">
                        <span className="px-4 bg-white text-xs text-gray-400 font-medium uppercase tracking-widest">or continue with</span>
                      </div>
                    </div>

                    {/* Google Sign In */}
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      id="google-signin-btn"
                      onClick={handleGoogleSignIn}
                      disabled={isGoogleLoading}
                      className="w-full bg-white border-2 border-gray-200 text-gray-700 py-3.5 rounded-xl font-semibold flex items-center justify-center gap-3 hover:border-gray-300 hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                    >
                      {isGoogleLoading
                        ? <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                        : <><GoogleIcon /><span>Continue with Google</span></>
                      }
                    </motion.button>
                  </motion.div>
                ) : (
                  /* ─── Step 2: Enter OTP ─── */
                  <motion.div
                    key="otp-step"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* OTP sent banner */}
                    <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-6 flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse flex-shrink-0" />
                      <p className="text-sm text-green-800">
                        OTP sent to <span className="font-bold">+91 {mobile}</span>
                      </p>
                    </div>

                    <form onSubmit={handleVerifyOTP} className="space-y-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
                          Enter 6-digit OTP
                        </label>
                        {/* OTP digit boxes */}
                        <div className="flex justify-center gap-2">
                          {digits.map((d, i) => (
                            <OtpInput
                              key={i}
                              index={i}
                              value={d}
                              onChange={handleOtpDigitChange}
                              onKeyDown={handleOtpKeyDown}
                              inputRef={(el) => { inputRefs.current[i] = el; }}
                            />
                          ))}
                        </div>

                        {/* Resend */}
                        <div className="text-center mt-3">
                          {countdown > 0 ? (
                            <p className="text-sm text-gray-400">
                              Resend OTP in <span className="font-semibold text-[#FF8C00]">{countdown}s</span>
                            </p>
                          ) : (
                            <button
                              type="button"
                              onClick={handleResendOtp}
                              disabled={isLoading}
                              className="inline-flex items-center gap-1.5 text-sm text-[#FF8C00] hover:text-[#e67e00] font-semibold disabled:opacity-50 transition-colors"
                            >
                              <RefreshCw className="w-3.5 h-3.5" /> Resend OTP
                            </button>
                          )}
                        </div>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        id="verify-otp-btn"
                        disabled={digits.join('').length !== 6 || isLoading}
                        className="w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg shadow-green-200 hover:shadow-green-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                      >
                        {isLoading
                          ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          : <><span>Verify & Login</span><ArrowRight className="w-4 h-4" /></>
                        }
                      </motion.button>
                    </form>

                    {/* Back to phone */}
                    <button
                      type="button"
                      onClick={() => { setOtpSent(false); setDigits(['', '', '', '', '', '']); setMobile(''); }}
                      className="w-full mt-4 flex items-center justify-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" /> Change mobile number
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Terms */}
              <p className="text-[11px] text-gray-400 text-center mt-6 leading-relaxed">
                By continuing, you agree to our{' '}
                <Link href="/terms" className="text-[#FF8C00] hover:underline">Terms of Service</Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-[#FF8C00] hover:underline">Privacy Policy</Link>
              </p>
            </div>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-center gap-6 mt-6"
          >
            {[
              { icon: '🔒', text: 'Bank-grade security' },
              { icon: '✅', text: 'RBI compliant' },
              { icon: '⚡', text: 'Instant access' },
            ].map((badge) => (
              <div key={badge.text} className="flex items-center gap-1.5 text-xs text-gray-500">
                <span>{badge.icon}</span>
                <span>{badge.text}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
