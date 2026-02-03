"use client";

import { TAdminCompanyPage } from "@/types/company/company";
import { Shield } from "lucide-react";
import { format } from "date-fns";
import { DocumentCard } from "@/components/cards/DocumentCard";
import { CollapsibleSection } from "./CollapsibleSection";

export const LegalDocumentsSection = ({ company }: { company: TAdminCompanyPage }) => {
  if (!company.legal?.legalDocuments || company.legal.legalDocuments.length === 0) return null;

  return (
    <CollapsibleSection
      title="Legal Documents"
      icon={<Shield className="w-5 h-5 text-yellow-600" />}
      count={company.legal.legalDocuments.length}
    >
      <div className="mb-4 p-4 bg-gray-50 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-600">Legal Name</p>
            <p className="font-semibold text-gray-900">
              {company.legal.legalName}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Trade Name</p>
            <p className="font-semibold text-gray-900">
              {company.legal.tradeName}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Registration Number</p>
            <p className="font-semibold text-gray-900">
              {company.legal.registrationNumber}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">TIN</p>
            <p className="font-semibold text-gray-900">
              {company.legal.tin}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">
              Date of Incorporation
            </p>
            <p className="font-semibold text-gray-900">
              {format(
                new Date(company.legal.dateOfIncorporation),
                "PPP"
              )}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Legal Structure</p>
            <p className="font-semibold text-gray-900">
              {company.legal.structure}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {company.legal.legalDocuments.map((doc) => (
          <DocumentCard key={doc.id} document={doc} />
        ))}
      </div>
    </CollapsibleSection>
  );
};
