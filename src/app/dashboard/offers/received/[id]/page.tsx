import { fetchOfferInterests } from "@/server/offer/offer-interest";
import { fetchOfferById } from "@/server/offer/offer";
import { SReceivedOfferInterest } from "@/types/offer/offer-interest";
import { ReceivedInterestsContainer } from "./_components/InterestContainer";
import { ArrowLeft, Inbox } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Prisma } from "@prisma/client";

const SOfferTitle = { id: true, title: true, status: true, _count: { select: { interests: true } } } satisfies Prisma.OfferSelect;

export default async function OfferInterestsReceived({params}:{params: Promise<{id: string}>}) {
     const id = (await params).id;

     const [offer, interestsData] = await Promise.all([
          fetchOfferById(id, SOfferTitle),
          fetchOfferInterests(SReceivedOfferInterest, {offerId: id}, 500),
     ]);

     if (!offer) notFound();

     return (
          <div className="w-full bg-gray-50 p-4 sm:p-6 lg:p-8">
               {/* Back + header */}
               <div className="flex items-center gap-3 mb-6">
                    <Link href="/dashboard/offers/received" className="w-9 h-9 rounded-xl bg-white border border-gray-200 hover:border-amber-300 hover:bg-amber-50 flex items-center justify-center transition-colors shrink-0">
                         <ArrowLeft className="w-4 h-4 text-gray-600" />
                    </Link>
                    <div className="flex-1 min-w-0">
                         <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Received Interests</p>
                         <h1 className="text-lg sm:text-xl font-black text-gray-900 truncate">{offer.title}</h1>
                    </div>
                    <div className="shrink-0 text-center bg-amber-50 border border-amber-200 rounded-xl px-4 py-2">
                         <p className="text-xl font-black text-amber-700 leading-none">{offer._count.interests}</p>
                         <p className="text-[10px] font-bold text-amber-500 uppercase tracking-wide">Interests</p>
                    </div>
               </div>

               {!interestsData || interestsData.data.length === 0 ? (
                    <div className="flex flex-col items-center justify-center bg-white rounded-2xl border-2 border-dashed border-gray-200 py-20 text-center">
                         <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
                              <Inbox className="w-7 h-7 text-gray-300" />
                         </div>
                         <h3 className="text-base font-black text-gray-900 mb-1">No interests yet</h3>
                         <p className="text-sm text-gray-500 max-w-xs">No companies have expressed interest in this work package yet.</p>
                    </div>
               ) : (
                    <ReceivedInterestsContainer interests={interestsData.data} />
               )}
          </div>
     );
}
 