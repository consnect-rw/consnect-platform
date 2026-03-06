"use client";

import { TCompanyOfferCard } from "@/types/offer/offer";
import { CompanyOfferCard } from "@/components/cards/CompanyOfferCard";
import { Loader2, FileText, Plus } from "lucide-react";
import Link from "next/link";

interface CompanyOffersContainerProps {
     offers: TCompanyOfferCard[];
     isLoading?: boolean;
     emptyMessage?: string;
     showCreateButton?: boolean;
}

export const CompanyOffersContainer = ({ 
     offers, 
     isLoading = false,
     emptyMessage = "You haven't created any offers yet",
     showCreateButton = true
}: CompanyOffersContainerProps) => {
     if (isLoading) {
          return (
               <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-16 flex items-center justify-center">
                    <div className="text-center">
                         <Loader2 className="w-12 h-12 text-yellow-500 animate-spin mx-auto mb-4" />
                         <p className="text-gray-600 font-medium">Loading your offers...</p>
                    </div>
               </div>
          );
     }

     if (offers.length === 0) {
          return (
               <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                         <FileText className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No Offers Yet</h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                         {emptyMessage}
                    </p>
                    {showCreateButton && (
                         <Link
                              href="/dashboard/offers/form"
                              className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold rounded-xl transition-colors"
                         >
                              <Plus className="w-5 h-5" />
                              Create Your First Offer
                         </Link>
                    )}
               </div>
          );
     }

     return (
          <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
               {offers.map((offer) => (
                    <CompanyOfferCard key={`company-offer-${offer.id}`} offer={offer} />
               ))}
          </div>
     );
};
