import type { App } from 'firebase-admin/app';

let adminApp: App | undefined;

export async function getFirebaseAdminApp(): Promise<App | null> {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw) return null;
  if (adminApp) return adminApp;

  const admin = await import('firebase-admin/app');
  const { getApps, initializeApp, cert } = admin;

  if (getApps().length) {
    adminApp = getApps()[0]!;
    return adminApp;
  }

  const serviceAccount = JSON.parse(raw) as Parameters<typeof cert>[0];
  adminApp = initializeApp({
    credential: cert(serviceAccount),
  });
  return adminApp;
}

export async function verifyFirebaseIdToken(idToken: string): Promise<{ uid: string } | null> {
  try {
    await getFirebaseAdminApp();
    const { getAuth } = await import('firebase-admin/auth');
    const decoded = await getAuth().verifyIdToken(idToken);
    return { uid: decoded.uid };
  } catch {
    return null;
  }
}
