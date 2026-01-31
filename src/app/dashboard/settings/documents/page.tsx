"use client";

import CompanyRequiredNotice from "@/components/containers/user/CompanyRequireNotice";
import { DocumentFormToggleBtn } from "@/components/forms/common/DocumentForm";
import { useAuth } from "@/hooks/useAuth";
import queryClient from "@/lib/queryClient";
import { deleteDocument, fetchDocuments } from "@/server/common/document";
import { SDocument, TDocument } from "@/types/common/document";
import { deleteSingleImage } from "@/util/s3Helpers";
import { EDocumentType } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { Award, Download, Edit2, ExternalLink, Eye, FileText, MoreVertical, Plus, Shield, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export default function CompanyDocumentsForm () {
     const {user} = useAuth();
     const perPage = 20;
     const [page,setPage] = useState(1);
     const {data: documentsData, isLoading} = useQuery({
          queryKey: ["company-documents", user?.company?.id ],
          queryFn: () => user?.company ? fetchDocuments(SDocument, {company:{id: user.company.id}}, perPage, (page-1)*perPage) :null
     });
     const documents = documentsData?.data ?? [];
     const totalDocuments = documentsData?.pagination.total ?? 0;

     if (!user?.company) {
               return (
                    <CompanyRequiredNotice message="Please first create your company to add company documents"/>
               );
          }
     return (
          <div className="w-full flex flex-col gap-4 bg-gray-50 rounded-xl p-4">
               <div className="w-full flex flex-wrap gap-4 items-center justify-between">
                    <span className="text-lg font-bold text-gray-800">{totalDocuments} Documents</span>
                    <div className="w-auto flex items-center gap-2">
                      <DocumentFormToggleBtn title="New License" 
                        className="py-2 px-4 text-lg font-medium text-white bg-linear-to-br from-yellow-600 to-amber-800 rounded-lg flex items-center gap-2"
                        companyId={user.company.id}
                        icon={<Plus className="w-4 h-4" />}
                        name="License"
                        documentType={EDocumentType.LICENSE}
                        modelType="COMPANY"
                      />
                      <DocumentFormToggleBtn title="New Certification" 
                        className="py-2 px-4 text-lg font-medium text-white bg-linear-to-br from-yellow-600 to-amber-800 rounded-lg flex items-center gap-2"
                        companyId={user.company.id}
                        icon={<Plus className="w-4 h-4" />}
                        name="Certificate"
                        documentType={EDocumentType.CERTIFICATION}
                        modelType="COMPANY"
                      />
                    </div>
                    
               </div>
                {documents.length === 0 ? <p className="text-lg font-medium text-gray-600">Documents found!</p> :

                <div className="w-full grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6 gap-4">
                  {
                    documents.map(doc => <DocumentCard key={doc.id} document={doc} />)
                  }
                </div>
              }
          </div>
     )
}

interface DocumentCardProps {
  document: TDocument;
}

const DocumentCard = ({ 
  document, 
}: DocumentCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const getDocumentIcon = () => {
    switch (document.type) {
      case "CERTIFICATION":
        return <Award className="w-8 h-8" strokeWidth={2} />;
      case "LICENSE":
        return <Shield className="w-8 h-8" strokeWidth={2} />;
      default:
        return <FileText className="w-8 h-8" strokeWidth={2} />;
    }
  };

  const getDocumentColor = () => {
    switch (document.type) {
      case "CERTIFICATION":
        return {
          badge: "bg-yellow-400 text-gray-900",
          icon: "text-yellow-400",
          gradient: "from-yellow-400/20 to-yellow-500/20",
          border: "border-yellow-400/30",
          glow: "shadow-yellow-400/50",
        };
      case "LICENSE":
        return {
          badge: "bg-gray-700 text-yellow-400",
          icon: "text-gray-400",
          gradient: "from-gray-400/20 to-gray-500/20",
          border: "border-gray-400/30",
          glow: "shadow-gray-400/50",
        };
      default:
        return {
          badge: "bg-gray-600 text-white",
          icon: "text-gray-400",
          gradient: "from-gray-400/20 to-gray-500/20",
          border: "border-gray-400/30",
          glow: "shadow-gray-400/50",
        };
    }
  };

  const colors = getDocumentColor();

  const handleDelete = async () => {
    try {
      
    } catch (error) {
      console.log(error);
      return toast.error("Application error. please contact support!");
    }
    if (confirm(`Are you sure you want to delete "${document.title}"?`)) {
      const res = await deleteDocument(document.id);
      if(!res) return toast.error("Error deleting document!");
      await deleteSingleImage(document.docUrl);
      queryClient.invalidateQueries();
      return toast.success("Document deleted successfully");
    }
  };

  return (
    <div
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowActions(false);
      }}
    >
      {/* Main Card */}
      <div
        className={`
          relative overflow-hidden
          bg-linear-to-br from-white to-gray-50
          border-2 ${colors.border}
          rounded-2xl
          transition-all duration-300 ease-out
          ${isHovered ? `shadow-2xl ${colors.glow} scale-[1.02] -translate-y-1` : "shadow-lg"}
        `}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
              backgroundSize: "24px 24px",
            }}
          ></div>
        </div>

        {/* Gradient Overlay */}
        <div
          className={`absolute top-0 right-0 w-64 h-64 bg-linear-to-bl ${colors.gradient} rounded-full blur-3xl z-0 transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-50"
          }`}
        ></div>

        {/* Content */}
        <div className="relative z-10 p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            {/* Icon and Badge */}
            <div className="flex items-center space-x-4">
              <div
                className={`
                  relative p-3 rounded-xl
                  bg-linear-to-br from-gray-100 to-gray-200
                  border-2 ${colors.border}
                  ${colors.icon}
                  transition-transform duration-300
                  ${isHovered ? "scale-110 rotate-6" : ""}
                `}
              >
                {getDocumentIcon()}
              </div>
              
              <div>
                <span
                  className={`
                    inline-block px-3 py-1 rounded-full
                    text-xs font-black uppercase tracking-wider
                    ${colors.badge}
                    shadow-md
                  `}
                >
                  {document.type}
                </span>
              </div>
            </div>

            {/* Actions Menu */}
            <div className="relative">
              <button
                onClick={() => setShowActions(!showActions)}
                className={`
                  p-2 rounded-lg
                  transition-all duration-200
                  ${showActions ? "bg-gray-200 text-gray-900" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}
                `}
              >
                <MoreVertical className="w-5 h-5" />
              </button>

              {/* Dropdown Actions */}
              {showActions && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border-2 border-gray-200 overflow-hidden z-50 animate-slide-down">
                  <button
                    onClick={handleDelete}
                    className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-red-50 transition-colors text-left group/item border-t border-gray-100"
                  >
                    <Trash2 className="w-4 h-4 text-gray-600 group-hover/item:text-red-600" />
                    <span className="font-semibold text-gray-700 group-hover/item:text-red-700">
                      Delete
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Document Info */}
          <div className="mb-6">
            <h3 className="text-xl font-black text-gray-900 mb-2 line-clamp-2 leading-tight">
              {document.title}
            </h3>
            {document.description && (
              <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed font-medium">
                {document.description}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            {/* View Button */}
            <Link
               href={document.docUrl}
               target="_blank"
              className="flex-1 group/btn relative overflow-hidden px-4 py-3 bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-xl font-bold transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl hover:scale-105 transform"
            >
              <Eye className="w-4 h-4" strokeWidth={2.5} />
              <span>View</span>
              <ExternalLink className="w-3 h-3 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
            </Link>

            {/* Download Button */}
            <Link
               href={document.docUrl}
               download={true}
              className="px-4 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-bold transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 transform"
              title="Download"
            >
              <Download className="w-5 h-5" strokeWidth={2.5} />
            </Link>
          </div>
        </div>

        {/* Animated Border on Hover */}
        <div
          className={`
            absolute inset-0 rounded-2xl
            transition-opacity duration-300
            ${isHovered ? "opacity-100" : "opacity-0"}
            pointer-events-none
          `}
          style={{
            background: `linear-gradient(45deg, transparent 48%, ${
              document.type === "CERTIFICATION" ? "#facc15" : "#4b5563"
            } 50%, transparent 52%)`,
            backgroundSize: "20px 20px",
            animation: isHovered ? "borderMove 1s linear infinite" : "none",
          }}
        ></div>
      </div>

      {/* Global Styles */}
      <style jsx>{`
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes borderMove {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 20px 20px;
          }
        }

        .animate-slide-down {
          animation: slide-down 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};