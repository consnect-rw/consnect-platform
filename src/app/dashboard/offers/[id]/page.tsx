"use client";

import { fetchOfferById } from "@/server/offer/offer";
import { SCompanyOfferDetail } from "@/types/offer/offer";
import { notFound, useParams } from "next/navigation";
import { CompanyOfferDetailView } from "@/components/containers/offer/CompanyOfferDetailView";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";

export default function OfferDetailPage() {
     const { user } = useAuth();
     const params = useParams();
     const offerId = params.id as string;
     
     const { data: offer, isLoading } = useQuery({
          queryKey: ["user-offer-detail", offerId],
          queryFn: () => fetchOfferById(offerId, SCompanyOfferDetail),
          enabled: !!user?.company
     });
     
     // Check if offer exists and belongs to user's company
     if (!isLoading && (!offer || !user?.company || offer.company?.id !== user.company.id)) {
          notFound();
     }
     
     if (isLoading || !offer) {
          return (
               <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center">
                         <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                         <p className="text-gray-600 font-bold">Loading offer details...</p>
                    </div>
               </div>
          );
     }
     
     return <CompanyOfferDetailView offer={offer} />;
}