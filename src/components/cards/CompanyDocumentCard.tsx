"use client";

import queryClient from "@/lib/queryClient";
import { deleteDocument } from "@/server/common/document";
import { TDocument } from "@/types/common/document";
import { deleteSingleImage } from "@/util/s3Helpers";
import { Award, Download, Eye, FileText, MoreVertical, Shield, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import dynamic from "next/dynamic";

// Dynamically import PdfViewer to avoid SSR issues with PDF.js
const PdfViewer = dynamic(() => import("../ui/PdfViewer").then(mod => ({ default: mod.PdfViewer })), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 font-medium">Loading PDF Viewer...</p>
      </div>
    </div>
  ),
});

interface DocumentCardProps {
  document: TDocument;
}

export const CompanyDocumentCard = ({ 
  document, 
}: DocumentCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [showPdfViewer, setShowPdfViewer] = useState(false);

  const isPdf = document.docUrl?.toLowerCase().endsWith(".pdf");

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
    <>
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
            {isPdf ? (
              <button
                onClick={() => setShowPdfViewer(true)}
                className="flex-1 group/btn relative overflow-hidden px-4 py-3 bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-xl font-bold transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl hover:scale-105 transform"
              >
                <Eye className="w-4 h-4" strokeWidth={2.5} />
                <span>View</span>
              </button>
            ) : (
              <a
                href={document.docUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 group/btn relative overflow-hidden px-4 py-3 bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-xl font-bold transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl hover:scale-105 transform"
              >
                <Eye className="w-4 h-4" strokeWidth={2.5} />
                <span>View</span>
              </a>
            )}

            {/* Download Button */}
            <a
               href={document.docUrl}
               download
              className="px-4 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-bold transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 transform"
              title="Download"
            >
              <Download className="w-5 h-5" strokeWidth={2.5} />
            </a>
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

    {/* PDF Viewer Dialog */}
    {showPdfViewer && isPdf && (
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={() => setShowPdfViewer(false)}
      >
        <div
          className="bg-white rounded-2xl w-full max-w-6xl h-[90vh] shadow-2xl flex flex-col overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <PdfViewer
            pdfUrl={document.docUrl}
            title={document.title}
            onClose={() => setShowPdfViewer(false)}
          />
        </div>
      </div>
    )}
    </>
  );
};