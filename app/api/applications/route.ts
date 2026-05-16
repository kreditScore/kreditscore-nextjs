import { NextRequest, NextResponse } from "next/server";
import { verifyFirebaseIdToken } from "@/lib/firebase/admin";
import { insertLoanApplication } from "@/lib/db/applications";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Missing token" }, { status: 401 });
  }
  const idToken = authHeader.slice(7);

  let decoded: Awaited<ReturnType<typeof verifyFirebaseIdToken>>;
  try {
    decoded = await verifyFirebaseIdToken(idToken);
  } catch (e) {
    console.error("verifyIdToken:", e);
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
  }

  const phone = decoded.phone_number;
  if (!phone) {
    return NextResponse.json(
      { error: "Phone verification required" },
      { status: 400 }
    );
  }

  let body: {
    source?: string;
    displayName?: string | null;
    payload?: Record<string, unknown>;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  try {
    const id = await insertLoanApplication({
      firebaseUid: decoded.uid,
      phoneE164: phone,
      source: String(body.source || "unknown"),
      displayName: body.displayName ?? null,
      payload:
        body.payload && typeof body.payload === "object" ? body.payload : {},
    });
    return NextResponse.json({ ok: true, id });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    if (
      message.includes("DATABASE_URL") ||
      message.includes("ECONNREFUSED") ||
      message.includes("relation") ||
      message.includes("loan_applications")
    ) {
      console.error("applications DB error:", e);
      return NextResponse.json(
        { error: "Database is not configured or table is missing." },
        { status: 503 }
      );
    }
    if (
      message.includes("FIREBASE_SERVICE") ||
      message.includes("credential") ||
      message.includes("Could not load the default credentials")
    ) {
      console.error("Firebase admin:", e);
      return NextResponse.json(
        { error: "Server auth is not configured." },
        { status: 503 }
      );
    }
    console.error("applications insert:", e);
    return NextResponse.json({ error: "Could not save application" }, { status: 500 });
  }
}
