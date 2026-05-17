"use client";

import { fetchCompanys } from "@/server/company/company";
import { SCompanyCard, TCompanyCard } from "@/types/company/company";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { CompanyCard } from "@/components/cards/CompanyCard";
import { Search, Building2, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { Prisma } from "@prisma/client";

const PER_PAGE = 20;

const SkeletonCard = () => (
  <div className="rounded-xl border-2 border-gray-100 bg-white overflow-hidden animate-pulse">
    <div className="h-32 bg-gray-200" />
    <div className="p-4 space-y-3">
      <div className="h-4 bg-gray-200 rounded-full w-3/4" />
      <div className="h-3 bg-gray-100 rounded-full w-1/2" />
      <div className="h-3 bg-gray-100 rounded-full w-2/3" />
    </div>
  </div>
);

export const CompaniesContainer = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400);

  const where: Prisma.CompanyWhereInput = {
    verification: { status: "VERIFIED" },
    ...(debouncedSearch ? {
      OR: [
        { name: { contains: debouncedSearch, mode: "insensitive" } },
        { handle: { contains: debouncedSearch, mode: "insensitive" } },
      ],
    } : {}),
  };

  const { data, isFetching, isError } = useQuery({
    queryKey: ["companies-public", page, debouncedSearch],
    queryFn: () => fetchCompanys(SCompanyCard, where, PER_PAGE, (page - 1) * PER_PAGE),
    placeholderData: (prev) => prev,
  });

  const companies = (data?.data ?? []) as TCompanyCard[];
  const total = data?.pagination?.total ?? 0;
  const totalPages = Math.ceil(total / PER_PAGE);

  const handleSearch = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  const goTo = (p: number) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const pageChips: (number | "…")[] = (() => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const start = Math.max(1, page - 2);
    const end = Math.min(totalPages, page + 2);
    const chips: (number | "…")[] = [];
    if (start > 1) { chips.push(1); if (start > 2) chips.push("…"); }
    for (let i = start; i <= end; i++) chips.push(i);
    if (end < totalPages) { if (end < totalPages - 1) chips.push("…"); chips.push(totalPages); }
    return chips;
  })();

  return (
    <div className="w-full space-y-6">
      {/* Search bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search by name or handle…"
            className="w-full pl-10 pr-9 py-2.5 rounded-xl border-2 border-gray-200 focus:border-yellow-400 outline-none text-sm font-medium bg-white transition-colors placeholder:text-gray-400"
          />
          {search && (
            <button onClick={() => handleSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Grid */}
      {isFetching ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: PER_PAGE }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-red-400">
          <Building2 className="w-10 h-10" />
          <p className="text-sm font-semibold">Failed to load companies. Please try again.</p>
        </div>
      ) : companies.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-400">
          <Building2 className="w-12 h-12" />
          <p className="font-semibold text-gray-600">No companies found</p>
          {search && (
            <button onClick={() => handleSearch("")} className="text-sm text-yellow-600 font-bold hover:underline">
              Clear search
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {companies.map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between gap-4 pt-4 border-t-2 border-gray-100">
          <button
            onClick={() => goTo(page - 1)}
            disabled={page <= 1 || isFetching}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-gray-200 hover:border-yellow-400 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-bold text-gray-700 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          <div className="flex items-center gap-1">
            {pageChips.map((chip, i) =>
              chip === "…" ? (
                <span key={`e-${i}`} className="w-8 text-center text-gray-400 text-sm select-none">…</span>
              ) : (
                <button
                  key={chip}
                  onClick={() => goTo(chip as number)}
                  disabled={isFetching}
                  className={`w-9 h-9 rounded-lg text-sm font-bold transition-colors ${
                    chip === page
                      ? "bg-yellow-400 text-gray-900 border-2 border-yellow-500"
                      : "border-2 border-gray-200 text-gray-600 hover:border-yellow-400 hover:text-gray-900"
                  }`}
                >
                  {chip}
                </button>
              )
            )}
          </div>

          <button
            onClick={() => goTo(page + 1)}
            disabled={page >= totalPages || isFetching}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-gray-200 hover:border-yellow-400 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-bold text-gray-700 transition-colors"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};