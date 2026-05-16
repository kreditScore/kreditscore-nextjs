'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Header from '@/components/Header';
import { Search, ArrowRight } from 'lucide-react';

interface CompanySearchResult {
  company: string;
  bank: string;
  category: string;
  segment: string;
}

const categories = [
  'CAT A',
  'CAT B',
  'CAT C',
  'CAT D',
  'CAT E',
  'SUPER CAT A',
  'Elite',
  'Prime',
  'Standard',
  'Caution',
  'Blocked',
  'Listed',
];

export default function CompanyCategoryPage() {
  const [companyName, setCompanyName] = useState('');
  const [bankFilter, setBankFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [results, setResults] = useState<CompanySearchResult[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<CompanySearchResult | null>(null);
  const [topBanks, setTopBanks] = useState<Array<{ bank: string; cnt: number }>>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);

  const pageCount = Math.max(1, Math.ceil(total / 50));

  useEffect(() => {
    fetch('/api/company-category/stats')
      .then((res) => res.json())
      .then((data) => {
        setTopBanks(data.banks || []);
      })
      .catch(() => {
        setTopBanks([]);
      });
  }, []);

  useEffect(() => {
    if (!hasSearched) {
      return;
    }

    async function fetchCompanies() {
      setLoading(true);
      setSelectedCompany(null);

      const params = new URLSearchParams();
      if (companyName.trim()) params.set('q', companyName.trim());
      if (bankFilter) params.set('bank', bankFilter);
      if (categoryFilter) params.set('cat', categoryFilter);
      params.set('page', String(page));

      try {
        const response = await fetch(`/api/company-category?${params.toString()}`, {
          cache: 'no-store',
        });
        const data = await response.json();
        setResults(data.results || []);
        setTotal(data.total || 0);
      } catch (error) {
        setResults([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    }

    fetchCompanies();
  }, [companyName, bankFilter, categoryFilter, page, hasSearched]);

  const handleSearch = () => {
    setPage(1);
    setHasSearched(true);
  };

  const handleReset = () => {
    setCompanyName('');
    setBankFilter('');
    setCategoryFilter('');
    setPage(1);
    setHasSearched(false);
    setResults([]);
    setSelectedCompany(null);
  };

  const handleSelect = (company: CompanySearchResult) => {
    setSelectedCompany(company);
  };

  const filteredBanks = useMemo(() => topBanks.slice(0, 6), [topBanks]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />

      <main className="flex-1 px-4 md:px-8 py-14">
        <div className="mx-auto w-full max-w-5xl">
          <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-slate-500 mb-4">Company Category</p>

            <div className="grid gap-4 lg:grid-cols-[1.4fr_0.8fr]">
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch();
                    }
                  }}
                  placeholder="Search by company name"
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 py-4 pl-12 pr-5 text-base text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <button
                type="button"
                onClick={handleSearch}
                className="inline-flex h-14 items-center justify-center rounded-3xl bg-slate-900 px-6 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Search
              </button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-600">Bank filter</span>
                <select
                  value={bankFilter}
                  onChange={(e) => setBankFilter(e.target.value)}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 py-3 px-4 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">All banks</option>
                  {filteredBanks.map((bank) => (
                    <option key={bank.bank} value={bank.bank}>{bank.bank}</option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-600">Category filter</span>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 py-3 px-4 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">All categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </label>

              <button
                type="button"
                onClick={handleReset}
                className="inline-flex h-14 items-center justify-center rounded-3xl border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
              >
                Reset filters
              </button>
            </div>

            {filteredBanks.length > 0 && (
              <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-medium text-slate-600">Popular banks</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {filteredBanks.map((bank) => (
                    <button
                      key={bank.bank}
                      type="button"
                      onClick={() => {
                        setBankFilter(bank.bank);
                        setPage(1);
                        setHasSearched(true);
                      }}
                      className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 transition hover:border-slate-300 hover:bg-slate-100"
                    >
                      {bank.bank}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8">
              <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Search results</p>
                  <p className="text-sm text-slate-500">Showing {results.length} of {total} matched companies</p>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white">
                {loading ? (
                  <div className="p-8 text-center text-slate-500">Loading company data...</div>
                ) : !hasSearched ? (
                  <div className="p-8 text-center text-slate-500">
                    Enter a company name or choose a bank/category to start searching.
                  </div>
                ) : results.length === 0 ? (
                  <div className="p-8 text-center text-slate-500">
                    No company matches found. Try a broader company name or clear filters.
                  </div>
                ) : (
                  <div className="divide-y divide-slate-200">
                    {results.map((company) => (
                      <button
                        key={`${company.company}-${company.bank}-${company.segment}`}
                        type="button"
                        onClick={() => handleSelect(company)}
                        className="w-full px-5 py-4 text-left transition hover:bg-slate-50"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="font-semibold text-slate-900">{company.company}</span>
                          <span className="text-sm text-slate-500">{company.bank}</span>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2 text-sm text-slate-600">
                          <span className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1">{company.category}</span>
                          {company.segment && <span className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1">{company.segment}</span>}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {hasSearched && results.length > 0 && (
                <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                  <div className="text-sm text-slate-600">
                    Page {page} of {pageCount}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                      disabled={page <= 1}
                      className="inline-flex h-11 items-center justify-center rounded-3xl border border-slate-200 bg-white px-4 text-sm text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      type="button"
                      onClick={() => setPage((prev) => Math.min(prev + 1, pageCount))}
                      disabled={page >= pageCount}
                      className="inline-flex h-11 items-center justify-center rounded-3xl border border-slate-200 bg-slate-900 px-4 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>

            {selectedCompany && (
              <div className="mt-8 rounded-[28px] border border-blue-100 bg-blue-50 p-6 text-slate-900">
                <div className="flex items-center gap-2 text-sm uppercase tracking-[0.24em] text-blue-600">
                  <ArrowRight className="h-4 w-4" />
                  <span>Selected company</span>
                </div>
                <h2 className="mt-3 text-2xl font-semibold">{selectedCompany.company}</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-3xl border border-slate-200 bg-white p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Bank</p>
                    <p className="mt-2 font-semibold text-slate-900">{selectedCompany.bank}</p>
                  </div>
                  <div className="rounded-3xl border border-slate-200 bg-white p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Category</p>
                    <p className="mt-2 font-semibold text-slate-900">{selectedCompany.category}</p>
                  </div>
                  <div className="rounded-3xl border border-slate-200 bg-white p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Segment</p>
                    <p className="mt-2 font-semibold text-slate-900">{selectedCompany.segment || 'N/A'}</p>
                  </div>
                </div>
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
