'use client';

type Props = {
  applicantFor: 'self' | 'other';
  onApplicantForChange: (v: 'self' | 'other') => void;
  applicantName: string;
  onApplicantNameChange: (v: string) => void;
  applicantMobile: string;
  onApplicantMobileChange: (v: string) => void;
  relationshipNote: string;
  onRelationshipNoteChange: (v: string) => void;
};

export default function ApplicantRelationFields({
  applicantFor,
  onApplicantForChange,
  applicantName,
  onApplicantNameChange,
  applicantMobile,
  onApplicantMobileChange,
  relationshipNote,
  onRelationshipNoteChange,
}: Props) {
  return (
    <div className="space-y-3 rounded-xl border border-amber-100 bg-amber-50/50 p-3">
      <p className="text-[10px] sm:text-xs font-semibold text-gray-800">Who is this application for?</p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onApplicantForChange('self')}
          className={`flex-1 rounded-lg py-2 text-xs font-semibold ${
            applicantFor === 'self' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border'
          }`}
        >
          Myself
        </button>
        <button
          type="button"
          onClick={() => onApplicantForChange('other')}
          className={`flex-1 rounded-lg py-2 text-xs font-semibold ${
            applicantFor === 'other' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border'
          }`}
        >
          Someone else
        </button>
      </div>
      {applicantFor === 'other' && (
        <>
          <div>
            <label className="text-[10px] sm:text-xs font-semibold text-gray-700">Applicant name *</label>
            <input
              value={applicantName}
              onChange={(e) => onApplicantNameChange(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              placeholder="Full name as per PAN"
              required
            />
          </div>
          <div>
            <label className="text-[10px] sm:text-xs font-semibold text-gray-700">Applicant mobile *</label>
            <input
              type="tel"
              value={applicantMobile}
              onChange={(e) => onApplicantMobileChange(e.target.value.replace(/\D/g, '').slice(0, 10))}
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              placeholder="10-digit mobile"
              maxLength={10}
              required
            />
          </div>
          <div>
            <label className="text-[10px] sm:text-xs font-semibold text-gray-700">Relationship (optional)</label>
            <input
              value={relationshipNote}
              onChange={(e) => onRelationshipNoteChange(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              placeholder="e.g. Spouse, Friend"
            />
          </div>
        </>
      )}
    </div>
  );
}
