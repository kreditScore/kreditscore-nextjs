"use client";

import { useCallback, useRef } from "react";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signInWithPopup,
  signOut,
  type ConfirmationResult,
} from "firebase/auth";
import {
  ensureFirebaseAuth,
  getGoogleProvider,
  isFirebaseClientResolved,
  isFirebaseConfigured,
} from "@/lib/firebase/client";
import { toast } from "sonner";

/** Call /api/auth/session to sync user to Supabase & set cookie */
async function syncSession(idToken: string, provider: "phone" | "google" | "email") {
  const res = await fetch("/api/auth/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken, provider }),
  });
  const body = (await res.json().catch(() => ({}))) as { error?: string };
  if (!res.ok) {
    const hint =
      body.error === "database_unavailable" || body.error === "auth_server_misconfigured"
        ? body.error
        : "session_sync";
    throw new Error(hint);
  }
  return body;
}

function mapFirebaseAuthError(e: unknown): string {
  const code =
    typeof e === "object" && e !== null && "code" in e
      ? String((e as { code?: string }).code)
      : "";
  const byCode: Record<string, string> = {
    "auth/invalid-phone-number": "Invalid mobile number.",
    "auth/missing-phone-number": "Enter your full mobile number.",
    "auth/too-many-requests": "Too many SMS attempts. Try again in a few minutes.",
    "auth/captcha-check-failed":
      "Verification did not complete. Refresh the page and try Send OTP again.",
    "auth/quota-exceeded": "SMS quota exceeded. Try again later.",
    "auth/user-disabled": "This account is disabled.",
    "auth/invalid-verification-code": "Wrong OTP. Check the SMS and try again.",
    "auth/code-expired": "OTP expired. Tap Resend OTP.",
    "auth/session-expired": "Session expired. Request a new OTP.",
  };
  if (code && byCode[code]) return byCode[code];
  return e instanceof Error ? e.message : "Something went wrong.";
}

// ────────────────────────────────────────────────────────────
//  Phone OTP
// ────────────────────────────────────────────────────────────
export function useFirebasePhoneAuth(recaptchaContainerId: string) {
  const confirmationRef = useRef<ConfirmationResult | null>(null);
  const clearVerifier = useCallback(() => {
    const verifier = (window as any).recaptchaVerifier;
    if (verifier) {
      try { verifier.clear(); } catch { /* ignore */ }
      (window as any).recaptchaVerifier = null;
    }
  }, []);

  const sendOtp = async (phoneE164: string): Promise<boolean> => {
    const auth = await ensureFirebaseAuth();
    if (!auth) {
      toast.error(
        isFirebaseConfigured()
          ? "Firebase failed to load. Refresh the page."
          : "Firebase env missing on the server. In Vercel → Settings → Environment Variables → Production: add FIREBASE_WEB_CONFIG_JSON (paste firebaseConfig JSON from Firebase Console as one line), save, Redeploy. Or set FIREBASE_WEB_API_KEY, AUTH_DOMAIN, PROJECT_ID, APP_ID."
      );
      return false;
    }
    try {
      // 1. Destroy any existing verifier completely
      const oldVerifier = (window as any).recaptchaVerifier;
      if (oldVerifier) {
        try { oldVerifier.clear(); } catch {}
        (window as any).recaptchaVerifier = null;
      }

      // 2. Wipe the DOM element clean
      const el = document.getElementById(recaptchaContainerId);
      if (el) {
         el.innerHTML = '';
      }

      // 3. Create fresh verifier
      const verifier = new RecaptchaVerifier(auth, recaptchaContainerId, {
        size: "invisible",
      });
      (window as any).recaptchaVerifier = verifier;

      confirmationRef.current = await signInWithPhoneNumber(auth, phoneE164, verifier);
      toast.success("OTP sent! Check your SMS.");
      return true;
    } catch (e: unknown) {
      toast.error(mapFirebaseAuthError(e));
      clearVerifier();
      return false;
    }
  };

  const verifyOtp = async (code: string): Promise<string | null> => {
    if (!confirmationRef.current) {
      toast.error("Request a new OTP first");
      return null;
    }
    const auth = await ensureFirebaseAuth();
    if (!auth) {
      toast.error("Firebase not loaded. Refresh the page and request a new OTP.");
      return null;
    }
    try {
      const cred = await confirmationRef.current.confirm(code.trim());
      const idToken = await cred.user.getIdToken();
      try {
        await syncSession(idToken, "phone");
        return idToken;
      } catch (syncErr) {
        if (auth) {
          try {
            await signOut(auth);
          } catch {
            /* ignore */
          }
        }
        const code = syncErr instanceof Error ? syncErr.message : "session_sync";
        const serverHint: Record<string, string> = {
          database_unavailable:
            "Login database is unreachable. Set DATABASE_URL (and DATABASE_SSL) on the server.",
          auth_server_misconfigured:
            "Server needs FIREBASE_SERVICE_ACCOUNT_JSON (Firebase service account) to finish login.",
          session_sync: "Could not save your session. Try again.",
        };
        toast.error(serverHint[code] ?? serverHint.session_sync);
        return null;
      }
    } catch (e: unknown) {
      toast.error(mapFirebaseAuthError(e));
      return null;
    }
  };

  return { sendOtp, verifyOtp, isConfigured: isFirebaseConfigured() || isFirebaseClientResolved() };
}

// ────────────────────────────────────────────────────────────
//  Google Sign-In
// ────────────────────────────────────────────────────────────
export function useFirebaseGoogleAuth() {
  const signInWithGoogle = async (): Promise<string | null> => {
    const auth = await ensureFirebaseAuth();
    if (!auth) {
      toast.error(
        "Firebase env missing. In Vercel add FIREBASE_WEB_CONFIG_JSON (firebaseConfig JSON) or FIREBASE_WEB_* keys, then Redeploy."
      );
      return null;
    }
    try {
      const provider = getGoogleProvider();
      const cred = await signInWithPopup(auth, provider);
      const idToken = await cred.user.getIdToken();
      // Sync to Supabase
      await syncSession(idToken, "google");
      toast.success(`Welcome, ${cred.user.displayName ?? "User"}!`);
      return idToken;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Google sign-in failed";
      // Ignore popup closed by user
      if ((e as { code?: string }).code === "auth/popup-closed-by-user") return null;
      toast.error(msg);
      return null;
    }
  };

  return { signInWithGoogle, isConfigured: isFirebaseConfigured() || isFirebaseClientResolved() };
}
