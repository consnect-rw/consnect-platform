"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import CompanyRequiredNotice from "@/components/containers/user/CompanyRequireNotice";
import { fetchOfferInterests } from "@/server/offer/offer-interest";
import { SSentOfferInterest } from "@/types/offer/offer-interest";
import { SentInterestCard } from "@/components/cards/SentInterestCard";
import Pagination from "@/components/ui/Pagination";
import { Send, Loader2, Filter } from "lucide-react";
import { Prisma } from "@prisma/client";

const PER_PAGE = 10;

const STATUS_FILTERS = [
     { value: "", label: "All" },
     { value: "PENDING", label: "Awaiting Response" },
     { value: "ACCEPTED", label: "Accepted" },
     { value: "REJECTED", label: "Declined" },
];

export default function OfferInterestsPage() {
     const { user } = useAuth();
     const [page, setPage] = useState(1);
     const [statusFilter, setStatusFilter] = useState<string>("");

     if (!user?.company) {
          return (
               <CompanyRequiredNotice message="Please complete your company profile to track your offer interests." />
          );
     }

     const buildQuery = (): Prisma.OfferInterestWhereInput => {
          const q: Prisma.OfferInterestWhereInput = {
               companyId: user.company!.id,
          };
          if (statusFilter) q.status = statusFilter as any;
          return q;
     };

     // eslint-disable-next-line react-hooks/rules-of-hooks
     const { data, isLoading } = useQuery({
          queryKey: ["sent-interests", user.company.id, page, statusFilter],
          queryFn: () =>
               fetchOfferInterests(
                    SSentOfferInterest,
                    buildQuery(),
                    PER_PAGE,
                    (page - 1) * PER_PAGE,
                    { createdAt: "desc" }
               ),
     });

     const interests = data?.data ?? [];
     const total = data?.pagination.total ?? 0;

     const handleFilterChange = (val: string) => {
          setStatusFilter(val);
          setPage(1);
     };

     // Summary counts (from current full list if small page, else a rough approach)
     const acceptedCount = interests.filter((i) => i.status === "ACCEPTED").length;

     return (
          <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
               <div className="max-w-4xl mx-auto space-y-6">
                    {/* Page Header */}
                    <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 sm:p-8">
                         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                              <div className="flex items-start gap-4">
                                   <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center shrink-0">
                                        <Send className="w-5 h-5 text-yellow-400" />
                                   </div>
                                   <div>
                                        <h1 className="text-2xl sm:text-3xl font-black text-gray-900">My Interests</h1>
                                        <p className="text-gray-600 mt-1 text-sm">
                                             Track the status of your submitted interests on construction offers.
                                        </p>
                                   </div>
                              </div>

                              {/* Quick stat */}
                              {!isLoading && total > 0 && (
                                   <div className="flex items-center gap-4 shrink-0">
                                        <div className="text-center">
                                             <p className="text-2xl font-black text-gray-900">{total}</p>
                                             <p className="text-xs text-gray-500 font-medium">Total</p>
                                        </div>
                                        <div className="w-px h-8 bg-gray-200" />
                                        <div className="text-center">
                                             <p className="text-2xl font-black text-green-600">{acceptedCount}</p>
                                             <p className="text-xs text-gray-500 font-medium">Accepted</p>
                                        </div>
                                   </div>
                              )}
                         </div>

                         {/* Deal Room hint banner when there are accepted interests */}
                         {acceptedCount > 0 && (
                              <div className="mt-5 flex items-center gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                                   <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center shrink-0">
                                        <span className="text-lg">🤝</span>
                                   </div>
                                   <p className="text-sm font-bold text-gray-900">
                                        You have <span className="text-yellow-700">{acceptedCount}</span> accepted interest{acceptedCount > 1 ? "s" : ""}.{" "}
                                        <span className="font-medium text-gray-600">Join the deal room to proceed with negotiations.</span>
                                   </p>
                              </div>
                         )}
                    </div>

                    {/* Filters + Count */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                         <div className="flex items-center gap-2">
                              <Filter className="w-4 h-4 text-gray-500" />
                              <div className="flex gap-1.5 flex-wrap">
                                   {STATUS_FILTERS.map((f) => (
                                        <button
                                             key={f.value}
                                             onClick={() => handleFilterChange(f.value)}
                                             className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                                                  statusFilter === f.value
                                                       ? "bg-gray-900 text-yellow-400 border-gray-900"
                                                       : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                                             }`}
                                        >
                                             {f.label}
                                        </button>
                                   ))}
                              </div>
                         </div>
                         {!isLoading && (
                              <p className="text-sm text-gray-500 shrink-0">
                                   Showing <span className="font-black text-gray-900">{interests.length}</span> of{" "}
                                   <span className="font-black text-gray-900">{total}</span>
                              </p>
                         )}
                    </div>

                    {/* Content */}
                    {isLoading ? (
                         <div className="bg-white rounded-2xl border-2 border-gray-200 p-16 flex items-center justify-center">
                              <div className="text-center">
                                   <Loader2 className="w-10 h-10 text-yellow-500 animate-spin mx-auto mb-3" />
                                   <p className="text-gray-500 font-medium text-sm">Loading your interests...</p>
                              </div>
                         </div>
                    ) : interests.length === 0 ? (
                         <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-16 text-center">
                              <Send className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                              <h3 className="text-lg font-black text-gray-900 mb-2">
                                   {statusFilter ? `No ${statusFilter.toLowerCase()} interests` : "No interests submitted yet"}
                              </h3>
                              <p className="text-gray-500 text-sm max-w-sm mx-auto">
                                   {statusFilter
                                        ? "Try clearing the filter to see all your interests."
                                        : "Browse construction offers and submit your interest to see them here."}
                              </p>
                         </div>
                    ) : (
                         <>
                              <div className="grid sm:grid-cols-2 gap-4">
                                   {interests.map((interest) => (
                                        <SentInterestCard
                                             key={interest.id}
                                             interest={interest}
                                             onJoinDealRoom={(id) => {
                                                  // TODO: implement deal room join
                                                  console.log("Join deal room for interest:", id);
                                             }}
                                        />
                                   ))}
                              </div>

                              <Pagination
                                   currentPage={page}
                                   totalItems={total}
                                   itemsPerPage={PER_PAGE}
                                   onPageChange={setPage}
                              />
                         </>
                    )}
               </div>
          </div>
     );
}
