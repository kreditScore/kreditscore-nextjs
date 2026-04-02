'use client';

import { useEffect, useId, useRef, useState } from 'react';
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  type ConfirmationResult,
} from 'firebase/auth';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Phone, ArrowRight, Lock } from 'lucide-react';
import { getFirebaseAuth, isFirebaseConfigured } from '@/lib/firebase';
import { isValidIndianMobile, normalizeIndianMobile } from '@/lib/validation';

type Props = {
  /** Used for "Continue with Google / Email" link */
  returnPath?: string;
  className?: string;
};

export default function FirebasePhoneAuthInline({ returnPath, className = '' }: Props) {
  const pathname = usePathname();
  const ret = returnPath ?? pathname ?? '/';
  const domId = useId().replace(/:/g, '');
  const containerId = `recaptcha-inline-${domId}`;

  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const confirmationRef = useRef<ConfirmationResult | null>(null);
  const recaptchaRef = useRef<RecaptchaVerifier | null>(null);

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

  /** Web OTP API — Android Chrome auto-reads SMS when SMS includes origin + #code (Firebase format). */
  useEffect(() => {
    if (!otpSent || typeof window === 'undefined') return;
    if (!('OTPCredential' in window)) return;

    const ac = new AbortController();
    const t = window.setTimeout(() => {
      type NavCred = Navigator & {
        credentials?: { get: (o: { otp: { transport: string[] }; signal: AbortSignal }) => Promise<{ code?: string } | null> };
      };
      const nav = navigator as NavCred;
      nav.credentials
        ?.get?.({
          otp: { transport: ['sms'] },
          signal: ac.signal,
        })
        .then((cred) => {
          const code = cred && 'code' in cred ? (cred as { code?: string }).code : undefined;
          if (code) setOtp(String(code).replace(/\D/g, '').slice(0, 6));
        })
        .catch(() => undefined);
    }, 500);

    return () => {
      ac.abort();
      window.clearTimeout(t);
    };
  }, [otpSent]);

  const ensureRecaptcha = () => {
    const auth = getFirebaseAuth();
    if (!auth) throw new Error('Firebase not configured');
    if (!recaptchaRef.current) {
      recaptchaRef.current = new RecaptchaVerifier(auth, containerId, {
        size: 'invisible',
      });
    }
    return recaptchaRef.current;
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!getFirebaseAuth()) {
      setError('Firebase env missing. Add NEXT_PUBLIC_FIREBASE_* in Vercel and redeploy.');
      return;
    }
    const digits = normalizeIndianMobile(mobile);
    if (!isValidIndianMobile(digits)) {
      setError('Valid 10-digit Indian mobile required.');
      return;
    }
    setLoading(true);
    try {
      const auth = getFirebaseAuth()!;
      const appVerifier = ensureRecaptcha();
      const confirmation = await signInWithPhoneNumber(auth, `+91${digits}`, appVerifier);
      confirmationRef.current = confirmation;
      setOtpSent(true);
      setOtp('');
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
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!confirmationRef.current || otp.length < 6) {
      setError('Enter the 6-digit OTP from SMS.');
      return;
    }
    setLoading(true);
    try {
      await confirmationRef.current.confirm(otp);
    } catch {
      setError('Invalid OTP. Try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isFirebaseConfigured()) {
    return (
      <div className={`rounded-xl border border-amber-200 bg-amber-50 p-3 sm:p-4 text-xs text-amber-950 ${className}`}>
        <p className="font-semibold mb-1">Mobile login not available</p>
        <p className="mb-2 leading-relaxed">
          Add Firebase web config to Vercel: all <span className="font-mono">NEXT_PUBLIC_FIREBASE_*</span> variables
          from Firebase Console → Project settings → Your apps, then Redeploy.
        </p>
        <Link href={`/login?returnUrl=${encodeURIComponent(ret)}`} className="text-blue-700 font-semibold underline">
          Try full login page
        </Link>
      </div>
    );
  }

  return (
    <div className={`rounded-xl border border-blue-100 bg-blue-50/40 p-3 sm:p-4 ${className}`}>
      <div id={containerId} />
      <p className="text-xs font-semibold text-gray-800 mb-2">Verify mobile (SMS OTP)</p>
      {error && <p className="text-xs text-red-600 mb-2">{error}</p>}

      {!otpSent ? (
        <form onSubmit={handleSend} className="space-y-2">
          <div className="flex gap-2">
            <span className="flex items-center px-2 py-2 border rounded-lg bg-gray-50 text-xs font-semibold">+91</span>
            <input
              type="tel"
              value={mobile}
              onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
              placeholder="10-digit mobile"
              className="flex-1 px-2 py-2 border rounded-lg text-sm"
              maxLength={10}
              required
              autoComplete="tel"
            />
          </div>
          <button
            type="submit"
            disabled={!isValidIndianMobile(normalizeIndianMobile(mobile)) || loading}
            className="w-full py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold disabled:opacity-50 flex items-center justify-center gap-1"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Phone className="w-4 h-4" /> Send OTP
              </>
            )}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerify} className="space-y-2">
          <p className="text-[10px] text-gray-600">OTP sent to +91 {normalizeIndianMobile(mobile)}</p>
          <div className="relative">
            <Lock className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="6-digit OTP"
              className="w-full pl-8 pr-2 py-2 border rounded-lg text-center text-lg tracking-widest font-semibold"
              maxLength={6}
              required
            />
          </div>
          <button
            type="submit"
            disabled={otp.length !== 6 || loading}
            className="w-full py-2 rounded-lg bg-green-600 text-white text-sm font-semibold disabled:opacity-50 flex items-center justify-center gap-1"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                Verify <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
          <button
            type="button"
            className="text-xs text-blue-600 underline w-full"
            onClick={() => {
              setOtpSent(false);
              setOtp('');
              confirmationRef.current = null;
              try {
                recaptchaRef.current?.clear();
              } catch {
                /* ignore */
              }
              recaptchaRef.current = null;
            }}
          >
            Change number
          </button>
        </form>
      )}

      <p className="text-[10px] text-gray-500 mt-2 text-center">
        Or{' '}
        <Link href={`/login?returnUrl=${encodeURIComponent(ret)}`} className="text-blue-600 font-semibold underline">
          Google / Email
        </Link>
      </p>
    </div>
  );
}
