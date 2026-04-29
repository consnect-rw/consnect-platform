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
                    <div className="flex items-end justify-between mb-12 pb-8 border-b-2 border-gray-200">
                         <div>
                              <div className="flex items-center gap-3 mb-3">
                                   <div className="w-1 h-8 bg-yellow-400"></div>
                                   <h2 className="text-3xl lg:text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
                                        Latest Work Packages
                                   </h2>
                              </div>
                              <p className="text-gray-600 text-base lg:text-lg font-medium ml-5">
                                   Discover construction work packages from verified companies. Find your next project or partnership.
                              </p>
                         </div>

                         <Link
                              href="/offer"
                              className="hidden rounded-lg md:flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-bold transition-colors group"
                         >
                              <Briefcase className="w-5 h-5" />
                              <span>View All Work Packages</span>
                              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                         </Link>
                    </div>

                    {/* Offers Grid */}
                    <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 mb-12">
                         {offers.map((offer) => (
                              <PublicOfferCard key={`home-offer-${offer.id}`} offer={offer} />
                         ))}
                    </div>

                    {/* View All Button - Mobile */}
                    <div className="flex justify-center md:hidden">
                         <Link
                              href="/offer"
                              className="flex items-center gap-2 px-8 py-4 bg-gray-900 hover:bg-gray-800 text-white font-bold transition-colors w-full sm:w-auto justify-center rounded-lg"
                         >
                              <Briefcase className="w-5 h-5" />
                              <span>View All Work Packages</span>
                              <ArrowRight className="w-5 h-5" />
                         </Link>
                    </div>
               </div>
          </section>
     );
}
