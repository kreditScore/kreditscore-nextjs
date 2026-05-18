/**
 * lib/submitApplication.ts
 * ------------------------
 * Client-side helper to submit loan application to /api/applications
 * (Called from LoanApplicationFormImproved after form validation)
 */
export async function submitLoanApplication(
  idToken: string,
  body: {
    source:        string;
    displayName?:  string | null;
    loanAmount?:   number;
    city?:         string;
    employmentType?: string;
    companyName?:  string;
    netSalary?:    number;
    payload:       Record<string, unknown>;
  }
) {
  const res = await fetch('/api/applications', {
    method:  'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${idToken}`,
    },
    body: JSON.stringify(body),
  });

  const data = (await res.json().catch(() => ({}))) as {
    error?: string;
    id?:    string;
  };

  if (!res.ok) {
    throw new Error(data.error || 'Submission failed');
  }
  return data;
}
