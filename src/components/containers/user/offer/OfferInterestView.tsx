"use client";

import { useState, useMemo } from "react";
import { TReceivedOfferInterest } from "@/types/offer/offer-interest";
import { updateOfferInterest } from "@/server/offer/offer-interest";
import { createConversation } from "@/server/messaging/conversation";
import { CompanyViewBtn } from "@/components/buttons/CompanyViewBtn";
import { PdfViewer } from "@/components/ui/PdfViewer";
import { toast } from "sonner";
import queryClient from "@/lib/queryClient";
import { useRouter } from "next/navigation";
import Image from "@/components/ui/Image";
import { Dialog, DialogPanel } from "@headlessui/react";
import {
  X, Building2, MessageSquare, CheckCircle2, XCircle, Clock, Eye,
  Calendar, FileText, ExternalLink, MapPin, Mail, Phone, Award,
  Users, Briefcase, Shield, ChevronDown, ChevronUp, Send, Loader2,
  HardHat, AlertTriangle, TrendingUp, CircleCheck, CircleX, Info,
  Handshake,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

/* ────────────────────────────────────────────────────────────── */
/*  Helpers                                                       */
/* ────────────────────────────────────────────────────────────── */

const OFFER_TYPE_LABEL: Record<string, string> = {
  WORK_TASK: "Work Task",
  MATERIAL_SUPPLY: "Material Supply",
  EQUIPMENT_RENTAL: "Equipment Rental",
  CONSULTANCY: "Consultancy",
  SUBCONTRACTING: "Subcontracting",
  MAINTENANCE: "Maintenance",
};

const CONTRACT_TYPE_LABEL: Record<string, string> = {
  FIXED_PRICE: "Fixed Price",
  TIME_AND_MATERIALS: "Time & Materials",
  COST_PLUS: "Cost Plus",
  UNIT_PRICING: "Unit Pricing",
  PERFORMANCE_BASED: "Performance Based",
};

const STATUS_CFG = {
  PENDING:  { label: "Pending Review", icon: Clock,        bg: "bg-amber-50",  text: "text-amber-800",  border: "border-amber-200", dot: "bg-amber-500" },
  ACCEPTED: { label: "Accepted",       icon: CheckCircle2, bg: "bg-green-50",  text: "text-green-800",  border: "border-green-200", dot: "bg-green-500" },
  REJECTED: { label: "Declined",       icon: XCircle,      bg: "bg-red-50",    text: "text-red-800",    border: "border-red-200",   dot: "bg-red-500" },
} as const;

function formatDate(d: Date | string | null | undefined) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
}

function isPdf(url: string) {
  return url.toLowerCase().endsWith(".pdf");
}

/* ────────────────────────────────────────────────────────────── */
/*  Compatibility Score                                           */
/* ────────────────────────────────────────────────────────────── */

function computeCompatibility(interest: TReceivedOfferInterest) {
  const offer = interest.offer;
  const company = interest.company;
  const checks: { label: string; met: boolean; detail: string }[] = [];

  // 1. Has message
  checks.push({
    label: "Proposal message",
    met: !!interest.message?.trim(),
    detail: interest.message?.trim() ? "Provided" : "Missing",
  });

  // 2. Required documents coverage
  const requiredDocs = offer.requiredDocuments ?? [];
  const attachments = interest.attachments ?? [];
  if (requiredDocs.length > 0) {
    const attachedTypes = new Set(attachments.map((a) => a.fileType?.toLowerCase().trim()));
    const matched = requiredDocs.filter((d) => attachedTypes.has(d.toLowerCase().trim()));
    checks.push({
      label: "Required documents",
      met: matched.length >= requiredDocs.length,
      detail: `${matched.length}/${requiredDocs.length} provided`,
    });
  }

  // 3. Company verified
  if (company?.verification) {
    const v = company.verification;
    const isVerified = v.status === "VERIFIED" || v.isGoldVerified || v.isSilverVerified || v.isBronzeVerified;
    checks.push({
      label: "Company verification",
      met: isVerified,
      detail: v.isGoldVerified ? "Gold" : v.isSilverVerified ? "Silver" : v.isBronzeVerified ? "Bronze" : v.status === "VERIFIED" ? "Verified" : "Not verified",
    });
  }

  // 4. Company specializations match category
  if (offer.category && company?.specializations?.length) {
    const cats = company.specializations.map((s) => s.category?.name?.toLowerCase());
    const matched = cats.includes(offer.category.name?.toLowerCase());
    checks.push({
      label: "Category match",
      met: matched,
      detail: matched ? `Specializes in ${offer.category.name}` : "No matching specialization",
    });
  }

  // 5. Location match
  if (offer.siteLocation && company?.location) {
    const sameCountry = offer.siteLocation.country?.toLowerCase() === company.location.country?.toLowerCase();
    checks.push({
      label: "Location proximity",
      met: sameCountry,
      detail: sameCountry ? "Same country" : "Different country",
    });
  }

  // 6. Has services listed
  if (company?.services && company.services.length > 0) {
    checks.push({
      label: "Services listed",
      met: true,
      detail: `${company.services.length} services`,
    });
  }

  const met = checks.filter((c) => c.met).length;
  const total = checks.length;
  const pct = total > 0 ? Math.round((met / total) * 100) : 0;

  return { checks, met, total, pct };
}

/* ────────────────────────────────────────────────────────────── */
/*  View Button (placed on the card)                              */
/* ────────────────────────────────────────────────────────────── */

export const ReceivedOfferInterestViewButton = ({
  interest,
  variant = "default",
}: {
  interest: TReceivedOfferInterest;
  variant?: "default" | "compact";
}) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={
          variant === "compact"
            ? "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-gray-900 hover:bg-gray-800 text-yellow-400 rounded-lg transition-all"
            : "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold border border-gray-300 hover:border-yellow-400 hover:bg-yellow-50 text-gray-700 rounded-lg transition-all"
        }
      >
        <Eye size={14} />
        Review
      </button>

      <Dialog open={open} onClose={() => setOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" />
        <div className="fixed inset-0 flex items-start justify-center p-2 sm:p-4 overflow-y-auto">
          <DialogPanel className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl my-4 sm:my-8">
            <ReceivedOfferInterestView interest={interest} onClose={() => setOpen(false)} />
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
};

/* ────────────────────────────────────────────────────────────── */
/*  Main View Component                                           */
/* ────────────────────────────────────────────────────────────── */

export const ReceivedOfferInterestView = ({
  interest,
  onClose,
}: {
  interest: TReceivedOfferInterest;
  onClose?: () => void;
}) => {
  const router = useRouter();
  const [updating, setUpdating] = useState(false);
  const [creatingConvo, setCreatingConvo] = useState(false);
  const [pdfPreview, setPdfPreview] = useState<{ url: string; title: string } | null>(null);
  const [showAllChecks, setShowAllChecks] = useState(false);

  const { checks, pct } = useMemo(() => computeCompatibility(interest), [interest]);
  const cfg = STATUS_CFG[interest.status];
  const StatusIcon = cfg.icon;
  const company = interest.company;
  const offer = interest.offer;

  /* ── Actions ── */

  const handleStatusUpdate = async (newStatus: "ACCEPTED" | "REJECTED") => {
    setUpdating(true);
    try {
      const result = await updateOfferInterest(interest.id, {
        status: newStatus,
        respondedAt: new Date(),
        viewedByOwner: true,
      });
      if (result) {
        toast.success(
          newStatus === "ACCEPTED"
            ? "Interest accepted. You can now start a conversation."
            : "Interest declined."
        );
        queryClient.invalidateQueries({ queryKey: ["received-interests"] });
      } else {
        toast.error("Failed to update. Please try again.");
      }
    } catch {
      toast.error("An error occurred.");
    } finally {
      setUpdating(false);
    }
  };

  const handleCreateConversation = async () => {
    if (!company?.userId || !offer.company?.userId) {
      toast.error("Cannot create conversation — user information missing.");
      return;
    }
    setCreatingConvo(true);
    try {
      const convo = await createConversation({
        type: "OFFER_ROOM",
        participants: [offer.company.userId, company.userId],
        offer: { connect: { id: offer.id } },
      });
      if (convo) {
        toast.success("Conversation created. Redirecting to messages...");
        queryClient.invalidateQueries({ queryKey: ["received-interests"] });
        router.push(`/dashboard/messages?convo=${convo.id}`);
        onClose?.();
      } else {
        toast.error("Failed to create conversation.");
      }
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setCreatingConvo(false);
    }
  };

  const markViewed = async () => {
    if (interest.viewedByOwner) return;
    await updateOfferInterest(interest.id, { viewedByOwner: true });
    queryClient.invalidateQueries({ queryKey: ["received-interests"] });
  };

  // Mark as viewed when dialog opens
  if (!interest.viewedByOwner) markViewed();

  /* ── PDF preview dialog ── */
  if (pdfPreview) {
    return (
      <div className="flex flex-col h-[85vh]">
        <PdfViewer
          pdfUrl={pdfPreview.url}
          title={pdfPreview.title}
          onClose={() => setPdfPreview(null)}
        />
      </div>
    );
  }

  /* ── Rating color ── */
  const pctColor = pct >= 75 ? "text-green-600" : pct >= 50 ? "text-amber-600" : "text-red-600";
  const pctBg = pct >= 75 ? "bg-green-500" : pct >= 50 ? "bg-amber-500" : "bg-red-500";
  const pctMessage =
    pct >= 75
      ? "Strong match — this company meets most of the offer requirements."
      : pct >= 50
        ? "Moderate match — some requirements are unmet, review carefully."
        : "Low match — several key requirements are missing.";

  return (
    <div className="max-h-[85vh] overflow-y-auto">
      {/* ── Header ── */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 sm:px-6 py-4 rounded-t-2xl">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {/* Company avatar */}
            <div className="w-10 h-10 rounded-xl border-2 border-gray-200 bg-gray-50 flex items-center justify-center shrink-0 overflow-hidden">
              {company?.logoUrl ? (
                <Image src={company.logoUrl} alt={company.name} width={40} height={40} className="object-cover w-full h-full" />
              ) : (
                <Building2 size={20} className="text-gray-400" />
              )}
            </div>
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-black text-gray-900 truncate">{company?.name ?? "Unknown Company"}</h2>
              <p className="text-xs text-gray-500 truncate">Interest in: {offer.title}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-bold ${cfg.bg} ${cfg.text} ${cfg.border}`}>
              <StatusIcon size={13} />
              {cfg.label}
            </div>
            {onClose && (
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X size={18} className="text-gray-500" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-5">
        {/* ── Compatibility Score ── */}
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className={pctColor} />
              <span className="text-sm font-bold text-gray-900">Compatibility Score</span>
            </div>
            <span className={`text-2xl font-black ${pctColor}`}>{pct}%</span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-3">
            <div className={`h-full rounded-full transition-all duration-500 ${pctBg}`} style={{ width: `${pct}%` }} />
          </div>

          <p className="text-xs text-gray-600 mb-3 flex items-start gap-1.5">
            <Info size={13} className="shrink-0 mt-0.5 text-gray-400" />
            {pctMessage}
          </p>

          {/* Checks */}
          <div className="space-y-1.5">
            {(showAllChecks ? checks : checks.slice(0, 3)).map((c, i) => (
              <div key={i} className="flex items-center gap-2 text-xs">
                {c.met ? (
                  <CircleCheck size={14} className="text-green-500 shrink-0" />
                ) : (
                  <CircleX size={14} className="text-red-400 shrink-0" />
                )}
                <span className="font-semibold text-gray-700">{c.label}</span>
                <span className="text-gray-500 ml-auto text-right">{c.detail}</span>
              </div>
            ))}
          </div>
          {checks.length > 3 && (
            <button
              onClick={() => setShowAllChecks((v) => !v)}
              className="mt-2 text-xs font-bold text-gray-500 hover:text-gray-700 flex items-center gap-1 transition-colors"
            >
              {showAllChecks ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
              {showAllChecks ? "Show less" : `Show all ${checks.length} checks`}
            </button>
          )}
        </div>

        {/* ── Company Summary ── */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Building2 size={15} className="text-gray-400" />
            <h3 className="text-sm font-bold text-gray-900">Company Profile</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {company?.location && (
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <MapPin size={13} className="text-gray-400 shrink-0" />
                {[company.location.city, company.location.state, company.location.country].filter(Boolean).join(", ")}
              </div>
            )}
            {company?.email && (
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Mail size={13} className="text-gray-400 shrink-0" />
                <span className="truncate">{company.email}</span>
              </div>
            )}
            {company?.phone && (
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Phone size={13} className="text-gray-400 shrink-0" />
                {company.phone}
              </div>
            )}
            {company?.foundedYear && (
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Calendar size={13} className="text-gray-400 shrink-0" />
                Founded {company.foundedYear}
              </div>
            )}
            {company?.companySize && (
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Users size={13} className="text-gray-400 shrink-0" />
                {company.companySize} employees
              </div>
            )}
          </div>

          {company?.slogan && (
            <p className="text-xs text-gray-500 italic mt-3 border-l-2 border-yellow-400 pl-2">&ldquo;{company.slogan}&rdquo;</p>
          )}

          {company?.verification && (
            <div className="flex items-center gap-1.5 mt-3 flex-wrap">
              {company.verification.status === "VERIFIED" && (
                <span className="flex items-center gap-1 text-xs font-bold text-green-700">
                  <Shield size={12} /> Verified
                </span>
              )}
              {company.verification.isGoldVerified && <Badge className="bg-yellow-400 text-gray-900 hover:bg-yellow-400 text-[10px] font-bold px-1.5 py-0">GOLD</Badge>}
              {company.verification.isSilverVerified && <Badge className="bg-gray-300 text-gray-900 hover:bg-gray-300 text-[10px] font-bold px-1.5 py-0">SILVER</Badge>}
              {company.verification.isBronzeVerified && <Badge className="bg-orange-200 text-orange-900 hover:bg-orange-200 text-[10px] font-bold px-1.5 py-0">BRONZE</Badge>}
            </div>
          )}

          {company?.specializations && company.specializations.length > 0 && (
            <div className="mt-3">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Specializations</p>
              <div className="flex flex-wrap gap-1.5">
                {company.specializations.map((s, i) => (
                  <span key={i} className="text-[11px] font-semibold bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md">{s.name}</span>
                ))}
              </div>
            </div>
          )}

          {company?.services && company.services.length > 0 && (
            <div className="mt-3">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Services</p>
              <div className="flex flex-wrap gap-1.5">
                {company.services.map((s, i) => (
                  <span key={i} className="text-[11px] font-semibold bg-yellow-50 text-yellow-800 px-2 py-0.5 rounded-md border border-yellow-200">{s.name}</span>
                ))}
              </div>
            </div>
          )}

          {company && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <CompanyViewBtn companyId={company.id} companyName={company.name} variant="outline" size="sm" />
            </div>
          )}
        </div>

        {/* ── Offer Requirements vs Submission ── */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-3">
            <HardHat size={15} className="text-gray-400" />
            <h3 className="text-sm font-bold text-gray-900">Offer Requirements</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="space-y-2">
              <p className="font-bold text-gray-500 uppercase tracking-wide">Offer Details</p>
              <div className="space-y-1.5 text-gray-600">
                <div className="flex items-center gap-2">
                  <Briefcase size={12} className="text-gray-400 shrink-0" />
                  <span className="font-medium">{OFFER_TYPE_LABEL[offer.type] ?? offer.type}</span>
                </div>
                {offer.contractType && (
                  <div className="flex items-center gap-2">
                    <FileText size={12} className="text-gray-400 shrink-0" />
                    <span className="font-medium">{CONTRACT_TYPE_LABEL[offer.contractType] ?? offer.contractType}</span>
                  </div>
                )}
                {offer.category && (
                  <div className="flex items-center gap-2">
                    <Award size={12} className="text-gray-400 shrink-0" />
                    <span className="font-medium">{offer.category.name}</span>
                  </div>
                )}
                {offer.siteLocation && (
                  <div className="flex items-center gap-2">
                    <MapPin size={12} className="text-gray-400 shrink-0" />
                    <span className="font-medium">{[offer.siteLocation.city, offer.siteLocation.country].filter(Boolean).join(", ")}</span>
                  </div>
                )}
                {offer.pricing && (offer.pricing.budgetMin || offer.pricing.budgetMax) && (
                  <div className="flex items-center gap-2">
                    <TrendingUp size={12} className="text-gray-400 shrink-0" />
                    <span className="font-medium">
                      {offer.pricing.currency ?? "USD"} {offer.pricing.budgetMin?.toLocaleString() ?? "—"} – {offer.pricing.budgetMax?.toLocaleString() ?? "—"}
                    </span>
                  </div>
                )}
                {offer.timeline?.deadline && (
                  <div className="flex items-center gap-2">
                    <Calendar size={12} className="text-gray-400 shrink-0" />
                    <span className="font-medium">Deadline: {formatDate(offer.timeline.deadline)}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <p className="font-bold text-gray-500 uppercase tracking-wide">Requirements</p>
              <div className="space-y-1.5">
                {offer.requiredSkills?.length > 0 && (
                  <div>
                    <span className="text-gray-500 font-semibold">Skills:</span>
                    <div className="flex flex-wrap gap-1 mt-0.5">
                      {offer.requiredSkills.map((s, i) => (
                        <span key={i} className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded text-[10px] font-semibold">{s}</span>
                      ))}
                    </div>
                  </div>
                )}
                {offer.requiredCertifications?.length > 0 && (
                  <div>
                    <span className="text-gray-500 font-semibold">Certifications:</span>
                    <div className="flex flex-wrap gap-1 mt-0.5">
                      {offer.requiredCertifications.map((c, i) => (
                        <span key={i} className="bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded text-[10px] font-semibold">{c}</span>
                      ))}
                    </div>
                  </div>
                )}
                {offer.requiredDocuments?.length > 0 && (
                  <div>
                    <span className="text-gray-500 font-semibold">Documents:</span>
                    <div className="flex flex-wrap gap-1 mt-0.5">
                      {offer.requiredDocuments.map((d, i) => {
                        const submitted = interest.attachments?.some(
                          (a) => a.fileType?.toLowerCase().trim() === d.toLowerCase().trim()
                        );
                        return (
                          <span
                            key={i}
                            className={`px-1.5 py-0.5 rounded text-[10px] font-semibold flex items-center gap-0.5 ${
                              submitted ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"
                            }`}
                          >
                            {submitted ? <CircleCheck size={10} /> : <CircleX size={10} />}
                            {d}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Proposal Message ── */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare size={15} className="text-gray-400" />
            <h3 className="text-sm font-bold text-gray-900">Proposal Message</h3>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{interest.message}</p>
          </div>
        </div>

        {/* ── Attachments ── */}
        {interest.attachments && interest.attachments.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-3">
              <FileText size={15} className="text-gray-400" />
              <h3 className="text-sm font-bold text-gray-900">
                Attached Documents
                <span className="text-gray-400 font-medium ml-1">({interest.attachments.length})</span>
              </h3>
            </div>
            <div className="space-y-2">
              {interest.attachments.map((att) => (
                <div
                  key={att.id}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors"
                >
                  <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center shrink-0">
                    <FileText size={14} className="text-yellow-700" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-gray-900 truncate">{att.fileType || "Document"}</p>
                    {att.description && (
                      <p className="text-[11px] text-gray-500 truncate">{att.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {isPdf(att.url) ? (
                      <button
                        onClick={() => setPdfPreview({ url: att.url, title: att.fileType || "Document" })}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-bold bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition-all"
                      >
                        <Eye size={12} />
                        View
                      </button>
                    ) : (
                      <a
                        href={att.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-bold bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all"
                      >
                        <ExternalLink size={12} />
                        Open
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Timeline ── */}
        <div className="flex items-center gap-4 text-xs text-gray-500 flex-wrap px-1">
          <span className="flex items-center gap-1">
            <Calendar size={13} className="text-gray-400" />
            Submitted {formatDate(interest.createdAt)}
          </span>
          {interest.respondedAt && (
            <span className="flex items-center gap-1">
              <Clock size={13} className="text-gray-400" />
              Responded {formatDate(interest.respondedAt)}
            </span>
          )}
        </div>

        <Separator />

        {/* ── Action Buttons ── */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          {interest.status === "PENDING" && (
            <>
              <button
                onClick={() => handleStatusUpdate("ACCEPTED")}
                disabled={updating}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold bg-green-600 hover:bg-green-700 text-white rounded-xl transition-all disabled:opacity-50"
              >
                {updating ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle2 size={15} />}
                Accept Interest
              </button>
              <button
                onClick={() => handleStatusUpdate("REJECTED")}
                disabled={updating}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl transition-all disabled:opacity-50"
              >
                {updating ? <Loader2 size={15} className="animate-spin" /> : <XCircle size={15} />}
                Decline
              </button>
            </>
          )}

          {interest.status === "ACCEPTED" && (
            <>
              <button
                onClick={handleCreateConversation}
                disabled={creatingConvo}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-xl transition-all disabled:opacity-50"
              >
                {creatingConvo ? <Loader2 size={15} className="animate-spin" /> : <Handshake size={15} />}
                {creatingConvo ? "Creating Room..." : "Start Conversation"}
              </button>
              <button
                onClick={() => router.push("/dashboard/messages")}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all"
              >
                <Send size={15} />
                Go to Messages
              </button>
            </>
          )}

          {interest.status === "REJECTED" && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <AlertTriangle size={15} className="text-red-400" />
              <span>This interest has been declined.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};