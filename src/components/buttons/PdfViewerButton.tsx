"use client";

import { useState, type ElementType } from "react";
import { FileText, X } from "lucide-react";
import dynamic from "next/dynamic";

const PdfViewer = dynamic(
  () => import("@/components/ui/PdfViewer").then((mod) => ({ default: mod.PdfViewer })),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-600 font-medium text-sm">Loading viewer...</p>
        </div>
      </div>
    ),
  }
);

interface PdfViewerButtonProps {
  fileUrl: string;
  title?: string;
  btnLabel?: string;
  btnIcon?: ElementType;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "outline" | "ghost";
  className?: string;
}

const SIZE_CLS = {
  sm: "px-2.5 py-1.5 text-xs gap-1",
  md: "px-4 py-2.5 text-sm gap-2",
  lg: "px-5 py-3 text-base gap-2",
} as const;

const ICON_SIZE = { sm: 13, md: 16, lg: 18 } as const;

const VARIANT_CLS = {
  primary: "bg-yellow-400 hover:bg-yellow-500 text-gray-900",
  outline: "border border-gray-300 hover:border-yellow-400 hover:bg-yellow-50 text-gray-700",
  ghost: "hover:bg-gray-100 text-gray-700",
} as const;

export const PdfViewerButton = ({
  fileUrl,
  title = "PDF Document",
  btnLabel = "View PDF",
  btnIcon: BtnIcon = FileText,
  size = "sm",
  variant = "primary",
  className = "",
}: PdfViewerButtonProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`inline-flex items-center font-bold rounded-lg transition-all ${SIZE_CLS[size]} ${VARIANT_CLS[variant]} ${className}`}
      >
        <BtnIcon size={ICON_SIZE[size]} />
        {btnLabel}
      </button>

      {/* Right drawer */}
      {open && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)} />

          {/* Drawer panel — slides in from right */}
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-4xl bg-white shadow-2xl flex flex-col animate-slide-in-right">
            <PdfViewer pdfUrl={fileUrl} title={title} onClose={() => setOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
};
