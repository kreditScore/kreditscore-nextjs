'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import { Calculator, ArrowRight, TrendingDown, DollarSign, Clock } from 'lucide-react';

interface CalculationResult {
  originalEMI: number;
  partPaymentAmount: number;
  partPaymentMonth: number;
  remainingLoanAmount: number;
  newEMI: number;
  newTenure: number;
  totalInterestSaved: number;
  monthsReduced: number;
}

export default function PartPaymentCalculator() {
  const [loanAmount, setLoanAmount] = useState(500000);
  const [rateOfInterest, setRateOfInterest] = useState(10);
  const [tenure, setTenure] = useState(60);
  const [partPaymentAmount, setPartPaymentAmount] = useState(100000);
  const [partPaymentMonth, setPartPaymentMonth] = useState(24);
  const [result, setResult] = useState<CalculationResult | null>(null);

  const calculateEMI = (principal: number, rate: number, months: number): number => {
    const monthlyRate = rate / 12 / 100;
    if (monthlyRate === 0) return principal / months;
    return (
      (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1)
    );
  };

  const calculateRemainingPrincipal = (
    principal: number,
    rate: number,
    totalMonths: number,
    paidMonths: number
  ): number => {
    const monthlyRate = rate / 12 / 100;
    const emi = calculateEMI(principal, rate, totalMonths);

    if (monthlyRate === 0) {
      return principal - emi * paidMonths;
    }

    const remainingMonths = totalMonths - paidMonths;
    const principalPaid = emi * (Math.pow(1 + monthlyRate, paidMonths) - 1) / monthlyRate;
    return Math.max(0, principal - principalPaid);
  };

  const handleCalculate = () => {
    if (!loanAmount || !rateOfInterest || !tenure || !partPaymentAmount || !partPaymentMonth) {
      alert('Please fill all fields');
      return;
    }

    if (partPaymentMonth >= tenure) {
      alert('Part payment month should be less than total tenure');
      return;
    }

    const originalEMI = calculateEMI(loanAmount, rateOfInterest, tenure);
    
    // Calculate remaining principal after part payment
    const remainingAfterPartPayment =
      calculateRemainingPrincipal(loanAmount, rateOfInterest, tenure, partPaymentMonth) -
      partPaymentAmount;

    if (remainingAfterPartPayment <= 0) {
      alert('Part payment amount is too high. Please reduce it.');
      return;
    }

    // Calculate remaining tenure (in months) for new EMI
    const remainingMonths = tenure - partPaymentMonth;
    const newEMI = calculateEMI(remainingAfterPartPayment, rateOfInterest, remainingMonths);

    // Calculate new tenure with original EMI (if paying same EMI)
    let newTenure = tenure;
    let totalInterestSaved = 0;

    // Calculate with new EMI
    const newTenureMonths = Math.ceil(
      Math.log(newEMI / (newEMI - (remainingAfterPartPayment * (rateOfInterest / 12 / 100)))) /
        Math.log(1 + rateOfInterest / 12 / 100)
    );

    newTenure = partPaymentMonth + Math.max(0, newTenureMonths);

    // Calculate total interest
    const originalTotalPayment = originalEMI * tenure;
    const newTotalPayment = originalEMI * partPaymentMonth + newEMI * newTenureMonths + partPaymentAmount;
    totalInterestSaved = originalTotalPayment - newTotalPayment + partPaymentAmount;

    setResult({
      originalEMI: Math.round(originalEMI),
      partPaymentAmount,
      partPaymentMonth,
      remainingLoanAmount: Math.round(remainingAfterPartPayment),
      newEMI: Math.round(newEMI),
      newTenure: Math.round(newTenure),
      totalInterestSaved: Math.round(Math.max(0, totalInterestSaved)),
      monthsReduced: Math.round(tenure - newTenure)
    });
  };

  const handleReset = () => {
    setLoanAmount(500000);
    setRateOfInterest(10);
    setTenure(60);
    setPartPaymentAmount(100000);
    setPartPaymentMonth(24);
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <section className="mt-[80px] pb-14 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <p className="text-sm uppercase tracking-[0.3em] text-blue-600 font-semibold mb-3">
              Loan Tools
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
              Part Payment Calculator
            </h1>
            <p className="mx-auto max-w-2xl text-gray-600 text-base sm:text-lg">
              Calculate how much interest and tenure you can save by making a lump-sum part payment towards your loan.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-[32px] shadow-[0_28px_80px_rgba(15,23,42,0.08)] p-8 lg:p-10"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-8">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900">Your Loan Details</h2>
                  <p className="text-sm text-slate-500 mt-2">Update the loan parameters and see the part payment impact instantly.</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Loan EMI</p>
                    <p className="text-xl font-semibold text-slate-900">₹{Math.round(calculateEMI(loanAmount, rateOfInterest, tenure)).toLocaleString()}</p>
                  </div>
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Remaining tenure</p>
                    <p className="text-xl font-semibold text-slate-900">{tenure} months</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-3xl border border-slate-200 p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Loan Amount</p>
                      <p className="text-xs text-slate-500">Total amount borrowed</p>
                    </div>
                    <p className="text-lg font-semibold text-slate-900">₹{loanAmount.toLocaleString()}</p>
                  </div>
                  <input
                    type="range"
                    min="10000"
                    max="5000000"
                    step="10000"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                </div>

                <div className="rounded-3xl border border-slate-200 p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Interest Rate</p>
                      <p className="text-xs text-slate-500">Annual rate (%)</p>
                    </div>
                    <p className="text-lg font-semibold text-slate-900">{rateOfInterest.toFixed(1)}%</p>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    step="0.1"
                    value={rateOfInterest}
                    onChange={(e) => setRateOfInterest(Number(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                </div>

                <div className="rounded-3xl border border-slate-200 p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Tenure</p>
                      <p className="text-xs text-slate-500">Loan duration in months</p>
                    </div>
                    <p className="text-lg font-semibold text-slate-900">{tenure} months</p>
                  </div>
                  <input
                    type="range"
                    min="12"
                    max="360"
                    step="1"
                    value={tenure}
                    onChange={(e) => setTenure(Number(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                </div>

                <div className="rounded-3xl border border-slate-200 p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Part Payment</p>
                      <p className="text-xs text-slate-500">Lump sum amount paid early</p>
                    </div>
                    <p className="text-lg font-semibold text-slate-900">₹{partPaymentAmount.toLocaleString()}</p>
                  </div>
                  <input
                    type="range"
                    min="10000"
                    max={Math.max(loanAmount - 10000, 10000)}
                    step="10000"
                    value={partPaymentAmount}
                    onChange={(e) => setPartPaymentAmount(Number(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                </div>

                <div className="rounded-3xl border border-slate-200 p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Part Payment After</p>
                      <p className="text-xs text-slate-500">Month when lump sum is paid</p>
                    </div>
                    <p className="text-lg font-semibold text-slate-900">{partPaymentMonth}</p>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max={Math.max(tenure - 1, 1)}
                    step="1"
                    value={partPaymentMonth}
                    onChange={(e) => setPartPaymentMonth(Number(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mt-4">
                  <button
                    onClick={handleCalculate}
                    className="flex-1 rounded-3xl bg-slate-900 text-white py-3 text-sm font-semibold hover:bg-slate-800 transition"
                  >
                    Calculate Savings
                  </button>
                  <button
                    onClick={handleReset}
                    className="flex-1 rounded-3xl border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50 transition"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="rounded-[32px] bg-gradient-to-br from-slate-900 to-blue-700 text-white p-8 shadow-[0_28px_80px_rgba(15,23,42,0.18)]">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.28em] text-slate-300">Part Payment Summary</p>
                    <h2 className="mt-4 text-3xl sm:text-4xl font-semibold">Save more with one smart payment</h2>
                  </div>
                  <div className="rounded-3xl bg-slate-800/80 px-5 py-4 text-center">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-300">Estimated Savings</p>
                    <p className="mt-2 text-3xl font-semibold">₹{result ? result.totalInterestSaved.toLocaleString() : '0'}</p>
                  </div>
                </div>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl bg-slate-800/80 p-5">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Current EMI</p>
                    <p className="mt-4 text-3xl font-semibold">₹{result ? result.originalEMI.toLocaleString() : Math.round(calculateEMI(loanAmount, rateOfInterest, tenure)).toLocaleString()}</p>
                  </div>
                  <div className="rounded-3xl bg-slate-800/80 p-5">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400">After part payment</p>
                    <p className="mt-4 text-3xl font-semibold">₹{result ? result.newEMI.toLocaleString() : '-'}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-[32px] bg-white p-8 shadow-[0_28px_80px_rgba(15,23,42,0.06)]">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Calculation details</p>
                    <h3 className="mt-2 text-2xl font-semibold text-slate-900">Result breakdown</h3>
                  </div>
                  <div className="rounded-full bg-blue-50 px-4 py-2 text-blue-700 text-sm font-semibold">
                    {result ? 'Updated' : 'Preview'}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl border border-slate-200 p-5">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Part payment amount</p>
                    <p className="mt-3 text-xl font-semibold text-slate-900">₹{partPaymentAmount.toLocaleString()}</p>
                  </div>
                  <div className="rounded-3xl border border-slate-200 p-5">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Paid after</p>
                    <p className="mt-3 text-xl font-semibold text-slate-900">{partPaymentMonth} months</p>
                  </div>
                  <div className="rounded-3xl border border-slate-200 p-5">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Estimated new tenure</p>
                    <p className="mt-3 text-xl font-semibold text-slate-900">{result ? `${result.newTenure} months` : '-'}</p>
                  </div>
                  <div className="rounded-3xl border border-slate-200 p-5">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Remaining loan</p>
                    <p className="mt-3 text-xl font-semibold text-slate-900">₹{result ? result.remainingLoanAmount.toLocaleString() : '-'}</p>
                  </div>
                </div>

                <div className="mt-6 rounded-3xl bg-slate-50 p-5">
                  <div className="flex items-center justify-between text-slate-500 text-sm font-medium">
                    <span>Interest saved</span>
                    <span>₹{result ? result.totalInterestSaved.toLocaleString() : '0'}</span>
                  </div>
                  <div className="mt-4 h-3 rounded-full bg-slate-200 overflow-hidden">
                    <div className="h-full rounded-full bg-blue-600" style={{ width: result ? `${Math.min(100, (result.totalInterestSaved / loanAmount) * 100)}%` : '0%' }} />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-10 rounded-[32px] bg-white p-8 shadow-[0_28px_80px_rgba(15,23,42,0.08)]"
          >
            <div className="grid gap-8 lg:grid-cols-3">
              <div className="space-y-3">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">How this works</p>
                <h3 className="text-xl font-semibold text-slate-900">Pay less interest with early payment</h3>
                <p className="text-sm text-slate-600">Make a part payment mid-way through your loan and reduce the outstanding principal. The result is a lower future EMI and/or shorter loan duration.</p>
              </div>

              <div className="rounded-3xl border border-slate-200 p-5">
                <p className="text-sm font-semibold text-slate-900">Step 1</p>
                <p className="mt-3 text-sm text-slate-600">Enter your loan amount, interest rate and tenure.</p>
              </div>
              <div className="rounded-3xl border border-slate-200 p-5">
                <p className="text-sm font-semibold text-slate-900">Step 2</p>
                <p className="mt-3 text-sm text-slate-600">Choose part payment amount and the month when you will pay it.</p>
              </div>
              <div className="rounded-3xl border border-slate-200 p-5">
                <p className="text-sm font-semibold text-slate-900">Step 3</p>
                <p className="mt-3 text-sm text-slate-600">View the new EMI and interest savings instantly.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
