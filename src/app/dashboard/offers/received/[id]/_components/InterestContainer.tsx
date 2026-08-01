"use client";

import { ReceivedInterestCard } from "@/components/cards/ReceivedInterestCard";
import Pagination from "@/components/ui/Pagination";
import { TReceivedOfferInterest } from "@/types/offer/offer-interest";
import { Filter, Inbox } from "lucide-react";
import { useState } from "react";

const PER_PAGE = 20;

const STATUS_FILTERS = [
  { value: "", label: "All" },
  { value: "PENDING", label: "Pending" },
  { value: "ACCEPTED", label: "Accepted" },
  { value: "REJECTED", label: "Declined" },
];

export const ReceivedInterestsContainer = ({interests}:{interests:TReceivedOfferInterest[]}) => {
     const [page, setPage] = useState(1);
     const [statusFilter, setStatusFilter] = useState<string>("");

     const counts = {
          "": interests.length,
          PENDING: interests.filter(i => i.status === "PENDING").length,
          ACCEPTED: interests.filter(i => i.status === "ACCEPTED").length,
          REJECTED: interests.filter(i => i.status === "REJECTED").length,
     };

     const filtered = statusFilter ? interests.filter(i => i.status === statusFilter) : interests;
     const total = filtered.length;
     const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

     const handleFilterChange = (val: string) => {
          setStatusFilter(val);
          setPage(1);
     };

     return (
          <div className="w-full space-y-4">
               {/* Filters */}
               <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    <Filter className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    {STATUS_FILTERS.map((f) => {
                         const count = counts[f.value as keyof typeof counts] ?? 0;
                         const isActive = statusFilter === f.value;
                         return (
                              <button
                                   key={f.value}
                                   onClick={() => handleFilterChange(f.value)}
                                   className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border whitespace-nowrap ${
                                        isActive
                                             ? "bg-gray-900 text-amber-400 border-gray-900"
                                             : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                                   }`}
                              >
                                   {f.label}
                                   <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${isActive ? "bg-amber-400 text-gray-900" : "bg-gray-100 text-gray-500"}`}>
                                        {count}
                                   </span>
                              </button>
                         );
                    })}
               </div>

               {/* Content */}
               {paginated.length === 0 ? (
                    <div className="bg-white rounded-xl border-2 border-dashed border-gray-200 p-12 text-center">
                         <Inbox className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                         <h3 className="text-base font-black text-gray-900 mb-1">
                              {statusFilter ? `No ${statusFilter.toLowerCase()} interests` : "No interests received yet"}
                         </h3>
                         <p className="text-gray-500 text-xs max-w-xs mx-auto">
                              {statusFilter
                                   ? "Try changing the filter to see other interests."
                                   : "Once companies show interest in your published work packages, they will appear here."}
                         </p>
                    </div>
               ) : (
                    <>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {paginated.map((interest) => (
                                   <ReceivedInterestCard key={interest.id} interest={interest} />
                              ))}
                         </div>
                         {total > PER_PAGE && (
                              <Pagination
                                   currentPage={page}
                                   totalItems={total}
                                   itemsPerPage={PER_PAGE}
                                   onPageChange={setPage}
                              />
                         )}
                    </>
               )}
          </div>
     );
}