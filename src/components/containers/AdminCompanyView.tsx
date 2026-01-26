"use client";

import { TAdminCompanyPage } from "@/types/company/company";
import { useEffect, useState } from "react";
import {
  Building2,
  ChevronDown,
  ChevronUp,
  MapPin,
  Phone,
  Mail,
  Globe,
  Calendar,
  Users,
  BookOpen,
  Award,
  Briefcase,
  MessageSquare,
  Shield,
  Hash,
  Trash2,
  CheckCircle2,
  XCircle,
  Loader2,
  Medal,
  FolderKanban,
  Image as ImageIcon,
  Eye,
  X,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { InfoCard } from "@/components/cards/InfoCard";
import { DocumentCard } from "@/components/cards/DocumentCard";
import { FounderCard } from "@/components/cards/FounderCard";
import { ContactPersonCard } from "@/components/cards/ContactPersonCard";
import { ServiceCard } from "@/components/cards/ServiceCard";
import RichTextView from "@/components/ui/rich-text-viewer";
import Image from "../ui/Image";
import { 
  updateCompanyVerificationStatus, 
  updateCompanyVerificationBadge 
} from "@/server/company/verification";
import { deleteCompany } from "@/server/company/company";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import queryClient from "@/lib/queryClient";
import { TProject } from "@/types/company/project";

interface CollapsibleSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  count?: number;
}

const CollapsibleSection = ({
  title,
  icon,
  children,
  defaultOpen = false,
  count,
}: CollapsibleSectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-yellow-100 rounded-lg">{icon}</div>
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          {count !== undefined && (
            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">
              {count}
            </span>
          )}
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>

      {isOpen && (
        <div className="p-6 pt-0 border-t border-gray-100">{children}</div>
      )}
    </div>
  );
};

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
  const [selectedProject, setSelectedProject] = useState<TProject | null>(null);

  useEffect(() => {
     console.log(selectedProject)
  } ,[selectedProject])

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

        {company.founders && company.founders.length > 0 && (
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
        )}

        {company.contactPersons && company.contactPersons.length > 0 && (
          <CollapsibleSection
            title="Contact Persons"
            icon={<Phone className="w-5 h-5 text-yellow-600" />}
            count={company.contactPersons.length}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {company.contactPersons.map((contact) => (
                <ContactPersonCard key={contact.id} contact={contact} />
              ))}
            </div>
          </CollapsibleSection>
        )}

        {company.services && company.services.length > 0 && (
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
        )}

        {company.legal?.legalDocuments &&
          company.legal.legalDocuments.length > 0 && (
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
          )}

        {company.projects && company.projects.length > 0 && (
          <CollapsibleSection
            title="Projects & Portfolio"
            icon={<FolderKanban className="w-5 h-5 text-yellow-600" />}
            count={company.projects.length}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {company.projects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-semibold text-gray-900 text-lg">
                      {project.title}
                    </h4>
                    {project.phase && (
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                        {project.phase}
                      </span>
                    )}
                  </div>

                  {project.clientName && (
                    <p className="text-sm text-gray-600 mb-3">
                      <span className="font-medium">Client:</span> {project.clientName}
                    </p>
                  )}

                  {project.description && (
                    <p className="text-sm text-gray-700 mb-4 line-clamp-3">
                      {project.description}
                    </p>
                  )}

                  {project.images && project.images.length > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <ImageIcon className="w-4 h-4 text-gray-500" />
                        <span className="text-xs text-gray-600 font-medium">
                          {project.images.length} {project.images.length === 1 ? 'Image' : 'Images'}
                        </span>
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        {project.images.slice(0, 4).map((img, index) => (
                          <div
                            key={index}
                            className="aspect-square rounded-lg overflow-hidden bg-gray-100"
                          >
                            <Image
                              src={img}
                              alt={`${project.title} - Image ${index + 1}`}
                              width={100}
                              height={100}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                      {project.images.length > 4 && (
                        <p className="text-xs text-gray-500 mt-2">
                          +{project.images.length - 4} more images
                        </p>
                      )}
                    </div>
                  )}

                  <button
                    onClick={() => setSelectedProject(project)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm font-medium"
                  >
                    <Eye className="w-4 h-4" />
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </CollapsibleSection>
        )}

        {/* Project Details Dialog */}
        {selectedProject && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              {/* Dialog Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedProject.title}
                  </h2>
                  <div className="flex items-center gap-3 flex-wrap">
                    {selectedProject.phase && (
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
                        {selectedProject.phase}
                      </span>
                    )}
                    {selectedProject.clientName && (
                      <span className="text-sm text-gray-600">
                        <span className="font-medium">Client:</span> {selectedProject.clientName}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Dialog Content */}
              <div className="p-6 space-y-6">
                {/* Description */}
                {selectedProject.description && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Description
                    </h3>
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {selectedProject.description}
                    </p>
                  </div>
                )}

                {/* Project Images */}
                {selectedProject.images && selectedProject.images.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <ImageIcon className="w-5 h-5 text-yellow-600" />
                      Project Images ({selectedProject.images.length})
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {selectedProject.images.map((img, index) => (
                        <div
                          key={index}
                          className="aspect-video rounded-lg overflow-hidden bg-gray-100 border border-gray-200"
                        >
                          <Image
                            src={img}
                            alt={`${selectedProject.title} - Image ${index + 1}`}
                            width={300}
                            height={200}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Project Documents */}
                {selectedProject.documents && selectedProject.documents.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-yellow-600" />
                      Project Documents ({selectedProject.documents.length})
                    </h3>
                    <div className="space-y-3">
                      {selectedProject.documents.map((doc) => (
                        <DocumentCard key={doc.id} document={doc} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Additional Project Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                  {selectedProject.createdAt && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Created Date</p>
                      <p className="text-sm text-gray-900">
                        {format(new Date(selectedProject.createdAt), "PPP")}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Dialog Footer */}
              <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6">
                <button
                  onClick={() => setSelectedProject(null)}
                  className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {company.catalogs && company.catalogs.length > 0 && (
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
        )}

        {company.specializations && company.specializations.length > 0 && (
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
        )}

        {company.reviews && company.reviews.length > 0 && (
          <CollapsibleSection
            title="Customer Reviews"
            icon={<MessageSquare className="w-5 h-5 text-yellow-600" />}
            count={company.reviews.length}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {company.reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm p-6"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900">
                      {review.name}
                    </h4>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={`text-lg ${
                            star <= review.rating
                              ? "text-yellow-500"
                              : "text-gray-300"
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{review.email}</p>
                  {review.review && (
                    <p className="text-sm text-gray-700 mt-3">
                      {review.review}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-3">
                    {format(new Date(review.createdAt), "PPP")}
                  </p>
                </div>
              ))}
            </div>
          </CollapsibleSection>
        )}
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
