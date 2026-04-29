"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchBanners } from "@/server/banners/banner";
import { SBanner } from "@/types/banners/banner";
import { AdminBannerRow } from "@/components/cards/AdminBannerRow";
import Pagination from "@/components/ui/Pagination";
import { Megaphone, Search } from "lucide-react";

interface BannersContainerProps {
  planId?: string;
  compact?: boolean;
}

const PER_PAGE = 10;

export const BannersContainer = ({ planId, compact = false }: BannersContainerProps) => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const where = {
    ...(planId ? { planId } : {}),
    ...(search ? { title: { contains: search, mode: "insensitive" as const } } : {}),
  };

  const { data, isLoading } = useQuery({
    queryKey: ["banners", planId, search, page],
    queryFn: () => fetchBanners(SBanner, where, PER_PAGE, (page - 1) * PER_PAGE),
  });

  const banners = data?.data ?? [];
  const total = data?.pagination.total ?? 0;

  return (
    <div className="flex flex-col gap-4">
      {!compact && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search banners..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
          />
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-10">
          <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : banners.length === 0 ? (
        <div className="bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 py-12 flex flex-col items-center gap-3 text-gray-400">
          <Megaphone className="w-10 h-10" />
          <p className="font-semibold text-sm">No banners found</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {banners.map((banner) => (
            <AdminBannerRow key={banner.id} banner={banner} />
          ))}
        </div>
      )}

      {!compact && total > PER_PAGE && (
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
