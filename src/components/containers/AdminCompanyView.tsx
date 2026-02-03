"use client";

import { TAdminCompanyPage } from "@/types/company/company";
import { useState } from "react";
import {
  Building2,
  Hash,
  Trash2,
  CheckCircle2,
  XCircle,
  Loader2,
  Medal,
} from "lucide-react";
import { format } from "date-fns";
import Image from "../ui/Image";
import { 
  updateCompanyVerificationStatus, 
  updateCompanyVerificationBadge 
} from "@/server/company/verification";
import { deleteCompany } from "@/server/company/company";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import queryClient from "@/lib/queryClient";

// Import all section components
import {
  BasicInformationSection,
  DescriptionsSection,
  FoundersSection,
  ContactPersonsSection,
  ServicesSection,
  LegalDocumentsSection,
  ProjectsSection,
  CatalogsSection,
  SpecializationsSection,
  ReviewsSection,
} from "./user/company-view";

export const AdminCompanyView = ({
  company,
}: {
  company: TAdminCompanyPage;
}) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isUpdatingBadge, setIsUpdatingBadge] = useState<string | null>(null);
  const [verificationMessage, setVerificationMessage] = useState(
    company.verification?.message || ""
  );
  const [showMessageInput, setShowMessageInput] = useState(false);

  const getDescription = (title: string) => {
    return company.descriptions?.find((desc) => desc.title === title);
  };

  const missionDesc = getDescription("Mission");
  const visionDesc = getDescription("Vision");
  const bioDesc = getDescription("About") || getDescription("Summary") || getDescription("Overview");
  const detailedDesc = getDescription("Detailed");

  const getVerificationBadge = () => {
    if (!company.verification) {
      return (
        <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
          No Verification
        </span>
      );
    }

    const statusColors = {
      PENDING: "bg-yellow-100 text-yellow-700",
      VERIFIED: "bg-green-100 text-green-700",
      REJECTED: "bg-red-100 text-red-700",
    };

    return (
      <span
        className={`px-4 py-2 rounded-full text-sm font-medium ${
          statusColors[company.verification.status as keyof typeof statusColors]
        }`}
      >
        {company.verification.status}
      </span>
    );
  };

  const handleDeleteCompany = async () => {
    if (!confirm(`Are you sure you want to delete ${company.name}? This action cannot be undone.`)) {
      return;
    }

    setIsDeleting(true);
    try {
     if(!confirm("Are you sure you want to delete this company? This action cannot be undone.")) return;
      const result = await deleteCompany(company.id);
      if (result) {
          queryClient.invalidateQueries();
        toast.success("Company deleted successfully");
        router.push("/admin/companies");
      } else {
        toast.error("Failed to delete company");
      }
    } catch (error) {
      console.error("Error deleting company:", error);
      toast.error("An error occurred while deleting the company");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleVerificationStatus = async (status: "PENDING" | "VERIFIED" | "REJECTED") => {
    setIsUpdatingStatus(true);
    try {
      const result = await updateCompanyVerificationStatus(
        company.id,
        status,
        verificationMessage
      );
      if (result.success) {
          queryClient.invalidateQueries();
        toast.success(`Company verification status updated to ${status}`);
        setShowMessageInput(false);
        router.refresh();
      } else {
        toast.error("Failed to update verification status");
      }
    } catch (error) {
      console.error("Error updating verification status:", error);
      toast.error("An error occurred while updating verification");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleBadgeToggle = async (badgeType: "bronze" | "silver" | "gold") => {
    const currentValue = 
      badgeType === "bronze" ? company.verification?.isBronzeVerified :
      badgeType === "silver" ? company.verification?.isSilverVerified :
      company.verification?.isGoldVerified;

    setIsUpdatingBadge(badgeType);
    try {
      const result = await updateCompanyVerificationBadge(
        company.id,
        badgeType,
        !currentValue
      );
      if (result.success) {
          queryClient.invalidateQueries();
        toast.success(`${badgeType.charAt(0).toUpperCase() + badgeType.slice(1)} badge ${!currentValue ? "awarded" : "removed"}`);
        router.refresh();
      } else {
        toast.error("Failed to update badge");
      }
    } catch (error) {
      console.error("Error updating badge:", error);
      toast.error("An error occurred while updating badge");
    } finally {
      setIsUpdatingBadge(null);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50/50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="shrink-0">
              {company.logoUrl ? (
                <Image
                  src={company.logoUrl}
                  alt={company.name}
                  width={120}
                  height={120}
                  className="w-30 h-30 rounded-2xl object-cover border-2 border-yellow-200"
                />
              ) : (
                <div className="w-30 h-30 bg-yellow-100 rounded-2xl flex items-center justify-center">
                  <Building2 className="w-16 h-16 text-yellow-600" />
                </div>
              )}
            </div>

            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
                    {company.name}
                  </h1>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Hash className="w-4 h-4" />
                    <span className="text-sm">@{company.handle}</span>
                  </div>
                </div>
                {getVerificationBadge()}
              </div>

              {company.slogan && (
                <p className="text-lg text-gray-600 italic mb-4">
                  &quot;{company.slogan}&quot;
                </p>
              )}

              {company.verification?.message && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700">
                    <span className="font-semibold">Admin Note:</span>{" "}
                    {company.verification.message}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* All Sections */}
        <BasicInformationSection company={company} />
        <DescriptionsSection company={company} />
        <FoundersSection company={company} />
        <ContactPersonsSection company={company} />
        <ServicesSection company={company} />
        <LegalDocumentsSection company={company} />
        <ProjectsSection company={company} />
        <CatalogsSection company={company} />
        <SpecializationsSection company={company} />
        <ReviewsSection company={company} />
      </div>

      {/* Action Bar */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-4 md:p-6 my-4">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Admin Actions</h3>
          
          {/* Verification Message Input */}
          {showMessageInput && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Verification Message (for company)
              </label>
              <textarea
                value={verificationMessage}
                onChange={(e) => setVerificationMessage(e.target.value)}
                placeholder="Enter a message explaining verification status or requirements..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm"
              />
            </div>
          )}

          {/* Mobile Layout - Stacked Sections */}
          <div className="space-y-4">
            {/* Delete Button */}
            <div className="w-full">
              <button
                onClick={handleDeleteCompany}
                disabled={isDeleting}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {isDeleting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                {isDeleting ? "Deleting..." : "Delete Company"}
              </button>
            </div>

            {/* Primary Verification Section */}
            <div className="border-t pt-4 md:border-t-0 md:pt-0">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Verification Status</h4>
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() => setShowMessageInput(!showMessageInput)}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                >
                  {showMessageInput ? "Hide Message" : "Add Message"}
                </button>
                
                <button
                  onClick={() => handleVerificationStatus("VERIFIED")}
                  disabled={isUpdatingStatus}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  {isUpdatingStatus ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                  Verify
                </button>

                <button
                  onClick={() => handleVerificationStatus("REJECTED")}
                  disabled={isUpdatingStatus}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  {isUpdatingStatus ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <XCircle className="w-4 h-4" />
                  )}
                  Reject
                </button>

                <button
                  onClick={() => handleVerificationStatus("PENDING")}
                  disabled={isUpdatingStatus}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  Set Pending
                </button>
              </div>
            </div>

            {/* Badge Section */}
            <div className="border-t pt-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Award Badges</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {/* Bronze Badge */}
                <button
                  onClick={() => handleBadgeToggle("bronze")}
                  disabled={isUpdatingBadge === "bronze"}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium ${
                    company.verification?.isBronzeVerified
                      ? "bg-orange-600 text-white hover:bg-orange-700"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                  title="Bronze: RDB/TIN uploaded"
                >
                  {isUpdatingBadge === "bronze" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Medal className="w-4 h-4" />
                  )}
                  <span>Bronze</span>
                  {company.verification?.isBronzeVerified && (
                    <span className="ml-1">✓</span>
                  )}
                </button>

                {/* Silver Badge */}
                <button
                  onClick={() => handleBadgeToggle("silver")}
                  disabled={isUpdatingBadge === "silver"}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium ${
                    company.verification?.isSilverVerified
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                  title="Silver: Professional License & Portfolio"
                >
                  {isUpdatingBadge === "silver" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Medal className="w-4 h-4" />
                  )}
                  <span>Silver</span>
                  {company.verification?.isSilverVerified && (
                    <span className="ml-1">✓</span>
                  )}
                </button>

                {/* Gold Badge */}
                <button
                  onClick={() => handleBadgeToggle("gold")}
                  disabled={isUpdatingBadge === "gold"}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium ${
                    company.verification?.isGoldVerified
                      ? "bg-yellow-600 text-white hover:bg-yellow-700"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                  title="Gold: Insurance, Financials & CRB Reports"
                >
                  {isUpdatingBadge === "gold" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Medal className="w-4 h-4" />
                  )}
                  <span>Gold</span>
                  {company.verification?.isGoldVerified && (
                    <span className="ml-1">✓</span>
                  )}
                </button>
              </div>
            </div>

            {/* Current Badge Status Display */}
            <div className="border-t pt-4">
              <p className="text-sm font-semibold text-gray-700 mb-2">
                Current Badge Status
              </p>
              <div className="flex flex-wrap gap-2 text-sm">
                <span className={`px-3 py-1.5 rounded-full font-medium ${
                  company.verification?.isBronzeVerified
                    ? "bg-orange-100 text-orange-700"
                    : "bg-gray-100 text-gray-500"
                }`}>
                  🥉 Bronze {company.verification?.isBronzeVerified ? "✓" : "✗"}
                </span>
                <span className={`px-3 py-1.5 rounded-full font-medium ${
                  company.verification?.isSilverVerified
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-500"
                }`}>
                  🥈 Silver {company.verification?.isSilverVerified ? "✓" : "✗"}
                </span>
                <span className={`px-3 py-1.5 rounded-full font-medium ${
                  company.verification?.isGoldVerified
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-gray-100 text-gray-500"
                }`}>
                  🥇 Gold {company.verification?.isGoldVerified ? "✓" : "✗"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
