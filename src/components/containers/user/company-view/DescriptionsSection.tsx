"use client";

import { TAdminCompanyPage } from "@/types/company/company";
import { BookOpen } from "lucide-react";
import RichTextView from "@/components/ui/rich-text-viewer";
import { CollapsibleSection } from "./CollapsibleSection";

export const DescriptionsSection = ({ company }: { company: TAdminCompanyPage }) => {
  const getDescription = (title: string) => {
    return company.descriptions?.find((desc) => desc.title === title);
  };

  const missionDesc = getDescription("Mission");
  const visionDesc = getDescription("Vision");
  const bioDesc = getDescription("About") || getDescription("Summary") || getDescription("Overview");
  const detailedDesc = getDescription("Detailed");

  return (
    <CollapsibleSection
      title="Company Descriptions"
      icon={<BookOpen className="w-5 h-5 text-yellow-600" />}
      defaultOpen={true}
    >
      <div className="space-y-6">
        {missionDesc && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Mission
            </h3>
            <p className="text-gray-700">{missionDesc.description}</p>
          </div>
        )}

        {visionDesc && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Vision
            </h3>
            <p className="text-gray-700">{visionDesc.description}</p>
          </div>
        )}

        {bioDesc && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {bioDesc.title}
            </h3>
            <p className="text-gray-700">{bioDesc.description}</p>
          </div>
        )}

        {detailedDesc && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Detailed Description
            </h3>
            <RichTextView content={detailedDesc.description} />
          </div>
        )}
      </div>
    </CollapsibleSection>
  );
};
