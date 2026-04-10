"use cache";

import { fetchCategorys } from "@/server/common/category";
import { SPublicCategoryCard } from "@/types/common/category";
import { CategoryCard } from "@/components/cards/CategoryCard";
import { ArrowRight, Briefcase, Building2 } from "lucide-react";
import Link from "next/link";

export default async function HomeCategoriesSection() {
     const [offerCategoriesData, companyCategoriesData] = await Promise.all([
          fetchCategorys(
               SPublicCategoryCard,
               { type: "TENDER" },
               12,
               0,
               { name: "asc" }
          ),
          fetchCategorys(
               SPublicCategoryCard,
               { type: "SERVICE" },
               12,
               0,
               { name: "asc" }
          ),
     ]);

     const offerCategories = offerCategoriesData.data;
     const companyCategories = companyCategoriesData.data;

     if (offerCategories.length === 0 && companyCategories.length === 0) return null;

     return (
          <section className="py-16 sm:py-20 lg:py-24 bg-gray-50">
               <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Section Header */}
                    <div className="flex items-end justify-between mb-12 pb-8 border-b-2 border-gray-200">
                         <div>
                              <div className="flex items-center gap-3 mb-3">
                                   <div className="w-1 h-8 bg-yellow-400"></div>
                                   <h2 className="text-3xl lg:text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
                                        Explore by Category
                                   </h2>
                              </div>
                              <p className="text-gray-600 text-base lg:text-lg font-medium ml-5">
                                   Browse offers, tenders, and companies by industry specialization
                              </p>
                         </div>
                    </div>

                    {/* Offer & Tender Categories */}
                    {offerCategories.length > 0 && (
                         <div className="mb-12">
                              <div className="flex items-center justify-between mb-5">
                                   <div className="flex items-center gap-2.5">
                                        <Briefcase className="w-5 h-5 text-yellow-500" />
                                        <h3 className="text-lg font-bold text-gray-900">Offers &amp; Tenders</h3>
                                   </div>
                                   <Link
                                        href="/offer"
                                        className="hidden sm:flex items-center gap-1.5 text-sm font-bold text-gray-500 hover:text-yellow-600 transition-colors group"
                                   >
                                        View all
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                   </Link>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                                   {offerCategories.map((cat) => (
                                        <CategoryCard
                                             key={cat.id}
                                             category={cat}
                                             href={`/offer?category=${cat.id}`}
                                             count={cat._count.offers}
                                             countLabel={cat._count.offers === 1 ? "offer" : "offers"}
                                        />
                                   ))}
                              </div>
                         </div>
                    )}

                    {/* Company Categories */}
                    {companyCategories.length > 0 && (
                         <div>
                              <div className="flex items-center justify-between mb-5">
                                   <div className="flex items-center gap-2.5">
                                        <Building2 className="w-5 h-5 text-yellow-500" />
                                        <h3 className="text-lg font-bold text-gray-900">Company Specializations</h3>
                                   </div>
                                   <Link
                                        href="/companies"
                                        className="hidden sm:flex items-center gap-1.5 text-sm font-bold text-gray-500 hover:text-yellow-600 transition-colors group"
                                   >
                                        View all
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                   </Link>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                                   {companyCategories.map((cat) => (
                                        <CategoryCard
                                             key={cat.id}
                                             category={cat}
                                             href={`/companies?category=${cat.id}`}
                                             count={cat._count.specializations}
                                             countLabel={cat._count.specializations === 1 ? "company" : "companies"}
                                        />
                                   ))}
                              </div>
                         </div>
                    )}
               </div>
          </section>
     );
}
