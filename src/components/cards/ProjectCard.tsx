"use client";

import { useState } from "react";
import Image from "@/components/ui/Image";
import { 
  Calendar, 
  MapPin, 
  User, 
  Mail, 
  Phone, 
  FileText,
  X,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { TProjectDetailed } from "@/types/company/project";

interface ProjectCardProps {
  project: TProjectDetailed;
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
  const [showDialog, setShowDialog] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const hasImages = project.images && project.images.length > 0;

  const nextImage = () => {
    if (project.images && currentImageIndex < project.images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case "COMPLETED":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "EXECUTION":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPhaseLabel = (phase: string) => {
    switch (phase) {
      case "COMPLETED":
        return "Completed";
      case "EXECUTION":
        return "In Progress";
      default:
        return phase;
    }
  };

  return (
    <>
      {/* Card */}
      <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden hover:border-yellow-400 hover:shadow-lg transition-all group">
        {/* Project Image */}
        {hasImages && (
          <div className="relative h-48 bg-gray-100 overflow-hidden">
            <Image
              src={project.images[0]}
              alt={project.title}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
            />
            {project.images.length > 1 && (
              <div className="absolute top-3 right-3 px-3 py-1 bg-black/70 text-white text-xs font-bold rounded-full">
                +{project.images.length - 1} more
              </div>
            )}
          </div>
        )}
        
        <div className="p-6">
          <div className="flex items-start justify-between gap-3 mb-3">
            <h3 className="font-black text-gray-900 text-lg flex-1">
              {project.title}
            </h3>
            <span className={`px-3 py-1 text-xs font-bold rounded-full border-2 shrink-0 ${getPhaseColor(project.phase)}`}>
              {getPhaseLabel(project.phase)}
            </span>
          </div>

          {project.clientName && (
            <div className="flex items-center gap-2 text-sm text-gray-600 font-medium mb-3">
              <User className="w-4 h-4 text-gray-400" />
              <span>Client: {project.clientName}</span>
            </div>
          )}

          <p className="text-sm text-gray-700 leading-relaxed mb-4 line-clamp-3">
            {project.description}
          </p>

          <button
            onClick={() => setShowDialog(true)}
            className="w-full px-4 py-2 bg-yellow-400 text-gray-900 font-bold rounded-lg hover:bg-yellow-300 transition-all text-sm"
          >
            View Details
          </button>
        </div>
      </div>

      {/* Dialog */}
      {showDialog && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowDialog(false)}
        >
          <div 
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Dialog Header */}
            <div className="sticky top-0 bg-white border-b-2 border-gray-200 p-6 flex items-start justify-between gap-4 z-10">
              <div className="flex-1">
                <h2 className="text-2xl font-black text-gray-900 mb-2">
                  {project.title}
                </h2>
                <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full border-2 ${getPhaseColor(project.phase)}`}>
                  {getPhaseLabel(project.phase)}
                </span>
              </div>
              <button
                onClick={() => setShowDialog(false)}
                className="shrink-0 w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Dialog Content */}
            <div className="p-6 space-y-6">
              {/* Image Gallery */}
              {hasImages && (
                <div className="space-y-4">
                  <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-yellow-400" />
                    Project Gallery
                  </h3>
                  <div className="relative bg-gray-100 rounded-xl overflow-hidden">
                    <div className="relative h-96">
                      <Image
                        src={project.images[currentImageIndex]}
                        alt={`${project.title} - Image ${currentImageIndex + 1}`}
                        className="object-contain w-full h-full"
                      />
                    </div>
                    
                    {project.images.length > 1 && (
                      <>
                        {/* Navigation Buttons */}
                        {currentImageIndex > 0 && (
                          <button
                            onClick={prevImage}
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all"
                          >
                            <ChevronLeft className="w-6 h-6 text-gray-900" />
                          </button>
                        )}
                        {currentImageIndex < project.images.length - 1 && (
                          <button
                            onClick={nextImage}
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all"
                          >
                            <ChevronRight className="w-6 h-6 text-gray-900" />
                          </button>
                        )}
                        
                        {/* Image Counter */}
                        <div className="absolute bottom-4 right-4 px-4 py-2 bg-black/70 text-white text-sm font-bold rounded-lg">
                          {currentImageIndex + 1} / {project.images.length}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Thumbnail Strip */}
                  {project.images.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {project.images.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentImageIndex(idx)}
                          className={`shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                            idx === currentImageIndex
                              ? "border-yellow-400 ring-2 ring-yellow-400 ring-offset-2"
                              : "border-gray-200 hover:border-yellow-400"
                          }`}
                        >
                          <Image
                            src={img}
                            alt={`Thumbnail ${idx + 1}`}
                            className="object-cover w-full h-full"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Project Description */}
              <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
                <h3 className="text-lg font-black text-gray-900 mb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-yellow-400" />
                  About This Project
                </h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {project.description}
                </p>
              </div>

              {/* Project Details Grid */}
              <div className="grid md:grid-cols-2 gap-4">
                {/* Client Information */}
                <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
                  <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-yellow-400" />
                    Client Information
                  </h3>
                  <div className="space-y-3 text-sm">
                    {project.clientName && (
                      <div className="flex items-start gap-3">
                        <User className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs text-gray-500 font-medium">Name</p>
                          <p className="text-gray-900 font-bold">{project.clientName}</p>
                        </div>
                      </div>
                    )}
                    {project.clientEmail && (
                      <div className="flex items-start gap-3">
                        <Mail className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs text-gray-500 font-medium">Email</p>
                          <a
                            href={`mailto:${project.clientEmail}`}
                            className="text-gray-900 font-bold hover:text-yellow-600 transition-colors break-all"
                          >
                            {project.clientEmail}
                          </a>
                        </div>
                      </div>
                    )}
                    {project.clientPhone && (
                      <div className="flex items-start gap-3">
                        <Phone className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs text-gray-500 font-medium">Phone</p>
                          <a
                            href={`tel:${project.clientPhone}`}
                            className="text-gray-900 font-bold hover:text-yellow-600 transition-colors"
                          >
                            {project.clientPhone}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Timeline & Location */}
                <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
                  <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-yellow-400" />
                    Timeline & Location
                  </h3>
                  <div className="space-y-3 text-sm">
                    {project.initiatedOn && (
                      <div className="flex items-start gap-3">
                        <Calendar className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs text-gray-500 font-medium">Started</p>
                          <p className="text-gray-900 font-bold">
                            {new Date(project.initiatedOn).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                    )}
                    {project.completedOn && (
                      <div className="flex items-start gap-3">
                        <Calendar className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs text-gray-500 font-medium">Completed</p>
                          <p className="text-gray-900 font-bold">
                            {new Date(project.completedOn).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                    )}
                    {project.location && (
                      <div className="flex items-start gap-3">
                        <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs text-gray-500 font-medium">Location</p>
                          <p className="text-gray-900 font-bold">
                            {[project.location.city, project.location.state, project.location.country]
                              .filter(Boolean)
                              .join(", ")}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Documents */}
              {project.documents && project.documents.length > 0 && (
                <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
                  <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-yellow-400" />
                    Project Documents
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {project.documents.map((doc, idx) => (
                      <a
                        key={idx}
                        href={doc.docUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-yellow-50 border-2 border-gray-200 hover:border-yellow-400 rounded-lg transition-all"
                      >
                        <FileText className="w-5 h-5 text-gray-400" />
                        <span className="text-sm font-bold text-gray-900 flex-1 truncate">
                          {doc.title}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Dialog Footer */}
            <div className="sticky bottom-0 bg-gray-50 border-t-2 border-gray-200 p-6 flex justify-end">
              <button
                onClick={() => setShowDialog(false)}
                className="px-6 py-3 bg-gray-900 text-white font-bold rounded-lg hover:bg-gray-800 transition-all"
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
