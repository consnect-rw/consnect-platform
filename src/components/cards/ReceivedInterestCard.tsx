"use client";

import { useState } from "react";
import { TReceivedOfferInterest } from "@/types/offer/offer-interest";
import { updateOfferInterest } from "@/server/offer/offer-interest";
import { ReceivedOfferInterestViewButton } from "@/components/containers/user/offer/OfferInterestView";
import { toast } from "sonner";
import queryClient from "@/lib/queryClient";
import {
  Building2, CheckCircle2, XCircle, Clock, Eye, EyeOff,
  Calendar, FileText, Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from "../ui/Image";

interface ReceivedInterestCardProps {
  interest: TReceivedOfferInterest;
}

const STATUS_CFG = {
  PENDING:  { label: "Pending",   icon: Clock,        cls: "bg-amber-50 text-amber-800 border-amber-200" },
  ACCEPTED: { label: "Accepted",  icon: CheckCircle2, cls: "bg-green-50 text-green-800 border-green-200" },
  REJECTED: { label: "Declined",  icon: XCircle,      cls: "bg-red-50 text-red-800 border-red-200" },
};

export const ReceivedInterestCard = ({ interest }: ReceivedInterestCardProps) => {
  const [updating, setUpdating] = useState(false);
  const cfg = STATUS_CFG[interest.status];
  const StatusIcon = cfg.icon;
  const company = interest.company;

  const markViewed = async () => {
    if (interest.viewedByOwner) return;
    await updateOfferInterest(interest.id, { viewedByOwner: true });
    queryClient.invalidateQueries({ queryKey: ["received-interests"] });
  };

  const handleQuickAction = async (newStatus: "ACCEPTED" | "REJECTED") => {
    setUpdating(true);
    try {
      const result = await updateOfferInterest(interest.id, {
        status: newStatus,
        respondedAt: new Date(),
        viewedByOwner: true,
      });
      if (result) {
        toast.success(newStatus === "ACCEPTED" ? "Interest accepted." : "Interest declined.");
        queryClient.invalidateQueries({ queryKey: ["received-interests"] });
      } else {
        toast.error("Failed to update status.");
      }
    } catch {
      toast.error("An error occurred.");
    } finally {
      setUpdating(false);
    }
  };

  const verificationBadge = () => {
    const v = company?.verification;
    if (!v) return null;
    if (v.isGoldVerified) return <Badge className="bg-yellow-400 text-gray-900 hover:bg-yellow-400 text-[9px] font-bold px-1 py-0 leading-tight">GOLD</Badge>;
    if (v.isSilverVerified) return <Badge className="bg-gray-300 text-gray-900 hover:bg-gray-300 text-[9px] font-bold px-1 py-0 leading-tight">SILVER</Badge>;
    if (v.isBronzeVerified) return <Badge className="bg-orange-200 text-orange-900 hover:bg-orange-200 text-[9px] font-bold px-1 py-0 leading-tight">BRONZE</Badge>;
    if (v.status === "VERIFIED") return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 text-[9px] font-bold px-1 py-0 leading-tight">VERIFIED</Badge>;
    return null;
  };

  return (
    <div
      className={`bg-white rounded-xl border-2 transition-all hover:shadow-sm ${
        !interest.viewedByOwner ? "border-yellow-400" : "border-gray-200"
      }`}
      onMouseEnter={markViewed}
    >
      <div className="p-3 sm:p-4">
        <div className="flex items-start gap-3">
          {/* Company logo */}
          <div className="w-10 h-10 rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center shrink-0 overflow-hidden">
            {company?.logoUrl ? (
              <Image src={company.logoUrl} alt={company.name} width={40} height={40} className="object-cover w-full h-full" />
            ) : (
              <Building2 size={18} className="text-gray-400" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Top row: company name + status */}
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <p className="text-sm font-black text-gray-900 truncate">{company?.name ?? "Unknown"}</p>
                  {verificationBadge()}
                </div>
                <p className="text-xs text-gray-500 truncate mt-0.5">
                  {interest.offer.title}
                </p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                {/* Unread dot */}
                {!interest.viewedByOwner && (
                  <div className="w-2 h-2 rounded-full bg-yellow-500" title="New" />
                )}
                <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[10px] font-bold ${cfg.cls}`}>
                  <StatusIcon size={11} />
                  {cfg.label}
                </div>
              </div>
            </div>

            {/* Meta row */}
            <div className="flex items-center gap-3 mt-2 text-[11px] text-gray-500 flex-wrap">
              <span className="flex items-center gap-1">
                <Calendar size={11} />
                {new Date(interest.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "short" })}
              </span>
              {interest.attachments && interest.attachments.length > 0 && (
                <span className="flex items-center gap-1">
                  <FileText size={11} />
                  {interest.attachments.length} doc{interest.attachments.length !== 1 ? "s" : ""}
                </span>
              )}
              {company?.location && (
                <span className="truncate">
                  {[company.location.city, company.location.country].filter(Boolean).join(", ")}
                </span>
              )}
            </div>

            {/* Message preview */}
            {interest.message && (
              <p className="text-xs text-gray-600 mt-2 line-clamp-1">{interest.message}</p>
            )}

            {/* Actions */}
            <div className="flex items-center gap-2 mt-2.5 flex-wrap">
              <ReceivedOfferInterestViewButton interest={interest} variant="compact" />

              {interest.status === "PENDING" && (
                <>
                  <button
                    onClick={() => handleQuickAction("ACCEPTED")}
                    disabled={updating}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all disabled:opacity-50"
                  >
                    {updating ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle2 size={12} />}
                    Accept
                  </button>
                  <button
                    onClick={() => handleQuickAction("REJECTED")}
                    disabled={updating}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg transition-all disabled:opacity-50"
                  >
                    {updating ? <Loader2 size={12} className="animate-spin" /> : <XCircle size={12} />}
                    Decline
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
