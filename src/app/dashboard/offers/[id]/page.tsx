import { fetchOfferById } from "@/server/offer/offer";
import { SCompanyOfferDetail } from "@/types/offer/offer";
import {  DashboardOfferDetailView } from "@/components/containers/offer/CompanyOfferDetailView";
import { getSessionUser } from "@/server/auth/user";


export default async function OfferDetailPage(
     {params}:{params: Promise<{id: string}>}
){
     const {user} = await getSessionUser()
     const offerId = (await params).id as string;
     const offer= await fetchOfferById(offerId, SCompanyOfferDetail);

     if (!offer || !user) {
          return (
               <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center">
                         <p className="text-gray-600 font-bold">Offer not found or access denied</p>
                    </div>
               </div>
          )
     }
     
     return <DashboardOfferDetailView offer={offer} allowPublish={user.company?.verification?.status === "VERIFIED"} />;
}