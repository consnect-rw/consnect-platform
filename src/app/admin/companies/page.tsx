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
    <div className="w-full min-h-full bg-gray-50/50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Companies Management</h1>
          <p className="text-gray-600 mt-2">Review, verify, and manage all registered companies</p>
        </div>

        {/* Insights Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-100 rounded-xl">
                <Building2 className="w-7 h-7 text-yellow-600" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900">{totalCompanies}</h3>
            <p className="text-gray-600 mt-1">Total Companies</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <CheckCircle2 className="w-7 h-7 text-green-600" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-900">{verifiedCount}</h3>
            <p className="text-gray-600 mt-1">Verified</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-100 rounded-xl">
                <Clock className="w-7 h-7 text-yellow-600" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-900">{pendingCount}</h3>
            <p className="text-gray-600 mt-1">Pending Verification</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-100 rounded-xl">
                <XCircle className="w-7 h-7 text-red-600" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-900">{rejectedCount}</h3>
            <p className="text-gray-600 mt-1">Rejected</p>
          </div>
        </div>

        {/* Companies List */}
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-gray-200 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            ))}
          </div>
        ) : companies.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-gray-100 w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center">
              <Building2 className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700">No companies found</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
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