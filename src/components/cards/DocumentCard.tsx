"use client";

import { updateDocument } from "@/server/common/document";
import { TDocument } from "@/types/common/document";
import { useState } from "react";
import { toast } from "sonner";
import { FileText, ExternalLink, CheckCircle, XCircle, Clock, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";

export const DocumentCard = ({ document }: { document: TDocument }) => {
  const [message, setMessage] = useState("");
  const [updating, setUpdating] = useState(false);
  const [showRejectInput, setShowRejectInput] = useState(false);

  const handleUpdate = async (verified: boolean) => {
    if (!verified && !message.trim()) {
      toast.error("Please provide a rejection message");
      return;
    }

    setUpdating(true);
    try {
      await updateDocument(document.id, {
        isVerified: verified,
        ...(message && { message }),
      });
      toast.success(
        verified
          ? "Document approved successfully"
          : "Document rejected successfully"
      );
      setShowRejectInput(false);
      setMessage("");
    } catch (error) {
      toast.error("Failed to update document");
    } finally {
      setUpdating(false);
    }
  };

  const handleReject = () => {
    if (showRejectInput) {
      handleUpdate(false);
    } else {
      setShowRejectInput(true);
    }
  };

  const getStatusBadge = () => {
    if (document.isVerified === null || document.isVerified === undefined) {
      return (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
          <Clock className="w-4 h-4" />
          Pending Review
        </div>
      );
    }
    if (document.isVerified) {
      return (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-medium">
          <CheckCircle className="w-4 h-4" />
          Verified
        </div>
      );
    }
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 bg-red-100 text-red-700 rounded-full text-sm font-medium">
        <XCircle className="w-4 h-4" />
        Rejected
      </div>
    );
  };

  const formatDocumentType = (type: string) => {
    return type
      .split("_")
      .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
      .join(" ");
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 p-6">
      {/* Header Section */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4 flex-1">
          {/* Document Icon */}
          <div className="p-3 bg-yellow-100 rounded-xl shrink-0">
            <FileText className="w-6 h-6 text-yellow-600" />
          </div>

          {/* Document Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 mb-1 wrap-break-word">
              {document.title}
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              Type: <span className="font-medium">{formatDocumentType(document.type)}</span>
            </p>
            {document.description && (
              <p className="text-sm text-gray-600 wrap-break-word">
                {document.description}
              </p>
            )}
          </div>
        </div>

        {/* Status Badge */}
        <div className="shrink-0 ml-4">{getStatusBadge()}</div>
      </div>

      {/* Rejection Message (if exists) */}
      {document.message && !document.isVerified && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-900 mb-1">
              Rejection Reason:
            </p>
            <p className="text-sm text-red-700">{document.message}</p>
          </div>
        </div>
      )}

      {/* Reject Input (when rejecting) */}
      {showRejectInput && (
        <div className="mb-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <label
            htmlFor={`reject-message-${document.id}`}
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Rejection Reason <span className="text-red-500">*</span>
          </label>
          <textarea
            id={`reject-message-${document.id}`}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Please provide a clear reason for rejection..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-sm resize-none"
            rows={3}
            disabled={updating}
          />
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
        {/* View Document Link */}
        <Link
          href={document.docUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          View Document
        </Link>

        {/* Approve/Reject Buttons (only if not verified) */}
        {document.isVerified !== true && (
          <>
            <button
              onClick={() => handleUpdate(true)}
              disabled={updating}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed rounded-lg transition-colors"
            >
              {updating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle className="w-4 h-4" />
              )}
              Approve
            </button>

            <button
              onClick={handleReject}
              disabled={updating}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed rounded-lg transition-colors"
            >
              {updating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <XCircle className="w-4 h-4" />
              )}
              {showRejectInput ? "Confirm Rejection" : "Reject"}
            </button>

            {/* Cancel button when showing reject input */}
            {showRejectInput && (
              <button
                onClick={() => {
                  setShowRejectInput(false);
                  setMessage("");
                }}
                disabled={updating}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                Cancel
              </button>
            )}
          </>
        )}

        {/* Already Verified Message */}
        {document.isVerified === true && (
          <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
            <CheckCircle className="w-4 h-4" />
            This document has been verified
          </div>
        )}
      </div>
    </div>
  );
};