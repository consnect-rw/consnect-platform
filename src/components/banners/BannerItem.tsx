"use client";

import { TBanner } from "@/types/banners/banner";
import Image from "@/components/ui/Image";
import Link from "next/link";

// Resolves internal vs external URLs
const BannerLink = ({
  url,
  children,
  className,
}: {
  url: string;
  children: React.ReactNode;
  className?: string;
}) => {
  const isInternal = url.startsWith("/") || url.startsWith(process.env.NEXT_PUBLIC_APP_URL ?? "https://consnect.rw");
  const href = isInternal ? url.replace(/^https?:\/\/[^/]+/, "") : url;

  if (isInternal) {
    return <Link href={href} className={className}>{children}</Link>;
  }
  return (
    <a href={href} target="_blank" rel="noreferrer sponsored" className={className}>
      {children}
    </a>
  );
};

interface BannerItemProps {
  banner: TBanner;
  className?: string;
  /** Use "contain" for strip banners (top/bottom) to avoid stretching wide images */
  objectFit?: "cover" | "contain";
}

export const BannerItem = ({ banner, className = "", objectFit = "cover" }: BannerItemProps) => {
  const plan = banner.plan;

  return (
    <BannerLink
      url={banner.destinationUrl}
      className={`group relative block overflow-hidden rounded-2xl bg-gray-950 ${className}`}
    >
      {/* Shimmer overlay on hover */}
      <div className="absolute inset-0 bg-linear-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none rounded-2xl" />

      {banner.imageUrl ? (
        <Image
          src={banner.imageUrl}
          alt={banner.title}
          width={plan?.width ?? 800}
          height={plan?.height ?? 200}
          className={`w-full h-full transition-transform duration-500 group-hover:scale-105 ${objectFit === "contain" ? "object-contain" : "object-cover"}`}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400 text-sm font-medium min-h-20">
          {banner.title}
        </div>
      )}

      {/* Subtle bottom gradient for branding */}
      <div className="absolute bottom-0 inset-x-0 h-8 bg-linear-to-t from-black/20 to-transparent pointer-events-none rounded-b-2xl" />
    </BannerLink>
  );
};
