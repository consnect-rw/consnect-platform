"use client";

import { useState } from "react";
import Image from "@/components/ui/Image";
import { FileText, Eye, Download } from "lucide-react";
import { TProductCatalog } from "@/types/company/product-catalog";
import dynamic from "next/dynamic";

// Dynamically import PdfViewer to avoid SSR issues with PDF.js
const PdfViewer = dynamic(() => import("@/components/ui/PdfViewer").then(mod => ({ default: mod.PdfViewer })), {
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

interface CatalogCardProps {
  catalog: TProductCatalog;
}

export const CatalogCard = ({ catalog }: CatalogCardProps) => {
  const [showPdfViewer, setShowPdfViewer] = useState(false);

  const isPdf = catalog.fileUrl?.toLowerCase().endsWith(".pdf");
  console.log("CatalogCard Rendered:", catalog.name, "isPdf:", isPdf);

  return (
    <>
      {/* Card */}
      <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden hover:border-yellow-400 hover:shadow-lg transition-all group">
        {/* Catalog Image */}
        {catalog.image && (
          <div className="relative h-56 bg-gray-100 overflow-hidden">
            <Image
              src={catalog.image}
              alt={catalog.name}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
            
            {/* Floating Badge */}
            <div className="absolute top-4 right-4 px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-lg flex items-center gap-2 shadow-lg">
              <FileText className="w-4 h-4 text-yellow-400" />
              <span className="text-xs font-black text-gray-900 uppercase tracking-wide">
                Catalog
              </span>
            </div>
          </div>
        )}

        <div className="p-6">
          {/* Title */}
          <h3 className="font-black text-gray-900 text-xl mb-3 line-clamp-2">
            {catalog.name}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-700 leading-relaxed mb-5 line-clamp-3">
            {catalog.description}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            {isPdf && catalog.fileUrl && (
              <button
                onClick={() => setShowPdfViewer(true)}
                className="flex-1 min-w-30 px-4 py-2.5 bg-yellow-400 text-gray-900 font-bold rounded-lg hover:bg-yellow-300 transition-all flex items-center justify-center gap-2"
              >
                <Eye className="w-4 h-4" />
                View PDF
              </button>
            )}
            {catalog.fileUrl && (
              <a
                href={catalog.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                download
                className={`${
                  isPdf ? "flex-none" : "flex-1"
                } px-4 py-2.5 bg-gray-900 text-white font-bold rounded-lg hover:bg-gray-800 transition-all flex items-center justify-center gap-2`}
              >
                <Download className="w-4 h-4" />
                {isPdf ? "" : "Download"}
              </a>
            )}
          </div>
        </div>
      </div>

      {/* PDF Viewer Dialog */}
      {showPdfViewer && isPdf && catalog.fileUrl && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowPdfViewer(false)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-6xl h-[90vh] shadow-2xl flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <PdfViewer
              pdfUrl={catalog.fileUrl}
              title={catalog.name}
              onClose={() => setShowPdfViewer(false)}
            />
          </div>
        </div>
      )}
    </>
  );
};
