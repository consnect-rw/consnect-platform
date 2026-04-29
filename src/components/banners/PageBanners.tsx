"use client";

import { useBanners, TLocationBanners } from "@/context/BannerContext";
import { TopBannerStrip } from "./TopBannerStrip";
import { MiddleBannerSlot } from "./MiddleBannerSlot";
import { BottomBannerStrip } from "./BottomBannerStrip";
import { FloatingBanners } from "./FloatingBanners";
import { TBanner } from "@/types/banners/banner";

type BannerLocation = "home" | "company" | "offer" | "tender" | "blog" | "other";

interface PageBannersProps {
  location: BannerLocation;
}

// Merges page-specific banners with global "ALL" banners
function mergeWithGlobal(specific: TLocationBanners, global: TLocationBanners): TLocationBanners {
  return {
    top: [...specific.top, ...global.top],
    middle: [...specific.middle, ...global.middle],
    bottom: [...specific.bottom, ...global.bottom],
    sidebar: [...specific.sidebar, ...global.sidebar],
    other: [...specific.other, ...global.other],
  };
}

// ─── Top strip: renders above all page content ───────────────────────────────
export const TopPageBanners = ({ location }: PageBannersProps) => {
  const { structured } = useBanners();
  const banners = mergeWithGlobal(structured[location], structured.all);
  if (!banners.top.length) return null;
  return <TopBannerStrip banners={banners.top} />;
};

// ─── Middle slot: dropped between sections ───────────────────────────────────
export const MiddlePageBanners = ({ location, index = 0, totalSlots = 1 }: PageBannersProps & { index?: number; totalSlots?: number }) => {
  const { structured } = useBanners();
  const banners = mergeWithGlobal(structured[location], structured.all);
  if (!banners.middle.length) return null;
  return <MiddleBannerSlot banners={banners.middle} index={index} totalSlots={totalSlots} />;
};

// ─── Bottom strip: before/after footer ───────────────────────────────────────
export const BottomPageBanners = ({ location }: PageBannersProps) => {
  const { structured } = useBanners();
  const banners = mergeWithGlobal(structured[location], structured.all);
  if (!banners.bottom.length) return null;
  return <BottomBannerStrip banners={banners.bottom} />;
};

// ─── Floating: sidebar pop-in ─────────────────────────────────────────────────
export const FloatingPageBanners = ({ location }: PageBannersProps) => {
  const { structured } = useBanners();
  const banners = mergeWithGlobal(structured[location], structured.all);
  const allFloating: TBanner[] = [...banners.sidebar, ...banners.other];
  if (!allFloating.length) return null;
  return <FloatingBanners banners={allFloating} />;
};
