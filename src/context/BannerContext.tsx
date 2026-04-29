"use client";

import { fetchBanners } from "@/server/banners/banner";
import { SBanner, TBanner } from "@/types/banners/banner";
import { useQuery } from "@tanstack/react-query";
import { createContext, useContext, ReactNode } from "react";

// Banners grouped by page position within a location
export interface TLocationBanners {
  top: TBanner[];
  middle: TBanner[];
  bottom: TBanner[];
  sidebar: TBanner[];
  other: TBanner[];
}

// Banners grouped by location, then by page position
export interface TStructuredBanners {
  home: TLocationBanners;
  company: TLocationBanners;
  offer: TLocationBanners;
  tender: TLocationBanners;
  blog: TLocationBanners;
  all: TLocationBanners; // global — shown everywhere
  other: TLocationBanners;
}

const emptyLocation = (): TLocationBanners => ({
  top: [], middle: [], bottom: [], sidebar: [], other: [],
});

const emptyStructured = (): TStructuredBanners => ({
  home: emptyLocation(), company: emptyLocation(), offer: emptyLocation(),
  tender: emptyLocation(), blog: emptyLocation(), all: emptyLocation(), other: emptyLocation(),
});

function structureBanners(banners: TBanner[]): TStructuredBanners {
  const result = emptyStructured();
  for (const banner of banners) {
    const loc = (banner.plan?.location ?? "OTHER").toLowerCase() as keyof TStructuredBanners;
    const pos = (banner.plan?.pagePosition ?? "OTHER").toLowerCase() as keyof TLocationBanners;
    const locationGroup = result[loc] ?? result.other;
    const posGroup = locationGroup[pos] ?? locationGroup.other;
    posGroup.push(banner);
  }
  return result;
}

interface IBannersContextType {
  banners: TBanner[];
  structured: TStructuredBanners;
  isFetchingBanners: boolean;
  refreshBanners: () => void;
}

const BannersContext = createContext<IBannersContextType | undefined>(undefined);

export function BannersProvider({ children }: { children: ReactNode }) {
  const { data: bannersData, isLoading: isFetchingBanners, refetch: refreshBanners } = useQuery({
    queryKey: ["banners", "active"],
    queryFn: () => fetchBanners(SBanner, { AND: [{ expireAt: { gt: new Date() } }, { plan: { isActive: true } }] }),
  });

  const banners = bannersData?.data ?? [];
  const structured = structureBanners(banners);

  return (
    <BannersContext.Provider value={{ banners, structured, isFetchingBanners, refreshBanners }}>
      {children}
    </BannersContext.Provider>
  );
}

export function useBanners() {
  const context = useContext(BannersContext);
  if (!context) throw new Error("useBanners must be used within a BannersProvider");
  return context;
}