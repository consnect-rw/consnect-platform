"use client";

import Image from "@/components/ui/Image";
import Link from "next/link";
import { Building2, MapPin, FileText, ArrowRight, Shield } from "lucide-react";
import { TProductCatalogCard } from "@/types/company/product-catalog";
import { PdfViewerButton } from "@/components/buttons/PdfViewerButton";
import { Badge } from "@/components/ui/badge";

interface PublicCatalogCardProps {
  catalog: TProductCatalogCard;
}

export const PublicCatalogCard = ({ catalog }: PublicCatalogCardProps) => {
  const company = catalog.company;
  const isPdf = catalog.fileUrl?.toLowerCase().endsWith(".pdf");

  const verificationBadge = () => {
    const v = company?.verification;
    if (!v) return null;
    if (v.isGoldVerified) return <Badge className="bg-yellow-400 text-gray-900 hover:bg-yellow-400 text-[9px] font-bold px-1 py-0">GOLD</Badge>;
    if (v.isSilverVerified) return <Badge className="bg-gray-300 text-gray-900 hover:bg-gray-300 text-[9px] font-bold px-1 py-0">SILVER</Badge>;
    if (v.isBronzeVerified) return <Badge className="bg-orange-200 text-orange-900 hover:bg-orange-200 text-[9px] font-bold px-1 py-0">BRONZE</Badge>;
    if (v.status === "VERIFIED") return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 text-[9px] font-bold px-1 py-0">VERIFIED</Badge>;
    return null;
  };

  return (
    <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden hover:border-yellow-400 hover:shadow-lg transition-all group flex flex-col">
      {/* Image */}
      <div className="relative h-48 bg-gray-100 overflow-hidden shrink-0">
        {catalog.image ? (
          <Image
            src={catalog.image}
            alt={catalog.name}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-50">
            <FileText className="w-12 h-12 text-gray-300" />
          </div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />

        {/* Catalog badge */}
        <div className="absolute top-3 right-3 px-2 py-1 bg-white/95 backdrop-blur-sm rounded-md flex items-center gap-1 shadow">
          <FileText className="w-3 h-3 text-yellow-500" />
          <span className="text-[10px] font-black text-gray-900 uppercase tracking-wide">Catalog</span>
        </div>

        {/* Title overlay on image bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <h3 className="font-black text-white text-sm sm:text-base leading-tight line-clamp-2 drop-shadow-md">
            {catalog.name}
          </h3>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        {/* Description */}
        {catalog.description && (
          <p className="text-xs text-gray-600 leading-relaxed line-clamp-2 mb-3">
            {catalog.description}
          </p>
        )}

        {/* Company strip */}
        {company && (
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-md border border-gray-200 bg-gray-50 flex items-center justify-center shrink-0 overflow-hidden">
              {company.logoUrl ? (
                <Image src={company.logoUrl} alt={company.name} className="object-cover w-full h-full" />
              ) : (
                <Building2 size={14} className="text-gray-400" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1 flex-wrap">
                <span className="text-xs font-bold text-gray-900 truncate">{company.name}</span>
                {verificationBadge()}
              </div>
              {company.location && (
                <span className="text-[10px] text-gray-500 flex items-center gap-0.5 truncate">
                  <MapPin size={9} className="shrink-0" />
                  {[company.location.city, company.location.country].filter(Boolean).join(", ")}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* CTAs */}
        <div className="flex items-center gap-2 mt-auto pt-3 border-t border-gray-100">
          {isPdf && catalog.fileUrl ? (
            <PdfViewerButton
              fileUrl={catalog.fileUrl}
              title={catalog.name}
              btnLabel="View"
              size="sm"
              variant="primary"
              className="flex-1 justify-center"
            />
          ) : catalog.fileUrl ? (
            <a
              href={catalog.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-1 px-2.5 py-1.5 text-xs font-bold bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-lg transition-all"
            >
              <FileText size={13} />
              Open File
            </a>
          ) : null}
          <Link
            href={`/catalogs/${catalog.id}`}
            className="flex-1 inline-flex items-center justify-center gap-1 px-2.5 py-1.5 text-xs font-bold border border-gray-300 hover:border-yellow-400 hover:bg-yellow-50 text-gray-700 rounded-lg transition-all"
          >
            Details
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  );
};
