"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchBannerPlans } from "@/server/banners/banner-plan";
import { SBannerPlan } from "@/types/banners/banner-plan";
import { AdminBannerPlanCard } from "@/components/cards/AdminBannerPlanCard";
import Pagination from "@/components/ui/Pagination";
import { LayoutTemplate, Search } from "lucide-react";

const PER_PAGE = 12;

export const BannerPlansContainer = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const where = search ? { name: { contains: search, mode: "insensitive" as const } } : undefined;

  const { data, isLoading } = useQuery({
    queryKey: ["banner-plans", search, page],
    queryFn: () => fetchBannerPlans(SBannerPlan, where, PER_PAGE, (page - 1) * PER_PAGE),
  });

  const plans = data?.data ?? [];
  const total = data?.pagination.total ?? 0;

  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search plans..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
        />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-10">
          <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : plans.length === 0 ? (
        <div className="bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 py-12 flex flex-col items-center gap-3 text-gray-400">
          <LayoutTemplate className="w-10 h-10" />
          <p className="font-semibold text-sm">No plans found</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <AdminBannerPlanCard key={plan.id} plan={plan} />
          ))}
        </div>
      )}

      {total > PER_PAGE && (
        <Pagination
          onPageChange={setPage}
          totalItems={total}
          itemsPerPage={PER_PAGE}
          currentPage={page}
        />
      )}
    </div>
  );
};
