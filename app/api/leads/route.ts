import { NextResponse } from 'next/server';
import { isDuplicateMobile, isIpRateLimited } from '@/lib/rateLimitMemory';
import { isValidIndianMobile, normalizeIndianMobile } from '@/lib/validation';
import { verifySupabaseAccessToken } from '@/lib/supabase/verifyAccessToken';

type LeadRequest = {
  type: 'lead';
  mobile?: string;
  /** Supabase session access_token (JWT) */
  accessToken?: string;
  /** @deprecated alias for accessToken (older clients) */
  idToken?: string;
  skipDuplicateCheck?: boolean;
  [key: string]: unknown;
};

function getClientIp(request: Request): string {
  const xf = request.headers.get('x-forwarded-for');
  if (xf) return xf.split(',')[0]?.trim() || 'unknown';
  return request.headers.get('x-real-ip') || 'unknown';
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as LeadRequest;

    if (!body?.type) {
      return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 });
    }

    const mobileRaw = typeof body.mobile === 'string' ? normalizeIndianMobile(body.mobile) : '';
    if (mobileRaw && !isValidIndianMobile(mobileRaw)) {
      return NextResponse.json({ success: false, error: 'Invalid mobile number' }, { status: 400 });
    }

    const ip = getClientIp(request);
    if (isIpRateLimited(ip, 40, 60 * 60 * 1000)) {
      return NextResponse.json(
        { success: false, error: 'Too many requests. Try again later.', code: 'RATE_LIMIT' },
        { status: 429 }
      );
    }

    const rawToken =
      typeof body.accessToken === 'string' && body.accessToken.length > 20
        ? body.accessToken
        : typeof body.idToken === 'string' && body.idToken.length > 20
          ? body.idToken
          : '';

    let supabaseUid: string | undefined;
    let tokenOk = false;

    if (rawToken) {
      const verified = await verifySupabaseAccessToken(rawToken);
      if (verified) {
        supabaseUid = verified.uid;
        tokenOk = true;
      } else if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
        tokenOk = true;
      }
    }

    if (
      mobileRaw &&
      !body.skipDuplicateCheck &&
      !tokenOk &&
      isDuplicateMobile(mobileRaw, 10 * 60 * 1000)
    ) {
      return NextResponse.json(
        {
          success: false,
          error: 'This mobile was used recently. Login to continue or try after some time.',
          code: 'DUPLICATE_MOBILE',
          requiresLogin: true,
        },
        { status: 409 }
      );
    }

    const enriched = {
      ...body,
      ...(supabaseUid ? { supabaseUid, accessTokenVerified: true } : { accessTokenVerified: false }),
      serverReceivedAt: new Date().toISOString(),
      clientIp: ip,
    };

    const webhookTargets = [
      process.env.LEAD_WEBHOOK_URL,
      process.env.GOOGLE_SHEET_WEBHOOK_URL,
    ].filter(Boolean) as string[];

    for (const targetUrl of webhookTargets) {
      await fetch(targetUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(process.env.LEAD_WEBHOOK_API_KEY
            ? { Authorization: `Bearer ${process.env.LEAD_WEBHOOK_API_KEY}` }
            : {}),
        },
        body: JSON.stringify(enriched),
      });
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('[leads-api]', JSON.stringify(enriched));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[leads-api-error]', error);
    return NextResponse.json({ success: false, error: 'Failed to capture lead' }, { status: 500 });
  }
}
