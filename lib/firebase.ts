import { initializeApp, getApps, type FirebaseApp, type FirebaseOptions } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';

function getFirebaseOptions(): FirebaseOptions | null {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
  const messagingSenderId = process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
  const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;
  const measurementId = process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID;

  if (!apiKey || !authDomain || !projectId || !appId) {
    return null;
  }

  return {
    apiKey,
    authDomain,
    projectId,
    storageBucket,
    messagingSenderId,
    appId,
    ...(measurementId ? { measurementId } : {}),
  };
}

/** True when client env has minimum Firebase web config (public vars). */
export function isFirebaseConfigured(): boolean {
  return getFirebaseOptions() !== null;
}

let app: FirebaseApp | undefined;

/**
 * Returns Firebase app in the browser when env is valid; otherwise null.
 * Never throws — use this when you need to avoid crashing the whole app on Vercel without env.
 */
export function getFirebaseApp(): FirebaseApp | null {
  if (typeof window === 'undefined') {
    return null;
  }
  const options = getFirebaseOptions();
  if (!options) {
    return null;
  }
  if (!app) {
    app = getApps().length ? getApps()[0]! : initializeApp(options);
  }
  return app;
}

export function getFirebaseAuth(): Auth | null {
  const appInstance = getFirebaseApp();
  return appInstance ? getAuth(appInstance) : null;
}
