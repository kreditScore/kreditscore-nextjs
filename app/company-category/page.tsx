'use client';

import React, { useMemo, useState } from 'react';
import Header from '@/components/Header';
import { Search } from 'lucide-react';
import { companyCategoryListData, CompanyRecord } from '@/lib/companycatogorylistdata';

export default function CompanyCategoryPage() {
  const [companyName, setCompanyName] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<CompanyRecord | null>(null);

  const filteredCompanies = useMemo(
    () =>
      companyCategoryListData
        .filter((company) =>
          company.name.toLowerCase().includes(companyName.toLowerCase())
        )
        .slice(0, 6),
    [companyName]
  );

  const handleSelect = (company: CompanyRecord) => {
    setSelectedCompany(company);
    setCompanyName(company.name);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />

      <main className="flex-1 px-4 md:px-8 py-14">
        <div className="mx-auto w-full max-w-3xl">
          <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-slate-500 mb-4">Company Category</p>
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={companyName}
                onChange={(e) => {
                  setCompanyName(e.target.value);
                  setSelectedCompany(null);
                }}
                placeholder="Enter Your Company Name"
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 py-4 pl-12 pr-5 text-base text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {companyName && filteredCompanies.length > 0 && (
              <div className="mt-4 rounded-3xl border border-slate-200 bg-white shadow-sm">
                {filteredCompanies.map((company) => (
                  <button
                    key={company.name}
                    type="button"
                    onClick={() => handleSelect(company)}
                    className="w-full px-5 py-4 text-left text-slate-900 transition hover:bg-slate-100"
                  >
                    <span className="font-semibold">{company.name}</span>
                    <span className="block text-sm text-slate-500">{company.category}</span>
                  </button>
                ))}
              </div>
            )}

            {companyName && filteredCompanies.length === 0 && (
              <div className="mt-4 rounded-3xl border border-slate-200 bg-slate-50 p-5 text-slate-500">
                No results found. Please check your entry or add the company to the list.
              </div>
            )}

            {selectedCompany && (
              <div className="mt-6 rounded-[28px] border border-blue-100 bg-blue-50 p-6 text-slate-900">
                <p className="text-sm uppercase tracking-[0.24em] text-blue-600">Selected Company</p>
                <h2 className="mt-3 text-2xl font-semibold">{selectedCompany.name}</h2>
                <p className="mt-2 text-sm text-slate-600">Category: <span className="font-semibold text-slate-900">{selectedCompany.category}</span></p>
                {selectedCompany.details && (
                  <p className="mt-2 text-sm text-slate-600">{selectedCompany.details}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white py-6">
        <div className="mx-auto max-w-6xl px-4 text-center text-sm text-slate-500">
          © 2026 KreditScore. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}
