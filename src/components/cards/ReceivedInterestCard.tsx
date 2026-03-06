"use client";

import { useState } from "react";
import Image from "next/image";
import { TReceivedOfferInterest } from "@/types/offer/offer-interest";
import { updateOfferInterest } from "@/server/offer/offer-interest";
import { CompanyViewBtn } from "@/components/buttons/CompanyViewBtn";
import { toast } from "sonner";
import queryClient from "@/lib/queryClient";
import {
     Building2, MessageSquare, CheckCircle2, XCircle, Clock,
     Handshake, Eye, EyeOff, Calendar, HardHat
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface ReceivedInterestCardProps {
     interest: TReceivedOfferInterest;
     onDealRoom?: (interestId: string) => void;
}

export const ReceivedInterestCard = ({ interest, onDealRoom }: ReceivedInterestCardProps) => {
     const [updating, setUpdating] = useState(false);

     const handleStatusUpdate = async (newStatus: "ACCEPTED" | "REJECTED") => {
          setUpdating(true);
          try {
               const result = await updateOfferInterest(interest.id, {
                    status: newStatus,
                    respondedAt: new Date(),
                    viewedByOwner: true,
               });
               if (result) {
                    toast.success(newStatus === "ACCEPTED" ? "Interest accepted – you can now initiate a deal room." : "Interest declined.");
                    queryClient.invalidateQueries({ queryKey: ["received-interests"] });
               } else {
                    toast.error("Failed to update status. Please try again.");
               }
          } catch {
               toast.error("An error occurred.");
          } finally {
               setUpdating(false);
          }
     };

     const markViewed = async () => {
          if (interest.viewedByOwner) return;
          await updateOfferInterest(interest.id, { viewedByOwner: true });
          queryClient.invalidateQueries({ queryKey: ["received-interests"] });
     };

     const statusConfig = {
          PENDING:  { label: "Pending Review",  icon: Clock,       color: "bg-amber-50 text-amber-800 border-amber-200" },
          ACCEPTED: { label: "Accepted",         icon: CheckCircle2, color: "bg-green-50 text-green-800 border-green-200" },
          REJECTED: { label: "Declined",         icon: XCircle,     color: "bg-red-50 text-red-800 border-red-200" },
     };

     const cfg = statusConfig[interest.status];
     const StatusIcon = cfg.icon;
     const company = interest.company;

     const offerTypeLabel: Record<string, string> = {
          WORK_TASK: "Work Task",
          MATERIAL_SUPPLY: "Material Supply",
          EQUIPMENT_RENTAL: "Equipment Rental",
          CONSULTANCY: "Consultancy",
          SUBCONTRACTING: "Subcontracting",
          MAINTENANCE: "Maintenance",
     };

     return (
          <div
               className={`bg-white rounded-2xl border-2 transition-all ${interest.viewedByOwner ? "border-gray-200" : "border-yellow-400 shadow-md"}`}
               onMouseEnter={markViewed}
          >
               {/* Unread indicator strip */}
               {!interest.viewedByOwner && (
                    <div className="h-1 w-full bg-yellow-400 rounded-t-2xl" />
               )}

               <div className="p-5 sm:p-6">
                    {/* Top row */}
                    <div className="flex items-start gap-4">
                         {/* Company Logo */}
                         <div className="w-12 h-12 rounded-xl border-2 border-gray-200 bg-gray-50 flex items-center justify-center shrink-0 overflow-hidden">
                              {company?.logoUrl ? (
                                   <Image src={company.logoUrl} alt={company.name} width={48} height={48} className="object-cover w-full h-full" />
                              ) : (
                                   <Building2 className="w-6 h-6 text-gray-400" />
                              )}
                         </div>

                         {/* Company Name + meta */}
                         <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 flex-wrap">
                                   <div>
                                        <p className="font-black text-gray-900 text-base leading-tight">
                                             {company?.name ?? "Unknown Company"}
                                        </p>
                                        {company?.location && (
                                             <p className="text-xs text-gray-500 mt-0.5">
                                                  {[company.location.city, company.location.country].filter(Boolean).join(", ")}
                                             </p>
                                        )}
                                   </div>
                                   {/* Status badge */}
                                   <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-bold ${cfg.color}`}>
                                        <StatusIcon className="w-3.5 h-3.5" />
                                        {cfg.label}
                                   </div>
                              </div>

                              {/* Verification badges */}
                              {company?.verification && (
                                   <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                                        {company.verification.status === "VERIFIED" && (
                                             <span className="flex items-center gap-1 text-xs font-bold text-green-700">
                                                  <CheckCircle2 className="w-3 h-3" /> Verified
                                             </span>
                                        )}
                                        {company.verification.isGoldVerified && <Badge className="bg-yellow-400 text-gray-900 hover:bg-yellow-400 text-[10px] font-bold px-1.5 py-0">GOLD</Badge>}
                                        {company.verification.isSilverVerified && <Badge className="bg-gray-300 text-gray-900 hover:bg-gray-300 text-[10px] font-bold px-1.5 py-0">SILVER</Badge>}
                                        {company.verification.isBronzeVerified && <Badge className="bg-orange-200 text-orange-900 hover:bg-orange-200 text-[10px] font-bold px-1.5 py-0">BRONZE</Badge>}
                                   </div>
                              )}
                         </div>

                         {/* Unread eye icon */}
                         {!interest.viewedByOwner ? (
                              <div className="shrink-0 p-1.5 bg-yellow-100 rounded-lg" title="New – not yet reviewed">
                                   <Eye className="w-4 h-4 text-yellow-600" />
                              </div>
                         ) : (
                              <div className="shrink-0 p-1.5 bg-gray-100 rounded-lg" title="Reviewed">
                                   <EyeOff className="w-4 h-4 text-gray-400" />
                              </div>
                         )}
                    </div>

                    <Separator className="my-4" />

                    {/* Offer + Message */}
                    <div className="space-y-3">
                         {/* Offer context */}
                         <div className="flex items-center gap-2 flex-wrap">
                              <div className="flex items-center gap-1.5 text-xs text-gray-600 bg-gray-100 px-2.5 py-1 rounded-lg font-medium">
                                   <HardHat className="w-3.5 h-3.5" />
                                   {interest.offer.category?.name}
                              </div>
                              <div className="text-xs text-gray-500 bg-gray-50 px-2.5 py-1 rounded-lg font-medium border border-gray-200">
                                   {offerTypeLabel[interest.offer.type] ?? interest.offer.type}
                              </div>
                         </div>

                         {/* Interest Message */}
                         <div className="bg-gray-50 rounded-xl p-4">
                              <div className="flex items-center gap-2 mb-2">
                                   <MessageSquare className="w-4 h-4 text-gray-400" />
                                   <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Proposal Message</span>
                              </div>
                              <p className="text-sm text-gray-700 leading-relaxed">{interest.message}</p>
                         </div>

                         {/* Dates */}
                         <div className="flex items-center gap-4 text-xs text-gray-500 flex-wrap">
                              <span className="flex items-center gap-1">
                                   <Calendar className="w-3.5 h-3.5" />
                                   Submitted {new Date(interest.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
                              </span>
                              {interest.respondedAt && (
                                   <span className="flex items-center gap-1">
                                        <Clock className="w-3.5 h-3.5" />
                                        Responded {new Date(interest.respondedAt).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
                                   </span>
                              )}
                         </div>
                    </div>

                    <Separator className="my-4" />

                    {/* Action Row */}
                    <div className="flex items-center gap-2 flex-wrap">
                         {/* Always: view company */}
                         {company && (
                              <CompanyViewBtn companyId={company.id} companyName={company.name} />
                         )}

                         {/* Pending actions */}
                         {interest.status === "PENDING" && (
                              <>
                                   <button
                                        onClick={() => handleStatusUpdate("ACCEPTED")}
                                        disabled={updating}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all disabled:opacity-50"
                                   >
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                        Accept
                                   </button>
                                   <button
                                        onClick={() => handleStatusUpdate("REJECTED")}
                                        disabled={updating}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-red-100 hover:bg-red-200 text-red-800 rounded-lg transition-all disabled:opacity-50"
                                   >
                                        <XCircle className="w-3.5 h-3.5" />
                                        Decline
                                   </button>
                              </>
                         )}

                         {/* Accepted: Deal Room CTA */}
                         {interest.status === "ACCEPTED" && (
                              <button
                                   onClick={() => onDealRoom?.(interest.id)}
                                   className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-lg transition-all"
                              >
                                   <Handshake className="w-3.5 h-3.5" />
                                   Open Deal Room
                              </button>
                         )}
                    </div>
               </div>
          </div>
     );
};
