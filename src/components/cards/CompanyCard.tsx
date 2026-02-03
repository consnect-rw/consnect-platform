import { ArrowRight, Building2, Globe } from "lucide-react";
import Image from "../ui/Image";
import { TCompanyCard } from "@/types/company/company";
import Link from "next/link";
import { CompanyVerificationBadge } from "../ui/badges/CompanyVerificationBadge";
import { ConsnectBadge } from "../ui/badges/ConsnectBadge";

export const CompanyCard = ({ company }: { company: TCompanyCard }) => {
  const overview = company.descriptions?.[0]?.description || "";
  const hasLogo = company.logoUrl && company.logoUrl.trim() !== "";
  
  // Determine which badge to show (priority: Gold > Silver > Bronze > Verified)
  const isVerified = company.verification?.status === "VERIFIED";
  const hasGoldBadge = company.verification?.isGoldVerified;
  const hasSilverBadge = company.verification?.isSilverVerified;
  const hasBronzeBadge = company.verification?.isBronzeVerified;
  
  const showConsnectBadge = hasGoldBadge || hasSilverBadge || hasBronzeBadge;
  const badgeLevel = hasGoldBadge ? "gold" : hasSilverBadge ? "silver" : "bronze";

  return (
    <Link
      href={`/company/${company.handle}`}
      className="group relative block bg-white border-2 border-gray-200 hover:border-yellow-400 transition-all duration-300 hover:shadow-xl overflow-hidden"
    >
      {/* Consnect Badge (Bronze/Silver/Gold) - Top Right of Card */}
      {showConsnectBadge && (
        <div className="absolute top-2 right-2 z-10">
          <ConsnectBadge level={badgeLevel} size="md" showLabel={false} />
        </div>
      )}

      <div className="p-6">
        {/* Logo and Name */}
        <div className="flex items-start gap-4 mb-4">
          {/* Logo Container with Verification Badge */}
          <div className="relative shrink-0">
            <div className="w-16 h-16 bg-linear-to-br from-gray-100 to-gray-200 border-2 border-gray-200 group-hover:border-yellow-400 transition-colors overflow-hidden">
              {hasLogo ? (
                <Image
                  src={company.logoUrl!}
                  alt={`${company.name} logo`}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Building2 className="w-8 h-8 text-gray-400" strokeWidth={2} />
                </div>
              )}
            </div>
            
            {/* Verification Badge - Bottom Right, Outside Logo Container */}
            {isVerified && (
              <div className="absolute -bottom-2 -right-2">
                <CompanyVerificationBadge size="sm" showLabel={false} />
              </div>
            )}
          </div>

          {/* Company Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-black text-gray-900 group-hover:text-gray-700 transition-colors line-clamp-1">
              {company.name}
            </h3>
            <p className="text-sm text-gray-500 font-medium">@{company.handle}</p>
          </div>
        </div>

        {/* Slogan */}
        {company.slogan && (
          <p className="text-sm font-bold text-gray-700 mb-3 line-clamp-2 leading-relaxed">
            {company.slogan}
          </p>
        )}

        {/* Description */}
        {overview && (
          <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 mb-4">
            {overview}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          {/* Website */}
          {company.website && (
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <Globe className="w-3.5 h-3.5" />
              <span className="font-medium truncate max-w-37.5">
                {company.website.replace(/^https?:\/\/(www\.)?/, "")}
              </span>
            </div>
          )}

          {/* View Profile */}
          <div className="flex items-center gap-1 text-xs font-bold text-gray-700 group-hover:text-yellow-600 transition-colors">
            <span>View Profile</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
};