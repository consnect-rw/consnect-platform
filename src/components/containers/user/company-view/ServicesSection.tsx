"use client";

import { TAdminCompanyPage } from "@/types/company/company";
import { Briefcase } from "lucide-react";
import { ServiceCard } from "@/components/cards/ServiceCard";
import { CollapsibleSection } from "./CollapsibleSection";

export const ServicesSection = ({ company }: { company: TAdminCompanyPage }) => {
  if (!company.services || company.services.length === 0) return null;

  return (
    <CollapsibleSection
      title="Services & Certifications"
      icon={<Briefcase className="w-5 h-5 text-yellow-600" />}
      count={company.services.length}
    >
      <div className="grid grid-cols-1 gap-4">
        {company.services.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
    </CollapsibleSection>
  );
};
