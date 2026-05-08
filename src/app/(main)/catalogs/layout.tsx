import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Construction Product Catalogs & Services | Consnect",
  description:
    "Browse product catalogs, materials, equipment, and services from verified construction companies across Rwanda. Find suppliers and contractors on Consnect.",
  keywords: [
    "construction catalogs Rwanda",
    "building materials Rwanda",
    "construction equipment Rwanda",
    "construction supplies Kigali",
    "construction services Rwanda",
    "product catalogs Rwanda",
  ],
  alternates: { canonical: "https://consnect.rw/catalogs" },
  openGraph: {
    title: "Construction Product Catalogs & Services | Consnect",
    description: "Browse construction products, materials, and services from verified Rwandan companies.",
    url: "https://consnect.rw/catalogs",
    type: "website",
  },
};

export default function CatalogsLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
