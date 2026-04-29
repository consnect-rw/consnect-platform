"use client";

import { useState, useEffect } from "react";
import { TBanner } from "@/types/banners/banner";
import { BannerItem } from "./BannerItem";
import { ChevronLeft, ChevronRight } from "lucide-react";

const AUTO_ROTATE_MS = 5000;

export const BottomBannerStrip = ({ banners }: { banners: TBanner[] }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;
    const t = setInterval(() => setCurrent((c) => (c + 1) % banners.length), AUTO_ROTATE_MS);
    return () => clearInterval(t);
  }, [banners.length]);

  if (!banners.length) return null;

  // Mobile: 1 banner, tablet: 2, desktop: 3
  const get = (count: number) =>
    Array.from({ length: Math.min(count, banners.length) }, (_, i) => banners[(current + i) % banners.length]);

  const mobile = get(1);
  const tablet = get(2);
  const desktop = get(3);

  // Always render the full grid columns for the breakpoint — empty slots stay dark
  const slot = (bs: TBanner[], cols: number, key: string) => (
    <div key={key} className="grid gap-3" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, height: "90px" }}>
      {Array.from({ length: cols }, (_, i) =>
        i < bs.length ? <BannerItem key={bs[i].id} banner={bs[i]} objectFit="contain" className="w-full h-full rounded-none" /> : <div key={i} />
      )}
    </div>
  );

  return (
    <div className="w-full py-4 px-4 sm:px-6 lg:px-8 relative group">
      <div className="sm:hidden">{slot(mobile, 1, "m")}</div>
      <div className="hidden sm:block lg:hidden">{slot(tablet, 2, "t")}</div>
      <div className="hidden lg:block">{slot(desktop, 3, "d")}</div>

      {banners.length > 1 && (
        <>
          <button
            onClick={() => setCurrent((c) => (c - 1 + banners.length) % banners.length)}
            className="absolute left-6 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full bg-black/30 hover:bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-all"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setCurrent((c) => (c + 1) % banners.length)}
            className="absolute right-6 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full bg-black/30 hover:bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-all"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <div className="flex justify-center gap-1.5 mt-2">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? "w-6 bg-amber-500" : "w-1.5 bg-gray-300"}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
