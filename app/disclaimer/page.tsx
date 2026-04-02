export default function DisclaimerPage() {
  return (
    <main className="min-h-screen bg-white px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold text-gray-900">Disclaimer</h1>
        <p className="mt-4 text-sm text-gray-600">
          Loan approvals, interest rates, and disbursal timelines depend on partner policies and applicant profile.
        </p>
        <ul className="mt-6 list-disc space-y-2 pl-6 text-sm text-gray-700">
          <li>Displayed rates and offers are indicative and may vary by lender.</li>
          <li>Final decision is subject to verification and lender eligibility checks.</li>
          <li>KreditScore acts as a facilitation platform and not a direct lender.</li>
        </ul>
      </div>
    </main>
  );
}
