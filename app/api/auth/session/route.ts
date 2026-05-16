import { NextResponse, type NextRequest } from "next/server";
import { verifyFirebaseIdToken } from "@/lib/firebase/admin";
import { upsertUser } from "@/lib/db/users";

/**
 * POST /api/auth/session
 * Body: { idToken: string; provider: "phone" | "google" | "email" }
 *
 * Verifies the Firebase ID token from the client, syncs user data to
 * Supabase PostgreSQL, and sets an httpOnly session cookie.
 */
export async function POST(req: NextRequest) {
  try {
    const { idToken, provider } = (await req.json()) as {
      idToken: string;
      provider: "phone" | "google" | "email";
    };

    if (!idToken) {
      return NextResponse.json({ error: "idToken required" }, { status: 400 });
    }

    // 1. Verify Firebase ID token server-side
    const decoded = await verifyFirebaseIdToken(idToken);

    // 2. Sync user to Supabase PostgreSQL
    const dbUser = await upsertUser({
      firebaseUid: decoded.uid,
      phoneE164: decoded.phone_number ?? null,
      email: decoded.email ?? null,
      displayName: decoded.name ?? null,
      photoUrl: decoded.picture ?? null,
      provider,
    });

    // 3. Set httpOnly cookie with the raw idToken
    //    (For production, consider Firebase session cookies via admin.auth().createSessionCookie)
    const res = NextResponse.json({
      ok: true,
      user: {
        uid: dbUser.firebase_uid,
        displayName: dbUser.display_name,
        phoneE164: dbUser.phone_e164,
        email: dbUser.email,
        photoUrl: dbUser.photo_url,
        role: dbUser.role,
      },
    });

    res.cookies.set("__session", idToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      // 7-day expiry (refresh needed for long sessions)
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch (err) {
    console.error("[/api/auth/session] Error:", err);
    const msg = err instanceof Error ? err.message : String(err);
    // DB / config — client can hint to check Vercel env + Supabase
    if (
      msg.includes("FIREBASE_SERVICE_ACCOUNT") ||
      msg.includes("GOOGLE_APPLICATION_CREDENTIALS")
    ) {
      return NextResponse.json({ error: "auth_server_misconfigured" }, { status: 503 });
    }
    if (
      msg.includes("DATABASE_URL") ||
      msg.includes("ECONNREFUSED") ||
      msg.includes("ENOTFOUND") ||
      msg.includes("password authentication failed") ||
      (msg.includes("relation") && msg.includes("does not exist"))
    ) {
      return NextResponse.json({ error: "database_unavailable" }, { status: 503 });
    }
    return NextResponse.json({ error: "Authentication failed" }, { status: 401 });
  }
}

/**
 * GET /api/auth/session
 * Returns current user data from session cookie (for SSR hydration)
 */
export async function GET(req: NextRequest) {
  const token = req.cookies.get("__session")?.value;
  if (!token) {
    return NextResponse.json({ user: null });
  }
  try {
    const decoded = await verifyFirebaseIdToken(token);
    return NextResponse.json({
      user: {
        uid: decoded.uid,
        email: decoded.email ?? null,
        phoneE164: decoded.phone_number ?? null,
        displayName: decoded.name ?? null,
        photoUrl: decoded.picture ?? null,
      },
    });
  } catch {
    const res = NextResponse.json({ user: null });
    res.cookies.delete("__session");
    return res;
  }
}
