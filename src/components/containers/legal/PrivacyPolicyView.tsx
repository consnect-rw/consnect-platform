"use client";

import React, { useState } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import {
  Shield,
  Lock,
  Eye,
  Database,
  Users,
  Globe,
  Cookie,
  Mail,
  Calendar,
  ChevronRight,
  X,
  ShieldCheck,
} from "lucide-react";
import PrivacyPolicy from "@/lib/data/privacy-policy";

const iconMap: Record<string, React.ElementType> = {
  information_we_collect: Database,
  how_we_use_information: Users,
  how_we_share_information: Globe,
  data_retention: Calendar,
  data_security: Lock,
  your_rights: Shield,
  cookies: Cookie,
  international_transfers: Globe,
  children: Users,
  changes_to_policy: Calendar,
  contact: Mail,
};

interface PrivacyPolicyViewProps {
  open: boolean;
  onClose: () => void;
  onAccept?: () => void;
  showAcceptBtn?: boolean;
}

export const PrivacyPolicyView = ({
  open,
  onClose,
  onAccept,
  showAcceptBtn = false,
}: PrivacyPolicyViewProps) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [scrolledToBottom, setScrolledToBottom] = useState(false);

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
          <div className="bg-linear-to-r from-gray-800 via-gray-900 to-gray-800 px-6 py-5 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-500/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">
                  Privacy Policy
                </h2>
                <p className="text-gray-400 text-xs">
                  {PrivacyPolicy.siteName} &bull; {PrivacyPolicy.domain}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Meta Bar */}
          <div className="px-6 py-3 bg-gray-50 border-b border-gray-200 flex flex-wrap items-center gap-4 text-xs text-gray-600 shrink-0">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-600" />
              Effective: {PrivacyPolicy.effectiveDate}
            </span>
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-amber-600" />
              {PrivacyPolicy.contactEmail}
            </span>
            <span className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-amber-600" />
              {PrivacyPolicy.sections.length} topics
            </span>
          </div>

          {/* Scrollable Content */}
          <div
            className="flex-1 overflow-y-auto px-6 py-5 space-y-4"
            onScroll={handleScroll}
          >
            {/* Overview */}
            <div className="bg-linear-to-r from-gray-50 to-amber-50/50 border border-gray-200 rounded-xl p-4 mb-2">
              <div className="flex items-start gap-3">
                <Eye className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                <div className="space-y-1.5">
                  {PrivacyPolicy.overview.map((text, idx) => (
                    <p
                      key={idx}
                      className="text-sm text-gray-700 leading-relaxed"
                    >
                      {text}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            {/* Sections */}
            {PrivacyPolicy.sections.map((section) => {
              const IconComponent = iconMap[section.id] || Shield;
              const isExpanded = expandedSection === section.id;

              return (
                <div
                  key={section.id}
                  className={`bg-white border rounded-xl overflow-hidden transition-all ${
                    isExpanded
                      ? "border-amber-300 shadow-sm"
                      : "border-gray-200 hover:border-amber-200"
                  }`}
                >
                  <button
                    onClick={() =>
                      setExpandedSection(isExpanded ? null : section.id)
                    }
                    className="w-full px-4 py-3.5 flex items-center gap-3 hover:bg-gray-50/50 transition-colors cursor-pointer"
                  >
                    <div className="shrink-0 w-9 h-9 bg-linear-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center shadow-sm">
                      <IconComponent className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900 flex-1 text-left">
                      {section.title}
                    </h3>
                    <ChevronRight
                      className={`w-4 h-4 text-gray-400 transition-transform shrink-0 ${
                        isExpanded ? "rotate-90" : ""
                      }`}
                    />
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-4 pt-1 border-t border-gray-100 space-y-3">
                      {/* Main content */}
                      <div className="pl-12 space-y-2">
                        {section.content.map((text, idx) => (
                          <p
                            key={idx}
                            className="text-sm text-gray-600 leading-relaxed"
                          >
                            {text}
                          </p>
                        ))}
                      </div>

                      {/* Sub sections */}
                      {section.subSections && (
                        <div className="pl-12 space-y-3 mt-3">
                          {section.subSections.map((sub) => (
                            <div
                              key={sub.id}
                              className="bg-amber-50/70 rounded-lg p-3.5 border border-amber-100"
                            >
                              <h4 className="font-semibold text-gray-900 text-sm mb-2 flex items-center gap-1.5">
                                <ChevronRight className="w-3.5 h-3.5 text-amber-600" />
                                {sub.title}
                              </h4>
                              <ul className="space-y-1.5 ml-5">
                                {sub.details.map((detail, idx) => (
                                  <li
                                    key={idx}
                                    className="text-gray-600 text-sm flex gap-2"
                                  >
                                    <span className="shrink-0 w-1.5 h-1.5 mt-2 rounded-full bg-amber-500" />
                                    <span>{detail}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Footer Actions */}
          {showAcceptBtn && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between gap-3 shrink-0">
              <p className="text-xs text-gray-500 hidden sm:block">
                {scrolledToBottom
                  ? "You have reviewed the privacy policy"
                  : "Review the privacy policy to continue"}
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
                  className="px-5 py-2 text-sm font-semibold text-white bg-gray-900 hover:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer"
                >
                  I Understand &amp; Accept
                </button>
              </div>
            </div>
          )}
        </DialogPanel>
      </div>
    </Dialog>
  );
};

/** Standalone trigger button that opens the PrivacyPolicyView dialog */
export const PrivacyPolicyViewButton = ({
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
        <ShieldCheck className="w-3.5 h-3.5" />
        Privacy Policy
      </button>
      <PrivacyPolicyView
        open={open}
        onClose={() => setOpen(false)}
        onAccept={onAccept}
        showAcceptBtn={!!onAccept}
      />
    </>
  );
};

export default PrivacyPolicyView;
