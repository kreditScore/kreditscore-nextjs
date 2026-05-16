import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type WebConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  appId: string;
  messagingSenderId?: string;
};

function parseFirebaseWebConfigJson(raw: string | undefined): Partial<WebConfig> | null {
  if (!raw?.trim()) return null;
  try {
    const j = JSON.parse(raw) as Record<string, unknown>;
    return {
      apiKey: typeof j.apiKey === "string" ? j.apiKey : undefined,
      authDomain: typeof j.authDomain === "string" ? j.authDomain : undefined,
      projectId: typeof j.projectId === "string" ? j.projectId : undefined,
      appId: typeof j.appId === "string" ? j.appId : undefined,
      messagingSenderId:
        typeof j.messagingSenderId === "string" ? j.messagingSenderId : undefined,
    };
  } catch {
    return null;
  }
}

function trim(s: string | undefined): string | undefined {
  const t = s?.trim();
  return t || undefined;
}

/**
 * Public Firebase web app config for the client SDK.
 * Order: FIREBASE_WEB_CONFIG_JSON → FIREBASE_WEB_* → firebaseConfig field names (apiKey, authDomain, …)
 * → NEXT_PUBLIC_*.
 *
 * Some projects store web config using Firebase Console field names only (`apiKey`, `authDomain`, …) on Vercel;
 * we accept those so /api/config/firebase still works.
 */
export async function GET() {
  const json = parseFirebaseWebConfigJson(process.env.FIREBASE_WEB_CONFIG_JSON);

  const apiKey =
    trim(json?.apiKey) ||
    trim(process.env.FIREBASE_WEB_API_KEY) ||
    trim(process.env.apiKey) ||
    trim(process.env.NEXT_PUBLIC_FIREBASE_API_KEY);
  const authDomain =
    trim(json?.authDomain) ||
    trim(process.env.FIREBASE_WEB_AUTH_DOMAIN) ||
    trim(process.env.authDomain) ||
    trim(process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN);
  const projectId =
    trim(json?.projectId) ||
    trim(process.env.FIREBASE_WEB_PROJECT_ID) ||
    trim(process.env.projectId) ||
    trim(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
  const appId =
    trim(json?.appId) ||
    trim(process.env.FIREBASE_WEB_APP_ID) ||
    trim(process.env.appId) ||
    trim(process.env.NEXT_PUBLIC_FIREBASE_APP_ID);
  const messagingSenderId =
    trim(json?.messagingSenderId) ||
    trim(process.env.FIREBASE_WEB_MESSAGING_SENDER_ID) ||
    trim(process.env.messagingSenderId) ||
    trim(process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID);

  if (!apiKey || !authDomain || !projectId || !appId) {
    return NextResponse.json(
      {
        error: "not_configured",
        hint: "Set FIREBASE_WEB_CONFIG_JSON (paste firebaseConfig JSON from Firebase Console) or FIREBASE_WEB_API_KEY + AUTH_DOMAIN + PROJECT_ID + APP_ID on Vercel, then redeploy.",
      },
      { status: 404 }
    );
  }

  const body: WebConfig = {
    apiKey,
    authDomain,
    projectId,
    appId,
    ...(messagingSenderId ? { messagingSenderId } : {}),
  };

  return NextResponse.json(body);
}
