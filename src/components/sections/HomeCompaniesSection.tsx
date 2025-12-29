"use cache";

import { fetchCompanys } from "@/server/company/company";
import { SCompanyCard, TCompanyCard } from "@/types/company/company";
import { ECompanyStatus } from "@prisma/client";
import Link from "next/link";
import { Building2, ExternalLink } from "lucide-react";
import Image from "../ui/Image";


const CompanyCard = ({ company }: { company: TCompanyCard }) => {
  return (
    <Link
      href={`/company/${company.handle}`}
      prefetch
      className="
        group relative block
        rounded-2xl border border-gray-200
        bg-white
        p-6
        transition-all duration-300
        hover:border-yellow-400
        hover:shadow-xl
      "
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        {/* Logo */}
        <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
          {company.logoUrl ? (
            <Image
              src={company.logoUrl}
              alt={`${company.name} logo`}
              className="w-full h-full rounded-lg object-contain"
            />
          ) : (
            <Building2 className="w-7 h-7 text-gray-400" />
          )}
        </div>

        {/* Status */}
        <span className="
          inline-flex items-center gap-1.5
          text-xs font-semibold
          px-3 py-1 rounded-full
          bg-green-100 text-green-700
        ">
          ● Verified
        </span>
      </div>

      {/* Main Content */}
      <div className="mt-6 space-y-2">
        <h3 className="
          text-lg font-semibold text-gray-900
          leading-tight
          group-hover:text-yellow-600
          transition-colors
        ">
          {company.name}
        </h3>

        {company.slogan && (
          <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
            {company.slogan}
          </p>
        )}
      </div>

      {/* Footer Action */}
      <div className="mt-6 flex items-center justify-between">
        <span className="
          text-sm font-medium text-gray-700
          group-hover:text-gray-900
          transition-colors
        ">
          View company
        </span>

        <ExternalLink className="
          w-4 h-4 text-gray-400
          group-hover:text-gray-900
          group-hover:translate-x-1
          transition-all
        " />
      </div>

      {/* Accent Line */}
      <div className="
        absolute inset-x-0 bottom-0 h-0.5
        bg-gradient-to-r from-yellow-400 to-gray-300
        opacity-0 group-hover:opacity-100
        transition-opacity
      " />
    </Link>
  );
};



export async function HomeCompaniesSection() {
  const {data:companies} = await fetchCompanys(
    SCompanyCard,
    { verification: { status: ECompanyStatus.VERIFIED } },
    8
  );

  if (companies.length === 0) {
    return null; // Or a placeholder message
  }

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Featured Companies
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover trusted and verified industry leaders on our platform. Join them and showcase your business to thousands.
          </p>
          <div className="mt-6 inline-block px-6 py-2 bg-yellow-100 text-yellow-800 font-semibold rounded-full text-sm">
            Only verified companies are featured here
          </div>
        </div>

        {/* Companies Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {companies.map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>

        {/* Optional CTA at bottom */}
        <div className="text-center mt-16">
          <Link
            href="/companies"
            className="inline-flex items-center gap-3 px-8 py-4 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl"
          >
            Explore All Companies
            <ExternalLink className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}