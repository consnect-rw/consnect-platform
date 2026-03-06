"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchOffers } from "@/server/offer/offer";
import { SAdminOfferCard } from "@/types/offer/offer";
import { AdminOffersContainer } from "@/components/containers/offer/AdminOffersContainer";
import { Briefcase, ChevronLeft, ChevronRight, Search } from "lucide-react";

export default function AdminOffersPage() {
     const [page, setPage] = useState(1);
     const perPage = 24;
     const [search, setSearch] = useState("");
     const [statusFilter, setStatusFilter] = useState<string>("");

     // Build search query
     const buildSearchQuery = () => {
          const query: any = {};

          if (search) {
               query.OR = [
                    { title: { contains: search, mode: "insensitive" } },
                    { description: { contains: search, mode: "insensitive" } },
               ];
          }

          if (statusFilter) {
               query.status = statusFilter;
          }

          return query;
     };

     // Fetch offers
     const { data, isLoading } = useQuery({
          queryKey: ["admin-offers", page, search, statusFilter],
          queryFn: () =>
               fetchOffers(
                    SAdminOfferCard,
                    buildSearchQuery(),
                    perPage,
                    (page - 1) * perPage,
                    { createdAt: "desc" }
               ),
     });

     const offers = data?.data ?? [];
     const total = data?.pagination.total ?? 0;
     const totalPages = Math.ceil(total / perPage);

     return (
          <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
               <div className="max-w-7xl mx-auto space-y-6">
                    {/* Page Header */}
                    <div className="bg-white rounded-2xl shadow-sm border-2 border-gray-200 p-6 sm:p-8">
                         <div className="flex items-center gap-4 mb-4">
                              <div className="w-14 h-14 bg-yellow-400 rounded-xl flex items-center justify-center">
                                   <Briefcase className="w-7 h-7 text-gray-900" />
                              </div>
                              <div>
                                   <h1 className="text-3xl sm:text-4xl font-black text-gray-900">
                                        Manage Offers
                                   </h1>
                                   <p className="text-gray-600">
                                        Monitor and manage all offers on the platform
                                   </p>
                              </div>
                         </div>

                         {/* Search and Filters */}
                         <div className="flex flex-col sm:flex-row gap-4">
                              {/* Search */}
                              <div className="flex-1 relative">
                                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                   <input
                                        type="text"
                                        placeholder="Search offers..."
                                        value={search}
                                        onChange={(e) => {
                                             setSearch(e.target.value);
                                             setPage(1);
                                        }}
                                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-400 focus:outline-none text-gray-900 font-medium"
                                   />
                              </div>

                              {/* Status Filter */}
                              <select
                                   id="status-filter"
                                   title="Filter by status"
                                   value={statusFilter}
                                   onChange={(e) => {
                                        setStatusFilter(e.target.value);
                                        setPage(1);
                                   }}
                                   className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-400 focus:outline-none text-gray-900 font-bold bg-white"
                              >
                                   <option value="">All Status</option>
                                   <option value="PUBLISHED">Published</option>
                                   <option value="DRAFT">Draft</option>
                                   <option value="CLOSED">Closed</option>
                                   <option value="CANCELLED">Cancelled</option>
                              </select>
                         </div>
                    </div>

                    {/* Results Count */}
                    {!isLoading && (
                         <div className="px-2">
                              <p className="text-sm font-bold text-gray-600">
                                   Showing {offers.length} of {total} offers
                                   {search && ` for "${search}"`}
                              </p>
                         </div>
                    )}

                    {/* Offers Container */}
                    <AdminOffersContainer
                         offers={offers}
                         isLoading={isLoading}
                         emptyMessage="No offers found. Companies haven't created any offers yet."
                    />

                    {/* Pagination */}
                    {totalPages > 1 && !isLoading && (
                         <div className="bg-white rounded-xl shadow-sm border-2 border-gray-200 p-6">
                              <div className="flex items-center justify-between gap-4 flex-wrap">
                                   <button
                                        onClick={() => setPage((p) => Math.max(1, p - 1))}
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
                                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
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