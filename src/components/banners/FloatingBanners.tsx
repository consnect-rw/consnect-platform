"use client";

import { useState, useEffect } from "react";
import { TBanner } from "@/types/banners/banner";
import { BannerItem } from "./BannerItem";
import { X, ChevronRight } from "lucide-react";

export const FloatingBanners = ({ banners }: { banners: TBanner[] }) => {
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  // Delay pop-in so it doesn't immediately distract
  useEffect(() => {
    if (!banners.length || dismissed) return;
    const t = setTimeout(() => setVisible(true), 3500);
    return () => clearTimeout(t);
  }, [banners.length, dismissed]);

  // Auto-rotate every 5s
  useEffect(() => {
    if (banners.length <= 1) return;
    const t = setInterval(() => setCurrent((c) => (c + 1) % banners.length), 5000);
    return () => clearInterval(t);
  }, [banners.length]);

  if (!banners.length || dismissed) return null;

  const banner = banners[current];

  return (
    <>
      {/* Collapsed tab — always visible after dismiss so they can bring it back */}
      {!visible && !dismissed && (
        <button
          onClick={() => setVisible(true)}
          className="fixed bottom-24 right-0 z-40 flex items-center gap-1 bg-amber-500 text-gray-900 text-xs font-bold px-2 py-3 rounded-l-xl shadow-lg hover:bg-amber-400 transition-colors"
          style={{ writingMode: "vertical-rl" }}
        >
          <ChevronRight className="w-3.5 h-3.5 rotate-180" />
          Ads
        </button>
      )}

      {/* Floating panel */}
      <div
        className={`fixed bottom-20 right-0 z-40 transition-transform duration-500 ease-out ${visible ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="relative bg-white rounded-l-2xl shadow-2xl border border-r-0 border-gray-200 overflow-hidden w-52 sm:w-64">
          {/* Header bar */}
          <div className="flex items-center justify-between px-3 py-2 bg-gray-900 text-white">
            <span className="text-xs font-bold tracking-wide uppercase">Sponsored</span>
            <div className="flex items-center gap-1">
              {banners.length > 1 && (
                <button
                  onClick={() => setCurrent((c) => (c + 1) % banners.length)}
                  className="p-0.5 rounded hover:bg-white/20 transition-colors"
                  title="Next ad"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={() => setVisible(false)}
                className="p-0.5 rounded hover:bg-white/20 transition-colors"
                title="Minimize"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => { setVisible(false); setDismissed(true); }}
                className="p-0.5 rounded hover:bg-white/20 transition-colors"
                title="Close"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Banner image — aspect ratio matches stored sidebar dimensions exactly */}
          <BannerItem
            banner={banner}
            className={`w-full ${
              banner.plan?.orientation === "VERTICAL"
                ? "aspect-3/4"           // 240×320 = 3:4
                : banner.plan?.orientation === "SQUARE"
                ? "aspect-square"        // 250×250 = 1:1
                : "aspect-video"         // 300×169 = 16:9
            }`}
          />

          {/* Banner title */}
          <div className="px-3 py-2 bg-white">
            <p className="text-xs text-gray-500 font-medium truncate">{banner.title}</p>
          </div>

          {/* Dots */}
          {banners.length > 1 && (
            <div className="flex justify-center gap-1 pb-2">
              {banners.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-1 rounded-full transition-all ${i === current ? "w-4 bg-amber-500" : "w-1 bg-gray-300"}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
