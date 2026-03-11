import { fetchOfferById } from "@/server/offer/offer";
import { SPublicOfferDetail } from "@/types/offer/offer";
import { PublicOfferDetailView } from "@/components/containers/offer/PublicOfferDetailView";
import { notFound } from "next/navigation";

export default async function OfferPage({ params }: { params: Promise<{ id: string }> }) {
     const { id } = await params;
     
     const offer = await fetchOfferById(id, SPublicOfferDetail);

     if (!offer || offer.status !== "PUBLISHED") {
          return (
               <div className="min-h-4/12 py-2 bg-gray-50 flex items-center justify-center">
                    <div className="text-center">
                         <p className="text-gray-600 font-bold">Offer not found or not published</p>
                    </div>
               </div>
          )
     }

     return <PublicOfferDetailView offer={offer} />;
}