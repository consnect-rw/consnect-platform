"use cache";

import { fetchProductCatalogs } from "@/server/company/product-catalog";
import { SProductCatalogCard } from "@/types/company/product-catalog";
import { PublicCatalogCard } from "@/components/cards/PublicCatalogCard";
import { ArrowRight, BookOpen } from "lucide-react";
import Link from "next/link";

export default async function HomeCatalogsSection() {
     const { data: catalogs } = await fetchProductCatalogs(
          SProductCatalogCard,
          {
               fileUrl: { not: "" },
               company: { verification: { status: "VERIFIED" } },
          },
          8,
          0,
          { createdAt: "desc" }
     );

     if (catalogs.length === 0) return null;

     return (
          <section className="py-16 sm:py-20 lg:py-24 bg-white">
               <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Section Header */}
                    <div className="flex items-end justify-between mb-12 pb-8 border-b-2 border-gray-200">
                         <div>
                              <div className="flex items-center gap-3 mb-3">
                                   <div className="w-1 h-8 bg-yellow-400"></div>
                                   <h2 className="text-3xl lg:text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
                                        Product Catalogs
                                   </h2>
                              </div>
                              <p className="text-gray-600 text-base lg:text-lg font-medium ml-5">
                                   Browse construction material catalogs and product listings from verified suppliers
                              </p>
                         </div>

                         <Link
                              href="/catalogs"
                              className="hidden rounded-lg md:flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-bold transition-colors group"
                         >
                              <BookOpen className="w-5 h-5" />
                              <span>Browse All Catalogs</span>
                              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                         </Link>
                    </div>

                    {/* Catalog Grid */}
                    <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-12">
                         {catalogs.map((catalog) => (
                              <PublicCatalogCard key={`home-catalog-${catalog.id}`} catalog={catalog} />
                         ))}
                    </div>

                    {/* View All - Mobile */}
                    <div className="flex justify-center md:hidden">
                         <Link
                              href="/catalogs"
                              className="flex items-center gap-2 px-8 py-4 bg-gray-900 hover:bg-gray-800 text-white font-bold transition-colors w-full sm:w-auto justify-center rounded-lg"
                         >
                              <BookOpen className="w-5 h-5" />
                              <span>Browse All Catalogs</span>
                              <ArrowRight className="w-5 h-5" />
                         </Link>
                    </div>
               </div>
          </section>
     );
}