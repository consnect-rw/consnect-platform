"use client";

import { TPublicOfferCard } from "@/types/offer/offer";
import { PublicOfferCard } from "@/components/cards/PublicOfferCard";
import { Loader2, FileText } from "lucide-react";

interface PublicOffersContainerProps {
     offers: TPublicOfferCard[];
     isLoading?: boolean;
     emptyMessage?: string;
}

export const PublicOffersContainer = ({ 
     offers, 
     isLoading = false,
     emptyMessage = "No offers available at the moment" 
}: PublicOffersContainerProps) => {
     if (isLoading) {
          return (
               <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-16 flex items-center justify-center">
                    <div className="text-center">
                         <Loader2 className="w-12 h-12 text-yellow-500 animate-spin mx-auto mb-4" />
                         <p className="text-gray-600 font-medium">Loading offers...</p>
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
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No Offers Found</h3>
                    <p className="text-gray-600 max-w-md mx-auto">
                         {emptyMessage}
                    </p>
               </div>
          );
     }

     return (
          <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
               {offers.map((offer) => (
                    <PublicOfferCard key={`public-offer-${offer.id}`} offer={offer} />
               ))}
          </div>
     );
};
