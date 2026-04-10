"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import CompanyRequiredNotice from "@/components/containers/user/CompanyRequireNotice";
import { fetchOfferInterests } from "@/server/offer/offer-interest";
import { SReceivedOfferInterest } from "@/types/offer/offer-interest";
import { ReceivedInterestCard } from "@/components/cards/ReceivedInterestCard";
import Pagination from "@/components/ui/Pagination";
import { Inbox, Loader2, Filter } from "lucide-react";
import { Prisma } from "@prisma/client";
import { useSearchParams } from "next/navigation";

const PER_PAGE = 20;

const STATUS_FILTERS = [
  { value: "", label: "All" },
  { value: "PENDING", label: "Pending" },
  { value: "ACCEPTED", label: "Accepted" },
  { value: "REJECTED", label: "Declined" },
];

export default function ReceivedInterestsPage() {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const searchParams = useSearchParams();
  const offerId = searchParams.get("offerId");

  if (!user?.company) {
    return (
      <CompanyRequiredNotice message="Please complete your company profile to review interests received on your offers." />
    );
  }

  const buildQuery = (): Prisma.OfferInterestWhereInput => {
    const q: Prisma.OfferInterestWhereInput = {
      offer: {
          AND: [
               {companyId: user.company!.id },
               ...(offerId ? [{ id: offerId }] : [])
          ]
     },
    };
    if (statusFilter) q.status = statusFilter as any;
    return q;
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { data, isLoading } = useQuery({
    queryKey: ["received-interests", user.company.id, page, statusFilter, offerId ? `offer-${offerId}` : null],
    queryFn: () =>
      fetchOfferInterests(
        SReceivedOfferInterest,
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

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="w-full mx-auto space-y-4">
        {/* Page Header — compact */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center shrink-0">
              <Inbox className="w-5 h-5 text-gray-900" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-gray-900">Received Interests</h1>
              <p className="text-xs text-gray-500">Review companies interested in your offers</p>
            </div>
          </div>
          {!isLoading && (
            <p className="text-sm text-gray-500 shrink-0">
              <span className="font-black text-gray-900">{total}</span> interest{total !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <Filter className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => handleFilterChange(f.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border whitespace-nowrap ${
                statusFilter === f.value
                  ? "bg-gray-900 text-yellow-400 border-gray-900"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="bg-white rounded-xl border-2 border-gray-200 p-12 flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="w-8 h-8 text-yellow-500 animate-spin mx-auto mb-2" />
              <p className="text-gray-500 font-medium text-sm">Loading interests...</p>
            </div>
          </div>
        ) : interests.length === 0 ? (
          <div className="bg-white rounded-xl border-2 border-dashed border-gray-200 p-12 text-center">
            <Inbox className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-black text-gray-900 mb-1">
              {statusFilter ? `No ${statusFilter.toLowerCase()} interests` : "No interests received yet"}
            </h3>
            <p className="text-gray-500 text-xs max-w-xs mx-auto">
              {statusFilter
                ? "Try changing the filter to see other interests."
                : "Once companies show interest in your published offers, they will appear here."}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {interests.map((interest) => (
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
    </div>
  );
}
