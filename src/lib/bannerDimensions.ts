/**
 * Standard banner dimensions keyed by orientation + page position.
 * These are the only valid sizes accepted by the system — admins cannot
 * enter arbitrary values; dimensions are auto-applied from this map.
 */

import { EBannerOrientation, EBannerPagePosition } from "@prisma/client";

export interface BannerDimensions {
  width: number;
  height: number;
  label: string;        // human-readable description
  ratio: string;        // e.g. "16:1"
}

type DimensionKey = `${EBannerOrientation}_${EBannerPagePosition}`;

export const BANNER_DIMENSIONS: Partial<Record<DimensionKey, BannerDimensions>> = {
  // ─── TOP / BOTTOM: ultra-wide leaderboard strips ──────────────────────────
  // IAB standard leaderboard. Displayed at natural 90px height, object-contain.
  // Each slot fills 1/3 viewport on desktop, 1/2 on tablet, full on mobile.
  HORIZONTAL_TOP:    { width: 970,  height: 90,  label: "Leaderboard Strip",     ratio: "~10:1" },
  HORIZONTAL_BOTTOM: { width: 970,  height: 90,  label: "Leaderboard Strip",     ratio: "~10:1" },
  VERTICAL_TOP:      { width: 320,  height: 90,  label: "Compact Strip",         ratio: "~3.5:1" },
  VERTICAL_BOTTOM:   { width: 320,  height: 90,  label: "Compact Strip",         ratio: "~3.5:1" },
  SQUARE_TOP:        { width: 250,  height: 90,  label: "Button Strip",          ratio: "~2.8:1" },
  SQUARE_BOTTOM:     { width: 250,  height: 90,  label: "Button Strip",          ratio: "~2.8:1" },

  // ─── MIDDLE: in-content banners ──────────────────────────────────────────
  // Horizontal: rendered in 3-col grid, each slot ~400px wide × 128px tall → 3:1 ratio
  HORIZONTAL_MIDDLE: { width: 390,  height: 130, label: "Banner Ad",             ratio: "3:1"   },
  // Vertical: rendered as aspect-3/4 (portrait) in 2-col grid
  VERTICAL_MIDDLE:   { width: 300,  height: 400, label: "Medium Rectangle",      ratio: "3:4"   },
  // Square: rendered as aspect-square in 3-col grid
  SQUARE_MIDDLE:     { width: 300,  height: 300, label: "Square Ad",             ratio: "1:1"   },

  // ─── SIDEBAR: floating panel (w-52/w-64 = 208–256px wide) ────────────────
  // Horizontal: panel renders as aspect-video (16:9)
  HORIZONTAL_SIDEBAR:{ width: 300,  height: 169, label: "Sidebar Banner",        ratio: "16:9"  },
  // Vertical: panel renders as aspect-3/4 (portrait, 3:4)
  VERTICAL_SIDEBAR:  { width: 240,  height: 320, label: "Sidebar Portrait",      ratio: "3:4"   },
  // Square: panel renders as aspect-square (1:1)
  SQUARE_SIDEBAR:    { width: 250,  height: 250, label: "Square Sidebar",        ratio: "1:1"   },

  // ─── OTHER: generic fallback ──────────────────────────────────────────────
  HORIZONTAL_OTHER:  { width: 390,  height: 130, label: "Generic Banner",        ratio: "3:1"   },
  VERTICAL_OTHER:    { width: 240,  height: 320, label: "Generic Vertical",      ratio: "3:4"   },
  SQUARE_OTHER:      { width: 300,  height: 300, label: "Generic Square",        ratio: "1:1"   },
};

export function getBannerDimensions(
  orientation: EBannerOrientation | "",
  pagePosition: EBannerPagePosition | "",
): BannerDimensions | null {
  if (!orientation || !pagePosition) return null;
  const key = `${orientation}_${pagePosition}` as DimensionKey;
  return BANNER_DIMENSIONS[key] ?? null;
}
