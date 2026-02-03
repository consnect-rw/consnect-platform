"use client";

import { TAdminCompanyPage } from "@/types/company/company";
import { Award } from "lucide-react";
import { CollapsibleSection } from "./CollapsibleSection";

export const SpecializationsSection = ({ company }: { company: TAdminCompanyPage }) => {
  if (!company.specializations || company.specializations.length === 0) return null;

  return (
    <CollapsibleSection
      title="Specializations"
      icon={<Award className="w-5 h-5 text-yellow-600" />}
      count={company.specializations.length}
    >
      <div className="flex flex-wrap gap-3">
        {company.specializations.map((spec) => (
          <div
            key={spec.id}
            className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium"
          >
            {spec.name}
            {spec.category && (
              <span className="text-yellow-600 ml-1">
                ({spec.category.name})
              </span>
            )}
          </div>
        ))}
      </div>
    </CollapsibleSection>
  );
};
