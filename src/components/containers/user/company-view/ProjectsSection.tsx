"use client";

import { TAdminCompanyPage } from "@/types/company/company";
import { TProject } from "@/types/company/project";
import { FolderKanban, Eye, X, Image as ImageIcon, FileText } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import Image from "@/components/ui/Image";
import { DocumentCard } from "@/components/cards/DocumentCard";
import { CollapsibleSection } from "./CollapsibleSection";

export const ProjectsSection = ({ company }: { company: TAdminCompanyPage }) => {
  const [selectedProject, setSelectedProject] = useState<TProject | null>(null);

  if (!company.projects || company.projects.length === 0) return null;

  return (
    <>
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
    </>
  );
};
