"use client";

import AdminCompanyCard from "@/components/cards/AdminCompanyCard";
import Pagination from "@/components/ui/Pagination";
import { fetchCompanys } from "@/server/company/company";
import { SAdminCompanyCard } from "@/types/company/company";
import { useQuery } from "@tanstack/react-query";
import { Building2, CheckCircle2, Clock, XCircle } from "lucide-react";
import { useState } from "react";

export default function AdminCompaniesPage() {
  const [page, setPage] = useState(1);
  const perPage = 10;

  const { data: companiesData, isLoading, refetch } = useQuery({
    queryKey: ["admin-companies-data", page],
    queryFn: () => fetchCompanys(SAdminCompanyCard, undefined, perPage, (page - 1) * perPage),
  });

  const companies = companiesData?.data ?? [];
  const totalCompanies = companiesData?.pagination.total ?? 0;

  // Calculate insights from fetched companies
  const verifiedCount = companies.filter(c => c.verification?.status === 'VERIFIED').length;
  const pendingCount = companies.filter(c => c.verification?.status === 'PENDING').length;
  const rejectedCount = companies.filter(c => c.verification?.status === 'REJECTED').length;


  return (
    <div className="w-full min-h-full bg-gray-50 rounded-xl p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1.5 h-9 bg-linear-to-b from-amber-400 to-yellow-500 rounded-full" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Companies Management</h1>
            <p className="text-gray-500 text-sm sm:text-base font-medium">Review, verify, and manage all registered companies</p>
          </div>
        </div>

        {/* Insights Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 flex items-center gap-4">
            <div className="w-12 h-12 shrink-0 bg-gray-900 rounded-xl flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-gray-900 leading-none">{totalCompanies}</h3>
              <p className="text-gray-500 text-xs font-semibold mt-1.5">Total Companies</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 flex items-center gap-4">
            <div className="w-12 h-12 shrink-0 bg-emerald-100 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-gray-900 leading-none">{verifiedCount}</h3>
              <p className="text-gray-500 text-xs font-semibold mt-1.5">Verified</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 flex items-center gap-4">
            <div className="w-12 h-12 shrink-0 bg-amber-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-gray-900 leading-none">{pendingCount}</h3>
              <p className="text-gray-500 text-xs font-semibold mt-1.5">Pending Verification</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 flex items-center gap-4">
            <div className="w-12 h-12 shrink-0 bg-red-100 rounded-xl flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-gray-900 leading-none">{rejectedCount}</h3>
              <p className="text-gray-500 text-xs font-semibold mt-1.5">Rejected</p>
            </div>
          </div>
        </div>

        {/* Companies List */}
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-200 overflow-hidden animate-pulse">
                <div className="h-1 w-full bg-gray-200" />
                <div className="p-5">
                  <div className="flex items-center gap-3.5 mb-4">
                    <div className="w-14 h-14 rounded-xl bg-gray-200 shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-2/3" />
                      <div className="h-3 bg-gray-100 rounded w-1/3" />
                    </div>
                    <div className="w-16 h-6 bg-gray-200 rounded-full" />
                  </div>
                  <div className="h-20 bg-gray-100 rounded-xl mb-3" />
                  <div className="h-14 bg-gray-100 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        ) : companies.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
            <div className="bg-gray-100 w-20 h-20 rounded-2xl mx-auto mb-5 flex items-center justify-center">
              <Building2 className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-black text-gray-800">No companies found</h3>
            <p className="text-gray-500 text-sm mt-1">There are no registered companies yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
            {companies.map((company) => (
              <AdminCompanyCard
                key={company.id}
                company={company}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalCompanies > perPage && (
          <Pagination
            itemsPerPage={perPage}
            totalItems={totalCompanies}
            currentPage={page}
            onPageChange={setPage}
          />
        )}
      </div>
    </div>
  );
}