import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Construction Tenders in Rwanda | Consnect",
  description:
    "Find and bid on construction tenders across Rwanda. Consnect connects contractors and suppliers with public and private sector construction opportunities.",
  keywords: ["construction tenders Rwanda", "tender opportunities Rwanda", "civil tenders Kigali", "public tenders Rwanda", "building tenders Rwanda"],
  alternates: { canonical: "https://consnect.rw/tender" },
  openGraph: {
    title: "Construction Tenders in Rwanda | Consnect",
    description: "Find construction tender opportunities across Rwanda on Consnect.",
    url: "https://consnect.rw/tender",
    type: "website",
  },
};

export default function TendersPage () {
     return (
          <div className="p-12 my-8 max-w-7xl w-full mx-auto bg-gray-200 rounded-xl">
               <p className="text-lg font-bold text-gray-800">Under development</p>
          </div>
     )
}