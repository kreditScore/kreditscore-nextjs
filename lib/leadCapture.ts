export type LeadPayload = {
  source: 'hero_form' | 'loan_modal_form';
  name?: string;
  mobile: string;
  loanType?: string;
  city?: string;
  amount?: string;
  pan?: string;
  salary?: string;
  /** Logged-in account vs actual borrower */
  applicantFor?: 'self' | 'other';
  applicantName?: string;
  applicantMobile?: string;
  relationshipNote?: string;
};

type LeadRecord = LeadPayload & {
  capturedAt: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  page: string;
};

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

const getUtmParams = () => {
  if (typeof window === 'undefined') {
    return {};
  }
  const search = new URLSearchParams(window.location.search);
  return {
    utmSource: search.get('utm_source') ?? undefined,
    utmMedium: search.get('utm_medium') ?? undefined,
    utmCampaign: search.get('utm_campaign') ?? undefined,
  };
};

async function getOptionalIdToken(): Promise<string | undefined> {
  if (typeof window === 'undefined') return undefined;
  try {
    const { getFirebaseAuth } = await import('@/lib/firebase');
    const u = getFirebaseAuth().currentUser;
    if (!u) return undefined;
    return u.getIdToken();
  } catch {
    return undefined;
  }
}

export const captureLead = (payload: LeadPayload) => {
  if (typeof window === 'undefined') {
    return;
  }

  void (async () => {
    const idToken = await getOptionalIdToken();
    let accountUid: string | undefined;
    let accountEmail: string | undefined;
    let accountPhone: string | undefined;
    try {
      const { getFirebaseAuth } = await import('@/lib/firebase');
      const u = getFirebaseAuth().currentUser;
      accountUid = u?.uid;
      accountEmail = u?.email ?? undefined;
      accountPhone = u?.phoneNumber ?? undefined;
    } catch {
      /* ignore */
    }

    const record: LeadRecord & {
      accountUid?: string;
      accountEmail?: string;
      accountPhone?: string;
      idToken?: string;
    } = {
      ...payload,
      ...getUtmParams(),
      capturedAt: new Date().toISOString(),
      page: window.location.pathname,
      ...(accountUid ? { accountUid, accountEmail, accountPhone } : {}),
    };

    const existingRaw = localStorage.getItem('kreditscore_leads');
    const existing = existingRaw ? (JSON.parse(existingRaw) as LeadRecord[]) : [];
    localStorage.setItem('kreditscore_leads', JSON.stringify([record, ...existing].slice(0, 100)));

    if (window.dataLayer) {
      window.dataLayer.push({
        event: 'lead_submitted',
        lead_source: payload.source,
        loan_type: payload.loanType ?? '',
        city: payload.city ?? '',
        applicant_for: payload.applicantFor ?? 'self',
      });
    }

    fetch('/api/leads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'lead',
        ...record,
        ...(idToken ? { idToken } : {}),
      }),
    }).catch(() => undefined);
  })();
};
