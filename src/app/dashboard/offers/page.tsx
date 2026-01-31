"use client";

import { useState } from 'react';
import { Loader2, FileText, Calendar, MapPin, DollarSign, Eye, Edit, Trash2, AlertCircle, Building2, Plus, Users } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { SUserOffer, TUserOffer } from '@/types/offer/offer';
import { useAuth } from '@/hooks/useAuth';
import { fetchOffers } from '@/server/offer/offer';
import CompanyRequiredNotice from '@/components/containers/user/CompanyRequireNotice';


export default function OffersPage() {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const perPage = 20;
  
  const { data, isLoading } = useQuery({
    queryKey: ["user-offers", user?.company?.id, page],
    queryFn: () => fetchOffers(SUserOffer, {company: {id: user?.company?.id}}, perPage, (page-1) * perPage)
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
            <a
              href="/dashboard/offers/form"
              className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold rounded-xl transition-all hover:shadow-md hover:-translate-y-0.5"
            >
              <Plus className="w-5 h-5" />
              New Offer
            </a>
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
          <div className="space-y-4">
            {offers.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No Offers Yet</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Start by creating your first offer to connect with potential partners on construction projects.
                </p>
                <a
                  href="/dashboard/offers/form"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold rounded-xl transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Create Your First Offer
                </a>
              </div>
            ) : (
              <>
                <div className="grid gap-4">
                  {offers.map((offer) => (
                    <OfferRow offer={offer} key={`company-offer-${offer.id}`} />
                  ))}
                </div>
                
                {/* Pagination placeholder */}
                {total > perPage && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex items-center justify-center">
                    <div className="flex items-center gap-2">
                      <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium text-gray-700 transition-colors">
                        Previous
                      </button>
                      <span className="px-4 py-2 text-gray-600">
                        Page {page} of {Math.ceil(total / perPage)}
                      </span>
                      <button className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 rounded-lg font-medium text-gray-900 transition-colors">
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const OfferRow = ({ offer }: { offer: TUserOffer }) => {
  return (
    <div className="group bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all p-6">
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        
        {/* Icon & Title Section */}
        <div className="flex items-start gap-4 flex-1 min-w-0">
          <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-yellow-200 transition-colors">
            <FileText className="w-6 h-6 text-yellow-600" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-yellow-600 transition-colors">
              {offer.title}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2 mb-3">
              {offer.description}
            </p>
            
            {/* Interest Count */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-lg">
                <Users className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">
                  {offer._count.interests} {offer._count.interests === 1 ? 'Interest' : 'Interests'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions Section */}
        <div className="flex items-center gap-2 lg:border-l lg:border-gray-200 lg:pl-4">
          <a
            href={`/dashboard/offers/${offer.id}`}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors group/btn"
            title="View offer"
          >
            <Eye className="w-5 h-5 text-gray-600 group-hover/btn:text-gray-900" />
          </a>
          <a
            href={`/dashboard/offers/${offer.id}/edit`}
            className="p-2 hover:bg-yellow-100 rounded-lg transition-colors group/btn"
            title="Edit offer"
          >
            <Edit className="w-5 h-5 text-gray-600 group-hover/btn:text-yellow-600" />
          </a>
          <button
            onClick={() => {
              if (confirm(`Are you sure you want to delete "${offer.title}"?`)) {
                // Add delete logic here
                console.log('Delete offer:', offer.id);
              }
            }}
            className="p-2 hover:bg-red-100 rounded-lg transition-colors group/btn"
            title="Delete offer"
          >
            <Trash2 className="w-5 h-5 text-gray-600 group-hover/btn:text-red-600" />
          </button>
        </div>
      </div>
    </div>
  );
}