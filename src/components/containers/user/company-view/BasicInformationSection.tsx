"use client";

import { TAdminCompanyPage } from "@/types/company/company";
import { Building2, Phone, Mail, Globe, Calendar, Users, MapPin } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { InfoCard } from "@/components/cards/InfoCard";
import { CollapsibleSection } from "./CollapsibleSection";

export const BasicInformationSection = ({ company }: { company: TAdminCompanyPage }) => {
  return (
    <CollapsibleSection
      title="Basic Information"
      icon={<Building2 className="w-5 h-5 text-yellow-600" />}
      defaultOpen={true}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <InfoCard
          icon={<Phone className="w-5 h-5 text-yellow-600" />}
          label="Phone"
          value={company.phone}
        />
        <InfoCard
          icon={<Mail className="w-5 h-5 text-yellow-600" />}
          label="Email"
          value={company.email}
        />
        <InfoCard
          icon={<Globe className="w-5 h-5 text-yellow-600" />}
          label="Website"
          value={company.website}
        />
        <InfoCard
          icon={<Calendar className="w-5 h-5 text-yellow-600" />}
          label="Founded Year"
          value={company.foundedYear}
        />
        <InfoCard
          icon={<Users className="w-5 h-5 text-yellow-600" />}
          label="Company Size"
          value={`${company.companySize} employees`}
        />
        <InfoCard
          icon={<Calendar className="w-5 h-5 text-yellow-600" />}
          label="Joined Platform"
          value={format(new Date(company.createdAt), "PPP")}
        />
      </div>

      {company.location && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-yellow-600 mt-1" />
            <div>
              <p className="font-semibold text-gray-900 mb-1">Location</p>
              <p className="text-sm text-gray-700">
                {[
                  company.location.address,
                  company.location.city,
                  company.location.state,
                  company.location.zipCode,
                  company.location.country,
                ]
                  .filter(Boolean)
                  .join(", ")}
              </p>
            </div>
          </div>
        </div>
      )}

      {company.socialMedia && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <p className="font-semibold text-gray-900 mb-3">Social Media</p>
          <div className="flex flex-wrap gap-3">
            {company.socialMedia.facebook && (
              <Link
                href={company.socialMedia.facebook}
                target="_blank"
                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors"
              >
                Facebook
              </Link>
            )}
            {company.socialMedia.twitter && (
              <Link
                href={company.socialMedia.twitter}
                target="_blank"
                className="px-4 py-2 bg-sky-100 text-sky-700 rounded-lg text-sm font-medium hover:bg-sky-200 transition-colors"
              >
                Twitter
              </Link>
            )}
            {company.socialMedia.linkedin && (
              <Link
                href={company.socialMedia.linkedin}
                target="_blank"
                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors"
              >
                LinkedIn
              </Link>
            )}
            {company.socialMedia.instagram && (
              <Link
                href={company.socialMedia.instagram}
                target="_blank"
                className="px-4 py-2 bg-pink-100 text-pink-700 rounded-lg text-sm font-medium hover:bg-pink-200 transition-colors"
              >
                Instagram
              </Link>
            )}
            {company.socialMedia.youtube && (
              <Link
                href={company.socialMedia.youtube}
                target="_blank"
                className="px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
              >
                YouTube
              </Link>
            )}
          </div>
        </div>
      )}
    </CollapsibleSection>
  );
};
