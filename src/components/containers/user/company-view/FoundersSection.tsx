"use client";

import { TAdminCompanyPage } from "@/types/company/company";
import { Users } from "lucide-react";
import { FounderCard } from "@/components/cards/FounderCard";
import { CollapsibleSection } from "./CollapsibleSection";

export const FoundersSection = ({ company }: { company: TAdminCompanyPage }) => {
  if (!company.founders || company.founders.length === 0) return null;

  return (
    <CollapsibleSection
      title="Founders"
      icon={<Users className="w-5 h-5 text-yellow-600" />}
      count={company.founders.length}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {company.founders.map((founder) => (
          <FounderCard key={founder.id} founder={founder} />
        ))}
      </div>
    </CollapsibleSection>
  );
};
