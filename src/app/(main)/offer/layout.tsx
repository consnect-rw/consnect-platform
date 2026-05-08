import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Construction Work Packages & Opportunities | Consnect",
  description:
    "Browse construction work packages, subcontracting opportunities, and business offers posted by verified companies across Rwanda. Find your next construction project on Consnect.",
  keywords: [
    "construction offers Rwanda",
    "subcontracting Rwanda",
    "construction work packages Rwanda",
    "construction projects Kigali",
    "construction opportunities Rwanda",
    "civil work Rwanda",
    "construction contracts Rwanda",
  ],
  alternates: { canonical: "https://consnect.rw/offer" },
  openGraph: {
    title: "Construction Work Packages & Opportunities | Consnect",
    description:
      "Find subcontracting work, construction projects, and business opportunities across Rwanda.",
    url: "https://consnect.rw/offer",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Construction Opportunities in Rwanda | Consnect",
    description: "Browse construction work packages and opportunities on Consnect.",
  },
};

export default function OfferLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
