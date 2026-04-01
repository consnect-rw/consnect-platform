"use client";

import { useState, useEffect, useMemo } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Download,
  Loader2,
  FileText,
  X,
  AlertCircle,
} from "lucide-react";

// Configure PDF.js worker - Use local worker file from public directory
if (typeof window !== 'undefined') {
  try {
    pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
  } catch (error) {
    console.error("Failed to set PDF worker:", error);
  }
}

interface PdfViewerProps {

  pdfUrl: string;
  title?: string;
  onClose?: () => void;
}

export const PdfViewer = ({
  pdfUrl,
  title = "PDF Document",
  onClose,
}: PdfViewerProps) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Memoize options to prevent unnecessary reloads
  const pdfOptions = useMemo(() => ({
    cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
    cMapPacked: true,
    standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/standard_fonts/`,
  }), []);

  useEffect(() => {
    // Reset state when pdfUrl changes
    setNumPages(0);
    setPageNumber(1);
    setIsLoading(true);
    setError(null);
  }, [pdfUrl]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    console.log("PDF loaded successfully. Pages:", numPages);
    setNumPages(numPages);
    setIsLoading(false);
    setError(null);
  };

  const onDocumentLoadError = (error: Error) => {
    console.error("Error loading PDF:", error);
    setIsLoading(false);
    
    // Provide user-friendly error messages
    let errorMessage = "Failed to load PDF document";
    
    if (error.message.includes("CORS")) {
      errorMessage = "CORS Error: PDF file cannot be accessed due to security restrictions";
    } else if (error.message.includes("404") || error.message.includes("Not Found")) {
      errorMessage = "PDF file not found (404)";
    } else if (error.message.includes("403") || error.message.includes("Forbidden")) {
      errorMessage = "Access denied to PDF file (403)";
    } else if (error.message.includes("network") || error.message.includes("fetch")) {
      errorMessage = "Network error: Unable to fetch PDF file";
    } else if (error.message.includes("Invalid PDF")) {
      errorMessage = "Invalid PDF file format";
    }
    
    setError(errorMessage);
  };

  const goToPrevPage = () => {
    setPageNumber((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setPageNumber((prev) => Math.min(prev + 1, numPages));
  };

  const zoomIn = () => {
    setScale((prev) => Math.min(prev + 0.2, 2.5));
  };

  const zoomOut = () => {
    setScale((prev) => Math.max(prev - 0.2, 0.5));
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = title + ".pdf";
    link.click();
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b-2 border-gray-200 px-6 py-4 flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5 text-gray-900" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-black text-gray-900 truncate">{title}</h2>
            {!isLoading && numPages > 0 && (
              <p className="text-sm text-gray-500 font-medium">
                {numPages} {numPages === 1 ? "page" : "pages"}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleDownload}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold rounded-lg transition-all flex items-center gap-2"
            title="Download PDF"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Download</span>
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors"
              title="Close"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white border-b-2 border-gray-200 px-6 py-3 flex items-center justify-between gap-4 shrink-0">
        {/* Page Navigation */}
        <div className="flex items-center gap-2">
          <button 
            type="button"
            onClick={goToPrevPage}
            disabled={pageNumber <= 1}
            className="w-9 h-9 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:cursor-not-allowed rounded-lg flex items-center justify-center transition-all"
            title="Previous page"
          >
            <ChevronLeft className="w-5 h-5 text-gray-900" />
          </button>
          <div className="px-4 py-2 bg-gray-50 rounded-lg border-2 border-gray-200 min-w-30 text-center">
            <span className="text-sm font-bold text-gray-900">
              Page {pageNumber} of {numPages || "..."}
            </span>
          </div>
          <button 
            type="button"
            onClick={goToNextPage}
            disabled={pageNumber >= numPages}
            className="w-9 h-9 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:cursor-not-allowed rounded-lg flex items-center justify-center transition-all"
            title="Next page"
          >
            <ChevronRight className="w-5 h-5 text-gray-900" />
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={zoomOut}
            disabled={scale <= 0.5}
            className="w-9 h-9 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:cursor-not-allowed rounded-lg flex items-center justify-center transition-all"
            title="Zoom out"
          >
            <ZoomOut className="w-5 h-5 text-gray-900" />
          </button>
          <div className="px-4 py-2 bg-gray-50 rounded-lg border-2 border-gray-200 min-w-20 text-center">
            <span className="text-sm font-bold text-gray-900">
              {Math.round(scale * 100)}%
            </span>
          </div>
          <button
            type="button"
            onClick={zoomIn}
            disabled={scale >= 2.5}
            className="w-9 h-9 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:cursor-not-allowed rounded-lg flex items-center justify-center transition-all"
            title="Zoom in"
          >
            <ZoomIn className="w-5 h-5 text-gray-900" />
          </button>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="flex-1 overflow-auto p-6 flex justify-center">
        <div className="inline-block">
          <Document
            file={pdfUrl}
            options={pdfOptions}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={
              <div className="flex flex-col items-center justify-center gap-4 py-16">
                <Loader2 className="w-12 h-12 text-yellow-400 animate-spin" />
                <p className="text-gray-600 font-medium">Loading PDF...</p>
                <p className="text-xs text-gray-500 max-w-md text-center">
                  This may take a moment for larger files
                </p>
              </div>
            }
            error={
              <div className="flex flex-col items-center justify-center gap-4 py-16 px-6 text-center max-w-lg">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-8 h-8 text-red-600" />
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900 mb-2">
                    Failed to load PDF
                  </p>
                  <p className="text-gray-600 mb-4">
                    {error || "The PDF file could not be loaded. This might be due to:"}
                  </p>
                  {!error && (
                    <ul className="text-sm text-gray-600 text-left space-y-2 mb-4">
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 shrink-0">•</span>
                        <span>Network connectivity issues</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 shrink-0">•</span>
                        <span>File access restrictions (CORS)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 shrink-0">•</span>
                        <span>Invalid or corrupted PDF file</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 shrink-0">•</span>
                        <span>File no longer available</span>
                      </li>
                    </ul>
                  )}
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleDownload}
                    className="px-6 py-3 bg-yellow-400 text-gray-900 font-bold rounded-lg hover:bg-yellow-300 transition-all flex items-center gap-2"
                  >
                    <Download className="w-5 h-5" />
                    Download PDF
                  </button>
                  <a
                    href={pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-gray-900 text-white font-bold rounded-lg hover:bg-gray-800 transition-all flex items-center gap-2"
                  >
                    <FileText className="w-5 h-5" />
                    Open in New Tab
                  </a>
                </div>
                <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200 w-full">
                  <p className="text-xs text-gray-500">
                    <span className="font-semibold">Debug Info:</span> {pdfUrl.substring(0, 100)}...
                  </p>
                </div>
              </div>
            }
          >
            {numPages > 0 && (
              <Page
                pageNumber={pageNumber}
                scale={scale}
                className="shadow-lg"
                renderTextLayer={true}
                renderAnnotationLayer={true}
                loading={
                  <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
                    <Loader2 className="w-8 h-8 text-yellow-400 animate-spin" />
                  </div>
                }
              />
            )}
          </Document>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t-2 border-gray-200 px-6 py-3 shrink-0">
        <p className="text-xs text-gray-500 text-center">
          Use zoom controls to adjust view • Navigate with arrow buttons
        </p>
      </div>
    </div>
  );
};
