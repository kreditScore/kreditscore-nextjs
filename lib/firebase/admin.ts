import admin from "firebase-admin";

function initAdmin(): typeof admin {
  if (admin.apps.length) return admin;

  const json = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (json) {
    const cred = JSON.parse(json) as admin.ServiceAccount;
    admin.initializeApp({ credential: admin.credential.cert(cred) });
    return admin;
  }

  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    admin.initializeApp({ credential: admin.credential.applicationDefault() });
    return admin;
  }

  throw new Error(
    "Set FIREBASE_SERVICE_ACCOUNT_JSON or GOOGLE_APPLICATION_CREDENTIALS for server-side auth."
  );
}

export async function verifyFirebaseIdToken(idToken: string) {
  const a = initAdmin();
  return a.auth().verifyIdToken(idToken);
}
