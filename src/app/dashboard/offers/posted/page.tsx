"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchOffers } from "@/server/offer/offer";
import { fetchCategorys } from "@/server/common/category";
import { SPublicOfferCard } from "@/types/offer/offer";
import { PublicOffersContainer } from "@/components/containers/offer/PublicOffersContainer";
import { OffersFilterBar, OfferFilters } from "@/components/containers/offer/OffersFilterBar";
import { Briefcase, ChevronLeft, ChevronRight } from "lucide-react";
import { Prisma } from "@prisma/client";
import CompanyRequiredNotice from "@/components/containers/user/CompanyRequireNotice";
import { useAuth } from "@/hooks/useAuth";

export default function PostedOffersPage() {
     const { user } = useAuth();
     const [page, setPage] = useState(1);
     const perPage = 12;
     const [filters, setFilters] = useState<OfferFilters>({
          search: "",
          category: "",
          type: "",
          priority: "",
          budgetMin: "",
          budgetMax: "",
          location: "",
     });

     if (!user?.company) {
          return <CompanyRequiredNotice message="Please complete company profile to be able to view offers and send offer interests" />;
     }

     // Fetch categories for filter
     const { data: categoriesData } = useQuery({
          queryKey: ["offer-categories"],
          queryFn: () => fetchCategorys({ id: true, name: true }, { type: "TENDER" }),
     });
     const categories = categoriesData?.data ?? [];

     // Build search query - Exclude own company offers
     const buildSearchQuery = (): Prisma.OfferWhereInput => {
          const query: Prisma.OfferWhereInput = {
               status: "PUBLISHED",
               visibility: { in: ["PUBLIC", "RESTRICTED"] },
               companyId: { not: user.company!.id }, // Exclude own offers
          };

          if (filters.search) {
               query.OR = [
                    { title: { contains: filters.search, mode: "insensitive" } },
                    { description: { contains: filters.search, mode: "insensitive" } },
               ];
          }

          if (filters.category) {
               query.categoryId = filters.category;
          }

          if (filters.type) {
               query.type = filters.type as any;
          }

          if (filters.priority) {
               query.priority = filters.priority as any;
          }

          if (filters.budgetMin || filters.budgetMax) {
               query.pricing = {};
               if (filters.budgetMin) {
                    query.pricing.budgetMin = { gte: parseFloat(filters.budgetMin) };
               }
               if (filters.budgetMax) {
                    query.pricing.budgetMax = { lte: parseFloat(filters.budgetMax) };
               }
          }

          if (filters.location) {
               query.siteLocation = {
                    OR: [
                         { city: { contains: filters.location, mode: "insensitive" } },
                         { country: { contains: filters.location, mode: "insensitive" } },
                    ],
               };
          }

          return query;
     };

     // Fetch offers
     const { data, isLoading } = useQuery({
          queryKey: ["explore-offers", user.company.id, page, filters],
          queryFn: () => fetchOffers(
               SPublicOfferCard,
               buildSearchQuery(),
               perPage,
               (page - 1) * perPage,
               { createdAt: "desc" }
          ),
     });

     const offers = data?.data ?? [];
     const total = data?.pagination.total ?? 0;
     const totalPages = Math.ceil(total / perPage);

     const handleFilterChange = (newFilters: OfferFilters) => {
          setFilters(newFilters);
          setPage(1); // Reset to first page when filters change
     };

     return (
          <div className="min-h-screen bg-gray-50 py-8">
               <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Page Header */}
                    <div className="mb-8">
                         <div className="inline-flex items-center justify-center w-14 h-14 bg-yellow-400 rounded-xl mb-4">
                              <Briefcase className="w-7 h-7 text-gray-900" />
                         </div>
                         <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-2">
                              Explore Offers
                         </h1>
                         <p className="text-lg text-gray-600">
                              Discover opportunities from other companies. Find projects and partnerships.
                         </p>
                    </div>

                    {/* Filters */}
                    <div className="mb-8">
                         <OffersFilterBar
                              filters={filters}
                              onFilterChange={handleFilterChange}
                              categories={categories}
                         />
                    </div>

                    {/* Results Count */}
                    {!isLoading && (
                         <div className="mb-6">
                              <p className="text-sm font-bold text-gray-600">
                                   Showing {offers.length} of {total} offers
                                   {filters.search && ` for "${filters.search}"`}
                              </p>
                         </div>
                    )}

                    {/* Offers Container */}
                    <PublicOffersContainer
                         offers={offers}
                         isLoading={isLoading}
                         emptyMessage="No offers match your filters. Try adjusting your search criteria."
                    />

                    {/* Pagination */}
                    {totalPages > 1 && !isLoading && (
                         <div className="mt-12 bg-white rounded-xl shadow-sm border-2 border-gray-200 p-6">
                              <div className="flex items-center justify-between gap-4 flex-wrap">
                                   <button
                                        onClick={() => setPage(p => Math.max(1, p - 1))}
                                        disabled={page === 1}
                                        className="px-6 py-3 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:cursor-not-allowed text-gray-900 font-bold rounded-xl transition-all flex items-center gap-2"
                                   >
                                        <ChevronLeft className="w-5 h-5" />
                                        Previous
                                   </button>

                                   <div className="flex items-center gap-2">
                                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                             let pageNum;
                                             if (totalPages <= 5) {
                                                  pageNum = i + 1;
                                             } else if (page <= 3) {
                                                  pageNum = i + 1;
                                             } else if (page >= totalPages - 2) {
                                                  pageNum = totalPages - 4 + i;
                                             } else {
                                                  pageNum = page - 2 + i;
                                             }

                                             return (
                                                  <button
                                                       key={pageNum}
                                                       onClick={() => setPage(pageNum)}
                                                       className={`w-12 h-12 rounded-xl font-bold transition-all ${
                                                            page === pageNum
                                                                 ? "bg-yellow-400 text-gray-900"
                                                                 : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                                                       }`}
                                                  >
                                                       {pageNum}
                                                  </button>
                                             );
                                        })}
                                   </div>

                                   <button
                                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                        disabled={page === totalPages}
                                        className="px-6 py-3 bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-50 disabled:cursor-not-allowed text-gray-900 font-bold rounded-xl transition-all flex items-center gap-2"
                                   >
                                        Next
                                        <ChevronRight className="w-5 h-5" />
                                   </button>
                              </div>

                              <p className="text-center text-sm text-gray-600 mt-4">
                                   Page {page} of {totalPages}
                              </p>
                         </div>
                    )}
               </div>
          </div>
     );
}