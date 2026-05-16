import { initializeApp, getApps, type FirebaseApp, type FirebaseOptions } from "firebase/app";
import { getAuth, type Auth, GoogleAuthProvider } from "firebase/auth";

function fromEnv(): Partial<FirebaseOptions> {
  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  };
}

function isComplete(c: Partial<FirebaseOptions>): c is FirebaseOptions {
  return Boolean(
    String(c.apiKey ?? "").trim() &&
      String(c.authDomain ?? "").trim() &&
      String(c.projectId ?? "").trim() &&
      String(c.appId ?? "").trim()
  );
}

/** Names of required public env vars (for messages). Values are never returned. */
export function getMissingFirebaseClientEnvKeys(): string[] {
  const e = fromEnv();
  const required: { env: string; val: string | undefined }[] = [
    { env: "NEXT_PUBLIC_FIREBASE_API_KEY", val: e.apiKey },
    { env: "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN", val: e.authDomain },
    { env: "NEXT_PUBLIC_FIREBASE_PROJECT_ID", val: e.projectId },
    { env: "NEXT_PUBLIC_FIREBASE_APP_ID", val: e.appId },
  ];
  return required.filter((x) => !String(x.val ?? "").trim()).map((x) => x.env);
}

let cachedOptions: FirebaseOptions | null = null;
let loadPromise: Promise<FirebaseOptions | null> | null = null;
/** True after a successful load (env or /api/config/firebase). */
let clientConfigResolved = false;

function getOrInitApp(options: FirebaseOptions): FirebaseApp {
  if (!getApps().length) {
    return initializeApp(options);
  }
  return getApps()[0];
}

async function fetchRemoteConfig(): Promise<FirebaseOptions | null> {
  try {
    const res = await fetch("/api/config/firebase", { cache: "no-store" });
    if (!res.ok) return null;
    const data = (await res.json()) as Partial<FirebaseOptions>;
    return isComplete(data) ? data : null;
  } catch {
    return null;
  }
}

/**
 * Loads Firebase web config: first from NEXT_PUBLIC_* (build-time), else GET /api/config/firebase
 * (FIREBASE_WEB_* or NEXT_PUBLIC_* on the server at runtime).
 */
export async function loadFirebaseClientConfig(): Promise<FirebaseOptions | null> {
  if (typeof window === "undefined") return null;
  if (cachedOptions) return cachedOptions;

  const envCfg = fromEnv();
  if (isComplete(envCfg)) {
    cachedOptions = envCfg;
    clientConfigResolved = true;
    return cachedOptions;
  }

  if (!loadPromise) {
    loadPromise = fetchRemoteConfig().then((remote) => {
      if (remote) {
        cachedOptions = remote;
        clientConfigResolved = true;
        return remote;
      }
      return null;
    });
  }
  return loadPromise;
}

/** True if the browser already has config (bundle env or prior async load). */
export function isFirebaseClientResolved(): boolean {
  return isFirebaseConfigured() || clientConfigResolved;
}

/** Synchronous: bundle contained full NEXT_PUBLIC_* at build time. */
export function isFirebaseConfigured(): boolean {
  return isComplete(fromEnv());
}

/**
 * Initialize Firebase and return Auth. Safe to call multiple times.
 * Prefer this over getFirebaseAuth() in UI — it loads runtime config when needed.
 */
export async function ensureFirebaseAuth(): Promise<Auth | undefined> {
  if (typeof window === "undefined") return undefined;
  const opts = await loadFirebaseClientConfig();
  if (!opts) return undefined;
  const app = getOrInitApp(opts);
  return getAuth(app);
}

/** Only works after ensureFirebaseAuth() or if NEXT_PUBLIC_* was complete at build. */
export function getFirebaseAuth(): Auth | undefined {
  if (typeof window === "undefined") return undefined;
  if (!cachedOptions) {
    const envCfg = fromEnv();
    if (isComplete(envCfg)) {
      cachedOptions = envCfg;
      clientConfigResolved = true;
    } else {
      return undefined;
    }
  }
  return getAuth(getOrInitApp(cachedOptions));
}

export function getFirebaseApp(): FirebaseApp | undefined {
  if (typeof window === "undefined") return undefined;
  if (!cachedOptions) {
    const envCfg = fromEnv();
    if (isComplete(envCfg)) {
      cachedOptions = envCfg;
      clientConfigResolved = true;
    } else {
      return undefined;
    }
  }
  return getOrInitApp(cachedOptions);
}

/** Pre-configured Google provider with Indian locale hint */
export function getGoogleProvider(): GoogleAuthProvider {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  return provider;
}
