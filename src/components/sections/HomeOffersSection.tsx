"use cache";

import { fetchOffers } from "@/server/offer/offer";
import { SPublicOfferCard } from "@/types/offer/offer";
import { PublicOfferCard } from "@/components/cards/PublicOfferCard";
import { ArrowRight, Briefcase } from "lucide-react";
import Link from "next/link";

export default async function HomeOffersSection() {
     const { data: offers } = await fetchOffers(
          SPublicOfferCard,
          { 
               status: "PUBLISHED",
               visibility: { in: ["PUBLIC", "RESTRICTED"] }
          },6, 0,
          { createdAt: "desc" }
     );

     if (offers.length === 0) {
          return null;
     }

     return (
          <section className="py-16 sm:py-20 lg:py-24 bg-gray-50">
               <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Section Header */}
                    <div className="text-center mb-12">
                         <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-400 rounded-2xl mb-6">
                              <Briefcase className="w-8 h-8 text-gray-900" />
                         </div>
                         <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-4">
                              Latest Offer Opportunities
                         </h2>
                         <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                              Discover construction offers from verified companies. Find your next project or partnership opportunity.
                         </p>
                    </div>

                    {/* Offers Grid */}
                    <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 mb-12">
                         {offers.map((offer) => (
                              <PublicOfferCard key={`home-offer-${offer.id}`} offer={offer} />
                         ))}
                    </div>

                    {/* View All Button */}
                    <div className="text-center">
                         <Link
                              href="/offer"
                              className="inline-flex items-center gap-2 px-8 py-4 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold rounded-xl transition-all hover:shadow-lg hover:-translate-y-0.5 text-lg"
                         >
                              View All Offers
                              <ArrowRight className="w-5 h-5" />
                         </Link>
                    </div>
               </div>
          </section>
     );
}
