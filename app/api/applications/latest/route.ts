import { NextRequest, NextResponse } from "next/server";
import { verifyFirebaseIdToken } from "@/lib/firebase/admin";
import { getLatestApplication } from "@/lib/db/applications";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Missing token" }, { status: 401 });
  }
  const idToken = authHeader.slice(7);

  let decoded;
  try {
    decoded = await verifyFirebaseIdToken(idToken);
  } catch (e) {
    console.error("verifyIdToken:", e);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  try {
    const latest = await getLatestApplication(decoded.uid);
    if (!latest) {
      return NextResponse.json({ found: false });
    }
    return NextResponse.json({
      found: true,
      displayName: latest.display_name,
      payload: latest.payload,
    });
  } catch (e) {
    console.error("fetch latest error:", e);
    return NextResponse.json({ error: "Could not fetch" }, { status: 500 });
  }
}
