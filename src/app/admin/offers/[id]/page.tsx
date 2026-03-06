"use client";

import { fetchOfferById } from "@/server/offer/offer";
import { SAdminOfferDetail } from "@/types/offer/offer";
import { notFound, useParams } from "next/navigation";
import { AdminOfferDetailView } from "@/components/containers/offer/AdminOfferDetailView";
import { useQuery } from "@tanstack/react-query";

export default function OfferDetailPage() {
     const params = useParams();
     const offerId = params.id as string;
     
     const { data: offer, isLoading } = useQuery({
          queryKey: ["admin-offer-detail", offerId],
          queryFn: () => fetchOfferById(offerId, SAdminOfferDetail)
     });
     
     // Check if offer exists
     if (!isLoading && !offer) {
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
     
     return <AdminOfferDetailView offer={offer} />;
}