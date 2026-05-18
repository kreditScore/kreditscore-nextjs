import { NextRequest, NextResponse } from 'next/server';
import { verifyFirebaseIdToken } from '@/lib/firebase/admin';
import { insertLoanApplication } from '@/lib/supabase/applications';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  // 1. Verify Firebase ID token (OTP auth)
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Missing token' }, { status: 401 });
  }
  const idToken = authHeader.slice(7);

  let decoded: Awaited<ReturnType<typeof verifyFirebaseIdToken>>;
  try {
    decoded = await verifyFirebaseIdToken(idToken);
  } catch (e) {
    console.error('verifyIdToken:', e);
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
  }

  const phone = decoded.phone_number ?? null;

  // 2. Parse body
  let body: {
    source?:         string;
    displayName?:    string | null;
    loanAmount?:     number;
    city?:           string;
    employmentType?: string;
    companyName?:    string;
    netSalary?:      number;
    payload?:        Record<string, unknown>;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  // 3. Save to Supabase PostgreSQL
  try {
    const id = await insertLoanApplication({
      firebaseUid:    decoded.uid,
      phoneE164:      phone,
      source:         String(body.source || 'unknown'),
      displayName:    body.displayName    ?? null,
      loanAmount:     body.loanAmount     ?? null,
      city:           body.city           ?? null,
      employmentType: body.employmentType ?? null,
      companyName:    body.companyName    ?? null,
      netSalary:      body.netSalary      ?? null,
      payload:        (body.payload && typeof body.payload === 'object') ? body.payload : {},
    });

    return NextResponse.json({ ok: true, id });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    console.error('applications insert error:', message);

    if (message.includes('SUPABASE') || message.includes('relation') || message.includes('loan_applications')) {
      return NextResponse.json(
        { error: 'Database not configured. Run sql/schema.sql in Supabase.' },
        { status: 503 }
      );
    }
    if (message.includes('Firebase') || message.includes('credential')) {
      return NextResponse.json({ error: 'Auth not configured.' }, { status: 503 });
    }
    return NextResponse.json({ error: 'Could not save application' }, { status: 500 });
  }
}
