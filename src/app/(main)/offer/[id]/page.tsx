import { fetchOfferById } from "@/server/offer/offer";
import { SPublicOfferDetail } from "@/types/offer/offer";
import { PublicOfferDetailView } from "@/components/containers/offer/PublicOfferDetailView";
import { notFound } from "next/navigation";

export default async function OfferPage({ params }: { params: Promise<{ id: string }> }) {
     const { id } = await params;
     
     const offer = await fetchOfferById(id, SPublicOfferDetail);

     if (!offer || offer.status !== "PUBLISHED") {
          notFound();
     }

     return <PublicOfferDetailView offer={offer} />;
}