import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Browse Construction Categories | Consnect",
  description:
    "Explore construction categories on Consnect — from civil engineering and architecture to MEP, interior design, landscaping, and more across Rwanda.",
  keywords: ["construction categories Rwanda", "civil engineering Rwanda", "architecture Rwanda", "MEP Rwanda", "construction services categories"],
  alternates: { canonical: "https://consnect.rw/categories" },
  openGraph: {
    title: "Browse Construction Categories | Consnect",
    description: "Find companies and services by construction category on Consnect.",
    url: "https://consnect.rw/categories",
    type: "website",
  },
};

export default function CategoriesPage () {
     return (
          <div className="p-12 my-8 max-w-7xl w-full mx-auto bg-gray-200 rounded-xl">
               <p className="text-lg font-bold text-gray-800">Under development</p>
          </div>
     )
}