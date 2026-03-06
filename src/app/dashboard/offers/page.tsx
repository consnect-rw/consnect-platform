"use client";

import { useState } from 'react';
import { Loader2, Plus } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { SCompanyOfferCard } from '@/types/offer/offer';
import { useAuth } from '@/hooks/useAuth';
import { fetchOffers } from '@/server/offer/offer';
import CompanyRequiredNotice from '@/components/containers/user/CompanyRequireNotice';
import { CompanyOffersContainer } from '@/components/containers/offer/CompanyOffersContainer';
import Link from 'next/link';

export default function OffersPage() {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const perPage = 20;
  
  const { data, isLoading } = useQuery({
    queryKey: ["user-offers", user?.company?.id, page],
    queryFn: () => fetchOffers(SCompanyOfferCard, {company: {id: user?.company?.id}}, perPage, (page-1) * perPage, { createdAt: 'desc' })
  });
  const offers = data?.data ?? [];
  const total = data?.pagination.total ?? 0;
  const hasCompany = user?.company ? true : false;

  if (!hasCompany) {
    return <CompanyRequiredNotice message='You need to add your company information before creating offers.' />
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                Manage Offers
              </h1>
              <p className="text-gray-600 text-base">
                Create, update and review your construction offers
              </p>
            </div>
            <Link
              href="/dashboard/offers/form"
              className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold rounded-xl transition-all hover:shadow-md hover:-translate-y-0.5"
            >
              <Plus className="w-5 h-5" />
              New Offer
            </Link>
          </div>
        </div>

        {/* Offers Content */}
        {isLoading ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-16 flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-yellow-500 animate-spin mx-auto mb-4" />
              <p className="text-gray-600 font-medium">Loading your offers...</p>
            </div>
          </div>
        ) : (
          <>
            <CompanyOffersContainer
              offers={offers}
              isLoading={false}
              emptyMessage="You haven't created any offers yet. Start by creating your first offer."
              showCreateButton={true}
            />

            {/* Pagination */}
            {total > perPage && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex items-center justify-center">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:cursor-not-allowed rounded-lg font-medium text-gray-700 transition-colors"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2 text-gray-600">
                    Page {page} of {Math.ceil(total / perPage)}
                  </span>
                  <button
                    onClick={() => setPage(p => Math.min(Math.ceil(total / perPage), p + 1))}
                    disabled={page === Math.ceil(total / perPage)}
                    className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-50 disabled:cursor-not-allowed rounded-lg font-medium text-gray-900 transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}