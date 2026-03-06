"use client";

import Link from "next/link";
import { TSentOfferInterest } from "@/types/offer/offer-interest";
import {
     Building2, Calendar, DollarSign, MapPin, MessageSquare,
     Clock, CheckCircle2, XCircle, HardHat, Handshake, ArrowUpRight, Eye
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Image from "../ui/Image";

interface SentInterestCardProps {
     interest: TSentOfferInterest;
     onJoinDealRoom?: (interestId: string) => void;
}

export const SentInterestCard = ({ interest, onJoinDealRoom }: SentInterestCardProps) => {
     const offer = interest.offer;
     const company = offer.company;

     const statusConfig = {
          PENDING:  { label: "Awaiting Response", icon: Clock,        color: "bg-amber-50 text-amber-800 border-amber-200" },
          ACCEPTED: { label: "Accepted",            icon: CheckCircle2, color: "bg-green-50 text-green-800 border-green-200" },
          REJECTED: { label: "Declined",            icon: XCircle,     color: "bg-red-50 text-red-800 border-red-200" },
     };

     const cfg = statusConfig[interest.status];
     const StatusIcon = cfg.icon;

     const offerTypeLabel: Record<string, string> = {
          WORK_TASK: "Work Task",
          MATERIAL_SUPPLY: "Material Supply",
          EQUIPMENT_RENTAL: "Equipment Rental",
          CONSULTANCY: "Consultancy",
          SUBCONTRACTING: "Subcontracting",
          MAINTENANCE: "Maintenance",
     };

     const priorityColor: Record<string, string> = {
          URGENT: "text-red-600 bg-red-50 border-red-200",
          HIGH:   "text-orange-600 bg-orange-50 border-orange-200",
          MEDIUM: "text-yellow-700 bg-yellow-50 border-yellow-200",
          LOW:    "text-blue-600 bg-blue-50 border-blue-200",
     };

     const formatBudget = () => {
          if (!offer.pricing) return null;
          const { budgetMin, budgetMax, currency } = offer.pricing;
          const curr = currency || "USD";
          if (budgetMin && budgetMax) return `${curr} ${Number(budgetMin).toLocaleString()} – ${Number(budgetMax).toLocaleString()}`;
          if (budgetMin) return `From ${curr} ${Number(budgetMin).toLocaleString()}`;
          if (budgetMax) return `Up to ${curr} ${Number(budgetMax).toLocaleString()}`;
          return null;
     };

     const deadlineText = () => {
          if (!offer.timeline?.deadline) return null;
          const days = Math.ceil((new Date(offer.timeline.deadline).getTime() - Date.now()) / 86400000);
          if (days < 0) return { text: "Expired", color: "text-red-600" };
          if (days === 0) return { text: "Due today", color: "text-orange-600" };
          return { text: `${days}d left`, color: days <= 7 ? "text-orange-600" : "text-gray-600" };
     };

     const deadline = deadlineText();
     const budget = formatBudget();

     return (
          <div className={`bg-white rounded-2xl border-2 transition-all hover:shadow-md ${
               interest.status === "ACCEPTED" ? "border-green-300" :
               interest.status === "REJECTED" ? "border-red-200" :
               "border-gray-200"
          }`}>
               {/* Accent strip for accepted */}
               {interest.status === "ACCEPTED" && <div className="h-1 w-full bg-green-500 rounded-t-2xl" />}

               <div className="p-5 sm:p-6">
                    {/* Offer Info Header */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                         <div className="flex-1 min-w-0">
                              <Link
                                   href={`/offer/${offer.id}`}
                                   className="font-black text-gray-900 hover:text-yellow-600 transition-colors text-base leading-tight flex items-start gap-1 group"
                              >
                                   <span className="line-clamp-2">{offer.title}</span>
                                   <ArrowUpRight className="w-4 h-4 shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </Link>
                              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                   <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded font-medium">
                                        {offerTypeLabel[offer.type] ?? offer.type}
                                   </span>
                                   {offer.priority && (
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded border ${priorityColor[offer.priority]}`}>
                                             {offer.priority}
                                        </span>
                                   )}
                                   <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-bold ${cfg.color}`}>
                                        <StatusIcon className="w-3.5 h-3.5" />
                                        {cfg.label}
                                   </div>
                              </div>
                         </div>
                    </div>

                    {/* Offer Owner */}
                    {company && (
                         <div className="flex items-center gap-2.5 mb-4">
                              <div className="w-8 h-8 rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center shrink-0 overflow-hidden">
                                   {company.logoUrl ? (
                                        <Image src={company.logoUrl} alt={company.name} width={32} height={32} className="object-cover w-full h-full" />
                                   ) : (
                                        <Building2 className="w-4 h-4 text-gray-400" />
                                   )}
                              </div>
                              <div className="flex-1 min-w-0">
                                   <p className="text-sm font-bold text-gray-800 truncate">{company.name}</p>
                                   <div className="flex items-center gap-1 mt-0.5 flex-wrap">
                                        {company.verification?.status === "VERIFIED" && (
                                             <span className="flex items-center gap-0.5 text-[10px] font-bold text-green-700">
                                                  <CheckCircle2 className="w-2.5 h-2.5" /> Verified
                                             </span>
                                        )}
                                        {company.verification?.isGoldVerified && <Badge className="bg-yellow-400 text-gray-900 hover:bg-yellow-400 text-[10px] font-bold px-1.5 py-0">GOLD</Badge>}
                                        {company.verification?.isSilverVerified && <Badge className="bg-gray-300 text-gray-900 hover:bg-gray-300 text-[10px] font-bold px-1.5 py-0">SILVER</Badge>}
                                        {company.verification?.isBronzeVerified && <Badge className="bg-orange-200 text-orange-900 hover:bg-orange-200 text-[10px] font-bold px-1.5 py-0">BRONZE</Badge>}
                                   </div>
                              </div>
                         </div>
                    )}

                    {/* Key Metrics */}
                    <div className="grid grid-cols-2 gap-2 mb-4">
                         {budget && (
                              <div className="flex items-center gap-2 p-2.5 bg-yellow-50 rounded-xl">
                                   <DollarSign className="w-3.5 h-3.5 text-yellow-600 shrink-0" />
                                   <div>
                                        <p className="text-[10px] text-gray-500">Budget</p>
                                        <p className="text-xs font-bold text-gray-900 leading-tight">{budget}</p>
                                   </div>
                              </div>
                         )}
                         {deadline && (
                              <div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-xl">
                                   <Calendar className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                                   <div>
                                        <p className="text-[10px] text-gray-500">Deadline</p>
                                        <p className={`text-xs font-bold leading-tight ${deadline.color}`}>{deadline.text}</p>
                                   </div>
                              </div>
                         )}
                         {offer.siteLocation && (
                              <div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-xl col-span-2">
                                   <MapPin className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                                   <p className="text-xs text-gray-700 font-medium">
                                        {[offer.siteLocation.city, offer.siteLocation.country].filter(Boolean).join(", ")}
                                   </p>
                              </div>
                         )}
                    </div>

                    {/* My Message */}
                    <div className="bg-gray-50 rounded-xl p-3 mb-4">
                         <div className="flex items-center gap-2 mb-1.5">
                              <MessageSquare className="w-3.5 h-3.5 text-gray-400" />
                              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Your Proposal</span>
                         </div>
                         <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">{interest.message}</p>
                    </div>

                    {/* Category */}
                    {offer.category && (
                         <div className="flex items-center gap-1.5 text-xs text-gray-600 bg-gray-100 px-2.5 py-1 rounded-lg font-medium w-fit mb-4">
                              <HardHat className="w-3.5 h-3.5" />
                              {offer.category.name}
                         </div>
                    )}

                    <Separator className="mb-4" />

                    {/* Footer */}
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                         <span className="text-xs text-gray-400 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              Sent {new Date(interest.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
                         </span>

                         <div className="flex items-center gap-2">
                              {/* View Offer */}
                              <Link
                                   href={`/offer/${offer.id}`}
                                   className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold border border-gray-300 hover:border-yellow-400 hover:bg-yellow-50 text-gray-700 rounded-lg transition-all"
                              >
                                   <Eye className="w-3.5 h-3.5" />
                                   View Offer
                              </Link>

                              {/* Deal Room - only when accepted */}
                              {interest.status === "ACCEPTED" && (
                                   <button
                                        onClick={() => onJoinDealRoom?.(interest.id)}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-lg transition-all"
                                   >
                                        <Handshake className="w-3.5 h-3.5" />
                                        Join Deal Room
                                   </button>
                              )}
                         </div>
                    </div>
               </div>
          </div>
     );
};
