"use client";

import { useState, useEffect } from "react";
import { TBanner } from "@/types/banners/banner";
import { BannerItem } from "./BannerItem";
import { ChevronLeft, ChevronRight } from "lucide-react";

const AUTO_ROTATE_MS = 6000;

interface MiddleBannersProps {
  banners: TBanner[];
  /**
   * Zero-based index of this slot among all middle slots on the page.
   */
  index?: number;
  /**
   * Total number of middle slots on the page.
   * Used to divide banners equally: each slot owns `ceil(total/totalSlots)` banners.
   * If this slot's share is empty, it returns null.
   */
  totalSlots?: number;
}

export const MiddleBannerSlot = ({ banners, index = 0, totalSlots: _totalSlots = 1 }: MiddleBannersProps) => {
  const [page, setPage] = useState(0);

  // Determine COLS from orientation of the first banner
  const orientation = banners[0]?.plan?.orientation ?? "HORIZONTAL";
  const isVertical = orientation === "VERTICAL";
  const isSquare = orientation === "SQUARE";
  // Max banners shown at once on desktop (= columns in grid)
  const COLS = isVertical ? 2 : 3; // square and horizontal both use 3 cols

  // Each slot owns a fixed window of COLS banners starting at index * COLS.
  // Example: 2 banners, 3 slots, COLS=3 → c1=[0,1], c2=[], c3=[]
  // Example: 9 banners, 3 slots, COLS=3 → c1=[0,1,2], c2=[3,4,5], c3=[6,7,8]
  const sliceStart = index * COLS;
  const myBanners = banners.slice(sliceStart, sliceStart + COLS);

  const totalPages = myBanners.length > 0 ? Math.ceil(myBanners.length / COLS) : 0;

  useEffect(() => {
    setPage(0); // reset when banners change
  }, [banners.length, index]);

  useEffect(() => {
    if (totalPages <= 1) return;
    const t = setInterval(() => setPage((p) => (p + 1) % totalPages), AUTO_ROTATE_MS);
    return () => clearInterval(t);
  }, [totalPages]);

  // This slot has no banners assigned to it — render nothing
  if (!myBanners.length) return null;

  // Mobile: single banner cycling through all myBanners one at a time
  const mobileBanner = myBanners[page % myBanners.length];

  // Desktop page — COLS banners at once
  const pageStart = page * COLS;
  const pageBanners = myBanners.slice(pageStart, pageStart + COLS);

  const gridClass = isVertical
    ? "grid-cols-2"
    : "grid-cols-2 lg:grid-cols-3";

  const itemClass = isVertical
    ? "w-full aspect-3/4 max-h-96"   // 300×400 = 3:4
    : isSquare
    ? "w-full aspect-square"          // 300×300 = 1:1
    : "w-full h-24 sm:h-28 lg:h-32"; // 390×130 ≈ 3:1

  return (
    <div className="w-full py-4 px-4 sm:px-6 lg:px-8 relative group">

      {/* ── Mobile: single banner, cycles one at a time ── */}
      <div className="sm:hidden">
        <BannerItem banner={mobileBanner} className={itemClass} />
        {myBanners.length > 1 && (
          <div className="flex justify-center gap-1.5 mt-2">
            {myBanners.map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`h-1.5 rounded-full transition-all ${i === page % myBanners.length ? "w-6 bg-amber-500" : "w-1.5 bg-gray-300"}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Tablet / Desktop: grid of COLS banners per page ── */}
      <div className={`hidden sm:grid gap-3 ${gridClass}`}>
        {Array.from({ length: COLS }, (_, i) => {
          const b = pageBanners[i];
          if (!b) return <div key={i} />;
          return <BannerItem key={b.id} banner={b} className={itemClass} />;
        })}
      </div>

      {totalPages > 1 && (
        <>
          <button
            onClick={() => setPage((p) => (p - 1 + totalPages) % totalPages)}
            className="absolute left-6 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full bg-black/30 hover:bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-all hidden sm:flex"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setPage((p) => (p + 1) % totalPages)}
            className="absolute right-6 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full bg-black/30 hover:bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-all hidden sm:flex"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <div className="hidden sm:flex justify-center gap-1.5 mt-3">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`h-1.5 rounded-full transition-all ${i === page ? "w-6 bg-amber-500" : "w-1.5 bg-gray-300"}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
