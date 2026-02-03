"use client";

import { TAdminCompanyPage } from "@/types/company/company";
import { BookOpen } from "lucide-react";
import Link from "next/link";
import Image from "@/components/ui/Image";
import { CollapsibleSection } from "./CollapsibleSection";

export const CatalogsSection = ({ company }: { company: TAdminCompanyPage }) => {
  if (!company.catalogs || company.catalogs.length === 0) return null;

  return (
    <CollapsibleSection
      title="Product Catalogs"
      icon={<BookOpen className="w-5 h-5 text-yellow-600" />}
      count={company.catalogs.length}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {company.catalogs.map((catalog) => (
          <div
            key={catalog.id}
            className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 hover:shadow-md transition-shadow"
          >
            {catalog.image && (
              <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 mb-3">
                <Image
                  src={catalog.image}
                  alt={catalog.name}
                  width={300}
                  height={200}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <h4 className="font-semibold text-gray-900 mb-2">
              {catalog.name}
            </h4>
            
            {catalog.description && (
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {catalog.description}
              </p>
            )}
            
            {catalog.fileUrl && (
              <Link
                href={catalog.fileUrl}
                target="_blank"
                className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm font-medium w-full justify-center"
              >
                <BookOpen className="w-4 h-4" />
                View Catalog
              </Link>
            )}
          </div>
        ))}
      </div>
    </CollapsibleSection>
  );
};
