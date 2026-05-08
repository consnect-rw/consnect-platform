"use client";

import { useState, useEffect } from "react";
import { TBanner } from "@/types/banners/banner";
import { BannerItem } from "./BannerItem";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

const AUTO_ROTATE_MS = 5000;

export const TopBannerStrip = ({ banners }: { banners: TBanner[] }) => {
  const [current, setCurrent] = useState(0);
  const [dismissed, setDismissed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // Auto-rotate when multiple banners
  useEffect(() => {
    if (banners.length <= 1) return;
    const t = setInterval(() => setCurrent((c) => (c + 1) % banners.length), AUTO_ROTATE_MS);
    return () => clearInterval(t);
  }, [banners.length]);

  // Always render the outer container for stable SSR/client tree order.
  // Collapse to nothing when there are no banners, not yet mounted, or dismissed.
  const isVisible = mounted && banners.length > 0 && !dismissed;

  return (
    // Natural leaderboard height — matches the 970×90 standard ratio exactly
    <div
      className="relative w-full bg-gray-950 overflow-hidden"
      style={{ height: isVisible ? "90px" : "0px" }}
      suppressHydrationWarning
    >
      {isVisible && (<>
      {/* Banners: 1 col mobile, 2 tablet, 3 desktop — each fills its own slot only */}
      <div className="hidden lg:grid grid-cols-3 h-full gap-0.5">
        {[0, 1, 2].map((offset) => {
          const b = banners[(current + offset) % banners.length];
          if (offset >= banners.length) return <div key={offset} />;
          return <BannerItem key={b.id} banner={b} objectFit="contain" className="w-full h-full rounded-none" />;
        })}
      </div>
      <div className="hidden sm:grid lg:hidden grid-cols-2 h-full gap-0.5">
        {[0, 1].map((offset) => {
          const b = banners[(current + offset) % banners.length];
          if (offset >= banners.length) return <div key={offset} />;
          return <BannerItem key={b.id} banner={b} objectFit="contain" className="w-full h-full rounded-none" />;
        })}
      </div>
      <div className="sm:hidden h-full">
        <BannerItem banner={banners[current]} objectFit="contain" className="w-full h-full rounded-none" />
      </div>

      {/* Prev/Next controls */}
      {banners.length > 1 && (
        <>
          <button
            onClick={() => setCurrent((c) => (c - 1 + banners.length) % banners.length)}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-1 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setCurrent((c) => (c + 1) % banners.length)}
            className="absolute right-8 top-1/2 -translate-y-1/2 z-20 p-1 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </>
      )}

      <button
        onClick={() => setDismissed(true)}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-1 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors"
      >
        <X className="w-3 h-3" />
      </button>

      {/* Progress dots */}
      {banners.length > 1 && (
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-1 z-20">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-1 rounded-full transition-all duration-300 ${i === current ? "w-5 bg-amber-400" : "w-1 bg-white/40"}`}
            />
          ))}
        </div>
      )}
      </>)}
    </div>
  );
};

