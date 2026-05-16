import { NextResponse, type NextRequest } from "next/server";

/**
 * POST /api/auth/signout
 * Clears the httpOnly session cookie
 */
export async function POST(_req: NextRequest) {
  const res = NextResponse.json({ ok: true });
  res.cookies.set("__session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0, // immediately expire
  });
  return res;
}
