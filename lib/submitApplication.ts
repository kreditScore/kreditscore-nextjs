export async function submitLoanApplication(
  idToken: string,
  body: {
    source: string;
    displayName?: string | null;
    payload: Record<string, unknown>;
  }
) {
  const res = await fetch("/api/applications", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify(body),
  });
  const data = (await res.json().catch(() => ({}))) as {
    error?: string;
    id?: string;
  };
  if (!res.ok) {
    throw new Error(data.error || "Submission failed");
  }
  return data;
}
