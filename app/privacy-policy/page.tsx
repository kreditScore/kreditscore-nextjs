export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-white px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
        <p className="mt-4 text-sm text-gray-600">
          We collect only the data required to help you with loan assistance and support.
        </p>
        <ul className="mt-6 list-disc space-y-2 pl-6 text-sm text-gray-700">
          <li>Personal details like name, mobile, PAN, and salary are used for eligibility checks.</li>
          <li>We do not sell your personal data to unauthorized third parties.</li>
          <li>Data is processed with standard security controls.</li>
          <li>You can request correction or deletion by contacting support@kreditscore.in.</li>
        </ul>
      </div>
    </main>
  );
}
