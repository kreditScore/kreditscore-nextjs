'use client';

import { Clock, CheckCircle, IndianRupee, Shield, Smartphone, Zap } from 'lucide-react';

type LoanJourneySectionProps = {
  accent: 'cyan' | 'violet' | 'emerald';
  loanLabel: string;
};

const accentMap = {
  cyan: {
    bg: 'from-cyan-50 to-sky-50',
    card: 'from-cyan-500 to-cyan-600',
    text: 'text-cyan-700'
  },
  violet: {
    bg: 'from-violet-50 to-purple-50',
    card: 'from-violet-500 to-violet-600',
    text: 'text-violet-700'
  },
  emerald: {
    bg: 'from-emerald-50 to-green-50',
    card: 'from-emerald-500 to-emerald-600',
    text: 'text-emerald-700'
  }
} as const;

export default function LoanJourneySection({ accent, loanLabel }: LoanJourneySectionProps) {
  const colors = accentMap[accent];

  const steps = [
    { icon: Smartphone, title: 'Apply Online', desc: 'Fill quick details in 2 minutes' },
    { icon: CheckCircle, title: 'Get Approval', desc: 'Instant eligibility and fast decision' },
    { icon: IndianRupee, title: 'Receive Funds', desc: `Disbursal support for your ${loanLabel}` }
  ];

  return (
    <section className={`py-8 sm:py-12 px-4 sm:px-6 bg-gradient-to-br ${colors.bg}`}>
      <div className="max-w-7xl mx-auto">
        <h2 className={`text-xl sm:text-2xl lg:text-3xl font-bold text-center mb-2 ${colors.text}`}>
          How It Works
        </h2>
        <p className="text-center text-xs sm:text-sm text-gray-600 mb-6 sm:mb-8">
          Instant • Secure • Digital Process
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {steps.map((step, index) => (
            <div key={step.title} className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r ${colors.card} text-white flex items-center justify-center mb-3`}>
                <step.icon className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <p className="text-xs text-gray-400 font-semibold mb-1">STEP {index + 1}</p>
              <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-1">{step.title}</h3>
              <p className="text-xs sm:text-sm text-gray-600">{step.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 sm:mt-8 flex flex-wrap justify-center gap-2 sm:gap-3">
          <div className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs sm:text-sm text-gray-700 shadow">
            <Shield className="w-4 h-4" /> 100% Secure
          </div>
          <div className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs sm:text-sm text-gray-700 shadow">
            <Zap className="w-4 h-4" /> Fast Approval
          </div>
          <div className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs sm:text-sm text-gray-700 shadow">
            <Clock className="w-4 h-4" /> Quick Turnaround
          </div>
        </div>
      </div>
    </section>
  );
}
