"use client";

import React, { useState } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import {
  FileText,
  Shield,
  ChevronDown,
  ChevronUp,
  Calendar,
  Mail,
  X,
  ScrollText,
} from "lucide-react";
import TermsOfUse from "@/lib/data/terms-of-use";

interface TermsOfUseViewProps {
  open: boolean;
  onClose: () => void;
  onAccept?: () => void;
  showAcceptBtn?: boolean;
}

export const TermsOfUseView = ({
  open,
  onClose,
  onAccept,
  showAcceptBtn = false,
}: TermsOfUseViewProps) => {
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({});
  const [scrolledToBottom, setScrolledToBottom] = useState(false);

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop - clientHeight < 40) {
      setScrolledToBottom(true);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
        <DialogPanel className="bg-white rounded-2xl shadow-2xl w-[95vw] lg:w-[65%] max-h-[90vh] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-linear-to-r from-amber-500 via-orange-500 to-amber-600 px-6 py-5 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <ScrollText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Terms of Use</h2>
                <p className="text-white/80 text-xs">
                  {TermsOfUse.siteName} &bull; {TermsOfUse.domain}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Meta Bar */}
          <div className="px-6 py-3 bg-amber-50 border-b border-amber-100 flex flex-wrap items-center gap-4 text-xs text-amber-800 shrink-0">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              Effective: {TermsOfUse.effectiveDate}
            </span>
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" />
              {TermsOfUse.contactEmail}
            </span>
            <span className="flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              {TermsOfUse.sections.length} sections
            </span>
          </div>

          {/* Scrollable Content */}
          <div
            className="flex-1 overflow-y-auto px-6 py-5 space-y-3"
            onScroll={handleScroll}
          >
            {/* Introduction banner */}
            <div className="bg-linear-to-r from-gray-50 to-amber-50/50 border border-gray-200 rounded-xl p-4 mb-4">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                <p className="text-sm text-gray-700 leading-relaxed">
                  Please read these terms carefully before using the{" "}
                  <span className="font-semibold text-gray-900">
                    {TermsOfUse.siteName}
                  </span>{" "}
                  platform. By creating an account, you acknowledge that you
                  have read and agree to be bound by these Terms of Use.
                </p>
              </div>
            </div>

            {/* Sections */}
            {TermsOfUse.sections.map((section, index) => (
              <div
                key={section.id}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden transition-all hover:border-amber-200 hover:shadow-sm"
              >
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-gray-50/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3 flex-1 text-left">
                    <div className="shrink-0 w-8 h-8 bg-linear-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center text-white font-bold text-xs">
                      {String(index + 1).padStart(2, "0")}
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900">
                      {section.title}
                    </h3>
                  </div>
                  {expandedSections[section.id] ? (
                    <ChevronUp className="w-4 h-4 text-gray-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                  )}
                </button>

                {expandedSections[section.id] && (
                  <div className="px-4 pb-4 pt-1 border-t border-gray-100">
                    <ul className="space-y-2.5 pl-11">
                      {section.content.map((item, idx) => (
                        <li
                          key={idx}
                          className="flex gap-2.5 text-gray-600 text-sm leading-relaxed"
                        >
                          <span className="shrink-0 w-1.5 h-1.5 mt-2 rounded-full bg-amber-500" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Footer Actions */}
          {showAcceptBtn && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between gap-3 shrink-0">
              <p className="text-xs text-gray-500 hidden sm:block">
                {scrolledToBottom
                  ? "You have reviewed all terms"
                  : "Scroll through all sections to continue"}
              </p>
              <div className="flex items-center gap-3 ml-auto">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    if (onAccept) onAccept();
                    onClose();
                  }}
                  className="px-5 py-2 text-sm font-semibold text-white bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  I Accept the Terms
                </button>
              </div>
            </div>
          )}
        </DialogPanel>
      </div>
    </Dialog>
  );
};

/** Standalone trigger button that opens the TermsOfUseView dialog */
export const TermsOfUseViewButton = ({
  onAccept,
  accepted = false,
}: {
  onAccept?: () => void;
  accepted?: boolean;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`inline-flex items-center gap-1 text-sm font-medium underline underline-offset-2 decoration-dotted transition-colors cursor-pointer ${
          accepted
            ? "text-green-600 hover:text-green-700 decoration-green-400"
            : "text-amber-600 hover:text-amber-700 decoration-amber-400"
        }`}
      >
        <ScrollText className="w-3.5 h-3.5" />
        Terms of Use
      </button>
      <TermsOfUseView
        open={open}
        onClose={() => setOpen(false)}
        onAccept={onAccept}
        showAcceptBtn={!!onAccept}
      />
    </>
  );
};

export default TermsOfUseView;
