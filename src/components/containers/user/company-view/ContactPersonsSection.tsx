"use client";

import { TAdminCompanyPage } from "@/types/company/company";
import { Phone } from "lucide-react";
import { AdminContactPersonCard } from "./AdminContactPersonCard";
import { CollapsibleSection } from "./CollapsibleSection";

export const ContactPersonsSection = ({ company }: { company: TAdminCompanyPage }) => {
  if (!company.contactPersons || company.contactPersons.length === 0) return null;

  return (
    <CollapsibleSection
      title="Company Staff"
      icon={<Phone className="w-5 h-5 text-yellow-600" />}
      count={company.contactPersons.length}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {company.contactPersons.map((contact) => (
          <AdminContactPersonCard key={contact.id} contact={contact} />
        ))}
      </div>
    </CollapsibleSection>
  );
};
