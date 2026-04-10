"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
     X, Send, Loader2, ExternalLink, FileText, CheckCircle2,
     AlertCircle, HardHat, Building2, ChevronRight, Info,
     CloudUpload, Shield, BadgeCheck, Heart, Trash2, ChevronDown,
} from "lucide-react";
import Link from "next/link";

import { useAuth } from "@/hooks/useAuth";
import queryClient from "@/lib/queryClient";
import { cn } from "@/lib/utils";

import { fetchDocuments, createDocument } from "@/server/common/document";
import { createOfferInterest } from "@/server/offer/offer-interest";
import { fetchOfferById } from "@/server/offer/offer";
import { uploadSingleImage } from "@/util/s3Helpers";
import FileUpload from "@/components/ui/upload/FileUpload";

import { SOfferInterestForm } from "@/types/offer/offer";
import { EDocumentModelType, EDocumentType } from "@prisma/client";
import { LoginForm } from "../auth/LoginForm";

// ─── Lean company-document select ────────────────────────────────────────────

const SCompanyDoc = {
     id: true,
     title: true,
     docUrl: true,
     type: true,
     description: true,
} as const;
type TCompanyDoc = { id: string; title: string; docUrl: string; type: EDocumentType; description?: string | null };

// ─── Attachment state shape ───────────────────────────────────────────────────

interface IPendingAttachment {
     tempId: string;
     fileType: string;    // = the required doc name from offer.requiredDocuments
     url: string;
     description: string;
     uploading?: boolean;
}

// ─── InterestAttachmentInput ─────────────────────────────────────────────────
// Mirrors DocumentInput from DocumentForm but adds a description field and
// supports selecting an existing company document as the upload source.

interface IAttachmentInputProps {
     attachment: IPendingAttachment;
     companyDocs: TCompanyDoc[];
     companyId: string;
     onUpdate: (tempId: string, patch: Partial<IPendingAttachment>) => void;
}

function InterestAttachmentInput({ attachment, companyDocs, companyId, onUpdate }: IAttachmentInputProps) {
     const [showPicker, setShowPicker] = useState(false);
     const [uploading, setUploading] = useState(false);

     const clearFile = () => {
          // Only clear the URL reference — never delete from S3 since it may be a library doc
          onUpdate(attachment.tempId, { url: "" });
     };

     const pickFromLibrary = (doc: TCompanyDoc) => {
          onUpdate(attachment.tempId, { url: doc.docUrl });
          setShowPicker(false);
     };

     const handleUpload = async (url: string) => {
          setUploading(true);
          try {
               // Save as company document for future reuse
               await createDocument({
                    title: attachment.fileType,
                    docUrl: url,
                    type: EDocumentType.OTHER,
                    modelType: EDocumentModelType.COMPANY,
                    company: { connect: { id: companyId } },
               });
               onUpdate(attachment.tempId, { url });
               queryClient.invalidateQueries({ queryKey: ["company-docs-for-interest", companyId] });
          } catch {
               toast.error("Failed to save document. Please try again.");
          } finally {
               setUploading(false);
          }
     };

     return (
          <div className={cn(
               "w-full rounded-lg border transition-all",
               attachment.url ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200",
          )}>
               {/* Row 1 — title + file action */}
               <div className="flex items-center justify-between gap-2 p-2">
                    <div className="flex items-center gap-2 min-w-0">
                         <span className="p-2 bg-linear-to-t from-gray-600 to-slate-600 text-white rounded-lg shrink-0">
                              <FileText className="w-4 h-4" />
                         </span>
                         <span className="text-sm font-medium text-gray-800 truncate">{attachment.fileType}</span>
                    </div>

                    {attachment.url ? (
                         <div className="flex items-center gap-2 shrink-0">
                              <Link
                                   href={attachment.url}
                                   target="_blank"
                                   className="border border-gray-400/50 rounded px-2 py-1.5 flex items-center gap-1.5 text-xs text-gray-700 hover:bg-white transition-colors"
                              >
                                   View <ExternalLink className="w-3.5 h-3.5" />
                              </Link>
                              <button
                                   type="button"
                                   onClick={clearFile}
                                   title="Remove file"
                                   className="p-1.5 rounded bg-red-600 text-white hover:bg-red-700 transition-colors"
                              >
                                   <Trash2 className="w-3.5 h-3.5" />
                              </button>
                         </div>
                    ) : (
                         <div className="flex items-center gap-2 shrink-0">
                              {/* Pick from library */}
                              <div className="relative">
                                   <button
                                        type="button"
                                        onClick={() => setShowPicker((v) => !v)}
                                        className="flex items-center gap-1 text-xs px-2 py-1.5 border border-gray-300 rounded bg-white text-gray-700 hover:border-amber-400 transition-colors"
                                   >
                                        Library <ChevronDown className="w-3 h-3" />
                                   </button>
                                   {showPicker && companyDocs.length > 0 && (
                                        <div className="absolute right-0 top-full mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-48 overflow-y-auto">
                                             {companyDocs.map((doc) => (
                                                  <button
                                                       key={doc.id}
                                                       type="button"
                                                       onClick={() => pickFromLibrary(doc)}
                                                       className="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-amber-50 flex items-center gap-2 border-b border-gray-100 last:border-0"
                                                  >
                                                       <FileText className="w-3 h-3 text-gray-400 shrink-0" />
                                                       <span className="truncate">{doc.title}</span>
                                                  </button>
                                             ))}
                                        </div>
                                   )}
                                   {showPicker && companyDocs.length === 0 && (
                                        <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20 px-3 py-2 text-xs text-gray-400">
                                             No documents in library
                                        </div>
                                   )}
                              </div>
                              {/* Upload new */}
                              {uploading ? (
                                   <span className="flex items-center gap-1 text-xs text-gray-500 px-2 py-1.5">
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" /> Uploading…
                                   </span>
                              ) : (
                                   <FileUpload
                                        name="Upload"
                                        icon={<CloudUpload className="w-4 h-4" />}
                                        className="text-xs py-1.5 border-dashed border-2 rounded bg-white text-gray-700 font-semibold"
                                        onUploadComplete={(url) => handleUpload(url)}
                                   />
                              )}
                         </div>
                    )}
               </div>

               {/* Row 2 — description */}
               <div className="px-2 pb-2">
                    <input
                         type="text"
                         value={attachment.description}
                         onChange={(e) => onUpdate(attachment.tempId, { description: e.target.value })}
                         placeholder="Add a note about this document (optional)"
                         className="w-full text-xs px-3 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:border-amber-400 text-gray-700 placeholder-gray-400 bg-white"
                    />
               </div>
          </div>
     );
}


// ─── Toggle button ────────────────────────────────────────────────────────────

interface InterestButtonProps {
     offerId: string;
     existingInterestId?: string;
     showIcon?: boolean;
     showText?: boolean;
     size?: "sm" | "md" | "lg";
     onComplete?: () => void;
}

export const OfferInterestButton = ({
     offerId,
     existingInterestId,
     showIcon = true,
     showText = true,
     size = "md",
     onComplete,
}: InterestButtonProps) => {
     const [open, setOpen] = useState(false);

     const sizeClass = {
          sm: "px-3 py-1.5 text-xs gap-1.5",
          md: "px-5 py-2.5 text-sm gap-2",
          lg: "px-6 py-3 text-base gap-2.5",
     }[size];

     const iconSize = { sm: 14, md: 16, lg: 18 }[size];

     return (
          <>
               <button
                    type="button"
                    onClick={() => setOpen(true)}
                    className={cn(
                         "inline-flex items-center font-semibold rounded-xl transition-all duration-200",
                         existingInterestId
                              ? "bg-green-50 text-green-700 border border-green-200 hover:bg-green-100"
                              : "bg-linear-to-br from-amber-400 to-orange-500 text-gray-900 shadow-md hover:shadow-lg hover:from-amber-500 hover:to-orange-600 active:scale-[0.98]",
                         sizeClass,
                    )}
               >
                    {showIcon && (existingInterestId ? <CheckCircle2 size={iconSize} /> : <Heart size={iconSize} />)}
                    {showText && (existingInterestId ? "Interest Submitted" : "Submit Interest")}
               </button>

               <Dialog open={open} onClose={() => setOpen(false)} className="relative z-50">
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                         <DialogPanel
                              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto"
                              onClick={(e) => e.stopPropagation()}
                         >
                              <OfferInterestForm
                                   offerId={offerId}
                                   existingInterestId={existingInterestId}
                                   onComplete={() => { setOpen(false); onComplete?.(); }}
                              />
                         </DialogPanel>
                    </div>
               </Dialog>
          </>
     );
};

// ─── Main form ────────────────────────────────────────────────────────────────

interface OfferInterestFormProps {
     offerId: string;
     existingInterestId?: string;
     onComplete?: () => void;
}

export const OfferInterestForm = ({ offerId, existingInterestId, onComplete }: OfferInterestFormProps) => {
     const { user,setUser } = useAuth();
     const companyId = user?.company?.id;

     // ── Remote data ──────────────────────────────────────────────────────────

     const { data: offer, isLoading: loadingOffer } = useQuery({
          queryKey: ["offer-interest-form", offerId],
          queryFn: () => fetchOfferById(offerId, SOfferInterestForm),
          enabled: !!offerId,
     });

     const { data: companyDocsRes, isLoading: loadingDocs } = useQuery({
          queryKey: ["company-docs-for-interest", companyId],
          queryFn: () =>
               companyId
                    ? fetchDocuments(SCompanyDoc, { companyId }, 100)
                    : Promise.resolve({ data: [], pagination: { total: 0 } }),
          enabled: !!companyId,
     });

     const companyDocs = (companyDocsRes?.data ?? []) as TCompanyDoc[];

     // ── Local state ──────────────────────────────────────────────────────────

     const DEFAULT_MESSAGE = "We are interested in this opportunity and believe our company has the relevant experience and capacity to deliver the required scope of work.";
     const [message, setMessage] = useState(DEFAULT_MESSAGE);
     const [attachments, setAttachments] = useState<IPendingAttachment[]>([]);
     const [submitting, setSubmitting] = useState(false);
     const [step, setStep] = useState<"message" | "attachments" | "review">("message");

     // Seed attachments from offer.requiredDocuments when offer loads
     useEffect(() => {
          if (!offer) return;
          const requiredAttachments: string[] = offer.requiredDocuments ?? [];
          const requiredCertifications: string[] = offer.requiredCertifications ?? [];

          const required = [...new Set([...(requiredAttachments ?? []), ...(requiredCertifications ?? [])])]; // dedupe in case of overlap

          if (required.length === 0) return;
          
          setAttachments(
               required.map((docName) => ({
                    tempId: crypto.randomUUID(),
                    fileType: docName,
                    url: "",
                    description: "",
               }))
          );
     }, [offer?.id]); // eslint-disable-line react-hooks/exhaustive-deps

     // ── Attachment helpers ───────────────────────────────────────────────────

     const updateAttachment = (tempId: string, patch: Partial<IPendingAttachment>) => {
          setAttachments((prev) => prev.map((a) => a.tempId === tempId ? { ...a, ...patch } : a));
     };

     // ── Submit ───────────────────────────────────────────────────────────────

     const submit = async () => {
          if (!companyId) return toast.error("A company profile is required to submit interest.");
          if (attachments.some((a) => a.uploading)) return toast.warning("Please wait for uploads to complete.");

          const finalMessage = message.trim() || DEFAULT_MESSAGE;
          setSubmitting(true);
          try {
               const interest = await createOfferInterest({
                    status: "PENDING",
                    message: finalMessage,
                    offer: { connect: { id: offerId } },
                    company: { connect: { id: companyId } },
                    attachments: {
                         createMany: {
                              data: attachments.filter(a => a.url).map(a => ({
                                   url: a.url,
                                   fileType: a.fileType,
                                   description: a.description || a.fileType,
                              }))
                         }
                    }
               });
               if (!interest) return toast.error("Failed to submit interest. Please try again.");
               toast.success("Interest submitted. The offer owner will review your application.");
               onComplete?.();
               queryClient.invalidateQueries();
          } catch {
               toast.error("Something went wrong. Please try again.");
          } finally {
               setSubmitting(false);
          }
     };

     // ── Guards ───────────────────────────────────────────────────────────────

     if (!user) return (
          <div className="flex flex-col">
               <div className="bg-linear-to-br from-gray-900 to-gray-800 rounded-t-2xl px-6 py-5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                         <span className="flex items-center justify-center w-10 h-10 bg-amber-400/20 rounded-xl shrink-0">
                              <HardHat className="w-5 h-5 text-amber-400" />
                         </span>
                         <div>
                              <p className="text-amber-400 text-xs font-semibold uppercase tracking-widest mb-0.5">Authentication Required</p>
                              <h2 className="text-white font-bold text-lg">Sign in to Submit Interest</h2>
                         </div>
                    </div>
                    {onComplete && (
                         <button onClick={onComplete} className="text-gray-400 hover:text-white transition-colors shrink-0"><X size={22} /></button>
                    )}
               </div>
               <div className="p-6">
                    <p className="text-gray-600 text-sm mb-5">You need a Consnect account to express interest in construction opportunities. Sign in or create a free account to continue.</p>
                    <LoginForm onComplete={setUser} />
               </div>
          </div>
     );

     if (!user?.company) return (
          <div className="flex flex-col">
               <div className="bg-linear-to-br from-gray-900 to-gray-800 rounded-t-2xl px-6 py-5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                         <span className="flex items-center justify-center w-10 h-10 bg-amber-400/20 rounded-xl shrink-0">
                              <HardHat className="w-5 h-5 text-amber-400" />
                         </span>
                         <h2 className="text-white font-bold text-lg">Company Profile Required</h2>
                    </div>
                    {onComplete && (
                         <button onClick={onComplete} className="text-gray-400 hover:text-white transition-colors shrink-0"><X size={22} /></button>
                    )}
               </div>
               <div className="p-8 flex flex-col items-center text-center gap-3">
                    <Shield className="w-8 h-8 text-gray-400" />
                    <p className="text-gray-600 text-sm max-w-xs">You must have a company profile set up before you can submit interest on offers.</p>
               </div>
          </div>
     );

     if (loadingOffer) {
          return (
               <div className="flex flex-col items-center justify-center py-20 gap-3">
                    <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
                    <p className="text-gray-500 text-sm font-medium">Loading offer details…</p>
               </div>
          );
     }
     if (!offer) {
          return (
               <div className="flex flex-col items-center justify-center py-20 gap-3">
                    <AlertCircle className="w-8 h-8 text-red-400" />
                    <p className="text-gray-600 text-sm">Offer not found.</p>
               </div>
          );
     }

     const isReadOnly = !!existingInterestId;
     const requiredDocs: string[] = offer.requiredDocuments ?? [];
     const requiredCerts: string[] = offer.requiredCertifications ?? [];

     // ── Own-offer guard ───────────────────────────────────────────────────────
     if (companyId && offer.company?.id === companyId) {
          return (
               <div className="flex flex-col">
                    <div className="bg-linear-to-br from-gray-900 to-gray-800 rounded-t-2xl px-6 py-5 flex items-center justify-between gap-4">
                         <div className="flex items-center gap-3">
                              <span className="flex items-center justify-center w-10 h-10 bg-amber-400/20 rounded-xl shrink-0">
                                   <HardHat className="w-5 h-5 text-amber-400" />
                              </span>
                              <h2 className="text-white font-bold text-lg leading-tight line-clamp-2">{offer.title}</h2>
                         </div>
                         {onComplete && (
                              <button onClick={onComplete} className="text-gray-400 hover:text-white transition-colors shrink-0"><X size={22} /></button>
                         )}
                    </div>
                    <div className="p-8 flex flex-col items-center text-center gap-3">
                         <Building2 className="w-10 h-10 text-gray-300" />
                         <p className="text-gray-800 font-bold text-base">This is your own offer</p>
                         <p className="text-gray-500 text-sm max-w-xs">You cannot submit interest on an offer posted by your company.</p>
                    </div>
               </div>
          );
     }

     // ── Already-submitted guard ───────────────────────────────────────────────
     const existingInterest = companyId
          ? offer.interests?.find((i) => i.companyId === companyId)
          : null;

     if (existingInterest) {
          const statusLabel: Record<string, { label: string; color: string }> = {
               PENDING:  { label: "Awaiting Response", color: "text-amber-600 bg-amber-50 border-amber-200" },
               ACCEPTED: { label: "Accepted 🎉",        color: "text-green-700 bg-green-50 border-green-200" },
               REJECTED: { label: "Declined",           color: "text-red-600 bg-red-50 border-red-200" },
          };
          const s = statusLabel[existingInterest.status] ?? { label: existingInterest.status, color: "text-gray-600 bg-gray-50 border-gray-200" };
          return (
               <div className="flex flex-col">
                    <div className="bg-linear-to-br from-gray-900 to-gray-800 rounded-t-2xl px-6 py-5 flex items-center justify-between gap-4">
                         <div className="flex items-center gap-3">
                              <span className="flex items-center justify-center w-10 h-10 bg-amber-400/20 rounded-xl shrink-0">
                                   <HardHat className="w-5 h-5 text-amber-400" />
                              </span>
                              <h2 className="text-white font-bold text-lg leading-tight line-clamp-2">{offer.title}</h2>
                         </div>
                         {onComplete && (
                              <button onClick={onComplete} className="text-gray-400 hover:text-white transition-colors shrink-0"><X size={22} /></button>
                         )}
                    </div>
                    <div className="p-8 flex flex-col items-center text-center gap-4">
                         <CheckCircle2 className="w-10 h-10 text-green-500" />
                         <div>
                              <p className="text-gray-800 font-bold text-base mb-1">Interest already submitted</p>
                              <p className="text-gray-500 text-sm">Your application for this offer is currently:</p>
                         </div>
                         <span className={`px-4 py-2 rounded-xl border text-sm font-bold ${s.color}`}>{s.label}</span>
                         <a
                              href="/dashboard/offers/offer-interests"
                              className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-amber-600 hover:text-amber-700 underline underline-offset-2"
                         >
                              View in My Interests dashboard →
                         </a>
                    </div>
               </div>
          );
     }

     // ── Render ───────────────────────────────────────────────────────────────
     return (
          <div className="flex flex-col">

               {/* ── Header ────────────────────────────────────────────────── */}
               <div className="sticky top-0 z-10 bg-linear-to-br from-gray-900 to-gray-800 rounded-t-2xl px-6 py-5">
                    <div className="flex items-start justify-between gap-4">
                         <div className="flex items-center gap-3">
                              <span className="flex items-center justify-center w-10 h-10 bg-amber-400/20 rounded-xl shrink-0">
                                   <HardHat className="w-5 h-5 text-amber-400" />
                              </span>
                              <div>
                                   <p className="text-amber-400 text-xs font-semibold uppercase tracking-widest mb-0.5">
                                        {isReadOnly ? "Submitted Application" : "Submit Interest"}
                                   </p>
                                   <h2 className="text-white font-bold text-lg leading-tight line-clamp-2">{offer.title}</h2>
                              </div>
                         </div>
                         {onComplete && (
                              <button onClick={onComplete} className="text-gray-400 hover:text-white transition-colors mt-0.5 shrink-0">
                                   <X size={22} />
                              </button>
                         )}
                    </div>

                    {/* Meta chips */}
                    <div className="flex flex-wrap gap-2 mt-4">
                         {offer.company && (
                              <span className="flex items-center gap-1.5 px-2.5 py-1 bg-white/10 rounded-lg text-gray-300 text-xs font-medium">
                                   <Building2 size={11} /> {offer.company.name}
                              </span>
                         )}
                         <span className="px-2.5 py-1 bg-amber-400/20 rounded-lg text-amber-300 text-xs font-semibold uppercase tracking-wide">
                              {offer.type.replace(/_/g, " ")}
                         </span>
                         <span className="px-2.5 py-1 bg-white/10 rounded-lg text-gray-300 text-xs font-medium">
                              {offer.contractType.replace(/_/g, " ")}
                         </span>
                         {offer.pricing && (
                              <span className="px-2.5 py-1 bg-green-500/20 rounded-lg text-green-300 text-xs font-medium">
                                   {offer.pricing.currency ?? "USD"} {offer.pricing.budgetMin?.toLocaleString()} – {offer.pricing.budgetMax?.toLocaleString()}
                              </span>
                         )}
                         {offer.timeline?.deadline && (
                              <span className="px-2.5 py-1 bg-red-500/20 rounded-lg text-red-300 text-xs font-medium">
                                   Deadline: {new Date(offer.timeline.deadline).toLocaleDateString()}
                              </span>
                         )}
                    </div>

                    {/* Step tabs */}
                    {!isReadOnly && (
                         <div className="flex items-center gap-1 mt-5">
                              {(["message", "attachments", "review"] as const).map((s, i) => (
                                   <React.Fragment key={s}>
                                        <button
                                             type="button"
                                             onClick={() => setStep(s)}
                                             className={cn(
                                                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
                                                  step === s ? "bg-amber-400 text-gray-900" : "text-gray-400 hover:text-white",
                                             )}
                                        >
                                             <span className={cn(
                                                  "w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold",
                                                  step === s ? "bg-gray-900 text-amber-400" : "bg-white/10 text-gray-500",
                                             )}>{i + 1}</span>
                                             <span className="hidden sm:inline capitalize">{s}</span>
                                        </button>
                                        {i < 2 && <ChevronRight size={12} className="text-gray-600" />}
                                   </React.Fragment>
                              ))}
                         </div>
                    )}
               </div>

               {/* ── Body ──────────────────────────────────────────────────── */}
               <div className="p-6 flex flex-col gap-5">

                    {/* Submission guidelines */}
                    {offer.submissionInfo?.submissionGuidelines && (
                         <div className="flex gap-3 p-4 bg-blue-50 border border-blue-100 rounded-xl">
                              <Info size={15} className="text-blue-500 shrink-0 mt-0.5" />
                              <div>
                                   <p className="text-blue-800 text-xs font-bold mb-0.5">Submission Guidelines</p>
                                   <p className="text-blue-700 text-sm leading-relaxed">{offer.submissionInfo.submissionGuidelines}</p>
                              </div>
                         </div>
                    )}

                    {/* Required certifications info strip */}
                    {requiredCerts.length > 0 && (
                         <div className="flex flex-wrap gap-1.5 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                              <span className="flex items-center gap-1 text-amber-700 text-xs font-bold w-full mb-1">
                                   <BadgeCheck size={13} className="text-amber-500" /> Required Certifications
                              </span>
                              {requiredCerts.map((c, i) => (
                                   <span key={i} className="px-2 py-1 bg-white border border-amber-300 rounded-lg text-amber-800 text-xs font-medium">{c}</span>
                              ))}
                         </div>
                    )}

                    {/* ═══════════════════════════════════════ STEP 1 — Message */}
                    {step === "message" && (
                         <div className="flex flex-col gap-4">
                              <div className="flex flex-col gap-1.5">
                                   <label className="text-sm font-bold text-gray-800 flex items-center gap-2">
                                        <Send size={14} className="text-amber-500" />
                                        Proposal Message
                                        <span className="text-xs font-normal text-gray-400">(optional — a default is pre-filled)</span>
                                   </label>
                                   <textarea
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        rows={6}
                                        disabled={isReadOnly}
                                        className={cn(
                                             "w-full resize-none border-2 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none transition-colors leading-relaxed",
                                             isReadOnly
                                                  ? "bg-gray-50 border-gray-200 cursor-not-allowed"
                                                  : "border-gray-200 focus:border-amber-400 bg-white hover:border-gray-300",
                                        )}
                                   />
                                   {offer.submissionInfo?.proposalFormat && (
                                        <div className="flex gap-2 p-2.5 bg-gray-50 border border-gray-200 rounded-lg">
                                             <FileText size={12} className="text-gray-400 shrink-0 mt-0.5" />
                                             <p className="text-gray-600 text-xs leading-relaxed">
                                                  <span className="font-semibold text-gray-700">Expected format: </span>
                                                  {offer.submissionInfo.proposalFormat}
                                             </p>
                                        </div>
                                   )}
                              </div>
                              {!isReadOnly && (
                                   <button
                                        type="button"
                                        onClick={() => setStep("attachments")}
                                        className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 bg-linear-to-r from-amber-400 to-orange-500 text-gray-900 hover:shadow-lg active:scale-[0.99] transition-all"
                                   >
                                        Next: Supporting Documents <ChevronRight size={16} />
                                   </button>
                              )}
                         </div>
                    )}

                    {/* ══════════════════════════════════ STEP 2 — Attachments */}
                    {step === "attachments" && (
                         <div className="flex flex-col gap-3">
                              <div>
                                   <h3 className="text-sm font-bold text-gray-800 mb-1">Supporting Documents</h3>
                                   <p className="text-gray-500 text-xs leading-relaxed">
                                        Upload or select from your library for each required document. New uploads are saved to your company document library for future reuse.
                                   </p>
                              </div>

                              {loadingDocs ? (
                                   <div className="flex items-center gap-2 py-4 text-gray-400 text-xs">
                                        <Loader2 size={14} className="animate-spin" /> Loading your document library…
                                   </div>
                              ) : (
                                   attachments.length > 0 ? (
                                        <div className="flex flex-col gap-2">
                                             {attachments.map((att) => (
                                                  <InterestAttachmentInput
                                                       key={att.tempId}
                                                       attachment={att}
                                                       companyDocs={companyDocs}
                                                       companyId={companyId!}
                                                       onUpdate={updateAttachment}
                                                  />
                                             ))}
                                        </div>
                                   ) : (
                                        <p className="text-gray-400 text-xs italic">No required documents specified for this offer.</p>
                                   )
                              )}

                              {!isReadOnly && (
                                   <div className="flex gap-2 pt-2">
                                        <button type="button" onClick={() => setStep("message")}
                                             className="flex-1 py-2.5 rounded-xl text-sm font-semibold border-2 border-gray-200 text-gray-600 hover:border-gray-300 transition-colors">
                                             ← Back
                                        </button>
                                        <button type="button" onClick={() => setStep("review")}
                                             className="flex-2 py-2.5 rounded-xl text-sm font-bold bg-linear-to-r from-amber-400 to-orange-500 text-gray-900 hover:shadow-lg transition-all">
                                             Review & Submit →
                                        </button>
                                   </div>
                              )}
                         </div>
                    )}

                    {/* ═══════════════════════════════════════ STEP 3 — Review */}
                    {step === "review" && (
                         <div className="flex flex-col gap-5">
                              <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl flex flex-col gap-2">
                                   <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Proposal Message</p>
                                   <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">{message || DEFAULT_MESSAGE}</p>
                              </div>

                              {attachments.filter(a => a.url).length > 0 && (
                                   <div className="flex flex-col gap-2">
                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                             Attached Documents ({attachments.filter(a => a.url).length})
                                        </p>
                                        {attachments.filter(a => a.url).map((att) => (
                                             <div key={att.tempId} className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl">
                                                  <FileText size={15} className="text-amber-500 shrink-0" />
                                                  <div className="flex-1 min-w-0">
                                                       <p className="text-sm font-semibold text-gray-800 truncate">{att.fileType}</p>
                                                       {att.description && <p className="text-xs text-gray-400 truncate">{att.description}</p>}
                                                  </div>
                                                  <a href={att.url} target="_blank" rel="noopener noreferrer"
                                                       className="text-gray-400 hover:text-amber-500 transition-colors">
                                                       <ExternalLink size={14} />
                                                  </a>
                                             </div>
                                        ))}
                                   </div>
                              )}

                              <div className="flex gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                                   <HardHat size={16} className="text-amber-600 shrink-0 mt-0.5" />
                                   <p className="text-amber-800 text-xs leading-relaxed">
                                        By submitting, you confirm that all information is accurate and your company is capable of delivering the required scope of work.
                                   </p>
                              </div>

                              <div className="flex gap-2">
                                   <button type="button" onClick={() => setStep("attachments")} disabled={submitting}
                                        className="flex-1 py-2.5 rounded-xl text-sm font-semibold border-2 border-gray-200 text-gray-600 hover:border-gray-300 transition-colors disabled:opacity-50">
                                        ← Back
                                   </button>
                                   <button type="button" onClick={submit} disabled={submitting}
                                        className={cn(
                                             "flex-2 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all",
                                             submitting
                                                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                                  : "bg-linear-to-br from-amber-400 to-orange-500 text-gray-900 hover:shadow-xl active:scale-[0.99]",
                                        )}
                                   >
                                        {submitting
                                             ? <><Loader2 size={16} className="animate-spin" /> Submitting…</>
                                             : <><Send size={16} /> Submit Interest</>
                                        }
                                   </button>
                              </div>
                         </div>
                    )}
               </div>
          </div>
     );
};

export default OfferInterestForm;

